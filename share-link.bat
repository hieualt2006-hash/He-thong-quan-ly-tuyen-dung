@echo off
title Share Public Link via Localtunnel
set PATH=C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Microsoft\VisualStudio\NodeJs;%PATH%
echo =========================================================
echo 📦 Building latest React Client bundle for Public Link...
echo =========================================================
cd /d "%~dp0client"
call npm run build
cd /d "%~dp0"

echo.
echo =========================================================
echo 🚀 Ensuring Server (Port 5000) is running...
echo =========================================================
start "" "%~dp0start-server.bat"
timeout /t 3 >nul

echo.
echo =========================================================
echo 🌐 Creating Public Link for ATS System...
echo =========================================================
echo.
echo Your public link will appear below (e.g. https://...loca.lt):
echo.
npx localtunnel --port 5000
pause

