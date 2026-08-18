const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { chatWithCandidateAI } = require('../services/aiService');

const prisma = new PrismaClient();

/**
 * POST /api/chat
 * Body: { message, history, cvText }
 */
router.post('/', async (req, res) => {
  try {
    const { message, history = [], cvText = '' } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Nội dung tin nhắn không được để trống' });
    }

    // Fetch active open jobs for context
    const jobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
      select: {
        id: true,
        title: true,
        department: true,
        salaryRange: true,
        requirements: true,
        description: true
      }
    });

    const aiResult = await chatWithCandidateAI(message.trim(), history, jobs, cvText);

    res.json({
      success: true,
      data: {
        reply: aiResult.text,
        isOffTopic: aiResult.isOffTopic
      }
    });
  } catch (error) {
    console.error('Error in chat route:', error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi xử lý tin nhắn từ máy chủ',
      error: error.message
    });
  }
});

module.exports = router;
