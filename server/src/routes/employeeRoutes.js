const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/employees - Danh sách nhân viên
router.get('/', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'asc' },
      include: { manager: { select: { id: true, name: true, position: true } } }
    });
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/employees/:id - Chi tiết nhân viên
router.get('/:id', async (req, res) => {
  try {
    const emp = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: {
        manager: { select: { id: true, name: true, position: true, avatarUrl: true } },
        reports: { select: { id: true, name: true, position: true, avatarUrl: true } }
      }
    });
    if (!emp) return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/employees - Thêm nhân viên mới
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, position, department, managerId, avatarUrl, workAddress, workSchedule, companyId } = req.body;
    if (!name || !email || !position || !department) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }
    const emp = await prisma.employee.create({
      data: {
        name, email, phone: phone || '',
        position, department,
        managerId: managerId || null,
        avatarUrl: avatarUrl || null,
        workAddress: workAddress || null,
        workSchedule: workSchedule || JSON.stringify({ mon: true, tue: true, wed: true, thu: true, fri: true }),
        companyId: companyId || 'default'
      }
    });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/employees/:id - Cập nhật nhân viên
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, position, department, managerId, avatarUrl, workAddress, workSchedule, status } = req.body;
    const emp = await prisma.employee.update({
      where: { id: req.params.id },
      data: { name, email, phone, position, department, managerId: managerId || null, avatarUrl, workAddress, workSchedule, status }
    });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/employees/:id - Xóa nhân viên
router.delete('/:id', async (req, res) => {
  try {
    await prisma.employee.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Đã xóa nhân viên' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
