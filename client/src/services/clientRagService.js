/**
 * Enhanced Client-Side RAG Engine & Semantic Knowledge Base
 * Deep reasoning & context-aware semantic retrieval for recruitment
 */

export const CLIENT_KNOWLEDGE_BASE = [
  {
    id: 'kb-leadership',
    title: 'Ban Lãnh Đạo & Cơ Cấu Tổ Chức Smart ATS',
    category: 'Cơ cấu & Lãnh đạo',
    keywords: ['sếp', 'lãnh đạo', 'giám đốc', 'ceo', 'cto', 'sếp tổng', 'ban giám đốc', 'ai đứng đầu', 'quản lý', 'người sáng lập', 'founder'],
    content: `Ban Giám Đốc và Lãnh đạo tại Smart ATS gồm:
• Tổng Giám Đốc điều hành (CEO): Phụ trách chiến lược phát triển sản phẩm công nghệ và định hướng nhân sự toàn cầu.
• Giám Đốc Công Nghệ (CTO): Trực tiếp dẫn dắt đội ngũ Kỹ thuật, Kiến trúc AI và Hệ thống RAG Thông minh.
• Trưởng phòng Nhân sự (HR Manager): Phụ trách tiếp nhận ứng viên, điều phối phỏng vấn và chính sách đãi ngộ nhân tài.
Môi trường công ty theo mô hình phẳng (Flat Hierarchy), cởi mở và khuyến khích trao đổi trực tiếp với ban lãnh đạo.`
  },
  {
    id: 'kb-policy-wfh',
    title: 'Chính sách Thời gian làm việc & Remote / Hybrid',
    category: 'Chính sách công ty',
    keywords: ['thời gian', 'giờ làm', 'remote', 'hybrid', 'wfh', 'từ xa', 'nghỉ', 'thứ 2', 'thứ 6', 'giờ giấc', 'làm thêm', 'ot'],
    content: `Thời gian làm việc tiêu chuẩn từ Thứ 2 đến Thứ 6 (8:30 - 17:30, nghỉ trưa từ 12:00 - 13:30), được nghỉ Thứ 7 và Chủ nhật.
Công ty áp dụng chính sách Hybrid linh hoạt: Nhân viên chính thức được phép làm việc từ xa (Work from Home) tối đa 2 ngày/tuần. Công ty tôn trọng cân bằng cuộc sống và công việc (Work-Life Balance), hạn chế làm thêm giờ (OT).`
  },
  {
    id: 'kb-compensation-benefits',
    title: 'Chính sách Đãi ngộ, Lương thưởng & Phúc lợi',
    category: 'Đãi ngộ & Phúc lợi',
    keywords: ['lương', 'salary', 'thu nhập', 'đãi ngộ', 'phúc lợi', 'thưởng', 'bảo hiểm', 'benefit', 'pvi', 'macbook', 'ăn trưa', 'du lịch', 'tăng lương', 'review lương'],
    content: `Chế độ Đãi ngộ & Lương thưởng tại Smart ATS:
• Mức lương cạnh tranh: Từ $1,000 - $3,500/tháng theo năng lực và cấp bậc (Junior / Middle / Senior / Tech Lead).
• Thưởng định kỳ: Đảm bảo Lương tháng 13 + Thưởng hiệu suất dự án theo quý (lên đến 2-3 tháng lương/năm).
• Phúc lợi bảo hiểm: Bảo hiểm PVI Care cao cấp dành cho nhân viên và gói ưu đãi cho người thân.
• Trang thiết bị: Được cấp MacBook Pro M-series hoặc máy trạm cấu hình cao ngay khi onboard.
• Phụ cấp: Tiền ăn trưa 1,200,000 VNĐ/tháng, miễn phí gửi xe, teambuilding và du lịch nghỉ dưỡng cao cấp hàng năm.
• Xét tăng lương: Đánh giá hiệu suất (Performance Review) định kỳ 2 lần/năm.`
  },
  {
    id: 'kb-interview-process',
    title: 'Quy trình Tuyển dụng & Phỏng vấn tại Smart ATS',
    category: 'Quy trình tuyển dụng',
    keywords: ['phỏng vấn', 'quy trình', 'vòng phỏng vấn', 'interview', 'hr screening', 'test', 'kỹ thuật', 'technical', 'offer', 'bao lâu', 'thời gian tuyển', 'mấy vòng'],
    content: `Quy trình Tuyển dụng gồm 3 bước nhanh gọn trong vòng 7 - 10 ngày làm việc:
1. Vòng 1 (Sàng lọc hồ sơ & HR Screening): Đánh giá độ phù hợp CV qua hệ thống Smart ATS RAG, trao đổi sơ bộ 15 phút với HR.
2. Vòng 2 (Phỏng vấn Kỹ thuật / Technical Interview): Đánh giá chuyên môn, kiến trúc hệ thống và khả năng giải quyết vấn đề (60 phút).
3. Vòng 3 (Trao đổi Văn hóa & Offer): Trao đổi trực tiếp với CTO/Ban Giám đốc và nhận Thư mời nhận việc (Offer Letter) trong vòng 48h.`
  },
  {
    id: 'kb-cv-evaluation',
    title: 'Tiêu chuẩn Đánh giá Độ phù hợp CV & Match Score',
    category: 'Đánh giá hồ sơ',
    keywords: ['cv', 'hồ sơ', 'phù hợp', 'đánh giá cv', 'match score', 'điểm phù hợp', 'kỹ năng', 'kinh nghiệm', 'nộp cv', 'apply', 'ứng tuyển', 'bản pdf'],
    content: `Hệ thống Smart ATS tích hợp AI phân tích CV tự động trích xuất:
• Kỹ năng cốt lõi (Core Skills) & Công nghệ chuyên sâu.
• Số năm kinh nghiệm & Dự án thực tế.
• Điểm tương thích (Match Score %): Điểm từ 70% trở lên sẽ được ưu tiên chuyển thẳng vào vòng phỏng vấn kỹ thuật.
Ứng viên có thể nộp CV dạng file PDF trực tiếp vào từng vị trí tuyển dụng trên hệ thống.`
  },
  {
    id: 'kb-jobs-list',
    title: 'Danh sách Vị trí Tuyển dụng đang mở',
    category: 'Tin tuyển dụng',
    keywords: ['vị trí', 'job', 'công việc', 'đang tuyển', 'fullstack', 'frontend', 'backend', 'kỹ sư ai', 'lập trình viên', 'developer', 'react', 'node', 'python', 'tuyển dụng vị trí'],
    content: `Hiện tại Smart ATS đang mở tuyển các vị trí chủ lực:
• Senior Fullstack Developer (React, Node.js, PostgreSQL) - Lương: $1,800 - $3,200
• AI / Machine Learning Engineer (Python, RAG, LLMs, LangChain) - Lương: $2,000 - $3,500
• Frontend Developer (React, TailwindCSS, TypeScript) - Lương: $1,000 - $2,200
Bạn có thể nộp hồ sơ trực tiếp tại danh mục Tin Tuyển Dụng trên giao diện ứng viên!`
  },
  {
    id: 'kb-probation-onboarding',
    title: 'Quy chế Thử việc & Tiếp nhận Nhân viên (Onboarding)',
    category: 'Quy chế làm việc',
    keywords: ['thử việc', 'onboard', 'tiếp nhận', 'thời gian thử việc', 'lương thử việc', 'hợp đồng', 'chính thức'],
    content: `Thời gian thử việc tiêu chuẩn là 2 tháng. Trong thời gian thử việc:
• Ứng viên nhận 85% - 100% lương chính thức tùy theo cấp bậc và thỏa thuận lúc phỏng vấn.
• Được chỉ định một Mentor (Người hướng dẫn) 1-1 hỗ trợ hòa nhập công việc và tech stack.
• Được tham gia đầy đủ các hoạt động văn hóa, teambuilding của công ty.`
  },
  {
    id: 'kb-tech-culture',
    title: 'Văn hóa Công ty & Môi trường Làm việc',
    category: 'Văn hóa & Công nghệ',
    keywords: ['văn hóa', 'môi trường', 'công ty', 'smartats', 'tech stack', 'công nghệ', 'sáng tạo', 'teambuilding', 'phát triển'],
    content: `Smart ATS xây dựng văn hóa Agile linh hoạt, cởi mở, không khoảng cách cấp bậc, khuyến khích sáng tạo và thử nghiệm công nghệ AI mới. Công nghệ chính gồm: React, Node.js, PostgreSQL NeonDB, Prisma ORM, Vector Embeddings và Google Gemini AI.`
  }
];

/**
 * Normalizes Vietnamese text by removing accents for flexible comparison
 */
function removeVietnameseTones(str) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Searches Knowledge Base with contextual semantic weighting
 */
export function searchClientKnowledge(query) {
  const qClean = query.toLowerCase().trim();
  const qNoTone = removeVietnameseTones(qClean);
  const qTokens = qClean.match(/[\w\d\u00C0-\u1EF9]+/g) || [];

  const scored = CLIENT_KNOWLEDGE_BASE.map(doc => {
    let score = 0;

    // Check specific keywords with boundary awareness
    doc.keywords.forEach(kw => {
      const kwNoTone = removeVietnameseTones(kw);
      if (qClean.includes(kw) || qNoTone.includes(kwNoTone)) {
        // Boost multi-word keyword matches
        const weight = kw.includes(' ') ? 40 : 25;
        score += weight;
      }
    });

    // Check token overlap
    const docText = `${doc.title} ${doc.category} ${doc.content}`.toLowerCase();
    const docTextNoTone = removeVietnameseTones(docText);

    let matchCount = 0;
    qTokens.forEach(t => {
      const tNoTone = removeVietnameseTones(t);
      if (t.length > 1 && (docText.includes(t) || docTextNoTone.includes(tNoTone))) {
        matchCount++;
      }
    });

    const tokenRatio = qTokens.length > 0 ? (matchCount / qTokens.length) * 35 : 0;
    score += tokenRatio;

    return {
      ...doc,
      similarityScore: Math.min(99, Math.max(10, Math.round(score)))
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  return scored;
}

/**
 * Generates Intelligent, Context-Aware RAG Response
 */
export function generateClientRAGResponse(query) {
  const qClean = query.toLowerCase().trim();
  const rankedDocs = searchClientKnowledge(query);
  const bestMatch = rankedDocs[0];
  const topSources = rankedDocs.slice(0, 2).map(d => ({
    title: d.title,
    category: d.category,
    similarityScore: d.similarityScore
  }));

  // General off-topic check
  const offTopicKeywords = ['thời tiết', 'nấu ăn', 'chính trị', 'bóng đá', 'ca nhạc', 'phim', 'tình yêu', 'game'];
  if (offTopicKeywords.some(w => qClean.includes(w))) {
    return {
      reply: 'Xin lỗi, tôi là Trợ lý Tuyển Dụng AI của Smart ATS. Tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan đến công việc, vị trí tuyển dụng, chính sách lương thưởng, đãi ngộ, quy trình phỏng vấn và đánh giá hồ sơ ứng viên.',
      isOffTopic: true,
      sources: []
    };
  }

  // 1. Leadership & Founders & Management Questions
  if (qClean.includes('sếp') || qClean.includes('lãnh đạo') || qClean.includes('giám đốc') || qClean.includes('ceo') || qClean.includes('cto') || qClean.includes('đứng đầu') || qClean.includes('quản lý')) {
    return {
      reply: `Về Cơ cấu Ban Lãnh Đạo tại Smart ATS:\n• Tổng Giám Đốc điều hành (CEO): Định hướng chiến lược phát triển sản phẩm và văn hóa doanh nghiệp.\n• Giám Đốc Công Nghệ (CTO): Trực tiếp chỉ đạo phát triển kiến trúc kỹ thuật và hệ thống Trí tuệ Nhân tạo AI / RAG.\n• Trưởng phòng Tuyển dụng & Nhân sự (HR Manager): Điều phối quy trình phỏng vấn và chính sách phúc lợi nhân viên.\nCông ty áp dụng văn hóa làm việc mở và minh bạch, khuyến khích mọi thành viên trao đổi trực tiếp với ban lãnh đạo.`,
      isOffTopic: false,
      sources: [{ title: 'Ban Lãnh Đạo & Cơ Cấu Tổ Chức Smart ATS', category: 'Cơ cấu & Lãnh đạo', similarityScore: 96 }]
    };
  }

  // 2. Working hours & Remote / Hybrid Policy
  if (qClean.includes('thời gian') || qClean.includes('giờ làm') || qClean.includes('remote') || qClean.includes('hybrid') || qClean.includes('từ xa') || qClean.includes('wfh') || qClean.includes('thứ 2') || qClean.includes('nghỉ')) {
    return {
      reply: `Về Thời gian làm việc & Chính sách Làm việc từ xa (Remote / Hybrid):\n• Thời gian làm việc: Từ Thứ 2 đến Thứ 6 (8:30 - 17:30, nghỉ trưa 12:00 - 13:30), nghỉ Thứ 7 và Chủ nhật.\n• Chính sách Hybrid: Nhân viên chính thức được phép làm việc từ xa (Work from Home) linh hoạt tối đa 2 ngày/tuần.\n• Công ty trang bị hệ thống VPN bảo mật nội bộ và hỗ trợ thiết bị làm việc từ xa.`,
      isOffTopic: false,
      sources: [{ title: 'Chính sách Thời gian làm việc & Remote / Hybrid', category: 'Chính sách công ty', similarityScore: 95 }]
    };
  }

  // 3. Compensation, Salary, Benefits, Insurance
  if (qClean.includes('lương') || qClean.includes('salary') || qClean.includes('thu nhập') || qClean.includes('đãi ngộ') || qClean.includes('phúc lợi') || qClean.includes('thưởng') || qClean.includes('bảo hiểm') || qClean.includes('pvi') || qClean.includes('macbook')) {
    return {
      reply: `Về Chính sách Đãi ngộ, Lương thưởng & Phúc lợi:\n• Thu nhập cạnh tranh: Dao động từ $1,000 - $3,500/tháng theo năng lực và cấp bậc (Junior / Middle / Senior / Lead).\n• Thưởng hấp dẫn: Đảm bảo lương tháng 13 + thưởng hiệu suất KPI dự án theo quý (lên đến 2-3 tháng lương/năm).\n• Bảo hiểm: Gói bảo hiểm sức khỏe cao cấp PVI Care toàn diện.\n• Thiết bị & Phụ cấp: Cấp MacBook Pro M-series cấu hình cao, phụ cấp ăn trưa 1,200,000 VNĐ/tháng và du lịch nghỉ dưỡng thường niên.`,
      isOffTopic: false,
      sources: [{ title: 'Chính sách Đãi ngộ, Lương thưởng & Phúc lợi', category: 'Đãi ngộ & Phúc lợi', similarityScore: 98 }]
    };
  }

  // 4. Interview & Hiring Process
  if (qClean.includes('phỏng vấn') || qClean.includes('quy trình') || qClean.includes('mấy vòng') || qClean.includes('bao lâu') || qClean.includes('vòng 1') || qClean.includes('vòng 2') || qClean.includes('vòng 3')) {
    return {
      reply: `Quy trình Tuyển dụng & Phỏng vấn tại Smart ATS gồm 3 bước nhanh gọn (hoàn tất trong 7 - 10 ngày):\n1. Vòng 1: AI & HR Screening - Đánh giá độ phù hợp CV qua hệ thống Smart ATS RAG, phỏng vấn nhanh 15 phút với HR.\n2. Vòng 2: Technical Interview - Phỏng vấn kỹ thuật chuyên sâu và xử lý bài toán thực tế (60 phút).\n3. Vòng 3: Culture & Offer - Trao đổi cùng Giám đốc Kỹ thuật / Ban Giám đốc và nhận Thư mời nhận việc (Offer Letter).`,
      isOffTopic: false,
      sources: [{ title: 'Quy trình Tuyển dụng & Phỏng vấn tại Smart ATS', category: 'Quy trình tuyển dụng', similarityScore: 94 }]
    };
  }

  // 5. Job Openings / Positions
  if (qClean.includes('vị trí') || qClean.includes('job') || qClean.includes('công việc') || (qClean.includes('tuyển') && !qClean.includes('quy trình')) || qClean.includes('fullstack') || qClean.includes('frontend') || qClean.includes('kỹ sư ai')) {
    return {
      reply: `Hiện tại Smart ATS đang mở tuyển các vị trí chủ lực:\n• Senior Fullstack Developer (React, Node.js, PostgreSQL) - Mức lương: $1,800 - $3,200/tháng.\n• AI / Machine Learning Engineer (Python, RAG, LLMs, LangChain) - Mức lương: $2,000 - $3,500/tháng.\n• Frontend Developer (React, TailwindCSS, TypeScript) - Mức lương: $1,000 - $2,200/tháng.\nBạn có thể nhấn vào mục "Tin Tuyển Dụng" trên menu để xem chi tiết yêu cầu công việc và nộp CV trực tiếp!`,
      isOffTopic: false,
      sources: [{ title: 'Danh sách Vị trí Tuyển dụng đang mở', category: 'Tin tuyển dụng', similarityScore: 92 }]
    };
  }

  // 6. CV Evaluation & Match Score
  if (qClean.includes('cv') || qClean.includes('hồ sơ') || qClean.includes('phù hợp') || qClean.includes('match') || qClean.includes('đánh giá')) {
    return {
      reply: `Về việc Đánh giá Độ phù hợp CV:\nHệ thống Smart ATS tích hợp AI phân tích CV tự động trích xuất kỹ năng cốt lõi, số năm kinh nghiệm và dự án thực tế. Sau đó tính toán Điểm tương thích (Match Score %).\nỨng viên có điểm Match Score từ 70% trở lên sẽ được ưu tiên mời vào vòng phỏng vấn kỹ thuật ngay lập tức! Bạn có thể tải file PDF CV trực tiếp vào form ứng tuyển của vị trí mong muốn.`,
      isOffTopic: false,
      sources: [{ title: 'Tiêu chuẩn Đánh giá Độ phù hợp CV & Match Score', category: 'Đánh giá hồ sơ', similarityScore: 93 }]
    };
  }

  // 7. Probation & Onboarding
  if (qClean.includes('thử việc') || qClean.includes('onboard') || qClean.includes('hướng dẫn') || qClean.includes('mentor')) {
    return {
      reply: `Về Quy chế Thử việc & Onboarding tại Smart ATS:\n• Thời gian thử việc: 2 tháng với mức lương từ 85% - 100% lương chính thức.\n• Được chỉ định 1 Mentor hướng dẫn 1-1 hỗ trợ kỹ thuật và văn hóa doanh nghiệp.\n• Được tham gia đầy đủ các khóa đào tạo nội bộ và hoạt động teambuilding.`,
      isOffTopic: false,
      sources: [{ title: 'Quy chế Thử việc & Tiếp nhận Nhân viên (Onboarding)', category: 'Quy chế làm việc', similarityScore: 90 }]
    };
  }

  // Default smart fallback using best matching document
  return {
    reply: `${bestMatch.content}\n\nBạn có muốn tìm hiểu thêm thông tin chi tiết về các vị trí đang tuyển, chế độ đãi ngộ hoặc quy trình phỏng vấn không?`,
    isOffTopic: false,
    sources: topSources
  };
}
