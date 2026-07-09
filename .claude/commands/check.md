Run these two commands and report the full output of each:

```bash
pnpm tsc --noEmit
```

```bash
pnpm biome check .
```

Report in this format:

---
TypeScript: [PASS / FAIL]
[If FAIL — list each error with file path, line number, and error message]

Biome: [PASS / FAIL]
[If FAIL — list each violation with file path, line number, and rule name]
---

If both pass:
"All checks pass. Ready for /done."

If either fails:
"[N] errors found. Run /fix to resolve."

Do not attempt to fix errors during /check. That is /fix's job.
Do not load documentation files during /check — only run the commands.
