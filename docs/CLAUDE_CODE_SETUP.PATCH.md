# GSC — CLAUDE_CODE_SETUP Patch
# Addition to docs/CLAUDE_CODE_SETUP.md. Do not modify the original.
# Covers: Admin dashboard verification checklist.
# Run these checks after completing Phase 4 (ADMIN-01 through ADMIN-P4).

---

## Admin Dashboard Verification Checklist

Add to the Verification Checklist in CLAUDE_CODE_SETUP.md after the existing items:

### Phase 4 — Admin Dashboard

```
Better Auth setup:
[ ] BETTER_AUTH_SECRET set in .env.local (openssl rand -base64 32)
[ ] BETTER_AUTH_URL set to https://gsc.in (or localhost:3000 for local)
[ ] pnpm create:admin run — first admin user created in DB
[ ] user row appears in Neon DB 'user' table

Auth routes:
[ ] /api/auth/sign-in responds with 200 for valid credentials
[ ] /api/auth/sign-out works and clears session cookie

Admin access:
[ ] /admin redirects to /admin/login when not signed in
[ ] /admin/login form accepts admin credentials
[ ] /admin/dashboard loads after login
[ ] Sidebar shows all Content + Submissions + Users sections

Role separation:
[ ] Create a staff user via /admin/users
[ ] Sign in as staff user — dashboard loads
[ ] /admin/users redirects staff to /admin/dashboard (cannot access)
[ ] Staff can edit sports, events, etc.

Content sync (critical — test each):
[ ] Update a sport in /admin/content/sports/[slug] → verify /sports/[slug] reflects change
[ ] Toggle membership enrollment in /admin/content/membership → verify /membership shows updated notice
[ ] Upload bye-laws PDF in /admin/content/about → verify /about/bye-laws shows PDF
[ ] Update leaguesConfig in /admin/content/leagues-config → verify /events/leagues reflects change

Submission flows:
[ ] Submit booking form on public site → appears in /admin/submissions/bookings as pending
[ ] Change booking status in admin → status updates in Drizzle
[ ] Submit achievement via /achievements modal → appears in /admin/submissions/achievements
[ ] Approve achievement in admin → Sanity achievement document created → appears on /achievements

Sign out:
[ ] Sign out button works → redirected to /admin/login
[ ] Accessing /admin after sign out → redirected to /admin/login (session cleared)
```

---

## Additional Environment Variables (add to .env.example)

```bash
# Admin — Better Auth
BETTER_AUTH_SECRET=          # openssl rand -base64 32 — minimum 32 chars
BETTER_AUTH_URL=             # https://gsc.in in production, http://localhost:3000 in dev
ADMIN_EMAIL=                 # First admin user email — used by pnpm create:admin
ADMIN_PASSWORD=              # First admin user password — used by pnpm create:admin
```

These 4 vars are in addition to the vars already listed in CLAUDE_CODE_SETUP.md.
