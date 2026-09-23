const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { extractTextFromPdf } = require('../services/pdfService');
const { analyzeCvMatch } = require('../services/aiService');
const { addClient, removeClient, broadcast } = require('../sse');

/**
 * GET /api/public/events - SSE endpoint for real-time updates
 */
function sseHandler(req, res) {
  // Set SSE response headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*'
  });

  // Initial connection handshake
  res.write(':connected\n\n');
  addClient(res);

  // Heartbeat ping every 25s to keep connection alive
  const heartbeatTimer = setInterval(() => {
    try {
      res.write(':heartbeat\n\n');
    } catch (err) {
      clearInterval(heartbeatTimer);
      removeClient(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeatTimer);
    removeClient(res);
  });
}

/**
 * GET /api/public/jobs - Retrieve list of open job postings for public candidate portal
 */
async function getPublicJobs(req, res) {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: 'Open'
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        department: true,
        description: true,
        requirements: true,
        salaryRange: true,
        status: true,
        toRecruit: true,
        email: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching public jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách vị trí tuyển dụng',
      error: error.message
    });
  }
}

/**
 * POST /api/public/applications - Candidate submits application with PDF CV
 */
async function submitPublicApplication(req, res) {
  try {
    const { fullName, email, phone, jobId } = req.body;
    const file = req.file;

    // Validate required fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập họ và tên của bạn'
      });
    }

    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp địa chỉ email hợp lệ'
      });
    }

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn vị trí tuyển dụng'
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng đính kèm file CV định dạng PDF'
      });
    }

    // Verify Job exists and is currently OPEN
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job || job.status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: 'Vị trí này vừa dừng tiếp nhận hồ sơ hoặc không tồn tại. Vui lòng chọn vị trí khác.'
      });
    }

    // Extract text from CV
    let cvPath = null;
    let rawCvText = null;

    try {
      if (file.buffer) {
        // In-memory (e.g. Vercel)
        rawCvText = await extractTextFromPdf(file.buffer);
      } else {
        // Disk storage (Local)
        cvPath = `/uploads/${file.filename}`;
        rawCvText = await extractTextFromPdf(file.path);
      }
    } catch (parseError) {
      console.warn('PDF parsing warning:', parseError.message);
      rawCvText = `CV submitted by ${fullName.trim()} for ${job.title}`;
    }

    // Upsert Candidate record
    let candidate = await prisma.candidate.findFirst({
      where: { email: email.trim() }
    });

    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone ? phone.trim() : '',
          cvPath,
          rawCvText
        }
      });
    } else {
      candidate = await prisma.candidate.update({
        where: { id: candidate.id },
        data: {
          fullName: fullName.trim(),
          phone: phone ? phone.trim() : candidate.phone,
          cvPath: cvPath || candidate.cvPath,
          rawCvText: rawCvText || candidate.rawCvText
        }
      });
    }

    // Create Application
    let application = await prisma.application.create({
      data: {
        jobId: job.id,
        candidateId: candidate.id,
        status: 'Applied',
        matchScore: null,
        matchSummary: 'Đang phân tích hồ sơ bằng AI...',
        missingSkills: null
      }
    });

    // Run AI analysis asynchronously or synchronously
    try {
      const textToAnalyze = rawCvText || `${candidate.fullName} - ${candidate.email}`;
      const aiResult = await analyzeCvMatch(textToAnalyze, job.requirements);

      const missingSkillsStr = Array.isArray(aiResult.missingSkills)
        ? aiResult.missingSkills.join(', ')
        : (aiResult.missingSkills || '');

      application = await prisma.application.update({
        where: { id: application.id },
        data: {
          matchScore: aiResult.matchScore,
          matchSummary: aiResult.summary,
          missingSkills: missingSkillsStr
        }
      });

      if (Array.isArray(aiResult.suggestedQuestions) && aiResult.suggestedQuestions.length > 0) {
        const questionData = aiResult.suggestedQuestions.map((qText, index) => ({
          applicationId: application.id,
          questionText: qText,
          category: index === 0 ? 'Technical' : index === 1 ? 'Architecture' : 'Behavioral'
        }));

        await prisma.question.createMany({
          data: questionData
        });
      }
    } catch (aiErr) {
      console.warn('AI analysis in public application error:', aiErr.message);
    }

    // Calculate current count of new applications for this job
    const newCount = await prisma.application.count({
      where: {
        jobId: job.id,
        status: 'Applied'
      }
    });

    // Broadcast SSE event to notify HR admin in real-time
    broadcast('NewApplicationReceived', {
      jobId: job.id,
      jobTitle: job.title,
      candidateName: candidate.fullName,
      candidateEmail: candidate.email,
      applicationId: application.id,
      newCount,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Hồ sơ ứng tuyển của bạn đã được gửi thành công!',
      data: {
        applicationId: application.id,
        jobTitle: job.title,
        candidateName: candidate.fullName
      }
    });
  } catch (error) {
    console.error('Error submitting public application:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi nộp hồ sơ ứng tuyển',
      error: error.message
    });
  }
}

module.exports = {
  sseHandler,
  getPublicJobs,
  submitPublicApplication
};
