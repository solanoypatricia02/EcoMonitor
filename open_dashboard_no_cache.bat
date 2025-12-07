@echo off
echo ========================================
echo   Opening EcoMonitor Dashboard
echo   (Cache Disabled for Testing)
echo ========================================
echo.

REM Try to open in Chrome with cache disabled
echo Attempting to open in Chrome...
start chrome.exe --disable-cache --incognito "%cd%\web_dashboard\index.html"

REM If Chrome not found, try Edge
if errorlevel 1 (
    echo Chrome not found, trying Edge...
    start msedge.exe --inprivate "%cd%\web_dashboard\index.html"
)

REM If Edge not found, try Firefox
if errorlevel 1 (
    echo Edge not found, trying Firefox...
    start firefox.exe -private-window "%cd%\web_dashboard\index.html"
)

REM If all fail, open with default browser
if errorlevel 1 (
    echo Opening with default browser...
    start "" "%cd%\web_dashboard\index.html"
)

echo.
echo Dashboard opened!
echo.
echo TIP: Press Ctrl+Shift+R to hard refresh if needed
echo.
pause
