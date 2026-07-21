# GSC — Admin Dashboard Patch
# Covers 8 Sanity document types missing from ADMIN_DASHBOARD.md.
# Run ADMIN-P1 through ADMIN-P3 after completing ADMIN-01 through ADMIN-09.
# These slot into the existing /admin/content/ route group.

---

## What Was Missing

ADMIN_DASHBOARD.md covered 9 of 17 Sanity types.
This file covers the remaining 8:

  Booking Config          → ADMIN-P1
  Leagues Config          → ADMIN-P1
  Committee Member        → ADMIN-P2
  Milestone               → ADMIN-P2
  Food Stall              → ADMIN-P2
  Membership Type         → ADMIN-P2
  Partnership Opportunity → ADMIN-P3
  Team Spirit Edition     → ADMIN-P3
  Annual Report           → ADMIN-P3
  Legal Page              → ADMIN-P3

Also: extend AdminSidebar to include all new sections.

---

## ADMIN-P1 — Booking Config + Leagues Config

```
/build

Task ADMIN-P1 — Booking Config + Leagues Config pages.

--- BOOKING CONFIG ---

PAGE: app/(admin)/content/booking-config/page.tsx
Fetch bookingConfig singleton from Sanity (add getBookingConfig() to lib/sanity/queries.ts if missing).

Section 1 — Booking Contact:
  bookingEmail (text input) — email that receives booking inquiry notifications
  responseTime (text input) — e.g. "We respond within 24 hours"
  Save → PATCH bookingConfig → revalidateTag('booking-config')

Section 2 — Room Types:
  List of rooms from bookingConfig.rooms array.
  Each room: name (text), type (text), capacity (number) — inline edit row
  "Add Room" → appends new empty row
  "Delete" per row → removes from array
  Save all → PATCH bookingConfig.rooms array → revalidateTag('booking-config')

Note: this is how staff update the room list shown on the /facilities/rooms public page.

---

LEAGUES CONFIG ---

PAGE: app/(admin)/content/leagues-config/page.tsx
Fetch leaguesConfig singleton from Sanity.

Display: table of all 18 leagues.
Columns: League Name | Sport | Format | Frequency | Dates | Active | Actions

Each row is editable inline or via expand:
  name, sport, format, frequency, approximateDates, description, isActive (toggle)

"Save [League Name]" per row → PATCH leaguesConfig.leagues[index] → revalidateTag('leagues')

"Toggle Active" per row:
  isActive: true → show green "Active" badge
  isActive: false → show grey "Inactive" badge
  Toggle → PATCH single league's isActive field

Note: No add/delete for leagues — all 18 are fixed. Only edit existing entries.
If a league is not running this year, toggle isActive to false.

--- ADD TO ADMIN SIDEBAR ---

Under Content group, add:
  Booking Config → /admin/content/booking-config
  Leagues → /admin/content/leagues-config

--- API ROUTES ---

app/api/admin/content/booking-config/route.ts
PATCH: update bookingConfig fields → sanityPatch + revalidateTag('booking-config')
All routes: requireAdminSession() guard.

app/api/admin/content/leagues-config/route.ts
PATCH: update leaguesConfig.leagues array or single league → sanityPatch + revalidateTag('leagues')
```

---

## ADMIN-P2 — Committee Members + Milestones + Food Stalls + Membership Types

```
/build

Task ADMIN-P2 — Committee Members, Milestones, Food Stalls, Membership Types.

--- COMMITTEE MEMBERS ---

PAGE: app/(admin)/content/committee/page.tsx
Fetch all committeeMember documents from Sanity.

Table columns: Name | Designation | Role | Order | Actions
Actions: Edit | Delete (with confirm)

Role filter pills: All | Founder Members | Promoter Members | Office Bearers | Governing Council

"Add Member" button → opens slide-in panel or navigates to /admin/content/committee/new

PAGE: app/(admin)/content/committee/[id]/page.tsx  (also handles /new via empty state)
Edit form:
  name (text)*
  designation (text)* — e.g. "President", "Secretary"
  role (select)* — founderMember | promoterMember | officeBearer | governingCouncil
  bio (textarea)
  order (number) — determines display order on /about/team
  photo — show current (urlFor), upload new via Cloudinary

Save → sanityPatch (existing) or sanityCreate (new) → revalidateTag('committee')
Delete → sanityDelete → revalidateTag('committee') → redirect to list

---

MILESTONES ---

PAGE: app/(admin)/content/milestones/page.tsx
Fetch all milestone documents from Sanity, sorted by year desc.

Table columns: Year | Title | Description preview | Actions
Actions: Edit | Delete

"Add Milestone" → /admin/content/milestones/new

PAGE: app/(admin)/content/milestones/[id]/page.tsx
Edit form:
  year (number)* — e.g. 1994
  title (text)* — e.g. "GSC Founded"
  description (textarea)*
  image (optional) — Cloudinary upload

Save → sanityPatch/sanityCreate → revalidateTag('milestones')
Delete → sanityDelete → revalidateTag('milestones')

---

FOOD STALLS ---

PAGE: app/(admin)/content/food-stalls/page.tsx
Fetch all foodStall documents from Sanity (stalls inside Food Court).

Table columns: Name | Cuisine Type | Veg/Non-Veg | Order | Actions
Actions: Edit | Delete

"Add Stall" → /admin/content/food-stalls/new

PAGE: app/(admin)/content/food-stalls/[id]/page.tsx
Edit form:
  name (text)*
  description (textarea)
  cuisineType (text)* — e.g. "South Indian", "Chinese"
  isVeg (toggle) — Veg / Non-Veg badge
  order (number)
  image — Cloudinary upload

Save → sanityPatch/sanityCreate → revalidateTag('dining')
Delete → sanityDelete → revalidateTag('dining')

Note: Food stalls are displayed on the /facilities/dining/food-court public page.
Editing a food stall triggers revalidateTag('dining') same as dining venues.

---

MEMBERSHIP TYPES ---

PAGE: app/(admin)/content/membership-types/page.tsx
Fetch all 5 membershipType documents from Sanity.

Table columns: Type | Title | Active | Order | Actions
Note: "Active" here means the type is configured, not enrollment open/closed.
Enrollment toggle is controlled by membershipConfig.enrollmentOpen (in ADMIN-07).

Actions: Edit only — no delete, no create (5 types are fixed)

PAGE: app/(admin)/content/membership-types/[type]/page.tsx
Edit form for each membership type:
  title (text)*
  tagline (text)
  eligibility (textarea)* — rendered as PortableText on public site
  benefits (textarea)* — rendered as PortableText on public site
  feeStructure (textarea) — optional, display or hide per policy
  isActive (toggle) — whether this type appears on the public site
  order (number)

Special field for 'yearly' type only:
  eligibilityNote (text) — "Available to children and parents of Life Members..."
  Show this field only when type === 'yearly'

Save → sanityPatch → revalidateTag('membership')

--- ADD TO ADMIN SIDEBAR ---

Under Content group, add:
  Committee → /admin/content/committee
  Milestones → /admin/content/milestones
  Food Stalls → /admin/content/food-stalls
  Membership Types → /admin/content/membership-types

--- API ROUTES (all with requireAdminSession) ---

app/api/admin/content/committee/route.ts
POST: create committee member → sanityCreate + revalidateTag('committee')

app/api/admin/content/committee/[id]/route.ts
PATCH: update → sanityPatch + revalidateTag('committee')
DELETE: delete → sanityDelete + revalidateTag('committee')

app/api/admin/content/milestones/route.ts
POST: create milestone → sanityCreate + revalidateTag('milestones')

app/api/admin/content/milestones/[id]/route.ts
PATCH: update → sanityPatch + revalidateTag('milestones')
DELETE: delete → sanityDelete + revalidateTag('milestones')

app/api/admin/content/food-stalls/route.ts
POST: create stall → sanityCreate + revalidateTag('dining')

app/api/admin/content/food-stalls/[id]/route.ts
PATCH: update → sanityPatch + revalidateTag('dining')
DELETE: delete → sanityDelete + revalidateTag('dining')

app/api/admin/content/membership-types/[type]/route.ts
PATCH: update membership type → sanityPatch + revalidateTag('membership')
```

---

## ADMIN-P3 — Partnership Opportunities + Team Spirit + Annual Reports + Legal Pages

```
/build

Task ADMIN-P3 — Partnership Opportunities, Team Spirit, Annual Reports, Legal Pages.

--- PARTNERSHIP OPPORTUNITIES ---

PAGE: app/(admin)/content/partnerships/page.tsx
Fetch all partnershipOpportunity documents from Sanity.

Table columns: Title | Reach Stats | Highlighted | Order | Actions
isHighlighted = shown with visual emphasis on the /partners public page.
Actions: Edit | Delete

"Add Opportunity" → /admin/content/partnerships/new

PAGE: app/(admin)/content/partnerships/[id]/page.tsx
Edit form:
  title (text)* — e.g. "Title Sponsor", "Event Partner"
  description (textarea)*
  reachStats (text)* — e.g. "40,000+ member network"
  benefits (array of text) — bullet points shown on /partners
    Allow adding/removing benefit lines dynamically
  isHighlighted (toggle) — featured card treatment
  order (number)

Save → sanityPatch/sanityCreate → revalidateTag('partners')
Delete → sanityDelete → revalidateTag('partners')

---

TEAM SPIRIT EDITIONS ---

PAGE: app/(admin)/content/team-spirit/page.tsx
Fetch all teamSpiritEdition documents from Sanity, sorted by year desc.

Table columns: Edition Name | Edition Type | Year | PDF uploaded | Actions
PDF uploaded: green checkmark if pdfFile set, grey dash if not.
Actions: Edit | Delete

"Add Edition" → /admin/content/team-spirit/new
(Used when a new Summer/Diwali/New Year edition is published)

PAGE: app/(admin)/content/team-spirit/[id]/page.tsx
Edit form:
  editionName (text)* — e.g. "Summer 2025"
  edition (select)* — Summer | Diwali | NewYear
  year (number)*
  coverImage — Cloudinary upload*
  description (text)
  publicationDate (date picker)
  pdfFile — Cloudinary file upload (PDF)
    Show "Upload PDF" button → on upload stores Cloudinary URL
    If PDF already uploaded: show filename + "Replace" and "Remove" buttons
  adSpecs (textarea) — ad sizes, rates, specifications shown on /partners/team-spirit

Save → sanityPatch/sanityCreate → revalidateTag('team-spirit')
Delete → sanityDelete → revalidateTag('team-spirit')

---

ANNUAL REPORTS ---

PAGE: app/(admin)/content/annual-reports/page.tsx
Fetch all annualReport documents from Sanity.

Table columns: Title | Year | PDF uploaded | Published Date | Actions
Actions: Edit | Delete

"Add Report" → /admin/content/annual-reports/new
(Used when a new annual report is published)

PAGE: app/(admin)/content/annual-reports/[id]/page.tsx
Edit form:
  title (text)* — e.g. "Annual Report 2024-25"
  year (text)* — e.g. "2024-25"
  coverImage — Cloudinary upload
  pdfFile — Cloudinary file upload (PDF)*
    Same pattern as Team Spirit — Upload/Replace/Remove buttons
  publishedDate (date picker)*

Save → sanityPatch/sanityCreate → revalidateTag('annual-reports')
Delete → sanityDelete → revalidateTag('annual-reports')

---

LEGAL PAGES ---

PAGE: app/(admin)/content/legal/page.tsx
Fetch all legalPage documents from Sanity.

List of 3 pages (fixed — no create/delete):
  Privacy Policy    → edit link
  Terms of Use      → edit link
  Cancellation Policy → edit link

Table columns: Title | Slug | Last Updated | Actions

PAGE: app/(admin)/content/legal/[slug]/page.tsx
Edit form:
  title (text)*
  lastUpdated (date — auto-set to today on save)
  content (textarea)*
    Note: This is portableText in Sanity. For the admin panel, use a large textarea.
    Content is treated as plain text that will be rendered by PortableTextRenderer.
    Note in UI: "Format with blank lines between paragraphs. Basic markdown-style structure."
    [FUTURE] Replace with Tiptap rich text editor for proper portableText editing.
  metaTitle (text)
  metaDescription (text)

Save → sanityPatch → revalidateTag('legal')
No delete (legal pages are permanent — 3 fixed documents).

--- ADD TO ADMIN SIDEBAR ---

Final complete sidebar structure after all patches:

OVERVIEW
  Dashboard → /admin/dashboard

CONTENT
  Sports → /admin/content/sports
  Events → /admin/content/events
  Achievements → /admin/content/achievements
  Committee → /admin/content/committee
  Milestones → /admin/content/milestones
  Dining Venues → /admin/content/dining
  Food Stalls → /admin/content/food-stalls
  Banquet Halls → /admin/content/banquets
  Membership Types → /admin/content/membership-types
  Partnership Opportunities → /admin/content/partnerships
  Team Spirit → /admin/content/team-spirit
  Annual Reports → /admin/content/annual-reports
  Downloads → /admin/content/downloads
  Legal Pages → /admin/content/legal
  ─────────────────
  CONFIG
  Booking Config → /admin/content/booking-config
  Leagues → /admin/content/leagues-config
  Membership Config → /admin/content/membership  (from ADMIN-07)
  Site Settings → /admin/content/settings  (from ADMIN-07)

SUBMISSIONS (with unread count badges)
  Bookings → /admin/submissions/bookings
  Memberships → /admin/submissions/memberships
  Contacts → /admin/submissions/contacts
  Partners → /admin/submissions/partners
  Achievement Submissions → /admin/submissions/achievements

USERS (admin role only)
  Manage Users → /admin/users

--- API ROUTES (all with requireAdminSession) ---

app/api/admin/content/partnerships/route.ts
POST: create → sanityCreate + revalidateTag('partners')

app/api/admin/content/partnerships/[id]/route.ts
PATCH: update → sanityPatch + revalidateTag('partners')
DELETE: delete → sanityDelete + revalidateTag('partners')

app/api/admin/content/team-spirit/route.ts
POST: create → sanityCreate + revalidateTag('team-spirit')

app/api/admin/content/team-spirit/[id]/route.ts
PATCH: update → sanityPatch + revalidateTag('team-spirit')
DELETE: delete → sanityDelete + revalidateTag('team-spirit')

app/api/admin/content/annual-reports/route.ts
POST: create → sanityCreate + revalidateTag('annual-reports')

app/api/admin/content/annual-reports/[id]/route.ts
PATCH: update → sanityPatch + revalidateTag('annual-reports')
DELETE: delete → sanityDelete + revalidateTag('annual-reports')

app/api/admin/content/legal/[slug]/route.ts
PATCH: update → sanityPatch + revalidateTag('legal')
No POST or DELETE — 3 fixed documents only.
```

---

## Complete Admin Coverage Verification

After ADMIN-01 through ADMIN-09 + ADMIN-P1 through ADMIN-P3,
every Sanity document type has an admin page:

```
SINGLETONS
  Site Config           ✓ ADMIN-07  /admin/content/settings
  Membership Config     ✓ ADMIN-07  /admin/content/membership
  Booking Config        ✓ ADMIN-P1  /admin/content/booking-config
  Leagues Config        ✓ ADMIN-P1  /admin/content/leagues-config

DOCUMENTS
  Sport                 ✓ ADMIN-05  /admin/content/sports
  Committee Member      ✓ ADMIN-P2  /admin/content/committee
  Milestone             ✓ ADMIN-P2  /admin/content/milestones
  Achievement           ✓ ADMIN-06  /admin/content/achievements
  Event                 ✓ ADMIN-05  /admin/content/events
  Banquet Hall          ✓ ADMIN-06  /admin/content/banquets
  Dining Venue          ✓ ADMIN-06  /admin/content/dining
  Food Stall            ✓ ADMIN-P2  /admin/content/food-stalls
  Membership Type       ✓ ADMIN-P2  /admin/content/membership-types
  Partnership Opp.      ✓ ADMIN-P3  /admin/content/partnerships
  Team Spirit Edition   ✓ ADMIN-P3  /admin/content/team-spirit
  Annual Report         ✓ ADMIN-P3  /admin/content/annual-reports
  Download              ✓ ADMIN-07  /admin/content/downloads
  Legal Page            ✓ ADMIN-P3  /admin/content/legal

DRIZZLE SUBMISSIONS
  Booking Inquiries     ✓ ADMIN-04  /admin/submissions/bookings
  Membership Inquiries  ✓ ADMIN-04  /admin/submissions/memberships
  Contact Inquiries     ✓ ADMIN-04  /admin/submissions/contacts
  Partner Inquiries     ✓ ADMIN-04  /admin/submissions/partners
  Achievement Submissions ✓ ADMIN-04 /admin/submissions/achievements

Total: 17 Sanity types + 5 Drizzle tables = 22 managed entities. All covered.
```
