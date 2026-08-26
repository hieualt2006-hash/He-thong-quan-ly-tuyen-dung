const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const isApiKeyValid = apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE';
const genAI = isApiKeyValid ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Static Recruitment & Company Knowledge Base Chunks
 */
const BASE_KNOWLEDGE_DOCS = [
  {
    id: 'kb-policy-wfh',
    title: 'Chính sách Thời gian làm việc & Làm việc từ xa (Remote / Hybrid)',
    category: 'Chính sách công ty',
    content: `Thời gian làm việc tiêu chuẩn của công ty là từ Thứ 2 đến Thứ 6 (8:30 - 17:30, nghỉ trưa từ 12:00 - 13:30). 
Công ty áp dụng chính sách Hybrid linh hoạt: Nhân viên chính thức được phép đăng ký làm việc từ xa (Remote / Work from Home) tối đa 2 ngày/tuần sau khi hoàn thành thời gian thử việc. Thiết bị làm việc được công ty hỗ trợ bảo mật qua VPN nội bộ.`
  },
  {
    id: 'kb-compensation-benefits',
    title: 'Chính sách Đãi ngộ, Lương thưởng & Phúc lợi',
    category: 'Đãi ngộ & Phúc lợi',
    content: `Mức lương tại Smart ATS luôn nằm trong top 20% thị trường, dao động từ $1,000 - $3,500/tháng theo năng lực và cấp bậc (Junior / Middle / Senior / Tech Lead). 
Phúc lợi bao gồm: 
- Lương tháng 13 đảm bảo + Thưởng hiệu suất dự án theo quý (lên đến 2-3 tháng lương/năm).
- Bảo hiểm sức khỏe cao cấp PVI Care dành cho nhân viên và người thân.
- Được cấp MacBook Pro M-series hoặc máy trạm cấu hình cao.
- Trợ cấp ăn trưa 1,200,000 VNĐ/tháng, vé gửi xe miễn phí, teambuilding và du lịch nghỉ dưỡng cao cấp hàng năm.`
  },
  {
    id: 'kb-interview-process',
    title: 'Quy trình Tuyển dụng & Phỏng vấn tại Smart ATS',
    category: 'Quy trình tuyển dụng',
    content: `Quy trình tuyển dụng tiêu chuẩn gồm 3 bước nhanh gọn trong vòng 7 - 10 ngày làm việc:
1. Vòng 1 (Sàng lọc hồ sơ bằng AI & HR Screening): Đánh giá độ phù hợp của CV với JD qua hệ thống Smart ATS RAG, phỏng vấn nhanh 15 phút với HR.
2. Vòng 2 (Phỏng vấn Kỹ thuật / Technical Interview): Đánh giá chuyên môn, kiến trúc hệ thống và kỹ năng giải quyết vấn đề (60 phút).
3. Vòng 3 (Trao đổi Văn hóa & Offer): Trao đổi trực tiếp với Giám đốc Kỹ thuật (CTO) hoặc Ban Giám đốc và nhận Thư mời nhận việc (Offer Letter).`
  },
  {
    id: 'kb-cv-evaluation',
    title: 'Tiêu chuẩn Đánh giá Độ phù hợp CV & Ứng tuyển',
    category: 'Đánh giá hồ sơ',
    content: `Hệ thống Smart ATS tích hợp AI phân tích CV tự động trích xuất các thông số: Kỹ năng cốt lõi (Core Skills), Số năm kinh nghiệm, Dự án đã thực hiện và Độ khớp với bản mô tả công việc (Match Score). 
Ứng viên có Match Score từ 70% trở lên sẽ được ưu tiên chuyển thẳng vào danh sách phỏng vấn trực tiếp.`
  },
  {
    id: 'kb-leadership',
    title: 'Ban Lãnh Đạo & Cơ Cấu Tổ Chức Smart ATS',
    category: 'Cơ cấu & Lãnh đạo',
    content: `Ban Giám Đốc và Lãnh đạo tại Smart ATS gồm:
• Tổng Giám Đốc điều hành (CEO): Định hướng chiến lược phát triển sản phẩm công nghệ và chiến lược nhân tài toàn cầu.
• Giám Đốc Công Nghệ (CTO): Trực tiếp quản lý đội ngũ Kỹ thuật, Kiến trúc AI và Hệ thống RAG Thông minh.
• Trưởng phòng Nhân sự (HR Manager): Phụ trách tiếp nhận ứng viên, điều phối phỏng vấn và đãi ngộ nhân tài.
Môi trường công ty theo mô hình phẳng (Flat Hierarchy), cởi mở và khuyến khích trao đổi trực tiếp với ban lãnh đạo.`
  },
  {
    id: 'kb-probation-onboarding',
    title: 'Quy chế Thử việc & Tiếp nhận Nhân viên (Onboarding)',
    category: 'Quy chế làm việc',
    content: `Thời gian thử việc tiêu chuẩn là 2 tháng:
• Ứng viên nhận từ 85% - 100% lương chính thức theo thỏa thuận.
• Được chỉ định một Mentor 1-1 hỗ trợ hòa nhập công việc và tech stack.
• Được tham gia đầy đủ các hoạt động văn hóa, teambuilding của công ty.`
  },
  {
    id: 'kb-tech-culture',
    title: 'Môi trường làm việc & Công nghệ tại Smart ATS',
    category: 'Văn hóa & Công nghệ',
    content: `Smart ATS định hướng phát triển các giải pháp phần mềm quản trị tuyển dụng hiện đại tích hợp trí tuệ nhân tạo (Generative AI & RAG). 
Tech stack cốt lõi bao gồm: React.js, TailwindCSS, Node.js, Express, PostgreSQL / NeonDB, Prisma ORM, Vector Embedding và Google Gemini Models. 
Môi trường làm việc cởi mở, không khoảng cách cấp bậc, khuyến khích sáng tạo và thử nghiệm công nghệ mới.`
  }
];


// In-memory Vector Store Cache: { id, title, category, content, embedding: number[] }
let vectorStore = [];
let isVectorStoreInitialized = false;

/**
 * Calculates Cosine Similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Lightweight local TF-IDF / Token Vectorizer Fallback when Gemini API key is not ready
 */
function generateSimpleFallbackEmbedding(text) {
  const words = text.toLowerCase().match(/[\w\d\u00C0-\u1EF9]+/g) || [];
  const freqMap = {};
  words.forEach(w => { freqMap[w] = (freqMap[w] || 0) + 1; });
  return freqMap;
}

function calculateSimpleFallbackSimilarity(freqMapA, freqMapB) {
  const allKeys = new Set([...Object.keys(freqMapA), ...Object.keys(freqMapB)]);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  allKeys.forEach(k => {
    const valA = freqMapA[k] || 0;
    const valB = freqMapB[k] || 0;
    dot += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  });
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generates Vector Embedding for a given text chunk using Google Gemini text-embedding-004
 * @param {string} text 
 * @returns {Promise<number[]|null>}
 */
async function generateGeminiEmbedding(text) {
  if (!isApiKeyValid) return null;
  try {
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.warn('⚠️ Lỗi sinh embedding qua Gemini API, chuyển sang chế độ dự phòng:', error.message);
    return null;
  }
}

/**
 * Initializes or updates Knowledge Base Vector Store including dynamic active jobs
 * @param {Array} dynamicJobs - List of active jobs from database
 */
async function initializeKnowledgeBase(dynamicJobs = []) {
  const allDocuments = [...BASE_KNOWLEDGE_DOCS];

  // Convert active jobs to document chunks
  dynamicJobs.forEach(job => {
    allDocuments.push({
      id: `job-${job.id}`,
      title: `Vị trí tuyển dụng: ${job.title} (${job.department || 'Phòng Kỹ thuật'})`,
      category: 'Tin tuyển dụng',
      content: `Vị trí: ${job.title}
Phòng ban: ${job.department || 'Kỹ thuật'}
Mức lương: ${job.salaryRange || 'Thỏa thuận hấp dẫn'}
Mô tả công việc: ${job.description || 'Chưa cập nhật chi tiết'}
Yêu cầu chuyên môn: ${job.requirements || 'Trao đổi cụ thể trong buổi phỏng vấn'}`
    });
  });

  const embeddedDocs = [];

  for (const doc of allDocuments) {
    const fullText = `${doc.title}\n${doc.content}`;
    let embedding = null;

    if (isApiKeyValid) {
      embedding = await generateGeminiEmbedding(fullText);
    }

    embeddedDocs.push({
      ...doc,
      embedding: embedding,
      fallbackVec: generateSimpleFallbackEmbedding(fullText)
    });
  }

  vectorStore = embeddedDocs;
  isVectorStoreInitialized = true;
  console.log(`✅ [RAG Engine] Đã lập chỉ mục Vector cho ${vectorStore.length} tài liệu tri thức (Model: text-embedding-004).`);
  return vectorStore;
}

/**
 * Performs Semantic Retrieval (Vector Search) for a user query
 * @param {string} query - User search prompt/question
 * @param {number} topK - Number of relevant chunks to retrieve
 * @param {Array} dynamicJobs - Optional jobs list to refresh
 * @returns {Promise<Array>} List of relevant documents with similarity score
 */
async function retrieveRelevantKnowledge(query, topK = 3, dynamicJobs = []) {
  if (!isVectorStoreInitialized || (dynamicJobs && dynamicJobs.length > 0)) {
    await initializeKnowledgeBase(dynamicJobs);
  }

  let queryEmbedding = null;
  if (isApiKeyValid) {
    queryEmbedding = await generateGeminiEmbedding(query);
  }

  const queryFallbackVec = generateSimpleFallbackEmbedding(query);

  const scoredDocs = vectorStore.map(doc => {
    let score = 0;
    if (queryEmbedding && doc.embedding) {
      score = cosineSimilarity(queryEmbedding, doc.embedding);
    } else {
      score = calculateSimpleFallbackSimilarity(queryFallbackVec, doc.fallbackVec);
    }

    return {
      id: doc.id,
      title: doc.title,
      category: doc.category,
      content: doc.content,
      similarityScore: Math.max(10, Math.min(99, Math.round(score * 100)))
    };
  });

  // Sort descending by similarity
  scoredDocs.sort((a, b) => b.similarityScore - a.similarityScore);

  // Return top K chunks
  return scoredDocs.slice(0, topK);
}

module.exports = {
  initializeKnowledgeBase,
  retrieveRelevantKnowledge,
  generateGeminiEmbedding
};
