@echo off
echo ========================================
echo   Push EcoMonitor to GitHub
echo ========================================
echo.
echo IMPORTANT: You need a Personal Access Token
echo.
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Select 'repo' scope
echo 4. Copy the token
echo.
set /p TOKEN="Paste your GitHub token here: "
echo.
echo Pushing to GitHub...
git push https://%TOKEN%@github.com/solanoypatricia02/EcoMonitor.git main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo   SUCCESS! Project pushed to GitHub
    echo ========================================
    echo.
    echo Visit: https://github.com/solanoypatricia02/EcoMonitor
) else (
    echo ========================================
    echo   ERROR: Push failed
    echo ========================================
    echo Check your token and try again
)
echo.
pause
