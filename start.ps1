# WAVE INIT - Quick Start Script
# Run this in PowerShell: .\start.ps1

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   WAVE INIT - Starting Servers..." -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Kill existing processes on ports
Write-Host "[1/4] Clearing ports 5555 and 4000..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 5555 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# Start Backend
Write-Host "[2/4] Starting Backend (Port 5555)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '[BACKEND] Starting Spring Boot...' -ForegroundColor Cyan; mvn spring-boot:run"

Start-Sleep -Seconds 10

# Start Frontend
Write-Host "[3/4] Starting Frontend (Port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend\react-client'; Write-Host '[FRONTEND] Starting React...' -ForegroundColor Green; npm start"

Start-Sleep -Seconds 5

# Open Browser
Write-Host "[4/4] Opening browser..." -ForegroundColor Yellow
Start-Process http://localhost:4000

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   Servers Starting!" -ForegroundColor Green
Write-Host "   Backend: http://localhost:5555" -ForegroundColor White
Write-Host "   Frontend: http://localhost:4000" -ForegroundColor White
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host
