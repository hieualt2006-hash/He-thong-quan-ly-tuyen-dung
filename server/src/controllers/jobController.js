const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Seed initial default jobs if database is empty
async function seedDefaultJobs() {
  try {
    const count = await prisma.job.count();
    if (count === 0) {
      const job1 = await prisma.job.create({
        data: {
          title: 'Senior Node.js Backend Engineer',
          department: 'Engineering',
          salaryRange: '$2,000 - $3,500',
          description: 'Chịu trách nhiệm thiết kế và phát triển RESTful API / Microservices hiệu năng cao, tối ưu cơ sở dữ liệu và tích hợp các module AI.',
          requirements: 'Node.js, Express, PostgreSQL, Docker, Redis, REST API, Microservices',
          status: 'Open'
        }
      });

      const job2 = await prisma.job.create({
        data: {
          title: 'AI / Machine Learning Engineer',
          department: 'AI Lab',
          salaryRange: '$2,500 - $4,200',
          description: 'Nghiên cứu, phát triển và tối ưu các pipeline AI, tích hợp mô hình ngôn ngữ lớn (LLM - Gemini / GPT), phân tích CV và tự động sinh câu hỏi phỏng vấn.',
          requirements: 'Python, PyTorch, LangChain, Gemini API, NLP, Vector Database, RAG',
          status: 'Open'
        }
      });

      const job3 = await prisma.job.create({
        data: {
          title: 'Senior Frontend Developer (React / Vite)',
          department: 'Product & Design',
          salaryRange: '$1,800 - $3,000',
          description: 'Xây dựng giao diện Dashboard, Kanban Pipeline tương tác cao, thiết kế hệ thống Design System chuẩn UX/UI và tối ưu hoá tốc độ tải trang.',
          requirements: 'React, TypeScript, Tailwind CSS, Vite, Redux/Zustand, WebSocket, Responsive UI',
          status: 'Open'
        }
      });

      const job4 = await prisma.job.create({
        data: {
          title: 'Chuyên Viên Tuyển Dụng Cao Cấp (Senior HR Recruiter)',
          department: 'HR & Operations',
          salaryRange: '$1,200 - $2,200',
          description: 'Tìm kiếm và săn đón nhân tài công nghệ, sàng lọc hồ sơ, điều phối quy trình phỏng vấn và phát triển nguồn nhân lực chất lượng cao.',
          requirements: '3+ năm kinh nghiệm tuyển dụng IT/Tech, Kỹ năng phỏng vấn, Giao tiếp tiếng Anh tốt',
          status: 'Open'
        }
      });

      // Sample candidates & applications
      const cand1 = await prisma.candidate.create({
        data: {
          fullName: 'Trần Văn Hoàng',
          email: 'hoang.tran@gmail.com',
          phone: '0987654321',
          rawCvText: 'Fullstack developer with 4 years experience in Node.js, Express, PostgreSQL, React and Docker.'
        }
      });

      await prisma.application.create({
        data: {
          jobId: job1.id,
          candidateId: cand1.id,
          status: 'Applied',
          matchScore: 88,
          matchSummary: 'Ứng viên có kỹ năng Node.js, Express và Docker rất phù hợp với vị trí Backend Engineer.',
          missingSkills: 'Redis, Kubernetes'
        }
      });

      console.log('✅ Seeded initial default jobs and applications to Neon Postgres');
    }
  } catch (err) {
    console.warn('Note on seeding jobs:', err.message);
  }
}

seedDefaultJobs();

/**
 * GET /api/jobs - Retrieve all job postings
 */
async function getAllJobs(req, res) {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { id: 'desc' },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách job', error: error.message });
  }
}

/**
 * POST /api/jobs - Create a new job posting
 */
async function createJob(req, res) {
  try {
    const { title, department, description, requirements, salaryRange, status } = req.body;

    if (!title || !department || !description || !requirements) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin: title, department, description, requirements'
      });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        department,
        description,
        requirements,
        salaryRange: salaryRange || 'Thỏa thuận',
        status: status || 'Open'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Tạo tin tuyển dụng thành công',
      data: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo job mới', error: error.message });
  }
}

/**
 * GET /api/jobs/:id - Get job details by ID along with list of applications
 */
async function getJobById(req, res) {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            candidate: true,
            questions: true
          },
          orderBy: { matchScore: 'desc' }
        }
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin công việc'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job detail:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy chi tiết job', error: error.message });
  }
}

module.exports = {
  getAllJobs,
  createJob,
  getJobById
};
