# GSC — Page Specifications
# Section-by-section breakdown for every page.
# Read the relevant section before building any page.

---

## Homepage — `/`

**Theme**: Hero always dark. Rest follows global theme.
**3D**: WebGL particle scene on hero (desktop). GSAP CSS fallback (mobile).

### Sections
1. **Hero** — Full viewport. "GOREGAON SPORTS CLUB" in Barlow Condensed 700. Subline: "Mumbai's Premier Sports Destination — 30+ Years, 23+ Sports, 40,000+ Members". WebGL particle convergence on load. GSAP scroll-out. CTA: "Explore Membership" + "View Facilities".
2. **Stats Bar** — 4 stats inline: 12,000+ Members | 2,000+ Daily Footfall | 23+ Sports | 30+ Years. Animated counter on scroll-enter.
3. **Sports Grid** — Headline: "World-Class Sports". 6 sport category cards in grid. Each card: sport image, category name, count of sports. Hover: slight lift + blue underline. Link to `/sports`.
4. **Facilities Showcase** — Headline: "Premium Facilities". Alternating left/right layout (image + text). 3 featured facilities: Banquets, Dining, Rooms. Each with brief description + CTA link.
5. **Events Preview** — Headline: "What's On". 3 upcoming events from Sanity. Event card: date badge, title, type pill, brief description. "View All Events" CTA → `/events`.
6. **Achievements Reel** — Headline: "Our Champions". Horizontal scroll or auto-scroll of recent achievement images. "View All Achievements" CTA → `/achievements`.
7. **Membership CTA** — Full-width dark section. Headline: "Become Part of the Legacy". Brief description. 5 membership type pills (Life, Corporate, Ward, Service, Yearly — all show "Express Interest"). Primary CTA → `/membership`.
8. **Partners Strip** — Logo strip of corporate partners. Subtle auto-scroll. "Partner With Us" CTA → `/partners`.

---

## About — `/about`

**Theme**: Hero dark. Rest follows global theme.

### Sections
1. **Hero** — "About GSC". Subline: "30+ Years of Sporting Excellence in Mumbai". Dark background.
2. **History & Legacy** — 2-column: left = longform text (founding story, growth, milestones), right = historic image. Text from Sanity `aboutPage` singleton.
3. **Key Stats** — 4-stat grid: Members, Daily Footfall, Sports, Years. Same counter animation as homepage.
4. **Milestones Timeline** — Vertical timeline. Year | Event description. Data from Sanity `milestone` documents. Sorted by year desc.
5. **Leadership Overview** — Brief intro to leadership + "Meet the Team" CTA → `/about/team`.
6. **Bye-Laws CTA** — "Club Governance" block. Brief text. CTA → `/about/bye-laws`.

---

## Team — `/about/team`

**Theme**: Follows global theme.

### Sections
1. **Hero** — "Club Committee". Subline: "The people who lead GSC forward."
2. **Role Filter** — 4 pill filters: Founder Members | Promoter Members | Office Bearers | Governing Council. Filter persists as URL param `?role=`.
3. **Committee Grid** — Card grid. Each card: photo, name, designation, role badge. Data from Sanity `committeeMember` documents.

---

## Bye-Laws — `/about/bye-laws`

**Theme**: Follows global theme.

### Sections
1. **Hero** — "Club Bye-Laws". Subline: "Official rules and governance of Goregaon Sports Club."
2. **PDF Viewer** — `react-pdf` viewer for bye-laws PDF. Cloudinary-hosted. Download button.
3. **Contact Block** — "Questions about membership rules? Contact us." CTA → `/contact`.

---

## Contact — `/contact`

**Theme**: Follows global theme.

### Sections
1. **Hero** — "Get In Touch". Subline: "We're here to help."
2. **Split Panel** — Left: contact form. Right: club address, phone, email, map embed.
3. **Contact Form** — Fields: Name, Email, Phone (optional), Subject (dropdown: General | Membership | Event | Partnership | Media), Message. Submits to `/api/contact`.
4. **Emergency Contacts** — Medical cell + emergency numbers. `[PENDING_CONTENT]`.

---

## Legal — `/legal`

**Theme**: Follows global theme.

### Sections
1. **Hero** — "Legal & Policies".
2. **Policy Links** — Cards: Privacy Policy | Terms of Use | Cancellation Policy. Each with brief description and "Read" CTA.
3. **CMS Content** — Privacy Policy + Terms loaded from Sanity `legalPage` documents via slug.

---

## Cancellation — `/legal/cancellation`

### Sections
1. **Hero** — "Cancellation & Refund Policy".
2. **Policy Content** — From Sanity `legalPage` document (slug: `cancellation`). Rendered as rich text.

---

## Sports Hub — `/sports`

**Theme**: Hero always dark.
**3D**: 6-scene WebGL scroll experience (desktop). GSAP CSS fallback (mobile). Build fallback first.

### Sections
1. **Hero** — "23+ Sports. One Club." Dark full-viewport. GSAP enter animation.
2. **3D Scroll Experience** — 6 pinned scroll scenes (desktop WebGL) / animated category cards (mobile GSAP). Scene breakdown in `docs/3D.md`.
3. **Sports Category Grid** — After 3D section. All sports grouped by category: Outdoor / Indoor / Aquatic / Health & Fitness / Track. Card grid per category. Each card links to `/sports/[slug]`.
4. **Coaching CTA** — "Train with the Best" block. CTA → `/sports/coaching`.

---

## Sport Detail — `/sports/[slug]`

**Template**: 24 sport pages from one template.
**Theme**: Hero always dark.
**3D**: Contained ambient 3D object in hero (desktop only). 4 objects available — see GSC.md.

### Sections
1. **Hero** — Sport name in Barlow Condensed. Category badge. Brief description. 3D object (desktop) or static image (mobile). Background: dark.
2. **About the Sport** — Rich text from Sanity. Facility description, court/equipment info.
3. **Schedule / Timings** — Days + hours. Structured field from Sanity `sport` document.
4. **Coaching** — If `hasCoaching: true` in Sanity — show coaching info + CTA. If false — hide section.
5. **Achievements** — If sport has achievements — show last 3 achievement cards. "View All" → `/achievements?sport=[slug]`.
6. **Booking CTA** — "Book This Facility" → `/booking?type=ground&sport=[slug]`.

---

## Coaching — `/sports/coaching`

### Sections
1. **Hero** — "Coaching Programs". Subline: "Expert coaching across 10+ disciplines."
2. **Sport Filter** — Pills to filter by sport category.
3. **Coaching Cards** — Grid. Each card: sport, coach name, schedule, level, external registration link. Data from Sanity `sport` documents where `hasCoaching: true`.

---

## Events Hub — `/events`

### Sections
1. **Hero** — "Events at GSC". Subline: "Tournaments, leagues, and celebrations."
2. **Filter Bar** — Status: Upcoming | Ongoing | Past. Type: Tournament | Cultural | League | Special. Filters update URL params.
3. **Events Grid** — Card grid. Each card: date, title, type badge, thumbnail, brief description. Links to `/events/[slug]`.
4. **Leagues CTA** — "View All 18 Leagues" → `/events/leagues`.

---

## Event Detail — `/events/[slug]`

### Sections
1. **Hero** — Event name, date range, type badge. Hero image.
2. **Event Details** — Date, venue, description, schedule. Rich text from Sanity.
3. **Registration** — External link button if `registrationUrl` present. Otherwise "Registration Closed" state.
4. **Related Events** — 3 events of same type. "View All" → `/events`.

---

## Leagues — `/events/leagues`

**Terminal page — no sub-pages. All 18 leagues on one page.**

### Sections
1. **Hero** — "GSC Leagues". Subline: "18 competitive leagues across 12+ sports."
2. **Sport Filter** — Filter leagues by sport.
3. **Leagues Grid** — Each league: sport name, league format (T20/Singles/Doubles etc.), frequency, approximate dates, brief description. Data from Sanity `leaguesConfig` singleton.
4. **Participate CTA** — "Interested in competing?" → `/contact?subject=leagues`.

---

## Facilities Hub — `/facilities`

### Sections
1. **Hero** — "World-Class Facilities". Dark hero.
2. **Category Navigation** — Large cards: Rooms | Banquets | Dining | Recreation | Sports Shop | Wellness | Library | Medical. Each links to sub-section.
3. **Quick Stats** — 3 banquet halls | 6 dining venues | 18 rooms. Stat bar.

---

## Rooms — `/facilities/rooms`

### Sections
1. **Hero** — "Guest Rooms". Subline: "18 comfortable rooms for members and guests."
2. **Room Grid** — Card per room type. Photo, room type, amenities list, capacity. `[PENDING_CONTENT]` from manager.
3. **Booking CTA** — "Check Availability" → `/booking?type=room`.

---

## Banquets Hub — `/facilities/banquets`

### Sections
1. **Hero** — "Banquet Halls". Subline: "3 premium event venues for every occasion."
2. **Hall Cards** — 3 cards: Regal | Rhythm | Glamourra. Each: photo, capacity `[PENDING]`, brief description, CTA → `/facilities/banquets/[hall]`.
3. **Inquiry CTA** — "Plan Your Event" → `/booking?type=banquet`.

---

## Banquet Hall — `/facilities/banquets/[hall]`

**Template**: 3 pages (regal, rhythm, glamourra).

### Sections
1. **Hero** — Hall name. Capacity badge `[PENDING]`. Dark hero with hall image.
2. **Gallery** — Photo grid. Images from Sanity `banquetHall` document.
3. **Details** — Capacity, setup options, AV equipment, catering info. `[PENDING_CONTENT]`.
4. **Booking CTA** — "Inquire About [Hall Name]" → `/booking?type=banquet&hall=[slug]`.

---

## Dining Hub — `/facilities/dining`

### Sections
1. **Hero** — "Dining at GSC". Subline: "6 restaurants and cafes, from fine dining to casual bites."
2. **Venue Cards** — 6 cards. Each: photo, name, type (Veg/Non-Veg badge), brief description, hours, CTA → `/facilities/dining/[slug]`.
3. **Note** — Bleu Restobar card shows "25+ | Bar Available" badge.

---

## Dining Venue — `/facilities/dining/[slug]`

**Template**: 6 venue pages.

### Sections
1. **Hero** — Venue name. Type badge. Hours. Dark hero.
2. **Bleu Restobar Only** — Age disclaimer banner: "Bleu Restobar serves alcoholic beverages. Entry restricted to guests 25 years and above. Valid ID required."
3. **About** — Description, cuisine type, seating capacity. Rich text from Sanity.
4. **Menu** — `menuPDF` from Sanity → PDF viewer or "View Menu" link. `barMenuPDF` for Bleu only.
5. **Gallery** — Photo grid from Sanity.
6. **Hours & Contact** — Operating hours, reservation info.

---

## Recreation Hub — `/facilities/recreation`

### Sections
1. **Hero** — "Recreation & Leisure".
2. **Category Cards** — Kids Zone | Cards Room | Housie. Each with photo, brief description, CTA.

---

## Kids Zone — `/facilities/recreation/kids-zone`

### Sections
1. **Hero** — "Kids Zone". Age range, hours.
2. **About** — Activities, equipment, supervision info.
3. **Timings** — Schedule grid.

---

## Cards Room — `/facilities/recreation/cards-room`

### Sections
1. **Hero** — "Cards Room".
2. **About** — Games available, rules, membership requirement.
3. **Timings** — Operating hours.

---

## Housie — `/facilities/recreation/housie`

### Sections
1. **Hero** — "Housie Nights".
2. **About** — Format, frequency, prizes. `[PENDING_CONTENT]` — schedule from manager.
3. **Schedule** — `[PENDING_CONTENT]`.

---

## Sports Shop — `/facilities/sports-shop`

### Sections
1. **Hero** — "Sports Shop".
2. **About** — What's stocked: equipment, apparel, accessories.
3. **Hours + Location** — Within club premises. Operating hours.

---

## Massage Chairs — `/facilities/massage-chairs`

### Sections
1. **Hero** — "Massage Chair Area". (Note: same as "Massage Center" in old site.)
2. **About** — Number of chairs, models, session duration, pricing or token system.
3. **Hours** — Operating hours.

---

## Library — `/facilities/library`

### Sections
1. **Hero** — "Club Library".
2. **About** — Collection size, genres, reading room details.
3. **Hours** — Operating hours.

---

## Medical Cell — `/facilities/medical-cell`

### Sections
1. **Hero** — "Medical Cell".
2. **About** — Facilities, equipment, purpose.
3. **Doctor Schedule** — `[PENDING_CONTENT]` from manager.
4. **Emergency Contacts** — Medical cell number + emergency number. `[PENDING_CONTENT]`.

---

## Booking — `/booking`

**Unified inquiry page for all 4 booking types.**

### Sections
1. **Hero** — "Book a Facility". Subline: "Room, banquet, ground, or coaching — one form."
2. **Type Selector** — 4 pill tabs: Room | Banquet | Ground | Coaching. URL param `?type=`.
3. **Booking Form** — Fields change per type. See `docs/FORMS.md` for full field list per type.
4. **Contact Info** — "Prefer to call?" — club phone number.

---

## Membership Hub — `/membership`

### Sections
1. **Hero** — "Join the GSC Family". Dark hero. Subline: "12,000+ members. A legacy 30 years strong."
2. **Status Notice** — Prominent notice: "Membership enrollment is currently paused. Express your interest and we'll notify you when enrollment opens."
3. **Membership Type Cards** — 5 cards: Life | Corporate | Ward | Service | Yearly. Each: title, eligibility summary, benefits brief, "Express Interest" CTA → `/membership/[type]`.
4. **Affiliated Clubs** — Brief section. "Member of other clubs?" CTA → `/membership/affiliated-clubs`.

---

## Membership Type — `/membership/[type]`

**Template**: 5 pages (life, corporate, ward, service, yearly).

### Sections
1. **Hero** — "[Type] Membership". Eligibility badge.
2. **Eligibility** — Who qualifies. From Sanity `membershipType` document.
3. **Benefits** — List of membership benefits. Rich text.
4. **Fees** — Fee structure table. `[Note: display or hide pending policy decision]`.
5. **Interest Form** — "Express Interest" form. Fields: Name, Email, Phone, Message (optional). Submits to `/api/membership`. NOT an enrollment form — interest capture only.
6. **Yearly type special note** — "Available to children and parents of Life Members, and senior citizens 65 years and above."

---

## Affiliated Clubs — `/membership/affiliated-clubs`

### Sections
1. **Hero** — "Affiliated Club Members".
2. **About** — GSC's club affiliations, reciprocal benefits.
3. **Affiliated Club List** — From Sanity `membershipConfig` singleton. Club name, location, reciprocal benefits.

---

## Achievements — `/achievements`

### Sections
1. **Hero** — "Our Champions". Subline: "Celebrating GSC athletes across decades."
2. **Filter Bar** — 4 filters: Sport | Level | Type | Year. Dropdowns. Filters update URL params.
3. **Achievement Grid** — Masonry or uniform grid. Each item: achievement image (IS the content), sport tag, level badge, year. Clicking opens image in lightbox (Dialog from shadcn).
4. **Submit Achievement** — "Are you a GSC champion?" CTA → opens submission form modal. Fields: Name, Sport, Achievement details, Year, Photo upload (Cloudinary). Submits to `/api/achievement`.

---

## Partners — `/partners`

### Sections
1. **Hero** — "Partner With GSC". Dark hero. Subline: "Reach 40,000+ members and 2,000+ daily visitors."
2. **Why Partner** — 3 value proposition cards: Audience Reach | Brand Visibility | Community Impact.
3. **Partnership Opportunities** — Grid of `partnershipOpportunity` documents from Sanity. Each: opportunity name, description, reach stats, CTA.
4. **Team Spirit** — "Advertise in Team Spirit" block. Brief on 3 editions/year. CTA → `/partners/team-spirit`.
5. **Partner Inquiry Form** — Fields: Company Name, Contact Name, Email, Phone, Partnership Type (select), Message. Submits to `/api/partner`.
6. **Current Partners** — Logo grid of current corporate partners. From Sanity `siteConfig`.

---

## Team Spirit — `/partners/team-spirit`

### Sections
1. **Hero** — "Team Spirit Magazine". "GSC's Member Magazine — 3 Editions Per Year."
2. **About** — What Team Spirit is, readership, distribution.
3. **Editions** — 3 cards: Summer | Diwali | New Year. Each: edition name, theme, publication month, PDF viewer if uploaded. From Sanity `teamSpiritEdition` documents.
4. **Advertise** — Ad sizes, rates, specs. From Sanity. Inquiry CTA → `/partners#inquiry`.

---

## Annual Report — `/partners/annual-report`

### Sections
1. **Hero** — "Annual Reports". "Transparency and accountability."
2. **Report List** — 2–3 reports. Each: year, cover image, "Download PDF" button. From Sanity `annualReport` documents. `react-pdf` viewer or direct Cloudinary link.

---

## Downloads — `/downloads`

**Absorbs old /Notice and /Downloads URLs.**

### Sections
1. **Hero** — "Downloads & Notices". Subline: "Official club documents and notices."
2. **Filter** — Category: All | Notices | Circulars | Forms | Reports.
3. **Downloads List** — Table or card list. Each: title, category badge, date, file size, download button. From Sanity `download` documents. Sorted by date desc.

---

## Not Found — `/not-found`

### Sections
1. **Full page** — GSC branding. "404 — Page Not Found." Brief message. CTA: "Go Home" + "Contact Us".
