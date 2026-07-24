# GSC — Phase 2 Prompts
# Ready-to-paste prompts for Claude Code. One prompt per task.
# All Phase 1A and 1B tasks must be complete before starting Phase 2.
# Task 2-15 (SEO) must be the final task in this phase.

---

## 2-01 — Facilities Hub

```
/build

Task 2-01 — Facilities Hub.

Build app/(site)/facilities/page.tsx. Read docs/spec/PAGES.md § Facilities Hub.

No Sanity fetch needed — this is a static navigation hub.

Sections:

1. PageHero — "World-Class Facilities" | data-theme="dark"

2. Quick Stats Bar — reuse StatsBar pattern
   3 stats: 3 Banquet Halls | 6 Dining Venues | 18 Guest Rooms
   AnimatedText on numbers

3. Category Grid — 8 large navigation cards, 4-col (lg) / 2-col (md) / 1-col (sm)
   Each card: icon (lucide-react), category name (Heading M), brief description (Body S), hover lift + arrow icon
   Cards:
   - Rooms → /facilities/rooms | "18 comfortable rooms for members and guests"
   - Banquets → /facilities/banquets | "3 premium event venues"
   - Dining → /facilities/dining | "6 restaurants and cafes"
   - Recreation → /facilities/recreation | "Kids zone, cards room, and more"
   - Sports Shop → /facilities/sports-shop | "Equipment and apparel"
   - Massage Chairs → /facilities/massage-chairs | "Relaxation area"
   - Library → /facilities/library | "Reading and reference"
   - Medical Cell → /facilities/medical-cell | "On-site medical support"

generateMetadata: "Facilities | Goregaon Sports Club"
```

---

## 2-02 — Rooms

```
/build

Task 2-02 — Rooms Page.

Build app/(site)/facilities/rooms/page.tsx. Read docs/spec/PAGES.md § Rooms.

No Sanity document type for rooms — data comes from bookingConfig singleton.
Fetch getBookingConfig() from lib/sanity/queries.ts (add this query if not yet written).
ISR tag: 'booking-config' (add to TAG_MAP in /api/revalidate if missing).

Sections:

1. PageHero — "Guest Rooms" | "18 comfortable rooms for members and guests."

2. Room Grid — card per room type from bookingConfig.rooms array
   Each card: image placeholder, room type name, amenities list, capacity badge
   If no Sanity data: show [PENDING_CONTENT] — 3 placeholder cards with labels "Standard Room", "Deluxe Room", "Suite"
   Add code comment: // [PENDING_CONTENT] — Room types, counts, and amenities from manager

3. Booking CTA — full-width card: "Check Availability" | "Contact us to check room availability and rates." | CTA → /booking?type=room

generateMetadata: "Rooms | Facilities | Goregaon Sports Club"
```

---

## 2-03 — Banquets Hub + Halls

```
/build

Task 2-03 — Banquets Hub + Hall Pages.

Build FOUR pages:

PAGE 1: app/(site)/facilities/banquets/page.tsx
Data: getBanquetHalls() | ISR tag 'banquets'

Sections:
1. PageHero — "Banquet Halls" | "3 premium venues for every occasion."
2. 3 Hall Cards — each: hall image, name, capacity badge ([PENDING_CONTENT] from manager), tagline, "Explore" CTA → /facilities/banquets/[slug]
3. Inquiry CTA — "Plan Your Event" → /booking?type=banquet

---

PAGES 2-4: app/(site)/facilities/banquets/[hall]/page.tsx
Template for regal, rhythm, glamourra.

generateStaticParams: return ['regal', 'rhythm', 'glamourra']
Data: getBanquetHallBySlug(hall) | ISR tag 'banquets'
notFound() if no match

Sections:
1. PageHero — hall name | capacity badge [PENDING_CONTENT] | data-theme="dark" with hero image
2. Image Gallery — grid of hall images from Sanity gallery field. If empty: 4 placeholder image boxes.
3. Venue Details — two columns:
   Left: PortableTextRenderer(hall.amenities) — [PENDING_CONTENT] if empty
   Right: setup options list (from setupOptions array), floor plan image if available
4. Booking CTA — "Inquire About [Hall Name]" → /booking?type=banquet&hall=[slug]

generateMetadata from Sanity hall.metaTitle / hall.metaDescription
```

---

## 2-04 — Dining Hub + Venues

```
/build

Task 2-04 — Dining Hub + Venue Pages.

Build SEVEN pages. Read docs/spec/PAGES.md § Dining Hub and § Dining Venue.
Special attention: Bleu Restobar requires age disclaimer banner.

PAGE 1: app/(site)/facilities/dining/page.tsx
Data: getDiningVenues() | ISR tag 'dining'

Sections:
1. PageHero — "Dining at GSC" | "6 restaurants and cafes, from fine dining to casual bites."
2. Venue Cards Grid — 3-col (lg) / 2-col (md) / 1-col (sm)
   Each card: venue image (urlFor), name, type badge (Veg = green / Non-Veg = red / Mixed = gold), brief description, hours summary, "View Menu & Hours" CTA
   Bleu Restobar card: additional "25+ | Bar Available" badge in red
3. Dietary note: "All restaurants except Bleu Restobar are 100% vegetarian."

---

PAGES 2-7: app/(site)/facilities/dining/[venue]/page.tsx
Template for all 6 venues.

generateStaticParams: all 6 venue slugs from getDiningVenues()
Data: getDiningVenueBySlug(slug) | ISR tag 'dining'
      If slug === 'food-court': also fetch getFoodStalls() | ISR tag 'food-stalls'
notFound() if no match

Sections:
1. PageHero — venue name | type badge | hours | data-theme="dark" with hero image

2. BLEU RESTOBAR ONLY — prominent disclaimer banner (render if venue.hasBar === true):
   Red-bordered card: "⚠ Bleu Restobar serves alcoholic beverages. Entry is restricted to guests 25 years of age and above. Valid government-issued ID required. Drink responsibly."

3. About — PortableTextRenderer(venue.description) | cuisine type | seating capacity

4. Menu section:
   If venue.menuPdf: PDFViewer component OR "View Menu" link button (opens PDF in new tab)
   If venue.hasBar && venue.barMenuPdf: second PDF viewer or link "Bar Menu"
   If no PDF: "Menu available at the venue."

5. FOOD COURT ONLY — Food Stalls Grid (render if slug === 'food-court' and foodStalls.length > 0):
   Heading: "What's Inside"
   3-col (lg) / 2-col (md) / 1-col (sm) card grid
   Each stall card: image (urlFor or placeholder), name, cuisineType, Veg/Non-Veg badge (isVeg)
   If no food stall documents yet: show [PENDING_CONTENT] placeholder with 4 blank stall cards

6. Gallery — image grid from venue.gallery array. If empty: 4 placeholder boxes.

7. Hours & Info — operating hours table (day | hours), reservation info text

generateMetadata from venue.metaTitle / venue.metaDescription
```

---

## 2-05 — Recreation Hub + Sub-pages

```
/build

Task 2-05 — Recreation Hub + Sub-pages.

Build FOUR pages. Read docs/spec/PAGES.md § Recreation Hub, Kids Zone, Cards Room, Housie.

PAGE 1: app/(site)/facilities/recreation/page.tsx
Static navigation hub. No Sanity fetch.

Sections:
1. PageHero — "Recreation & Leisure"
2. 3 category cards: Kids Zone | Cards Room | Housie Nights
   Each: image placeholder, brief description, CTA → sub-page

---

PAGE 2: app/(site)/facilities/recreation/kids-zone/page.tsx
Sections:
1. PageHero — "Kids Zone"
2. About — activities, equipment, supervision info — [PENDING_CONTENT] from manager
3. Timings — age range, operating hours — [PENDING_CONTENT]
4. Membership note — "Available to members and their children."

---

PAGE 3: app/(site)/facilities/recreation/cards-room/page.tsx
Sections:
1. PageHero — "Cards Room"
2. About — games available, rules summary — [PENDING_CONTENT]
3. Timings — operating hours — [PENDING_CONTENT]
4. Membership note — "Members only facility."

---

PAGE 4: app/(site)/facilities/recreation/housie/page.tsx
Sections:
1. PageHero — "Housie Nights"
2. About — what housie is (tambola/bingo), format, prizes — [PENDING_CONTENT]
3. Schedule — [PENDING_CONTENT] from manager — placeholder: "Schedule announced monthly. Check the downloads section for the latest notice."
4. CTA → /downloads (for housie schedule notice)

All pages: generateMetadata.
```

---

## 2-06 — Remaining Facilities

```
/build

Task 2-06 — Sports Shop, Massage Chairs, Library, Medical Cell.

Build FOUR terminal facility pages. All are simple content pages. Read docs/spec/PAGES.md for each.

PAGE 1: app/(site)/facilities/sports-shop/page.tsx
Sections: PageHero "Sports Shop" | About (what's stocked — equipment, apparel, accessories) [PENDING_CONTENT] | Hours + location within club

PAGE 2: app/(site)/facilities/massage-chairs/page.tsx
Note: This is the same as the old "Massage Center" — same facility, renamed.
Sections: PageHero "Massage Chair Area" | About (chair count, session info, token system or pricing) [PENDING_CONTENT] | Hours

PAGE 3: app/(site)/facilities/library/page.tsx
Sections: PageHero "Club Library" | About (collection size, genres, reading room) [PENDING_CONTENT] | Hours

PAGE 4: app/(site)/facilities/medical-cell/page.tsx
Sections:
1. PageHero "Medical Cell" | "On-site medical support for members."
2. About — facilities, equipment, purpose [PENDING_CONTENT]
3. Doctor Schedule — [PENDING_CONTENT] — placeholder: "Doctor on duty schedule available at the reception."
4. Emergency Contacts — [PENDING_CONTENT] — red-accented card with placeholder numbers

Also create: app/(site)/facilities/open-gym/page.tsx
This is a redirect page only — add to next.config.ts redirects:
{ source: '/facilities/open-gym', destination: '/sports/open-gym', permanent: true }
Do not build content for this page.

All pages: generateMetadata.
```

---

## 2-07 — Events Hub

```
/build

Task 2-07 — Events Hub.

Build app/(site)/events/page.tsx. Read docs/spec/PAGES.md § Events Hub.

Data: getEvents() — fetch all events. ISR tag 'events'.
Filtering is client-side (useSearchParams) from URL params.

Sections:

1. PageHero — "Events at GSC" | "Tournaments, leagues, and celebrations."

2. Filter Bar — client component with two filter groups:
   Status: All | Upcoming | Ongoing | Past
   Type: All | Tournament | Cultural | League | Special
   Both filters stored in URL params: ?status= and ?type=
   Filters applied client-side from the events data fetched on server

3. Events Grid — 3-col (lg) / 2-col (md) / 1-col (sm)
   EventCard component for each matching event
   Empty state: "No events match your filters. Try a different combination."
   If no Sanity events at all: "No events currently. Check back soon." + CTA → /events/leagues

4. Leagues CTA — "Compete in our 18 annual leagues" | CTA → /events/leagues

generateMetadata: "Events | Goregaon Sports Club"
```

---

## 2-08 — Event Detail

```
/build

Task 2-08 — Event Detail Template.

Build app/(site)/events/[slug]/page.tsx. Read docs/spec/PAGES.md § Event Detail.

Data: getEventBySlug(slug) | ISR tag 'events' | notFound() if null
generateStaticParams: fetch all event slugs

Sections:

1. PageHero — event title | date range badge | type badge | data-theme="dark" with hero image

2. Event Details — two columns (md+):
   Left: PortableTextRenderer(event.description) + schedule if present
   Right: info card — Start date, End date, Venue, Type badge, Status badge

3. Registration section — conditional:
   If event.registrationUrl: "Register Now" button (external link, new tab) + deadline if present
   If no URL and status is 'upcoming': "Registration details will be announced soon."
   If status is 'past': "This event has concluded." muted text

4. Related Events — fetch 3 events of same type, exclude current
   If none: omit section entirely

generateMetadata from event.metaTitle / event.metaDescription
```

---

## 2-09 — Leagues Page

```
/build

Task 2-09 — Leagues Page.

Build app/(site)/events/leagues/page.tsx. Read docs/spec/PAGES.md § Leagues.
Terminal page — no sub-pages. All 18 leagues on one page.

Data: getLeaguesConfig() — fetch the leaguesConfig singleton. ISR tag 'leagues'.

Sections:

1. PageHero — "GSC Leagues" | "18 competitive leagues across 12+ sports."

2. Sport Filter — FilterBar (client) with the sports represented in leagues
   Options dynamically derived from leagues data: All + unique sport names
   Filter stored in ?sport= URL param
   Filters the leagues grid below

3. Leagues Grid — 3-col (lg) / 2-col (md) / 1-col (sm)
   Each league card:
   - League name (Heading M)
   - Sport badge (primary)
   - Format badge (T20, Singles, etc.) — gold
   - Frequency (Body S) — Annual / Biannual
   - Approximate dates (Body S, muted)
   - Brief description (Body S, truncated to 3 lines)
   - isActive: true → "Currently Active" green badge | false → no badge

4. Participate CTA — "Interested in competing? Get in touch with us." → /contact?subject=leagues

If no Sanity data yet: show 6 placeholder league cards for the 6 most prominent leagues (Cricket T20, Badminton Singles, Swimming, etc.)

generateMetadata: "Leagues | Events | Goregaon Sports Club"
```

---

## 2-10 — Achievements

```
/build

Task 2-10 — Achievements Page.

Build app/(site)/achievements/page.tsx. Read docs/spec/PAGES.md § Achievements.
This is a 'use client' page (filters + lightbox are interactive).

Data: getAchievements() — fetch all approved achievements. ISR tag 'achievements'.
Client-side filtering by URL params.

Sections:

1. PageHero — "Our Champions" | "Celebrating GSC athletes across decades."

2. Filter Bar — 4 filter dropdowns (shadcn Select or custom):
   Sport (dynamic options from data) | Level: All / District / State / National / International | Type: All / Individual / Team | Year (dynamic from data, sorted desc)
   All filters in URL params: ?sport= ?level= ?type= ?year=
   Filtered achievements shown below

3. Achievement Grid — responsive masonry or uniform 4-col (lg) / 3-col (md) / 2-col (sm) grid
   AchievementCard component: achievement image (urlFor), sport badge, level badge, year
   On card click: open shadcn Dialog (lightbox)
   Lightbox: full image, title, sport, level, type, year, memberName if available

4. Submit Achievement CTA — button: "Are You a GSC Champion?"
   Opens shadcn Dialog containing AchievementSubmitForm
   Build components/shared/forms/AchievementSubmitForm.tsx:
   Fields: Member Name* | Email* | Phone | Sport* | Achievement Title* | Level (select)* | Year* | Description | Photo upload (Cloudinary unsigned)
   Cloudinary upload before form submit — store URL in form state
   Submit to POST /api/achievement
   Success: "Submission received. Our team will review and add it to the champions wall."

Empty state: "No achievements found matching your filters." with clear filters link.
If no Sanity data: show 8 placeholder cards.
```

---

## 2-11 — Partners

```
/build

Task 2-11 — Partners Page.

Build app/(site)/partners/page.tsx. Read docs/spec/PAGES.md § Partners.

Data: getPartnershipOpportunities() | getSiteConfig() (for current partners logos) | ISR tags 'partners', 'site-config'

Sections:

1. PageHero — "Partner With GSC" | "Reach 40,000+ members and 2,000+ daily visitors." | data-theme="dark"

2. Why Partner — 3 value prop cards:
   "Massive Reach" — 40,000+ member network, 2,000+ daily footfall
   "Premium Visibility" — logo placement, digital presence, event branding
   "Community Impact" — association with 30+ year legacy institution

3. Partnership Opportunities — card grid from Sanity partnershipOpportunity documents
   Each: title, description, reachStats, benefits list, highlighted variant (if isHighlighted)
   If no Sanity data: 3 placeholder opportunity cards (Title Sponsor / Event Partner / Digital Partner)

4. Team Spirit Block — "Advertise in Team Spirit"
   "GSC's member magazine — 3 editions per year. Summer | Diwali | New Year."
   "Reach members directly in their homes." | CTA → /partners/team-spirit

5. Partner Inquiry Form — id="inquiry" anchor
   Build components/shared/forms/PartnerForm.tsx:
   Fields: Company Name* | Contact Name* | Email* | Phone* | Partnership Type (select: Title Sponsor / Event Partner / Digital Partner / Other) | Message
   Submit to POST /api/partner
   Success: "Inquiry received. Our partnerships team will be in touch within 48 hours."

6. Current Partners — logo grid from siteConfig.corporatePartners
   If empty: placeholder grid of 6 grey boxes with "Your Brand Here" text

generateMetadata: "Partner With Us | Goregaon Sports Club"
```

---

## 2-12 — Team Spirit

```
/build

Task 2-12 — Team Spirit Page.

Build app/(site)/partners/team-spirit/page.tsx. Read docs/spec/PAGES.md § Team Spirit.

Data: getTeamSpiritEditions() — sorted by year desc | ISR tag 'team-spirit'

Sections:

1. PageHero — "Team Spirit" | "GSC's Member Magazine — 3 Editions Per Year."

2. About — "Team Spirit is Goregaon Sports Club's quarterly member magazine, distributed to all 12,000+ primary members. Published 3 times a year — Summer, Diwali, and New Year editions."

3. Editions Grid — 3-col (lg) / 1-col (sm)
   For each teamSpiritEdition document:
   - Cover image (urlFor) in aspect-[3/4] ratio
   - Edition name (Heading M): "Summer 2024", "Diwali 2024", etc.
   - Edition badge (gold): Summer / Diwali / New Year
   - Publication date (Body S, muted)
   - If pdfFile present: "View Edition" button (opens PDF) + "Download" button
   - If no PDF: "Coming Soon" muted state
   Sort most recent edition first.
   If no Sanity data: 3 placeholder cards for Summer / Diwali / New Year

4. Advertise Section — heading: "Advertise in Team Spirit"
   If latest edition has adSpecs: PortableTextRenderer(adSpecs)
   Else: [PENDING_CONTENT] — "Ad specifications and rates available on request."
   CTA: "Get Ad Specs" → /contact?subject=partnership or mailto link

generateMetadata: "Team Spirit Magazine | Partners | Goregaon Sports Club"
```

---

## 2-13 — Annual Report

```
/build

Task 2-13 — Annual Report Page.

Build app/(site)/partners/annual-report/page.tsx. Read docs/spec/PAGES.md § Annual Report.

Data: getAnnualReports() — sorted by year desc | ISR tag 'annual-reports'

Sections:

1. PageHero — "Annual Reports" | "Transparency and accountability."

2. Reports List — 1-col stacked cards, most recent first
   Each report card: cover image (urlFor, aspect-video) on left | year + title on right | "Download PDF" button (opens Cloudinary URL in new tab) + optional react-pdf inline viewer toggle
   If pdfFile has a direct URL: use that. Use PDFViewer component with toggle "Preview" / "Download".
   If no Sanity data: 2 placeholder cards for "Annual Report 2023-24" and "Annual Report 2022-23"

3. Note: "For older reports or additional documents, contact the club office." → /contact

generateMetadata: "Annual Reports | Partners | Goregaon Sports Club"
```

---

## 2-14 — Downloads

```
/build

Task 2-14 — Downloads Page.

Build app/(site)/downloads/page.tsx. Read docs/spec/PAGES.md § Downloads.
This page absorbs the old /Notice and /Downloads URLs — redirects for both in next.config.ts.

Data: getDownloads() — all active downloads sorted by publishedDate desc | ISR tag 'downloads'
Client-side category filtering.

Sections:

1. PageHero — "Downloads & Notices" | "Official club documents and notices."

2. Filter Bar — category pill filter:
   All | Notices | Circulars | Forms | Reports
   Filter stored in ?category= URL param

3. Downloads List — table layout on md+, card list on sm
   Table columns: Title | Category Badge | Date | File Size | Download button
   Card layout (mobile): title + category + date + download button
   Download button: opens file URL in new tab (Cloudinary or Sanity file asset URL)
   Empty state: "No downloads in this category."
   If no Sanity data: 3 placeholder rows for sample notices

4. Subscribe note: "Want to receive club notices directly? Contact the club office." → /contact

Also add to next.config.ts redirects:
{ source: '/Notice', destination: '/downloads', permanent: true }
{ source: '/Downloads', destination: '/downloads', permanent: true }

generateMetadata: "Downloads & Notices | Goregaon Sports Club"
```

---

## 2-15 — SEO + Redirects

```
/build

Task 2-15 — SEO, Sitemap, Robots, and 301 Redirects.

This is the final Phase 2 task. Build all SEO infrastructure.

1. app/sitemap.ts — dynamic sitemap:
   - Static routes: /, /about, /about/team, /about/bye-laws, /contact, /sports, /sports/coaching, /events, /events/leagues, /facilities, /facilities/rooms, /facilities/banquets, /facilities/dining, /facilities/recreation, /booking, /membership, /membership/affiliated-clubs, /achievements, /partners, /partners/team-spirit, /partners/annual-report, /downloads, /legal, /legal/cancellation
   - Dynamic sport pages: fetch all sport slugs → /sports/[slug]
   - Dynamic event pages: fetch all event slugs → /events/[slug]
   - Dynamic banquet halls: regal, rhythm, glamourra
   - Dynamic dining venues: all 6 slugs
   - Membership types: life, corporate, ward, service, yearly
   - Exclude: /studio/*, /api/*

2. app/robots.ts — update to final version:
   disallow: ['/studio/', '/api/', '/not-found']

3. generateMetadata — audit every page that doesn't yet have it. Add default metadata to (site)/layout.tsx:
   title: { default: 'Goregaon Sports Club', template: '%s | Goregaon Sports Club' }
   description: 'Mumbai's premier sports club — 30+ years, 23+ sports, 12,000+ members.'
   openGraph: { siteName: 'Goregaon Sports Club', type: 'website' }
   twitter: { card: 'summary_large_image' }

4. next.config.ts — complete redirect map from GSC.md § 301 Redirect Map:
   /the-club → /about (permanent)
   /the-club/history → /about (permanent)
   /the-club/team → /about/team (permanent)
   /achivement → /achievements (permanent — note typo in old URL)
   /ONGOING%20EVENTS → /events (permanent)
   /Turf → /sports/indoor-cricket-nets (permanent)
   /Massage-Center → /facilities/massage-chairs (permanent)
   /in-house-marketing → /partners (permanent)
   /Team-Spirit → /partners/team-spirit (permanent)
   /Annual-Report → /partners/annual-report (permanent)
   /Notice → /downloads (permanent)
   /Downloads → /downloads (permanent)
   /Blog → / (permanent)
   /Gallery → / (permanent)
   /facilities/open-gym → /sports/open-gym (permanent)
   Also add case-insensitive variants for any URLs with uppercase letters

5. Final build verification:
   - pnpm build — must pass with 0 errors and 0 warnings
   - pnpm typecheck — must pass
   - Check: all 69 pages present in sitemap output
   - Check: all 14 redirects in next.config.ts

After this task, Phase 2 is complete. Run /done to advance to Phase 3.
```

---
