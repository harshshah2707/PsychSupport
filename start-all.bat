@echo off
echo.
echo ==========================================
echo   Crisis Detection System - Starting
echo ==========================================
echo.
echo Starting Backend Server...
start "Backend Server" start-backend.bat
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Server...
start "Frontend Server" start-frontend.bat
echo.
echo Both servers are starting...
echo.
echo ==========================================
echo   URLs:
echo   Backend API: http://localhost:5000/api
echo   Frontend:    http://localhost:3000
echo ==========================================
echo.
pause