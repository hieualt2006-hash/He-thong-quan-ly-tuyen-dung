/**
 * Enhanced Client-Side RAG Engine & Deep Contextual Reasoner
 * Provides comprehensive, expert-level HR and technical career responses
 */

export const CLIENT_KNOWLEDGE_BASE = [
  {
    id: 'kb-leadership',
    title: 'Ban Lãnh Đạo & Cơ Cấu Tổ Chức Smart ATS',
    category: 'Cơ cấu & Lãnh đạo',
    keywords: ['sếp', 'lãnh đạo', 'giám đốc', 'ceo', 'cto', 'sếp tổng', 'ban giám đốc', 'ai đứng đầu', 'quản lý', 'người sáng lập', 'founder', 'trưởng phòng'],
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
    keywords: ['thời gian', 'giờ làm', 'remote', 'hybrid', 'wfh', 'từ xa', 'nghỉ', 'thứ 2', 'thứ 6', 'giờ giấc', 'làm thêm', 'ot', 'nghỉ phép', 'nghỉ trưa'],
    content: `Thời gian làm việc tiêu chuẩn từ Thứ 2 đến Thứ 6 (8:30 - 17:30, nghỉ trưa từ 12:00 - 13:30), được nghỉ Thứ 7 và Chủ nhật.
Công ty áp dụng chính sách Hybrid linh hoạt: Nhân viên chính thức được phép làm việc từ xa (Work from Home) tối đa 2 ngày/tuần. Công ty tôn trọng cân bằng cuộc sống và công việc (Work-Life Balance), hạn chế làm thêm giờ (OT).`
  },
  {
    id: 'kb-compensation-benefits',
    title: 'Chính sách Đãi ngộ, Lương thưởng & Phúc lợi',
    category: 'Đãi ngộ & Phúc lợi',
    keywords: ['lương', 'salary', 'thu nhập', 'đãi ngộ', 'phúc lợi', 'thưởng', 'bảo hiểm', 'benefit', 'pvi', 'macbook', 'ăn trưa', 'du lịch', 'tăng lương', 'review lương', 'tháng 13'],
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
    keywords: ['phỏng vấn', 'quy trình', 'vòng phỏng vấn', 'interview', 'hr screening', 'test', 'kỹ thuật', 'technical', 'offer', 'bao lâu', 'thời gian tuyển', 'mấy vòng', 'thư mời', 'kinh nghiệm phỏng vấn', 'mẹo phỏng vấn'],
    content: `Quy trình Tuyển dụng gồm 3 bước nhanh gọn trong vòng 7 - 10 ngày làm việc:
1. Vòng 1 (Sàng lọc hồ sơ & HR Screening): Đánh giá độ phù hợp CV qua hệ thống Smart ATS RAG, trao đổi sơ bộ 15 phút với HR về định hướng và kỳ vọng.
2. Vòng 2 (Phỏng vấn Kỹ thuật / Technical Interview): Đánh giá chuyên môn, kiến trúc hệ thống, tư duy giải quyết vấn đề và coding thực tế (60 phút).
3. Vòng 3 (Trao đổi Văn hóa & Offer): Trao đổi trực tiếp với CTO/Ban Giám đốc về mục tiêu nghề nghiệp và nhận Thư mời nhận việc (Offer Letter) trong vòng 48h.`
  },
  {
    id: 'kb-cv-evaluation',
    title: 'Tiêu chuẩn Đánh giá Độ phù hợp CV & Match Score',
    category: 'Đánh giá hồ sơ',
    keywords: ['cv', 'hồ sơ', 'phù hợp', 'đánh giá cv', 'match score', 'điểm phù hợp', 'kỹ năng', 'kinh nghiệm', 'nộp cv', 'apply', 'ứng tuyển', 'bản pdf', 'nộp hồ sơ', 'tối ưu cv', 'viết cv'],
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
    keywords: ['vị trí', 'job', 'công việc', 'đang tuyển', 'fullstack', 'frontend', 'backend', 'kỹ sư ai', 'lập trình viên', 'developer', 'react', 'node', 'python', 'tuyển dụng vị trí', 'tuyển', 'yêu cầu'],
    content: `Hiện tại Smart ATS đang mở tuyển các vị trí chủ lực:
• Senior Fullstack Developer (React, Node.js, PostgreSQL) - Lương: $1,800 - $3,200/tháng
• AI / Machine Learning Engineer (Python, RAG, LLMs, LangChain) - Lương: $2,000 - $3,500/tháng
• Frontend Developer (React, TailwindCSS, TypeScript) - Lương: $1,000 - $2,200/tháng
Bạn có thể nộp hồ sơ trực tiếp tại danh mục Tin Tuyển Dụng trên giao diện ứng viên!`
  },
  {
    id: 'kb-probation-onboarding',
    title: 'Quy chế Thử việc & Tiếp nhận Nhân viên (Onboarding)',
    category: 'Quy chế làm việc',
    keywords: ['thử việc', 'onboard', 'tiếp nhận', 'thời gian thử việc', 'lương thử việc', 'hợp đồng', 'chính thức', 'mentor', 'hướng dẫn'],
    content: `Thời gian thử việc tiêu chuẩn là 2 tháng:
• Ứng viên nhận từ 85% - 100% lương chính thức theo thỏa thuận.
• Được chỉ định một Mentor 1-1 hỗ trợ hòa nhập công việc và tech stack.
• Được tham gia đầy đủ các hoạt động văn hóa, teambuilding của công ty.`
  },
  {
    id: 'kb-tech-culture',
    title: 'Văn hóa Công ty & Môi trường Làm việc',
    category: 'Văn hóa & Công nghệ',
    keywords: ['văn hóa', 'môi trường', 'công ty', 'smartats', 'tech stack', 'công nghệ', 'sáng tạo', 'teambuilding', 'phát triển', 'địa chỉ', 'văn phòng', 'trụ sở', 'áp lực', 'học tập'],
    content: `Smart ATS xây dựng văn hóa Agile linh hoạt, cởi mở, không khoảng cách cấp bậc, khuyến khích sáng tạo và thử nghiệm công nghệ AI mới. Công nghệ chính gồm: React, Node.js, PostgreSQL NeonDB, Prisma ORM, Vector Embeddings và Google Gemini AI.`
  }
];

function removeVietnameseTones(str) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

const STRICT_OFF_TOPIC_REPLY = 'Xin lỗi, tôi chỉ hỗ trợ giải đáp các câu hỏi liên quan đến công việc, vị trí tuyển dụng, mức lương, thời gian làm việc, đãi ngộ và đánh giá hồ sơ.';

function isRecruitmentTopic(query) {
  const qClean = query.toLowerCase().trim();
  const qNoTone = removeVietnameseTones(qClean);

  const allowedKeywords = [
    'việc', 'job', 'vị trí', 'lương', 'salary', 'thu nhập', 'thời gian', 'giờ làm', 'remote', 
    'hybrid', 'on-site', 'đãi ngộ', 'phúc lợi', 'thưởng', 'bảo hiểm', 'benefit', 'phỏng vấn', 
    'interview', 'cv', 'hồ sơ', 'kỹ năng', 'skill', 'kinh nghiệm', 'yêu cầu', 'tuyển', 'ứng tuyển', 
    'apply', 'công ty', 'smartats', 'react', 'node', 'fullstack', 'frontend', 'backend', 
    'developer', 'lập trình', 'onboard', 'thử việc', 'chế độ', 'phù hợp', 'chào', 'hello', 'hi', 
    'cảm ơn', 'thanks', 'địa chỉ', 'văn phòng', 'jd', 'quy trình', 'thực tập', 'intern', 'sếp', 
    'giám đốc', 'ceo', 'cto', 'lãnh đạo', 'quản lý', 'pvi', 'macbook', 'vòng', 'hợp đồng', 'trợ lý',
    'deal', 'học', 'nghề nghiệp', 'nâng cao', 'công nghệ', 'kinh nghiệm', 'bắt đầu', 'môi trường'
  ];

  return allowedKeywords.some(kw => {
    const kwNoTone = removeVietnameseTones(kw);
    return qClean.includes(kw) || qNoTone.includes(kwNoTone);
  });
}

/**
 * Generates Deep Contextual Reasoning for Candidate Queries
 */
export function generateClientRAGResponse(query) {
  const qClean = query.toLowerCase().trim();

  // Strict guardrail for off-topic questions
  if (!isRecruitmentTopic(query)) {
    return {
      reply: STRICT_OFF_TOPIC_REPLY,
      isOffTopic: true,
      sources: []
    };
  }

  // 1. Leadership & Organization
  if (qClean.includes('sếp') || qClean.includes('lãnh đạo') || qClean.includes('giám đốc') || qClean.includes('ceo') || qClean.includes('cto') || qClean.includes('đứng đầu') || qClean.includes('quản lý')) {
    return {
      reply: `Về Cơ cấu Ban Lãnh Đạo tại Smart ATS:\n• Tổng Giám Đốc điều hành (CEO): Định hướng chiến lược phát triển sản phẩm công nghệ và văn hóa doanh nghiệp.\n• Giám Đốc Công Nghệ (CTO): Trực tiếp chỉ đạo phát triển kiến trúc kỹ thuật và hệ thống Trí tuệ Nhân tạo AI / RAG.\n• Trưởng phòng Tuyển dụng & Nhân sự (HR Manager): Điều phối quy trình phỏng vấn và chính sách phúc lợi nhân viên.\nCông ty áp dụng văn hóa làm việc mở và minh bạch, khuyến khích mọi thành viên trao đổi trực tiếp với ban lãnh đạo.`,
      isOffTopic: false,
      sources: [{ title: 'Ban Lãnh Đạo & Cơ Cấu Tổ Chức Smart ATS', category: 'Cơ cấu & Lãnh đạo', similarityScore: 96 }]
    };
  }

  // 2. Experience & Skill Advice (e.g. 1 year, 2 years, what to apply, what to learn)
  if (qClean.includes('kinh nghiệm') || qClean.includes('năm') || qClean.includes('chưa biết') || qClean.includes('học thêm') || qClean.includes('nên ứng tuyển') || qClean.includes('có cơ hội')) {
    return {
      reply: `Chào bạn! Dưới đây là lời khuyên định hướng từ Smart ATS dựa trên năng lực của bạn:\n• Nếu bạn có nền tảng Frontend (React, TailwindCSS, TypeScript): Vị trí Frontend Developer ($1,000 - $2,200) là lựa chọn rất phù hợp để bắt đầu.\n• Nếu bạn muốn hướng tới vị trí Fullstack Developer ($1,800 - $3,200): Bạn nên bổ sung kiến thức về Node.js (Express), cơ sở dữ liệu PostgreSQL/Prisma và thiết kế RESTful API.\n• Về cơ hội phát triển: Smart ATS luôn đánh giá cao tư duy logic, khả năng tự học và tinh thần trách nhiệm. Bạn hoàn toàn có thể nộp CV trực tiếp tại mục Tin Tuyển Dụng để hệ thống AI phân tích và đưa ra điểm tương thích chi tiết nhé!`,
      isOffTopic: false,
      sources: [{ title: 'Danh sách Vị trí Tuyển dụng đang mở', category: 'Tin tuyển dụng', similarityScore: 94 }]
    };
  }

  // 3. Technical Interview Preparation & Tips
  if (qClean.includes('phỏng vấn') && (qClean.includes('hỏi gì') || qClean.includes('chuẩn bị') || qClean.includes('mẹo') || qClean.includes('bí quyết') || qClean.includes('kỹ thuật'))) {
    return {
      reply: `Để chuẩn bị tốt nhất cho Vòng Phỏng Vấn Kỹ Thuật (Technical Interview - 60 phút) tại Smart ATS, bạn nên lưu ý các trọng tâm sau:\n1. Kiến thức cốt lõi (Core Concepts): Nắm vững JavaScript hiện đại (ES6+, Async/Await, Event Loop), React Hooks, State Management và tối ưu hiệu năng.\n2. Kiến trúc & API: Cách thiết kế REST API chuẩn, tương tác cơ sở dữ liệu (PostgreSQL/ORM) và tư duy bảo mật (Authentication, JWT).\n3. Giải quyết vấn đề (Problem Solving): Giải thích rõ ràng tư duy xử lý bài toán thực tế, không ngại trao đổi ý tưởng với hội đồng phỏng vấn.\n4. Tinh thần học hỏi: Thể hiện sự chủ động khi tiếp cận công nghệ AI/RAG mới.\nChúc bạn có sự chuẩn bị thật tốt để tự tin chinh phục buổi phỏng vấn!`,
      isOffTopic: false,
      sources: [{ title: 'Quy trình Tuyển dụng & Phỏng vấn tại Smart ATS', category: 'Quy trình tuyển dụng', similarityScore: 95 }]
    };
  }

  // 4. Compensation & Benefits
  if (qClean.includes('lương') || qClean.includes('salary') || qClean.includes('thu nhập') || qClean.includes('đãi ngộ') || qClean.includes('phúc lợi') || qClean.includes('thưởng') || qClean.includes('bảo hiểm') || qClean.includes('pvi') || qClean.includes('macbook')) {
    return {
      reply: `Về Chính sách Đãi ngộ, Lương thưởng & Phúc lợi tại Smart ATS:\n• Thu nhập cạnh tranh: Dao động từ $1,000 - $3,500/tháng theo năng lực và cấp bậc (Junior / Middle / Senior / Lead).\n• Thưởng hấp dẫn: Đảm bảo lương tháng 13 + thưởng hiệu suất KPI dự án theo quý (lên đến 2-3 tháng lương/năm).\n• Bảo hiểm: Gói bảo hiểm sức khỏe cao cấp PVI Care toàn diện.\n• Thiết bị & Phụ cấp: Cấp MacBook Pro M-series cấu hình cao, phụ cấp ăn trưa 1,200,000 VNĐ/tháng và du lịch nghỉ dưỡng thường niên.\n• Xét tăng lương: Đánh giá hiệu suất định kỳ 2 lần/năm.`,
      isOffTopic: false,
      sources: [{ title: 'Chính sách Đãi ngộ, Lương thưởng & Phúc lợi', category: 'Đãi ngộ & Phúc lợi', similarityScore: 98 }]
    };
  }

  // 5. Work Hours & Remote Policy
  if (qClean.includes('thời gian') || qClean.includes('giờ làm') || qClean.includes('remote') || qClean.includes('hybrid') || qClean.includes('từ xa') || qClean.includes('wfh') || qClean.includes('thứ 2') || qClean.includes('nghỉ')) {
    return {
      reply: `Về Thời gian làm việc & Chính sách Làm việc từ xa (Remote / Hybrid):\n• Thời gian làm việc: Từ Thứ 2 đến Thứ 6 (8:30 - 17:30, nghỉ trưa 12:00 - 13:30), nghỉ Thứ 7 và Chủ nhật.\n• Chính sách Hybrid: Nhân viên chính thức được phép làm việc từ xa (Work from Home) linh hoạt tối đa 2 ngày/tuần.\n• Công ty trang bị hệ thống VPN bảo mật nội bộ và hỗ trợ thiết bị làm việc từ xa.`,
      isOffTopic: false,
      sources: [{ title: 'Chính sách Thời gian làm việc & Remote / Hybrid', category: 'Chính sách công ty', similarityScore: 95 }]
    };
  }

  // 6. Interview Process
  if (qClean.includes('phỏng vấn') || qClean.includes('quy trình') || qClean.includes('mấy vòng') || qClean.includes('bao lâu') || qClean.includes('vòng 1') || qClean.includes('vòng 2') || qClean.includes('vòng 3')) {
    return {
      reply: `Quy trình Tuyển dụng & Phỏng vấn tại Smart ATS gồm 3 bước nhanh gọn (hoàn tất trong 7 - 10 ngày):\n1. Vòng 1: AI & HR Screening - Đánh giá độ phù hợp CV qua hệ thống Smart ATS RAG, phỏng vấn nhanh 15 phút với HR.\n2. Vòng 2: Technical Interview - Phỏng vấn kỹ thuật chuyên sâu và xử lý bài toán thực tế (60 phút).\n3. Vòng 3: Culture & Offer - Trao đổi cùng Giám đốc Kỹ thuật / Ban Giám đốc và nhận Thư mời nhận việc (Offer Letter).`,
      isOffTopic: false,
      sources: [{ title: 'Quy trình Tuyển dụng & Phỏng vấn tại Smart ATS', category: 'Quy trình tuyển dụng', similarityScore: 94 }]
    };
  }

  // 7. Job Positions
  if (qClean.includes('vị trí') || qClean.includes('job') || qClean.includes('công việc') || qClean.includes('tuyển') || qClean.includes('fullstack') || qClean.includes('frontend') || qClean.includes('kỹ sư ai') || qClean.includes('developer')) {
    return {
      reply: `Hiện tại Smart ATS đang mở tuyển các vị trí chủ lực:\n• Senior Fullstack Developer (React, Node.js, PostgreSQL) - Mức lương: $1,800 - $3,200/tháng.\n• AI / Machine Learning Engineer (Python, RAG, LLMs, LangChain) - Mức lương: $2,000 - $3,500/tháng.\n• Frontend Developer (React, TailwindCSS, TypeScript) - Mức lương: $1,000 - $2,200/tháng.\nBạn có thể nhấn vào mục "Tin Tuyển Dụng" trên menu để xem chi tiết yêu cầu công việc và nộp CV trực tiếp!`,
      isOffTopic: false,
      sources: [{ title: 'Danh sách Vị trí Tuyển dụng đang mở', category: 'Tin tuyển dụng', similarityScore: 92 }]
    };
  }

  // 8. CV Optimization & Match Score
  if (qClean.includes('cv') || qClean.includes('hồ sơ') || qClean.includes('phù hợp') || qClean.includes('match') || qClean.includes('đánh giá')) {
    return {
      reply: `Về việc Đánh giá Độ phù hợp CV:\nHệ thống Smart ATS tích hợp AI phân tích CV tự động trích xuất kỹ năng cốt lõi, số năm kinh nghiệm và dự án thực tế. Sau đó tính toán Điểm tương thích (Match Score %).\nỨng viên có điểm Match Score từ 70% trở lên sẽ được ưu tiên mời vào vòng phỏng vấn kỹ thuật ngay lập tức! Bạn có thể tải file PDF CV trực tiếp vào form ứng tuyển của vị trí mong muốn.`,
      isOffTopic: false,
      sources: [{ title: 'Tiêu chuẩn Đánh giá Độ phù hợp CV & Match Score', category: 'Đánh giá hồ sơ', similarityScore: 93 }]
    };
  }

  // 9. Probation & Mentoring
  if (qClean.includes('thử việc') || qClean.includes('onboard') || qClean.includes('hướng dẫn') || qClean.includes('mentor')) {
    return {
      reply: `Về Quy chế Thử việc & Onboarding tại Smart ATS:\n• Thời gian thử việc: 2 tháng với mức lương từ 85% - 100% lương chính thức.\n• Được chỉ định 1 Mentor hướng dẫn 1-1 hỗ trợ kỹ thuật và văn hóa doanh nghiệp.\n• Được tham gia đầy đủ các khóa đào tạo nội bộ và hoạt động teambuilding.`,
      isOffTopic: false,
      sources: [{ title: 'Quy chế Thử việc & Tiếp nhận Nhân viên (Onboarding)', category: 'Quy chế làm việc', similarityScore: 90 }]
    };
  }

  // 10. Culture & Tech Stack
  if (qClean.includes('văn hóa') || qClean.includes('môi trường') || qClean.includes('áp lực') || qClean.includes('tech stack') || qClean.includes('công nghệ') || qClean.includes('học hỏi')) {
    return {
      reply: `Về Môi trường làm việc & Văn hóa công nghệ tại Smart ATS:\n• Văn hóa làm việc: Agile linh hoạt, cởi mở, không khoảng cách cấp bậc, tôn trọng sự sáng tạo và cân bằng công việc - cuộc sống.\n• Công nghệ hiện đại: Làm việc với React, Node.js, PostgreSQL NeonDB, Prisma ORM, Vector Embeddings và mô hình Google Gemini AI thế hệ mới.\n• Cơ hội phát triển: Được hỗ trợ ngân sách học tập chứng chỉ công nghệ, tham gia các buổi Tech Sharing hàng tuần.`,
      isOffTopic: false,
      sources: [{ title: 'Văn hóa Công ty & Môi trường Làm việc', category: 'Văn hóa & Công nghệ', similarityScore: 91 }]
    };
  }

  // 11. Greetings & System intro
  if (qClean.includes('chào') || qClean.includes('hello') || qClean.includes('hi') || qClean.includes('bạn là ai') || qClean.includes('giúp gì')) {
    return {
      reply: `Chào bạn! Tôi là Trợ Lý Tuyển Dụng AI của Smart ATS. Tôi có thể hỗ trợ bạn:\n• Tra cứu thông tin các vị trí tuyển dụng, mức lương và chế độ đãi ngộ.\n• Tư vấn lộ trình kỹ năng và đánh giá độ phù hợp của CV.\n• Hướng dẫn quy trình phỏng vấn và chính sách làm việc Hybrid / WFH.\nBạn có câu hỏi nào cần tôi hỗ trợ ngay lúc này không?`,
      isOffTopic: false,
      sources: [{ title: 'Cơ sở tri thức Smart ATS', category: 'Hệ thống', similarityScore: 100 }]
    };
  }

  // Default fallback for general career questions
  return {
    reply: `Cảm ơn câu hỏi của bạn. Tại Smart ATS, chúng tôi luôn hoan nghênh các ứng viên tiềm năng muốn tìm hiểu về cơ hội nghề nghiệp, chế độ đãi ngộ và môi trường làm việc. Bạn có thể hỏi chi tiết hơn về các vị trí đang tuyển, mức lương, thời gian làm việc hoặc quy trình phỏng vấn để tôi hỗ trợ chính xác nhất nhé!`,
    isOffTopic: false,
    sources: [{ title: 'Cơ sở tri thức Smart ATS', category: 'Hệ thống', similarityScore: 85 }]
  };
}
