@echo off
title ATS Server Backend (Port 5000)
set PATH=C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Microsoft\VisualStudio\NodeJs;%PATH%
cd /d "%~dp0server"
echo ===================================================
echo 🚀 Starting ATS Express Server on http://localhost:5000
echo ===================================================
npm run dev
pause
