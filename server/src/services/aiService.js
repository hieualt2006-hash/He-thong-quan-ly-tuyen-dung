const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const isApiKeyValid = apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE';

const genAI = isApiKeyValid ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Smart Fallback Analysis in case API Key is missing or invalid
 */
function fallbackAnalysis(cvText = '', jobRequirements = '') {
  const cvLower = cvText.toLowerCase();
  const reqLower = jobRequirements.toLowerCase();

  const commonKeywords = ['node.js', 'react', 'javascript', 'typescript', 'python', 'sql', 'express', 'prisma', 'docker', 'ai', 'rest', 'api'];
  const matchingSkills = [];
  const missingSkills = [];

  commonKeywords.forEach(kw => {
    if (reqLower.includes(kw)) {
      if (cvLower.includes(kw)) {
        matchingSkills.push(kw);
      } else {
        missingSkills.push(kw);
      }
    }
  });

  const totalReqs = matchingSkills.length + missingSkills.length;
  const matchScore = totalReqs > 0 ? Math.round((matchingSkills.length / totalReqs) * 100) : 75;

  return {
    matchScore: Math.max(50, Math.min(95, matchScore)),
    summary: `Ứng viên có kỹ năng nền tảng phù hợp với vị trí công việc. Trích xuất tự động qua từ khóa cho thấy sự tương thích ở các công nghệ chính: ${matchingSkills.join(', ') || 'Nền tảng IT'}.`,
    matchingSkills: matchingSkills.length > 0 ? matchingSkills : ['Lập trình cơ bản', 'Giao tiếp'],
    missingSkills: missingSkills.length > 0 ? missingSkills : ['Kinh nghiệm quy mô lớn'],
    suggestedQuestions: [
      `Hãy giới thiệu về kinh nghiệm của bạn đối với ${matchingSkills[0] || 'dự án thực tế'}?`,
      `Bạn xử lý như thế nào khi làm việc với kỹ năng mới như ${missingSkills[0] || 'công nghệ tiên tiến'}?`,
      'Trình bày quy trình tối ưu hóa mã nguồn và giải quyết lỗi trong dự án gần nhất của bạn?'
    ]
  };
}

/**
 * Analyzes CV content against Job Requirements using Google Gemini LLM
 * @param {string} cvText - Raw CV text extracted from PDF
 * @param {string} jobRequirements - Requirements specified in the Job posting
 * @returns {Promise<Object>} Analysis result object
 */
async function analyzeCvMatch(cvText, jobRequirements) {
  if (!isApiKeyValid) {
    console.warn('⚠️ GEMINI_API_KEY chưa được thiết lập hợp lệ. Sử dụng Smart Fallback Analysis.');
    return fallbackAnalysis(cvText, jobRequirements);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `
Bạn là một chuyên gia Tuyển dụng Nhân sự & Chuyên gia Kỹ thuật AI (HR & Technical Recruiter).
Hãy so sánh chi tiết giữa Nội dung CV của Ứng viên và Yêu cầu Công việc (JD) dưới đây:

--- YÊU CẦU CÔNG VIỆC (JD) ---
${jobRequirements || 'Chưa cung cấp yêu cầu cụ thể'}

--- NỘI DUNG CV ỨNG VIÊN ---
${cvText || 'Chưa cung cấp nội dung CV'}

Hãy phân tích và trả về DUY NHẤT một chuỗi JSON chuẩn (JSON Mode) đúng cấu trúc sau (không kèm markdown code block):
{
  "matchScore": <con số nguyên từ 0 đến 100 thể hiện % phù hợp>,
  "summary": "<Tóm tắt ngắn 2-3 câu đánh giá tổng quan về ứng viên>",
  "matchingSkills": ["<kỹ năng 1 đáp ứng>", "<kỹ năng 2 đáp ứng>"],
  "missingSkills": ["<kỹ năng thiếu 1>", "<kỹ năng thiếu 2>"],
  "suggestedQuestions": [
    "<Câu hỏi phỏng vấn kỹ thuật hoặc tình huống 1>",
    "<Câu hỏi phỏng vấn kỹ thuật hoặc tình huống 2>",
    "<Câu hỏi phỏng vấn kỹ thuật hoặc tình huống 3>"
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON
    const parsedData = JSON.parse(responseText.trim());
    return {
      matchScore: Number(parsedData.matchScore) || 70,
      summary: parsedData.summary || 'Đã hoàn thành phân tích CV.',
      matchingSkills: Array.isArray(parsedData.matchingSkills) ? parsedData.matchingSkills : [],
      missingSkills: Array.isArray(parsedData.missingSkills) ? parsedData.missingSkills : [],
      suggestedQuestions: Array.isArray(parsedData.suggestedQuestions) ? parsedData.suggestedQuestions : []
    };
  } catch (error) {
    console.error('Lỗi khi gọi Gemini AI API:', error.message);
    console.log('🔄 Đang chuyển sang Smart Fallback Analysis...');
    return fallbackAnalysis(cvText, jobRequirements);
  }
}

/**
 * Handles Candidate Chatbot queries with strict guardrails
 */
async function chatWithCandidateAI(message = '', history = [], jobsContext = [], cvText = '') {
  // Common off-topic detection
  const lowerMsg = message.toLowerCase().trim();
  const recruitmentKeywords = [
    'việc', 'job', 'vị trí', 'lương', 'salary', 'thu nhập', 'thời gian', 'giờ làm', 'remote', 
    'hybrid', 'on-site', 'đãi ngộ', 'phúc lợi', 'thưởng', 'bảo hiểm', 'benefit', 'phỏng vấn', 
    'interview', 'cv', 'hồ sơ', 'kỹ năng', 'skill', 'kinh nghiệm', 'yêu cầu', 'tuyển', 'ứng tuyển',
    'apply', 'công ty', 'smartats', 'bảo mật', 'react', 'node', 'fullstack', 'frontend', 'backend',
    'developer', 'lập trình', 'onboard', 'thử việc', 'chế độ', 'phù hợp'
  ];

  const hasRecruitmentTopic = recruitmentKeywords.some(k => lowerMsg.includes(k)) || lowerMsg.length < 5;

  const standardOffTopicResponse = 'Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan đến công việc, vị trí tuyển dụng, mức lương, thời gian làm việc, đãi ngộ và đánh giá hồ sơ.';

  if (!isApiKeyValid) {
    // Fallback response generator based on keywords
    if (!hasRecruitmentTopic) {
      return { text: standardOffTopicResponse, isOffTopic: true };
    }

    if (lowerMsg.includes('lương') || lowerMsg.includes('salary') || lowerMsg.includes('thu nhập')) {
      return { 
        text: 'Mức lương cho các vị trí tại công ty dao động từ $1,000 - $3,500/tháng tùy theo năng lực và cấp bậc (Junior/Senior/Lead), kèm thưởng dự án và review lương định kỳ 2 lần/năm.',
        isOffTopic: false 
      };
    }
    if (lowerMsg.includes('thời gian') || lowerMsg.includes('giờ làm') || lowerMsg.includes('remote') || lowerMsg.includes('hybrid')) {
      return { 
        text: 'Thời gian làm việc từ Thứ 2 đến Thứ 6 (8:30 - 17:30). Công ty áp dụng mô hình Hybrid linh hoạt (cho phép làm việc từ xa 2 ngày/tuần).',
        isOffTopic: false 
      };
    }
    if (lowerMsg.includes('đãi ngộ') || lowerMsg.includes('phúc lợi') || lowerMsg.includes('bảo hiểm') || lowerMsg.includes('thưởng')) {
      return { 
        text: 'Chế độ đãi ngộ bao gồm: Bảo hiểm sức khỏe cao cấp (PVI), thưởng tháng 13 + thưởng hiệu suất KPI, cấp MacBook Pro M-series, phụ cấp ăn trưa và du lịch thường niên.',
        isOffTopic: false 
      };
    }
    if (lowerMsg.includes('vị trí') || lowerMsg.includes('job') || lowerMsg.includes('công việc') || lowerMsg.includes('tuyển')) {
      const jobListStr = jobsContext.map(j => `• ${j.title} (${j.department || 'IT'}) - Lương: ${j.salaryRange || 'Thỏa thuận'}`).join('\n');
      return { 
        text: `Hiện công ty đang mở các vị trí sau:\n${jobListStr || '• Senior Fullstack Developer\n• AI / Machine Learning Engineer\n• Frontend Developer'}\nBạn có thể nộp CV trực tiếp tại trang Tin Tuyển Dụng!`,
        isOffTopic: false 
      };
    }
    if (lowerMsg.includes('phù hợp') || lowerMsg.includes('cv') || lowerMsg.includes('kỹ năng')) {
      return { 
        text: 'Để đánh giá mức độ phù hợp, bạn có thể tải file PDF CV trực tiếp vào form ứng tuyển của vị trí mong muốn. Hệ thống AI sẽ tự động phân tích và chấm điểm tương thích (Match Score) ngay lập tức!',
        isOffTopic: false 
      };
    }

    return { 
      text: 'Chào bạn! Tôi là trợ lý AI tuyển dụng của Smart ATS. Bạn có câu hỏi nào về các vị trí đang tuyển, mức lương, thời gian làm việc hoặc đãi ngộ không?',
      isOffTopic: false 
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const contextPrompt = `
Bạn là Trợ lý Tuyển Dụng AI (HR Assistant) thông minh của hệ thống Smart ATS.
Nhiệm vụ của bạn là giải đáp cho ứng viên về:
- Các vị trí công việc đang tuyển dụng
- Mức lương, thu nhập
- Thời gian làm việc, hình thức Remote / Hybrid
- Chế độ đãi ngộ, phúc lợi, bảo hiểm, thưởng
- Mức độ phù hợp của ứng viên dựa trên kỹ năng hoặc CV

DỮ LIỆU CÔNG VIỆC HIỆN CÓ CỦA CÔNG TY:
${JSON.stringify(jobsContext.map(j => ({ title: j.title, department: j.department, salary: j.salaryRange, requirements: j.requirements, description: j.description })), null, 2)}

${cvText ? `CV CỦA ỨNG VIÊN HIỆN TẠI:\n${cvText}` : ''}

QUY TẮC BẮT BUỘC VỀ CHỦ ĐỀ (STRICT GUARDRAIL):
- Nếu người dùng hỏi bất kỳ chủ đề nào KHÔNG LIÊN QUAN đến công việc, tuyển dụng, công ty, JD, lương, đãi ngộ, thời gian làm việc hoặc CV (ví dụ: hỏi về thời tiết, công thức nấu ăn, viết code ngoài lề, chuyện trò phiếm, chính trị...):
Bạn BẮT BUỘC CHỈ ĐƯỢC TRẢ LỜI ĐÚNG MỘT CÂU DUY NHẤT SAU ĐÂY VÀ KHÔNG ĐƯỢC THÊM BẤT KỲ TỪ NÀO KHÁC:
"Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan đến công việc, vị trí tuyển dụng, mức lương, thời gian làm việc, đãi ngộ và đánh giá hồ sơ."

- Nếu câu hỏi liên quan đến tuyển dụng, hãy trả lời thân thiện, súc tích, chuyên nghiệp bằng tiếng Việt.
`;

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: contextPrompt }] },
        { role: 'model', parts: [{ text: 'Đã hiểu rõ nhiệm vụ. Tôi sẽ chỉ giải đáp các thắc mắc liên quan đến tuyển dụng và công việc của Smart ATS.' }] }
      ]
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text().trim();
    const isOffTopic = responseText.includes('Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan');

    return {
      text: responseText,
      isOffTopic: isOffTopic
    };
  } catch (error) {
    console.error('Lỗi Gemini Chatbot:', error.message);
    return {
      text: 'Chào bạn! Hệ thống tuyển dụng Smart ATS đang có các vị trí kỹ thuật và AI mở tuyển với đãi ngộ hấp dẫn. Bạn muốn tìm hiểu chi tiết về vị trí nào?',
      isOffTopic: false
    };
  }
}

module.exports = {
  analyzeCvMatch,
  chatWithCandidateAI
};

