# GSC — Token Efficiency
# How to keep Claude Code sessions lean and effective.
# .claudeignore content and context management strategy.

---

## Why This Matters

Claude Code reads the file system to understand the project. Every file it indexes consumes context window tokens. A project like GSC — with node_modules, .next build output, lock files, and generated Sanity assets — can easily waste 40–60% of the context window on irrelevant files before a single line of code is written.

.claudeignore solves this. It tells Claude what NOT to index.

---

## `.claudeignore` — Full Content

Place at project root: `gsc/.claudeignore`

```
# ─── Dependencies ─────────────────────────────────────────────────────────────
# Never read. Massive. Contains nothing Claude should reference.
node_modules/
.pnpm-store/

# ─── Build Output ─────────────────────────────────────────────────────────────
# Generated files. Never source of truth.
.next/
out/
dist/

# ─── Cache ────────────────────────────────────────────────────────────────────
.turbo/
.cache/
.sanity/

# ─── Lock Files ───────────────────────────────────────────────────────────────
# Binary-like. No value to Claude. Let pnpm manage.
pnpm-lock.yaml
package-lock.json
yarn.lock
*.lock

# ─── Database Migrations ──────────────────────────────────────────────────────
# Generated SQL. Schema is in lib/db/schema.ts — that's what Claude reads.
drizzle/meta/
drizzle/*.sql

# ─── Logs ─────────────────────────────────────────────────────────────────────
*.log
npm-debug.log*
.pnpm-debug.log*

# ─── OS / Editor ──────────────────────────────────────────────────────────────
.DS_Store
Thumbs.db
.vscode/
.idea/

# ─── Secrets ──────────────────────────────────────────────────────────────────
# NEVER expose. .env.example is allowed (no real values).
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
!.env.example

# ─── Binary Media ─────────────────────────────────────────────────────────────
# Not readable as text. Wastes context.
public/images/
public/fonts/
*.png
*.jpg
*.jpeg
*.gif
*.webp
*.ico
*.svg
*.mp4
*.mp3
*.woff
*.woff2
*.ttf
*.otf
*.pdf

# ─── shadcn/ui Primitives ─────────────────────────────────────────────────────
# Generated. Claude must NEVER edit these directly.
# If Claude needs to see a primitive, it should read the shadcn docs, not the file.
src/components/ui/
components/ui/

# ─── Sanity CLI Config ────────────────────────────────────────────────────────
# Sanity project plumbing — not relevant to build tasks.
sanity.cli.ts
.sanity/

# ─── Type Declaration Files ───────────────────────────────────────────────────
# Generated or vendor types. Not authored by this project.
**/*.d.ts
node_modules/**/*.d.ts

# ─── Test Output ──────────────────────────────────────────────────────────────
coverage/
.nyc_output/
```

---

## What Claude CAN Read

These directories are not ignored — Claude should be able to access them:

```
app/                  Source of all pages and routes
components/           All components (except ui/)
lib/                  All utility libraries
sanity/schemaTypes/   Sanity document type schemas
docs/                 All documentation files
prompts/              Prompt files
CLAUDE.md             Primary context (always)
GSC.md                Project bible (always)
.env.example          Variable names only — no values
package.json          Dependencies and scripts
tsconfig.json         TypeScript config
biome.jsonc           Linter config
next.config.ts        Next.js config
drizzle.config.ts     Drizzle config
```

---

## Session Context Strategy

### What to load each session

| Command   | Files loaded                                                  | Token cost |
|-----------|---------------------------------------------------------------|------------|
| `/start`  | CLAUDE.md only                                                | ~8K        |
| `/build`  | CLAUDE.md + relevant PAGES.md section + DESIGN_RULES.md      | ~20–25K    |
| `/check`  | Error output only                                             | ~2K        |
| `/fix`    | Error output only + specific file with error                  | ~5K        |
| `/done`   | CLAUDE.md only (to update phase tracker)                      | ~8K        |
| `/schema` | SCHEMA.md only + specific schema section                      | ~10K       |
| `/review` | Built component + DESIGN_RULES.md + COMPONENT_SPECS.md        | ~15K       |

### Avoid loading everything at once
The total documentation is ~80K tokens. Loading all files in one session leaves little room for code generation. The slash command system is designed to load only what's needed for each task.

### If context window fills up
Signs: Claude starts forgetting earlier instructions, responses become generic, types get wrong.

Recovery:
1. Commit current work: `git add . && git commit -m "wip(1B-03): team page in progress"`
2. Start a new Claude Code session
3. Run `/start` to re-establish context
4. Run `/build` with a note: "Continuing from previous session — [summarize what was done]"

---

## File Size Reference

Keep docs lean. If any doc exceeds these limits, split it.

| File                    | Target max | Reason                               |
|-------------------------|------------|--------------------------------------|
| CLAUDE.md               | 300 lines  | Read every session                   |
| GSC.md                  | 400 lines  | Read every session                   |
| docs/spec/PAGES.md      | 500 lines  | Read per page build                  |
| docs/spec/SCHEMA.md     | 600 lines  | Read per schema task                 |
| docs/spec/CONVENTIONS.md| 400 lines  | Read per build task                  |
| docs/PHASES.md          | 500 lines  | Read for phase overview              |
| docs/DESIGN_RULES.md    | 400 lines  | Read per build task                  |
| docs/COMPONENT_SPECS.md | 500 lines  | Read when building components        |
| docs/SANITY_CMS.md      | 400 lines  | Read for Sanity tasks                |
| docs/DB.md              | 300 lines  | Read for DB tasks                    |
| docs/FORMS.md           | 350 lines  | Read for form tasks                  |
| docs/3D.md              | 400 lines  | Read for Phase 3 tasks               |

---

## PostToolUse Hooks

The `.claude/settings.json` hooks auto-run after every file write:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm biome check --write \"$FILE\" 2>&1 | tail -3"
          },
          {
            "type": "command",
            "command": "pnpm tsc --noEmit 2>&1 | tail -8"
          }
        ]
      }
    ]
  }
}
```

**Effect**: Every file Claude writes is immediately linted (Biome auto-fixes) and type-checked (TypeScript reports errors). This eliminates the "build and check later" loop that wastes tokens on back-and-forth fixes.

**Cost**: ~500ms per file write for the hook to run. Acceptable tradeoff.
