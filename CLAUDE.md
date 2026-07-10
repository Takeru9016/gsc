# GSC — Claude Code Primary Context
# Read this file at the start of every session before doing anything else.
# Do not skip sections. Do not assume context from previous sessions.

---

## Project Identity

**Client**: Goregaon Sports Club (GSC)
**Site**: gsc.in (full rebuild)
**Agency**: Sero Studio
**Developer**: Sahil Jadhav
**Repo**: github.com/[repo-slug] — confirm with Sahil if unclear
**Type**: Public-facing marketing + member services website
**Status**: Active build — check Phase Tracker below before every task

---

## Stack (Locked — Do Not Deviate)

```
Framework        Next.js 16.2.10 (App Router)
Language         TypeScript 5.x (strict mode — no any, no ts-ignore)
UI               React 19 + Tailwind CSS v4
Components       shadcn/ui (selective: Dialog, Tabs, Select, Tooltip only)
Icons            Lucide React
CMS              Sanity v3 + next-sanity
Database         Neon (serverless Postgres) + Drizzle ORM 1.0.0-rc.4
3D               @react-three/fiber 9.6.1 + @react-three/drei 10.7.7
Animation        GSAP 3.x + Lenis (smooth scroll)
Email            Resend
File Storage     Cloudinary (public uploads only)
PDF              react-pdf
Forms            React Hook Form + Zod
Fonts            Barlow Condensed + Inter (next/font/google)
Linting          Biome + Ultracite
Package Manager  pnpm
Hosting          Vercel + Neon
Analytics        [TBD]
```

### Critical Next.js 16 Notes
- `middleware.ts` → renamed to `proxy.ts` in Next.js 16
- Caching is explicit — no automatic fetch caching
- Turbopack is default dev server
- Node 20+ required

### Critical Tailwind v4 Notes
- CSS-first config — no `tailwind.config.js`
- All config in `app/globals.css` via `@theme`
- Dark mode: `@variant dark (&:where(.dark, .dark *))`
- No `darkMode: 'class'` config needed

### Critical Drizzle ORM 1.0.0-rc.4 Notes
- The `schema` option is no longer accepted on the pg-core client config (`drizzle({ client, schema })` does not type-check). Relational queries (`db.query.x.findMany()`) now go through a separate `relations` config instead — not used in this project. Client setup is `drizzle({ client: sql })`; import tables directly from `lib/db/schema.ts` for `db.insert(...)`/`db.select(...)`.
- `drizzle-kit generate` outputs a timestamped subfolder (`drizzle/<timestamp>_<name>/migration.sql` + `snapshot.json`) instead of the old flat `drizzle/0000_name.sql` + `drizzle/meta/` layout. Still commit the whole `drizzle/` folder.
- `drizzle-kit` only auto-loads `.env`, not `.env.local` — `drizzle.config.ts` must call `dotenv.config({ path: '.env.local' })` before reading `DATABASE_URL_UNPOOLED`.
- See `docs/DB.md` for the working reference implementation.

---

## Repository Structure

```
gsc/
├── app/
│   ├── (site)/               # Public routes
│   │   ├── layout.tsx        # Root layout — Navbar, Footer, theme provider
│   │   ├── page.tsx          # Homepage
│   │   ├── about/
│   │   ├── sports/
│   │   ├── events/
│   │   ├── facilities/
│   │   ├── booking/
│   │   ├── membership/
│   │   ├── achievements/
│   │   ├── partners/
│   │   ├── downloads/
│   │   └── legal/
│   ├── (studio)/             # Sanity Studio
│   │   └── studio/[[...tool]]/
│   └── api/                  # API routes
│       ├── revalidate/       # ISR webhook
│       ├── booking/
│       ├── membership/
│       ├── contact/
│       ├── partner/
│       └── achievement/
├── components/
│   ├── ui/                   # shadcn primitives — NEVER edit
│   ├── layout/               # Navbar, Footer, ThemeProvider
│   ├── sections/             # Page sections (Hero, Cards, etc.)
│   ├── shared/               # Reusable across pages
│   └── three/                # R3F components only
├── lib/
│   ├── sanity/               # client.ts, queries.ts, image.ts
│   ├── db/                   # drizzle schema + client
│   ├── email/                # Resend templates
│   └── utils.ts
├── sanity/
│   ├── schemaTypes/          # All document type schemas
│   └── lib/                  # Sanity client config
├── public/
├── docs/
├── prompts/
├── .claude/
├── CLAUDE.md                 ← you are here
├── GSC.md
└── .env.example
```

---

## Phase Tracker

Update the `[ ]` to `[x]` as tasks complete. This is the single source of truth for progress.

### Phase 1A — Foundation (11 tasks)
```
[x] 1A-01  Project init — Next.js 16, TypeScript, Tailwind v4, shadcn/ui
[x] 1A-02  Folder structure + base files (layout, globals, utils)
[x] 1A-03  Design system — CSS tokens, fonts, theme provider, dark/light toggle
[x] 1A-04  Base components — Button, Badge, SectionWrapper, AnimatedText
[x] 1A-05  Navbar — desktop + mobile, scroll behaviour, theme toggle
[x] 1A-06  Footer — columns, emergency contacts, social links
[x] 1A-07  Sanity v3 — studio route, all schema types, GROQ query library
[x] 1A-08  Drizzle + Neon — schema, client, migrations, db/ lib
[x] 1A-09  Resend + email templates — booking, membership, contact confirmations
[x] 1A-10  API routes — all 5 form submission endpoints + ISR webhook
[x] 1A-11  Vercel deploy — env vars, first successful production build
```

### Phase 1B — Core Pages (11 tasks)
```
[x] 1B-01  Homepage — Hero (GSAP fallback), Stats, Sports Grid, Facilities, Events, CTA
[x] 1B-02  /about — History, Stats, Milestones timeline, Committee section
[ ] 1B-03  /about/team — Committee grid with role filters
[ ] 1B-04  /about/bye-laws + /contact — Document viewer + contact form
[ ] 1B-05  /legal + /legal/cancellation — CMS-driven legal pages
[ ] 1B-06  /sports — Hub page + GSAP fallback scroll experience
[ ] 1B-07  /sports/[slug] — Sport detail template (24 pages from one template)
[ ] 1B-08  /sports/coaching — Coaching hub + sport filter
[ ] 1B-09  /booking — Unified booking inquiry form (4 types)
[ ] 1B-10  /membership — Hub page + membership type cards
[ ] 1B-11  /membership/[type] + /membership/affiliated-clubs
```

### Phase 2 — Full Site (15 tasks)
```
[ ] 2-01   /facilities — Hub page + category navigation
[ ] 2-02   /facilities/rooms — Room listing + inquiry CTA
[ ] 2-03   /facilities/banquets + /facilities/banquets/[hall] — Banquet hub + 3 halls
[ ] 2-04   /facilities/dining + /facilities/dining/[venue] — Dining hub + 6 venues
[ ] 2-05   /facilities/recreation + sub-pages (kids-zone, cards-room, housie)
[ ] 2-06   /facilities/[remaining] — sports-shop, massage-chairs, library, medical-cell
[ ] 2-07   /events — Filterable events hub (upcoming/past/type filters)
[ ] 2-08   /events/[slug] — Event detail template
[ ] 2-09   /events/leagues — All 18 leagues on single page
[ ] 2-10   /achievements — Filterable achievement wall (4 filter tags)
[ ] 2-11   /partners — Corporate pitch page
[ ] 2-12   /partners/team-spirit — 3 editions per year
[ ] 2-13   /partners/annual-report — PDF viewer (2–3 reports)
[ ] 2-14   /downloads — Notices + document downloads hub
[ ] 2-15   SEO — sitemap.xml, robots.txt, metadata API, 301 redirects
```

### Phase 3 — 3D & Polish (11 tasks)
```
[ ] 3-01   R3F setup — Canvas wrapper, Suspense, WebGL detection
[ ] 3-02   Homepage hero fallback — GSAP particle CSS animation (mobile-safe)
[ ] 3-03   Homepage hero — WebGL particle scene (desktop only)
[ ] 3-04   Sports scroll fallback — GSAP CSS scroll experience (mobile-safe)
[ ] 3-05   Sports scroll — Scene 1 Cricket (WebGL, desktop only)
[ ] 3-06   Sports scroll — Scene 2 Swimming + Scene 3 Badminton
[ ] 3-07   Sports scroll — Scene 4 Tennis + Scene 5 Squash
[ ] 3-08   Sports scroll — Scene 6 Gym + scroll orchestration
[ ] 3-09   Sport hero objects — Cricket ball, Shuttlecock, Tennis ball, Water sphere
[ ] 3-10   GSAP polish pass — page transitions, scroll reveals, micro-interactions
[ ] 3-11   Performance audit — Lighthouse, WebGL budget, ISR validation, launch checklist
```

---

## Active Task

**Current Phase**: 1B
**Active Task**: 1B-03 — /about/team — Committee grid with role filters
**Last Completed**: 1B-02 — /about — History, Stats, Milestones timeline, Committee section

> Update this section when running /done after each task.

---

## Absolute Rules

1. **Never edit `src/components/ui/`** — shadcn primitives are generated, not handwritten
2. **No `any` in TypeScript** — use `unknown` + type guards or proper types
3. **No `ts-ignore` or `ts-expect-error`** — fix the actual type error
4. **Mobile-first always** — build mobile layout first, then md: and lg: breakpoints
5. **No WebGL on mobile** — detect via `window.WebGLRenderingContext` + CSS fallback mandatory
6. **Dark mode on hero sections** — every hero section gets `data-theme="dark"` regardless of global theme
7. **ISR revalidation** — every Sanity fetch must include `tags` for cache invalidation
8. **Sanity images** — always use `urlFor()` from `lib/sanity/image.ts`, never raw `.asset.url`
9. **Forms** — React Hook Form + Zod only, no uncontrolled inputs
10. **Environment variables** — never hardcode, always use `process.env.VAR_NAME`

---

## Environment Variables Reference

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=               # write token for server-side mutations
SANITY_WEBHOOK_SECRET=          # for ISR revalidation signature verification

# Database
DATABASE_URL=                   # Neon connection string (pooled)
DATABASE_URL_UNPOOLED=          # Neon direct connection (for migrations)

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@gsc.in

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_UPLOAD_PRESET=       # unsigned preset for achievement uploads

# App
NEXT_PUBLIC_SITE_URL=https://gsc.in
```

---

## Slash Command Reference

| Command | What it does                                                |
| ------- | ----------------------------------------------------------- |
| /start  | Read context, report current phase + active task            |
| /build  | Begin building the active task                              |
| /check  | Run typecheck + lint, report all errors                     |
| /done   | Mark active task complete, advance to next task             |
| /fix    | Fix the last reported error only — lean context             |
| /scope  | Show all remaining tasks in current phase                   |
| /page   | Build a specific page by name (e.g. /page about/team)       |
| /schema | Generate Sanity doc type or Drizzle table by name           |
| /review | Audit last component against DESIGN_RULES + COMPONENT_SPECS |

---

## Key Reference Files

| File                     | When to read                                    |
| ------------------------ | ----------------------------------------------- |
| GSC.md                   | Project decisions, brand, page logic, data      |
| docs/spec/PAGES.md       | Section-by-section spec for any page            |
| docs/spec/SCHEMA.md      | Sanity + Drizzle schema reference               |
| docs/spec/CONVENTIONS.md | Naming, file structure, import order            |
| docs/DESIGN_RULES.md     | Colors, typography, spacing, animation          |
| docs/COMPONENT_SPECS.md  | Component props and behavior                    |
| docs/PHASES.md           | Full task list with codes                       |
| docs/SANITY_CMS.md       | GROQ queries, ISR, singleton pattern            |
| docs/DB.md               | Drizzle schema, Neon setup, migrations          |
| docs/FORMS.md            | Form fields, Zod schemas, API route pattern     |
| docs/3D.md               | R3F scenes, animation rules, performance        |
| docs/WORKFLOW.md         | Session ritual, git format, how to use commands |
