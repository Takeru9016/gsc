Read @CLAUDE.md to confirm the active task code and name.

Then load the relevant documentation for this task:

- For ANY task: read @docs/spec/CONVENTIONS.md and @docs/DESIGN_RULES.md
- For page-building tasks: read the relevant section of @docs/spec/PAGES.md
- For Sanity schema tasks: read @docs/spec/SCHEMA.md and @docs/SANITY_CMS.md
- For database tasks: read @docs/DB.md
- For form tasks: read @docs/FORMS.md
- For 3D tasks: read @docs/3D.md
- For component tasks: read @docs/COMPONENT_SPECS.md
- For Phase 1A tasks: read @docs/PHASES.md section for the specific task

After loading relevant docs, build the active task completely. Apply all rules from CONVENTIONS.md and DESIGN_RULES.md without exception.

Rules during build:
- Mobile-first always (base → md: → lg:)
- No `any` in TypeScript — use proper types or `unknown`
- Dark mode tokens on all components — test both themes
- Hero sections always get `data-theme="dark"`
- ISR tags on every Sanity fetch
- Sanity images always through `urlFor()` from lib/sanity/image.ts
- Never edit components/ui/ files
- Forms: React Hook Form + Zod only
- No WebGL — that is Phase 3. Use GSAP CSS placeholders where 3D will go.

After building:
- State what files were created or modified
- Note any PENDING_CONTENT placeholders added
- Note any TypeScript types that need real Sanity data to resolve
- Do not run /done — wait for /check first
