/**
 * Vercel Serverless Function Entry Point
 * Wraps the Express app to run as a Vercel serverless function.
 *
 * Tất cả requests tới /api/* sẽ được Vercel route tới đây.
 * Express app đã định nghĩa sẵn các route với prefix /api/ nên hoạt động trực tiếp.
 */

const path = require('path');

// Load environment variables từ server/.env khi chạy trên Vercel
try {
  require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
} catch (e) {
  // ignore
}

let app;
try {
  // Import Express app (app.listen() đã được bỏ qua khi require.main !== module)
  const server = require('../server/src/index');
  app = server.app;
} catch (e) {
  console.error('Error importing Express app in api/index.js:', e);
  const express = require('express');
  app = express();
  app.all('*', (req, res) => {
    res.status(503).json({
      error: 'Backend Serverless unavailable',
      message: 'Vui lòng sử dụng phiên bản Localhost hoặc thiết lập cơ sở dữ liệu cloud.'
    });
  });
}

// Export Express app làm Vercel serverless handler
module.exports = app;

