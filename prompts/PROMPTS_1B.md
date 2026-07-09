# GSC — Phase 1B Prompts
# Ready-to-paste prompts for Claude Code. One prompt per task.
# All Phase 1A tasks must be complete before starting 1B.
# No WebGL in this phase — GSAP CSS only. 3D is Phase 3.

---

## 1B-01 — Homepage

```
/build

Task 1B-01 — Homepage.

Build the full homepage at app/(site)/page.tsx. Read docs/spec/PAGES.md § Homepage.

Data: fetch getSiteConfig() and getEvents() in the page Server Component. Pass as props to sections.

Build all 8 sections as separate components in components/sections/home/:

1. HeroSection.tsx
   - Full viewport (min-h-screen), data-theme="dark"
   - Headline: "GOREGAON SPORTS CLUB" — Display XL, Barlow Condensed 700, uppercase
   - Subline: "Mumbai's Premier Sports Destination — 30+ Years, 23+ Sports, 40,000+ Members" — Body L, Inter
   - Two CTAs: "Explore Membership" (primary button → /membership) + "View Facilities" (secondary → /facilities)
   - 3D placeholder: <div className="absolute inset-0 [PENDING_3D_HERO]" /> — a subtle CSS animated background for now
   - GSAP: fade-in stagger on mount (badge → headline → subline → CTAs)

2. StatsBar.tsx
   - 4 StatCounter components inline: 12000+ Members | 2000+ Daily Footfall | 23+ Sports | 30+ Years
   - Dark surface background, border top and bottom
   - Animated counter on scroll-enter

3. SportsGrid.tsx
   - Headline: "World-Class Sports" (Display S, Barlow Condensed)
   - 6 category cards: Outdoor (7) / Indoor (11) / Aquatic (1) / Health & Fitness (3) / Track (2) / Coaching
   - Each card: category image placeholder, category name, sport count, hover lift
   - "View All Sports" CTA → /sports

4. FacilitiesShowcase.tsx
   - Headline: "Premium Facilities"
   - Alternating left/right layout (3 items): Banquets | Dining | Rooms
   - Each: image placeholder, name, brief description, CTA link
   - AnimatedText on headlines

5. EventsPreview.tsx
   - Headline: "What's On"
   - 3 EventCard components from getEvents() data (upcoming, sorted by startDate)
   - Empty state if no events: "No upcoming events. Check back soon."
   - "View All Events" CTA → /events

6. AchievementsReel.tsx
   - Headline: "Our Champions"
   - Horizontal scroll strip of achievement image placeholders (8 placeholder cards)
   - Auto-scroll animation with GSAP (pause on hover)
   - "View All Achievements" CTA → /achievements

7. MembershipCTA.tsx
   - Full-width dark section (data-theme="dark")
   - Headline: "Become Part of the Legacy"
   - Subline: enrollment notice
   - 5 membership type pills: Life | Corporate | Ward | Service | Yearly
   - Primary CTA: "Express Interest" → /membership

8. PartnersStrip.tsx
   - Headline: "Our Partners" (small, Body S weight)
   - Logo placeholder strip (8 grey placeholder boxes, auto-scroll)
   - "Partner With Us" CTA → /partners

Use SectionWrapper for all sections. AnimatedText on all section headlines.
```

---

## 1B-02 — About Page

```
/build

Task 1B-02 — About Page.

Build app/(site)/about/page.tsx. Read docs/spec/PAGES.md § About.

Data: fetch getMilestones() with ISR tag 'milestones'. Fetch getSiteConfig() from layout (prop-drilled or context).

Sections:

1. PageHero — "About GSC" | subline: "30+ Years of Sporting Excellence in Mumbai"

2. History & Legacy — 2-column (md): left = rich text placeholder (portableText from aboutPage singleton — use placeholder text for now, note [PENDING_CONTENT]), right = historic image placeholder. AnimatedText on text blocks.

3. Stats Bar — reuse StatsBar component from homepage. Same 4 stats.

4. Milestones Timeline
   - Vertical timeline, year-sorted descending
   - Each item: year badge (gold accent) on left, event title + description on right
   - Alternating left/right on desktop (md+), stacked on mobile
   - Data from getMilestones() — if empty, show 3 placeholder milestones

5. Leadership Overview — text block: "GSC is led by a dedicated committee of founding and promoter members..." + "Meet Our Committee" CTA → /about/team

6. Bye-Laws CTA — card: "Club Governance" | "Access our official bye-laws and governance documents" | CTA → /about/bye-laws

generateMetadata: title "About | Goregaon Sports Club", description from Sanity or default.
```

---

## 1B-03 — Team Page

```
/build

Task 1B-03 — Team Page.

Build app/(site)/about/team/page.tsx. Read docs/spec/PAGES.md § Team.

Data: fetch getCommitteeMembers() with ISR tag 'committee'.

Sections:

1. PageHero — "Club Committee" | subline: "The people who lead GSC forward."

2. Role Filter — client component FilterBar with 4 options + "All":
   - All | Founder Members | Promoter Members | Office Bearers | Governing Council
   - Filter value maps to Sanity role field: founderMember | promoterMember | officeBearer | governingCouncil
   - Active filter stored in URL param ?role= using useSearchParams + useRouter
   - Page is a Server Component — filter component is 'use client'

3. Committee Grid — 3-col (lg) / 2-col (md) / 1-col (sm)
   - Each card: photo (urlFor, aspect-square, rounded-full or rounded-2xl), name (Heading M), designation (Body M), role badge (Badge component)
   - Filtered by active ?role= param on server
   - If no members for role: "No members in this category yet."
   - Empty state if no Sanity data: 6 placeholder skeleton cards

generateMetadata: "Committee | About | Goregaon Sports Club"
```

---

## 1B-04 — Bye-Laws + Contact

```
/build

Task 1B-04 — Bye-Laws + Contact.

Build TWO pages:

PAGE 1: app/(site)/about/bye-laws/page.tsx

Data: No Sanity fetch needed for content — PDF URL from siteConfig or hardcoded Cloudinary URL for now.

Sections:
1. PageHero — "Club Bye-Laws" | "Official rules and governance of Goregaon Sports Club."
2. PDFViewer component — URL: [PENDING_CONTENT] placeholder div. Show "PDF will be available here." until URL provided.
   Build the PDFViewer component now at components/shared/PDFViewer.tsx per COMPONENT_SPECS.md.
3. Contact Block — "Questions about club rules?" | CTA → /contact

---

PAGE 2: app/(site)/contact/page.tsx

Data: getSiteConfig() for address, phone, email (from (site)/layout.tsx prop).

Sections:
1. PageHero — "Get In Touch" | "We're here to help."
2. Split Panel (md: 2-col, sm: stacked):
   Left: ContactForm component (build at components/shared/forms/ContactForm.tsx)
   Right: address, phone, email, Google Maps embed placeholder [PENDING_CONTENT — embed URL from manager]

3. Emergency Contacts block at bottom — "Medical Cell: [PENDING_CONTENT] | Emergency: [PENDING_CONTENT]" in accent-red

ContactForm:
- React Hook Form + contactSchema from lib/validations.ts
- Fields: Name*, Email*, Phone (optional), Subject (shadcn Select)*, Message*
- Subject options from contactTypeEnum: General | Membership | Event | Partnership | Media | Leagues
- Submit to POST /api/contact
- Success: inline "Message sent. We'll respond within 2 business days."
- Error: inline "Something went wrong. Please try again or call us directly."
```

---

## 1B-05 — Legal Pages

```
/build

Task 1B-05 — Legal Pages.

Build TWO pages:

PAGE 1: app/(site)/legal/page.tsx

Sections:
1. PageHero — "Legal & Policies"
2. Three policy cards:
   - Privacy Policy | "How we collect and use your information." | "Read Policy" → /legal#privacy
   - Terms of Use | "Terms governing use of our facilities and website." | "Read Terms" → /legal#terms
   - Cancellation Policy | "Our refund and cancellation terms." | "View Policy" → /legal/cancellation
3. CMS-driven content — fetch getLegalPage('privacy-policy') and getLegalPage('terms-of-use')
   Render with PortableTextRenderer under their respective section ids (#privacy, #terms)
   If no Sanity content yet: show [PENDING_CONTENT] placeholder text

---

PAGE 2: app/(site)/legal/cancellation/page.tsx

Sections:
1. PageHero — "Cancellation & Refund Policy"
2. CMS content — fetch getLegalPage('cancellation') → render with PortableTextRenderer
   If no Sanity content: show [PENDING_CONTENT] notice: "Policy document being prepared. Contact us for current terms."
3. Contact CTA — "Questions?" → /contact

Both pages:
- generateMetadata from Sanity legalPage.metaTitle / metaDescription
- ISR tag: 'legal'
- Note in code: [DPDP_REVIEW_REQUIRED] — legal pages need compliance review before launch
```

---

## 1B-06 — Sports Hub

```
/build

Task 1B-06 — Sports Hub.

Build app/(site)/sports/page.tsx. Read docs/spec/PAGES.md § Sports Hub.
No WebGL in this task. GSAP CSS experience only. 3D scroll is Task 3-04 through 3-08.

Data: fetch getSports() with ISR tag 'sports'. Group by category client-side or in query.

Sections:

1. PageHero — "23+ Sports. One Club." | data-theme="dark" always | GSAP fade-in

2. Sports Scroll Placeholder — 'use client' section
   Build a GSAP CSS scroll experience for now:
   - 6 stacked category sections, each with large category name (Display M, Barlow) + sport count + category image placeholder
   - GSAP ScrollTrigger: each section fades and slides in as it enters viewport
   - Add comment: // [3D_UPGRADE] — This section will be replaced with WebGL in Task 3-04 through 3-08
   - This is the mobile-permanent version and the desktop fallback until Phase 3

3. Sports Category Grid — below the scroll section
   5 category groups: Outdoor | Indoor | Aquatic | Health & Fitness | Track
   Each group: category heading + grid of SportCard components
   SportCard: sport name, category badge, short description, hero image, → /sports/[slug]

4. Coaching CTA — "Train with the Best" | "Expert coaching across 10+ disciplines." | CTA → /sports/coaching

generateMetadata: "Sports | Goregaon Sports Club"
generateStaticParams: not needed (hub is not dynamic)
```

---

## 1B-07 — Sport Detail Template

```
/build

Task 1B-07 — Sport Detail Template.

Build app/(site)/sports/[slug]/page.tsx. Read docs/spec/PAGES.md § Sport Detail.
This template serves all 24 sport pages. No 3D object yet — that is Task 3-09.

Data:
- getSportBySlug(slug) with ISR tag 'sports'
- getAchievements({ sport: slug }) for achievements section
- notFound() if sport not in Sanity

export async function generateStaticParams() — fetch all sport slugs from Sanity

Sections:

1. PageHero — sport name (Display L, Barlow) | category badge | short description | data-theme="dark"
   Image: urlFor(sport.heroImage) as background with dark overlay
   3D placeholder: add <div data-3d-object={sport.threeObjectType} className="[PENDING_3D_OBJECT] hidden md:block" />
   Comment: // [3D_UPGRADE] Task 3-09 — replace with sport hero 3D object

2. About the Sport — SectionWrapper | PortableTextRenderer(sport.fullDescription)

3. Schedule / Timings — table or grid of sport.schedule array
   Day | Open | Close format. If empty: "Contact us for current timings."

4. Coaching section — conditional: if (sport.hasCoaching)
   Show: coach name, coaching schedule, level badge, external registration link button
   If no external URL: "Contact us to register" → /contact

5. Achievements section — conditional: if achievements.length > 0
   Show last 3 AchievementCard components
   "View All [Sport] Achievements" → /achievements?sport=[slug]

6. Booking CTA — "Book This Facility" (primary button) → /booking?type=ground&sport=[slug]

generateMetadata: sport.metaTitle / sport.metaDescription from Sanity, fallback to defaults
```

---

## 1B-08 — Coaching

```
/build

Task 1B-08 — Coaching Page.

Build app/(site)/sports/coaching/page.tsx. Read docs/spec/PAGES.md § Coaching.

Data: fetch getSports() filtered to hasCoaching === true. ISR tag 'sports'.

Sections:

1. PageHero — "Coaching Programs" | "Expert coaching across 10+ disciplines."

2. Sport Filter — FilterBar component (client)
   Options: All | Outdoor | Indoor | Aquatic | Health & Fitness
   Filter stored in URL param ?category=
   Filters the coaching cards below

3. Coaching Cards Grid — 3-col (lg) / 2-col (md) / 1-col (sm)
   Each card for a sport with hasCoaching: true:
   - Sport name (Heading M)
   - Coach name (Body M) — "Coach: [name]" or "Contact for coach details" if empty
   - Schedule (Body S) — from sport.coachingSchedule
   - Level badge — Beginner / Intermediate / Advanced / All levels
   - CTA button: "Register" → sport.externalRegistrationUrl (external link, new tab)
     If no URL: "Inquire" → /contact?subject=coaching

4. Contact CTA — "Don't see your sport? Ask us." → /contact

generateMetadata: "Coaching Programs | Sports | Goregaon Sports Club"
```

---

## 1B-09 — Booking

```
/build

Task 1B-09 — Booking Page.

Build app/(site)/booking/page.tsx and components/shared/forms/BookingForm.tsx.
Read docs/spec/PAGES.md § Booking and docs/FORMS.md § Booking Form.

PAGE: app/(site)/booking/page.tsx
- Server Component wrapper
- PageHero — "Book a Facility" | "Room, banquet, ground, or coaching — one form."
- Reads searchParams: type and sport and hall from URL
- Passes defaultType, defaultSport, defaultHall to BookingForm

FORM: components/shared/forms/BookingForm.tsx (use client)
- shadcn Tabs or custom pill selector at top: Room | Banquet | Ground | Coaching
- URL param ?type= pre-selects the active tab (useSearchParams)
- On tab change: update URL param without page reload (useRouter.replace)

Fields per tab (from FORMS.md bookingSchema):

Room tab: Name* | Email* | Phone* | Room Type (text) | Check-in date* | Check-out date* | Guests (number) | Message
Banquet tab: Name* | Email* | Phone* | Hall Preference (select: Regal/Rhythm/Glamourra/No preference) | Event Type* | Guest Count* | Event Date* | Message
Ground tab: Name* | Email* | Phone* | Sport (text — pre-filled from ?sport=) | Date* | Preferred Time* | Message
Coaching tab: Name* | Email* | Phone* | Sport* | Level (select: Beginner/Intermediate/Advanced/All levels) | Message

All tabs: React Hook Form + bookingSchema (superRefine validates required fields per type)
Submit to POST /api/booking
Success: "Your [type] inquiry has been received. We'll contact you within 24 hours."
Error: "Something went wrong. Please try again or call us directly."

Contact info block: "Prefer to call? [PENDING_CONTENT — phone number]"
```

---

## 1B-10 — Membership Hub

```
/build

Task 1B-10 — Membership Hub.

Build app/(site)/membership/page.tsx. Read docs/spec/PAGES.md § Membership Hub.

Data: getMembershipConfig() for enrollment status. getMembershipTypes() for all 5 types. ISR tags 'membership-config', 'membership'.

Sections:

1. PageHero — "Join the GSC Family" | "12,000+ members. A legacy 30 years strong." | data-theme="dark"

2. Enrollment Status Banner — prominent notice card
   Read membershipConfig.enrollmentOpen from Sanity:
   - If false (current): gold/amber banner — "Membership enrollment is currently paused. Express your interest and you'll be notified when enrollment opens."
   - If true: green banner — "Enrollment is now open! Apply below."

3. Membership Type Cards — 5 cards in 3-col (lg) / 2-col (md) / 1-col (sm) grid
   For each membershipType from Sanity:
   - Title (Heading L)
   - Eligibility summary (Body M, truncated to 2 lines)
   - 3 benefit bullets (first 3 items from benefits list)
   - "Express Interest" button → /membership/[type]
   - If membershipType not in Sanity yet: show 5 placeholder cards with type names

4. Affiliated Clubs — horizontal card or banner
   "Member of another club? Check reciprocal member benefits." | CTA → /membership/affiliated-clubs

generateMetadata: "Membership | Goregaon Sports Club"
```

---

## 1B-11 — Membership Type + Affiliated

```
/build

Task 1B-11 — Membership Type Pages + Affiliated Clubs.

Build THREE items:

PAGE 1: app/(site)/membership/[type]/page.tsx
Template for all 5 membership types.

generateStaticParams: return ['life','corporate','ward','service','yearly']
Data: getMembershipTypeBySlug(type) | getMembershipConfig() | ISR tags 'membership', 'membership-config'
notFound() if type not in Sanity

Sections:
1. PageHero — "[Type] Membership" | eligibility badge | data-theme="dark"
2. Eligibility — PortableTextRenderer(membershipType.eligibility) | heading: "Who Can Apply"
3. Benefits — PortableTextRenderer(membershipType.benefits) | heading: "Membership Benefits"
4. Special note for 'yearly' type only:
   Info badge: "Available to children and parents of Life Members, and senior citizens 65 years and above."
5. Interest Form — MembershipInterestForm component (build below)
   Heading: "Express Your Interest"
   Subtext: "Enrollment is currently paused. We'll notify you when it opens."
6. Back link → /membership

FORM: components/shared/forms/MembershipInterestForm.tsx (use client)
Props: membershipType (pre-filled, readonly display — not editable)
Fields: Name* | Email* | Phone* | Message (optional, max 500 chars)
React Hook Form + membershipInterestSchema
Submit to POST /api/membership
Success: "Interest registered. You'll be among the first notified when enrollment opens."

---

PAGE 2: app/(site)/membership/affiliated-clubs/page.tsx

Data: getMembershipConfig() → affiliatedClubs array. ISR tag 'membership-config'.

Sections:
1. PageHero — "Affiliated Club Members" | "GSC's reciprocal membership benefits."
2. About — brief text on how affiliated club membership works at GSC
3. Affiliated Clubs — card grid
   Each card: club name, location, reciprocal benefits text, club logo if available
   If no Sanity data yet: [PENDING_CONTENT] placeholder with 3 dummy cards

generateMetadata for both pages.
```

---
