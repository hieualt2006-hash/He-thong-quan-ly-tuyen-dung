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
 * Handles Candidate Chatbot queries with strict guardrails and RAG context
 */
async function chatWithCandidateAI(message = '', history = [], jobsContext = [], cvText = '', retrievedSources = []) {
  // Common off-topic detection
  const lowerMsg = message.toLowerCase().trim();
  const recruitmentKeywords = [
    'việc', 'job', 'vị trí', 'lương', 'salary', 'thu nhập', 'thời gian', 'giờ làm', 'remote', 
    'hybrid', 'on-site', 'đãi ngộ', 'phúc lợi', 'thưởng', 'bảo hiểm', 'benefit', 'phỏng vấn', 
    'interview', 'cv', 'hồ sơ', 'kỹ năng', 'skill', 'kinh nghiệm', 'yêu cầu', 'tuyển', 'ứng tuyển',
    'apply', 'công ty', 'smartats', 'bảo mật', 'react', 'node', 'fullstack', 'frontend', 'backend',
    'developer', 'lập trình', 'onboard', 'thử việc', 'chế độ', 'phù hợp', 'chào', 'hello', 'hi',
    'cảm ơn', 'thanks', 'địa chỉ', 'văn phòng', 'jd', 'quy trình', 'thực tập', 'intern'
  ];

  const hasRecruitmentTopic = recruitmentKeywords.some(k => lowerMsg.includes(k)) || lowerMsg.length < 5;

  const standardOffTopicResponse = 'Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan đến công việc, vị trí tuyển dụng, mức lương, thời gian làm việc, đãi ngộ và đánh giá hồ sơ.';

  if (!isApiKeyValid) {
    // Fallback response generator based on keywords and RAG context
    if (!hasRecruitmentTopic) {
      return { text: standardOffTopicResponse, isOffTopic: true, sources: [] };
    }

    const matchedSource = retrievedSources[0] || null;
    let fallbackReply = 'Chào bạn! Hệ thống tuyển dụng Smart ATS đang có các vị trí kỹ thuật và AI mở tuyển với đãi ngộ cạnh tranh. Bạn muốn tìm hiểu chi tiết về vị trí hay chính sách nào?';

    if (matchedSource && matchedSource.content) {
      if (lowerMsg.includes('lương') || lowerMsg.includes('salary') || lowerMsg.includes('đãi ngộ') || lowerMsg.includes('phúc lợi')) {
        fallbackReply = `Theo chính sách đãi ngộ của Smart ATS: Mức lương dao động từ $1,000 - $3,500/tháng kèm lương tháng 13, thưởng dự án, bảo hiểm PVI Care và cấp MacBook Pro M-series.`;
      } else if (lowerMsg.includes('thời gian') || lowerMsg.includes('remote') || lowerMsg.includes('hybrid')) {
        fallbackReply = `Thời gian làm việc từ Thứ 2 - Thứ 6 (8:30 - 17:30). Công ty áp dụng chính sách Hybrid làm việc từ xa tối đa 2 ngày/tuần linh hoạt.`;
      } else if (lowerMsg.includes('phỏng vấn') || lowerMsg.includes('quy trình')) {
        fallbackReply = `Quy trình tuyển dụng gồm 3 vòng nhanh gọn: Vòng 1 (Sàng lọc CV AI & HR), Vòng 2 (Phỏng vấn Kỹ thuật Technical), Vòng 3 (Trao đổi Offer).`;
      } else if (lowerMsg.includes('vị trí') || lowerMsg.includes('job') || lowerMsg.includes('tuyển')) {
        const jobListStr = jobsContext.map(j => `• ${j.title} (${j.department || 'IT'}) - Lương: ${j.salaryRange || 'Thỏa thuận'}`).join('\n');
        fallbackReply = `Hiện công ty đang mở tuyển các vị trí sau:\n${jobListStr || '• Senior Fullstack Developer\n• AI Engineer'}\nBạn có thể nộp CV trực tiếp tại mục Tin Tuyển Dụng!`;
      }
    }

    return { 
      text: fallbackReply, 
      isOffTopic: false,
      sources: retrievedSources.map(s => ({
        title: s.title,
        category: s.category,
        similarityScore: s.similarityScore
      }))
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Format RAG Context retrieved from vector embeddings
    const ragContextStr = retrievedSources.map((s, idx) => `[Tài liệu ${idx + 1}] (${s.title} - Phân loại: ${s.category} - Độ khớp: ${s.similarityScore}%):\n${s.content}`).join('\n\n');

    const contextPrompt = `
Bạn là Trợ lý Tuyển Dụng AI (Smart ATS RAG Assistant) thông minh và chuyên nghiệp.
Nhiệm vụ của bạn là giải đáp cho ứng viên dựa trên CƠ SỞ TRI THỨC ĐƯỢC TRÍCH XUẤT TỰ ĐỘNG (RAG KNOWLEDGE RETRIEVAL):

=== CƠ SỞ TRI THỨC RAG ĐÃ TRÍCH XUẤT (TOP MATCHING DOCUMENTS) ===
${ragContextStr || 'Chưa có trích xuất ngữ cảnh bổ sung'}

${cvText ? `CV CỦA ỨNG VIÊN HIỆN TẠI:\n${cvText}` : ''}

QUY TẮC BẮT BUỘC VỀ CHỦ ĐỀ (STRICT GUARDRAIL):
1. Nếu người dùng hỏi bất kỳ chủ đề nào KHÔNG LIÊN QUAN đến tuyển dụng, công việc, đãi ngộ, quy trình phỏng vấn, chính sách công ty, hoặc CV (ví dụ: thời tiết, công thức nấu ăn, viết code ngoài lề, chuyện trò phiếm, chính trị...):
Bạn BẮT BUỘC CHỈ ĐƯỢC TRẢ LỜI ĐÚNG MỘT CÂU DUY NHẤT SAU ĐÂY VÀ KHÔNG ĐƯỢC THÊM BẤT KỲ TỪ NÀO KHÁC:
"Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan đến công việc, vị trí tuyển dụng, mức lương, thời gian làm việc, đãi ngộ và đánh giá hồ sơ."

2. Nếu câu hỏi liên quan đến tuyển dụng, hãy sử dụng thông tin trong CƠ SỞ TRI THỨC RAG ở trên để trả lời thật chính xác, nhiệt tình, lịch thiệp và súc tích bằng tiếng Việt.
`;

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: contextPrompt }] },
        { role: 'model', parts: [{ text: 'Đã nắm rõ cơ sở tri thức RAG và nguyên tắc phản hồi. Tôi sẵn sàng hỗ trợ ứng viên với độ chính xác cao.' }] }
      ]
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text().trim();
    const isOffTopic = responseText.includes('Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan');

    return {
      text: responseText,
      isOffTopic: isOffTopic,
      sources: isOffTopic ? [] : retrievedSources.map(s => ({
        title: s.title,
        category: s.category,
        similarityScore: s.similarityScore
      }))
    };
  } catch (error) {
    console.error('Lỗi Gemini Chatbot:', error.message);
    return {
      text: 'Chào bạn! Hệ thống tuyển dụng Smart ATS đang có các vị trí kỹ thuật và AI mở tuyển với đãi ngộ hấp dẫn. Bạn muốn tìm hiểu chi tiết về vị trí nào?',
      isOffTopic: false,
      sources: []
    };
  }
}

module.exports = {
  analyzeCvMatch,
  chatWithCandidateAI
};

