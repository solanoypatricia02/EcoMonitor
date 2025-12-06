@echo off
echo ========================================
echo   EcoMonitor - Push to GitHub
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init
echo.

echo Step 2: Adding remote repository...
git remote add origin https://github.com/solanoypatricia02/EcoMonitor.git
echo.

echo Step 3: Checking status...
git status
echo.

echo Step 4: Adding all files...
git add .
echo.

echo Step 5: Committing changes...
git commit -m "Initial commit: EcoMonitor Environmental Monitoring System - ESP32 firmware with DHT22 and MQ135 sensors - Firebase Realtime Database integration - Modern PWA web dashboard with real-time charts - Smart alert system with visual and audio notifications - Heartbeat animations for critical states - Custom threshold configuration - Data export (CSV/PDF) with AI insights - Predictive analytics - Dark mode support - Python backend for analysis - Comprehensive documentation"
echo.

echo Step 6: Renaming branch to main...
git branch -M main
echo.

echo Step 7: Pushing to GitHub...
git push -u origin main
echo.

echo ========================================
echo   Push Complete!
echo ========================================
echo.
echo Visit your repository at:
echo https://github.com/solanoypatricia02/EcoMonitor
echo.
pause
