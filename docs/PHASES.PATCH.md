# GSC — PHASES Patch
# Addition to docs/PHASES.md. Do not modify PHASES.md itself.
# Covers: Phase 4 — Admin Dashboard (13 tasks total).
# Full prompt set in prompts/ADMIN_DASHBOARD.md + ADMIN_DASHBOARD_PATCH.md + ADMIN_DASHBOARD_ABOUT.md

---

## Phase 4 — Admin Dashboard (13 tasks)

Run after Phase 3 is complete and the public site is live.
All prompts are in the prompts/ directory — see file references per task.

---

### ADMIN-01 — Better Auth Setup
**Prompt file**: prompts/ADMIN_DASHBOARD.md § ADMIN-01
**Goal**: Install Better Auth, configure Drizzle adapter, run DB migration for auth tables, create first admin user.

Auth tables added to Neon: user, session, account, verification.
Script: `pnpm create:admin` (run once).

---

### ADMIN-02 — Route Structure + Middleware + Login
**Prompt file**: prompts/ADMIN_DASHBOARD.md § ADMIN-02
**Goal**: `/admin/*` route group protected by Better Auth middleware. `/admin/login` is public. AdminSidebar, AdminTopBar, layout built.

---

### ADMIN-03 — Dashboard Overview
**Prompt file**: prompts/ADMIN_DASHBOARD.md § ADMIN-03
**Goal**: Stat cards (pending submission counts from Drizzle + content counts from Sanity). Recent activity feed. Quick action buttons.

---

### ADMIN-04 — Submissions Management
**Prompt file**: prompts/ADMIN_DASHBOARD.md § ADMIN-04
**Goal**: All 5 Drizzle table submission pages (bookings, memberships, contacts, partners, achievement submissions). Status update flows. Achievement approval → auto-creates Sanity document.

---

### ADMIN-05 — Content: Sports + Events
**Prompt file**: prompts/ADMIN_DASHBOARD.md § ADMIN-05
**Goal**: Sports list + edit form. Events list + create + edit + delete. sanityWrite.ts helper (patch/create/delete + revalidateTag).

---

### ADMIN-06 — Content: Achievements + Dining + Banquets
**Prompt file**: prompts/ADMIN_DASHBOARD.md § ADMIN-06
**Goal**: Achievement wall management + manual upload. Dining venue edit (PDFs, gallery, hours). Banquet hall edit (capacity, setup options, gallery).

---

### ADMIN-07 — Content: Membership + Downloads + Settings
**Prompt file**: prompts/ADMIN_DASHBOARD.md § ADMIN-07
**Goal**: Membership enrollment toggle (big prominent UI). Downloads CRUD. siteConfig editor (emergency contacts, hero video URL, social links, partners).

---

### ADMIN-08 — User Management
**Prompt file**: prompts/ADMIN_DASHBOARD.md § ADMIN-08
**Goal**: Create/edit/delete admin users. Role switching (admin/staff). Revoke sessions. Staff cannot see this page.

---

### ADMIN-09 — Security Hardening + Final Wiring
**Prompt file**: prompts/ADMIN_DASHBOARD.md § ADMIN-09
**Goal**: requireAdminSession() guard on all /api/admin/** routes. Rate limiting on login. Security headers. Full test checklist.

---

### ADMIN-P1 — Booking Config + Leagues Config
**Prompt file**: prompts/ADMIN_DASHBOARD_PATCH.md § ADMIN-P1
**Goal**: Edit bookingConfig (rooms list, booking email). Edit all 18 leagues (names, dates, active toggle).

---

### ADMIN-P2 — Committee + Milestones + Food Stalls + Membership Types
**Prompt file**: prompts/ADMIN_DASHBOARD_PATCH.md § ADMIN-P2
**Goal**: Full CRUD for committee members and milestones. CRUD for food stalls (Food Court sub-entities). Edit-only for 5 membership types.

---

### ADMIN-P3 — Partnerships + Team Spirit + Annual Reports + Legal Pages
**Prompt file**: prompts/ADMIN_DASHBOARD_PATCH.md § ADMIN-P3
**Goal**: Full CRUD for partnership opportunities. Create/edit Team Spirit editions (PDF upload). Create/edit Annual Reports (PDF upload). Edit-only for 3 legal pages.

---

### ADMIN-P4 — About Page + Bye-Laws PDF
**Prompt file**: prompts/ADMIN_DASHBOARD_ABOUT.md § ADMIN-P4
**Goal**: Edit aboutPage singleton (history text + historic image). Upload/replace/remove bye-laws PDF. Updates /about and /about/bye-laws immediately via revalidateTag.

---

## Complete Admin Coverage

After all 13 tasks, every Sanity document type and every Drizzle table has an admin UI:

```
Singletons managed in admin:
  aboutPage         → /admin/content/about          (ADMIN-P4)
  siteConfig        → /admin/content/settings        (ADMIN-07)
  membershipConfig  → /admin/content/membership      (ADMIN-07)
  bookingConfig     → /admin/content/booking-config  (ADMIN-P1)
  leaguesConfig     → /admin/content/leagues-config  (ADMIN-P1)

Documents managed in admin:
  sport             → /admin/content/sports          (ADMIN-05)
  event             → /admin/content/events          (ADMIN-05)
  achievement       → /admin/content/achievements    (ADMIN-06)
  diningVenue       → /admin/content/dining          (ADMIN-06)
  banquetHall       → /admin/content/banquets        (ADMIN-06)
  download          → /admin/content/downloads       (ADMIN-07)
  committeeMember   → /admin/content/committee       (ADMIN-P2)
  milestone         → /admin/content/milestones      (ADMIN-P2)
  foodStall         → /admin/content/food-stalls     (ADMIN-P2)
  membershipType    → /admin/content/membership-types (ADMIN-P2)
  partnershipOpp.   → /admin/content/partnerships    (ADMIN-P3)
  teamSpiritEdition → /admin/content/team-spirit     (ADMIN-P3)
  annualReport      → /admin/content/annual-reports  (ADMIN-P3)
  legalPage         → /admin/content/legal           (ADMIN-P3)

Drizzle submissions managed in admin:
  bookingInquiries      → /admin/submissions/bookings      (ADMIN-04)
  membershipInquiries   → /admin/submissions/memberships   (ADMIN-04)
  contactInquiries      → /admin/submissions/contacts      (ADMIN-04)
  partnerInquiries      → /admin/submissions/partners      (ADMIN-04)
  achievementSubmissions → /admin/submissions/achievements (ADMIN-04)

Users managed in admin:
  Better Auth users  → /admin/users                        (ADMIN-08)
```
