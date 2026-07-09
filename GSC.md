# GSC — Project Bible
# Condensed master reference. Read when you need project decisions, brand values,
# page logic, or data. Not a build guide — for that, see docs/PHASES.md.

---

## Club Identity

| Field           | Value                                   |
| --------------- | --------------------------------------- |
| Full name       | Goregaon Sports Club                    |
| Short name      | GSC                                     |
| Founded         | 30+ years ago                           |
| Primary members | 12,000+                                 |
| Total network   | 40,000+                                 |
| Daily footfall  | 2,000+                                  |
| Sports offered  | 23+                                     |
| Annual leagues  | 18                                      |
| Banquet venues  | 3 halls                                 |
| Rooms           | 18 (manager to confirm exact breakdown) |
| Location        | Goregaon, Mumbai, Maharashtra           |
| Website         | gsc.in                                  |

---

## Brand System

### Logo
- Olympic torch + GSC monogram
- Full wordmark: "GOREGAON SPORTS CLUB"
- Primary color in logo: #1565C0 (exact blue)
- Source: Get SVG from graphic team — do not recreate from PNG

### Color Tokens

```css
/* Primary */
--color-primary: #1E88E5;          /* dark backgrounds */
--color-primary-dark: #1565C0;     /* light backgrounds + logo exact */
--color-primary-hover: #1976D2;

/* Accent */
--color-accent-gold: #FFB300;      /* flame / achievement / CTA */
--color-accent-red: #E53935;       /* fire / energy / error */
--color-accent-green: #43A047;     /* success / active */

/* Dark mode backgrounds */
--color-bg-dark: #0A0E1A;          /* page base */
--color-surface-dark: #111827;     /* cards, panels */
--color-elevated-dark: #1A2235;    /* modals, dropdowns */

/* Light mode backgrounds */
--color-bg-light: #F8FAFF;         /* page base */
--color-surface-light: #FFFFFF;    /* cards, panels */

/* Text */
--color-text-primary-dark: #F9FAFB;
--color-text-secondary-dark: #9CA3AF;
--color-text-primary-light: #0F172A;
--color-text-secondary-light: #6B7280;

/* Borders */
--color-border-dark: rgba(255,255,255,0.08);
--color-border-light: rgba(0,0,0,0.08);
```

### Theme Behaviour
- **Default**: Light mode
- **Toggle**: Stored in `localStorage` key `gsc-theme`
- **Hero sections**: ALWAYS dark (`data-theme="dark"`) — regardless of global theme
- **Implementation**: `ThemeProvider` wraps `(site)/layout.tsx`

### Typography

```css
/* Display — Barlow Condensed */
--font-display: 'Barlow Condensed', sans-serif;   /* weight 600 / 700 */

/* Body — Inter */
--font-body: 'Inter', sans-serif;                 /* weight 400 / 500 / 600 */
```

| Name       | Size | Weight | Font   | Usage                  |
| ---------- | ---- | ------ | ------ | ---------------------- |
| Display XL | 96px | 700    | Barlow | Homepage hero          |
| Display L  | 72px | 700    | Barlow | Section heroes         |
| Display M  | 56px | 600    | Barlow | Page titles            |
| Display S  | 40px | 600    | Barlow | Section headings       |
| Heading L  | 32px | 600    | Inter  | Card titles, sub-heads |
| Heading M  | 24px | 600    | Inter  | Component headings     |
| Heading S  | 20px | 600    | Inter  | Labels, small headings |
| Body L     | 18px | 400    | Inter  | Lead paragraph         |
| Body M     | 16px | 400    | Inter  | Default body           |
| Body S     | 14px | 400    | Inter  | Captions, meta         |

---

## Navigation Structure

```
HOME | SPORTS | EVENTS | FACILITIES | BOOKING | MEMBERSHIP | ACHIEVEMENTS | PARTNERS | ABOUT
```

### Full Route Map (69 pages)

#### Root
- `/` — Homepage

#### Sports (24 pages)
- `/sports` — Hub
- `/sports/coaching` — Coaching hub
- Outdoor (7): `/sports/cricket-ground`, `/sports/cricket-nets`, `/sports/basketball`, `/sports/lawn-tennis`, `/sports/volleyball`, `/sports/cycling`, `/sports/skating`
- Indoor (11): `/sports/badminton`, `/sports/squash`, `/sports/table-tennis`, `/sports/billiards-snooker`, `/sports/chess`, `/sports/carrom`, `/sports/gymnastics`, `/sports/aerobics`, `/sports/yoga`, `/sports/pistol-shooting`, `/sports/indoor-cricket-nets`
- Aquatic (1): `/sports/swimming-pool`
- Health (3): `/sports/gym`, `/sports/burnout-crossfit`, `/sports/open-gym`
- Track (2): `/sports/walking-track`, `/sports/pebble-walk`

#### Events (3 pages)
- `/events` — Filterable hub
- `/events/[slug]` — Event detail template
- `/events/leagues` — All 18 leagues (single terminal page, no sub-pages)

#### Facilities (20 pages)
- `/facilities` — Hub
- `/facilities/rooms` — 18 rooms
- `/facilities/banquets` — Banquet hub
- `/facilities/banquets/regal` — Regal Hall
- `/facilities/banquets/rhythm` — Rhythm Hall
- `/facilities/banquets/glamourra` — Glamourra Hall
- `/facilities/dining` — Dining hub
- `/facilities/dining/golden-peacock`
- `/facilities/dining/water-front-cafe`
- `/facilities/dining/bleu-restobar`
- `/facilities/dining/flavours`
- `/facilities/dining/cookie-dough-cafe`
- `/facilities/dining/food-court`
- `/facilities/recreation` — Recreation hub
- `/facilities/recreation/kids-zone`
- `/facilities/recreation/cards-room`
- `/facilities/recreation/housie`
- `/facilities/sports-shop`
- `/facilities/massage-chairs`
- `/facilities/library`
- `/facilities/medical-cell`
- `/facilities/open-gym` — Redirects to `/sports/open-gym`

#### Booking (1 page)
- `/booking` — Unified inquiry form

#### Membership (7 pages)
- `/membership` — Hub
- `/membership/life`
- `/membership/corporate`
- `/membership/ward`
- `/membership/service`
- `/membership/yearly`
- `/membership/affiliated-clubs`

#### Achievements (1 page)
- `/achievements` — Filterable wall

#### Partners (3 pages)
- `/partners` — Corporate pitch page
- `/partners/team-spirit` — 3 editions/year (Summer, Diwali, New Year)
- `/partners/annual-report` — PDF viewer (2–3 reports)

#### About (4 pages)
- `/about` — History, stats, milestones, leadership
- `/about/team` — Full committee grid
- `/about/bye-laws` — Document viewer
- `/contact` — Contact form + map

#### Utility (5 pages)
- `/downloads` — Notices + documents hub
- `/legal` — Privacy policy, terms
- `/legal/cancellation` — Cancellation + refund policy
- `/not-found` — 404
- `/sitemap.xml` — Auto-generated

---

## Key Data Decisions

### Membership Types
All 5 types are currently **interestOnly** — enrollment is closed. Show interest form only, no active enrollment flow.

| Type      | Slug      | Notes                                          |
| --------- | --------- | ---------------------------------------------- |
| Life      | life      | Primary membership tier                        |
| Corporate | corporate | Corporate entity membership                    |
| Ward      | ward      | Ward-level membership                          |
| Service   | service   | Service membership tier                        |
| Yearly    | yearly    | Children/parents of Life Members + 65+ seniors |

### Booking Types
Single `/booking` page handles all 4 inquiry types via tab/selector:
- `room` — Room booking inquiry
- `banquet` — Banquet hall inquiry
- `ground` — Cricket ground / sports facility
- `coaching` — Coaching program inquiry

### Dining Venues

| Slug              | Name              | Type    | Notes                                                  |
| ----------------- | ----------------- | ------- | ------------------------------------------------------ |
| golden-peacock    | Golden Peacock    | Veg     | Main restaurant                                        |
| water-front-cafe  | Water Front Cafe  | Veg     | Outdoor cafe                                           |
| bleu-restobar     | Bleu Restobar     | Non-Veg | hasBar: true, 25+ age restriction, disclaimer required |
| flavours          | Flavours          | Veg     |                                                        |
| cookie-dough-cafe | Cookie Dough Cafe | Veg     |                                                        |
| food-court        | Food Court        | Mixed   | Named branded stalls inside                            |

**Bleu Restobar rule**: Must show legal age disclaimer banner + age restriction notice + barMenuPDF field in Sanity.

### Leagues (18 total — all on /events/leagues)
Cricket T20, Cricket Test, Cricket Women's, Basketball, Badminton Singles, Badminton Doubles, Lawn Tennis Singles, Lawn Tennis Doubles, Table Tennis, Squash, Volleyball, Swimming, Chess, Carrom, Billiards, Snooker, Gymnastics, Athletics

### Achievement Filters (4 only — keep simple)
- `sport` — Which sport (free text / select)
- `level` — District / State / National / International
- `type` — Individual / Team
- `year` — Year achieved

Achievement images ARE the content. Graphic team creates posts → staff uploads to Sanity. No metadata from member — all metadata sourced from management.

### Committee Roles (4)
- `founderMember`
- `promoterMember`
- `officeBearer`
- `governingCouncil`

---

## Form Routing

| Form                | Route                 | DB Table                | Resend template         |
| ------------------- | --------------------- | ----------------------- | ----------------------- |
| Booking inquiry     | POST /api/booking     | booking_inquiries       | booking-confirmation    |
| Membership interest | POST /api/membership  | membership_inquiries    | membership-confirmation |
| Contact             | POST /api/contact     | contact_inquiries       | contact-confirmation    |
| Partner inquiry     | POST /api/partner     | partner_inquiries       | partner-confirmation    |
| Achievement submit  | POST /api/achievement | achievement_submissions | achievement-received    |

All forms: React Hook Form + Zod validation → API route → DB insert → Resend email → JSON response.

---

## 3D Scene Map

| Page             | 3D Usage                        | Mobile       |
| ---------------- | ------------------------------- | ------------ |
| `/`              | WebGL particle hero scene       | CSS fallback |
| `/sports`        | 6-scene WebGL scroll experience | CSS fallback |
| `/sports/[slug]` | Contained 3D object in hero     | Hidden       |
| Everything else  | GSAP only — no WebGL            | Full support |

**Rule**: Build GSAP fallback first. WebGL is progressive enhancement.

---

## 301 Redirect Map

| Old URL                       | New URL                     |
| ----------------------------- | --------------------------- |
| /the-club                     | /about                      |
| /the-club/history             | /about                      |
| /the-club/team                | /about/team                 |
| /achivement (typo in old URL) | /achievements               |
| /ONGOING%20EVENTS             | /events?status=ongoing      |
| /Turf                         | /sports/indoor-cricket-nets |
| /Massage-Center               | /facilities/massage-chairs  |
| /in-house-marketing           | /partners                   |
| /Team-Spirit                  | /partners/team-spirit       |
| /Annual-Report                | /partners/annual-report     |
| /Notice                       | /downloads                  |
| /Downloads                    | /downloads                  |
| /Blog                         | /                           |
| /Gallery                      | /                           |

---

## Pending Items (Do Not Block Build)

These are manager/client decisions not yet received. Use placeholder/dummy content and note `[PENDING_CONTENT]` in comments:

- [ ] Banquet capacities and exact configurations
- [ ] Room types, count breakdown, amenities list
- [ ] Emergency medical contacts (needed in footer)
- [ ] Doctor schedule for medical cell
- [ ] Housie schedule details
- [ ] GSC WhatsApp business number (currently none)
- [ ] Achievement metadata for historical images
- [ ] Cloudinary unsigned upload preset name
- [ ] Legal review — DPDP Act compliance before launch

---

## Footer — Emergency Contacts

Emergency medical contacts must appear in the global footer on every page.
Placeholder until manager provides actual numbers:

```
Medical Cell: [PENDING]
Emergency: [PENDING]
```

---

## External Links

- Coaching registration: external links only (no internal form)
- Event registration: external links only (no internal form)
- WhatsApp: not yet available
