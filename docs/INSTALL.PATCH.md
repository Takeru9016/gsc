# GSC — INSTALL Patch
# Additions to INSTALL.md. Do not modify INSTALL.md itself.
# Run these AFTER completing INSTALL.md steps 1–6.
# Required for: seed scripts (tsx) + Better Auth CLI (admin setup).

---

## Additional Dev Dependencies

Run these after Step 3 of INSTALL.md:

```bash
# Script runner — needed for seed scripts and create-admin script
pnpm add -D tsx

# Better Auth CLI — generates Drizzle schema for auth tables
pnpm add -D @better-auth/cli
```

Add to devDependencies reference in INSTALL.md § Full Dependency Reference:
```
tsx
@better-auth/cli
```

---

## Additional package.json Scripts

Add these alongside the existing scripts from INSTALL.md Step 5:

```json
{
  "scripts": {
    "seed": "tsx scripts/seed-all.ts",
    "seed:site-config": "tsx scripts/seed-site-config.ts",
    "seed:membership-config": "tsx scripts/seed-membership-config.ts",
    "seed:leagues-config": "tsx scripts/seed-leagues-config.ts",
    "seed:sports": "tsx scripts/seed-sports.ts",
    "seed:banquets": "tsx scripts/seed-banquets.ts",
    "seed:dining": "tsx scripts/seed-dining.ts",
    "seed:membership-types": "tsx scripts/seed-membership-types.ts",
    "seed:legal": "tsx scripts/seed-legal-pages.ts",
    "seed:about-page": "tsx scripts/seed-about-page.ts",
    "seed:booking-config": "tsx scripts/seed-booking-config.ts",
    "seed:partnerships": "tsx scripts/seed-partnerships.ts",
    "create:admin": "tsx scripts/create-admin.ts"
  }
}
```

---

## Why these are separate

- `tsx` is needed to run TypeScript scripts directly without compiling first
- `@better-auth/cli` is used once during ADMIN-01 to generate the Drizzle schema for Better Auth tables:
  `pnpm dlx @better-auth/cli generate --output lib/auth/schema.ts`
  This creates the `user`, `session`, `account`, `verification` table definitions.
