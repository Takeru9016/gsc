Before running this command, /check must have passed clean.
If you haven't run /check yet, stop and run /check first.

Steps:

1. Read @CLAUDE.md — identify the active task code (e.g. "1A-03").

2. In CLAUDE.md Phase Tracker, change the active task from:
   `[ ] 1A-03  Design system — ...`
   to:
   `[x] 1A-03  Design system — ...`

3. Find the next unchecked task in the same phase. Update the "Active Task" section at the bottom of CLAUDE.md:
   - Current Phase: [keep same unless phase is now complete]
   - Active Task: [next task code + name]
   - Last Completed: [just-completed task code + name]

4. If the just-completed task was the LAST task in its phase:
   - Update Current Phase to the next phase
   - Set Active Task to the first task of the new phase
   - Print: "Phase [N] complete. Starting Phase [N+1]. Active task: [first task code + name]."

5. Print a completion summary:
   "Completed: [task code] — [task name]
    Next: [next task code] — [next task name]
    Commit: git add . && git commit -m \"feat([task-code]): [short description]\""

Do not begin building the next task. Wait for /build.
