# GSC — SCHEMA Patch
# Additions to docs/spec/SCHEMA.md. Do not modify SCHEMA.md itself.
# Covers: aboutPage singleton, corrected byeLawsPdfUrl location,
#          missing ISR cache tags, missing TAG_MAP entries.

---

## Patch 1 — New Singleton: `aboutPage`

Add to SCHEMA.md under Singletons (insert as first singleton, before siteConfig).

```typescript
// Singleton — aboutPage
// One document. Locked in desk structure.
{
  _type: 'aboutPage',
  _id: 'aboutPage',
  historyText: portableText,       // Founding story, growth narrative — /about History section
  historyImage: image,             // Historic photo — right column on /about
  byeLawsPdfUrl: string,           // Cloudinary URL of the bye-laws PDF — /about/bye-laws
  byeLawsUpdatedAt: date,          // Last updated shown below PDF viewer
}
```

Total singletons is now 5: aboutPage, siteConfig, membershipConfig, bookingConfig, leaguesConfig.

---

## Patch 2 — Remove byeLawsPdfUrl from siteConfig

The `byeLawsPdfUrl` field previously listed in `siteConfig` is incorrect.
It belongs in `aboutPage` (Patch 1 above).
Remove it from `siteConfig`. The field in siteConfig should be replaced with:
`// byeLawsPdfUrl moved to aboutPage singleton`

---

## Patch 3 — Missing ISR Cache Tags

Add these rows to the ISR Cache Tags table in SCHEMA.md:

| Sanity Document | Cache Tag       | Revalidates                           |
|-----------------|-----------------|---------------------------------------|
| aboutPage       | `about-page`    | /about, /about/bye-laws               |
| bookingConfig   | `booking-config`| /facilities/rooms, /booking           |
| foodStall       | `food-stalls`   | /facilities/dining/food-court         |

---

## Patch 4 — Missing TAG_MAP entries

Add these to the TAG_MAP in both SCHEMA.md and SANITY_CMS.md:

```typescript
const TAG_MAP = {
  // ADD THESE:
  aboutPage: 'about-page',
  bookingConfig: 'booking-config',
  foodStall: 'food-stalls',
  // existing entries remain unchanged
}
```

---

## Patch 5 — Missing GROQ query functions

Add these to lib/sanity/queries.ts (referenced in 1A-07 prompt):

```typescript
// getAboutPage — used by /about and /about/bye-laws
export async function getAboutPage() {
  return client.fetch(
    `*[_type == "aboutPage"][0] {
      historyText,
      historyImage,
      byeLawsPdfUrl,
      byeLawsUpdatedAt
    }`,
    {},
    { next: { tags: ['about-page'] } }
  )
}

// getBookingConfig — used by /facilities/rooms and /booking
export async function getBookingConfig() {
  return client.fetch(
    `*[_type == "bookingConfig"][0] {
      bookingEmail,
      responseTime,
      rooms
    }`,
    {},
    { next: { tags: ['booking-config'] } }
  )
}

// getFoodStalls — used by /facilities/dining/food-court
export async function getFoodStalls() {
  return client.fetch(
    `*[_type == "foodStall"] | order(order asc) {
      _id,
      name,
      description,
      cuisineType,
      isVeg,
      image,
      order
    }`,
    {},
    { next: { tags: ['food-stalls'] } }
  )
}
```

---

## Patch 6 — Desk Structure Update

Add `aboutPage` singleton to sanity/desk/structure.ts.
It should be the first item in the singletons list (before siteConfig).

```typescript
S.listItem()
  .title('About Page')
  .id('aboutPage')
  .child(
    S.document()
      .schemaType('aboutPage')
      .documentId('aboutPage')
  ),
```

The `!['siteConfig', 'membershipConfig', 'bookingConfig', 'leaguesConfig']` exclusion filter
must also include `'aboutPage'`:

```typescript
!['aboutPage', 'siteConfig', 'membershipConfig', 'bookingConfig', 'leaguesConfig'].includes(
  item.getId() ?? ''
)
```
