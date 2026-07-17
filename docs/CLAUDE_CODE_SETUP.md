# GSC — Claude Code Setup
# One-time setup reference. Read when configuring the project for the first time.
# You already have Claude Code installed — this covers project-specific setup only.

---

## Prerequisites Check

Run these before the first Claude Code session.

```bash
# Node.js — must be 20+
node --version
# If below 20: use nvm → nvm install 20 && nvm use 20

# pnpm
pnpm --version
# If missing: npm install -g pnpm

# Claude Code
claude --version
# If missing: npm install -g @anthropic-ai/claude-code
# If outdated: npm update -g @anthropic-ai/claude-code

# Verify project dependencies are clean
cd gsc
pnpm install
pnpm tsc --noEmit   # should pass on fresh install
pnpm biome check .  # should pass on fresh install
```

---

## Project Configuration

Everything below is one-time setup. Do it before the first Claude Code session.

### Step 1 — Create directory structure

```bash
mkdir -p .claude/commands
mkdir -p docs/spec
mkdir -p prompts
```

### Step 2 — Place documentation files

All doc files should be at:
```
CLAUDE.md                           ← project root
GSC.md                              ← project root
docs/spec/PAGES.md
docs/spec/SCHEMA.md
docs/spec/CONVENTIONS.md
docs/PHASES.md
docs/DESIGN_RULES.md
docs/COMPONENT_SPECS.md
docs/WORKFLOW.md
docs/SANITY_CMS.md
docs/DB.md
docs/FORMS.md
docs/3D.md
docs/TOKEN_EFFICIENCY.md
docs/CLAUDE_CODE_SETUP.md           ← this file
```

### Step 3 — Create .claudeignore

```bash
touch .claudeignore
# Paste content from docs/TOKEN_EFFICIENCY.md § .claudeignore
```

### Step 4 — Create .claude/settings.json

```bash
touch .claude/settings.json
# Paste the full content from the section below
```

### Step 5 — Create slash command files

```bash
touch .claude/commands/start.md
touch .claude/commands/build.md
touch .claude/commands/check.md
touch .claude/commands/done.md
touch .claude/commands/fix.md
touch .claude/commands/scope.md
touch .claude/commands/page.md
touch .claude/commands/schema.md
touch .claude/commands/review.md
# Paste content into each file from the .claude/commands/ files in this project
```

### Step 6 — Create .env.local

```bash
cp .env.example .env.local
# Fill in real values:
# NEXT_PUBLIC_SANITY_PROJECT_ID=
# NEXT_PUBLIC_SANITY_DATASET=production
# SANITY_API_TOKEN=
# SANITY_WEBHOOK_SECRET=
# DATABASE_URL=
# DATABASE_URL_UNPOOLED=
# RESEND_API_KEY=
# RESEND_FROM_EMAIL=noreply@gsc.in
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
# NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=gsc-achievements
# NEXT_PUBLIC_SITE_URL=https://gsc.in
```

### Step 7 — Open project in Claude Code

```bash
cd gsc
claude               # opens Claude Code in project directory
/start               # verifies it reads CLAUDE.md and reports Phase 1A, Task 1A-01
```

---

## `.claude/settings.json` — Full Content

```json
{
  "model": "claude-sonnet-5",
  "defaultMode": "acceptEdits",

  "permissions": {
    "allow": [
      "Bash(pnpm:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git status)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Bash(git show:*)",
      "Bash(node:*)",
      "Bash(which:*)",
      "Bash(echo:*)",
      "Bash(ls:*)",
      "Bash(cat .env.example)",
      "Bash(mkdir:*)",
      "Bash(touch:*)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(curl:*)",
      "Bash(wget:*)",
      "Bash(cat .env*)",
      "Bash(cat .env.local)",
      "Write(.env)",
      "Write(.env.local)",
      "Write(components/ui/*)",
      "Write(src/components/ui/*)"
    ]
  },

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
  },

  "env": {
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "8192"
  }
}
```

### Settings Explained

| Setting                         | Value               | Why                                       |
| ------------------------------- | ------------------- | ----------------------------------------- |
| `model`                         | `claude-sonnet-5` | Best quality/cost for all GSC build tasks |
| `defaultMode`                   | `acceptEdits`       | No confirmation dialogs on file writes    |
| `allow: pnpm:*`                 | all pnpm commands   | install, dev, build, tsc, lint            |
| `deny: rm -rf:*`                | blocked             | prevents accidental deletion              |
| `deny: Write(.env*)`            | blocked             | prevents secret exposure                  |
| `deny: Write(components/ui/*)`  | blocked             | shadcn must not be edited                 |
| PostToolUse hooks               | Biome + TSC         | auto-runs after every file write          |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | 8192                | allows longer code generation outputs     |

---

## Verification Checklist

Before the first `/build`, verify:

```
[ ] node --version shows 20+
[ ] pnpm --version shows recent version
[ ] pnpm install completes without errors
[ ] pnpm tsc --noEmit passes (0 errors on fresh install)
[ ] pnpm biome check . passes
[ ] .claudeignore exists at project root
[ ] .claude/settings.json exists and is valid JSON
[ ] All 9 slash command files exist in .claude/commands/
[ ] All doc files exist in docs/ and docs/spec/
[ ] CLAUDE.md exists at project root
[ ] GSC.md exists at project root
[ ] .env.local exists with real values filled in
[ ] claude /start reports Phase 1A, Task 1A-01
```

---

## Troubleshooting

### Claude Code doesn't see my files
- Verify `.claudeignore` is not excluding important directories
- Run `claude --debug` to see what's being indexed

### TypeScript errors on clean install
- Run `pnpm install` again
- Check `tsconfig.json` — paths aliases must match actual directories
- Verify `@/*` alias maps to project root

### Biome hook fails after every write
- Check `biome.json` exists and is valid
- Run `pnpm biome check --write [filename]` manually to see the error
- Biome version mismatch: check `pnpm list @biomejs/biome`

### Sanity Studio doesn't load
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set in `.env.local`
- Check `app/(studio)/studio/[[...tool]]/page.tsx` exists
- Ensure `sanity.config.ts` imports all schema types

### Neon connection fails
- Verify `DATABASE_URL` in `.env.local` is the pooled connection string
- `DATABASE_URL_UNPOOLED` must be the direct connection (for migrations)
- Neon project must be in `us-east-1` or `eu-west-1` — check latency from Vercel region

### ISR webhook returns 401
- Read the raw body BEFORE `JSON.parse()` — see `docs/SANITY_CMS.md`
- `isValidSignature()` from `@sanity/webhook` must receive raw string body
- Verify `SANITY_WEBHOOK_SECRET` matches the secret set in Sanity dashboard

---

## External Services Setup

### Sanity
1. Create project at sanity.io
2. Get Project ID from project settings
3. Generate API token: Settings → API → Tokens → Add token (Editor role)
4. Set up webhook: Settings → API → Webhooks → Add webhook

### Neon
1. Create project at neon.tech
2. Get both connection strings (pooled + direct) from the dashboard
3. Run migrations after connecting: `pnpm db:migrate`

### Resend
1. Create account at resend.com
2. Verify domain: gsc.in (add DNS records as instructed)
3. Get API key from dashboard

### Cloudinary
1. Create account at cloudinary.com
2. Get cloud name from dashboard
3. Create unsigned upload preset: Settings → Upload → Add preset → Mode: Unsigned
4. Name: `gsc-achievements`

### Vercel
1. Push repo to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy — verify build passes
5. Add custom domain: gsc.in
