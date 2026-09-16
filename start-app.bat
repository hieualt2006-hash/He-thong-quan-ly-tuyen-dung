@echo off
title Smart ATS Pro - Unified Dev Server
chcp 65001 >nul

:: Thiet lap duong dan Node.js dung
set "PATH=C:\Program Files\nodejs;%PATH%"

cd /d "%~dp0"

echo.
echo  ============================================
echo   Smart ATS Pro  -  Unified Dev Server
echo  ============================================
echo   [SERVER]  Express + Prisma  (port 5000)
echo   [CLIENT]  React Vite        (port 5173)
echo.
echo   Mo trinh duyet: http://localhost:5173
echo  ============================================
echo.

:: Kiem tra va cai thu vien neu chua co
if not exist "node_modules" (
    echo Cai dat thu vien root...
    call npm install
)
if not exist "server\node_modules" (
    echo Cai dat thu vien server...
    cd /d "%~dp0server" && call npm install && cd /d "%~dp0"
)
if not exist "client\node_modules" (
    echo Cai dat thu vien client...
    cd /d "%~dp0client" && call npm install && cd /d "%~dp0"
)

:: Tao file .env neu chua co
if not exist "server\.env" (
    echo Tao file server\.env...
    echo PORT=5000 > "server\.env"
    echo DATABASE_URL=file:./dev.db >> "server\.env"
)

echo.
echo Dang khoi dong...
echo.
npm run dev
pause
