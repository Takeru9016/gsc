Fix mode — lean context only. Do not load documentation files.

You will be given an error. Fix only that specific error. Do not refactor surrounding code. Do not improve unrelated things. Do not add features.

Process:
1. Read the specific file containing the error
2. Understand the root cause — do not guess
3. Apply the minimal fix that resolves the error
4. Re-run the relevant check to confirm resolved:
   - For TypeScript error: `pnpm tsc --noEmit 2>&1 | grep [filename]`
   - For Biome error: `pnpm biome check [filename]`

Common fix patterns:

TypeScript — "Type 'X | undefined' is not assignable to type 'X'":
→ Add null check: `if (!value) return null` or use optional chaining `value?.field`
→ Or use non-null assertion ONLY if you are certain the value exists: `value!`

TypeScript — "Property 'X' does not exist on type 'Y'":
→ Check SCHEMA.md for the correct field name
→ Update the query in lib/sanity/queries.ts if the field is missing from the GROQ projection

TypeScript — "Module not found":
→ Check the import path — verify the file exists at that path
→ Confirm the @/* alias resolves correctly in tsconfig.json

Biome — unused import:
→ Remove the unused import. Do not add a comment to suppress it.

Biome — missing semicolon / formatting:
→ Run `pnpm biome check --write [filename]` — Biome auto-fixes formatting

After confirming the fix resolves the error, report:
"Fixed: [brief description of what was wrong and what was changed]"

If the error requires understanding architectural context (e.g. a Sanity schema mismatch), read only @docs/spec/SCHEMA.md — no other files.
