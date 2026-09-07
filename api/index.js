/**
 * Vercel Serverless Function Entry Point
 * Wraps the Express app to run as a Vercel serverless function.
 *
 * Tất cả requests tới /api/* sẽ được Vercel route tới đây.
 * Express app đã định nghĩa sẵn các route với prefix /api/ nên hoạt động trực tiếp.
 */

const path = require('path');

// Load environment variables từ server/.env khi chạy trên Vercel
// (vì Vercel không tự tìm .env trong subdirectory)
require('dotenv').config({ path: path.join(__dirname, 'server/.env') });

// Import Express app (app.listen() đã được bỏ qua khi require.main !== module)
const { app } = require('./server/src/index');

// Export Express app làm Vercel serverless handler
module.exports = app;
