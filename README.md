# Hệ Thống Quản Lý Tuyển Dụng Tích Hợp AI (AI-Powered Recruitment System - Monorepo)

Hệ thống Quản lý Tuyển dụng thông minh (ATS) tích hợp công nghệ AI nhằm tối ưu hóa quy trình sàng lọc hồ sơ ứng viên, tự động tạo mô tả công việc (Job Description) và tính toán điểm tương thích (Match Score) giữa ứng viên với vị trí tuyển dụng.

Dự án được xây dựng theo kiến trúc tách rời (**Decoupled Architecture**) dành cho đồ án sinh viên:

---

## 🏗️ Cấu Trúc Dự Án (Monorepo Structure)

```text
He thong quan ly tuyen dung tich hop AI/
├── server/                           # Backend Node.js Express & Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma             # Prisma Schema (Job, Candidate, Application, Question)
│   │   └── dev.db                    # Database SQLite
│   ├── src/
│   │   └── index.js                  # Entry point Express server & CORS configuration
│   ├── .env                          # Biến môi trường (PORT=5000, DATABASE_URL)
│   └── package.json
│
├── client/                           # Frontend React (Vite) & Tailwind CSS
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js                # Axios instance kết nối Express API
│   │   ├── App.jsx                   # Dashboard ATS (Jobs, Candidates, Applications, AI Studio)
│   │   ├── index.css                 # Tailwind CSS configuration & styles
│   │   └── main.jsx
│   ├── vite.config.js                # Vite configuration
│   └── package.json
│
└── README.md                         # Hướng dẫn cài đặt và chạy ứng dụng
```

---

## 🚀 Hướng Dẫn Chạy Dự Án

### 1. Yêu Cầu Tiền Trạm (Prerequisites)
- **Node.js** (v18+ hoặc v20+)
- **npm** (v9+ hoặc v10+)

---

### 2. Khởi Chạy Backend Server (`/server`)

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt phụ thuộc (nếu chưa cài)
npm install

# Chạy Prisma migration (nếu cần sync DB)
npx prisma migrate dev

# Khởi chạy Express Server
npm run dev
```

- 🌐 **Express Base API**: `http://localhost:5000`
- 📌 **API Health Check**: `http://localhost:5000/api/health`

---

### 3. Khởi Chạy Frontend Client (`/client`)

```bash
# Mở terminal mới, di chuyển vào thư mục client
cd client

# Cài đặt phụ thuộc (nếu chưa cài)
npm install

# Khởi chạy React Vite Web Server
npm run dev
```

- 🌐 **Giao diện Client Web**: `http://localhost:5173`

---

## 🗄️ Prisma Database Schema

Cơ sở dữ liệu SQLite trong `/server` gồm 4 bảng chính:
- **`Job`**: `id`, `title`, `department`, `description`, `requirements`, `salaryRange`, `status`
- **`Candidate`**: `id`, `fullName`, `email`, `phone`, `cvPath`, `rawCvText`, `createdAt`
- **`Application`**: `id`, `jobId`, `candidateId`, `matchScore`, `matchSummary`, `missingSkills`, `status` (`Applied` | `Interview` | `Hired` | `Rejected`)
- **`Question`**: `id`, `applicationId`, `questionText`, `category`
