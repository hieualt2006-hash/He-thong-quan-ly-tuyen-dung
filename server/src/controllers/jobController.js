const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { broadcast } = require('../sse');

// Seed initial default jobs if database is empty
async function seedDefaultJobs() {
  try {
    const count = await prisma.job.count();
    if (count === 0) {
      const job1 = await prisma.job.create({
        data: {
          id: 'job-1',
          title: 'Chief Executive Officer',
          department: 'Management',
          salaryRange: '$3,000 - $5,000',
          description: 'Điều hành chiến lược toàn diện của công ty.',
          requirements: '10+ năm kinh nghiệm quản trị cấp cao.',
          status: 'Open',
          toRecruit: 1
        }
      });

      const job2 = await prisma.job.create({
        data: {
          id: 'job-2',
          title: 'Consultant',
          department: 'Management',
          salaryRange: '$1,500 - $2,500',
          description: 'Tư vấn giải pháp chuyển đổi số và quản trị doanh nghiệp.',
          requirements: 'Kỹ năng giao tiếp và thuyết trình xuất sắc.',
          status: 'Open',
          toRecruit: 5
        }
      });

      const job3 = await prisma.job.create({
        data: {
          id: 'job-3',
          title: 'Experienced Developer',
          department: 'Research & Development',
          salaryRange: '$1,800 - $3,000',
          description: 'Phát triển các module hệ thống ERP và tích hợp AI.',
          requirements: 'React, Node.js, PostgreSQL/SQLite, AI integration.',
          status: 'Open',
          toRecruit: 5
        }
      });

      const job4 = await prisma.job.create({
        data: {
          id: 'job-4',
          title: 'chạy bộ',
          department: 'Research & Development',
          salaryRange: 'Thỏa thuận',
          description: 'Vận động viên rèn luyện sức khỏe thể chất công ty.',
          requirements: 'Tinh thần thể thao và dẻo dai.',
          status: 'Open',
          toRecruit: 1
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
      orderBy: { createdAt: 'desc' },
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
    const { id, title, department, description, requirements, salaryRange, status, toRecruit, email } = req.body;

    if (!title || !department || !description || !requirements) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin: title, department, description, requirements'
      });
    }

    const defaultEmail = email || `${title.toLowerCase().replace(/[^a-z0-9]/g, '')}@nhom20.com`;

    const jobData = {
      title,
      department,
      description,
      requirements,
      salaryRange: salaryRange || 'Thỏa thuận',
      status: status || 'Open',
      toRecruit: toRecruit ? parseInt(toRecruit, 10) : 1,
      email: defaultEmail
    };

    if (id) {
      jobData.id = id;
    }

    const newJob = await prisma.job.create({
      data: jobData,
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    // Broadcast real-time event to all connected clients
    broadcast('JobCreated', newJob);

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
 * PUT /api/jobs/:id - Update an existing job posting
 */
async function updateJob(req, res) {
  try {
    const { id } = req.params;
    const { title, department, description, requirements, salaryRange, status, toRecruit, email } = req.body;

    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy vị trí tuyển dụng' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (department !== undefined) updateData.department = department;
    if (description !== undefined) updateData.description = description;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (salaryRange !== undefined) updateData.salaryRange = salaryRange;
    if (status !== undefined) updateData.status = status;
    if (toRecruit !== undefined) updateData.toRecruit = parseInt(toRecruit, 10) || 1;
    if (email !== undefined) updateData.email = email;

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    // Broadcast real-time event to all connected clients
    broadcast('JobUpdated', updatedJob);

    res.json({
      success: true,
      message: 'Cập nhật vị trí tuyển dụng thành công',
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật job', error: error.message });
  }
}

/**
 * DELETE /api/jobs/:id - Delete a job posting
 */
async function deleteJob(req, res) {
  try {
    const { id } = req.params;
    const titleQuery = req.query.title || req.body?.title;

    // Search by ID or by exact/partial Title
    let existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      const orConditions = [
        { id },
        { title: { equals: id } }
      ];
      if (titleQuery) {
        orConditions.push({ title: { equals: titleQuery } });
      }
      existing = await prisma.job.findFirst({
        where: {
          OR: orConditions
        }
      });
    }

    if (existing) {
      await prisma.job.delete({
        where: { id: existing.id }
      });

      // Broadcast real-time deletion event with both ID and Title
      broadcast('JobDeleted', { id: existing.id, title: existing.title });
    } else {
      // Even if not found in database, still broadcast so any active client tab cleans it up
      broadcast('JobDeleted', { id, title: titleQuery || id });
    }

    res.json({
      success: true,
      message: 'Đã xóa vị trí tuyển dụng thành công',
      data: { id: existing ? existing.id : id, title: existing ? existing.title : titleQuery }
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa job', error: error.message });
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
        },
        _count: {
          select: { applications: true }
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
  updateJob,
  deleteJob,
  getJobById
};

