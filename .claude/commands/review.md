Audit the last built component or page against design and code standards.

Usage: /review [optional: file path]

If no file path given, audit the most recently written file.

Steps:

1. Read the file to audit.

2. Load @docs/DESIGN_RULES.md and @docs/COMPONENT_SPECS.md.

3. Check against each category below. Report violations only — do not list passing items.

---

DESIGN AUDIT:

Colors
[ ] Are CSS variables used instead of hardcoded hex values?
[ ] Is --color-primary used correctly (dark bg vs light bg variants)?
[ ] Are accent colors (gold, red, green) used sparingly — not decoratively?

Typography
[ ] Is Barlow Condensed used ONLY for Display XL through Display S?
[ ] Is Inter used for all body, heading, label, and button text?
[ ] Are display sizes UPPERCASE only at Display XL and L?

Buttons
[ ] Are all buttons rounded-full? (No square or slightly-rounded corners)
[ ] Are buttons using correct variant (primary/secondary/ghost/gold)?

Cards
[ ] Are cards using rounded-2xl?
[ ] Dark cards: border only, no box shadow?
[ ] Light cards: shadow-sm default, shadow-md on hover?

Hero
[ ] Does the hero section have data-theme="dark"?
[ ] Does it have pt-24 to clear the fixed navbar?

Dark Mode
[ ] Does the component work in both light and dark mode?
[ ] Are dark: variants applied correctly using @variant dark (Tailwind v4)?

Animation
[ ] Are GSAP animations wrapped in prefers-reduced-motion check?
[ ] Are only transform and opacity animated (no layout-affecting props)?

Mobile
[ ] Is the layout mobile-first (base → md: → lg:)?
[ ] Is WebGL absent from this component? (Phase 3 only)

---

CODE AUDIT:

[ ] No `any` types — proper TypeScript throughout?
[ ] No hardcoded strings that should come from Sanity or env vars?
[ ] Sanity images use urlFor() — not .asset.url?
[ ] ISR tags present on all Sanity fetches?
[ ] Forms use React Hook Form + Zod — no uncontrolled inputs?
[ ] components/ui/ files not imported with modifications?
[ ] Named export for component (default only for pages/layouts)?

---

Report format:

VIOLATIONS FOUND: [N]

[Category]: [specific violation]
  File: [path]
  Line: [approx line number if known]
  Fix: [what needs to change]

---

If no violations:
"No violations found. Component meets all design and code standards."
