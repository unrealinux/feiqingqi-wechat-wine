' ============================================================================
'  Hidden-window launcher.
'
'  Why this exists:
'    When Task Scheduler starts a .cmd as the current user ("run only when user
'    is logged on"), Windows pops up a console window. Every few hours that is
'    annoying. WScript.Shell.Run with window style 0 hides it completely.
'
'  The third argument (True) means WAIT for completion -- that way Task
'  Scheduler's "Last Run Result" reflects node's real exit code
'  (0 publishable / 1 blocked) instead of always reporting success.
'
'  Usage: wscript.exe run-hidden.vbs "<program>" [args...]
'
'  NOTE: kept ASCII-only on purpose -- see run-ip-watch.cmd for the reason.
' ============================================================================
Option Explicit

Dim shell, command, i, rc

If WScript.Arguments.Count = 0 Then
  WScript.Echo "Usage: run-hidden.vbs <program> [args...]"
  WScript.Quit 2
End If

' First argument is the program path; quote it to survive spaces in the path
command = """" & WScript.Arguments(0) & """"

For i = 1 To WScript.Arguments.Count - 1
  command = command & " " & WScript.Arguments(i)
Next

Set shell = CreateObject("WScript.Shell")

' 0 = hidden window, True = wait and capture the exit code
rc = shell.Run(command, 0, True)

WScript.Quit rc
