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

module.exports = {
  analyzeCvMatch
};
