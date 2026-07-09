# GSC — Workflow
# Session rituals, git discipline, and how to use slash commands effectively.

---

## Session Start Ritual

Every Claude Code session — without exception — starts with:

```
/start
```

This reads CLAUDE.md, reports the current phase and active task, and confirms what gets built next. Do not begin building without running `/start` first. The phase tracker in CLAUDE.md is the single source of truth for where you are in the build.

---

## Standard Build Loop

```
/start              → confirms active task
/build              → builds the task (reads relevant docs, writes files)
/check              → runs tsc + biome, reports errors
/fix                → fixes any errors found by /check
/done               → marks task complete, advances phase tracker
```

Repeat for each task. One task per session is fine. Multiple tasks per session if they're small.

---

## Slash Commands — Detailed Usage

### `/start`
**When to use**: Beginning of every session.
**What it does**: Reads CLAUDE.md. Reports current phase, active task code, last completed task. Does not begin building.
**Use case**: Orients Claude for the session without loading all docs upfront.

---

### `/build`
**When to use**: After `/start` confirms the task.
**What it does**: Reads the relevant docs for the active task (PAGES.md section, DESIGN_RULES.md, CONVENTIONS.md), then builds.
**Use case**: Standard task build.

**How to pass context**:
```
/build
Build the homepage Hero section.
The Sanity siteConfig data is available — use the tagline and stats fields.
Hero should be full viewport with dark background and GSAP fade-in.
No WebGL yet — placeholder div for particle scene.
```

---

### `/check`
**When to use**: After every `/build` to verify correctness.
**What it does**: Runs `pnpm tsc --noEmit` and `pnpm biome check`. Reports all errors with file + line.
**Use case**: Catch type errors and lint violations before committing.

Note: PostToolUse hooks auto-run Biome + TypeScript after every file write. `/check` is a manual full-project check.

---

### `/done`
**When to use**: After `/check` passes clean (or errors are resolved with `/fix`).
**What it does**: Marks the active task `[x]` in CLAUDE.md Phase Tracker. Advances Active Task to next in sequence. Reports what was completed and what's next.
**Use case**: Closes out a task.

---

### `/fix`
**When to use**: When `/check` reports errors.
**What it does**: Reads only the error output (not all docs). Fixes the specific reported error. Re-runs check.
**Use case**: Focused error fix without burning tokens on full context reload.

**How to use**:
```
/fix
Error: Type 'string | undefined' is not assignable to type 'string'
File: app/(site)/sports/[slug]/page.tsx line 24
```

---

### `/scope`
**When to use**: To see what's left in the current phase.
**What it does**: Shows all tasks in the current phase with `[x]` done and `[ ]` remaining.
**Use case**: Planning the session, deciding how many tasks to tackle.

---

### `/page`
**When to use**: To build a specific page outside the normal task sequence.
**What it does**: Reads PAGES.md spec for the named page + DESIGN_RULES.md + CONVENTIONS.md, then builds.
**Use case**: A client urgently needs a specific page. Jump queue.

**How to use**:
```
/page about/team
```
```
/page facilities/dining/bleu-restobar
```

---

### `/schema`
**When to use**: When you need to generate a Sanity document type or Drizzle table on demand.
**What it does**: Reads SCHEMA.md, generates the complete schema file for the named type.
**Use case**: Building out Sanity schemas one at a time as needed.

**How to use**:
```
/schema sport
→ Generates sanity/schemaTypes/documents/sport.ts

/schema banquetHall
→ Generates sanity/schemaTypes/documents/banquetHall.ts

/schema booking_inquiries
→ Generates the booking_inquiries table in lib/db/schema.ts
```

---

### `/review`
**When to use**: After building a component — spot-check quality.
**What it does**: Audits the last built component against DESIGN_RULES.md and COMPONENT_SPECS.md. Reports violations.
**Use case**: Catch design deviations before they compound.

**Common issues it catches**:
- Square button corners (should be `rounded-full`)
- Barlow Condensed used below Display S
- Missing dark mode tokens
- Missing `prefers-reduced-motion` check on GSAP
- Hard-coded colors instead of CSS variables
- WebGL without mobile fallback

---

## Git Discipline

### Commit Format
```
type(scope): description

type:   feat | fix | chore | style | refactor | docs | test
scope:  task code (1A-01 through 3-11)
```

**Examples**:
```
feat(1A-03): add design system tokens and theme provider
feat(1A-05): add navbar with mobile menu and theme toggle
fix(1B-07): correct sport slug fallback for missing Sanity doc
chore(1A-11): add vercel env vars and deploy config
refactor(2-04): extract dining venue card to shared component
```

### Branch Strategy
```
main          → production (Vercel deploys from here)
dev           → working branch
feature/[code] → optional for larger tasks
```

Keep it simple. For a solo build: commit to `dev`, PR + merge to `main` when task is clean.

### When to Commit
- After `/check` passes clean
- After `/done` — commit before moving to next task
- One commit per task minimum

### What Not to Commit
- `.env.local` — never
- `node_modules/` — in .gitignore
- `.next/` — in .gitignore
- Broken builds — only commit when build passes

---

## Session End

Before closing a session:
1. Run `/check` — ensure no errors
2. Run `/done` — advance the phase tracker
3. Git commit with proper format
4. Note anything PENDING or unclear — add to GSC.md pending list

---

## Multi-Session Context Management

Claude Code's context window doesn't persist between sessions. That's why the files exist.

**Session cost by file size** (approximate):
- CLAUDE.md: ~8K tokens (read every session)
- GSC.md: ~10K tokens (read every session via `/start`)
- docs/spec/PAGES.md: ~12K tokens (read per page build)
- docs/PHASES.md: ~6K tokens (read per phase check)
- docs/DESIGN_RULES.md: ~5K tokens (read per build)

**Token management rules**:
1. `/start` reads CLAUDE.md only — does not load all docs
2. `/build` reads only the files needed for the specific task
3. `/fix` reads only the error — not all docs
4. Use `.claudeignore` to prevent Claude from indexing irrelevant directories

---

## Environment Setup Verification

Run at the start of each new machine or after `pnpm install`:

```bash
pnpm tsc --noEmit        # should pass with 0 errors
pnpm biome check .       # should pass with 0 errors
pnpm build               # should produce a successful build
```

If these fail, fix before any Claude Code session. Do not debug in Claude Code — debug manually first.
