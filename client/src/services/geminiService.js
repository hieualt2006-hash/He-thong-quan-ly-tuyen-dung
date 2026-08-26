/**
 * Direct Google Gemini LLM Service for Client & Vercel
 * Calls Gemini 1.5 Flash directly with RAG Context & Multi-turn History
 */

import { CLIENT_KNOWLEDGE_BASE } from './clientRagService';

const SYSTEM_INSTRUCTION = `
Bạn là Trợ Lý Tuyển Dụng AI & Chuyên gia Tư Vấn Nghề Nghiệp Kỹ Thuật (Senior HR & Technical Recruiter AI) của hệ thống Smart ATS.
Bạn có khả năng tư vấn chuyên sâu, thông minh, lịch thiệp, thấu cảm và chuyên nghiệp.

DƯỚI ĐÂY LÀ TOÀN BỘ CƠ SỞ TRI THỨC VÀ CHÍNH SÁCH CỦA SMART ATS:
${CLIENT_KNOWLEDGE_BASE.map((doc, i) => `[Tài liệu ${i + 1}] ${doc.title} (${doc.category}):\n${doc.content}`).join('\n\n')}

QUY TẮC PHẢN HỒI:
1. QUY TẮC CHỦ ĐỀ NGHIÊM NGẶT (STRICT GUARDRAIL):
- Nếu người dùng hỏi các chủ đề hoàn toàn KHÔNG liên quan đến công việc, tuyển dụng, công nghệ, công ty, JD, lương, phúc lợi, phỏng vấn, hướng nghiệp hoặc CV (ví dụ: thời tiết, công thức nấu ăn, hỏi chuyện tình cảm cá nhân, game ngoài lề, chính trị...):
BẮT BUỘC CHỈ TRẢ LỜI ĐÚNG MỘT CÂU DUY NHẤT:
"Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan đến công việc, vị trí tuyển dụng, mức lương, thời gian làm việc, đãi ngộ và đánh giá hồ sơ."

2. TƯ VẤN SÂU SẮC & THÔNG MINH CHO MỌI CÂU HỎI LIÊN QUAN ĐẾN CÔNG VIỆC:
- Trả lời bằng tiếng Việt tự nhiên, gãy gọn, có chiều sâu và cấu trúc rõ ràng (dùng gạch đầu dòng, ví dụ cụ thể khi cần).
- Sẵn sàng giải đáp: đánh giá kỹ năng của ứng viên, định hướng học tập và nâng cao tay nghề để đáp ứng JD, bí quyết vượt qua các vòng phỏng vấn, tư vấn mức lương theo năng lực, giải thích chính sách làm việc WFH / Hybrid và văn hóa doanh nghiệp.
- Không bịa đặt các quyền lợi vượt ngoài cơ sở tri thức của Smart ATS.
`;

export async function callGeminiDirectAPI(message, history = [], userApiKey = '') {
  const apiKey = userApiKey || localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return null;
  }

  try {
    const formattedContents = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      {
        role: 'model',
        parts: [{ text: 'Tôi đã tiếp nhận toàn bộ Cơ sở tri thức của Smart ATS và các nguyên tắc tư vấn chuyên nghiệp. Tôi sẵn sàng giải đáp thấu đáo cho ứng viên.' }]
      }
    ];

    // Append conversation history
    history.slice(-6).forEach(h => {
      formattedContents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      });
    });

    // Append current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API returned error status:', response.status);
      return null;
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const trimmed = candidateText.trim();
    const isOffTopic = trimmed.includes('Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan');

    return {
      reply: trimmed,
      isOffTopic: isOffTopic
    };
  } catch (error) {
    console.error('Error calling Gemini direct API:', error);
    return null;
  }
}
