#!/usr/bin/env bash
echo "========================================================"
echo "    🚀 KHỞI ĐỘNG HỆ THỐNG SMART ATS (C# ASP.NET CORE)   "
echo "========================================================"
echo "Địa chỉ Admin: http://localhost:5050"
echo "Bảng Kanban: http://localhost:5050/Pipeline"
echo "Public API: POST http://localhost:5050/api/applications"
echo "========================================================"

cd "$(dirname "$0")/SmartATS"
dotnet run --urls "http://localhost:5050"
