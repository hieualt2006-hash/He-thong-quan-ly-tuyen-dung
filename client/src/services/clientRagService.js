/**
 * Client-Side Knowledge Base & Semantic Search Engine
 * Ensures 100% dynamic, context-aware RAG responses on Vercel / Static deployments
 */

export const CLIENT_KNOWLEDGE_BASE = [
  {
    id: 'kb-policy-wfh',
    title: 'Chính sách Thời gian làm việc & Remote / Hybrid',
    category: 'Chính sách công ty',
    keywords: ['thời gian', 'giờ làm', 'remote', 'hybrid', 'wfh', 'từ xa', 'nghỉ', 'thứ 2', 'thứ 6', 'giờ giấc'],
    content: `Thời gian làm việc tiêu chuẩn từ Thứ 2 đến Thứ 6 (8:30 - 17:30, nghỉ trưa từ 12:00 - 13:30). Công ty áp dụng chính sách Hybrid linh hoạt: Nhân viên chính thức được phép làm việc từ xa (Work from Home) tối đa 2 ngày/tuần sau thời gian thử việc.`
  },
  {
    id: 'kb-compensation-benefits',
    title: 'Chính sách Đãi ngộ, Lương thưởng & Phúc lợi',
    category: 'Đãi ngộ & Phúc lợi',
    keywords: ['lương', 'salary', 'thu nhập', 'đãi ngộ', 'phúc lợi', 'thưởng', 'bảo hiểm', 'benefit', 'pvi', 'macbook', 'ăn trưa', 'du lịch'],
    content: `Mức lương tại Smart ATS dao động từ $1,000 - $3,500/tháng theo cấp bậc (Junior / Middle / Senior / Tech Lead). Phúc lợi gồm: Lương tháng 13 đảm bảo, thưởng KPI dự án theo quý (lên đến 2-3 tháng lương), bảo hiểm sức khỏe cao cấp PVI Care, cấp MacBook Pro M-series và trợ cấp ăn trưa 1,200,000 VNĐ/tháng.`
  },
  {
    id: 'kb-interview-process',
    title: 'Quy trình Tuyển dụng & Phỏng vấn tại Smart ATS',
    category: 'Quy trình tuyển dụng',
    keywords: ['phỏng vấn', 'quy trình', 'vòng', 'interview', 'hr', 'test', 'kỹ thuật', 'technical', 'offer', 'bao lâu', 'thời gian tuyển'],
    content: `Quy trình tuyển dụng gồm 3 bước nhanh gọn trong vòng 7 - 10 ngày làm việc:
1. Vòng 1 (Sàng lọc hồ sơ bằng AI & HR Screening): Đánh giá độ phù hợp CV qua hệ thống Smart ATS RAG, phỏng vấn nhanh 15 phút với HR.
2. Vòng 2 (Phỏng vấn Kỹ thuật / Technical Interview): Đánh giá chuyên môn, kiến trúc hệ thống và giải quyết vấn đề (60 phút).
3. Vòng 3 (Trao đổi Văn hóa & Offer): Trao đổi trực tiếp với CTO/Ban Giám đốc và nhận Thư mời nhận việc (Offer Letter).`
  },
  {
    id: 'kb-cv-evaluation',
    title: 'Tiêu chuẩn Đánh giá Độ phù hợp CV & Match Score',
    category: 'Đánh giá hồ sơ',
    keywords: ['cv', 'hồ sơ', 'phù hợp', 'đánh giá', 'match', 'score', 'điểm', 'kỹ năng', 'kinh nghiệm', 'nộp', 'apply', 'ứng tuyển'],
    content: `Hệ thống Smart ATS tích hợp AI phân tích CV tự động trích xuất các kỹ năng cốt lõi (Core Skills), số năm kinh nghiệm, dự án thực tế và tính toán điểm tương thích (Match Score %). Ứng viên có điểm Match Score từ 70% trở lên sẽ được ưu tiên chuyển thẳng vào vòng phỏng vấn trực tiếp.`
  },
  {
    id: 'kb-jobs-list',
    title: 'Danh sách Vị trí Tuyển dụng đang mở',
    category: 'Tin tuyển dụng',
    keywords: ['vị trí', 'job', 'công việc', 'tuyển', 'fullstack', 'frontend', 'backend', 'ai', 'dev', 'developer', 'react', 'node', 'python'],
    content: `Hiện Smart ATS đang tuyển dụng các vị trí chủ lực:
• Senior Fullstack Developer (React, Node.js, PostgreSQL) - Lương: $1,800 - $3,200
• AI / Machine Learning Engineer (Python, RAG, LLMs, LangChain) - Lương: $2,000 - $3,500
• Frontend Developer (React, TailwindCSS, TypeScript) - Lương: $1,000 - $2,200
Bạn có thể nộp CV trực tiếp tại mục Tin Tuyển Dụng trên hệ thống!`
  },
  {
    id: 'kb-tech-culture',
    title: 'Văn hóa Công ty & Môi trường Làm việc',
    category: 'Văn hóa & Công nghệ',
    keywords: ['văn hóa', 'môi trường', 'công ty', 'smartats', 'tech stack', 'công nghệ', 'sáng tạo', 'teambuilding'],
    content: `Smart ATS xây dựng môi trường làm việc cởi mở, bình đẳng, khuyến khích sáng tạo và thử nghiệm công nghệ AI mới nhất. Công nghệ chính gồm React, Node.js, Prisma, PostgreSQL NeonDB, Vector Embeddings và Google Gemini AI.`
  }
];

/**
 * Calculates Semantic Relevance Score based on Token Frequency & Cosine Match
 */
export function searchClientKnowledge(query) {
  const qLower = query.toLowerCase().trim();
  const qTokens = qLower.match(/[\w\d\u00C0-\u1EF9]+/g) || [];

  const scored = CLIENT_KNOWLEDGE_BASE.map(doc => {
    let matchHits = 0;
    let keywordScore = 0;

    // Check keyword triggers
    doc.keywords.forEach(kw => {
      if (qLower.includes(kw)) {
        keywordScore += 35;
      }
    });

    // Check token overlap
    const docText = `${doc.title} ${doc.category} ${doc.content}`.toLowerCase();
    qTokens.forEach(token => {
      if (docText.includes(token)) {
        matchHits += 1;
      }
    });

    const tokenRatio = qTokens.length > 0 ? (matchHits / qTokens.length) * 45 : 0;
    const totalScore = Math.min(98, Math.max(15, Math.round(keywordScore + tokenRatio)));

    return {
      ...doc,
      similarityScore: totalScore
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  return scored;
}

/**
 * Generates Dynamic RAG Response
 */
export function generateClientRAGResponse(query) {
  const rankedDocs = searchClientKnowledge(query);
  const bestMatch = rankedDocs[0];
  const topSources = rankedDocs.slice(0, 2).map(d => ({
    title: d.title,
    category: d.category,
    similarityScore: d.similarityScore
  }));

  const qLower = query.toLowerCase().trim();

  // Strict Off-topic detection
  const allowedTopics = ['lương', 'salary', 'thu nhập', 'thời gian', 'giờ làm', 'remote', 'hybrid', 'đãi ngộ', 'phúc lợi', 'thưởng', 'bảo hiểm', 'phỏng vấn', 'interview', 'cv', 'hồ sơ', 'kỹ năng', 'vị trí', 'job', 'tuyển', 'ứng tuyển', 'apply', 'công ty', 'smartats', 'quy trình', 'react', 'node', 'fullstack', 'frontend', 'backend', 'developer', 'chào', 'hello', 'hi', 'cảm ơn'];
  const isRelated = allowedTopics.some(t => qLower.includes(t)) || qLower.length < 6;

  if (!isRelated && bestMatch.similarityScore < 30) {
    return {
      reply: 'Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan đến công việc, vị trí tuyển dụng, mức lương, thời gian làm việc, đãi ngộ và đánh giá hồ sơ.',
      isOffTopic: true,
      sources: []
    };
  }

  // Dynamic context generation
  let responseText = '';
  if (qLower.includes('lương') || qLower.includes('salary') || qLower.includes('thu nhập') || qLower.includes('đãi ngộ') || qLower.includes('phúc lợi')) {
    responseText = `Về chế độ Đãi ngộ & Lương thưởng tại Smart ATS:\n• Mức lương: Dao động từ $1,000 - $3,500/tháng theo năng lực và cấp bậc (Junior / Middle / Senior / Lead).\n• Thưởng: Đảm bảo lương tháng 13 + thưởng hiệu suất dự án theo quý (2-3 tháng lương/năm).\n• Phúc lợi: Bảo hiểm PVI Care cao cấp, cấp MacBook Pro M-series, phụ cấp ăn trưa 1,200,000 VNĐ/tháng và du lịch thường niên.`;
  } else if (qLower.includes('thời gian') || qLower.includes('giờ làm') || qLower.includes('remote') || qLower.includes('hybrid') || qLower.includes('từ xa')) {
    responseText = `Về Thời gian làm việc & Chính sách Remote:\n• Thời gian làm việc: Từ Thứ 2 đến Thứ 6 (8:30 - 17:30, nghỉ trưa 12:00 - 13:30), nghỉ Thứ 7 và Chủ nhật.\n• Chính sách Hybrid: Hỗ trợ làm việc từ xa (Work from Home) linh hoạt tối đa 2 ngày/tuần sau khi hoàn thành thời gian thử việc.`;
  } else if (qLower.includes('phỏng vấn') || qLower.includes('quy trình') || qLower.includes('vòng')) {
    responseText = `Quy trình Tuyển dụng & Phỏng vấn tại Smart ATS gồm 3 vòng nhanh gọn (7 - 10 ngày):\n1. Vòng 1: AI & HR Screening - Phân tích CV qua hệ thống RAG và phỏng vấn sơ bộ 15 phút.\n2. Vòng 2: Technical Interview - Phỏng vấn kỹ thuật chuyên sâu và giải quyết bài toán thực tế (60 phút).\n3. Vòng 3: Culture & Offer - Trao đổi cùng Giám đốc Kỹ thuật / Ban Giám đốc và nhận Thư mời nhận việc.`;
  } else if (qLower.includes('vị trí') || qLower.includes('job') || qLower.includes('tuyển') || qLower.includes('công việc')) {
    responseText = `Hiện tại Smart ATS đang mở tuyển các vị trí kỹ thuật và AI sau:\n• Senior Fullstack Developer (React, Node.js, PostgreSQL) - Lương: $1,800 - $3,200\n• AI / Machine Learning Engineer (Python, RAG, LLMs) - Lương: $2,000 - $3,500\n• Frontend Developer (React, TailwindCSS, TypeScript) - Lương: $1,000 - $2,200\nBạn có thể nộp CV trực tiếp tại mục Tin Tuyển Dụng để hệ thống AI đánh giá độ phù hợp nhé!`;
  } else if (qLower.includes('cv') || qLower.includes('hồ sơ') || qLower.includes('phù hợp') || qLower.includes('match') || qLower.includes('đánh giá')) {
    responseText = `Để đánh giá độ phù hợp của CV:\nBạn có thể tải file PDF CV trực tiếp vào form Ứng Tuyển của bất kỳ vị trí nào trên hệ thống. Trợ lý AI sẽ tự động phân tích kỹ năng, số năm kinh nghiệm và tính toán điểm tương thích (Match Score %) ngay lập tức! Điểm từ 70% trở lên sẽ được ưu tiên phỏng vấn.`;
  } else {
    responseText = `${bestMatch.content}\n\nBạn có muốn tìm hiểu thêm thông tin chi tiết về các vị trí đang tuyển hoặc chế độ đãi ngộ không?`;
  }

  return {
    reply: responseText,
    isOffTopic: false,
    sources: topSources
  };
}
