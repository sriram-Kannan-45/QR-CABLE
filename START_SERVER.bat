@echo off
title WAVE INIT - Starting Servers
color 0A

:: Change to project directory
cd /d "%~dp0"

echo.
echo  ****************************************
echo  *      WAVE INIT - Starting Up        *
echo  ****************************************
echo.

:: Kill existing processes on ports
echo [1/5] Killing existing processes on ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5555 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1
timeout /t 2 /nobreak >nul
echo     Done!

:: Start Backend in new window
echo [2/5] Starting Backend on port 5555...
start "WAVE-BACKEND" cmd /k "cd /d %~dp0backend && echo [BACKEND] Starting... && mvn spring-boot:run -q"

timeout /t 10 /nobreak >nul

:: Start Frontend in new window  
echo [3/5] Starting Frontend on port 4000...
start "WAVE-FRONTEND" cmd /k "cd /d %~dp0frontend\react-client && echo [FRONTEND] Starting... && npm start"

timeout /t 5 /nobreak >nul

:: Open browser
echo [4/5] Opening browser...
start http://localhost:4000

echo.
echo [5/5] DONE!
echo.
echo  ****************************************
echo  *  Backend: http://localhost:5555      *
echo  *  Frontend: http://localhost:4000    *
echo  ****************************************
echo.
echo  Two windows will open for servers.
echo  Close this window to exit.
echo.

pause
