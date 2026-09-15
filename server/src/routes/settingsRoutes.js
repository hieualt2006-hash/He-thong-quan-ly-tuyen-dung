const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/settings/stages - Danh sách giai đoạn tuyển dụng
router.get('/stages', async (req, res) => {
  try {
    const stages = await prisma.recruitmentStage.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: stages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings/stages - Cập nhật giai đoạn
router.put('/stages', async (req, res) => {
  try {
    const { stages } = req.body; // [{ id, name, order, color }]
    await prisma.$transaction(
      stages.map(s => prisma.recruitmentStage.upsert({
        where: { id: s.id || 'new' },
        update: { name: s.name, order: s.order, color: s.color },
        create: { name: s.name, order: s.order, color: s.color }
      }))
    );
    res.json({ success: true, message: 'Đã lưu các giai đoạn tuyển dụng' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/settings/stages/:id
router.delete('/stages/:id', async (req, res) => {
  try {
    await prisma.recruitmentStage.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/settings/smtp
router.get('/smtp', async (req, res) => {
  try {
    const smtp = await prisma.smtpConfig.findFirst();
    res.json({ success: true, data: smtp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings/smtp
router.put('/smtp', async (req, res) => {
  try {
    const { host, port, username, password, useTls, fromName } = req.body;
    const existing = await prisma.smtpConfig.findFirst();
    const data = { host, port: Number(port), username, password, useTls: Boolean(useTls), fromName };
    const smtp = existing
      ? await prisma.smtpConfig.update({ where: { id: existing.id }, data })
      : await prisma.smtpConfig.create({ data });
    res.json({ success: true, data: smtp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/settings/email-templates
router.get('/email-templates', async (req, res) => {
  try {
    const templates = await prisma.emailTemplate.findMany();
    res.json({ success: true, data: templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings/email-templates/:type
router.put('/email-templates/:type', async (req, res) => {
  try {
    const { subject, body } = req.body;
    const template = await prisma.emailTemplate.upsert({
      where: { type: req.params.type },
      update: { subject, body },
      create: { type: req.params.type, subject, body }
    });
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
