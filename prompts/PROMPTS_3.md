# GSC — Phase 3 Prompts
# Ready-to-paste prompts for Claude Code. One prompt per task.
# All Phase 1 and Phase 2 tasks must be complete before starting Phase 3.
# Stack: Video hero + Lottie sport animations + GSAP scroll. No WebGL.
# Read docs/3D.md in full before starting 3-01.

---

## 3-01 — Smooth Scroll + Video Hero

```
/build

Task 3-01 — Smooth Scroll Provider + Video Hero.

Read docs/3D.md in full before writing any code.

TWO deliverables this task:

--- PART A: Smooth Scroll Provider ---

1. Create components/layout/SmoothScrollProvider.tsx
   Full code in docs/3D.md § Lenis + GSAP Integration.
   - 'use client'
   - Lenis init, duration 1.2, custom easing
   - lenis.on('scroll', ScrollTrigger.update)
   - gsap.ticker.add for RAF loop
   - gsap.ticker.lagSmoothing(0)
   - cleanup on unmount

2. Wrap children in app/(site)/layout.tsx with SmoothScrollProvider
   Place outside ThemeProvider (SmoothScrollProvider → ThemeProvider → children)

--- PART B: Video Hero ---

3. Update Sanity siteConfig schema to add:
   defineField({ name: 'heroVideoUrl', title: 'Hero Video URL', type: 'url',
   description: 'Cloudinary or hosted URL for the homepage hero background video' })

4. Update lib/sanity/queries.ts getSiteConfig() to include heroVideoUrl in projection.

5. Create public/videos/ directory. Add a README.md inside:
   "Place gsc-hero.mp4 here. Target size < 8MB. See docs/3D.md § Video Hero for ffmpeg compress command."

6. Update components/sections/home/HeroSection.tsx
   Full spec in docs/3D.md § Video Hero. Key requirements:
   - <video autoPlay muted loop playsInline poster="/images/hero-poster.jpg">
   - <source src={siteConfig.heroVideoUrl ?? '/videos/gsc-hero.mp4'} type="video/mp4" />
   - Dark gradient overlay: from-[--color-bg-dark]/60 via-[--color-bg-dark]/50 to-[--color-bg-dark]/80
   - Content z-10 above video: "Since 1994" label → headline → subline → CTA buttons
   - GSAP fade-in stagger on mount for all text elements (badge → h1 → p → buttons)
   - Scroll indicator: ChevronDown icon, animate-bounce, absolute bottom-8
   - data-theme="dark" on the section — always dark regardless of global theme
   - props: accept siteConfig (already fetched in layout and passed down)

7. Create public/images/hero-poster.jpg placeholder
   Add code comment: // [PENDING_CONTENT] — Export first frame of GSC hero video as JPG, replace this file

GSAP mount animation pattern:
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tl = gsap.timeline()
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.5 })
      .from('.hero-headline', { y: 30, opacity: 0, duration: 0.6 }, '-=0.2')
      .from('.hero-subline', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.hero-ctas', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
  }, [])
```

---

## 3-02 — Lottie Setup + Sport Animations

```
/build

Task 3-02 — Lottie Setup + Sport Hero Animations.

Read docs/3D.md § Lottie Sport Animations in full.

1. Create components/shared/LottiePlayer.tsx
   Full code in docs/3D.md § Implementation.
   Props: src (object), className?, loop? (default true), autoplay? (default true), speed? (default 1)
   Uses lottie-react package — already installed.

2. Create public/lottie/ directory. Add a README.md inside:
   "Place 6 Lottie JSON files here: cricket.json, swimming.json, badminton.json,
   tennis.json, squash.json, gym.json.
   Source from lottiefiles.com — search sport name + 'minimal' or 'loop'.
   Target style: dark-background compatible, minimal/geometric, not cartoonish.
   See docs/3D.md § Sourcing Lottie Files."

3. Create components/sections/sports/LottieScenePlayer.tsx
   'use client' — dynamic import per sport to avoid loading all 6 JSON files on every page.

   interface LottieScenePlayerProps {
     sport: 'cricket' | 'swimming' | 'badminton' | 'tennis' | 'squash' | 'gym'
     className?: string
   }

   Dynamic import pattern:
   const animations: Record<string, () => Promise<{ default: object }>> = {
     cricket: () => import('@/public/lottie/cricket.json'),
     swimming: () => import('@/public/lottie/swimming.json'),
     badminton: () => import('@/public/lottie/badminton.json'),
     tennis: () => import('@/public/lottie/tennis.json'),
     squash: () => import('@/public/lottie/squash.json'),
     gym: () => import('@/public/lottie/gym.json'),
   }

   On mount: load the correct JSON for the sport prop, pass to LottiePlayer.
   Loading state: subtle opacity-0 fade-in when loaded (avoid layout shift).
   If JSON file missing (during development): render a sport icon from lucide-react as placeholder.

4. Update app/(site)/sports/[slug]/page.tsx — hero section sport animation:
   Replace the old [PENDING_3D_OBJECT] div with:

   Lottie map (from sport.threeObjectType Sanity field):
   const lottieMap: Record<string, string> = {
     'cricket-ball': 'cricket',
     'shuttlecock': 'badminton',
     'tennis-ball': 'tennis',
     'water-sphere': 'swimming',
   }
   const lottieSport = lottieMap[sport.threeObjectType]

   In hero JSX — right column, desktop only:
   {lottieSport && (
     <div className="hidden md:flex items-center justify-center w-64 h-64 lg:w-80 lg:h-80">
       <LottieScenePlayer sport={lottieSport as any} />
     </div>
   )}

   Layout: hero grid becomes 2-col on md+ when Lottie is present (text left, Lottie right).
   On mobile: Lottie hidden, text is full-width centered.

5. Verify: no TypeScript errors on JSON imports. If TS complains about JSON imports,
   add to tsconfig.json: "resolveJsonModule": true
```

---

## 3-03 — Sports Scroll Experience

```
/build

Task 3-03 — Sports Scroll GSAP Experience.

Read docs/3D.md § Sports Scroll in full.

Build: components/sections/sports/SportsScroll.tsx

Full implementation in docs/3D.md. Key requirements:

Props:
  interface SportsScrollProps {
    sports: SportQuery[]  // from getSports() Sanity query
  }

Architecture:
- Horizontal scroll: 6 panels side by side, GSAP scrolls them left on vertical scroll
- ScrollTrigger: pin the container, scrub: 1, snap to each panel
- Progress dots: fixed right side, update active dot via onUpdate callback
- Each panel: full viewport width + height (min-w-full h-screen)

Per-panel content (6 panels):
  Panel 1: Cricket — accent #FFB300 — sport stat: "3 formats"
  Panel 2: Swimming — accent #1E88E5 — "Olympic pool"
  Panel 3: Badminton — accent #F9FAFB — "12 courts"
  Panel 4: Lawn Tennis — accent #E8A020 — "4 courts"
  Panel 5: Squash — accent #9333EA — "4 courts"
  Panel 6: Health Club — accent #E53935 — "3 centres"

Per-panel layout (2-col on lg+, 1-col on mobile):
  Left: panel number (01/06), sport name (Display L, Barlow, uppercase), stat, CTA button → /sports/[slug]
  Right (lg+ only): LottieScenePlayer for the sport

Background per panel:
  - Use sport.heroImage from Sanity (matched by name to SPORT_SCENES array)
  - urlFor(sport.heroImage).width(1920).url() as background image
  - Dark overlay: bg-[--color-bg-dark]/70
  - If no Sanity image: solid dark background with accent color subtle gradient

Text animation per panel:
  - Panel number fades in from y:20 as panel enters center
  - Sport name: y:40 → 0, slight stagger after number
  - Animate using ScrollTrigger containerAnimation (nested trigger inside the pinned scroll)

Integrate in app/(site)/sports/page.tsx:
  Replace the existing CSS placeholder from Task 1B-06 with this component.
  Pass sports data (already fetched on the page).

Mobile (< lg breakpoint):
  On mobile, horizontal scroll is replaced by vertical stacked sections.
  Detect via CSS: use a @media query or useMediaQuery hook.
  On mobile: render a simple stacked version — 6 full-height sections, each with GSAP
  scroll-triggered fade-in. No pinning. LottiePlayer hidden.
  Simple check: if (window.innerWidth < 1024) render <SportsScrollMobile sports={sports} />
  Build SportsScrollMobile as a simple stacked version in the same file.
```

---

## 3-04 — GSAP Polish Pass

```
/build

Task 3-04 — GSAP Polish Pass.

Read docs/DESIGN_RULES.md § Animation before starting.

Apply polish across all pages. Prefers-reduced-motion check on every animation.

1. Page transitions
   Create components/layout/PageTransition.tsx ('use client')
   usePathname() to detect route changes.
   On pathname change: gsap.fromTo('main', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
   Wrap <main> in app/(site)/layout.tsx with PageTransition.

2. Scroll reveals — audit all pages, apply where missing
   All section headings (h2, Display S): AnimatedText already used — verify it's everywhere
   Section sublines (p below h2): AnimatedText with delay: 0.1
   Lead paragraphs: AnimatedText

   Priority pages to audit and fix:
   /, /about, /sports, /membership, /partners, /achievements

3. Card stagger — apply to every card grid
   Pattern: gsap.from(cards, { y: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
     scrollTrigger: { trigger: gridContainer, start: 'top 85%', once: true } })

   Components to update:
   - SportsGrid.tsx (home)
   - FacilitiesShowcase.tsx (home)
   - EventsGrid (/events)
   - AchievementGrid (/achievements)
   - CommitteeGrid (/about/team)
   - SportCategoryGrid (/sports)
   - BanquetHallCards (/facilities/banquets)
   - DiningVenueCards (/facilities/dining)

4. Stat counters — verify all work on scroll-enter (not page load)
   Pages: /, /about, /facilities hub, /partners
   StatCounter must fire only when element enters viewport.

5. Navbar transitions
   Background change (transparent → solid): add transition-colors duration-300
   Active route underline: width animates 0% → 100% on mount, ease power2.out
   Mobile menu open/close: slide from right, duration 0.3

6. Hero scroll-out
   On all PageHero sections: content fades + moves up slightly as user scrolls past
   gsap.to(heroContent, { y: -30, opacity: 0, ease: 'none',
     scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: true } })

7. Footer scroll-in
   gsap.from(footer, { y: 40, opacity: 0, duration: 0.6, ease: 'power2.out',
     scrollTrigger: { trigger: footer, start: 'top 95%', once: true } })

8. Hover states — verify consistent across all cards
   CSS: transition-all duration-200 translate-y-[-2px]
   Find any card that's missing this and add it.

Run /review on HeroSection, SportsScroll, and CommitteeGrid after this pass.
```

---

## 3-05 — Performance Audit + Launch

```
/build

Task 3-05 — Performance Audit + Launch Checklist.

Final task. Read docs/3D.md § Performance Notes.

1. Run full build:
   pnpm build
   Must pass with 0 errors, 0 TypeScript errors, 0 Biome violations.
   Check bundle sizes in .next/analyze (add ANALYZE=true to build if needed).
   Flag any route with First Load JS > 300KB.

2. Video hero verification:
   - Confirm gsc-hero.mp4 is in public/videos/ and < 8MB
   - Confirm hero-poster.jpg is in public/images/ (first frame of video)
   - Test autoplay on Chrome, Safari (iOS), Chrome Android
   - Verify video loads and plays without user interaction (muted + playsInline)
   - Verify poster shows instantly before video loads

3. Lottie verification:
   - Confirm all 6 JSON files exist in public/lottie/
   - Verify no console errors on /sports/[slug] pages with Lottie
   - Verify Lottie hidden on mobile (below lg breakpoint)
   - Check file sizes — each should be < 200KB. If larger, find a simpler animation.

4. GSAP verification:
   - Sports scroll: pins correctly, snaps to each panel, progress dots update
   - All scroll reveals fire correctly on scroll-enter
   - Page transitions: fade-in on every route change
   - Prefers-reduced-motion: animations skipped when set (test in browser accessibility settings)

5. Lighthouse audit (on Vercel production URL):
   Target: Performance > 85 mobile, > 90 desktop.
   Common fixes if failing:
   - LCP (hero image/video): add fetchPriority="high" to poster image
   - CLS: ensure video container has explicit height set before video loads (min-h-screen covers this)
   - Images: all next/image with sizes prop

6. ISR validation:
   Update any Sanity document. Verify revalidation webhook fires.
   Check Vercel function logs for /api/revalidate — should show 200.
   Verify page reflects update within 10 seconds.

7. Redirect verification:
   Test every URL in GSC.md § 301 Redirect Map.
   Each must 301 to the correct destination.

8. Mobile review at 375px:
   - Video hero: plays, text is readable, CTAs are tappable
   - Sports scroll mobile version: stacked sections, smooth GSAP, no horizontal overflow
   - All forms usable with virtual keyboard open
   - Navbar mobile menu opens and closes cleanly
   - No horizontal scroll on any page

9. PENDING_CONTENT audit:
   Search: grep -r "PENDING_CONTENT" app/ components/
   Compile list for client handoff:
   - Hero video URL in Sanity siteConfig (if not yet set)
   - Hero poster image (first frame of video)
   - Lottie JSON files (6 files in public/lottie/)
   - Emergency contacts (footer, medical-cell page)
   - Room types and capacities
   - Banquet hall capacities
   - Doctor schedule
   - Google Maps embed URL

10. Pre-launch checklist:
    [ ] All env vars set in Vercel production
    [ ] gsc.in domain pointed to Vercel
    [ ] SSL active
    [ ] Sanity Studio credentials shared with GSC staff
    [ ] Resend domain gsc.in verified
    [ ] All 5 form types tested in production
    [ ] Hero video confirmed playing in production
    [ ] All 6 Lottie files confirmed loading in production
    [ ] DPDP Act compliance: flag /legal pages for legal review
    [ ] Google Search Console: submit sitemap
    [ ] Sanity webhook: pointing to production URL (not preview URL)

Report: compile client handoff document with all pending items, production credentials checklist, and post-launch monitoring notes.
```

---
