# GSC — Phase 3 Prompts
# Ready-to-paste prompts for Claude Code. One prompt per task.
# All Phase 1 and Phase 2 tasks must be complete before starting Phase 3.
# Build in strict order — each task depends on the previous.
# Read docs/3D.md in full before starting 3-01.

---

## 3-01 — R3F Setup

```
/build

Task 3-01 — R3F Setup.

Build the WebGL infrastructure. Read docs/3D.md in full before writing any code.

1. components/three/WebGLDetector.tsx
   Two exports:
   - useWebGL(): boolean hook — detects WebGLRenderingContext + blocks mobile via user agent
   - WebGLOnly({ children, fallback }) — wrapper component that renders children or fallback
   Full detection code in docs/3D.md § WebGL Detection.

2. components/three/SceneCanvas.tsx
   Wraps R3F <Canvas> with:
   - <Suspense fallback={null}>
   - ErrorBoundary (create inline or import from react-error-boundary)
   - Props: children, className?, camera?, dpr? (default [1,2])
   - gl={{ antialias: true, alpha: true }}
   - style={{ position: 'absolute', inset: 0 }}
   Full code in docs/3D.md § Scene Canvas.

3. Add smooth scroll provider to app/(site)/layout.tsx:
   Create components/layout/SmoothScrollProvider.tsx
   - 'use client'
   - Lenis init with duration 1.2, custom easing
   - Sync with GSAP: lenis.on('scroll', ScrollTrigger.update)
   - gsap.ticker.add for RAF loop
   - gsap.ticker.lagSmoothing(0)
   Full code in docs/3D.md § Lenis + GSAP Integration.
   Wrap children in (site)/layout.tsx with SmoothScrollProvider.

4. Add to app/globals.css:
   .webgl-disabled — class applied to <html> when WebGL unavailable
   This class can be used for CSS-only fallback targeting.

5. Verify: no SSR errors from R3F imports. Dynamic imports with ssr:false pattern ready to use.

After this task, all subsequent 3D tasks can use SceneCanvas, WebGLOnly, and the smooth scroll system.
```

---

## 3-02 — Homepage Hero Fallback

```
/build

Task 3-02 — Homepage Hero CSS Fallback.

Build the GSAP CSS particle animation for the homepage hero.
This is the mobile version AND the desktop placeholder until 3-03 adds WebGL.

Build: components/sections/home/HeroFallback.tsx

Requirements:
- Pure CSS + GSAP — no WebGL, no canvas
- 40–60 small particle elements (divs or spans), positioned absolutely within the hero
- Colors: mix of #1E88E5 (primary blue) and #FFB300 (gold) — roughly 80/20 ratio
- Sizes: 2px–8px diameter circles (border-radius: 50%)
- Initial state: random positions spread across the hero viewport
- Animation: continuous slow float with GSAP
  - Each particle: random Y drift (-20px to +20px over 3–8s)
  - Slight X drift (-10px to +10px)
  - Random opacity pulse (0.3 to 0.8)
  - All staggered with different durations and delays so it feels organic
  - yoyo: true, repeat: -1
- On hero scroll out: GSAP ScrollTrigger → opacity fades to 0 as section scrolls up

Integration:
- Replace the placeholder div in HeroSection.tsx with this component
- Wrap in <div className="absolute inset-0 overflow-hidden pointer-events-none">
- Wrap entire component in prefers-reduced-motion check — if reduced, show static particles with no animation

This component stays permanently on mobile. On desktop, it will be replaced by WebGLOnly in 3-03.
```

---

## 3-03 — Homepage Hero WebGL

```
/build

Task 3-03 — Homepage Hero WebGL Scene.

Build the full R3F particle hero scene. Read docs/3D.md § Homepage Hero Scene in full.
Desktop only. HeroFallback from 3-02 is the mobile version.

Build: components/three/HeroScene.tsx

Spec:
- 2000 particles using InstancedMesh (single draw call — never individual meshes)
- Particle colors: #1E88E5 primary (~80%), #FFB300 gold (~20%) — use InstancedMesh with per-instance color
- Initial state: swirl pattern with cursor displacement
  - useFrame: update particle positions each frame based on time + cursor offset
  - Cursor: track mouse position via onPointerMove on Canvas parent, pass to scene via ref or state
- Load animation (on mount):
  - Start: particles dispersed randomly across a large sphere radius (~10 units)
  - Over 2 seconds: lerp all particles toward their logo-formation positions
  - Logo formation: approximate "GSC" letterform using ~600 particles, rest fill background halo
  - ease: power2.out for the convergence
- Scroll out: useScroll from @react-three/drei
  - As scroll progress increases: particles scatter outward + opacity fades to 0
  - At scroll > 0.3: scene fully faded

Integration in HeroSection.tsx:
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <HeroFallback />,
})

Replace the current HeroFallback div with:
<WebGLOnly
  fallback={<HeroFallback />}
>
  <div className="absolute inset-0">
    <SceneCanvas camera={{ fov: 75, position: [0, 0, 5] }}>
      <HeroScene />
    </SceneCanvas>
  </div>
</WebGLOnly>

Performance: check with Chrome DevTools — must be < 100ms load, smooth 60fps.
```

---

## 3-04 — Sports Scroll Fallback

```
/build

Task 3-04 — Sports Scroll GSAP CSS Fallback.

Upgrade the sports scroll experience with a proper GSAP CSS version.
This replaces the basic scroll built in 1B-06 with a polished non-WebGL version.
This is permanent on mobile and the desktop fallback until 3-05 through 3-08 add WebGL.

Build: components/sections/sports/SportsScrollFallback.tsx

Requirements:
- 6 full-viewport sections, stacked vertically
- Each section: large category name (Display L, Barlow, uppercase) + sport count + background image placeholder (solid color per sport theme)
- Sport color theming:
  Cricket: #FFB300 (gold) accent on dark surface
  Swimming: #1E88E5 (blue) accent
  Badminton: white/fluorescent (#F9FAFB) accent on dark
  Tennis: #E8A020 (clay/orange) accent
  Squash: #9333EA (purple) accent
  Gym: #E53935 (red) accent
- GSAP ScrollTrigger on each section:
  - Pin the section as it enters viewport (scrub: true)
  - Category name: y: 40 → 0, opacity: 0 → 1 on enter
  - Sport count: fade in with 200ms delay
  - Background: subtle scale 1.05 → 1.0 (parallax feel)
- Progress indicator: fixed right-side dot nav (1–6), highlights active section
- Section text: "X Sports" counter with category name

Integration in app/(site)/sports/page.tsx:
Replace the current placeholder with:
<WebGLOnly
  fallback={<SportsScrollFallback />}
>
  <SportsScrollFallback />  {/* Will be replaced in 3-05 */}
</WebGLOnly>
(WebGL scenes added in 3-05 through 3-08)
```

---

## 3-05 — Sports Scroll Scene 1 (Cricket)

```
/build

Task 3-05 — Sports Scroll WebGL Scene 1 — Cricket.

Build the first WebGL scene in the sports scroll experience.
Read docs/3D.md § Sports Scroll Experience and § Scene 1 — Cricket in full.

Build: components/three/SportsScroll.tsx (initial file — will be extended in 3-06 through 3-08)

Architecture:
- Single <Canvas> that contains all 6 scene groups
- GSAP ScrollTrigger pins the entire sports section container
- Total pin length: 600vh (6 × 100vh equivalent of scroll depth)
- Each scene group: Three.js Group, only one visible (opacity 1) at a time
- Scene transitions: GSAP timeline drives opacity 0↔1 on scroll progress milestones

Scene 1 — Cricket (build now):
Camera: position [0, -1, 4], lookAt [0, 0, 0] — low angle upward tilt
Lighting:
  - Key: PointLight color #FFB300 (gold), intensity 2, position [3, 3, 3]
  - Fill: DirectionalLight color #1E88E5, intensity 0.5, position [-3, 1, 2]
  - Ambient: AmbientLight color #111827, intensity 0.3
Scene elements:
  - Ground plane: PlaneGeometry(10, 10), rotateX(-π/2), MeshStandardMaterial color #8B6914 (pitch tan)
  - 3 stumps: CylinderGeometry(0.02, 0.02, 0.6, 8), white, positioned at [-.1, 0.3, 0], [0, 0.3, 0], [.1, 0.3, 0]
  - Dust particles: 200 small spheres, InstancedMesh, #C4A35A color, slow upward drift in useFrame
  - Scene label (HTML overlay): "Cricket" in Barlow Condensed

Progress dots UI (HTML, outside Canvas):
  Fixed right side, 6 dots, active dot = primary blue filled, inactive = border only
  Clicking a dot scrolls to that scene position

Integration in sports/page.tsx — wrap with WebGLOnly:
const SportsScroll = dynamic(() => import('@/components/three/SportsScroll'), { ssr: false, loading: () => <SportsScrollFallback /> })

<WebGLOnly fallback={<SportsScrollFallback />}>
  <SportsScroll />
</WebGLOnly>
```

---

## 3-06 — Sports Scroll Scenes 2 + 3

```
/build

Task 3-06 — Sports Scroll Scenes 2 (Swimming) + 3 (Badminton).

Extend components/three/SportsScroll.tsx with two more scenes.
Read docs/3D.md § Scene 2 — Swimming and § Scene 3 — Badminton in full.

Scene 2 — Swimming:
Camera: position [0, 3, 2], lookAt [0, 0, 0] — top-down looking at pool surface
Lighting:
  - Ambient: AmbientLight color #1E88E5, intensity 1.5 (pool blue fills everything)
  - Point: PointLight color #FFFFFF, intensity 1, position [0, 5, 0]
Scene elements:
  - Pool surface: PlaneGeometry(8, 14), rotateX(-π/2), MeshPhysicalMaterial with:
    color #0288D1, roughness 0.1, metalness 0, transmission 0.3 (semi-transparent water)
  - Lane lines: 5 thin BoxGeometry(0.05, 0.01, 14) in white, spaced evenly across pool
  - Caustic shader approximation: animated UV-offset texture or ShaderMaterial with sine-wave distortion
    (keep simple — animated opacity on a grid pattern is acceptable if shader is complex)
  - Ripple particles: 30 flat circles on surface, animate scale pulse

Scene 3 — Badminton:
Camera: position [0, 1.5, 6], lookAt [0, 1, 0] — court-level center view
Lighting:
  - Overhead fluorescent: 4 RectAreaLight or SpotLight (white, hard shadows), grid pattern above court
  - Ambient: AmbientLight #F9FAFB, intensity 0.4
Scene elements:
  - Court plane: PlaneGeometry(6.1, 13.4), rotateX(-π/2), MeshStandardMaterial color #3D7A2E (green court)
  - Court lines: BoxGeometry strips in white (boundary, service lines, net line)
  - Net: BoxGeometry(0.02, 0.75, 6.1) at center, white
  - Shuttlecock: custom — cork base CylinderGeometry(0.1, 0.15, 0.2) + 8 feather PlaneGeometry fanned above it
  - Shuttlecock animation: follows pre-computed parabolic arc path using CatmullRomCurve3, leave trail using Line geometry that reveals as shuttlecock moves

Transition logic for all 3 scenes so far:
GSAP ScrollTrigger timeline:
  0–16%: scene 1 visible
  16–33%: fade scene 1 out, fade scene 2 in
  33–50%: scene 2 visible
  50–66%: fade scene 2 out, fade scene 3 in
  ... (will continue in 3-07, 3-08)
```

---

## 3-07 — Sports Scroll Scenes 4 + 5

```
/build

Task 3-07 — Sports Scroll Scenes 4 (Tennis) + 5 (Squash).

Extend components/three/SportsScroll.tsx with two more scenes.
Read docs/3D.md § Scene 4 — Tennis and § Scene 5 — Squash in full.

Scene 4 — Tennis:
Camera: position [0, 2, 8], lookAt [0, 0, 0] — side angle, clay court visible
Lighting:
  - DirectionalLight color #FFF3E0 (warm outdoor), intensity 1.5, position [5, 10, 5]
  - AmbientLight color #FFECB3, intensity 0.5 (warm ambient)
Scene elements:
  - Court: PlaneGeometry(10.97, 23.77), rotateX(-π/2), MeshStandardMaterial color #C4622D (clay red-orange)
  - Court lines: white BoxGeometry strips (baseline, sidelines, service box, net line)
  - Net: white BoxGeometry(0.02, 0.91, 10.97) at center
  - Tennis ball: SphereGeometry(0.13, 16, 16), MeshStandardMaterial color #CFE03B (yellow-green)
  - Ball animation: bounce path using CatmullRomCurve3 — approach net, cross, bounce, return loop
  - Ball squash/stretch: scale Y compresses on bounce contact frame, stretches in flight (y: 0.7 on contact, 1.2 in air)
  - Bounce trail: Line geometry of last 20 positions, opacity fades toward tail

Scene 5 — Squash:
Camera: position [0, 1.5, 3], lookAt [0, 1, 0] — inside enclosed court, corner angle
Lighting:
  - Overhead: 2 RectAreaLight or SpotLight (white, hard), above court
  - Bounce fill: subtle blue/white fill from walls
Scene elements:
  - 4 walls: PlaneGeometry, light grey (#E8E8E0), front wall (service wall), back wall, 2 side walls
  - Court floor: PlaneGeometry, darker grey (#C8C8C0)
  - Court lines on front wall: white BoxGeometry strips (service line, tin line)
  - Ball: SphereGeometry(0.08), MeshStandardMaterial color #18181B (dark squash ball)
  - Ball animation: random rebound pattern — compute vector reflections off walls
    ball travels in straight lines, bounces on wall contact (reflect direction vector)
  - Impact burst: on each wall contact, spawn 6 small particle spheres in radial burst, fade out over 0.3s
    use InstancedMesh for burst particles

Update transition timeline to cover all 5 scenes.
```

---

## 3-08 — Sports Scroll Scene 6 + Orchestration

```
/build

Task 3-08 — Sports Scroll Scene 6 (Gym) + Full Scroll Orchestration.

Build the final scene and wire up the complete 6-scene experience.
Read docs/3D.md § Scene 6 — Gym and § Sports Scroll Experience in full.

Scene 6 — Gym:
Camera: position [0, 0.5, 4], lookAt [0, 1, 0] — low dramatic angle
Lighting:
  - SpotLight color #E53935 (red), intensity 3, position [0, 6, 0], angle 0.4 — main dramatic spot
  - AmbientLight color #0A0E1A, intensity 0.1 — near-dark ambient
  - Optional: subtle blue RectAreaLight from one side for depth
Scene elements:
  - Floor: PlaneGeometry(8, 6), rotateX(-π/2), dark MeshStandardMaterial color #111111
  - 3 weight sets: each = barbell (CylinderGeometry) + 2 plates (TorusGeometry or CylinderGeometry)
    Positioned at [-2, 0, 0], [0, 0, 0], [2, 0, 0]
    Material: MeshStandardMaterial, metalness 0.8, roughness 0.3, color #2A2A2A
  - Lift animation: weights group Y oscillates 0 → 0.6 → 0 on 2.5s loop, ease power1.inOut
  - Energy particles: InstancedMesh, 150 small spheres, #E53935 color, 20% opacity
    Burst upward from barbell center on lift peak — surge then fade
    useFrame: update particle positions + opacities based on lift cycle

Full Orchestration:
- Complete GSAP ScrollTrigger timeline covering all 6 scenes:
  0–16.6%: Scene 1 (Cricket)
  16.6%: begin crossfade → Scene 2
  33.3%: Scene 2 (Swimming) fully visible
  33.3%: begin crossfade → Scene 3
  50%: Scene 3 (Badminton) fully visible
  50%: begin crossfade → Scene 4
  66.6%: Scene 4 (Tennis) fully visible
  66.6%: begin crossfade → Scene 5
  83.3%: Scene 5 (Squash) fully visible
  83.3%: begin crossfade → Scene 6
  100%: Scene 6 (Gym) fully visible
  After 100% scroll: unpin, continue down page

Progress dots: update active dot on each scene change
Camera: optionally add subtle per-scene camera transition (lerp to scene camera position on crossfade)

Test: scroll through all 6 scenes on desktop at 60fps. No frame drops. Confirm mobile shows SportsScrollFallback.
```

---

## 3-09 — Sport Hero Objects

```
/build

Task 3-09 — Sport Hero 3D Objects.

Build 4 contained 3D objects for /sports/[slug] hero sections.
Read docs/3D.md § Sport Hero Objects in full.

Build all 4 components:

1. components/three/objects/CricketBall.tsx
   Geometry: SphereGeometry(1, 32, 32)
   Material: MeshStandardMaterial, color #8B1010 (red leather)
   Seam: TubeGeometry following a figure-8 CatmullRomCurve3 on the sphere surface, white color
   Animation: useFrame — slow Y rotation (0.003 rad/frame), occasional X wobble (sin wave)
   Lighting: warm PointLight #FFB300 + cool fill

2. components/three/objects/Shuttlecock.tsx
   Cork base: CylinderGeometry(0.15, 0.2, 0.25, 16)
   Material: MeshStandardMaterial, color #F5F0E8 (cream)
   Feathers: 16 PlaneGeometry(0.1, 0.5) instances fanned in a circle above cork
   Material: MeshStandardMaterial, color #FAFAFA, side DoubleSide, transparent 0.85
   Animation: sine-wave float (Y: ±0.1 over 2s), slow Y spin (0.005 rad/frame)

3. components/three/objects/TennisBall.tsx
   Geometry: SphereGeometry(1, 32, 32)
   Material: MeshStandardMaterial, color #CFE03B (yellow-green), roughness 0.8 (felt-like)
   Seam: TubeGeometry, white, figure-8 curve same as cricket ball pattern
   Animation: slow spin + subtle bounce at bottom of float cycle (Y: sin with slight asymmetry)

4. components/three/objects/WaterSphere.tsx
   Geometry: SphereGeometry(1, 64, 64)
   Material: MeshPhysicalMaterial — transmission 0.9, roughness 0, metalness 0, ior 1.33 (water)
   Animation: slow Y rotation (0.002), vertex displacement in useFrame for gentle wave effect
   Lighting: AmbientLight #1E88E5 + white key

Common behavior for all 4:
- Scroll fade: useScroll from drei — opacity decreases as hero section scrolls out
- Dispose: useEffect cleanup disposes geometry and material on unmount

Integration in app/(site)/sports/[slug]/page.tsx:
Replace [PENDING_3D_OBJECT] div with:

const objectComponents = {
  'cricket-ball': dynamic(() => import('@/components/three/objects/CricketBall'), { ssr: false }),
  'shuttlecock': dynamic(() => import('@/components/three/objects/Shuttlecock'), { ssr: false }),
  'tennis-ball': dynamic(() => import('@/components/three/objects/TennisBall'), { ssr: false }),
  'water-sphere': dynamic(() => import('@/components/three/objects/WaterSphere'), { ssr: false }),
}

<WebGLOnly fallback={null}>
  <div className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 hidden md:block">
    <SceneCanvas camera={{ fov: 50, position: [0, 0, 3] }}>
      {sport.threeObjectType && objectComponents[sport.threeObjectType] ? (
        React.createElement(objectComponents[sport.threeObjectType])
      ) : null}
    </SceneCanvas>
  </div>
</WebGLOnly>
```

---

## 3-10 — GSAP Polish Pass

```
/build

Task 3-10 — GSAP Polish Pass.

Apply scroll reveals, page transitions, and micro-interactions across all pages.
Read docs/DESIGN_RULES.md § Animation in full before starting.

1. Page transitions — add to (site)/layout.tsx or a TransitionProvider:
   On route change: opacity 0 → 1, duration 0.4s, ease power2.out
   Use usePathname() to detect route changes, trigger GSAP on change

2. Scroll reveals — audit every page and apply AnimatedText where missing:
   - All section headings (Display S) — should already use AnimatedText from 1B tasks
   - All sublines under headings — apply AnimatedText with delay 0.1
   - All section intro paragraphs — AnimatedText
   Priority pages to audit: /, /about, /sports, /membership, /partners

3. Card stagger animations — apply to all grid sections:
   Components to update: SportsGrid, FacilitiesShowcase (home), EventsGrid, AchievementGrid, CommitteeGrid
   Pattern: gsap.from(cards, { y: 20, opacity: 0, duration: 0.5, stagger: 0.08, scrollTrigger: { trigger, start: 'top 85%', once: true } })

4. Stat counters — verify StatCounter works on all pages that use it:
   Homepage StatsBar, About page stats — confirm counter fires on scroll-enter, not on page load

5. Navbar polish:
   - Smooth transition on background change (transparent → solid): add transition-all duration-300
   - Active route underline: animate width 0 → 100% on mount using GSAP from: width: '0%' to: width: '100%'

6. Hover micro-interactions:
   - All cards: CSS transition-all duration-200 translate-y-[-2px] — verify this is consistent
   - All primary buttons: subtle scale(1.02) on hover via CSS transition
   - Nav links: underline expands from left on hover (CSS transform scaleX)

7. Footer scroll-in: fade + slide up when footer enters viewport

All animations: wrapped in prefers-reduced-motion check (if matchMedia.matches, skip GSAP, use CSS only).
Run /review on HeroSection, SportsScrollFallback, and CommitteeGrid after this pass.
```

---

## 3-11 — Performance Audit + Launch

```
/build

Task 3-11 — Performance Audit + Launch Checklist.

Final task. Verify the site is production-ready.
Read docs/3D.md § Performance Checklist.

1. Run full build: pnpm build
   - Must pass with 0 errors
   - Check bundle output — flag any route over 500KB (first load JS)
   - Identify heavy routes and add dynamic imports if needed

2. Lighthouse audit (run in Chrome DevTools on production Vercel URL):
   Target: Performance > 85 mobile, > 90 desktop
   If failing:
   - Images: ensure all next/image components have correct sizes prop
   - Fonts: verify next/font/google is used (not manual @import)
   - LCP: hero image must have priority={true}
   - CLS: all images have explicit width/height or fill + aspect ratio container

3. WebGL performance check:
   - Open /sports in Chrome with DevTools Performance tab
   - Record scroll through all 6 scenes
   - Verify: no frame drops below 55fps, no memory growth per scene change
   - Verify: switching to mobile device mode → SportsScrollFallback renders, no Canvas

4. ISR validation:
   - Update a sport document in Sanity Studio (e.g. change a description)
   - Verify webhook fires: check Sanity webhook logs in dashboard
   - Verify: /sports/[slug] page reflects the update within 5 seconds
   - If not working: check /api/revalidate logs in Vercel

5. Redirect verification:
   Open each old URL from the redirect map (docs/GSC.md § 301 Redirect Map):
   /the-club, /achivement, /Turf, /Massage-Center, /in-house-marketing, /Team-Spirit
   Each must return 301 → correct new URL

6. Mobile review:
   - Test all pages at 375px (iPhone SE viewport)
   - No horizontal scroll anywhere
   - All forms usable with virtual keyboard
   - No WebGL rendering on mobile (verify with user agent)

7. PENDING_CONTENT audit:
   Search codebase for [PENDING_CONTENT] and [PENDING_3D_OBJECT] comments
   List all instances — compile client handoff checklist:
   - Emergency phone numbers (footer, medical-cell page)
   - Room types and capacities (facilities/rooms)
   - Banquet hall capacities (facilities/banquets/[hall])
   - Doctor schedule (facilities/medical-cell)
   - Google Maps embed URL (contact page)
   - Cloudinary unsigned upload preset name

8. Pre-launch checklist:
   [ ] All env vars set in Vercel production
   [ ] Custom domain gsc.in pointed to Vercel (A record or CNAME)
   [ ] SSL verified (Vercel handles automatically)
   [ ] Sanity Studio access credentials shared with GSC staff
   [ ] Resend domain (gsc.in) verified in Resend dashboard
   [ ] Test all 5 form submissions in production (not localhost)
   [ ] DPDP Act compliance: flag /legal pages for legal review before launch
   [ ] Google Search Console: submit sitemap.xml
   [ ] Sanity webhook: confirm it points to production URL (not Vercel preview)

Report: compile the complete client handoff document listing all pending items, credentials to share, and post-launch monitoring notes.
```

---
