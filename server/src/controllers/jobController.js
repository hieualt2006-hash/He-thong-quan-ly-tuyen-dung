const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
