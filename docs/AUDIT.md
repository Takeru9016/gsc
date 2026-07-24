# GSC — Complete Gap Audit
# Everything missing, incomplete, inconsistent, or pending across all 34 files.
# Fix each item before or during the relevant build phase.
# Generated after full cross-reference audit of all docs, specs, schemas, prompts, and admin files.

---

## CATEGORY 1 — Schema Gaps (Sanity)

### 1.1 `aboutPage` singleton — DOES NOT EXIST

**Problem**: PAGES.md says /about pulls "History & Legacy" longform text from a Sanity `aboutPage` singleton. That document type is never defined in SCHEMA.md, never listed in the Sanity schema types, never seeded in SANITY_DATA_ENTRY.md, and never given an ISR cache tag.

**Impact**: 1B-02 prompt will fail — Claude Code will try to query a non-existent Sanity document.

**Fix**:
Add to SCHEMA.md under Singletons:

```typescript
// Singleton 5 — aboutPage
{
  _type: 'aboutPage',
  _id: 'aboutPage',
  historyText: portableText,       // Founding story, growth narrative
  historyImage: image,             // Historic photo shown right column
  byeLawsPdfUrl: string,           // Cloudinary URL — bye-laws PDF
  byeLawsUpdatedAt: date,          // Last updated date shown to visitors
}
```

Add to ISR cache tag table:
`aboutPage → 'about-page' → /about, /about/bye-laws`

Add to TAG_MAP in SANITY_CMS.md:
`aboutPage: 'about-page'`

Add to 1A-07 query list:
`getAboutPage()`

Add to SANITY_DATA_ENTRY.md seed scripts (PROMPT 10):
Seed the `aboutPage` singleton shell with placeholder text.

Add to admin dashboard (see Category 4).

---

### 1.2 `byeLawsPdfUrl` — In siteConfig but should be in `aboutPage`

**Problem**: SCHEMA.md puts `byeLawsPdfUrl` inside `siteConfig`. The 1B-04 prompt says "PDF URL from siteConfig or hardcoded Cloudinary URL for now". This is the wrong location — bye-laws is about/governance content, not site-wide config. It belongs in `aboutPage`.

**Fix**: Remove `byeLawsPdfUrl` from `siteConfig` schema. Add it to `aboutPage` singleton (see 1.1 above). Update the 1B-04 prompt to read from `getAboutPage()` instead of `getSiteConfig()`.

---

### 1.3 `bookingConfig` — Missing ISR cache tag

**Problem**: `bookingConfig` is a fully defined Sanity singleton in SCHEMA.md. It has a desk structure entry. But it has NO entry in the ISR cache tag table and NO entry in the TAG_MAP in SANITY_CMS.md. If staff updates booking config in Studio, the /facilities/rooms page will not revalidate.

**Fix**:
Add to ISR cache tag table in SCHEMA.md:
`bookingConfig → 'booking-config' → /facilities/rooms, /booking`

Add to TAG_MAP in SANITY_CMS.md:
`bookingConfig: 'booking-config'`

Add to 1A-07 query list:
`getBookingConfig()`

---

### 1.4 `foodStall` — Missing ISR cache tag + no query function + not rendered anywhere

**Problem**: `foodStall` is a fully defined Sanity document type in SCHEMA.md. But:
- No ISR cache tag in the table
- No TAG_MAP entry in SANITY_CMS.md
- No `getFoodStalls()` query in the 1A-07 query list
- The `/facilities/dining/food-court` page spec in PAGES.md says "Named branded stalls inside" but never actually describes rendering the food stall documents
- PROMPTS_2.md task 2-04 (dining hub + venues) makes no mention of food stalls at all

**Fix**:
Add to ISR cache tag table: `foodStall → 'food-stalls' → /facilities/dining/food-court`
Add to TAG_MAP: `foodStall: 'food-stalls'`
Add `getFoodStalls()` to 1A-07 query list.
Add to PAGES.md under Dining Venue `/facilities/dining/food-court`:
```
Special section for Food Court only:
Food Stalls Grid — card per stall from getFoodStalls()
Each card: stall name, cuisine type, Veg/Non-Veg badge, image, brief description
```
Add to 2-04 prompt: "For food-court slug specifically, also fetch getFoodStalls() and render a stalls grid below the venue description."

---

### 1.5 Missing GROQ query functions (never listed anywhere)

These document types have Sanity schemas but no corresponding query function listed in 1A-07:
- `getAboutPage()` — needed by /about and /about/bye-laws
- `getBookingConfig()` — needed by /facilities/rooms and /booking
- `getFoodStalls()` — needed by /facilities/dining/food-court
- `getCommitteeMembers(role?)` — listed in 1A-07 but role filter not mentioned

---

## CATEGORY 2 — Page Spec Gaps

### 2.1 `/about/bye-laws` — PDF source undefined in prompt

**Problem**: PAGES.md spec says "react-pdf viewer for bye-laws PDF. Cloudinary-hosted." The 1B-04 prompt says "PDF URL: [PENDING_CONTENT] placeholder div. Show 'PDF will be available here.' until URL provided." But it never specifies WHERE the URL comes from once it's provided. With the `aboutPage` singleton fix (1.1), it should come from `getAboutPage().byeLawsPdfUrl`.

**Fix**: Update 1B-04 prompt — replace the Cloudinary URL placeholder reference with:
```
Fetch getAboutPage() — use aboutPage.byeLawsPdfUrl as PDF source.
If null: show placeholder "Bye-laws document being prepared. Contact us for the current document."
If set: render PDFViewer component with byeLawsPdfUrl.
```

---

### 2.2 `/about` — `aboutPage` singleton content never fetched

**Problem**: The 1B-02 prompt references `portableText from aboutPage singleton` for the History & Legacy section, but since `aboutPage` doesn't exist in the schema, there's nothing to fetch. The prompt says "use placeholder text for now, note [PENDING_CONTENT]" which is correct for now, but the actual Sanity fetch is never wired up.

**Fix**: Once `aboutPage` singleton is added (1.1), update 1B-02 prompt to include `getAboutPage()` fetch and render `aboutPage.historyText` via PortableTextRenderer.

---

### 2.3 `/facilities/dining/food-court` — Stalls not rendered

**Problem**: food-court is one of the 6 dining venue slugs. The dining venue template handles all 6 venues generically. But food-court has a unique characteristic — it contains named branded stalls. The page spec in PAGES.md only says "Named branded stalls inside" in the GSC.md dining table, but the PAGES.md dining venue section makes no mention of rendering food stalls.

**Fix**: Add to PAGES.md under Dining Venue section:
```
Food Court special section (conditional: if venue.slug === 'food-court'):
  Food Stalls Grid — card per stall from getFoodStalls()
  Each card: name, cuisine type, Veg/Non-Veg badge, image
```

---

### 2.4 `/about/bye-laws` — Missing from redirect map

**Problem**: The old GSC site has a bye-laws page. Its old URL is not in the 301 redirect map in GSC.md. If it existed at `/Bye-Laws` or `/bye-laws` on the old site, links to it from external sites will 404.

**Action**: Verify the old URL on gsc.in before launch. Likely candidates:
- `/Bye-Laws` → `/about/bye-laws` (add to next.config.ts)
- `/Club-Rules` → `/about/bye-laws`

---

## CATEGORY 3 — Admin Dashboard Gaps

### 3.1 Admin Phase not in CLAUDE.md Phase Tracker

**Problem**: CLAUDE.md has Phase 1A, 1B, 2, and 3 tracked with checkboxes. The admin dashboard (ADMIN-01 through ADMIN-09 + ADMIN-P1 through ADMIN-P3) has no tracker entry. This means `/done` command won't know where admin tasks are.

**Fix**: Add Phase 4 to CLAUDE.md Phase Tracker:

```
### Phase 4 — Admin Dashboard (12 tasks)
[ ] ADMIN-01  Better Auth setup + DB migration
[ ] ADMIN-02  Admin route structure + middleware + login
[ ] ADMIN-03  Dashboard overview page
[ ] ADMIN-04  Submissions management (all 5 Drizzle tables)
[ ] ADMIN-05  Content: Sports + Events
[ ] ADMIN-06  Content: Achievements + Dining + Banquets
[ ] ADMIN-07  Content: Membership + Downloads + Settings
[ ] ADMIN-08  User management
[ ] ADMIN-09  Security hardening + final wiring
[ ] ADMIN-P1  Booking Config + Leagues Config
[ ] ADMIN-P2  Committee + Milestones + Food Stalls + Membership Types
[ ] ADMIN-P3  Partnerships + Team Spirit + Annual Reports + Legal Pages
```

---

### 3.2 `/about/bye-laws` admin management — Missing entirely

**Problem**: There is no admin page for managing the bye-laws PDF. The `aboutPage` singleton (once created) contains `byeLawsPdfUrl`. Staff need a way to upload a new bye-laws PDF and update the URL without going to Sanity Studio.

**Fix**: Add to ADMIN-07 (Settings page) OR add as a separate section:

```
Section — Bye-Laws Document (in /admin/content/settings or /admin/content/about):
  Current bye-laws PDF: [show filename or "Not uploaded"]
  "Upload New Bye-Laws PDF" → Cloudinary file upload
  On upload: store URL → PATCH aboutPage.byeLawsPdfUrl → revalidateTag('about-page')
  byeLawsUpdatedAt: auto-set to today on upload
  Note: "This updates the PDF shown on /about/bye-laws immediately."
```

---

### 3.3 `/about` content — No admin page for history text

**Problem**: The `aboutPage` singleton has a `historyText` portableText field that drives the History & Legacy section on /about. There is no admin page to edit this content.

**Fix**: Add `/admin/content/about` page:

```
PAGE: app/(admin)/content/about/page.tsx
Fetch aboutPage singleton.

Section 1 — History & Legacy:
  historyText (large textarea)*
  historyImage — Cloudinary upload
  Save → PATCH aboutPage → revalidateTag('about-page')

Section 2 — Bye-Laws PDF:
  byeLawsPdfUrl — current value shown
  "Upload New PDF" → Cloudinary upload → PATCH + revalidate
  byeLawsUpdatedAt — auto-set on save
```

Add to AdminSidebar under Content group:
`About Page → /admin/content/about`

Add API route:
`app/api/admin/content/about/route.ts`
`PATCH: update aboutPage fields → sanityPatch + revalidateTag('about-page')`

---

### 3.4 `tsx` not in INSTALL.md dev dependencies

**Problem**: ADMIN-09 and SANITY_DATA_ENTRY.md seed scripts use `tsx` to run TypeScript files directly. The INSTALL.md dev dependencies list doesn't include `tsx`. Also `@better-auth/cli` is referenced in ADMIN-01 but not in INSTALL.md.

**Fix**: Add to INSTALL.md Step 3 dev dependencies:
```bash
pnpm add -D tsx
pnpm add -D @better-auth/cli
```
Add to devDependencies reference list: `tsx`, `@better-auth/cli`

---

### 3.5 `ADMIN_EMAIL` and `ADMIN_PASSWORD` not in `.env.example`

**Problem**: CLAUDE.md now lists `ADMIN_EMAIL` and `ADMIN_PASSWORD` as environment variables (added in the Better Auth update). But `.env.example` in the project root is generated during 1A-01 from the CLAUDE.md list. If CLAUDE.md is used as the source of truth for env vars, these new vars need to be explicitly noted for the `.env.example` generation step.

**Fix**: Already added to CLAUDE.md. Confirm the 1A-01 prompt says to include ALL vars from CLAUDE.md in `.env.example`. The existing 1A-01 prompt says "Create `.env.example` with all variable names from CLAUDE.md, no values" — so this is handled as long as CLAUDE.md is updated first. ✓

---

## CATEGORY 4 — SANITY_DATA_ENTRY.md Gaps

### 4.1 `aboutPage` singleton not seeded

**Problem**: The `aboutPage` singleton has no seed script in SANITY_DATA_ENTRY.md.

**Fix**: Add PROMPT 10 to SANITY_DATA_ENTRY.md:

```
PROMPT 10 — Seed aboutPage Singleton

Write a one-time seed script at scripts/seed-about-page.ts

{
  _id: 'aboutPage',
  _type: 'aboutPage',
  historyText: [
    {
      _type: 'block',
      _key: 'a1',
      children: [{ _type: 'span', _key: 'a2', text: '[PENDING — founding story and history from management]', marks: [] }],
      markDefs: [],
      style: 'normal',
    }
  ],
  byeLawsPdfUrl: null,        // [PENDING — upload bye-laws PDF to Cloudinary first]
  byeLawsUpdatedAt: null,
}

Use createOrReplace(). Add pnpm script "seed:about-page".
Add to seed-all.ts sequence.
```

---

### 4.2 `bookingConfig` not seeded

**Problem**: `bookingConfig` is a Sanity singleton with room types and booking email. No seed script in SANITY_DATA_ENTRY.md.

**Fix**: Add PROMPT 11:

```
PROMPT 11 — Seed bookingConfig Singleton

{
  _id: 'bookingConfig',
  _type: 'bookingConfig',
  bookingEmail: 'booking@gsc.in',
  responseTime: 'We respond within 24 hours',
  rooms: [
    '[PENDING — room types from manager: name, type, capacity]'
  ],
}

Use createOrReplace(). Add pnpm script "seed:booking-config".
Add to seed-all.ts sequence.
```

---

### 4.3 `partnershipOpportunity` not seeded

**Problem**: No seed script for `partnershipOpportunity` documents. The /partners page will show empty state.

**Fix**: Add PROMPT 12:

```
PROMPT 12 — Seed Partnership Opportunities

{
  _type: 'partnershipOpportunity',
  title: 'Title Sponsor',
  description: '[PENDING]',
  reachStats: '40,000+ member network, 2,000+ daily footfall',
  benefits: ['Logo on all event collateral', 'Digital presence across GSC platforms', 'VIP event access'],
  isHighlighted: true,
  order: 1,
},
{
  _type: 'partnershipOpportunity',
  title: 'Event Partner',
  description: '[PENDING]',
  reachStats: 'Per-event audience of 500-2,000 members',
  benefits: ['Brand visibility at sponsored event', 'Social media mentions', 'On-ground branding'],
  isHighlighted: false,
  order: 2,
},
{
  _type: 'partnershipOpportunity',
  title: 'Digital Partner',
  description: '[PENDING]',
  reachStats: 'Website: 10,000+ monthly visitors',
  benefits: ['Banner placement on gsc.in', 'Newsletter mentions', 'Social media features'],
  isHighlighted: false,
  order: 3,
},
```

---

## CATEGORY 5 — Redirect Map Gaps

### 5.1 Old bye-laws URL unknown

**Problem**: The old gsc.in site likely had a bye-laws/club-rules page but the URL is not documented and not in the redirect map.

**Action**: Before launch, manually check gsc.in for a bye-laws link. Add whatever URL exists to next.config.ts redirects pointing to `/about/bye-laws`.

---

### 5.2 Old membership page URLs not mapped

**Problem**: The old site likely had individual membership pages. None of these are in the redirect map. Members bookmarking old URLs will 404.

**Action**: Check `/membership-1`, `/Life-Membership`, `/Corporate-Membership` type URLs on old site. Add found URLs to next.config.ts.

---

## CATEGORY 6 — INSTALL.md + Setup Gaps

### 6.1 `tsx` and `@better-auth/cli` missing from dev dependencies

Covered in 3.4 above.

### 6.2 `CLAUDE_CODE_SETUP.md` not updated for admin

**Problem**: `docs/CLAUDE_CODE_SETUP.md` has a verification checklist and prerequisites section. It doesn't mention:
- Better Auth setup steps
- Running `pnpm create:admin` to create the first user
- Admin verification step (`/admin/login` loads)

**Fix**: Add to the verification checklist at the bottom of `CLAUDE_CODE_SETUP.md`:
```
Admin (after Phase 4):
[ ] BETTER_AUTH_SECRET set in .env.local (openssl rand -base64 32)
[ ] BETTER_AUTH_URL set to app URL
[ ] pnpm create:admin run — first admin user created
[ ] /admin/login loads and accepts credentials
[ ] /admin/dashboard accessible after login
[ ] Staff user created and tested — cannot see /admin/users
```

---

## CATEGORY 7 — PHASES.md + CLAUDE.md Gaps

### 7.1 Admin phase missing from PHASES.md

**Problem**: PHASES.md documents Phases 1A, 1B, 2, and 3 in detail. There is no Phase 4 for the admin dashboard. If someone reads PHASES.md as the build plan, they'll have no idea admin tasks exist.

**Fix**: Add Phase 4 summary to PHASES.md:

```
## Phase 4 — Admin Dashboard (12 tasks)

Run after Phase 3 is complete.
Full prompt set in prompts/ADMIN_DASHBOARD.md and prompts/ADMIN_DASHBOARD_PATCH.md.

ADMIN-01  Better Auth setup + Drizzle auth table migration
ADMIN-02  /admin route group, middleware, login page, sidebar
ADMIN-03  Dashboard overview — submission counts + content counts
ADMIN-04  Submissions pages — all 5 Drizzle tables (bookings, memberships, contacts, partners, achievements)
ADMIN-05  Content: Sports + Events (CRUD + Sanity write + revalidateTag)
ADMIN-06  Content: Achievements + Dining + Banquets
ADMIN-07  Content: Membership enrollment toggle + Downloads + Site Settings
ADMIN-08  User management (Better Auth admin plugin)
ADMIN-09  Security hardening — requireAdminSession, rate limiting, security headers
ADMIN-P1  Booking Config + Leagues Config (missed in original)
ADMIN-P2  Committee + Milestones + Food Stalls + Membership Types (missed)
ADMIN-P3  Partnerships + Team Spirit + Annual Reports + Legal Pages (missed)
```

---

## SUMMARY TABLE

| # | Gap | File(s) affected | Severity |
|---|-----|-----------------|----------|
| 1.1 | `aboutPage` singleton missing from schema entirely | SCHEMA.md, SANITY_CMS.md, PROMPTS_1A.md | **Critical** |
| 1.2 | `byeLawsPdfUrl` in wrong singleton (siteConfig) | SCHEMA.md, PROMPTS_1B.md | **High** |
| 1.3 | `bookingConfig` missing ISR cache tag + TAG_MAP | SCHEMA.md, SANITY_CMS.md | **High** |
| 1.4 | `foodStall` missing ISR tag + query + page rendering | SCHEMA.md, SANITY_CMS.md, PAGES.md, PROMPTS_2.md | **High** |
| 1.5 | 3 missing GROQ query functions | PROMPTS_1A.md | **High** |
| 2.1 | /about/bye-laws PDF source unresolved in prompt | PROMPTS_1B.md | **High** |
| 2.2 | /about history text fetch unresolved | PROMPTS_1B.md | **High** |
| 2.3 | /facilities/dining/food-court stalls not rendered | PAGES.md, PROMPTS_2.md | **Medium** |
| 2.4 | Bye-laws old URL missing from redirect map | GSC.md | **Low** |
| 3.1 | Admin phase not in CLAUDE.md tracker | CLAUDE.md | **High** |
| 3.2 | Bye-laws PDF upload missing from admin | ADMIN_DASHBOARD.md | **High** |
| 3.3 | aboutPage history text edit missing from admin | ADMIN_DASHBOARD.md | **High** |
| 3.4 | `tsx` + `@better-auth/cli` not in INSTALL.md | INSTALL.md | **Medium** |
| 3.5 | ADMIN env vars in CLAUDE.md but not confirmed in .env.example step | PROMPTS_1A.md | **Low** |
| 4.1 | `aboutPage` not seeded | SANITY_DATA_ENTRY.md | **Medium** |
| 4.2 | `bookingConfig` not seeded | SANITY_DATA_ENTRY.md | **Medium** |
| 4.3 | `partnershipOpportunity` not seeded | SANITY_DATA_ENTRY.md | **Low** |
| 5.1 | Bye-laws old URL unknown + not redirected | GSC.md | **Low** |
| 5.2 | Old membership URLs not mapped | GSC.md | **Low** |
| 6.1 | `tsx` + `@better-auth/cli` missing from INSTALL.md | INSTALL.md | **Medium** |
| 6.2 | `CLAUDE_CODE_SETUP.md` not updated for admin | docs/CLAUDE_CODE_SETUP.md | **Low** |
| 7.1 | Admin phase missing from PHASES.md | docs/PHASES.md | **Medium** |

**Critical**: Build will fail or produce broken pages without this fix.
**High**: Feature won't work correctly — needs fixing before the relevant task.
**Medium**: Missing convenience or completeness — fix before launch.
**Low**: Documentation gap — fix when convenient.
