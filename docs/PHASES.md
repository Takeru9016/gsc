# GSC — Build Phases
# Complete task list across 4 phases. 68 tasks total.
# Update CLAUDE.md Phase Tracker as tasks complete — not this file.
# This file is read-only reference.

---

## Phase 1A — Foundation (11 tasks)

These tasks must be completed in order. Each task depends on the previous.

---

### 1A-01 — Project Init

**Goal**: Clean Next.js 16 project with all dependencies installed.

**Steps**:
1. `pnpm create next-app@latest gsc --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
2. Install all production dependencies:
   ```
   pnpm add next-sanity @sanity/image-url @sanity/webhook
   pnpm add drizzle-orm @neondatabase/serverless drizzle-zod
   pnpm add @react-three/fiber @react-three/drei three
   pnpm add gsap @studio-freight/lenis
   pnpm add resend @react-email/components
   pnpm add cloudinary next-cloudinary
   pnpm add react-pdf @react-pdf/renderer
   pnpm add react-hook-form @hookform/resolvers zod
   pnpm add lucide-react clsx tailwind-merge
   pnpm add @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-tooltip
   ```
3. Install dev dependencies:
   ```
   pnpm add -D drizzle-kit @types/three sanity
   pnpm add -D @biomejs/biome ultracite
   ```
4. Init Biome: `pnpm biome init`
5. Configure `biome.json` with Ultracite preset
6. Add scripts to `package.json`
7. Delete default Next.js boilerplate (page.tsx, globals.css content, layout.tsx content)

**Done when**: `pnpm build` passes on an empty app shell.

---

### 1A-02 — Folder Structure + Base Files

**Goal**: All directories and placeholder files in place per CONVENTIONS.md.

**Steps**:
1. Create all folders from CONVENTIONS.md folder structure
2. Create `app/(site)/layout.tsx` — shell only, no content yet
3. Create `app/(site)/page.tsx` — `export default function Home() { return null }` placeholder
4. Create `app/globals.css` — empty with `@import "tailwindcss"` only
5. Create `lib/utils.ts` — `cn()` helper only
6. Create `.env.example` — all variable names, no values
7. Create `public/` subdirectories

**Done when**: `pnpm build` still passes. No TypeScript errors.

---

### 1A-03 — Design System

**Goal**: All CSS tokens, fonts, theme provider, dark/light toggle working.

**Steps**:
1. Add all color tokens to `globals.css` under `@theme {}`
2. Add typography tokens (font families, sizes)
3. Add spacing and animation tokens
4. Set up `[data-theme="dark"]` overrides
5. Add `@variant dark` rule for Tailwind v4
6. Create `components/layout/ThemeProvider.tsx` — reads/writes `localStorage 'gsc-theme'`
7. Create `components/layout/ThemeToggle.tsx` — sun/moon icon button
8. Load Barlow Condensed + Inter via `next/font/google` in layout
9. Apply fonts as CSS variables to `<html>` element

**Done when**: Theme toggle works, fonts render correctly in browser. Dark/light class switches on `<html>`.

---

### 1A-04 — Base Components

**Goal**: Core shared components used across every page.

**Components to build**:
- `components/shared/SectionWrapper.tsx` — `max-w`, padding, id prop
- `components/shared/PageHero.tsx` — headline, subline, dark bg, optional badge
- `components/shared/AnimatedText.tsx` — GSAP text reveal on scroll-enter
- `components/shared/StatCounter.tsx` — animated number counter on scroll-enter
- `components/shared/Badge.tsx` — pill badge, variant prop (primary/gold/red/green/outline)
- `components/ui/button.tsx` — shadcn Button (if not already generated)

**Done when**: All components render without errors. No TypeScript issues.

---

### 1A-05 — Navbar

**Goal**: Full Navbar — desktop + mobile, scroll behaviour, theme toggle.

**Behaviour**:
- Transparent on hero sections, solid bg on scroll
- Active route highlighting
- Mobile hamburger menu with slide-in panel
- Theme toggle in navbar
- Nav items: HOME | SPORTS | EVENTS | FACILITIES | BOOKING | MEMBERSHIP | ACHIEVEMENTS | PARTNERS | ABOUT
- Dropdowns for SPORTS, EVENTS, FACILITIES (on desktop hover)

**Done when**: Navbar renders on all pages, scroll behaviour works, mobile menu opens/closes, active route highlights correctly.

---

### 1A-06 — Footer

**Goal**: Full Footer with all columns, emergency contacts, social links.

**Columns**:
1. GSC logo + tagline + social links
2. Quick Links (main nav)
3. Sports (6 popular sports)
4. Facilities (4 popular facilities)
5. Contact info

**Bottom strip**: Emergency medical contacts (PENDING placeholders) + copyright.

**Done when**: Footer renders with all data from `siteConfig` singleton placeholder. `[PENDING_CONTENT]` placeholders visible for emergency contacts.

---

### 1A-07 — Sanity v3 Setup

**Goal**: Studio route working, all schema types registered, GROQ query library built.

**Steps**:
1. `pnpm create sanity@latest` or manual init in `sanity/` directory
2. Configure `sanity.config.ts` with project ID + dataset
3. Create `app/(studio)/studio/[[...tool]]/page.tsx`
4. Build all 4 singleton schemas in `sanity/schemaTypes/singletons/`
5. Build all 13 document schemas in `sanity/schemaTypes/documents/`
6. Register all schemas in `sanity/schemaTypes/index.ts`
7. Configure desk structure — singletons pinned at top
8. Create `lib/sanity/client.ts` — both server and client Sanity clients
9. Create `lib/sanity/image.ts` — `urlFor()` helper
10. Create `lib/sanity/queries.ts` — all GROQ queries with ISR tags

**Done when**: Studio loads at `/studio`. All document types visible. GROQ queries return typed data.

---

### 1A-08 — Drizzle + Neon

**Goal**: Database connected, all tables migrated, DB client ready.

**Steps**:
1. Create Neon project — get `DATABASE_URL` (pooled) + `DATABASE_URL_UNPOOLED` (direct)
2. Create `lib/db/schema.ts` — all enums + tables from SCHEMA.md
3. Create `lib/db/index.ts` — Neon serverless client + Drizzle instance
4. Create `drizzle.config.ts`
5. Run `pnpm drizzle-kit generate` — generate migration SQL
6. Run `pnpm drizzle-kit migrate` — apply to Neon
7. Verify all tables exist in Neon console

**Done when**: All 5 tables exist in Neon. `pnpm drizzle-kit studio` shows tables with correct columns.

---

### 1A-09 — Resend + Email Templates

**Goal**: Resend connected, all 5 email templates built, sending verified.

**Templates**:
1. `booking-confirmation.tsx` — confirms booking inquiry received
2. `membership-confirmation.tsx` — confirms membership interest received
3. `contact-confirmation.tsx` — confirms contact form submission
4. `partner-confirmation.tsx` — confirms partner inquiry received
5. `achievement-received.tsx` — confirms achievement submission received

**Each template**: GSC branding, summary of submitted data, response time expectation, club contact info.

**Done when**: Test email sends successfully via Resend dashboard or test send. All 5 templates render without errors.

---

### 1A-10 — API Routes

**Goal**: All 5 form submission endpoints + ISR webhook operational.

**Routes**:
- `POST /api/booking` — validate → insert booking_inquiry → send Resend email → return JSON
- `POST /api/membership` — validate → insert membership_inquiry → send email → return JSON
- `POST /api/contact` — validate → insert contact_inquiry → send email → return JSON
- `POST /api/partner` — validate → insert partner_inquiry → send email → return JSON
- `POST /api/achievement` — validate → insert achievement_submission → send email → return JSON
- `POST /api/revalidate` — verify HMAC signature via `@sanity/webhook` → `revalidateTag()` → return JSON

**Pattern for each**: Zod validation → DB insert → Resend send → `{ success: true }` response.

**ISR webhook**: Must read raw request body BEFORE `JSON.parse()`. Use `request.text()` then parse. Use `isValidSignature()` from `@sanity/webhook`.

**Done when**: All routes return 200 for valid input, 400 for invalid. Revalidate route returns 200 for valid Sanity signature.

---

### 1A-11 — Vercel Deploy

**Goal**: First successful production build on Vercel.

**Steps**:
1. Push repo to GitHub
2. Create Vercel project — link to GitHub repo
3. Add all environment variables from `.env.example`
4. Trigger deploy
5. Verify: site loads at Vercel URL, Studio loads at `/studio`, no build errors

**Done when**: `https://[project].vercel.app` loads homepage (even if empty). Build log shows no errors.

---

## Phase 1B — Core Pages (11 tasks)

Build in order. Non-3D versions only — 3D is Phase 3.

---

### 1B-01 — Homepage

**Goal**: All 8 homepage sections built. GSAP animations only (no WebGL yet).

**Sections**: Hero (GSAP particle CSS placeholder) | Stats Bar | Sports Grid | Facilities Showcase | Events Preview | Achievements Reel | Membership CTA | Partners Strip

All data from Sanity. Stats Bar animated counter. Events Preview: real Sanity events or empty state.

---

### 1B-02 — About Page

**Goal**: `/about` — History, Stats, Milestones timeline, Leadership overview.

Milestones from Sanity `milestone` documents. Timeline component: vertical, year-sorted. Stats Bar reused from homepage.

---

### 1B-03 — Team Page

**Goal**: `/about/team` — Committee grid with role filter.

URL param filter: `?role=founderMember|promoterMember|officeBearer|governingCouncil`. Filter defaults to showing all. Data from Sanity `committeeMember` documents.

---

### 1B-04 — Bye-Laws + Contact

**Goal**: `/about/bye-laws` (PDF viewer) + `/contact` (form + map).

Bye-laws: `react-pdf` viewer. Contact: form submits to `/api/contact`. Map: embed GSC location. Emergency contacts block (PENDING placeholder).

---

### 1B-05 — Legal Pages

**Goal**: `/legal` (hub) + `/legal/cancellation` (CMS-driven content).

Content from Sanity `legalPage` documents. Rich text renderer for portableText.

---

### 1B-06 — Sports Hub

**Goal**: `/sports` — Hub page with GSAP category cards. 3D scroll deferred to Phase 3.

Category cards: Outdoor | Indoor | Aquatic | Health & Fitness | Track. Each card shows sports count + image + link. Coaching CTA section.

---

### 1B-07 — Sport Detail Template

**Goal**: `/sports/[slug]` — Template covering all 24 sport pages.

ISR with sport-specific cache tag. Static params from Sanity. Hero with static image placeholder (3D object in Phase 3). Schedule section. Conditional coaching section. Achievements section (if any). Booking CTA.

---

### 1B-08 — Coaching

**Goal**: `/sports/coaching` — Coaching hub with sport filter.

Filters sports where `hasCoaching: true`. External registration link per sport. Cards show coach name, schedule, level.

---

### 1B-09 — Booking

**Goal**: `/booking` — Unified booking inquiry form with 4 types.

Type selector tab: Room | Banquet | Ground | Coaching. Form fields change per tab. URL param `?type=` pre-selects tab. Submits to `/api/booking`.

---

### 1B-10 — Membership Hub

**Goal**: `/membership` — Hub with enrollment status notice and 5 type cards.

Prominent enrollment-closed notice. 5 membership type cards. Affiliated clubs CTA.

---

### 1B-11 — Membership Type + Affiliated

**Goal**: `/membership/[type]` (5 pages) + `/membership/affiliated-clubs`.

Template for 5 types. Interest form on each type page — NOT enrollment. Affiliated clubs list from `membershipConfig` singleton.

---

## Phase 2 — Full Site (15 tasks)

All remaining pages. Order can flex except 2-15 (SEO) which must be last.

---

### 2-01 — Facilities Hub

**Goal**: `/facilities` — Category navigation hub page.

8 category cards. Quick stats bar (3 halls | 6 venues | 18 rooms).

---

### 2-02 — Rooms

**Goal**: `/facilities/rooms` — Room listing + inquiry CTA.

PENDING content placeholders for room types. Booking CTA → `/booking?type=room`.

---

### 2-03 — Banquets Hub + Halls

**Goal**: `/facilities/banquets` + `/facilities/banquets/[hall]` (3 pages).

Banquet hub: 3 hall cards. Hall pages: gallery, capacity (PENDING), setup options, inquiry CTA.

---

### 2-04 — Dining Hub + Venues

**Goal**: `/facilities/dining` + `/facilities/dining/[venue]` (6 pages).

Dining hub: 6 venue cards with Veg/Non-Veg badges. Venue pages: menu PDF viewer, gallery, hours. Bleu Restobar: age disclaimer banner, bar menu.

---

### 2-05 — Recreation Hub + Sub-pages

**Goal**: `/facilities/recreation` + kids-zone, cards-room, housie.

Hub: 3 category cards. Sub-pages: simple content pages. Housie schedule PENDING.

---

### 2-06 — Remaining Facilities

**Goal**: sports-shop, massage-chairs, library, medical-cell.

4 simple content pages. Medical cell: doctor schedule PENDING, emergency contacts PENDING.

---

### 2-07 — Events Hub

**Goal**: `/events` — Filterable events hub.

Filters: Status (upcoming/ongoing/past) + Type (tournament/cultural/league/special). URL params. Sanity data. Empty state if no events match filter.

---

### 2-08 — Event Detail

**Goal**: `/events/[slug]` — Event detail template.

Rich text content. External registration link if present. Related events (3, same type).

---

### 2-09 — Leagues Page

**Goal**: `/events/leagues` — All 18 leagues on one terminal page.

From `leaguesConfig` singleton. Sport filter. No sub-pages. Participate CTA → contact.

---

### 2-10 — Achievements

**Goal**: `/achievements` — Filterable achievement wall.

4 filters: sport, level, type, year. URL params. Masonry grid. Lightbox on click (shadcn Dialog). Achievement submission form in modal.

---

### 2-11 — Partners

**Goal**: `/partners` — Corporate pitch page.

Audience stats. Partnership opportunities from Sanity. Inquiry form. Current partners logo grid.

---

### 2-12 — Team Spirit

**Goal**: `/partners/team-spirit` — 3 editions per year.

From `teamSpiritEdition` documents. PDF viewer if uploaded. Ad specs.

---

### 2-13 — Annual Report

**Goal**: `/partners/annual-report` — PDF viewer for 2–3 reports.

From `annualReport` documents. Download buttons. `react-pdf` or Cloudinary direct link.

---

### 2-14 — Downloads

**Goal**: `/downloads` — Notices + documents hub.

From `download` documents. Category filter. Date sorted. Download buttons.

---

### 2-15 — SEO + Redirects

**Goal**: All SEO metadata, sitemap, robots.txt, and 301 redirects in place.

1. `app/sitemap.ts` — dynamic sitemap from Sanity slugs
2. `app/robots.ts` — robots.txt
3. Metadata API — `generateMetadata()` on all dynamic pages
4. 301 redirects in `next.config.ts` — full redirect map from GSC.md
5. OG image — default + per-page from Sanity `ogImage`

---

## Phase 3 — 3D & Polish (11 tasks)

Build in order. Each task depends on the previous.

---

### 3-01 — R3F Setup

**Goal**: Canvas wrapper, Suspense, WebGL detection utility.

- `components/three/WebGLDetector.tsx` — detects `window.WebGLRenderingContext` + checks for mobile
- `components/three/SceneCanvas.tsx` — R3F `<Canvas>` wrapper with Suspense + ErrorBoundary
- WebGL disabled on mobile — CSS class `.webgl-disabled` applied to `<html>`

---

### 3-02 — Homepage Hero Fallback

**Goal**: CSS GSAP particle animation — mobile-safe, no WebGL.

Pure CSS + GSAP animated particles. Looks similar to WebGL version. Must work on all devices.

---

### 3-03 — Homepage Hero WebGL

**Goal**: Full R3F particle hero scene (desktop only).

2000 instanced particles. Swirl + cursor displacement. Logo convergence on load. Scroll-out transition via GSAP ScrollTrigger.

---

### 3-04 — Sports Scroll Fallback

**Goal**: GSAP CSS scroll experience for mobile — 6 sport categories.

Stacked sections with GSAP scroll-triggered animations. Sport category images + text. Works on all devices.

---

### 3-05 — Sports Scroll Scene 1 — Cricket

**Goal**: First WebGL scene in sports scroll experience.

GSAP ScrollTrigger pin. Cricket scene: low camera angle, #FFB300 key light, dust particles. Scene transitions to Scene 2 on scroll.

---

### 3-06 — Sports Scroll Scenes 2 + 3

**Goal**: Swimming (Scene 2) + Badminton (Scene 3).

Swimming: caustic shader, #1E88E5 ambient. Badminton: shuttlecock arc trail, fluorescent lighting.

---

### 3-07 — Sports Scroll Scenes 4 + 5

**Goal**: Tennis (Scene 4) + Squash (Scene 5).

Tennis: clay court, ball bounce trail. Squash: enclosed court, impact burst.

---

### 3-08 — Sports Scroll Scene 6 + Orchestration

**Goal**: Gym scene (Scene 6) + full scroll orchestration.

Gym: dark + #E53935 spot light, energy particles. Full orchestration: 6-scene cross-fade on scroll, progress dots overlay UI.

---

### 3-09 — Sport Hero Objects

**Goal**: Contained 3D objects in `/sports/[slug]` hero (desktop only).

4 objects to build: cricket ball (priority), shuttlecock, tennis ball, water sphere. Ambient rotation. Fade on scroll. Mobile: hidden, static image shown.

---

### 3-10 — GSAP Polish Pass

**Goal**: Page transitions, scroll reveals, micro-interactions across all pages.

- Page transition: fade-in on route change
- Scroll reveals: AnimatedText on all headings
- Card hover states: subtle lift + shadow
- Navbar scroll behaviour refinement
- Lenis smooth scroll tuning

---

### 3-11 — Performance Audit + Launch

**Goal**: Lighthouse scores acceptable. WebGL budget met. ISR validated. Launch.

Checklist:
- [ ] Lighthouse: Performance > 85 (mobile), > 90 (desktop)
- [ ] WebGL: < 100ms load, < 16ms frame time
- [ ] All ISR tags revalidating correctly via webhook test
- [ ] All 301 redirects verified
- [ ] All PENDING_CONTENT items resolved or flagged to client
- [ ] DPDP Act compliance reviewed with legal
- [ ] Emergency contacts in footer — real numbers confirmed
- [ ] Sanity studio access credentials shared with GSC staff
- [ ] Environment variables set correctly in Vercel production
- [ ] Custom domain gsc.in pointed to Vercel
