# GSC — Install Reference
# Run these commands once after project init (Task 1A-01).
# All commands use pnpm. Do not use npm or yarn.
# Order matters — run sections top to bottom.

---

## Step 1 — Create Next.js App

```bash
pnpm create next-app@latest gsc \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-eslint

cd gsc
```

---

## Step 2 — Production Dependencies

### Framework + UI
```bash
pnpm add clsx tailwind-merge
pnpm add lucide-react
```

### shadcn/ui Primitives (selective — only what GSC uses)
```bash
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-tabs
pnpm add @radix-ui/react-select
pnpm add @radix-ui/react-tooltip
```

### CMS — Sanity
```bash
pnpm add next-sanity @sanity/image-url @sanity/webhook
```

### Database — Drizzle + Neon
```bash
pnpm add drizzle-orm @neondatabase/serverless drizzle-zod
```

### 3D — React Three Fiber
```bash
pnpm add @react-three/fiber @react-three/drei three
```

### Animation — GSAP + Lenis
```bash
pnpm add gsap @studio-freight/lenis
```

### Email — Resend + React Email
```bash
pnpm add resend @react-email/components
```

### File Storage — Cloudinary
```bash
pnpm add cloudinary next-cloudinary
```

### PDF
```bash
pnpm add react-pdf @react-pdf/renderer
```

### Forms + Validation
```bash
pnpm add react-hook-form @hookform/resolvers zod
```

---

## Step 3 — Dev Dependencies

### Database tooling
```bash
pnpm add -D drizzle-kit
```

### TypeScript types
```bash
pnpm add -D @types/three
```

### Sanity Studio
```bash
pnpm add -D sanity
```

### Linting + Formatting
```bash
pnpm add -D @biomejs/biome ultracite
```

---

## Step 4 — Init Biome

```bash
pnpm biome init
```

Then replace the generated `biome.json` with:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "extends": ["ultracite"],
  "files": {
    "ignore": [
      "node_modules",
      ".next",
      "dist",
      "drizzle",
      "sanity/schemas"
    ]
  },
  "linter": {
    "rules": {
      "correctness": {
        "noUnusedImports": "error"
      }
    }
  }
}
```

---

## Step 5 — package.json Scripts

Replace the `scripts` block in `package.json` with:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "typecheck": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push"
  }
}
```

---

## Step 6 — Verify Clean Install

```bash
pnpm typecheck   # must pass — 0 errors
pnpm lint        # must pass — 0 errors
pnpm build       # must pass on empty app shell
```

---

## Full Dependency Reference

For reference — the complete expected `dependencies` and `devDependencies` after all installs:

### dependencies
```
next                        (installed by create-next-app)
react                       (installed by create-next-app)
react-dom                   (installed by create-next-app)
typescript                  (installed by create-next-app)
tailwindcss                 (installed by create-next-app)
@tailwindcss/postcss        (installed by create-next-app)
clsx
tailwind-merge
lucide-react
@radix-ui/react-dialog
@radix-ui/react-tabs
@radix-ui/react-select
@radix-ui/react-tooltip
next-sanity
@sanity/image-url
@sanity/webhook
drizzle-orm
@neondatabase/serverless
drizzle-zod
@react-three/fiber
@react-three/drei
three
gsap
@studio-freight/lenis
resend
@react-email/components
cloudinary
next-cloudinary
react-pdf
@react-pdf/renderer
react-hook-form
@hookform/resolvers
zod
```

### devDependencies
```
drizzle-kit
@types/three
sanity
@biomejs/biome
ultracite
```

---

## Notes

- **Do not install ESLint** — `--no-eslint` flag is set in Step 1. Biome handles linting.
- **Do not install prettier** — Biome handles formatting.
- **shadcn/ui components** are added individually via `pnpm dlx shadcn@latest add [component]` as needed — not pre-installed as a package.
- **`next-cloudinary`** is optional if Cloudinary upload is handled client-side only (achievement form). Can be removed if not used server-side.
- **`@react-pdf/renderer`** is for generating PDFs. **`react-pdf`** is for viewing them. Both are needed.
- **`drizzle-zod`** generates Zod schemas directly from Drizzle table definitions — used in API route validation.
- **`@studio-freight/lenis`** — this is the correct package name for Lenis v1. If a future version changes the package name, verify before installing.
