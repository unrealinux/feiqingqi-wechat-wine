@echo off
rem ============================================================================
rem  Worker for the "auto write wine article" scheduled task.
rem  Normally invoked by Windows Task Scheduler -- you rarely run this by hand.
rem
rem  What it does:
rem    1. fetch fresh wine news into articles\_incoming\    (--fetch)
rem    2. let the text LLM write one article                  (tools\generate-article.js)
rem    3. validate + guard it, write articles\<name>.json
rem    4. create a WeChat DRAFT from it                       (--publish)
rem
rem  Fully automatic: no human step between generation and the draft box.
rem  The tradeoff you accepted: a wrong vintage or price in the copy reaches the
rem  DRAFT BOX (not followers) and has to be deleted by hand. That is the whole
rem  reason the quality gate below is strict and fail-closed: it is the only
rem  thing standing between the model and your draft box.
rem
rem  Want human approval back: replace --publish with --review on the node line
rem  at the bottom, then approved files are moved from articles\_review\ to
rem  articles\ and picked up by the 09:00 task.
rem
rem  Red line: drafts only. This task never mass-publishes to followers.
rem
rem  Fail-closed: if the LLM is unavailable or the output fails the quality gate
rem  (too short / invented numbers / mistranslated terms), NOTHING is written and
rem  NOTHING is drafted -- a bad article is worse than no article.
rem
rem  Ordering with the publish task:
rem    07:30  FeiqingqiWechatMP-Generate  writes the article + creates the draft
rem    09:00  FeiqingqiWechatMP-Publish   retry path: drafts anything still
rem                                       undrafted (idempotent)
rem  Keep 07:30 earlier than 09:00, so a failed draft at 07:30 is caught at 09:00.
rem
rem  Why a wrapper script is needed (same reasons as run-publish.cmd):
rem    1. Task Scheduler has NO "start in" option -- we must cd explicitly,
rem       otherwise the tool cannot read .env in the project root.
rem    2. Task Scheduler does NOT inherit your PATH -- node must be located by
rem       absolute path instead of assuming a "node" command exists.
rem    3. Output must go to a file, otherwise a failure leaves no trace at all.
rem
rem  Exit codes: 0 ok / 1 generation or drafting failed / 2 env or argument error
rem              / 127 no node or script missing
rem
rem  NOTE: kept ASCII-only on purpose. Batch files with multi-byte characters
rem        break depending on the active code page (cmd re-reads the file by
rem        byte offset), so all messages here are English for reliability.
rem ============================================================================
setlocal EnableExtensions

rem Project root = two levels above tools\win\ (%~dp0 already ends with a slash)
for %%I in ("%~dp0..\..") do set "PROJECT_DIR=%%~fI"

set "LOG_DIR=%PROJECT_DIR%\logs"
set "LOG_FILE=%LOG_DIR%\generate.log"
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
  >>"%LOG_FILE%" echo [unknown-time] ERROR: node.exe not found. Set NODE_EXE for this task.
  endlocal & exit /b 127
)

if not exist "%PROJECT_DIR%\tools\generate-article.js" (
  >>"%LOG_FILE%" echo [unknown-time] ERROR: %PROJECT_DIR%\tools\generate-article.js not found.
  endlocal & exit /b 127
)

rem --- Locale-independent ASCII timestamp ---
rem %DATE% / %TIME% are localized (on a Chinese Windows %DATE% contains the
rem weekday in GBK bytes), which would mix a second encoding into a log whose
rem other content is UTF-8 from node. PowerShell gives a stable stamp.
set "TS="
for /f "delims=" %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH:mm:ss" 2^>nul') do set "TS=%%I"
if not defined TS set "TS=unknown-time"

rem The cd is essential -- without it the tool cannot read .env
cd /d "%PROJECT_DIR%"

>>"%LOG_FILE%" echo.
>>"%LOG_FILE%" echo ============================================================
>>"%LOG_FILE%" echo [%TS%] generate started  (node: %NODE_EXE%)

rem --fetch   : pull fresh wine news into articles\_incoming\ first
rem --publish : create the WeChat draft immediately after the article is written
"%NODE_EXE%" "tools\generate-article.js" --fetch --publish >>"%LOG_FILE%" 2>&1
set "RC=%ERRORLEVEL%"

>>"%LOG_FILE%" echo [%TS%] finished, exit code %RC%
if "%RC%"=="0" >>"%LOG_FILE%" echo status: OK (draft created, or nothing to do)
if "%RC%"=="1" >>"%LOG_FILE%" echo status: FAILED - generation or drafting failed, see details above
if "%RC%"=="2" >>"%LOG_FILE%" echo status: ENVIRONMENT ERROR - bad arguments, missing LLM key or missing .env
if "%RC%"=="127" >>"%LOG_FILE%" echo status: ENVIRONMENT ERROR - node or script not found

endlocal & exit /b %RC%
