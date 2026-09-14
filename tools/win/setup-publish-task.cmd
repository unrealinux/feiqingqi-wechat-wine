@echo off
rem ============================================================================
rem  Register / remove the "publish pending articles" Windows scheduled task.
rem
rem  Usage:
rem    setup-publish-task.cmd                          Install (daily at 09:00)
rem    setup-publish-task.cmd install HOURLY 08:00     Hourly starting at 08:00
rem    setup-publish-task.cmd install HOURLY 08:00 4   Every 4 hours
rem    setup-publish-task.cmd install DAILY 21:30      Daily at 21:30
rem    setup-publish-task.cmd run                      Run once now (verify setup)
rem    setup-publish-task.cmd status                   Show task state + recent log
rem    setup-publish-task.cmd uninstall                Remove the task
rem
rem  What it publishes:
rem    Only articles under articles\ that have NOT been given a draft yet.
rem    The very first run only records a baseline (it does NOT create drafts for
rem    every existing article). Details: tools\publish-pending.js
rem
rem  Design notes:
rem    * Action = wscript.exe -> run-hidden.vbs -> run-publish.cmd
rem      The VBS layer exists purely to remove the console window flash.
rem    * Paths are written with \" escaping, so a project path containing
rem      spaces still works (verified empirically).
rem    * Re-installing is idempotent (delete-then-create).
rem    * Runs as the CURRENT USER, so NO administrator rights are required.
rem
rem  NOTE: kept ASCII-only on purpose. Batch files containing multi-byte
rem        characters are parsed unreliably depending on the active code page
rem        (cmd re-reads the file by byte offset), which caused rem/echo lines
rem        to be executed as commands during testing.
rem ============================================================================
setlocal EnableExtensions

set "TASK_NAME=FeiqingqiWechatMP-Publish"
for %%I in ("%~dp0..\..") do set "PROJECT_DIR=%%~fI"
set "VBS=%PROJECT_DIR%\tools\win\run-hidden.vbs"
set "RUNNER=%PROJECT_DIR%\tools\win\run-publish.cmd"
set "LOG=%PROJECT_DIR%\logs\publish.log"

set "ACTION=%~1"
set "SCHEDULE=%~2"
set "STARTTIME=%~3"
set "MODIFIER=%~4"

if /i "%ACTION%"=="uninstall" goto :uninstall
if /i "%ACTION%"=="remove"    goto :uninstall
if /i "%ACTION%"=="run"       goto :runnow
if /i "%ACTION%"=="status"    goto :status
if /i "%ACTION%"=="install"   goto :install
if "%ACTION%"==""             goto :install
goto :usage


:install
if "%SCHEDULE%"==""  set "SCHEDULE=DAILY"
if "%STARTTIME%"=="" set "STARTTIME=09:00"

if not exist "%VBS%"    ( echo [X] missing %VBS% & goto :fail )
if not exist "%RUNNER%" ( echo [X] missing %RUNNER% & goto :fail )

rem Delete-then-create so re-running is idempotent
schtasks /query /tn "%TASK_NAME%" >nul 2>&1
if not errorlevel 1 (
  echo [-] removing existing task with the same name
  schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1
)

echo [*] registering task %TASK_NAME%
echo     schedule : %SCHEDULE% %STARTTIME% (modifier: %MODIFIER%)
echo     action   : wscript.exe "%VBS%" "%RUNNER%"

if "%MODIFIER%"=="" (
  schtasks /create /tn "%TASK_NAME%" /tr "wscript.exe \"%VBS%\" \"%RUNNER%\"" /sc %SCHEDULE% /st %STARTTIME% /f
) else (
  schtasks /create /tn "%TASK_NAME%" /tr "wscript.exe \"%VBS%\" \"%RUNNER%\"" /sc %SCHEDULE% /mo %MODIFIER% /st %STARTTIME% /f
)

if errorlevel 1 goto :fail

echo.
echo [OK] task registered.
echo      check status :  setup-publish-task.cmd status
echo      run once now :  setup-publish-task.cmd run
echo.
echo Note: the task creates DRAFTS only -- it never mass-publishes to followers.
echo       Review the draft box, then publish manually.
echo Note: the task runs as the current user and only while you are logged on,
echo       which is why it needs no administrator rights.
endlocal & exit /b 0


:uninstall
schtasks /query /tn "%TASK_NAME%" >nul 2>&1
if errorlevel 1 (
  echo [-] task %TASK_NAME% does not exist, nothing to remove
  endlocal & exit /b 0
)
schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1
if errorlevel 1 goto :fail
echo [OK] task %TASK_NAME% removed
endlocal & exit /b 0


:runnow
echo [*] running once via the exact same entry point the task uses
call "%RUNNER%"
echo.
echo [i] exit code %ERRORLEVEL%  (0 ok / 1 some failed / 127 no node)
if exist "%LOG%" (
  echo.
  echo ---- tail of log ----
  powershell -NoProfile -Command "[Console]::OutputEncoding=[Text.Encoding]::UTF8; Get-Content -LiteralPath '%LOG%' -Encoding UTF8 -Tail 20"
)
endlocal & exit /b 0


rem NOTE: do not parse schtasks' LIST output -- its field names are localized,
rem so an English findstr pattern gives a false "not registered" on e.g. a
rem Chinese Windows. Existence is checked via the exit code instead, and the
rem raw (localized) detail is printed for the human reading it.
:status
echo ============ task ============
schtasks /query /tn "%TASK_NAME%" >nul 2>&1
if errorlevel 1 (
  echo [-] task is NOT registered. Install with: setup-publish-task.cmd
) else (
  echo [OK] task is registered
  echo.
  schtasks /query /tn "%TASK_NAME%" /fo LIST /v
)
echo.
echo ============ recent log: %LOG% ============
if exist "%LOG%" (
  powershell -NoProfile -Command "[Console]::OutputEncoding=[Text.Encoding]::UTF8; Get-Content -LiteralPath '%LOG%' -Encoding UTF8 -Tail 25"
) else (
  echo [-] no log yet, meaning the task never ran. Try: setup-publish-task.cmd run
)
endlocal & exit /b 0


:usage
echo Usage:
echo   setup-publish-task.cmd                          install (daily 09:00)
echo   setup-publish-task.cmd install ^<SC^> ^<ST^> ^<MO^>
echo        SC = MINUTE ^| HOURLY ^| DAILY ^| WEEKLY ^| MONTHLY ^| ONCE
echo        ST = start time HH:mm (default 09:00)
echo        MO = recurrence, e.g. 4 under HOURLY means every 4 hours
echo   setup-publish-task.cmd run                      run once now
echo   setup-publish-task.cmd status                   show task state and log
echo   setup-publish-task.cmd uninstall                remove the task
endlocal & exit /b 2


:fail
echo.
echo [X] operation failed (errorlevel %ERRORLEVEL%)
echo     If it says "Access is denied", reopen the shell as Administrator.
endlocal & exit /b 1
