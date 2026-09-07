const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Phát hiện môi trường Vercel (serverless — filesystem read-only)
const isVercel = !!process.env.VERCEL;

let storage;

if (isVercel) {
  // Trên Vercel: dùng memory storage (file lưu trong RAM, không cần disk)
  // Text sẽ được trích xuất từ buffer rồi lưu vào DB, không lưu file vật lý
  storage = multer.memoryStorage();
} else {
  // Local: dùng disk storage như bình thường
  const uploadDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `cv-${uniqueSuffix}${ext}`);
    }
  });
}

// File Filter: chỉ chấp nhận PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận upload file định dạng PDF!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;
