# GSC — Conventions
# Naming, file structure, component patterns, and import order.
# These rules are non-negotiable. Apply them to every file written.

---

## File Naming

| Type                | Convention       | Example                          |
|---------------------|------------------|----------------------------------|
| Pages               | `page.tsx`       | `app/(site)/about/page.tsx`      |
| Layouts             | `layout.tsx`     | `app/(site)/layout.tsx`          |
| Route segments      | kebab-case       | `app/(site)/about/bye-laws/`     |
| Components          | PascalCase       | `SportCard.tsx`                  |
| Hooks               | camelCase + use  | `useTheme.ts`                    |
| Utilities           | camelCase        | `formatDate.ts`                  |
| Lib files           | camelCase        | `sanityClient.ts`                |
| Types               | PascalCase       | `Sport.ts` or inline in file     |
| CSS (global only)   | kebab-case       | `globals.css`                    |
| Config              | camelCase        | `drizzle.config.ts`              |

---

## Folder Structure

```
app/
├── (site)/
│   ├── layout.tsx              # Root layout: ThemeProvider, Navbar, Footer
│   ├── page.tsx                # /
│   ├── about/
│   │   ├── page.tsx            # /about
│   │   ├── team/
│   │   │   └── page.tsx        # /about/team
│   │   └── bye-laws/
│   │       └── page.tsx        # /about/bye-laws
│   ├── sports/
│   │   ├── page.tsx            # /sports (hub)
│   │   ├── coaching/
│   │   │   └── page.tsx        # /sports/coaching
│   │   └── [slug]/
│   │       └── page.tsx        # /sports/[slug]
│   ├── events/
│   │   ├── page.tsx
│   │   ├── leagues/
│   │   │   └── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── facilities/
│   │   ├── page.tsx
│   │   ├── rooms/
│   │   │   └── page.tsx
│   │   ├── banquets/
│   │   │   ├── page.tsx
│   │   │   └── [hall]/
│   │   │       └── page.tsx
│   │   ├── dining/
│   │   │   ├── page.tsx
│   │   │   └── [venue]/
│   │   │       └── page.tsx
│   │   ├── recreation/
│   │   │   ├── page.tsx
│   │   │   ├── kids-zone/
│   │   │   ├── cards-room/
│   │   │   └── housie/
│   │   ├── sports-shop/
│   │   ├── massage-chairs/
│   │   ├── library/
│   │   └── medical-cell/
│   ├── booking/
│   │   └── page.tsx
│   ├── membership/
│   │   ├── page.tsx
│   │   ├── affiliated-clubs/
│   │   │   └── page.tsx
│   │   └── [type]/
│   │       └── page.tsx
│   ├── achievements/
│   │   └── page.tsx
│   ├── partners/
│   │   ├── page.tsx
│   │   ├── team-spirit/
│   │   │   └── page.tsx
│   │   └── annual-report/
│   │       └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── downloads/
│   │   └── page.tsx
│   └── legal/
│       ├── page.tsx
│       └── cancellation/
│           └── page.tsx
│
├── (studio)/
│   └── studio/
│       └── [[...tool]]/
│           └── page.tsx
│
└── api/
    ├── revalidate/
    │   └── route.ts
    ├── booking/
    │   └── route.ts
    ├── membership/
    │   └── route.ts
    ├── contact/
    │   └── route.ts
    ├── partner/
    │   └── route.ts
    └── achievement/
        └── route.ts

components/
├── ui/                         # shadcn — NEVER EDIT
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ThemeProvider.tsx
│   └── MobileMenu.tsx
├── sections/
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── SportsGrid.tsx
│   │   ├── FacilitiesShowcase.tsx
│   │   ├── EventsPreview.tsx
│   │   ├── AchievementsReel.tsx
│   │   ├── MembershipCTA.tsx
│   │   └── PartnersStrip.tsx
│   ├── sports/
│   ├── events/
│   ├── facilities/
│   ├── membership/
│   └── [page]/
├── shared/
│   ├── SectionWrapper.tsx
│   ├── PageHero.tsx
│   ├── AnimatedText.tsx
│   ├── StatCounter.tsx
│   ├── SportCard.tsx
│   ├── EventCard.tsx
│   ├── AchievementCard.tsx
│   ├── FilterBar.tsx
│   ├── PDFViewer.tsx
│   └── forms/
│       ├── BookingForm.tsx
│       ├── MembershipInterestForm.tsx
│       ├── ContactForm.tsx
│       ├── PartnerForm.tsx
│       └── AchievementSubmitForm.tsx
└── three/
    ├── WebGLDetector.tsx
    ├── SceneCanvas.tsx
    ├── HeroScene.tsx
    ├── SportsScroll.tsx
    └── objects/
        ├── CricketBall.tsx
        ├── Shuttlecock.tsx
        ├── TennisBall.tsx
        └── WaterSphere.tsx

lib/
├── sanity/
│   ├── client.ts               # Sanity client
│   ├── queries.ts              # All GROQ queries
│   └── image.ts                # urlFor helper
├── db/
│   ├── schema.ts               # All Drizzle table definitions
│   ├── index.ts                # DB client + connection
│   └── migrations/             # Drizzle migration files
├── email/
│   ├── resend.ts               # Resend client
│   └── templates/
│       ├── booking.tsx
│       ├── membership.tsx
│       ├── contact.tsx
│       ├── partner.tsx
│       └── achievement.tsx
└── utils.ts                    # Shared utility functions

sanity/
├── schemaTypes/
│   ├── index.ts                # Exports all types
│   ├── singletons/
│   │   ├── siteConfig.ts
│   │   ├── membershipConfig.ts
│   │   ├── bookingConfig.ts
│   │   └── leaguesConfig.ts
│   └── documents/
│       ├── sport.ts
│       ├── committeeMember.ts
│       ├── milestone.ts
│       ├── achievement.ts
│       ├── event.ts
│       ├── banquetHall.ts
│       ├── diningVenue.ts
│       ├── foodStall.ts
│       ├── membershipType.ts
│       ├── partnershipOpportunity.ts
│       ├── teamSpiritEdition.ts
│       ├── annualReport.ts
│       ├── download.ts
│       └── legalPage.ts
├── lib/
│   └── client.ts
└── desk/
    └── structure.ts            # Desk structure: singletons pinned at top
```

---

## Component Patterns

### Server Components (default)
All page-level components are Server Components unless they need interactivity.

```typescript
// app/(site)/about/page.tsx
import { getSanityData } from '@/lib/sanity/queries'

export default async function AboutPage() {
  const data = await getSanityData()
  return <AboutContent data={data} />
}
```

### Client Components (explicit)
Only use `'use client'` when the component needs:
- `useState`, `useEffect`, `useRef`
- Browser APIs (localStorage, window)
- Event handlers (onClick, onChange, onSubmit)
- Animation (GSAP, Lenis, R3F)

```typescript
'use client'
// components/sections/home/StatsBar.tsx
```

### Prop Types
Always define prop types explicitly. No `any`.

```typescript
interface SportCardProps {
  sport: Sport           // Import from @/lib/sanity/queries or types file
  className?: string
}

export function SportCard({ sport, className }: SportCardProps) {
  // ...
}
```

### Component Exports
Named exports for all components. No default exports except pages and layouts.

```typescript
// components/shared/SportCard.tsx
export function SportCard({ ... }: SportCardProps) { ... }

// app/(site)/about/page.tsx
export default function AboutPage() { ... }
```

---

## Import Order

Biome/Ultracite enforces this. Follow to avoid auto-reformat surprises.

```typescript
// 1. React — always first if needed
import { useState, useEffect } from 'react'

// 2. Next.js
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// 3. Third-party packages
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 4. Internal aliases — @/ prefix
import { getSports } from '@/lib/sanity/queries'
import { SportCard } from '@/components/shared/SportCard'
import { SectionWrapper } from '@/components/shared/SectionWrapper'

// 5. Relative imports — only if no alias available
import { formatDate } from '../utils'

// 6. Types — last
import type { Sport } from '@/types'
```

---

## TypeScript Patterns

### No `any` — use `unknown` + type guard
```typescript
// Wrong
function handleData(data: any) { ... }

// Right
function handleData(data: unknown) {
  if (typeof data === 'string') { ... }
}
```

### Sanity query return types
Always type GROQ query results:

```typescript
interface SportQuery {
  _id: string
  name: string
  slug: { current: string }
  category: 'outdoor' | 'indoor' | 'aquatic' | 'health' | 'track'
  // ... rest of fields
}

const sports = await client.fetch<SportQuery[]>(SPORTS_QUERY)
```

### Form types with Zod inference
```typescript
import { z } from 'zod'

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  // ...
})

type BookingFormValues = z.infer<typeof bookingSchema>
```

---

## CSS / Tailwind Patterns

### Global tokens — define once in globals.css
```css
@theme {
  --color-primary: #1E88E5;
  --font-display: 'Barlow Condensed', sans-serif;
  /* all tokens here */
}
```

### Dark mode — Tailwind v4 variant
```css
/* In globals.css */
@variant dark (&:where(.dark, .dark *));
```

```tsx
// In component
<div className="bg-white dark:bg-[--color-surface-dark]">
```

### Hero sections — always dark regardless of theme
```tsx
<section data-theme="dark" className="...">
```

```css
/* In globals.css */
[data-theme="dark"] {
  --color-bg: var(--color-bg-dark);
  /* override all tokens for dark */
}
```

### Mobile-first — always
```tsx
// Wrong
<div className="grid-cols-3 sm:grid-cols-1">

// Right
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## Git Commit Format

```
type(scope): short description

Types: feat | fix | chore | style | refactor | docs | test
Scope: phase task code (e.g. 1A-03, 1B-07, 2-10)

Examples:
feat(1A-03): add design system tokens and theme provider
fix(1B-07): correct sport slug generation in Sanity
chore(1A-11): configure vercel env vars and first deploy
```

---

## Environment Variable Conventions

- Never hardcode values
- Always use `process.env.VAR_NAME`
- Client-accessible vars must be prefixed `NEXT_PUBLIC_`
- All vars documented in `.env.example`
- Never commit `.env.local`

```typescript
// Right
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

// Wrong
const projectId = 'abc123'
```

---

## Error Handling in API Routes

All API routes return consistent JSON:

```typescript
// Success
return Response.json({ success: true, id: result.id }, { status: 200 })

// Validation error
return Response.json({ success: false, error: 'Validation failed', details: errors }, { status: 400 })

// Server error
return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
```

---

## Sanity Image Rule

Always use `urlFor()` from `lib/sanity/image.ts`. Never use `.asset.url` directly.

```typescript
// Right
import { urlFor } from '@/lib/sanity/image'
<Image src={urlFor(sport.heroImage).width(800).url()} ... />

// Wrong
<Image src={sport.heroImage.asset.url} ... />
```

---

## ISR Pattern

Every Sanity fetch must include `tags` for cache invalidation via webhook.

```typescript
// lib/sanity/queries.ts
export async function getSports() {
  return client.fetch<SportQuery[]>(
    SPORTS_QUERY,
    {},
    { next: { tags: ['sports'] } }
  )
}
```

Webhook hits `/api/revalidate` → `revalidateTag('sports')` → Next.js purges cache.
