const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Seed initial Admin & HR accounts if they don't exist
async function seedDefaultUsers() {
  try {
    const adminExists = await prisma.user.findFirst({
      where: { email: 'admin@smartats.com' }
    });
    if (!adminExists) {
      await prisma.user.create({
        data: {
          email: 'admin@smartats.com',
          name: 'Quản Trị Viên (Admin)',
          password: 'admin123',
          role: 'ADMIN'
        }
      });
      console.log('✅ Created default Admin account: admin@smartats.com / admin123');
    }

    const hrExists = await prisma.user.findFirst({
      where: { email: 'hr@smartats.com' }
    });
    if (!hrExists) {
      await prisma.user.create({
        data: {
          email: 'hr@smartats.com',
          name: 'Chuyên Viên Tuyển Dụng (HR)',
          password: 'hr123',
          role: 'HR'
        }
      });
      console.log('✅ Created default HR account: hr@smartats.com / hr123');
    }
  } catch (err) {
    console.warn('⚠️ Note on seeding default users:', err.message);
  }
}

// Trigger seeding
seedDefaultUsers();

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ Email/Tài khoản và Mật khẩu'
      });
    }

    // Support both direct email matching or username shortcut (e.g. 'admin' or 'admin@smartats.com')
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.trim().toLowerCase() },
          { email: `${email.trim().toLowerCase()}@smartats.com` }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại trong hệ thống'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không chính xác'
      });
    }

    // Return user info without password
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    };

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: safeUser,
        token: `ats_token_${user.id}_${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đăng nhập',
      error: error.message
    });
  }
};

// POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ mật khẩu hiện tại và mật khẩu mới'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin tài khoản'
      });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword }
    });

    return res.json({
      success: true,
      message: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật mật khẩu',
      error: error.message
    });
  }
};

// GET /api/auth/users (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách người dùng',
      error: error.message
    });
  }
};

// POST /api/auth/users (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ Tên, Email và Mật khẩu'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng cho một tài khoản khác'
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: password,
        role: role === 'ADMIN' ? 'ADMIN' : 'HR'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      success: true,
      message: `Đã cấp tài khoản thành công cho ${newUser.name} (${newUser.role})`,
      data: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Không thể tạo tài khoản mới',
      error: error.message
    });
  }
};

// DELETE /api/auth/users/:id (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentUserId } = req.query;

    if (id === currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'Bạn không thể tự xóa tài khoản của chính mình khi đang đăng nhập'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Tài khoản cần xóa không tồn tại'
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: `Đã xóa tài khoản ${user.name} (${user.email}) thành công`
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa tài khoản',
      error: error.message
    });
  }
};
