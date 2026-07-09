# GSC — Component Specifications
# Props, variants, and behavior for every shared component.
# Read before building or modifying any component.

---

## Layout Components

### `Navbar`
**File**: `components/layout/Navbar.tsx`
**Type**: Client Component

```typescript
// No props — reads from siteConfig via context or prop-drilled from layout

interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}
```

**Behavior**:
- Fixed position, `z-50`
- Transparent on hero sections (`data-theme="dark"` parent), solid `bg-surface-dark` after scrolling 80px
- Logo left, nav center (desktop), hamburger right (mobile)
- Desktop: nav items with dropdowns on hover (SPORTS, EVENTS, FACILITIES have dropdowns)
- Mobile: full-width slide-in panel from right, `z-50`
- Active route: `text-primary` + underline indicator
- Theme toggle button on right side (desktop + mobile menu)
- Scroll listener: `window.scrollY > 80` → add solid background

**Dropdowns** (desktop only):
- SPORTS → Outdoor / Indoor / Aquatic / Health & Fitness / Track + "View All Sports"
- EVENTS → Upcoming Events / Leagues + "View All Events"
- FACILITIES → Rooms / Banquets / Dining / Recreation + "View All Facilities"

---

### `Footer`
**File**: `components/layout/Footer.tsx`
**Type**: Server Component

```typescript
interface FooterProps {
  siteConfig: SiteConfig  // passed from (site)/layout.tsx
}
```

**Structure**:
```
Top: 5-column grid (md) / 2-column (sm) / 1-column (xs)
  Col 1: Logo + tagline + social links
  Col 2: Quick Links (HOME, ABOUT, CONTACT, DOWNLOADS)
  Col 3: Sports (6 popular: Cricket, Badminton, Swimming, Tennis, Squash, Gym)
  Col 4: Facilities (Rooms, Banquets, Dining, Recreation)
  Col 5: Contact (address, phone, email)

Bottom strip:
  Left: Emergency contacts — Medical Cell: [PENDING] | Emergency: [PENDING]
  Right: © 2024 Goregaon Sports Club. All rights reserved.
```

---

### `ThemeProvider`
**File**: `components/layout/ThemeProvider.tsx`
**Type**: Client Component

```typescript
interface ThemeProviderProps {
  children: React.ReactNode
}
```

**Behavior**:
- On mount: reads `localStorage 'gsc-theme'`
- If `'dark'` → adds `.dark` to `<html>`
- If `'light'` or missing → removes `.dark` from `<html>` (default = light)
- Prevents flash: inline script in `<head>` reads localStorage before hydration

---

### `ThemeToggle`
**File**: `components/layout/ThemeToggle.tsx`
**Type**: Client Component

No props. On click: toggles `.dark` on `<html>` + writes to `localStorage 'gsc-theme'`.

Icon: Sun (light mode) / Moon (dark mode). `lucide-react`. 20px. No label text.

---

## Shared Components

### `SectionWrapper`
**File**: `components/shared/SectionWrapper.tsx`
**Type**: Server Component

```typescript
interface SectionWrapperProps {
  children: React.ReactNode
  id?: string                      // For anchor links
  className?: string
  contained?: boolean              // Default true — applies max-w + padding
  noPadding?: boolean              // Removes section Y padding
}
```

**Output**:
```tsx
<section id={id} className={`py-16 md:py-24 lg:py-32 ${className}`}>
  {contained ? (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  ) : children}
</section>
```

---

### `PageHero`
**File**: `components/shared/PageHero.tsx`
**Type**: Client Component (GSAP animation)

```typescript
interface PageHeroProps {
  headline: string
  subline?: string
  badge?: string                   // Small label above headline
  image?: SanityImage              // Optional background image
  minHeight?: 'screen' | '60vh' | '50vh'  // Default '60vh'
  children?: React.ReactNode       // Optional CTA buttons
}
```

**Behavior**:
- Always `data-theme="dark"` regardless of global theme
- GSAP fade-in on mount: badge → headline → subline → children (stagger 100ms)
- With image: image as background with dark gradient overlay
- Without image: solid `bg-bg-dark`
- `pt-24` to clear fixed navbar

---

### `AnimatedText`
**File**: `components/shared/AnimatedText.tsx`
**Type**: Client Component

```typescript
interface AnimatedTextProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'  // Default 'p'
  delay?: number                   // GSAP delay in seconds, default 0
  className?: string
}
```

**Behavior**:
- Wraps children in `as` element
- On scroll-enter: GSAP `y: 30 → 0, opacity: 0 → 1, duration: 0.6`
- `once: true` — animates once, not on re-enter
- Respects `prefers-reduced-motion`

---

### `StatCounter`
**File**: `components/shared/StatCounter.tsx`
**Type**: Client Component

```typescript
interface StatCounterProps {
  value: number                    // Target number
  suffix?: string                  // "+" or "%" or "K+"
  prefix?: string                  // "$" or "₹"
  label: string                    // "Members" or "Daily Footfall"
  duration?: number                // Animation duration in seconds, default 1.5
}
```

**Behavior**:
- On scroll-enter: animates from 0 to `value` over `duration` seconds
- GSAP `textContent` tween with `snap: { textContent: 1 }`
- Displays suffix/prefix alongside animated number
- `once: true`

---

### `Badge`
**File**: `components/shared/Badge.tsx`
**Type**: Server Component

```typescript
interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'gold' | 'red' | 'green' | 'outline'  // Default 'primary'
  size?: 'sm' | 'md'              // Default 'md'
  className?: string
}
```

---

### `FilterBar`
**File**: `components/shared/FilterBar.tsx`
**Type**: Client Component

```typescript
interface FilterOption {
  label: string
  value: string
}

interface FilterBarProps {
  filters: FilterOption[]
  activeValue: string
  onFilterChange: (value: string) => void
  allLabel?: string               // Label for "All" option, default "All"
}
```

**Behavior**:
- Horizontal scrollable pill row on mobile
- Active pill: `bg-primary text-white`
- Inactive pill: `border border-border text-secondary hover:border-primary hover:text-primary`
- Always includes "All" as first option

---

### `SportCard`
**File**: `components/shared/SportCard.tsx`
**Type**: Server Component

```typescript
interface SportCardProps {
  sport: {
    name: string
    slug: string
    category: string
    shortDescription: string
    heroImage: SanityImage
  }
  className?: string
}
```

**Output**: Card with image, sport name, category badge, description snippet, hover lift. Links to `/sports/[slug]`.

---

### `EventCard`
**File**: `components/shared/EventCard.tsx`
**Type**: Server Component

```typescript
interface EventCardProps {
  event: {
    title: string
    slug: string
    type: string
    status: string
    startDate: string
    heroImage: SanityImage
    description: string
  }
  className?: string
}
```

**Output**: Card with date badge (top-left), hero image, type pill, title, description snippet. Links to `/events/[slug]`.

---

### `AchievementCard`
**File**: `components/shared/AchievementCard.tsx`
**Type**: Client Component (lightbox trigger)

```typescript
interface AchievementCardProps {
  achievement: {
    _id: string
    title: string
    sport: string
    level: string
    type: string
    year: number
    image: SanityImage
    memberName?: string
  }
  onOpenLightbox: (achievement: Achievement) => void
}
```

**Behavior**:
- Displays achievement image with sport + level badges overlay
- Click: calls `onOpenLightbox` — parent opens shadcn Dialog
- Hover: subtle scale + overlay reveal

---

### `PDFViewer`
**File**: `components/shared/PDFViewer.tsx`
**Type**: Client Component (`react-pdf`)

```typescript
interface PDFViewerProps {
  url: string                     // Cloudinary or Sanity file URL
  title?: string
  showDownload?: boolean          // Default true
  maxHeight?: string              // CSS value, default '80vh'
}
```

**Behavior**:
- `react-pdf` Document + Page components
- Page navigation: prev/next buttons + page counter
- Download button: opens URL in new tab
- Loading state: skeleton placeholder
- Error state: "Could not load document. Download instead." with direct link

---

## Form Components

### `BookingForm`
**File**: `components/shared/forms/BookingForm.tsx`
**Type**: Client Component

```typescript
interface BookingFormProps {
  defaultType?: 'room' | 'banquet' | 'ground' | 'coaching'
  defaultSport?: string           // Pre-fills sport field if coming from /sports/[slug]
  defaultHall?: string            // Pre-fills hall if coming from /facilities/banquets/[hall]
}
```

**Fields by type** (see `docs/FORMS.md` for full field list):
- All types: Name\*, Email\*, Phone\*, Message
- Room: Check-in\*, Check-out\*, Guests
- Banquet: Hall preference, Event type\*, Guest count\*, Event date\*
- Ground: Sport, Date\*, Time\*
- Coaching: Sport\*, Level

**Behavior**:
- Tab/pill selector at top switches form fields
- React Hook Form + Zod validation
- Submit to `POST /api/booking`
- Success: inline success message — "Your inquiry has been received. We'll contact you within 24 hours."
- Error: inline error message

---

### `MembershipInterestForm`
**File**: `components/shared/forms/MembershipInterestForm.tsx`
**Type**: Client Component

```typescript
interface MembershipInterestFormProps {
  membershipType: string          // Pre-filled from page context
}
```

**Fields**: Name\*, Email\*, Phone\*, Membership Type (pre-filled, readonly), Message (optional)

---

### `ContactForm`
**File**: `components/shared/forms/ContactForm.tsx`
**Type**: Client Component

**Fields**: Name\*, Email\*, Phone, Subject (dropdown)\*, Message\*

Subject options: General | Membership | Event | Partnership | Media | Leagues

---

### `PartnerForm`
**File**: `components/shared/forms/PartnerForm.tsx`
**Type**: Client Component

**Fields**: Company Name\*, Contact Name\*, Email\*, Phone\*, Partnership Type (select), Message

---

### `AchievementSubmitForm`
**File**: `components/shared/forms/AchievementSubmitForm.tsx`
**Type**: Client Component

**Fields**: Member Name\*, Email\*, Phone, Sport\*, Achievement Title\*, Level (select)\*, Year\*, Description, Photo (Cloudinary upload)

**Behavior**: Cloudinary unsigned upload before form submit. Image URL stored in form state then submitted with the rest of the data.

---

## Three.js Components

### `WebGLDetector`
**File**: `components/three/WebGLDetector.tsx`
**Type**: Client Component

```typescript
// No props — utility component
// Returns: boolean (via hook) or component (via wrapper)

export function useWebGL(): boolean
export function WebGLOnly({ children, fallback }: { children: ReactNode; fallback: ReactNode }): JSX.Element
```

**Detection**:
```typescript
const hasWebGL = typeof window !== 'undefined' &&
  !!window.WebGLRenderingContext &&
  !isMobile()  // user-agent check

function isMobile(): boolean {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}
```

---

### `SceneCanvas`
**File**: `components/three/SceneCanvas.tsx`
**Type**: Client Component

```typescript
interface SceneCanvasProps {
  children: React.ReactNode
  className?: string
  camera?: { fov?: number; position?: [number, number, number] }
  dpr?: [number, number]          // Default [1, 2]
}
```

**Wraps**: R3F `<Canvas>` with `<Suspense>` + `<ErrorBoundary>`.
Performance: `gl={{ antialias: false }}` on mobile (if somehow reached), `dpr` capped at 2.

---

### `HeroScene`
**File**: `components/three/HeroScene.tsx`
**Type**: Client Component

Full homepage WebGL particle scene. See `docs/3D.md` for full spec.

---

### `SportsScroll`
**File**: `components/three/SportsScroll.tsx`
**Type**: Client Component

6-scene GSAP ScrollTrigger pinned scroll experience. See `docs/3D.md` for full spec.

---

### Sport Objects (4 components)

```
components/three/objects/CricketBall.tsx
components/three/objects/Shuttlecock.tsx
components/three/objects/TennisBall.tsx
components/three/objects/WaterSphere.tsx
```

Each: ambient rotation animation, fade on scroll. See `docs/3D.md` for full spec.
