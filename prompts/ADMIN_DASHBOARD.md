# GSC — Admin Dashboard Prompts
# Full admin panel: Better Auth + Sanity content management + Drizzle submissions.
# Run these prompts in Claude Code AFTER Phase 2 is complete.
# Admin is a separate phase — do not mix with public site tasks.
#
# STACK:
# Auth:     Better Auth (email + password, multiple accounts)
# DB:       Same Neon instance — Better Auth adds its own tables
# Content:  Reads/writes Sanity via server client (SANITY_API_TOKEN)
# Inbox:    Reads/writes Drizzle tables (form submissions)
# Route:    /admin/* — protected by Better Auth middleware
# UI:       Same Tailwind v4 design system, but admin-specific dark theme always

---

## ADMIN-01 — Better Auth Setup + DB Migration

```
/build

Task ADMIN-01 — Better Auth Setup.

Install and configure Better Auth with Drizzle adapter on the existing Neon database.
Reference: https://better-auth.com/docs/installation

--- INSTALL ---

pnpm add better-auth

--- ENV VARS TO ADD TO .env.local AND .env.example ---

BETTER_AUTH_SECRET=          # generate: openssl rand -base64 32
BETTER_AUTH_URL=https://gsc.in  # production URL

--- FILES TO CREATE ---

1. lib/auth/auth.ts  — Better Auth server instance

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/lib/db'
import { admin } from 'better-auth/plugins'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,  // internal staff — no email verification needed
  },
  plugins: [
    admin(),  // adds role field to user, allows admin to manage other users
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,    // 7 days
    updateAge: 60 * 60 * 24,         // refresh if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,                // 5 minute cache
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'staff',
        input: false,               // only set by admin, not by user on signup
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user

2. lib/auth/auth-client.ts — Better Auth React client

import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  plugins: [adminClient()],
})

export const { signIn, signOut, useSession } = authClient

3. app/api/auth/[...all]/route.ts — Better Auth API handler

import { auth } from '@/lib/auth/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { POST, GET } = toNextJsHandler(auth)

4. Run Better Auth migration to create auth tables in Neon:

pnpm dlx @better-auth/cli generate --output lib/auth/schema.ts

This generates the Drizzle schema for Better Auth tables (user, session, account, verification).
Add the generated schema to lib/db/schema.ts imports so Drizzle is aware of all tables.
Then run: pnpm db:push  (dev only — for production use db:generate + db:migrate)

5. Create the first admin user via a one-time seed script:
   scripts/create-admin.ts

import { auth } from '@/lib/auth/auth'

async function createAdmin() {
  const user = await auth.api.createUser({
    body: {
      name: 'Sahil Jadhav',
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
      role: 'admin',
    },
  })
  console.log('Admin created:', user.user.email)
}

createAdmin()

Add to package.json: "create:admin": "tsx scripts/create-admin.ts"
Add to .env.local:
  ADMIN_EMAIL=     # your email
  ADMIN_PASSWORD=  # strong password

Run once: pnpm create:admin

Done when: pnpm build passes, /api/auth/sign-in route responds, admin user exists in DB.
```

---

## ADMIN-02 — Admin Route Structure + Middleware

```
/build

Task ADMIN-02 — Admin Route Protection + Layout.

Create the protected /admin route group with middleware and layout.

--- MIDDLEWARE ---

Create proxy.ts at project root:

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

const PUBLIC_PATHS = ['/', '/about', '/sports', '/events', '/facilities',
  '/booking', '/membership', '/achievements', '/partners', '/contact',
  '/downloads', '/legal', '/studio']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow /admin/login through
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check session
  const session = await getSession(request)
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

--- SESSION HELPER ---

Create lib/auth/session.ts:

import { auth } from './auth'
import type { NextRequest } from 'next/server'

export async function getSession(request?: NextRequest) {
  const session = await auth.api.getSession({
    headers: request?.headers ?? new Headers(),
  })
  return session
}

export async function requireSession() {
  const session = await auth.api.getSession({
    headers: (await import('next/headers')).headers(),
  })
  if (!session) return null
  return session
}

--- FOLDER STRUCTURE ---

app/(admin)/
├── layout.tsx              Admin root layout — always dark, AdminNav sidebar
├── login/
│   └── page.tsx            Login page — not protected
├── admin/                  Redirects to /admin/dashboard
├── dashboard/
│   └── page.tsx            Overview with stat cards
├── content/
│   ├── layout.tsx          Content section header
│   ├── sports/
│   │   ├── page.tsx        Sports list
│   │   └── [slug]/
│   │       └── page.tsx    Edit sport
│   ├── events/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── achievements/
│   │   └── page.tsx        Approve/reject submissions, view approved
│   ├── dining/
│   │   └── page.tsx
│   ├── banquets/
│   │   └── page.tsx
│   ├── membership/
│   │   └── page.tsx        Toggle enrollment open/closed
│   ├── downloads/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx        siteConfig, emergency contacts, hero video URL
├── submissions/
│   ├── layout.tsx
│   ├── bookings/page.tsx
│   ├── memberships/page.tsx
│   ├── contacts/page.tsx
│   ├── partners/page.tsx
│   └── achievements/page.tsx   Pending achievement submissions
└── users/
    └── page.tsx            Manage admin users (admin role only)

--- ADMIN LAYOUT ---

Create app/(admin)/layout.tsx:

- Always dark — no theme toggle in admin
- Left sidebar: AdminSidebar component
- Top bar: AdminTopBar with user name, sign out button
- Main content area: right of sidebar
- Sidebar sections:
  Overview → /admin/dashboard
  Content → collapsible group
    Sports, Events, Achievements, Dining, Banquets, Membership, Downloads, Settings
  Submissions → collapsible group (show unread count badges)
    Bookings, Memberships, Contacts, Partners, Achievement Submissions
  Users → /admin/users (admin role only — hide for staff role)

Sidebar uses Next.js Link with usePathname() for active state.
Active item: bg-[--color-primary]/10 text-[--color-primary] border-l-2 border-[--color-primary]

--- LOGIN PAGE ---

Create app/(admin)/login/page.tsx:

- Centered card layout, dark background
- GSC logo text + "Admin Panel" label
- Email + password fields (React Hook Form + Zod)
- "Sign In" button
- On submit: authClient.signIn.email({ email, password })
  On success: router.push('/admin/dashboard')
  On error: show "Invalid email or password"
- No "Forgot password" (internal tool — reset via script)

Done when: /admin redirects to /admin/login when not signed in, login works, sidebar renders.
```

---

## ADMIN-03 — Dashboard Overview Page

```
/build

Task ADMIN-03 — Admin Dashboard Overview.

Build app/(admin)/dashboard/page.tsx.
This is a Server Component that fetches both Sanity and Drizzle data.

STAT CARDS — 2 rows of 4:

Row 1 — Submissions inbox (from Drizzle, count where status = 'pending'):
- Pending Bookings      → db count bookingInquiries where status = 'pending'
- Pending Memberships   → db count membershipInquiries where status = 'pending'
- Pending Contacts      → db count contactInquiries where status = 'pending'
- Pending Partners      → db count partnerInquiries where status = 'pending'

Row 2 — Content overview (from Sanity, count documents):
- Total Sports          → count *[_type == 'sport']
- Active Events         → count *[_type == 'event' && status == 'upcoming']
- Achievements (approved) → count *[_type == 'achievement' && isApproved == true]
- Pending Achievements  → db count achievementSubmissions where status = 'pending'

Each stat card:
- Icon (lucide-react)
- Number (large, animated on mount with GSAP)
- Label
- If pending count > 0: number shows in accent-gold color + "New" pill
- Click → navigates to relevant admin section

RECENT ACTIVITY — below stat cards:
3-column grid:
- Latest 5 bookings (from Drizzle, ordered by createdAt desc)
- Latest 5 contacts (from Drizzle, ordered by createdAt desc)
- Latest 3 events (from Sanity, ordered by startDate desc)

Each item: name/title, date, status badge, "View" link.

QUICK ACTIONS — bottom bar:
- "Add New Event" → /admin/content/events/new
- "Toggle Membership Enrollment" → /admin/content/membership
- "Approve Achievements" → /admin/submissions/achievements
- "View All Submissions" → /admin/submissions/bookings
```

---

## ADMIN-04 — Submissions Dashboard (Drizzle)

```
/build

Task ADMIN-04 — Submissions Management Pages.

Build all 5 submission pages. All read from Drizzle and update status in place.

SHARED PATTERN for all submission pages:

1. Server Component fetches data from Drizzle (sorted by createdAt desc)
2. Client component handles status updates via API route
3. Filter bar: All | Pending | Reviewed | Responded/Confirmed | Closed/Rejected
4. Table layout (desktop) / card list (mobile)
5. Each row: key fields, status badge, timestamp, action buttons

--- BUILD EACH PAGE ---

PAGE 1: app/(admin)/submissions/bookings/page.tsx
Table columns: Name | Phone | Booking Type | Date | Status | Created At | Actions

Actions:
- "Mark Reviewed" → updates status to 'reviewed'
- "Confirm" → updates status to 'confirmed', opens dialog to add notes
- "Reject" → updates status to 'rejected'
- "View Details" → expands row or opens modal with all fields

Detail view shows: all form fields submitted, internal notes textarea (save updates DB notes field)

---

PAGE 2: app/(admin)/submissions/memberships/page.tsx
Table columns: Name | Email | Membership Type | Status | Created At | Actions

Actions: Mark Reviewed | Mark Contacted | Close

---

PAGE 3: app/(admin)/submissions/contacts/page.tsx
Table columns: Name | Email | Subject | Status | Created At | Actions

Actions: Mark Reviewed | Mark Responded | Close

---

PAGE 4: app/(admin)/submissions/partners/page.tsx
Table columns: Company | Contact | Partnership Type | Status | Created At | Actions

Actions: Mark Reviewing | Negotiating | Active | Declined

---

PAGE 5: app/(admin)/submissions/achievements/page.tsx
This page is special — approving creates a Sanity document.

Table columns: Member Name | Sport | Achievement | Level | Year | Photo | Status | Actions

Actions on each row:
- "Approve" → calls /api/admin/achievements/approve
  This API route:
  1. Reads the achievementSubmission from Drizzle by ID
  2. Creates a Sanity achievement document via serverClient.create():
     { _type: 'achievement', title, sport, level, type: 'Individual', year, memberName, image, isApproved: true }
     For image: if imageUrl is a Cloudinary URL, use it as external reference
  3. Updates achievementSubmission status to 'approved' in Drizzle
  4. Returns { success: true, sanityId }
- "Reject" → updates status to 'rejected' in Drizzle only, no Sanity action
- "View Photo" → opens image in lightbox (shadcn Dialog)

--- SHARED API ROUTES ---

Create these API routes (all protected by session check):

app/api/admin/submissions/[table]/[id]/status/route.ts
PATCH: { status, notes? } → update status + notes in relevant Drizzle table
Validates session. Returns { success: true }.

app/api/admin/achievements/approve/route.ts
POST: { submissionId } → approve flow (see above)
Validates session. Returns { success: true, sanityId }.
```

---

## ADMIN-05 — Content Management: Sports + Events

```
/build

Task ADMIN-05 — Content Management: Sports + Events.

Build the sports and events content management pages.
All writes go directly to Sanity via serverClient using SANITY_API_TOKEN.

Key principle: every Sanity write must also call revalidateTag() for the relevant cache tag
so the public site updates immediately.

--- CREATE SANITY WRITE HELPER ---

Create lib/sanity/write.ts:

import { serverClient } from './client'
import { revalidateTag } from 'next/cache'

export async function sanityPatch(id: string, patch: Record<string, unknown>, tag: string) {
  await serverClient.patch(id).set(patch).commit()
  revalidateTag(tag)
}

export async function sanityCreate(doc: Record<string, unknown>, tag: string) {
  const result = await serverClient.create(doc)
  revalidateTag(tag)
  return result
}

export async function sanityDelete(id: string, tag: string) {
  await serverClient.delete(id)
  revalidateTag(tag)
}

--- SPORTS PAGES ---

PAGE: app/(admin)/content/sports/page.tsx
- Server Component: fetch all sports from Sanity (getSports())
- Table: Sport Name | Category | Has Coaching | Order | Actions
- Actions: Edit → /admin/content/sports/[slug] | Toggle coaching on/off (PATCH via API)
- Reorder: drag handle (optional) or order number input

PAGE: app/(admin)/content/sports/[slug]/page.tsx
- Server Component: fetch sport by slug
- Edit form (React Hook Form) pre-filled with all sport fields:
  name, category, shortDescription, hasCoaching, coachName, coachingSchedule,
  coachingLevel, externalRegistrationUrl, threeObjectType, schedule (array: day/open/close)
- Rich text fields (fullDescription, facilityDetails, coachingInfo):
  Use a simple <textarea> for now — not a full rich text editor
  Note: [FUTURE] replace with a proper rich text editor (Tiptap or Plate)
  Write content as plain text portableText compatible block
- Image upload: show current heroImage (urlFor), allow uploading new via Cloudinary
- Save button → POST /api/admin/content/sports/[slug]
  API: serverClient.patch(id).set(formData).commit() → revalidateTag('sports')

--- EVENTS PAGES ---

PAGE: app/(admin)/content/events/page.tsx
- Server Component: fetch all events (getEvents())
- Table: Title | Type | Status | Start Date | Actions
- Filter: All | Upcoming | Ongoing | Past
- Actions: Edit | Delete (with confirm dialog) | Toggle featured

PAGE: app/(admin)/content/events/new/page.tsx
- Create event form:
  title, slug (auto-generated from title), type, status, startDate, endDate,
  venue, description (textarea), registrationUrl, isFeatured
- On save: sanityCreate() → revalidateTag('events') → redirect to events list

PAGE: app/(admin)/content/events/[slug]/page.tsx
- Edit form same fields as create
- Save → sanityPatch() → revalidateTag('events')
- Delete button (with confirm) → sanityDelete() → revalidateTag('events') → redirect

--- API ROUTES (all validate session) ---

app/api/admin/content/sports/[slug]/route.ts
PATCH: update sport fields → sanityPatch + revalidateTag('sports')

app/api/admin/content/events/route.ts
POST: create event → sanityCreate + revalidateTag('events')

app/api/admin/content/events/[slug]/route.ts
PATCH: update event → sanityPatch + revalidateTag('events')
DELETE: delete event → sanityDelete + revalidateTag('events')
```

---

## ADMIN-06 — Content Management: Achievements + Dining + Banquets

```
/build

Task ADMIN-06 — Content Management: Achievements, Dining, Banquets.

--- ACHIEVEMENTS ---

PAGE: app/(admin)/content/achievements/page.tsx
Two tabs: Approved | Pending Submissions

Approved tab:
- Grid of approved achievement images from Sanity
- Each: image thumbnail, sport, level, year, member name, delete button
- Delete → sanityDelete + revalidateTag('achievements')
- Upload new achievement: simple form (not from submission) — name, sport, level, year, Cloudinary image upload
  Useful for adding historical achievements that weren't submitted via the form

Pending tab:
- Redirects to /admin/submissions/achievements
  (or renders the same content inline — your choice)

--- DINING ---

PAGE: app/(admin)/content/dining/page.tsx
- List of 6 dining venues
- Each: name, type, hasBar badge, "Edit" link
- No create/delete — venues are fixed (6 only)

PAGE: app/(admin)/content/dining/[slug]/page.tsx
- Edit form: name, tagline, type, cuisineType, description (textarea),
  openingHours (array: day/hours), seatingCapacity, reservationInfo
- For Bleu Restobar: show ageRestriction field (read-only display: "25+")
- PDF uploads: menuPdf, barMenuPdf (Bleu only) — Cloudinary file upload
  On upload: store URL in Sanity diningVenue.menuPdf field
- Image gallery: show existing, upload new via Cloudinary
- Save → sanityPatch + revalidateTag('dining')

--- BANQUETS ---

PAGE: app/(admin)/content/banquets/page.tsx
- List of 3 halls
- Each: name, capacity (show [PENDING] if null), "Edit" link

PAGE: app/(admin)/content/banquets/[slug]/page.tsx
- Edit form: name, tagline, capacity (number), setupOptions (multi-select or tag input),
  description (textarea), amenities (textarea)
- Image gallery management: show existing, upload new via Cloudinary
- Save → sanityPatch + revalidateTag('banquets')
```

---

## ADMIN-07 — Content Management: Membership + Downloads + Settings

```
/build

Task ADMIN-07 — Membership, Downloads, Site Settings.

--- MEMBERSHIP ---

PAGE: app/(admin)/content/membership/page.tsx
Fetch membershipConfig from Sanity.

Section 1 — Enrollment Toggle:
Large prominent card:
- Current status: "Enrollment OPEN" (green) or "Enrollment CLOSED" (red/amber)
- Toggle button: "Open Enrollment" or "Close Enrollment"
- On click: PATCH membershipConfig.enrollmentOpen → revalidateTag('membership-config')
- Confirmation dialog before toggling (this affects the public site immediately)
- Enrollment notice textarea: edit the message shown when closed
  Save → PATCH membershipConfig.enrollmentNotice

Section 2 — Membership Submissions:
Mini table of latest 10 membership inquiries (from Drizzle).
"View All" → /admin/submissions/memberships

Section 3 — Affiliated Clubs:
List from membershipConfig.affiliatedClubs with edit/delete per club.
"Add Club" button → inline form to add a new affiliated club.

--- DOWNLOADS ---

PAGE: app/(admin)/content/downloads/page.tsx
- Table: Title | Category | Date | Active | Download | Actions
- Filter: All | Notices | Circulars | Forms | Reports
- Actions: Edit title/category | Toggle active (isActive field) | Delete
- "Add Download" → slide-in panel or modal:
  title, category (select), file upload (Cloudinary), publishedDate
  Save → sanityCreate + revalidateTag('downloads')

--- SITE SETTINGS ---

PAGE: app/(admin)/content/settings/page.tsx
Edit the siteConfig singleton. Sections:

Section 1 — Basic Info:
siteName, tagline, phone, phone2, email, bookingEmail, address

Section 2 — Emergency Contacts (highlighted — marked as important):
emergencyPhone, emergencyPhone2
Note text: "These appear in the footer of every public page."

Section 3 — Hero Video:
heroVideoUrl (text input — Cloudinary URL or external URL)
Current value shown. "Update" saves to siteConfig.heroVideoUrl.
Note: "Update triggers ISR revalidation — public site reflects within 60 seconds."

Section 4 — Social Links:
instagram, facebook, youtube, twitter — input fields per platform

Section 5 — Corporate Partners:
List of current partners (name + logo).
"Add Partner" → name + logo upload (Cloudinary).
Delete per partner.

Save all sections: PATCH siteConfig → revalidateTag('site-config')
Each section has its own "Save" button — don't make staff save everything at once.
```

---

## ADMIN-08 — User Management

```
/build

Task ADMIN-08 — Admin User Management.

Build app/(admin)/users/page.tsx
Only visible to users with role = 'admin'. Staff role cannot access this page.

Server Component: fetch all users via auth.api.listUsers()

Table columns:
Name | Email | Role | Created | Last Sign In | Actions

Role badges: "admin" (primary blue) | "staff" (outline)

Actions per user:
- "Change Role" → toggle between admin/staff via auth.api.updateUserRole()
- "Reset Password" → sends a password reset email (or shows temporary password — see note)
  Use Better Auth admin plugin: auth.api.setUserPassword()
  For GSC's internal use, simpler to generate a temp password and show it in a dialog
- "Revoke Sessions" → auth.api.revokeUserSessions({ userId })
- "Delete User" → auth.api.deleteUser({ userId }) + confirm dialog
  Cannot delete yourself

"Add User" button → modal form:
  Name, Email, Password, Role (select: admin/staff)
  On submit: auth.api.createUser({ name, email, password, role })
  New user can sign in immediately — no email verification

Note: The currently signed-in user cannot delete or demote themselves.
Check session.user.id !== targetUser.id before showing destructive actions.

Done when: admin can create, view, change role, and delete other users.
Staff users cannot see /admin/users (redirect to /admin/dashboard with toast).
```

---

## ADMIN-09 — Protect All Admin API Routes + Final Wiring

```
/build

Task ADMIN-09 — Security hardening + final wiring.

1. Create lib/auth/require-admin-session.ts — shared guard for all admin API routes:

import { auth } from './auth'
import { headers } from 'next/headers'

export async function requireAdminSession() {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) {
    return { session: null, error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { session, error: null }
}

Usage in every admin API route:
const { session, error } = await requireAdminSession()
if (error) return error
// ... proceed with the operation

2. Audit every file in app/api/admin/** — confirm each route calls requireAdminSession()
   at the top before any DB or Sanity operation.

3. Add admin route to .claudeignore:
   app/(admin)/        should NOT be in .claudeignore — Claude Code should be able to read it

4. Update proxy.ts:
   Add rate limiting on /admin/login route:
   Track failed attempts — after 5 failed logins from same IP, return 429 for 15 minutes.
   Use a simple in-memory Map (sufficient for single-instance Vercel deployment).
   Or use Upstash Rate Limiting if available — but don't add packages just for this.

5. Add to next.config.ts:
   headers() config — add security headers to /admin/* routes:
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin

6. Add admin link to CLAUDE.md environment variables:
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

7. Update INSTALL.md — add Better Auth to install steps:
pnpm add better-auth
pnpm dlx @better-auth/cli generate --output lib/auth/schema.ts

8. Test full flow:
   - Sign in at /admin/login → dashboard loads
   - Create a staff user → they can sign in but cannot see /admin/users
   - Update a sport in admin → verify /sports/[slug] reflects the change on public site
   - Approve an achievement → verify Sanity achievement document is created
   - Sign out → redirected to /admin/login

Done when all API routes are protected, admin panel is fully functional.
```

---

## Route Summary

```
PUBLIC SITE (no auth)
/                   Homepage
/sports/**          Sports pages
/events/**          Events
/facilities/**      Facilities
/booking            Booking form
/membership/**      Membership
/achievements       Achievements
/partners/**        Partners
/contact            Contact
/downloads          Downloads
/legal/**           Legal

STUDIO (Sanity auth — separate)
/studio             Sanity Studio — Sanity handles its own auth

ADMIN (Better Auth)
/admin/login        Public — login form
/admin/dashboard    Protected — overview
/admin/content/**   Protected — Sanity content management
/admin/submissions/**  Protected — Drizzle form submissions
/admin/users        Protected (admin role only) — user management

API
/api/auth/**        Better Auth handler (public — handles auth itself)
/api/admin/**       Protected — all require valid Better Auth session
/api/booking        Public — form submission
/api/membership     Public — form submission
/api/contact        Public — form submission
/api/partner        Public — form submission
/api/achievement    Public — form submission
/api/revalidate     Sanity webhook — verified by HMAC signature
```

---

## DB Tables After Admin Setup

```
EXISTING (Drizzle — form submissions)
booking_inquiries
membership_inquiries
contact_inquiries
partner_inquiries
achievement_submissions

ADDED BY BETTER AUTH (Drizzle — auth)
user              name, email, password_hash, role, created_at, updated_at
session           token, user_id, expires_at, ip, user_agent
account           provider, account_id, user_id (for OAuth — not used here)
verification      identifier, value, expires_at (for email verification — disabled)
```

---

## Notes on Sanity Studio vs Admin Panel

Both /studio and /admin write to Sanity. They stay in sync automatically:
- Admin writes → serverClient.patch() → Sanity stores it → Studio shows updated data
- Studio writes → Sanity stores it → Admin reads fresh from Sanity on next load

No conflict. They are two frontends to the same Sanity dataset.
The only consideration: ISR cache tags. Admin panel must call revalidateTag() after every Sanity write
so the public site reflects changes. Studio writes go through the Sanity webhook → /api/revalidate.
Admin writes skip the webhook — they call revalidateTag() directly in the API route.
