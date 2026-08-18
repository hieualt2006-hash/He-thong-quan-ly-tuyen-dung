const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { extractTextFromPdf } = require('../services/pdfService');
const { analyzeCvMatch } = require('../services/aiService');

/**
 * POST /api/applications - Submit Candidate Info + CV PDF File & Trigger AI Matching
 */
async function createApplication(req, res) {
  try {
    const { fullName, email, phone, jobId } = req.body;
    const file = req.file;

    if (!fullName || !email || !jobId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp fullName, email, và jobId'
      });
    }

    // Check if Job exists
    const jobExists = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: 'Công việc không tồn tại'
      });
    }

    let cvPath = null;
    let rawCvText = null;

    if (file) {
      cvPath = `/uploads/${file.filename}`;
      // Extract raw text from uploaded PDF
      rawCvText = await extractTextFromPdf(file.path);
    }

    // Find or create Candidate by email
    let candidate = await prisma.candidate.findFirst({
      where: { email }
    });

    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          fullName,
          email,
          phone: phone || '',
          cvPath,
          rawCvText
        }
      });
    } else {
      // Update candidate details if new CV uploaded
      candidate = await prisma.candidate.update({
        where: { id: candidate.id },
        data: {
          fullName,
          phone: phone || candidate.phone,
          cvPath: cvPath || candidate.cvPath,
          rawCvText: rawCvText || candidate.rawCvText
        }
      });
    }

    // Initial Application creation
    let application = await prisma.application.create({
      data: {
        jobId,
        candidateId: candidate.id,
        status: 'Applied',
        matchScore: null,
        matchSummary: 'Đang tiến hành phân tích AI...',
        missingSkills: null
      }
    });

    // 🤖 Trigger AI Analysis
    const textToAnalyze = rawCvText || candidate.rawCvText || `${candidate.fullName} - ${candidate.email}`;
    const aiResult = await analyzeCvMatch(textToAnalyze, jobExists.requirements);

    // Format missing skills array into string
    const missingSkillsStr = Array.isArray(aiResult.missingSkills) 
      ? aiResult.missingSkills.join(', ')
      : (aiResult.missingSkills || '');

    // Update Application with AI results
    application = await prisma.application.update({
      where: { id: application.id },
      data: {
        matchScore: aiResult.matchScore,
        matchSummary: aiResult.summary,
        missingSkills: missingSkillsStr
      }
    });

    // Insert Suggested Interview Questions into Question table
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

    // Retrieve full application detail with relations
    const fullApplication = await prisma.application.findUnique({
      where: { id: application.id },
      include: {
        job: true,
        candidate: true,
        questions: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Nộp hồ sơ ứng tuyển & phân tích AI thành công',
      data: fullApplication
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo đơn ứng tuyển', error: error.message });
  }
}

/**
 * GET /api/applications/:id - Get Application detail including candidate, job, AI scoring & questions
 */
async function getApplicationById(req, res) {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
        candidate: true,
        questions: true
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Hồ sơ ứng tuyển không tồn tại'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching application detail:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy chi tiết hồ sơ', error: error.message });
  }
}

/**
 * PATCH /api/applications/:id/status - Update Application status
 */
async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Applied', 'Interview', 'Offered', 'Hired', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái không hợp lệ. Phải là một trong: ${validStatuses.join(', ')}`
      });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: true,
        candidate: true,
        questions: true
      }
    });

    res.json({
      success: true,
      message: `Đã cập nhật trạng thái hồ sơ thành '${status}'`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trạng thái hồ sơ', error: error.message });
  }
}

module.exports = {
  createApplication,
  getApplicationById,
  updateApplicationStatus
};
