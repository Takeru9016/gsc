# GSC — Launch Readiness Report (Task 3-11)

Generated during the Phase 3 performance audit. Covers what was verified in-repo, what was fixed, and what requires manual/live verification before go-live.

---

## 1. Build & Bundle

- `pnpm build` — **passes, 0 errors.** TypeScript clean, Biome clean (227 files).
- No route exceeds the 500KB gzipped First Load JS budget. Largest routes:
  - `/sports/[slug]` — ~330 KB gzip
  - `/` (homepage) — ~329 KB gzip
  - All facility/legal/membership pages — ~98 KB gzip
- The homepage and sport-detail bundles include a ~224 KB gzip chunk containing `@react-three/fiber` + `three`. Confirmed this chunk is **not** part of the blocking initial payload — it's split out via `dynamic(..., { ssr: false })` and only fetched client-side after `useWebGL()` resolves to `true` (desktop, non-mobile UA). This is the intended progressive-enhancement behavior, not a regression.
- The Sanity Studio bundle (~4.1 MB raw / ~1.3 MB gzip) is scoped entirely to `/studio` — confirmed via its own `client-reference-manifest`, does not leak into public routes.
- **Dynamic imports**: `HeroScene`, `SportsScroll`, all 4 sport hero objects (`CricketBall`, `Shuttlecock`, `TennisBall`, `WaterSphere`), and `PDFViewerLazy` all correctly use `dynamic(() => import(...), { ssr: false })` per `docs/3D.md`.

## 2. Fixes applied this session

- **`next.config.ts`** — added the full 14-entry 301 redirect map from `GSC.md` (previously missing entirely; `redirects()` was not implemented). First pass used `permanent: true`, which Next.js maps to HTTP **308**, not 301 — caught in review and corrected to explicit `statusCode: 301` on every entry. Re-verified against `.next/routes-manifest.json` after rebuild: all 14 entries now report `statusCode: 301`:
  `/the-club`, `/the-club/history`, `/the-club/team`, `/achivement`, `/ONGOING%20EVENTS`, `/Turf`, `/Massage-Center`, `/in-house-marketing`, `/Team-Spirit`, `/Annual-Report`, `/Notice`, `/Downloads`, `/Blog`, `/Gallery`.
  - Note: `/Turf` redirects to `/sports/indoor-cricket-nets` — this only resolves once a `sport` document with that slug exists in Sanity. Flag for content QA once real sport data is seeded.
  - Confirmed no `proxy.ts`/`middleware.ts` exists in the repo, so there's no conflicting redirect layer — despite Phase Tracker 2-15 claiming "301 redirects" were already done, this was the first actual implementation.
- **Missing `sizes` prop on 14 `fill`-mode `next/image` usages** — without `sizes`, Next.js defaults to requesting a `100vw`-wide image at every breakpoint, which was silently forcing oversized downloads on mobile grid/card layouts. Added layout-appropriate `sizes` to:
  `PageHero`, `SportCard`, `EventCard`, `AchievementCard`, `AchievementsGrid` (both the grid card and lightbox dialog image), `CommitteeGrid`, `SportAchievements`, `TeamSpiritEditionsGrid`, `AnnualReportsList`, `BanquetHallDetails`, `BanquetHallGallery`, `DiningVenueGallery`, `DiningVenueGrid`, `BanquetHallGrid`.
  - Re-verified with a full-repo scan: zero remaining `fill` images without `sizes`.
- Re-ran `pnpm typecheck`, `pnpm lint`, `pnpm build` after both fixes — all clean.

## 3. Code-level checks (verified by reading source, not live browser)

| Check | Status |
|---|---|
| Fonts via `next/font/google`, no manual `@import` | ✅ Confirmed in `(site)/layout.tsx` and `not-found.tsx`; `globals.css` only has `@import "tailwindcss"` |
| Hero LCP image has `priority` | ✅ `PageHero.tsx` sets `priority` on its background image; homepage `HeroSection` has no `<Image>` (WebGL/CSS particle hero, no LCP image dependency) |
| ISR tags on every Sanity fetch | ✅ All 24 `client.fetch()` calls in `lib/sanity/queries.ts` include `next: { tags: [...] }` |
| Revalidate webhook (`/api/revalidate`) | ✅ Reads raw body before `JSON.parse`, verifies HMAC via `isValidSignature`, maps all 16 document types to cache tags, calls `revalidateTag(tag, "max")` |
| WebGL detection gates mobile correctly | ✅ `WebGLDetector.tsx` checks mobile UA first, then `WebGLRenderingContext` — matches `docs/3D.md` spec exactly |
| `useFrame` callbacks free of per-frame allocations | ✅ Scanned all `useFrame` bodies in `HeroScene.tsx`, `SportsScroll.tsx`, and all 4 sport objects — no `new THREE.*`/`new Vector3`/`new Color` inside any callback |
| Dispose pattern on 3D objects | ✅ All 4 objects in `components/three/objects/` call `.dispose()` on geometry/material in a cleanup effect |

## 4. Requires live/manual verification (cannot be done from this environment)

These items from the task brief need a real browser, a deployed Vercel URL, and/or live Sanity dashboard access — none of which this session has:

1. **Lighthouse audit** (Performance >85 mobile / >90 desktop) — run in Chrome DevTools against the production Vercel URL once deployed.
2. **WebGL frame-rate profiling** — record a Performance-tab trace scrolling through all 6 `/sports` scenes; confirm no drops below 55fps and no memory growth across scene transitions. Also verify Chrome's mobile device-mode emulation renders the `SportsScrollFallback` with no `<canvas>` present.
3. **ISR live round-trip** — edit a `sport` document in Sanity Studio, confirm the webhook fires (Sanity dashboard → webhook logs) and `/sports/[slug]` reflects the change within 5 seconds. Check `/api/revalidate` logs in Vercel if it doesn't.
4. **301 redirect live check** — hit each of the 14 old URLs against the deployed domain and confirm a 301 (not a 308/200/404). The redirect config is correct in code; only live serving behavior needs confirming.
5. **Mobile visual QA at 375px** — no horizontal scroll, forms usable with the virtual keyboard, across all ~45 routes.

---

## 5. PENDING_CONTENT — Client Handoff Checklist

Everything below is marked `[PENDING_CONTENT]` in the codebase and needs real data from GSC staff before launch. Grouped by owner/urgency:

### Emergency / safety-critical (highest priority)
- Emergency medical contact number — shown in **global footer** (`Footer.tsx`) and **Medical Cell page** (`facilities/medical-cell/page.tsx`)
- Secondary emergency number — footer + medical cell
- Doctor schedule — Medical Cell page

### Facility specifics (manager-provided)
- Room types, counts, amenities — `facilities/rooms` (`RoomGrid.tsx`)
- Banquet hall capacities (Regal, Rhythm, Glamourra) — `facilities/banquets/[hall]` (`BanquetHallGrid.tsx`, `BanquetHallDetails.tsx`)
- Banquet hall amenities/AV equipment and setup options — `BanquetHallDetails.tsx`
- Dining venue opening hours + reservation info — `DiningVenueHours.tsx`, `DiningVenueAbout.tsx`
- Massage chair count/models/pricing — `facilities/massage-chairs`
- Sports Shop stock/brands — `facilities/sports-shop`
- Library collection details — `facilities/library`
- Housie format, prizes, schedule — `facilities/recreation/housie`
- Kids Zone activities/supervision details — `facilities/recreation/kids-zone`
- Cards Room games/house rules — `facilities/recreation/cards-room`

### Content/copy (marketing or admin-provided)
- About page history copy + historic image — `HistorySection.tsx`
- Milestones timeline entries (currently 3 placeholder milestones) — `MilestonesTimeline.tsx`
- Google Maps embed URL — `contact` page (`ContactInfoPanel.tsx`)
- Bye-laws PDF (Cloudinary-hosted) — `about/bye-laws`
- Membership eligibility/benefits copy per type — `MembershipEligibility.tsx`, `MembershipBenefits.tsx`
- Affiliated clubs list (currently 3 placeholders) — `AffiliatedClubsList.tsx`
- Coaching schedules per sport — `SportCoaching.tsx`, `CoachingGrid.tsx`
- Sport full descriptions — `SportAbout.tsx`
- Event descriptions/venue — `EventDetails.tsx`
- Team Spirit ad specs/rates — `TeamSpiritAdvertiseSection.tsx`
- Legal pages (privacy policy, terms) — awaiting `legalPage` Sanity documents

### Technical/ops (needed for launch, not content)
- **Cloudinary unsigned upload preset name** — required for the achievement-photo submission flow (`AchievementSubmitForm`); referenced via `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` env var, not yet set.
- Contact email/phone/address placeholders in `lib/sanity/queries.ts` fallback (`siteConfig` singleton not yet populated in Sanity) — also feed into the 3 confirmation email templates (`booking.tsx`, `contact.tsx`, `membership.tsx`), which currently show `[PENDING_CONTENT]` for phone/email in the footer line.

---

## 6. Pre-Launch Checklist (external/ops — cannot be verified from this session)

- [ ] All env vars set in Vercel production (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_TOKEN`, `SANITY_WEBHOOK_SECRET`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET`, `NEXT_PUBLIC_SITE_URL`)
- [ ] Custom domain `gsc.in` pointed to Vercel (A record or CNAME)
- [ ] SSL verified (automatic via Vercel once domain is attached)
- [ ] Sanity Studio access credentials shared with GSC staff
- [ ] Resend domain (`gsc.in`) verified in Resend dashboard, so confirmation emails don't land in spam
- [ ] Test all 5 form submissions in production (booking, membership, contact, partner, achievement) — not localhost
- [ ] DPDP Act compliance — legal review of `/legal` and `/legal/cancellation` before launch
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Confirm the Sanity webhook target URL is the production domain, not a Vercel preview URL

---

## 7. Phase Tracker

Task 3-11 code-level work (bundle audit, redirect map, image `sizes` fix, ISR/webhook/WebGL code review) is complete. The remaining items in section 4 (Lighthouse, live WebGL profiling, live ISR round-trip, live redirect check, mobile device QA) and section 6 (ops/credentials) require a deployed environment and manual testing — hold `/done` until those are run against the production Vercel URL, or explicitly accept this report as sufficient to close the phase.
