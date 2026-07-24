# GSC — SANITY Data Entry Patch
# Additions to prompts/SANITY_DATA_ENTRY.md. Do not modify the original file.
# Run these prompts in Claude Code AFTER completing PROMPTS 1–9 in SANITY_DATA_ENTRY.md.
# Covers: aboutPage, bookingConfig, partnershipOpportunity seed scripts.

---

## PROMPT 10 — Seed aboutPage Singleton

```
Write a one-time seed script at scripts/seed-about-page.ts

Use createOrReplace() to seed the aboutPage singleton:

{
  _id: 'aboutPage',
  _type: 'aboutPage',
  historyText: [
    {
      _type: 'block',
      _key: 'intro1',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'span1',
          marks: [],
          text: 'Goregaon Sports Club was established with a vision to create a world-class sporting and recreational destination for the residents of Goregaon and beyond. [PENDING_CONTENT — replace with actual founding history from management]',
        },
      ],
    },
  ],
  byeLawsPdfUrl: null,           // [PENDING — upload bye-laws PDF to Cloudinary, then update this field via admin panel]
  byeLawsUpdatedAt: null,        // [PENDING — set when PDF is uploaded]
}

Add pnpm script: "seed:about-page": "tsx scripts/seed-about-page.ts"
Add to scripts/seed-all.ts sequence as step 9.
Print "aboutPage seeded successfully" on completion.
```

---

## PROMPT 11 — Seed bookingConfig Singleton

```
Write a one-time seed script at scripts/seed-booking-config.ts

Use createOrReplace() to seed the bookingConfig singleton:

{
  _id: 'bookingConfig',
  _type: 'bookingConfig',
  bookingEmail: 'booking@gsc.in',
  responseTime: 'We respond within 24 hours.',
  rooms: [
    {
      name: 'Standard Room',
      type: 'Standard',
      capacity: 2,
    },
    {
      name: 'Deluxe Room',
      type: 'Deluxe',
      capacity: 2,
    },
    {
      name: 'Suite',
      type: 'Suite',
      capacity: 4,
    },
    // [PENDING_CONTENT — replace with actual room types and counts from manager]
  ],
  banquetHalls: [],  // references to banquetHall documents — leave empty, link via Studio
}

Add pnpm script: "seed:booking-config": "tsx scripts/seed-booking-config.ts"
Add to scripts/seed-all.ts sequence as step 10.
Print "bookingConfig seeded successfully" on completion.
```

---

## PROMPT 12 — Seed Partnership Opportunities

```
Write a one-time seed script at scripts/seed-partnerships.ts

Create 3 partnershipOpportunity documents using createOrReplace()
(use deterministic _ids so re-running is safe: 'partnership-title-sponsor' etc.):

[
  {
    _id: 'partnership-title-sponsor',
    _type: 'partnershipOpportunity',
    title: 'Title Sponsor',
    description: 'Become the face of GSC — maximum brand visibility across all club touchpoints.',
    reachStats: '40,000+ member network | 2,000+ daily footfall | 10,000+ monthly website visitors',
    benefits: [
      'Name/logo in all event collateral and signage',
      'Dedicated banner placement across club premises',
      'Feature in Team Spirit magazine (all 3 editions)',
      'Social media campaigns (Instagram, Facebook, YouTube)',
      'VIP access to all GSC events',
      'Branded area within club premises',
    ],
    isHighlighted: true,
    order: 1,
  },
  {
    _id: 'partnership-event-partner',
    _type: 'partnershipOpportunity',
    title: 'Event Partner',
    description: 'Align your brand with GSC\'s premier sporting and cultural events.',
    reachStats: 'Per-event audience of 500–2,000 members | Post-event social media reach',
    benefits: [
      'Brand visibility at the sponsored event',
      'Logo on event-specific collateral',
      'Social media mentions before, during, and after the event',
      'On-ground branding at the venue',
    ],
    isHighlighted: false,
    order: 2,
  },
  {
    _id: 'partnership-digital-partner',
    _type: 'partnershipOpportunity',
    title: 'Digital Partner',
    description: 'Reach GSC\'s engaged digital audience across web and social platforms.',
    reachStats: 'Website: 10,000+ monthly visitors | Social: 15,000+ followers across platforms',
    benefits: [
      'Banner placement on gsc.in homepage and key pages',
      'Monthly feature in GSC email newsletter',
      'Social media brand mentions (2 per month)',
      'Profile in the Partners section of gsc.in',
    ],
    isHighlighted: false,
    order: 3,
  },
]

Add pnpm script: "seed:partnerships": "tsx scripts/seed-partnerships.ts"
Add to scripts/seed-all.ts sequence as step 11.
Print "Partnership opportunities seeded (3 documents)" on completion.
```

---

## Updated seed-all.ts sequence

After running these patches, the full seed sequence in scripts/seed-all.ts should be:

```typescript
// scripts/seed-all.ts
import './seed-site-config'
import './seed-membership-config'
import './seed-leagues-config'
import './seed-sports'
import './seed-banquets'
import './seed-dining'
import './seed-membership-types'
import './seed-legal-pages'
import './seed-about-page'        // NEW — Patch 10
import './seed-booking-config'    // NEW — Patch 11
import './seed-partnerships'      // NEW — Patch 12
```

Run with: `pnpm seed`
