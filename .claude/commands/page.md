Build a specific page by route path. Use when you need to build or rebuild a page outside the normal task sequence.

Usage: /page [route]

Examples:
  /page about/team
  /page facilities/dining/bleu-restobar
  /page events/leagues
  /page membership/life

Steps:

1. Identify the route from the argument passed after /page.

2. Load exactly these files — no others:
   - @docs/spec/PAGES.md  (find the relevant page section)
   - @docs/DESIGN_RULES.md
   - @docs/spec/CONVENTIONS.md
   - @docs/COMPONENT_SPECS.md  (only if building shared components)
   - @docs/SANITY_CMS.md  (only if the page fetches Sanity data)

3. Build the complete page at the correct path in app/(site)/[route]/page.tsx

4. Apply all rules:
   - Mobile-first
   - Dark hero (data-theme="dark")
   - ISR tags on all Sanity fetches
   - Sanity images via urlFor()
   - No WebGL (Phase 3 only)
   - PENDING_CONTENT placeholders where manager data is missing

5. After building, report:
   - File path created/modified
   - Sanity document types queried
   - Any PENDING_CONTENT placeholders and what data is needed
   - Any shared components created or reused

This command does NOT update the Phase Tracker in CLAUDE.md.
If this page corresponds to a phase task, run /done manually after /check passes.
