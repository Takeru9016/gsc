# GSC — Sanity Data Entry Prompts
# Use these prompts to populate Sanity Studio with real GSC content.
# Run AFTER Task 1A-07 (Sanity setup) is complete and Studio is accessible at /studio.
#
# HOW TO USE:
# 1. Open Sanity Studio at localhost:3000/studio (or your Vercel URL/studio)
# 2. For each section below, Claude Code writes a script that seeds the data via Sanity client
# 3. Paste the prompt into Claude Code → it generates a seed script → you run it once
# 4. Verify entries appear in Studio
# 5. Fill in [PENDING] fields manually in Studio UI
#
# ALTERNATIVELY — manual entry:
# Use this file as a checklist while filling in Studio by hand.
# Each [FILLED] field has the real value. Each [PENDING] needs you to copy from gsc.in.

---

## PROMPT 1 — Seed siteConfig Singleton

```
Write a one-time seed script at scripts/seed-site-config.ts that uses the Sanity client
to create or replace the siteConfig singleton document.

Use this exact data:

{
  _id: 'siteConfig',
  _type: 'siteConfig',
  siteName: 'Goregaon Sports Club',
  siteUrl: 'https://gsc.in',
  tagline: "Mumbai's Premier Sports Destination",
  phone: '02235244110',
  phone2: '02235244200',
  email: 'mail@gsc.in',
  bookingEmail: 'booking@gsc.in',
  address: 'New Link Rd, near Toyota showroom, Malad, Mindspace, Malad West, Mumbai, Maharashtra 400064',
  emergencyPhone: '[PENDING — medical cell number from manager]',
  emergencyPhone2: '[PENDING — emergency number from manager]',
  whatsapp: '[PENDING — WhatsApp business number if available]',
  heroVideoUrl: 'https://www.gsc.in/public/user/images/GSC.mp4',
  socialLinks: {
    facebook: 'https://www.facebook.com/gscclubofficial/',
    instagram: 'https://www.instagram.com/goregaonsportsclub/',
    twitter: 'https://twitter.com/gscmalad',
    youtube: 'https://www.youtube.com/channel/UCnVyklfhx3Koczo4_iU_wpA',
  },
  metaTitle: 'Goregaon Sports Club — Mumbai\'s Premier Sports Destination',
  metaDescription: 'Goregaon Sports Club offers 23+ sports, premium facilities, banquets, dining, and membership for 12,000+ members in Mumbai.',
}

Use the Sanity client with the write token (process.env.SANITY_API_TOKEN).
Use createOrReplace() so it's safe to run multiple times.
Add a pnpm script: "seed:site-config": "tsx scripts/seed-site-config.ts"
Print "siteConfig seeded successfully" on completion.
```

---

## PROMPT 2 — Seed membershipConfig Singleton

```
Write a one-time seed script at scripts/seed-membership-config.ts

Data:

{
  _id: 'membershipConfig',
  _type: 'membershipConfig',
  enrollmentOpen: false,
  enrollmentNotice: 'Membership enrollment is currently paused. Express your interest and we will notify you when enrollment opens.',
  affiliatedClubs: [
    '[PENDING — get affiliated club names and details from gsc.in/Affiliated-Clubs]'
  ]
}

Use createOrReplace(). Add pnpm script "seed:membership-config".
```

---

## PROMPT 3 — Seed leaguesConfig Singleton

```
Write a one-time seed script at scripts/seed-leagues-config.ts

Use this exact leagues data — all 18 leagues GSC runs annually:

{
  _id: 'leaguesConfig',
  _type: 'leaguesConfig',
  leagues: [
    { name: 'Cricket T20 League', sport: 'Cricket', format: 'T20', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Cricket Test League', sport: 'Cricket', format: 'Test', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: "Women's Cricket League", sport: 'Cricket', format: 'Limited Overs', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Basketball League', sport: 'Basketball', format: 'League', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Badminton Singles League', sport: 'Badminton', format: 'Singles', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Badminton Doubles League', sport: 'Badminton', format: 'Doubles', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Lawn Tennis Singles League', sport: 'Lawn Tennis', format: 'Singles', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Lawn Tennis Doubles League', sport: 'Lawn Tennis', format: 'Doubles', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Table Tennis League', sport: 'Table Tennis', format: 'Singles', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Squash League', sport: 'Squash', format: 'Singles', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Volleyball League', sport: 'Volleyball', format: 'League', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Swimming League', sport: 'Swimming', format: 'Relay + Individual', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Chess League', sport: 'Chess', format: 'Swiss System', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Carrom League', sport: 'Carrom', format: 'Singles', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Billiards League', sport: 'Billiards', format: 'League', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Snooker League', sport: 'Snooker', format: 'League', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Gymnastics League', sport: 'Gymnastics', format: 'Competition', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
    { name: 'Athletics League', sport: 'Athletics', format: 'Track & Field', frequency: 'Annual', approximateDates: '[PENDING]', description: '[PENDING]', isActive: false },
  ]
}

Use createOrReplace(). Add pnpm script "seed:leagues-config".
Note: [PENDING] fields will be filled in Sanity Studio manually after seeding.
```

---

## PROMPT 4 — Seed All 24 Sport Documents

```
Write a one-time seed script at scripts/seed-sports.ts

Create all 24 sport documents. Use createOrReplace() keyed by slug.
Add pnpm script "seed:sports".

Sports data — fill exactly as listed:

OUTDOOR SPORTS (7):
{
  _type: 'sport',
  name: 'Cricket Ground',
  slug: { current: 'cricket-ground' },
  category: 'outdoor',
  shortDescription: 'Six acres of open ground for cricket with professional facilities.',
  hasCoaching: true,
  threeObjectType: 'cricket-ball',
  order: 1,
  // fullDescription, schedule, coachName, coachingSchedule — [PENDING: copy from gsc.in/Cricket-Ground]
},
{
  _type: 'sport',
  name: 'Cricket Nets',
  slug: { current: 'cricket-nets' },
  category: 'outdoor',
  shortDescription: 'Dedicated cricket nets for practice and coaching.',
  hasCoaching: true,
  threeObjectType: 'cricket-ball',
  order: 2,
  // [PENDING: copy from gsc.in/Cricket-nets]
},
{
  _type: 'sport',
  name: 'Basketball',
  slug: { current: 'basketball' },
  category: 'outdoor',
  shortDescription: 'Full-size basketball court for members.',
  hasCoaching: false,
  threeObjectType: 'none',
  order: 3,
  // [PENDING: copy from gsc.in/Basketball]
},
{
  _type: 'sport',
  name: 'Lawn Tennis',
  slug: { current: 'lawn-tennis' },
  category: 'outdoor',
  shortDescription: 'Professional lawn tennis courts.',
  hasCoaching: true,
  threeObjectType: 'tennis-ball',
  order: 4,
  // [PENDING: copy from gsc.in/Lawn-Tennis]
},
{
  _type: 'sport',
  name: 'Volleyball',
  slug: { current: 'volleyball' },
  category: 'outdoor',
  shortDescription: 'Outdoor volleyball court for competitive and recreational play.',
  hasCoaching: false,
  threeObjectType: 'none',
  order: 5,
  // [PENDING: copy from gsc.in/Volleyball]
},
{
  _type: 'sport',
  name: 'Cycling',
  slug: { current: 'cycling' },
  category: 'outdoor',
  shortDescription: 'Cycling facilities for members.',
  hasCoaching: false,
  threeObjectType: 'none',
  order: 6,
  // [PENDING: copy from gsc.in/Cycling]
},
{
  _type: 'sport',
  name: 'Skating',
  slug: { current: 'skating' },
  category: 'outdoor',
  shortDescription: 'Skating rink for members and children.',
  hasCoaching: true,
  threeObjectType: 'none',
  order: 7,
  // [PENDING: copy from gsc.in/Skating]
},

INDOOR SPORTS (11):
{
  _type: 'sport',
  name: 'Badminton',
  slug: { current: 'badminton' },
  category: 'indoor',
  shortDescription: 'Professional badminton courts for singles and doubles play.',
  hasCoaching: true,
  threeObjectType: 'shuttlecock',
  order: 8,
  // [PENDING: copy from gsc.in/Badminton]
},
{
  _type: 'sport',
  name: 'Squash',
  slug: { current: 'squash' },
  category: 'indoor',
  shortDescription: 'International standard squash courts.',
  hasCoaching: true,
  threeObjectType: 'none',
  order: 9,
  // [PENDING: copy from gsc.in/Squash]
},
{
  _type: 'sport',
  name: 'Table Tennis',
  slug: { current: 'table-tennis' },
  category: 'indoor',
  shortDescription: 'Table tennis facility for all skill levels.',
  hasCoaching: true,
  threeObjectType: 'none',
  order: 10,
  // [PENDING: copy from gsc.in/Table-Tennis]
},
{
  _type: 'sport',
  name: 'Billiards & Snooker',
  slug: { current: 'billiards-snooker' },
  category: 'indoor',
  shortDescription: 'Full-size billiards and snooker tables.',
  hasCoaching: false,
  threeObjectType: 'none',
  order: 11,
  // [PENDING: copy from gsc.in/Billiards]
},
{
  _type: 'sport',
  name: 'Chess',
  slug: { current: 'chess' },
  category: 'indoor',
  shortDescription: 'Chess facilities with coaching available.',
  hasCoaching: true,
  threeObjectType: 'none',
  order: 12,
  // [PENDING: copy from gsc.in/Chess]
},
{
  _type: 'sport',
  name: 'Carrom',
  slug: { current: 'carrom' },
  category: 'indoor',
  shortDescription: 'Carrom boards for recreational and competitive play.',
  hasCoaching: false,
  threeObjectType: 'none',
  order: 13,
  // [PENDING: copy from gsc.in/CARROM]
},
{
  _type: 'sport',
  name: 'Gymnastics',
  slug: { current: 'gymnastics' },
  category: 'indoor',
  shortDescription: 'Fully equipped gymnastics facility with professional coaching.',
  hasCoaching: true,
  threeObjectType: 'none',
  order: 14,
  // [PENDING: copy from gsc.in/Gymnastics]
},
{
  _type: 'sport',
  name: 'Aerobics',
  slug: { current: 'aerobics' },
  category: 'indoor',
  shortDescription: 'Group aerobics classes for all fitness levels.',
  hasCoaching: true,
  threeObjectType: 'none',
  order: 15,
  // [PENDING: copy from gsc.in/Aerobics]
},
{
  _type: 'sport',
  name: 'Yoga',
  slug: { current: 'yoga' },
  category: 'indoor',
  shortDescription: 'Yoga classes for mind and body wellness.',
  hasCoaching: true,
  threeObjectType: 'none',
  order: 16,
  // [PENDING: copy from gsc.in/Yoga]
},
{
  _type: 'sport',
  name: 'Pistol Shooting',
  slug: { current: 'pistol-shooting' },
  category: 'indoor',
  shortDescription: 'Indoor pistol shooting range.',
  hasCoaching: true,
  threeObjectType: 'none',
  order: 17,
  // [PENDING: copy from gsc.in/pistol-shooting]
},
{
  _type: 'sport',
  name: 'Indoor Cricket Nets',
  slug: { current: 'indoor-cricket-nets' },
  category: 'indoor',
  shortDescription: 'Indoor cricket nets for year-round practice.',
  hasCoaching: true,
  threeObjectType: 'cricket-ball',
  order: 18,
  // [PENDING: copy from gsc.in/indoor-cricket-nets]
},

AQUATIC (1):
{
  _type: 'sport',
  name: 'Swimming Pool',
  slug: { current: 'swimming-pool' },
  category: 'aquatic',
  shortDescription: 'Olympic standard swimming pool with coaching.',
  hasCoaching: true,
  threeObjectType: 'water-sphere',
  order: 19,
  // [PENDING: copy from gsc.in/Swimming-Pool]
},

HEALTH & FITNESS (3):
{
  _type: 'sport',
  name: 'Gym',
  slug: { current: 'gym' },
  category: 'health',
  shortDescription: 'Fully equipped modern gym with professional trainers.',
  hasCoaching: true,
  threeObjectType: 'none',
  order: 20,
  // [PENDING: copy from gsc.in/Gym]
},
{
  _type: 'sport',
  name: 'Burnout CrossFit',
  slug: { current: 'burnout-crossfit' },
  category: 'health',
  shortDescription: 'High-intensity CrossFit training centre.',
  hasCoaching: true,
  threeObjectType: 'none',
  order: 21,
  // [PENDING: copy from gsc.in/Burnout-Crossfit]
},
{
  _type: 'sport',
  name: 'Open Gym',
  slug: { current: 'open-gym' },
  category: 'health',
  shortDescription: 'Open-air gym facilities for outdoor workouts.',
  hasCoaching: false,
  threeObjectType: 'none',
  order: 22,
  // [PENDING: copy from gsc.in/Open-Gym]
},

TRACK (2):
{
  _type: 'sport',
  name: 'Walking Track',
  slug: { current: 'walking-track' },
  category: 'track',
  shortDescription: 'Dedicated walking and jogging track.',
  hasCoaching: false,
  threeObjectType: 'none',
  order: 23,
  // [PENDING: copy from gsc.in/Walking-Track]
},
{
  _type: 'sport',
  name: 'Pebble Walk',
  slug: { current: 'pebble-walk' },
  category: 'track',
  shortDescription: 'Therapeutic pebble walk path.',
  hasCoaching: false,
  threeObjectType: 'none',
  order: 24,
  // [PENDING: copy from gsc.in/Pebble-Walk-GSC]
},
```

---

## PROMPT 5 — Seed 3 Banquet Hall Documents

```
Write a one-time seed script at scripts/seed-banquets.ts

Create 3 banquetHall documents using createOrReplace():

{
  _type: 'banquetHall',
  name: 'Regal Hall',
  slug: { current: 'regal' },
  tagline: 'Grand elegance for your most special occasions.',
  capacity: '[PENDING — get from manager]',
  setupOptions: ['Banquet', 'Theatre', 'Cocktail', 'Conference'],
  description: '[PENDING — copy from gsc.in/Regal]',
  order: 1,
},
{
  _type: 'banquetHall',
  name: 'Rhythm Hall',
  slug: { current: 'rhythm' },
  tagline: 'Where celebrations find their rhythm.',
  capacity: '[PENDING — get from manager]',
  setupOptions: ['Banquet', 'Theatre', 'Cocktail'],
  description: '[PENDING — copy from gsc.in/Rhythm]',
  order: 2,
},
{
  _type: 'banquetHall',
  name: 'Glamourra Hall',
  slug: { current: 'glamourra' },
  tagline: 'Glamour and grandeur in every detail.',
  capacity: '[PENDING — get from manager]',
  setupOptions: ['Banquet', 'Theatre', 'Cocktail'],
  description: '[PENDING — copy from gsc.in/Glamourra]',
  order: 3,
},

Add pnpm script "seed:banquets".
```

---

## PROMPT 6 — Seed 6 Dining Venue Documents

```
Write a one-time seed script at scripts/seed-dining.ts

Create 6 diningVenue documents using createOrReplace():

{
  _type: 'diningVenue',
  name: 'Golden Peacock',
  slug: { current: 'golden-peacock' },
  tagline: 'Fine dining in an elegant setting.',
  type: 'Veg',
  hasBar: false,
  cuisineType: 'Multi-cuisine Vegetarian',
  description: '[PENDING — copy from gsc.in/resturant]',
  order: 1,
},
{
  _type: 'diningVenue',
  name: 'Water Front Cafe',
  slug: { current: 'water-front-cafe' },
  tagline: 'Casual dining with a scenic outdoor setting.',
  type: 'Veg',
  hasBar: false,
  cuisineType: 'Cafe, Snacks, Beverages',
  description: '[PENDING — copy from gsc.in/resturant]',
  order: 2,
},
{
  _type: 'diningVenue',
  name: 'Bleu Restobar',
  slug: { current: 'bleu-restobar' },
  tagline: 'Premium non-vegetarian dining and bar experience.',
  type: 'NonVeg',
  hasBar: true,
  ageRestriction: 25,
  cuisineType: 'Multi-cuisine Non-Vegetarian',
  description: '[PENDING — copy from gsc.in/resturant]',
  order: 3,
},
{
  _type: 'diningVenue',
  name: 'Flavours',
  slug: { current: 'flavours' },
  tagline: 'A burst of flavours for every palate.',
  type: 'Veg',
  hasBar: false,
  cuisineType: 'Multi-cuisine Vegetarian',
  description: '[PENDING — copy from gsc.in/resturant]',
  order: 4,
},
{
  _type: 'diningVenue',
  name: 'Cookie Dough Cafe',
  slug: { current: 'cookie-dough-cafe' },
  tagline: 'Quick service restaurant for snacks and desserts.',
  type: 'Veg',
  hasBar: false,
  cuisineType: 'QSR, Desserts, Beverages',
  description: '[PENDING — copy from gsc.in/resturant]',
  order: 5,
},
{
  _type: 'diningVenue',
  name: 'Food Court',
  slug: { current: 'food-court' },
  tagline: 'Multiple cuisines under one roof.',
  type: 'Mixed',
  hasBar: false,
  cuisineType: 'Multi-stall food court',
  description: '[PENDING — copy from gsc.in/resturant]',
  order: 6,
},

Add pnpm script "seed:dining".
```

---

## PROMPT 7 — Seed 5 Membership Type Documents

```
Write a one-time seed script at scripts/seed-membership-types.ts

Create 5 membershipType documents using createOrReplace():

{
  _type: 'membershipType',
  type: 'life',
  slug: { current: 'life' },
  title: 'Life Membership',
  tagline: 'A lifetime of sporting excellence and community.',
  isActive: false,
  order: 1,
  // eligibility, benefits, feeStructure — [PENDING: copy from gsc.in/membership-1]
},
{
  _type: 'membershipType',
  type: 'corporate',
  slug: { current: 'corporate' },
  title: 'Corporate Membership',
  tagline: 'Premium membership for corporate entities.',
  isActive: false,
  order: 2,
  // [PENDING: copy from gsc.in/membership-1]
},
{
  _type: 'membershipType',
  type: 'ward',
  slug: { current: 'ward' },
  title: 'Ward Membership',
  tagline: 'Membership for ward-level participation.',
  isActive: false,
  order: 3,
  // [PENDING: copy from gsc.in/membership-1]
},
{
  _type: 'membershipType',
  type: 'service',
  slug: { current: 'service' },
  title: 'Service Membership',
  tagline: 'Membership for service category members.',
  isActive: false,
  order: 4,
  // [PENDING: copy from gsc.in/membership-1]
},
{
  _type: 'membershipType',
  type: 'yearly',
  slug: { current: 'yearly' },
  title: 'Yearly Membership',
  tagline: 'Annual membership for eligible members.',
  isActive: false,
  eligibilityNote: 'Available to children and parents of Life Members, and senior citizens 65 years and above.',
  order: 5,
  // [PENDING: copy from gsc.in/membership-1]
},

Add pnpm script "seed:membership-types".
```

---

## PROMPT 8 — Seed Legal Pages

```
Write a one-time seed script at scripts/seed-legal-pages.ts

Create 3 legalPage documents using createOrReplace():

{
  _type: 'legalPage',
  title: 'Privacy Policy & Terms of Use',
  slug: { current: 'privacy-policy' },
  lastUpdated: new Date().toISOString().split('T')[0],
  // content — [PENDING: copy from gsc.in/Privacy-Terms-and-Condition]
},
{
  _type: 'legalPage',
  title: 'Terms of Use',
  slug: { current: 'terms-of-use' },
  lastUpdated: new Date().toISOString().split('T')[0],
  // content — [PENDING: copy from gsc.in/Privacy-Terms-and-Condition]
},
{
  _type: 'legalPage',
  title: 'Cancellation & Refund Policy',
  slug: { current: 'cancellation' },
  lastUpdated: new Date().toISOString().split('T')[0],
  // content — [PENDING: copy from gsc.in/cancellation-refund-policy]
},

Note: content fields will be filled manually in Sanity Studio after seeding the shells.
Add pnpm script "seed:legal".
```

---

## PROMPT 9 — Master Seed Script

```
Write a master seed script at scripts/seed-all.ts that runs all seed scripts in sequence:

1. seed-site-config.ts
2. seed-membership-config.ts
3. seed-leagues-config.ts
4. seed-sports.ts
5. seed-banquets.ts
6. seed-dining.ts
7. seed-membership-types.ts
8. seed-legal-pages.ts

Add pnpm script: "seed": "tsx scripts/seed-all.ts"

Each script should log its name before running and "✓ done" after.
If any script throws, catch and log the error but continue running the rest.
Print a final summary: "Seeding complete. X/8 scripts succeeded."

Also install tsx as a dev dependency if not already present:
pnpm add -D tsx
```

---

## MANUAL ENTRY CHECKLIST

After running the seed scripts, these fields need to be filled manually in Sanity Studio.
Open each document type and fill in the [PENDING] fields.

### Source URLs from old site (open each in browser, copy content):

```
About / History:     gsc.in/the-club
Sports (each):       gsc.in/[Sport-Name]  (e.g. gsc.in/Badminton)
Banquet halls:       gsc.in/Regal  |  gsc.in/Rhythm  |  gsc.in/Glamourra
Dining venues:       gsc.in/resturant  (all venues on one page)
Membership:          gsc.in/membership-1
Affiliated clubs:    gsc.in/Affiliated-Clubs
Legal:               gsc.in/Privacy-Terms-and-Condition
Cancellation:        gsc.in/cancellation-refund-policy
Annual reports:      gsc.in/GSC-Annual-Report
Team Spirit:         gsc.in/Team-Spirit
Downloads/Notices:   gsc.in/user/downloads/page
```

### Fields to get from manager (not on website):
```
[ ] Emergency medical cell phone number → siteConfig.emergencyPhone
[ ] Emergency helpline number → siteConfig.emergencyPhone2
[ ] WhatsApp business number → siteConfig.whatsapp
[ ] Banquet hall capacities (Regal, Rhythm, Glamourra) → banquetHall.capacity
[ ] Room types and counts → bookingConfig.rooms
[ ] Doctor schedule for medical cell → add to medical-cell page content
[ ] Housie schedule → add to housie page content
[ ] Affiliated club list with details → membershipConfig.affiliatedClubs
[ ] League dates and descriptions → leaguesConfig.leagues[*].approximateDates
```

### Images to upload in Studio (upload via Sanity asset panel):
```
[ ] GSC logo (SVG from graphic team) → siteConfig does not store this — goes in codebase
[ ] Hero poster image (first frame of GSC.mp4) → public/images/hero-poster.jpg
[ ] Each sport hero image (24 images) → sport.heroImage
[ ] Banquet hall photos (3 halls, multiple each) → banquetHall.heroImage + gallery
[ ] Dining venue photos (6 venues) → diningVenue.heroImage + gallery
[ ] Committee member photos → committeeMember.photo
[ ] Achievement images → achievement.image (upload as content comes in)
[ ] Annual report PDFs → annualReport.pdfFile
[ ] Team Spirit edition PDFs → teamSpiritEdition.pdfFile
[ ] Dining menu PDFs → diningVenue.menuPdf
```
