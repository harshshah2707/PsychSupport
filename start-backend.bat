@echo off
echo Starting Python Backend Server...
echo.
cd backend
call venv\Scripts\activate
python app.py
pause