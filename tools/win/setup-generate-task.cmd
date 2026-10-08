@echo off
rem ============================================================================
rem  Register / remove the "auto write a wine article" Windows scheduled task.
rem
rem  Usage:
rem    setup-generate-task.cmd                          Install (daily at 07:30)
rem    setup-generate-task.cmd install DAILY 06:30     Daily at 06:30
rem    setup-generate-task.cmd install HOURLY 08:00 4  Every 4 hours
rem    setup-generate-task.cmd run                      Run once now (verify setup)
rem    setup-generate-task.cmd status                   Show task state + recent log
rem    setup-generate-task.cmd uninstall                Remove the task
rem
rem  What it produces:
rem    One NEW article per run: fresh wine news -> LLM writes the copy ->
rem    quality gate -> articles\<name>.json -> WeChat DRAFT.
rem    Fully automatic: no human step before the draft box.
rem    Details and the draft-only red line: tools\generate-article.js
rem
rem  Ordering with the publish task:
rem    07:30  FeiqingqiWechatMP-Generate  writes the article + creates the draft
rem    09:00  FeiqingqiWechatMP-Publish   retry path: drafts anything still
rem                                       undrafted (idempotent)
rem    Keep 07:30 earlier than 09:00 or the retry path runs before the product.
rem
rem  Design notes:
rem    * Action = wscript.exe -> run-hidden.vbs -> run-generate.cmd
rem      The VBS layer exists purely to remove the console window flash.
rem    * Paths are written with \" escaping, so a project path containing
rem      spaces still works (verified empirically).
rem    * Re-installing is idempotent (delete-then-create).
rem    * Runs as the CURRENT USER, so NO administrator rights are required.
rem    * StartWhenAvailable is turned on AFTER creation (schtasks has no switch
rem      for it), so a run missed because the PC was off is caught up once after
rem      the next boot + logon instead of being dropped silently. Safe here:
rem      generate-article.js skips already-used material, so the catch-up run
rem      will not rewrite yesterday's article.
rem  NOTE: kept ASCII-only on purpose. Batch files containing multi-byte
rem        characters are parsed unreliably depending on the active code page
rem        (cmd re-reads the file by byte offset), which caused rem/echo lines
rem        to be executed as commands during testing.
rem ============================================================================
setlocal EnableExtensions

set "TASK_NAME=FeiqingqiWechatMP-Generate"
for %%I in ("%~dp0..\..") do set "PROJECT_DIR=%%~fI"
set "VBS=%PROJECT_DIR%\tools\win\run-hidden.vbs"
set "RUNNER=%PROJECT_DIR%\tools\win\run-generate.cmd"
set "LOG=%PROJECT_DIR%\logs\generate.log"

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
if "%STARTTIME%"=="" set "STARTTIME=07:30"

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

rem --- Missed-run catch-up -----------------------------------------------
rem  Default for schtasks is StartWhenAvailable=OFF: if the PC happens to be
rem  off (or nobody is logged on) at the scheduled time, that day's run is
rem  dropped and NOT retried. schtasks /create has no switch for this, so set
rem  it through PowerShell afterwards. Non-fatal: registration already
rem  succeeded, so only warn.
powershell -NoProfile -Command "$ErrorActionPreference='Stop'; try { $t = Get-ScheduledTask -TaskName '%TASK_NAME%'; $t.Settings.StartWhenAvailable = $true; Set-ScheduledTask -TaskName '%TASK_NAME%' -Settings $t.Settings | Out-Null } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 goto :catchup_ok

rem NOTE: no parentheses in these echo lines -- an unescaped ')' inside a
rem parenthesised if(...) block would be parsed as the end of the block.
echo [i] could not enable missed-run catch-up - option StartWhenAvailable.
echo     The task itself is registered and will still run on schedule.
echo     Tick "Run task as soon as possible after a scheduled start is missed"
echo     by hand in Task Scheduler if you want the catch-up behaviour.
goto :registered

:catchup_ok
echo [OK] missed-run catch-up enabled - option StartWhenAvailable

:registered
echo.
echo [OK] task registered.
echo      check status :  setup-generate-task.cmd status
echo      run once now :  setup-generate-task.cmd run
echo.
echo Note: this task needs a text-LLM key (GLM_API_KEY). Verify with:
echo       npm run article:generate -- --dry-run
echo Note: it creates DRAFTS only -- it never mass-publishes to followers.
echo       Review the draft box, then publish by hand.
echo Note: it runs fully automatically, so a bad vintage or price in the copy
echo       lands in the draft box and must be deleted by hand. To restore human
echo       approval, change --publish to --review in tools\win\run-generate.cmd.
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
echo [i] exit code %ERRORLEVEL%  (0 ok / 1 generation failed / 127 no node)
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
  echo [-] task is NOT registered. Install with: setup-generate-task.cmd
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
  echo [-] no log yet, meaning the task never ran. Try: setup-generate-task.cmd run
)
endlocal & exit /b 0


:usage
echo Usage:
echo   setup-generate-task.cmd                          install (daily 07:30)
echo   setup-generate-task.cmd install ^<SC^> ^<ST^> ^<MO^>
echo        SC = MINUTE ^| HOURLY ^| DAILY ^| WEEKLY ^| MONTHLY ^| ONCE
echo        ST = start time HH:mm (default 07:30)
echo        MO = recurrence, e.g. 4 under HOURLY means every 4 hours
echo   setup-generate-task.cmd run                      run once now
echo   setup-generate-task.cmd status                   show task state and log
echo   setup-generate-task.cmd uninstall                remove the task
endlocal & exit /b 2


:fail
echo.
echo [X] operation failed (errorlevel %ERRORLEVEL%)
echo     If it says "Access is denied", reopen the shell as Administrator.
endlocal & exit /b 1
