@echo off
rem ============================================================================
rem  Worker for the "egress IP change monitor" scheduled task.
rem  Normally invoked by Windows Task Scheduler -- you rarely run this by hand.
rem
rem  Why a wrapper script is needed:
rem    1. Task Scheduler has NO "start in" option -- we must cd explicitly,
rem       otherwise the tool cannot find .env in the project root.
rem    2. Task Scheduler does NOT inherit your PATH -- node must be located
rem       by absolute path instead of assuming a "node" command exists.
rem    3. Output must go to a file, otherwise a failure leaves no trace at all.
rem
rem  Exit codes: 0 publishable / 1 blocked / 2 credentials missing / 127 no node
rem
rem  NOTE: kept ASCII-only on purpose. Batch files with multi-byte characters
rem        break depending on the active code page (cmd re-reads the file by
rem        byte offset), so all messages here are English for reliability.
rem ============================================================================
setlocal EnableExtensions

rem Project root = two levels above tools\win\ (%~dp0 already ends with a slash)
for %%I in ("%~dp0..\..") do set "PROJECT_DIR=%%~fI"

set "LOG_DIR=%PROJECT_DIR%\logs"
set "LOG_FILE=%LOG_DIR%\ip-watch.log"
set "MAX_LOG_BYTES=1048576"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%" 2>nul

rem --- Log rotation: archive once past 1MB so it cannot grow forever ---
if exist "%LOG_FILE%" (
  for %%A in ("%LOG_FILE%") do if %%~zA GTR %MAX_LOG_BYTES% (
    if exist "%LOG_FILE%.1" del /q "%LOG_FILE%.1" 2>nul
    move /y "%LOG_FILE%" "%LOG_FILE%.1" >nul 2>&1
  )
)

rem --- Locate node: prefer an injected NODE_EXE, otherwise probe ---
if not defined NODE_EXE (
  for /f "delims=" %%I in ('where node 2^>nul') do (
    if not defined NODE_EXE set "NODE_EXE=%%I"
  )
)
if not defined NODE_EXE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE_EXE if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles(x86)%\nodejs\node.exe"
if not defined NODE_EXE if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE_EXE=%LOCALAPPDATA%\Programs\nodejs\node.exe"

if not defined NODE_EXE (
  >>"%LOG_FILE%" echo [%DATE% %TIME%] ERROR: node.exe not found. Set NODE_EXE for this task.
  endlocal & exit /b 127
)

if not exist "%PROJECT_DIR%\tools\ip-watch.js" (
  >>"%LOG_FILE%" echo [%DATE% %TIME%] ERROR: %PROJECT_DIR%\tools\ip-watch.js not found.
  endlocal & exit /b 127
)

rem --- Locale-independent ASCII timestamp ---
rem %DATE% / %TIME% are localized (on a Chinese Windows %DATE% contains the
rem weekday in Chinese as GBK bytes), which would mix a second encoding into a
rem log whose other content is UTF-8 from node. Editors can then only render
rem one half correctly. PowerShell gives us a stable ISO-like ASCII stamp.
set "TS="
for /f "delims=" %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH:mm:ss" 2^>nul') do set "TS=%%I"
if not defined TS set "TS=unknown-time"

rem The cd is essential -- without it the tool cannot read .env
cd /d "%PROJECT_DIR%"

>>"%LOG_FILE%" echo.
>>"%LOG_FILE%" echo ============================================================
>>"%LOG_FILE%" echo [%TS%] check started  (node: %NODE_EXE%)

rem Notifications (if configured) are sent by the script itself.
rem --quiet only silences the console; this wrapper records everything to the log.
"%NODE_EXE%" "tools\ip-watch.js" --quiet >>"%LOG_FILE%" 2>&1
set "RC=%ERRORLEVEL%"

>>"%LOG_FILE%" echo [%TS%] finished, exit code %RC%
if "%RC%"=="0" >>"%LOG_FILE%" echo status: OK (publishable)
if "%RC%"=="1" >>"%LOG_FILE%" echo status: BLOCKED - run "npm run wechat:check" for details
if "%RC%"=="2" >>"%LOG_FILE%" echo status: CREDENTIALS MISSING - check WECHAT_APPID / WECHAT_SECRET in .env
if "%RC%"=="127" >>"%LOG_FILE%" echo status: ENVIRONMENT ERROR - node or script not found

endlocal & exit /b %RC%
