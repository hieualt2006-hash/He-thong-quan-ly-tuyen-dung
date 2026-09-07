@echo off
title Smart ATS Pro — Unified Dev Server
chcp 65001 >nul

:: Set Node.js path (Visual Studio bundled Node)
set "NODE_PATH=C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Microsoft\VisualStudio\NodeJs"
set "PATH=%NODE_PATH%;%PATH%"

echo.
echo  ============================================
echo   Smart ATS Pro  -  Unified Dev Server
echo  ============================================
echo.
echo   [SERVER]  Express + Prisma  (port 5000)
echo   [CLIENT]  React Vite        (port 5173)
echo.
echo   Mo trinh duyet: http://localhost:5173
echo  ============================================
echo.

cd /d "%~dp0"
npm run dev
pause
