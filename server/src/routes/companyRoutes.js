const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/company - Thông tin công ty
router.get('/', async (req, res) => {
  try {
    const company = await prisma.company.findFirst();
    res.json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/company - Cập nhật thông tin công ty
router.put('/', async (req, res) => {
  try {
    const { name, email, phone, address, logoUrl } = req.body;
    const existing = await prisma.company.findFirst();
    if (!existing) return res.status(404).json({ success: false, message: 'Chưa có thông tin công ty' });
    const updated = await prisma.company.update({
      where: { id: existing.id },
      data: { name, email, phone, address, logoUrl }
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/company/register - Tạo công ty mới + Admin user đầu tiên
router.post('/register', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { ownerName, companyName, email, phone, country, language, size, purpose, password } = req.body;

    if (!ownerName || !companyName || !email) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const existing = await prisma.company.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email công ty này đã được đăng ký' });
    }

    // Tạo company
    const company = await prisma.company.create({
      data: {
        name: companyName,
        ownerName,
        email,
        phone: phone || '',
        country: country || 'Việt Nam',
        language: language || 'Tiếng Việt',
        size: size || '1 - 5 nhân viên',
        purpose: purpose || 'Sử dụng cho công ty của tôi'
      }
    });

    // Tạo Admin user đầu tiên
    const hash = await bcrypt.hash(password || 'Admin@123', 10);
    const user = await prisma.user.create({
      data: {
        name: ownerName,
        email,
        password: hash,
        role: 'ADMIN',
        companyId: company.id
      }
    });

    // Seed giai đoạn tuyển dụng mặc định
    await prisma.recruitmentStage.createMany({
      data: [
        { name: 'Nhận CV', order: 1, color: '#6366f1' },
        { name: 'Sơ loại', order: 2, color: '#f59e0b' },
        { name: 'Phỏng vấn', order: 3, color: '#3b82f6' },
        { name: 'Đề nghị nhận việc', order: 4, color: '#10b981' }
      ],
      skipDuplicates: true
    });

    res.json({
      success: true,
      message: 'Công ty đã được tạo thành công!',
      data: {
        company,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, companyId: user.companyId }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
