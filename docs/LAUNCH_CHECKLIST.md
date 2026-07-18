# GSC — Launch Readiness Report (Task 3-05)

Generated during the Phase 3 performance audit (video hero + Lottie + GSAP stack). This replaces the previous version of this file, which was written against the earlier R3F/WebGL-based Phase 3 plan and no longer matched the codebase after the 3-01→3-04 rewrite to Lenis+GSAP+Lottie+video.

---

## 1. Build & Bundle

- `pnpm build` — **passes, 0 TypeScript errors.**
- `pnpm lint` (Biome/Ultracite) — **0 violations**, 228 files checked.
- Turbopack builds in Next.js 16 don't print a First Load JS size table, so per-route gzip size was computed directly from each route's `client-reference-manifest.js` + actual chunk files on disk. No route exceeds 300KB gzipped:

  | Route | Gzip First Load JS |
  |---|---|
  | `/` (homepage) | ~97 KB |
  | `/sports/[slug]` | ~177 KB |
  | `/sports` (hub, with SportsScroll + Lottie) | ~180 KB |
  | `/booking` (RHF + Zod) | ~206 KB |
  | `/achievements` (RHF + Zod + Cloudinary upload + lightbox) | ~210 KB |

  The two largest per-route chunks are `lottie-react`/`lottie-web` (~310KB raw, only on `/sports` and `/sports/[slug]`) and `zod` (~313KB raw, only on form-bearing routes). Both are raw/uncompressed sizes — gzipped they're well within budget, and both only load on the routes that need them (not in a shared/global chunk).
- The Sanity Studio bundle (~4.1MB raw) is scoped entirely to `/studio` — confirmed via its own `client-reference-manifest`, does not leak into public routes.

## 2. Fix applied this session

- **`next.config.ts` — the 301 redirect map from `GSC.md` § 301 Redirect Map did not exist at all.** No `redirects()` function, no `proxy.ts`/`middleware.ts`. This is despite the Phase Tracker marking task **2-15 (SEO — sitemap, robots, metadata, redirects) as complete**. Added all 14 entries with explicit `statusCode: 301` (not `permanent: true`, which Next.js 16 maps to HTTP 308). Verified against `.next/routes-manifest.json` post-build — all 14 report `statusCode: 301`:
  `/the-club`, `/the-club/history`, `/the-club/team`, `/achivement`, `/ONGOING%20EVENTS`, `/Turf`, `/Massage-Center`, `/in-house-marketing`, `/Team-Spirit`, `/Annual-Report`, `/Notice`, `/Downloads`, `/Blog`, `/Gallery`.
  - `/Turf → /sports/indoor-cricket-nets` only resolves once a `sport` document with that exact slug exists in Sanity — no such slug currently exists in the codebase (sports are entirely CMS-driven). Flag for content QA once real sport data is seeded.
  - Re-ran `pnpm build` after the change — still 0 errors, 0 Biome violations.
- No other code changes were made. Everything else below is either already correct or requires content/ops, not code.

## 3. Code-level checks (verified by reading source — not a live browser)

| Check | Status |
|---|---|
| `heroVideoUrl` field on Sanity `siteConfig` schema | ✅ Present in `sanity/schemaTypes/singletons/siteConfig.ts` |
| Video hero: `autoPlay muted loop playsInline` + `poster` | ✅ `HeroSection.tsx` — all four attributes present |
| Video source falls back to `NEXT_PUBLIC`/local path if Sanity field empty | ✅ `siteConfig.heroVideoUrl ?? "/videos/gsc-hero.mp4"` |
| All 6 Lottie JSON files present in `public/lottie/` | ✅ cricket (86KB), swimming (69KB), badminton (90KB), tennis (30KB), squash (16KB), gym (31KB) — all under the 200KB budget |
| Lottie hidden below `lg`/`md` breakpoint (mobile) | ✅ `SportsScroll.tsx` panel: `hidden ... lg:flex`; sport-detail hero: `hidden ... md:flex` |
| `prefers-reduced-motion` guard on every GSAP file | ✅ Scanned all files using `gsap.from/to/timeline` — every one checks `window.matchMedia('(prefers-reduced-motion: reduce)')` before animating |
| ISR tags on every Sanity fetch | ✅ All 24 `client.fetch()` calls in `lib/sanity/queries.ts` include `next: { tags: [...] }` |
| Revalidate webhook (`/api/revalidate`) | ✅ Reads raw body before `JSON.parse`, verifies HMAC via `isValidSignature`, maps all document types to cache tags |
| `fill`-mode `<Image>` usages missing `sizes` | ✅ None — scanned all 18 files importing `next/image`; every `fill` image has a `sizes` prop |
| LCP: `PageHero` background image has `priority` | ✅ Set on the background `<Image>` in `PageHero.tsx` |
| Fonts via `next/font/google`, no manual `@import` | ✅ `globals.css` only has `@import "tailwindcss"` |
| No `console.log`/`debugger` in source | ✅ Enforced by Biome/Ultracite, 0 violations |

## 4. Finding — not fixed, needs a decision

**Dead WebGL/R3F code still in the tree, packages still installed.** `docs/3D.md` explicitly says the original React Three Fiber plan was replaced and `components/three/` should be "Entire directory deleted," with `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` removed from `package.json`. In the current repo:
- `src/components/three/` still exists (`WebGLDetector.tsx`, `SportsScroll.tsx`, `SceneCanvas.tsx`, `HeroScene.tsx`)
- `src/components/sections/sports/SportsScrollWebGL.tsx` still exists
- All four R3F/Three packages are still in `package.json`

None of this is imported by any live route (confirmed via grep — `SportsScrollWebGL.tsx` has zero importers, and nothing outside `components/three/` imports from it), so **it does not affect the shipped bundle or Lighthouse score**. It's pure dead code inflating `node_modules`/install size and CI build time, and it contradicts the "Packages Removed" section of `docs/3D.md`. Left untouched since deleting 4+ files and editing `package.json`/lockfile is outside this audit's scope — flagging for a decision on whether to clean it up in a follow-up task.

## 5. Requires live/manual verification (cannot be done from this environment)

1. **Video hero playback** — Chrome desktop, Safari iOS, Chrome Android. Code is correct (`muted playsInline autoPlay`), but **`public/videos/gsc-hero.mp4` does not exist in the repo** — only a `README.md` placeholder. Until the file is added (or `siteConfig.heroVideoUrl` is set in Sanity), the `<source>` 404s and the page falls back to the poster + dark overlay, which is graceful but not the intended experience.
2. **Hero poster image** — `public/images/hero-poster.jpg` exists (1920×1080, 34KB) but is a **solid dark-navy placeholder**, not an actual frame from the hero video. Already flagged in-code with a `[PENDING_CONTENT]` comment in `HeroSection.tsx`.
3. **Lighthouse audit** (Performance >85 mobile / >90 desktop) — run against the deployed Vercel production URL; cannot be run from this local environment.
4. **GSAP sports-scroll pin/snap behavior, progress dots, page transitions** — needs a real browser scroll session.
5. **301 redirect live check** — code is correct and verified against `.next/routes-manifest.json`; still needs a hit against the deployed domain to confirm Vercel/edge doesn't alter the status code.
6. **ISR live round-trip** — edit a Sanity document, confirm the webhook fires and the page updates within 10 seconds. Check `/api/revalidate` in Vercel function logs.
7. **Mobile visual QA at 375px** — no horizontal scroll, forms usable with the virtual keyboard, navbar mobile menu, across all routes.

---

## 6. PENDING_CONTENT — Client Handoff Checklist

`grep -rn "PENDING_CONTENT" src/` returns **109 occurrences across 54 files** — this is expected at this stage since Sanity hasn't been seeded with real content yet. Grouped by owner/urgency:

### Media assets (blocks the intended hero experience)
- **`public/videos/gsc-hero.mp4`** — not present in the repo at all. Source: `https://www.gsc.in/public/user/images/GSC.mp4`, compress to <8MB per `docs/3D.md`, then either drop in `public/videos/` or upload and set `siteConfig.heroVideoUrl` in Sanity (preferred — no redeploy needed for future changes).
- **`public/images/hero-poster.jpg`** — currently a solid-color placeholder. Replace with the actual first frame of the final hero video.
- All 6 Lottie JSON files — **already in place**, no action needed.

### Emergency / safety-critical (highest priority)
- Emergency medical contact number — global footer (`Footer.tsx`) and Medical Cell page
- Secondary emergency number — footer + medical cell
- Doctor schedule — Medical Cell page

### Facility specifics (manager-provided)
- Room types, counts, amenities — `facilities/rooms`
- Banquet hall capacities (Regal, Rhythm, Glamourra) + AV/setup options
- Dining venue opening hours + reservation info
- Massage chair count/models/pricing, Sports Shop stock, Library collection details
- Housie format/prizes/schedule, Kids Zone activities, Cards Room rules

### Content/copy
- About page history copy + historic image; milestones timeline (currently placeholders)
- Google Maps embed URL (`contact` page)
- Bye-laws PDF (Cloudinary-hosted)
- Membership eligibility/benefits copy per type; affiliated clubs list (placeholders)
- Coaching schedules per sport; sport full descriptions; event descriptions
- Team Spirit ad specs/rates; legal pages (privacy policy, terms) — awaiting `legalPage` Sanity documents

### Technical/ops (needed for launch, not content)
- **Cloudinary unsigned upload preset name** — required for achievement-photo submission (`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`), not yet set
- `siteConfig` singleton not yet populated in Sanity (`address`, `email`, `phone`, `emergencyPhone`, `emergencyPhone2` all fall back to `[PENDING_CONTENT]` in `lib/sanity/queries.ts`) — feeds footer and all 3 confirmation email templates
- GSC WhatsApp business number — not yet available per `GSC.md`

---

## 7. Pre-Launch Checklist (external/ops — cannot be verified from this session)

- [ ] All env vars set in Vercel production (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_TOKEN`, `SANITY_WEBHOOK_SECRET`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, `NEXT_PUBLIC_SITE_URL`)
- [ ] Custom domain `gsc.in` pointed to Vercel
- [ ] SSL verified (automatic via Vercel once domain is attached)
- [ ] Sanity Studio access credentials shared with GSC staff
- [ ] Resend domain (`gsc.in`) verified in Resend dashboard
- [ ] Test all 5 form submissions in production (booking, membership, contact, partner, achievement) — not localhost
- [ ] Hero video (`gsc-hero.mp4`) uploaded and confirmed playing in production
- [ ] All 6 Lottie files confirmed loading in production, no console errors
- [ ] DPDP Act compliance — legal review of `/legal` and `/legal/cancellation` before launch
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Confirm the Sanity webhook target URL is the production domain, not a Vercel preview URL

---

## 8. Phase Tracker

Task 3-05 code-level work (build verification, bundle-size audit, missing-redirect fix, Lottie/video/GSAP code review, PENDING_CONTENT audit) is complete. Section 5 (Lighthouse, live browser testing, live ISR round-trip, live redirect check, mobile device QA) and Section 7 (ops/credentials/hero video asset) require a deployed environment, real devices, and the final video file — hold `/done` until those are run, or explicitly accept this report as sufficient to close the phase.
