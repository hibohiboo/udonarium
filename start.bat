@echo off
chcp 65001 > nul
echo Starting development environment...

REM フロントエンド起動（新しいウィンドウ）
start "Frontend" cmd /k "npm run start"

REM バックエンド起動（新しいウィンドウ）
start "Backend" cmd /k "cd backend && npm run dev"

echo Waiting for frontend to start...
timeout /t 5 /nobreak > nul

REM cloudflared 起動・URL取得・ブラウザで開く
echo Starting cloudflared tunnel...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-cloudflared.ps1"

pause
