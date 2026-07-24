# GSC — Admin Dashboard: About Page
# Missing from ADMIN_DASHBOARD.md and ADMIN_DASHBOARD_PATCH.md.
# Run as ADMIN-P4 after completing ADMIN-P3.
# Covers: /about history content, bye-laws PDF upload — both managed via aboutPage singleton.

---

## ADMIN-P4 — About Page Content + Bye-Laws PDF

```
/build

Task ADMIN-P4 — About Page Content Management.

Build app/(admin)/content/about/page.tsx
Fetch aboutPage singleton from Sanity (getAboutPage()).

This page manages two things:
1. The History & Legacy section content shown on /about
2. The bye-laws PDF shown on /about/bye-laws

--- SECTION 1: HISTORY & LEGACY ---

Heading: "History & Legacy Content"
Subheading: "Shown in the History section on the public /about page."

Fields:
- historyText (large textarea, min-height 300px)
  Label: "History & Legacy Text"
  Helper: "Supports plain text. Use blank lines between paragraphs."
  Current value pre-filled from Sanity.
  Note in UI: "[FUTURE] Replace with rich text editor for full formatting support."

- historyImage (Cloudinary image upload)
  Label: "Historic Photo"
  Show current image preview (urlFor, aspect-video, rounded-xl).
  "Upload New Photo" button → Cloudinary unsigned upload.
  On upload: store Cloudinary URL → PATCH aboutPage.historyImage.

"Save History Content" button
On click: POST /api/admin/content/about with { historyText, historyImage }
  → server: sanityPatch('aboutPage', { historyText, historyImage }) + revalidateTag('about-page')
Success toast: "History content updated. Public /about page updated."

--- SECTION 2: BYE-LAWS PDF ---

Heading: "Bye-Laws Document"
Subheading: "PDF shown on /about/bye-laws. Members can download this."

Current state display:
  If byeLawsPdfUrl is set:
    - Show "Current file:" + truncated URL (last 40 chars)
    - Show "Last updated: [byeLawsUpdatedAt]" in Body S muted
    - "Preview PDF" button → opens URL in new tab
    - "Replace PDF" button → triggers upload
    - "Remove PDF" button → clears field (with confirm dialog: "This will show a placeholder on the public page.")

  If byeLawsPdfUrl is null:
    - Yellow warning card: "No bye-laws PDF uploaded. The public page shows a placeholder."
    - "Upload Bye-Laws PDF" button → triggers upload

Upload flow:
  - Accept: .pdf only
  - Upload to Cloudinary (unsigned preset — same as other file uploads)
  - On success: PATCH aboutPage.byeLawsPdfUrl + aboutPage.byeLawsUpdatedAt (today's date)
    → revalidateTag('about-page')
  - Success toast: "Bye-laws PDF updated. /about/bye-laws updated immediately."

Remove flow:
  - Confirm dialog: "This will remove the bye-laws PDF from the public page. Visitors will see a placeholder. Are you sure?"
  - On confirm: PATCH aboutPage.byeLawsPdfUrl = null + aboutPage.byeLawsUpdatedAt = null
    → revalidateTag('about-page')

--- ADD TO ADMIN SIDEBAR ---

In the Content group, add:
  About Page → /admin/content/about

Place it at the top of the Content group (since it's the homepage-adjacent content).

Final Content sidebar order:
  About Page → /admin/content/about        ← NEW
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
  Membership Config → /admin/content/membership
  Site Settings → /admin/content/settings

--- API ROUTE ---

app/api/admin/content/about/route.ts

import { requireAdminSession } from '@/lib/auth/require-admin-session'
import { sanityPatch } from '@/lib/sanity/write'

export async function PATCH(request: Request) {
  const { session, error } = await requireAdminSession()
  if (error) return error

  const body = await request.json()

  // Build patch object from only the fields provided
  const patch: Record<string, unknown> = {}
  if (body.historyText !== undefined) patch.historyText = body.historyText
  if (body.historyImage !== undefined) patch.historyImage = body.historyImage
  if (body.byeLawsPdfUrl !== undefined) patch.byeLawsPdfUrl = body.byeLawsPdfUrl
  if (body.byeLawsUpdatedAt !== undefined) patch.byeLawsUpdatedAt = body.byeLawsUpdatedAt

  await sanityPatch('aboutPage', patch, 'about-page')
  return Response.json({ success: true })
}

Note: Use 'aboutPage' as the document ID directly (singleton — ID matches type name).
```

---

## ADMIN-P4 Phase Tracker Entry

Add to CLAUDE.md Phase 4 tracker:

```
[ ] ADMIN-P4  About Page content editor + bye-laws PDF upload
```

Updated Phase 4 total: 13 tasks.
