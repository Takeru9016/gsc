# GSC — Schema Reference
# All Sanity document types and Drizzle database tables.
# Use /schema command to generate any specific schema.

---

## SANITY SCHEMAS

### Singletons (5)
Singletons are document types with a single instance. Locked in Sanity desk structure.

---

#### `aboutPage`
About page content and bye-laws PDF. One document.

```typescript
{
  _type: 'aboutPage',
  _id: 'aboutPage',
  historyText: portableText,       // Founding story, growth, legacy — rendered on /about
  historyImage: image,             // Historic photo — right column on /about
  byeLawsPdfUrl: string,           // Cloudinary URL of bye-laws PDF — shown on /about/bye-laws
  byeLawsUpdatedAt: date,          // Last updated date shown to visitors
}
```

---

#### `siteConfig`
Global site configuration. One document, always exists.

```typescript
{
  _type: 'siteConfig',
  siteName: string,              // "Goregaon Sports Club"
  siteUrl: string,               // "https://gsc.in"
  tagline: string,               // "Mumbai's Premier Sports Destination"
  phone: string,
  email: string,
  address: text,
  emergencyPhone: string,        // Medical cell — PENDING
  emergencyPhone2: string,       // Emergency — PENDING
  whatsapp: string,              // PENDING
  socialLinks: {
    instagram: string,
    facebook: string,
    youtube: string,
    twitter: string,
  },
  corporatePartners: array of {
    name: string,
    logo: image,
    url: string,
  },
  // Note: byeLawsPdfUrl lives in aboutPage singleton, not here
  metaTitle: string,
  metaDescription: string,
  ogImage: image,
}
```

---

#### `membershipConfig`
Membership settings and affiliated clubs. One document.

```typescript
{
  _type: 'membershipConfig',
  enrollmentOpen: boolean,       // Currently false — enrollment paused
  enrollmentNotice: text,        // Notice shown when closed
  affiliatedClubs: array of {
    name: string,
    location: string,
    reciprocalBenefits: text,
    logo: image,
  },
}
```

---

#### `bookingConfig`
Booking form configuration. One document.

```typescript
{
  _type: 'bookingConfig',
  bookingEmail: string,          // Email that receives booking inquiries
  responseTime: string,          // "We respond within 24 hours"
  rooms: array of {
    name: string,
    type: string,
    capacity: number,
  },
  banquetHalls: array of reference to banquetHall,
}
```

---

#### `leaguesConfig`
All 18 leagues. Single document, no sub-pages.

```typescript
{
  _type: 'leaguesConfig',
  leagues: array of {
    name: string,
    sport: string,
    format: string,              // T20, Singles, Doubles, etc.
    frequency: string,           // Annual, Biannual
    approximateDates: string,    // "March–April"
    description: text,
    isActive: boolean,
  },
}
```

---

### Documents (13)

---

#### `sport`
One document per sport. 24 documents total.

```typescript
{
  _type: 'sport',
  name: string,                  // "Badminton"
  slug: slug,                    // "badminton"
  category: string,              // outdoor | indoor | aquatic | health | track
  shortDescription: text,
  fullDescription: portableText,
  heroImage: image,
  gallery: array of image,
  schedule: array of {
    day: string,
    openTime: string,
    closeTime: string,
  },
  hasCoaching: boolean,
  coachingInfo: portableText,    // Only if hasCoaching: true
  coachName: string,
  coachingSchedule: text,
  coachingLevel: string,         // Beginner | Intermediate | Advanced | All
  externalRegistrationUrl: string,
  facilityDetails: portableText,
  threeObjectType: string,       // cricket-ball | shuttlecock | tennis-ball | water-sphere | none
  metaTitle: string,
  metaDescription: string,
  order: number,                 // Sort order
}
```

---

#### `committeeMember`
Club committee members. 4 roles.

```typescript
{
  _type: 'committeeMember',
  name: string,
  designation: string,           // "President", "Secretary", etc.
  role: string,                  // founderMember | promoterMember | officeBearer | governingCouncil
  photo: image,
  bio: text,
  order: number,
}
```

---

#### `milestone`
Club history milestones. Used in /about timeline.

```typescript
{
  _type: 'milestone',
  year: number,
  title: string,
  description: text,
  image: image,                  // optional
}
```

---

#### `achievement`
Member achievements. Images ARE the content.

```typescript
{
  _type: 'achievement',
  title: string,                 // "National Chess Championship 2023"
  sport: string,                 // Free text — matches filter
  level: string,                 // District | State | National | International
  type: string,                  // Individual | Team
  year: number,
  image: image,                  // PRIMARY content — the achievement post
  memberName: string,            // optional
  description: text,             // optional
  isApproved: boolean,           // Staff approves before publishing
}
```

---

#### `event`
Club events and tournaments.

```typescript
{
  _type: 'event',
  title: string,
  slug: slug,
  type: string,                  // Tournament | Cultural | League | Special
  status: string,                // upcoming | ongoing | past
  startDate: datetime,
  endDate: datetime,
  venue: string,
  heroImage: image,
  description: portableText,
  schedule: portableText,        // optional
  registrationUrl: string,       // external link — optional
  registrationDeadline: date,    // optional
  isFeatured: boolean,
  metaTitle: string,
  metaDescription: string,
}
```

---

#### `banquetHall`
3 banquet halls.

```typescript
{
  _type: 'banquetHall',
  name: string,                  // "Regal Hall"
  slug: slug,                    // "regal"
  tagline: string,
  capacity: number,              // PENDING from manager
  setupOptions: array of string, // Theatre, Banquet, Cocktail, etc.
  amenities: portableText,       // PENDING
  heroImage: image,
  gallery: array of image,
  description: portableText,
  floorPlanImage: image,         // optional
  metaTitle: string,
  metaDescription: string,
}
```

---

#### `diningVenue`
6 dining venues.

```typescript
{
  _type: 'diningVenue',
  name: string,
  slug: slug,
  tagline: string,
  type: string,                  // Veg | NonVeg | Mixed
  hasBar: boolean,               // Bleu only = true
  ageRestriction: number,        // Bleu only = 25
  cuisineType: string,
  heroImage: image,
  gallery: array of image,
  description: portableText,
  menuPdf: file,
  barMenuPdf: file,              // Bleu only
  openingHours: array of {
    day: string,
    hours: string,
  },
  seatingCapacity: number,
  reservationInfo: text,
  metaTitle: string,
  metaDescription: string,
}
```

---

#### `foodStall`
Named stalls inside Food Court.

```typescript
{
  _type: 'foodStall',
  name: string,
  description: text,
  image: image,
  cuisineType: string,
  isVeg: boolean,
  order: number,
}
```

---

#### `membershipType`
5 membership type detail pages.

```typescript
{
  _type: 'membershipType',
  type: string,                  // life | corporate | ward | service | yearly
  slug: slug,
  title: string,
  tagline: string,
  eligibility: portableText,
  benefits: portableText,
  feeStructure: portableText,    // Optional — display per policy decision
  isActive: boolean,             // All currently false
  order: number,
}
```

---

#### `partnershipOpportunity`
Partnership tiers and options for /partners.

```typescript
{
  _type: 'partnershipOpportunity',
  title: string,                 // "Title Sponsor", "Event Partner", etc.
  description: portableText,
  reachStats: string,
  benefits: array of string,
  isHighlighted: boolean,
  order: number,
}
```

---

#### `teamSpiritEdition`
Team Spirit magazine editions. 3 per year.

```typescript
{
  _type: 'teamSpiritEdition',
  editionName: string,           // "Summer 2024", "Diwali 2024"
  edition: string,               // Summer | Diwali | NewYear
  year: number,
  coverImage: image,
  description: text,
  publicationDate: date,
  pdfFile: file,                 // optional — if uploaded
  adSpecs: portableText,         // Ad sizes, rates, specs
}
```

---

#### `annualReport`
Annual reports for /partners/annual-report.

```typescript
{
  _type: 'annualReport',
  title: string,                 // "Annual Report 2023-24"
  year: string,
  coverImage: image,
  pdfFile: file,
  publishedDate: date,
}
```

---

#### `download`
Downloads and notices for /downloads.

```typescript
{
  _type: 'download',
  title: string,
  category: string,              // Notice | Circular | Form | Report
  file: file,
  fileSize: string,              // "2.4 MB" — optional, for display
  publishedDate: date,
  isActive: boolean,
}
```

---

#### `legalPage`
Legal content pages.

```typescript
{
  _type: 'legalPage',
  title: string,
  slug: slug,                    // privacy-policy | terms-of-use | cancellation
  content: portableText,
  lastUpdated: date,
  metaTitle: string,
  metaDescription: string,
}
```

---

## DRIZZLE SCHEMAS

### Enums

```typescript
// booking_type
export const bookingTypeEnum = pgEnum('booking_type', [
  'room', 'banquet', 'ground', 'coaching'
])

// booking_status
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending', 'reviewed', 'confirmed', 'rejected', 'cancelled'
])

// membership_status
export const membershipStatusEnum = pgEnum('membership_status', [
  'pending', 'reviewed', 'contacted', 'closed'
])

// contact_type
export const contactTypeEnum = pgEnum('contact_type', [
  'general', 'membership', 'event', 'partnership', 'media', 'leagues'
])

// contact_status
export const contactStatusEnum = pgEnum('contact_status', [
  'pending', 'reviewed', 'responded', 'closed'
])

// partner_status
export const partnerStatusEnum = pgEnum('partner_status', [
  'pending', 'reviewing', 'negotiating', 'active', 'declined'
])

// achievement_status
export const achievementStatusEnum = pgEnum('achievement_status', [
  'pending', 'approved', 'rejected'
])
```

---

### Tables

#### `booking_inquiries`

```typescript
export const bookingInquiries = pgTable('booking_inquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingType: bookingTypeEnum('booking_type').notNull(),
  // Room fields
  roomType: varchar('room_type', { length: 100 }),
  checkIn: date('check_in'),
  checkOut: date('check_out'),
  guests: integer('guests'),
  // Banquet fields
  hallPreference: varchar('hall_preference', { length: 100 }),
  eventType: varchar('event_type', { length: 100 }),
  guestCount: integer('guest_count'),
  eventDate: date('event_date'),
  // Ground fields
  sport: varchar('sport', { length: 100 }),
  groundDate: date('ground_date'),
  groundTime: varchar('ground_time', { length: 50 }),
  // Coaching fields
  coachingSport: varchar('coaching_sport', { length: 100 }),
  coachingLevel: varchar('coaching_level', { length: 50 }),
  // Common fields
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 300 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  message: text('message'),
  status: bookingStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  notes: text('notes'),          // Internal staff notes
})
```

---

#### `membership_inquiries`

```typescript
export const membershipInquiries = pgTable('membership_inquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  membershipType: varchar('membership_type', { length: 50 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 300 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  message: text('message'),
  status: membershipStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  notes: text('notes'),
})
```

---

#### `contact_inquiries`

```typescript
export const contactInquiries = pgTable('contact_inquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  contactType: contactTypeEnum('contact_type').default('general').notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 300 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  subject: varchar('subject', { length: 300 }).notNull(),
  message: text('message').notNull(),
  status: contactStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  notes: text('notes'),
})
```

---

#### `partner_inquiries`

```typescript
export const partnerInquiries = pgTable('partner_inquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 300 }).notNull(),
  contactName: varchar('contact_name', { length: 200 }).notNull(),
  email: varchar('email', { length: 300 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  partnershipType: varchar('partnership_type', { length: 100 }),
  message: text('message'),
  status: partnerStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  notes: text('notes'),
})
```

---

#### `achievement_submissions`

```typescript
export const achievementSubmissions = pgTable('achievement_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  memberName: varchar('member_name', { length: 200 }).notNull(),
  email: varchar('email', { length: 300 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  sport: varchar('sport', { length: 100 }).notNull(),
  achievementTitle: varchar('achievement_title', { length: 300 }).notNull(),
  level: varchar('level', { length: 50 }).notNull(),
  year: integer('year').notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }), // Cloudinary URL
  status: achievementStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  notes: text('notes'),
})
```

---

### ISR Cache Tags

| Sanity Document     | Cache Tag              | Revalidates                         |
|---------------------|------------------------|-------------------------------------|
| aboutPage           | `about-page`           | /about, /about/bye-laws             |
| siteConfig          | `site-config`          | Footer, Navbar, Partners logos      |
| bookingConfig       | `booking-config`       | /facilities/rooms, /booking         |
| sport               | `sports`               | /sports, /sports/[slug]             |
| committeeMember     | `committee`            | /about/team                         |
| milestone           | `milestones`           | /about                              |
| foodStall           | `food-stalls`          | /facilities/dining/food-court       |
| achievement         | `achievements`         | /achievements                       |
| event               | `events`               | /events, /events/[slug]             |
| banquetHall         | `banquets`             | /facilities/banquets/[hall]         |
| diningVenue         | `dining`               | /facilities/dining/[venue]          |
| membershipType      | `membership`           | /membership/[type]                  |
| partnershipOpportunity | `partners`          | /partners                           |
| teamSpiritEdition   | `team-spirit`          | /partners/team-spirit               |
| annualReport        | `annual-reports`       | /partners/annual-report             |
| download            | `downloads`            | /downloads                          |
| legalPage           | `legal`                | /legal, /legal/cancellation         |
| leaguesConfig       | `leagues`              | /events/leagues                     |
| membershipConfig    | `membership-config`    | /membership, /membership/affiliated |
