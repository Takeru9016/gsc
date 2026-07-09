# GSC — Phase 1A Prompts
# Ready-to-paste prompts for Claude Code. One prompt per task.
# Paste the full prompt block into Claude Code after running /start.
# Do not paste multiple prompts at once.

---

## 1A-01 — Project Init

```
/build

Task 1A-01 — Project Init.

Initialize the GSC Next.js project with the full stack from CLAUDE.md.

Steps to execute in order:
1. Create Next.js 16 app with App Router, TypeScript strict, Tailwind v4, import alias @/*
2. Install ALL production dependencies listed in docs/PHASES.md under 1A-01
3. Install ALL dev dependencies listed in docs/PHASES.md under 1A-01
4. Run: pnpm biome init — then configure biome.json with ultracite preset
5. Update package.json scripts:
   - "dev": "next dev --turbopack"
   - "build": "next build"
   - "start": "next start"
   - "lint": "biome check ."
   - "lint:fix": "biome check --write ."
   - "typecheck": "tsc --noEmit"
   - "db:generate": "drizzle-kit generate"
   - "db:migrate": "drizzle-kit migrate"
   - "db:studio": "drizzle-kit studio"
   - "db:push": "drizzle-kit push"
6. Delete all default Next.js boilerplate content from:
   - app/page.tsx (leave empty export default function)
   - app/globals.css (leave only @import "tailwindcss")
   - app/layout.tsx (strip to bare shell)
7. Create .env.example with all variable names from CLAUDE.md, no values
8. Verify: pnpm build passes on empty shell

Do not create any components or pages yet. Foundation only.
```

---

## 1A-02 — Folder Structure + Base Files

```
/build

Task 1A-02 — Folder Structure + Base Files.

Create the complete directory and file scaffold from docs/spec/CONVENTIONS.md.

Create all directories:
- app/(site)/ with all route folders (empty page.tsx placeholders)
- app/(studio)/studio/[[...tool]]/
- app/api/ with all route folders (empty route.ts placeholders)
- components/ui/, layout/, sections/, shared/, three/
- components/shared/forms/
- components/three/objects/
- lib/sanity/, lib/db/, lib/email/templates/
- sanity/schemaTypes/singletons/, sanity/schemaTypes/documents/, sanity/lib/, sanity/desk/
- docs/, prompts/ (these already exist — skip)
- public/

Create these actual files with content (not placeholders):
1. lib/utils.ts — cn() helper using clsx + tailwind-merge
2. app/(site)/layout.tsx — shell with html/body, font variables, ThemeProvider placeholder, Navbar placeholder, Footer placeholder, children
3. app/globals.css — @import "tailwindcss" only, blank @theme {} block ready for tokens

All other files: export default function Page() { return null } or export async function GET() { return Response.json({}) }

Done when: pnpm build passes. No TypeScript errors on placeholders.
```

---

## 1A-03 — Design System

```
/build

Task 1A-03 — Design System.

Build the complete CSS token system, fonts, and theme provider.

1. app/globals.css — add ALL tokens inside @theme {}:
   - All color tokens from docs/DESIGN_RULES.md (primary, accents, surfaces, text, borders)
   - Font family tokens: --font-display and --font-body
   - Add @variant dark (&:where(.dark, .dark *)) rule
   - Add [data-theme="dark"] block that overrides bg/surface/text/border tokens to dark values
   - Add [data-theme="light"] block for explicit light overrides

2. app/(site)/layout.tsx — load fonts:
   import { Barlow_Condensed, Inter } from 'next/font/google'
   const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-display' })
   const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' })
   Apply both variables to <html> className

3. components/layout/ThemeProvider.tsx:
   - 'use client'
   - On mount: read localStorage 'gsc-theme'
   - If 'dark': add .dark to document.documentElement
   - If 'light' or missing: remove .dark (default = light)
   - Anti-flash: inline <script> in <head> reads localStorage before hydration
   - Export ThemeProvider wrapping children

4. components/layout/ThemeToggle.tsx:
   - 'use client'
   - Sun icon (light mode) / Moon icon (dark mode) from lucide-react
   - onClick: toggle .dark on document.documentElement + write to localStorage
   - Size: 20px icon, no label text, accessible aria-label

5. Wrap children in app/(site)/layout.tsx with ThemeProvider

Done when: dark/light toggle works in browser. Both themes apply correct background and text colors. Fonts render correctly.
```

---

## 1A-04 — Base Components

```
/build

Task 1A-04 — Base Components.

Build all shared base components. Read docs/COMPONENT_SPECS.md for exact props and behavior.

Components to build:

1. components/shared/SectionWrapper.tsx
   Props: children, id?, className?, contained? (default true), noPadding?
   Output: <section> with py-16 md:py-24 lg:py-32, max-w-7xl container when contained

2. components/shared/PageHero.tsx
   Props: headline, subline?, badge?, image? (SanityImage), minHeight? ('screen'|'60vh'|'50vh'), children?
   Always data-theme="dark". GSAP fade-in on mount: badge → headline → subline → children stagger 100ms.
   With image: urlFor() background with dark gradient overlay. Without image: solid bg-[--color-bg-dark].
   pt-24 to clear fixed navbar.

3. components/shared/AnimatedText.tsx
   Props: children, as? (default 'p'), delay?, className?
   GSAP scroll-reveal: y:30→0, opacity:0→1, duration 0.6, once:true
   Wrap in prefers-reduced-motion check.

4. components/shared/StatCounter.tsx
   Props: value (number), suffix?, prefix?, label, duration? (default 1.5)
   GSAP textContent tween on scroll-enter. snap: { textContent: 1 }. once:true.

5. components/shared/Badge.tsx
   Props: children, variant? ('primary'|'gold'|'red'|'green'|'outline'), size? ('sm'|'md')
   Use color tokens from DESIGN_RULES.md for each variant. rounded-full always.

6. components/shared/PortableTextRenderer.tsx
   Props: value (PortableTextBlock[]), className?
   Use PortableText from next-sanity. Components for h2, h3, normal, blockquote, bullet, number.
   All styles use CSS token variables not hardcoded colors.

All components: named exports, full TypeScript types, no any.
```

---

## 1A-05 — Navbar

```
/build

Task 1A-05 — Navbar.

Build the complete Navbar. Read docs/COMPONENT_SPECS.md Navbar section.

Full spec:
- Fixed position, z-50
- Transparent when on a dark hero section, solid bg-[--color-surface-dark] after scrollY > 80px
- Left: GSC logo (text placeholder until SVG received — "GSC" in Barlow Condensed, #1565C0)
- Center: nav items (desktop)
- Right: ThemeToggle + mobile hamburger

Nav items: HOME | SPORTS | EVENTS | FACILITIES | BOOKING | MEMBERSHIP | ACHIEVEMENTS | PARTNERS | ABOUT

Dropdown groups (desktop hover only):
- SPORTS: Outdoor / Indoor / Aquatic / Health & Fitness / Track / [divider] / View All Sports → /sports
- EVENTS: Upcoming Events / Leagues / [divider] / View All Events → /events
- FACILITIES: Rooms / Banquets / Dining / Recreation / [divider] / View All Facilities → /facilities

Mobile:
- Hamburger icon (Menu/X from lucide-react)
- Full-width slide-in panel from right, z-50
- All nav items as links, no dropdowns — expand categories inline
- ThemeToggle in mobile menu

Active route: usePathname() — apply text-[--color-primary] + underline indicator

Scroll behaviour:
- useEffect + window scroll listener
- scrollY > 80 → add solid background class
- scrollY <= 80 → transparent (on hero sections only — detect via data-theme="dark" on parent)

Install: uses only lucide-react and next/link, next/navigation — no extra packages.
```

---

## 1A-06 — Footer

```
/build

Task 1A-06 — Footer.

Build the complete Footer. Read docs/COMPONENT_SPECS.md Footer section.

Structure:
Top section — 5-column grid (lg) / 2-column (md) / 1-column (sm):
  Col 1: GSC logo ("GOREGAON SPORTS CLUB" in Barlow Condensed) + tagline + social links (Instagram, Facebook, YouTube, Twitter — lucide-react icons)
  Col 2: Quick Links — Home, About, Contact, Downloads, Legal
  Col 3: Sports (6) — Cricket, Badminton, Swimming, Lawn Tennis, Squash, Gym → /sports/[slug]
  Col 4: Facilities (4) — Rooms, Banquets, Dining, Recreation → /facilities/[slug]
  Col 5: Contact — address, phone, email (all from siteConfig prop)

Divider line

Bottom strip:
  Left: "Medical Cell: [PENDING_CONTENT] | Emergency: [PENDING_CONTENT]" in Body S, accent-red text
  Right: "© 2025 Goregaon Sports Club. All rights reserved."

Props: accept siteConfig as prop (passed from (site)/layout.tsx Server Component fetch)
Background: bg-[--color-surface-dark] always (footer is always dark)
Links: next/link, hover:text-[--color-primary]

Fetch siteConfig once in app/(site)/layout.tsx and pass as prop to both Navbar and Footer.
Do not fetch inside the Footer component itself.
```

---

## 1A-07 — Sanity v3 Setup

```
/build

Task 1A-07 — Sanity v3 Setup.

Build the complete Sanity CMS setup. Read docs/SANITY_CMS.md and docs/spec/SCHEMA.md in full.

1. sanity.config.ts at project root:
   - projectId from NEXT_PUBLIC_SANITY_PROJECT_ID
   - dataset: 'production'
   - plugins: [structureTool({ structure }), visionTool()]
   - schema: { types: [...all schema types] }

2. app/(studio)/studio/[[...tool]]/page.tsx:
   - 'use client'
   - import { NextStudio } from 'next-sanity/studio'
   - import config from '@/sanity.config'
   - export const dynamic = 'force-dynamic'

3. lib/sanity/client.ts — server client + read-only client (see SANITY_CMS.md)

4. lib/sanity/image.ts — urlFor() helper (see SANITY_CMS.md)

5. sanity/desk/structure.ts — all 4 singletons pinned at top (see SANITY_CMS.md)

6. Generate ALL 4 singleton schemas:
   sanity/schemaTypes/singletons/siteConfig.ts
   sanity/schemaTypes/singletons/membershipConfig.ts
   sanity/schemaTypes/singletons/bookingConfig.ts
   sanity/schemaTypes/singletons/leaguesConfig.ts

7. Generate ALL 13 document schemas:
   sanity/schemaTypes/documents/ — one file per document type from SCHEMA.md

8. sanity/schemaTypes/index.ts — export all types array

9. lib/sanity/queries.ts — write ALL GROQ query functions:
   getSiteConfig, getSports, getSportBySlug, getCommitteeMembers,
   getMilestones, getAchievements, getEvents, getEventBySlug,
   getBanquetHalls, getBanquetHallBySlug, getDiningVenues, getDiningVenueBySlug,
   getMembershipTypes, getMembershipTypeBySlug, getMembershipConfig,
   getPartnershipOpportunities, getTeamSpiritEditions, getAnnualReports,
   getDownloads, getLegalPage, getLeaguesConfig
   Each function: typed return, ISR tag (see SANITY_CMS.md cache tag table)

Done when: pnpm dev → /studio loads without errors. All document types visible in desk.
```

---

## 1A-08 — Drizzle + Neon

```
/build

Task 1A-08 — Drizzle + Neon.

Set up the database layer. Read docs/DB.md in full — the complete schema is there, copy-paste ready.

1. drizzle.config.ts — use DATABASE_URL_UNPOOLED for migrations (see DB.md)

2. lib/db/schema.ts — paste the COMPLETE schema from docs/DB.md:
   - All 7 enums (bookingType, bookingStatus, membershipStatus, contactType, contactStatus, partnerStatus, achievementStatus)
   - All 5 tables (bookingInquiries, membershipInquiries, contactInquiries, partnerInquiries, achievementSubmissions)
   - All type exports ($inferSelect, $inferInsert for each table)

3. lib/db/index.ts — Neon serverless client + Drizzle instance (see DB.md)

4. Run: pnpm db:generate
   This generates SQL migration files in /drizzle — commit these files.

5. Run: pnpm db:migrate
   This applies the schema to Neon. Requires DATABASE_URL_UNPOOLED in .env.local.

6. Verify: pnpm db:studio — all 5 tables visible with correct columns.

Note: Do not create any admin UI. Database is write-only from API routes. No read UI needed in Phase 1.
```

---

## 1A-09 — Resend + Email Templates

```
/build

Task 1A-09 — Resend + Email Templates.

Build all email infrastructure. Read docs/FORMS.md for template data shapes.

1. lib/email/resend.ts — Resend client instance (see FORMS.md)

2. Build 5 email templates in lib/email/templates/:

   booking.tsx — BookingConfirmationEmail
   Subject: "Booking Inquiry Received — Goregaon Sports Club"
   Content: greeting, booking type summary, fields submitted, "We'll contact you within 24 hours", club contact info

   membership.tsx — MembershipConfirmationEmail
   Subject: "Membership Interest Registered — Goregaon Sports Club"
   Content: greeting, membership type, "Enrollment is currently paused — you'll be notified when it opens", club contact

   contact.tsx — ContactConfirmationEmail
   Subject: "We've Received Your Message — Goregaon Sports Club"
   Content: greeting, subject summary, "We'll respond within 2 business days", club contact

   partner.tsx — PartnerConfirmationEmail
   Subject: "Partnership Inquiry Received — Goregaon Sports Club"
   Content: greeting, company name, partnership type if given, "Our partnerships team will be in touch within 48 hours"

   achievement.tsx — AchievementReceivedEmail
   Subject: "Achievement Submission Received — Goregaon Sports Club"
   Content: greeting, achievement title, sport, level, "Our team will review and add to our champions wall"

All templates:
- Use @react-email/components (Html, Head, Body, Container, Heading, Text, Hr, Preview)
- GSC branding: #1565C0 primary, #0A0E1A dark, Barlow Condensed for heading, Inter for body
- Footer on every template: "Goregaon Sports Club | Goregaon, Mumbai | gsc.in"
- Fully typed props, no any

3. Test: import one template in a test file, verify it compiles without errors.
```

---

## 1A-10 — API Routes

```
/build

Task 1A-10 — API Routes.

Build all 6 API routes. Read docs/FORMS.md for Zod schemas and the API route pattern.

First, create lib/validations.ts with ALL Zod schemas from FORMS.md:
- bookingSchema
- membershipInterestSchema
- contactSchema
- partnerSchema
- achievementSchema

Then build each route following the exact pattern from FORMS.md:
validate → insert → send email → return JSON

1. app/api/booking/route.ts
   POST: validate bookingSchema → insert bookingInquiries → send BookingConfirmationEmail → { success: true, id }

2. app/api/membership/route.ts
   POST: validate membershipInterestSchema → insert membershipInquiries → send MembershipConfirmationEmail → { success: true, id }

3. app/api/contact/route.ts
   POST: validate contactSchema → insert contactInquiries → send ContactConfirmationEmail → { success: true, id }

4. app/api/partner/route.ts
   POST: validate partnerSchema → insert partnerInquiries → send PartnerConfirmationEmail → { success: true, id }

5. app/api/achievement/route.ts
   POST: validate achievementSchema → insert achievementSubmissions → send AchievementReceivedEmail → { success: true, id }

6. app/api/revalidate/route.ts
   CRITICAL: Read raw body with request.text() BEFORE JSON.parse()
   Use isValidSignature() from @sanity/webhook
   Full TAG_MAP covering all 16 document types (see SANITY_CMS.md)
   revalidateTag() for matching type → { revalidated: true, tag }

All routes:
- try/catch with console.error on server, generic message to client
- 400 for Zod validation failure (include details in dev, not in prod)
- 401 for invalid webhook signature
- 500 for DB or email errors
- All return Response.json() — no NextResponse
```

---

## 1A-11 — Vercel Deploy

```
/build

Task 1A-11 — Vercel Deploy.

Prepare the project for first production deployment.

1. next.config.ts — create with:
   - images.remotePatterns: cdn.sanity.io, res.cloudinary.com
   - experimental.reactCompiler: false (React 19 compat)
   - Placeholder redirects array (empty — real redirects in Phase 2)

2. Verify app/(site)/layout.tsx has:
   - Proper <html lang="en">
   - ThemeProvider wrapping children
   - Font variables on <html>
   - Navbar and Footer (with siteConfig fetched as Server Component)
   - Skip-to-main-content link for accessibility

3. Verify app/not-found.tsx exists:
   - GSC branding
   - "404 — Page Not Found"
   - CTA links: "Go Home" → / and "Contact Us" → /contact

4. Create app/robots.ts:
   export default function robots() {
     return {
       rules: { userAgent: '*', allow: '/', disallow: ['/studio/', '/api/'] },
       sitemap: 'https://gsc.in/sitemap.xml',
     }
   }

5. Checklist before pushing:
   - pnpm build passes locally with 0 errors
   - pnpm typecheck passes
   - pnpm lint passes
   - All environment variables are in .env.example
   - .env.local is in .gitignore

6. After push to GitHub and Vercel import:
   Report which env vars need to be added in Vercel dashboard.
   Report the /studio URL to verify Studio loads in production.
```

---
