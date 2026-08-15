@echo off
title ATS Client Frontend (Port 5173)
set PATH=C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Microsoft\VisualStudio\NodeJs;%PATH%
cd /d "%~dp0client"
echo ===================================================
echo 🌐 Starting ATS React Client on http://localhost:5173
echo ===================================================
npm run dev
pause
