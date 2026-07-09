# GSC — Design Rules
# Non-negotiable visual rules. Apply to every component built.
# When in doubt: simpler, cleaner, more spacious.

---

## Color System

### Primary Palette

| Token                  | Value     | Usage                                      |
|------------------------|-----------|--------------------------------------------|
| `--color-primary`      | `#1E88E5` | CTAs, links, active states on dark bg      |
| `--color-primary-dark` | `#1565C0` | CTAs on light bg, logo exact match         |
| `--color-primary-hover`| `#1976D2` | Hover state for primary elements           |

### Accent Palette

| Token                   | Value     | Usage                                     |
|-------------------------|-----------|-------------------------------------------|
| `--color-accent-gold`   | `#FFB300` | Flame, achievement badges, highlight CTA  |
| `--color-accent-red`    | `#E53935` | Energy, error states, gym scene light     |
| `--color-accent-green`  | `#43A047` | Success states, active/open indicators    |

### Dark Mode Surfaces

| Token                    | Value     | Usage                         |
|--------------------------|-----------|-------------------------------|
| `--color-bg-dark`        | `#0A0E1A` | Page background               |
| `--color-surface-dark`   | `#111827` | Cards, panels, navbar         |
| `--color-elevated-dark`  | `#1A2235` | Modals, dropdowns, tooltips   |

### Light Mode Surfaces

| Token                    | Value     | Usage                         |
|--------------------------|-----------|-------------------------------|
| `--color-bg-light`       | `#F8FAFF` | Page background               |
| `--color-surface-light`  | `#FFFFFF` | Cards, panels                 |

### Text

| Token                       | Value              | Usage                      |
|-----------------------------|--------------------|----------------------------|
| `--color-text-primary-dark` | `#F9FAFB`          | Headings on dark bg        |
| `--color-text-secondary-dark`| `#9CA3AF`         | Body, captions on dark bg  |
| `--color-text-primary-light`| `#0F172A`          | Headings on light bg       |
| `--color-text-secondary-light`| `#6B7280`        | Body, captions on light bg |

### Borders

| Token                  | Value                    | Usage                    |
|------------------------|--------------------------|--------------------------|
| `--color-border-dark`  | `rgba(255,255,255,0.08)` | Subtle dividers on dark  |
| `--color-border-light` | `rgba(0,0,0,0.08)`       | Subtle dividers on light |

---

## Typography

### Font Families

```css
--font-display: 'Barlow Condensed', sans-serif;   /* weight 600, 700 only */
--font-body: 'Inter', sans-serif;                 /* weight 400, 500, 600 */
```

### Type Scale

| Name         | Size  | Line Height | Weight | Font     | Usage                       |
|--------------|-------|-------------|--------|----------|-----------------------------|
| Display XL   | 96px  | 1.0         | 700    | Barlow   | Homepage hero only          |
| Display L    | 72px  | 1.05        | 700    | Barlow   | Section heroes              |
| Display M    | 56px  | 1.1         | 600    | Barlow   | Page titles                 |
| Display S    | 40px  | 1.15        | 600    | Barlow   | Section headings            |
| Heading L    | 32px  | 1.2         | 600    | Inter    | Card titles, sub-headings   |
| Heading M    | 24px  | 1.3         | 600    | Inter    | Component headings          |
| Heading S    | 20px  | 1.4         | 600    | Inter    | Labels, small headings      |
| Body L       | 18px  | 1.6         | 400    | Inter    | Lead paragraphs             |
| Body M       | 16px  | 1.6         | 400    | Inter    | Default body text           |
| Body S       | 14px  | 1.5         | 400    | Inter    | Captions, meta, tags        |

### Typography Rules

- **Barlow Condensed ONLY for display sizes** (Display XL through Display S). Never for body text.
- **Inter for everything else** — headings, body, labels, buttons, forms.
- **UPPERCASE for Display XL + L only** — not for smaller sizes.
- **Letter spacing**: Display XL + L = `tracking-wide`. Everything else = `tracking-normal`.
- **Never mix fonts within one visual unit** (card, CTA block).

---

## Spacing

Use Tailwind's default spacing scale. Do not introduce custom values unless absolutely necessary.

### Section Spacing
```
Section padding (Y): py-16 (mobile) → py-24 (md) → py-32 (lg)
Container max width: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Component Spacing
```
Card padding:        p-6 (mobile) → p-8 (md)
Card gap in grid:    gap-4 (mobile) → gap-6 (md) → gap-8 (lg)
Section headline gap: mb-8 (mobile) → mb-12 (md) → mb-16 (lg)
```

### Vertical Rhythm
- Headings always paired with a subline or description — never floated alone.
- Consistent 8px base unit. All spacing multiples of 8 (except 2px, 4px for micro-spacing).

---

## Components

### Buttons

```
Primary:   bg-primary text-white hover:bg-primary-hover rounded-full px-6 py-3
           (on dark bg: --color-primary | on light bg: --color-primary-dark)

Secondary: border border-primary text-primary hover:bg-primary/10 rounded-full px-6 py-3

Ghost:     text-secondary hover:text-primary hover:bg-primary/5 rounded-full px-4 py-2

Gold CTA:  bg-accent-gold text-black hover:opacity-90 rounded-full px-6 py-3
           (use sparingly — only for highest-priority CTAs like "Join Now")
```

- **Border radius: `rounded-full` for all buttons.** No square buttons.
- **Font**: Inter 500, 16px, no uppercase transform.
- **Min width**: 120px. No tiny buttons.

### Cards

```
Dark surface:  bg-surface-dark border border-border-dark rounded-2xl p-6
Light surface: bg-white border border-border-light rounded-2xl p-6 shadow-sm

Hover:         translate-y-[-2px] shadow-md transition-all duration-200
```

- **Border radius: `rounded-2xl` for all cards.**
- **No box shadows on dark backgrounds** — use subtle border only.
- **Box shadows on light backgrounds** — `shadow-sm` default, `shadow-md` on hover.

### Hero Sections

```
Min height:  min-h-screen (homepage hero) | min-h-[60vh] (page heroes)
Background:  Always dark (data-theme="dark") — uses dark surface tokens
Overlay:     bg-gradient-to-b from-bg-dark/0 via-bg-dark/40 to-bg-dark/80 (for images)
Padding:     pt-24 (accounts for fixed navbar height)
```

### Section Structure

```tsx
<section className="py-16 md:py-24 lg:py-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mb-8 md:mb-12 lg:mb-16">
      <h2>Section Heading</h2>
      <p>Section subline</p>
    </div>
    {/* content */}
  </div>
</section>
```

### Badges / Pills

```
Primary:   bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-sm
Gold:      bg-accent-gold/10 text-accent-gold border border-accent-gold/20 rounded-full px-3 py-1 text-sm
Red:       bg-accent-red/10 text-accent-red border border-accent-red/20 rounded-full px-3 py-1 text-sm
Green:     bg-accent-green/10 text-accent-green border border-accent-green/20 rounded-full px-3 py-1 text-sm
Outline:   border border-border-dark text-secondary rounded-full px-3 py-1 text-sm
```

### Filter Pills

```
Inactive:  border border-border rounded-full px-4 py-2 text-secondary hover:border-primary hover:text-primary
Active:    bg-primary text-white rounded-full px-4 py-2
```

### Form Elements

```
Input:    border border-border rounded-xl px-4 py-3 bg-surface text-primary
          focus:border-primary focus:ring-1 focus:ring-primary outline-none
          placeholder:text-secondary

Label:    text-sm font-medium text-primary mb-1 block

Error:    text-sm text-accent-red mt-1

Select:   same as Input — use shadcn Select component
```

---

## Dark Mode

### Implementation
- `ThemeProvider` adds `.dark` class to `<html>` based on `localStorage 'gsc-theme'`
- Default: light mode (no `.dark` class)
- Toggle: button writes to localStorage + flips class

### Hero Override
All hero sections use `data-theme="dark"` to force dark tokens regardless of global theme:

```tsx
<section data-theme="dark">
  {/* Always renders with dark tokens */}
</section>
```

```css
/* globals.css */
[data-theme="dark"] {
  --color-bg: var(--color-bg-dark);
  --color-surface: var(--color-surface-dark);
  --color-text-primary: var(--color-text-primary-dark);
  --color-text-secondary: var(--color-text-secondary-dark);
  --color-border: var(--color-border-dark);
}
```

### Both themes must be tested for every component built.

---

## Animation

### Principles
- **Purpose over decoration** — every animation must aid comprehension or guide attention.
- **Fast in, slow out** — enter: 300–400ms. Exit: 150–200ms.
- **No layout shift** — never animate properties that cause reflow (width, height, top, left). Use `transform` and `opacity` only.
- **Respect prefers-reduced-motion** — wrap all GSAP animations:

```typescript
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.from(element, { ... })
}
```

### GSAP Defaults

```typescript
// Scroll reveal — default for all headings and text
gsap.from(element, {
  y: 30,
  opacity: 0,
  duration: 0.6,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: element,
    start: 'top 85%',
    once: true,
  }
})

// Card stagger
gsap.from(cards, {
  y: 20,
  opacity: 0,
  duration: 0.5,
  stagger: 0.08,
  ease: 'power2.out',
  scrollTrigger: { ... }
})

// Counter animation
gsap.to(counter, {
  textContent: targetValue,
  duration: 1.5,
  ease: 'power1.out',
  snap: { textContent: 1 },
  scrollTrigger: { ... }
})
```

### Lenis (Smooth Scroll)

```typescript
// Wrap entire app. Init once in layout.
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
})

// Sync with GSAP ticker
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

### Page Transitions
Fade-in on route change: opacity 0 → 1, duration 400ms, ease `power2.out`.

### Hover States
All interactive elements: `transition-all duration-200`. Never longer.

---

## Imagery

### Images Rules
- All images through `next/image` with explicit `width` + `height` or `fill`.
- All Sanity images through `urlFor()` — never `.asset.url`.
- Always provide `alt` text — descriptive, not decorative (`alt=""` only for purely decorative).
- Priority `true` only for above-the-fold images (hero, first visible card).

### Placeholder Strategy
While waiting for real content, use `[PENDING_CONTENT]` comment in code and a solid color placeholder div:

```tsx
{/* [PENDING_CONTENT] — Replace with actual Sanity image */}
<div className="aspect-video bg-surface-dark rounded-2xl" />
```

---

## Accessibility

- **Minimum contrast ratio**: 4.5:1 for body text, 3:1 for large text (WCAG AA).
- **Focus visible**: All interactive elements must have visible focus ring (`focus-visible:ring-2 focus-visible:ring-primary`).
- **ARIA**: Use semantic HTML first. Add ARIA only when HTML semantics are insufficient.
- **Skip link**: Include skip-to-main-content link in layout.
- **Images**: Meaningful images have descriptive alt text. Decorative images have `alt=""`.

---

## Do Not Rules

1. **Do not use shadows on dark surfaces** — use borders only.
2. **Do not use Barlow Condensed below Display S** — use Inter for smaller sizes.
3. **Do not uppercase non-display text** — only Display XL and L.
4. **Do not animate layout-affecting properties** — transform + opacity only.
5. **Do not use more than 3 accent colors per page section** — pick one or two.
6. **Do not put WebGL on mobile** — CSS fallback is mandatory.
7. **Do not make hero sections light** — always dark regardless of theme.
8. **Do not use square corners on buttons** — always `rounded-full`.
9. **Do not use more than 2 CTAs per section** — one primary, one optional secondary.
10. **Do not skip prefers-reduced-motion checks** on GSAP animations.
