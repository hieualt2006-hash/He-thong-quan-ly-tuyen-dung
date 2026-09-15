#!/bin/bash
# =============================================================
#   Smart ATS Pro — Linux Startup Script
#   Tương thích: Fedora, Ubuntu, Debian, ...
#   Tự động phát hiện node_modules từ Windows và cài lại
# =============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo " ============================================"
echo "   Smart ATS Pro  -  Linux Dev Server"
echo " ============================================"
echo "   [SERVER]  Express + Prisma  (port 5000)"
echo "   [CLIENT]  React Vite        (port 5173)"
echo ""
echo "   Mo trinh duyet: http://localhost:5173"
echo " ============================================"
echo ""

# ─── Kiểm tra Node.js ──────────────────────────────────────
if ! command -v node &> /dev/null; then
    echo "❌ Lỗi: Node.js chưa được cài đặt!"
    echo ""
    echo "   Cài đặt Node.js trên Fedora:"
    echo "     sudo dnf install nodejs npm"
    echo ""
    echo "   Hoặc dùng NVM (khuyên dùng):"
    echo "     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "     nvm install 20"
    exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo "✅ Node.js: $NODE_VERSION"
echo "✅ npm:     $NPM_VERSION"
echo ""

# ─── Kiểm tra node_modules có dùng được không ──────────────
NEEDS_REINSTALL=false

# Kiểm tra server nodemon
if [ ! -x "server/node_modules/.bin/nodemon" ]; then
    NEEDS_REINSTALL=true
fi

# Kiểm tra server prisma
if [ ! -x "server/node_modules/.bin/prisma" ]; then
    NEEDS_REINSTALL=true
fi

# Kiểm tra client vite
if [ ! -x "client/node_modules/.bin/vite" ]; then
    NEEDS_REINSTALL=true
fi

# Kiểm tra root concurrently
if [ ! -x "node_modules/.bin/concurrently" ]; then
    NEEDS_REINSTALL=true
fi

if [ "$NEEDS_REINSTALL" = true ]; then
    echo "⚙️  Phát hiện node_modules từ Windows hoặc chưa cài..."
    echo "   Đang xóa và cài lại node_modules cho Linux..."
    echo ""

    rm -rf node_modules server/node_modules client/node_modules

    echo "📦 [1/3] Cài đặt dependencies gốc (root + server + client)..."
    npm run install:all

    if [ $? -ne 0 ]; then
        echo "❌ Lỗi khi cài đặt dependencies! Kiểm tra kết nối mạng."
        exit 1
    fi

    echo ""
    echo "🔧 [2/3] Tạo Prisma Client cho Linux..."
    cd server && npx prisma generate
    if [ $? -ne 0 ]; then
        echo "❌ Lỗi khi generate Prisma Client!"
        exit 1
    fi
    cd ..

    echo ""
    echo "✅ [3/3] Cài đặt hoàn tất!"
    echo ""
else
    echo "✅ node_modules hợp lệ, bỏ qua bước cài đặt."
    echo ""
fi

# ─── Chạy server và client đồng thời ───────────────────────
echo "🚀 Khởi động Smart ATS Pro..."
echo ""
npm run dev


