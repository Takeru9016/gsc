# GSC — Sanity CMS Reference
# GROQ query patterns, ISR revalidation, singleton setup, and image handling.

---

## Client Setup

### `lib/sanity/client.ts`

```typescript
import { createClient } from 'next-sanity'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,               // Always false — we use ISR, not CDN cache
}

// Server-side client (with write token for mutations)
export const serverClient = createClient({
  ...config,
  token: process.env.SANITY_API_TOKEN,
})

// Read-only client (for public data fetching)
export const client = createClient(config)
```

---

## Image Helper

### `lib/sanity/image.ts`

```typescript
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

**Always use `urlFor()`. Never use `.asset.url` directly.**

```typescript
// Correct
<Image src={urlFor(sport.heroImage).width(800).height(600).url()} alt={sport.name} />

// Wrong — never do this
<Image src={sport.heroImage.asset.url} alt={sport.name} />
```

---

## GROQ Query Patterns

### Standard ISR Fetch Pattern

Every Sanity fetch must include `next.tags` for ISR cache invalidation.

```typescript
// lib/sanity/queries.ts

export async function getSports() {
  return client.fetch<SportQuery[]>(
    `*[_type == "sport"] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      category,
      shortDescription,
      heroImage,
      hasCoaching,
      threeObjectType,
      schedule
    }`,
    {},
    { next: { tags: ['sports'] } }
  )
}
```

### Singleton Fetch Pattern

```typescript
export async function getSiteConfig() {
  return client.fetch<SiteConfig>(
    `*[_type == "siteConfig"][0] {
      siteName,
      tagline,
      phone,
      email,
      address,
      emergencyPhone,
      emergencyPhone2,
      socialLinks,
      corporatePartners
    }`,
    {},
    { next: { tags: ['site-config'] } }
  )
}
```

### Dynamic Route — Single Document by Slug

```typescript
export async function getSportBySlug(slug: string) {
  return client.fetch<SportDetail | null>(
    `*[_type == "sport" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      category,
      shortDescription,
      fullDescription,
      heroImage,
      gallery,
      schedule,
      hasCoaching,
      coachingInfo,
      coachName,
      coachingSchedule,
      coachingLevel,
      externalRegistrationUrl,
      facilityDetails,
      threeObjectType,
      metaTitle,
      metaDescription
    }`,
    { slug },
    { next: { tags: ['sports'] } }
  )
}
```

### Static Params for Dynamic Routes

```typescript
// app/(site)/sports/[slug]/page.tsx

export async function generateStaticParams() {
  const sports = await client.fetch<{ slug: string }[]>(
    `*[_type == "sport"] { "slug": slug.current }`,
    {},
    { next: { tags: ['sports'] } }
  )
  return sports.map((sport) => ({ slug: sport.slug }))
}
```

### Filtered Query

```typescript
export async function getEventsByStatus(status: string) {
  return client.fetch<EventQuery[]>(
    `*[_type == "event" && status == $status] | order(startDate asc) {
      _id,
      title,
      "slug": slug.current,
      type,
      status,
      startDate,
      heroImage,
      description
    }`,
    { status },
    { next: { tags: ['events'] } }
  )
}
```

### Achievement Filtering

```typescript
export async function getAchievements(filters?: {
  sport?: string
  level?: string
  type?: string
  year?: number
}) {
  // Build filter string dynamically
  const conditions = [
    `_type == "achievement"`,
    `isApproved == true`,
    filters?.sport ? `sport == $sport` : null,
    filters?.level ? `level == $level` : null,
    filters?.type ? `type == $type` : null,
    filters?.year ? `year == $year` : null,
  ].filter(Boolean).join(' && ')

  return client.fetch<AchievementQuery[]>(
    `*[${conditions}] | order(year desc) {
      _id,
      title,
      sport,
      level,
      type,
      year,
      image,
      memberName,
      description
    }`,
    filters ?? {},
    { next: { tags: ['achievements'] } }
  )
}
```

---

## ISR Revalidation

### How It Works
1. Staff updates content in Sanity Studio
2. Sanity sends POST to `/api/revalidate` via webhook
3. Next.js `revalidateTag()` purges the cache for that document type
4. Next request fetches fresh data from Sanity

### Webhook Route — `app/api/revalidate/route.ts`

**Critical**: Read raw body BEFORE JSON parsing.

```typescript
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { revalidateTag } from 'next/cache'

// Map Sanity document types to ISR cache tags
const TAG_MAP: Record<string, string> = {
  siteConfig: 'site-config',
  sport: 'sports',
  committeeMember: 'committee',
  milestone: 'milestones',
  achievement: 'achievements',
  event: 'events',
  banquetHall: 'banquets',
  diningVenue: 'dining',
  membershipType: 'membership',
  membershipConfig: 'membership-config',
  partnershipOpportunity: 'partners',
  teamSpiritEdition: 'team-spirit',
  annualReport: 'annual-reports',
  download: 'downloads',
  legalPage: 'legal',
  leaguesConfig: 'leagues',
}

export async function POST(request: Request) {
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)
  const secret = process.env.SANITY_WEBHOOK_SECRET

  if (!signature || !secret) {
    return Response.json({ error: 'Missing signature or secret' }, { status: 401 })
  }

  // MUST read raw body BEFORE JSON.parse — HMAC is computed on raw bytes
  const body = await request.text()

  const isValid = await isValidSignature(body, signature, secret)
  if (!isValid) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)
  const documentType = payload._type as string

  const tag = TAG_MAP[documentType]
  if (tag) {
    revalidateTag(tag)
    return Response.json({ revalidated: true, tag }, { status: 200 })
  }

  return Response.json({ revalidated: false, reason: 'Unknown document type' }, { status: 200 })
}
```

### Sanity Webhook Config (set up in Sanity dashboard)
- URL: `https://gsc.in/api/revalidate`
- HTTP method: POST
- Trigger on: Create, Update, Delete
- Include: `_type` field in payload
- Secret: Generate and store in `SANITY_WEBHOOK_SECRET` env var

---

## Singleton Pattern

Singletons (siteConfig, membershipConfig, bookingConfig, leaguesConfig) must be locked in Sanity Studio — staff should not be able to create new instances.

### Desk Structure — `sanity/desk/structure.ts`

```typescript
import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Singletons — pinned at top, no "create new" option
      S.listItem()
        .title('Site Config')
        .id('siteConfig')
        .child(
          S.document()
            .schemaType('siteConfig')
            .documentId('siteConfig')
        ),
      S.listItem()
        .title('Membership Config')
        .id('membershipConfig')
        .child(
          S.document()
            .schemaType('membershipConfig')
            .documentId('membershipConfig')
        ),
      S.listItem()
        .title('Booking Config')
        .id('bookingConfig')
        .child(
          S.document()
            .schemaType('bookingConfig')
            .documentId('bookingConfig')
        ),
      S.listItem()
        .title('Leagues Config')
        .id('leaguesConfig')
        .child(
          S.document()
            .schemaType('leaguesConfig')
            .documentId('leaguesConfig')
        ),
      S.divider(),
      // All other document types
      ...S.documentTypeListItems().filter(
        (item) =>
          !['siteConfig', 'membershipConfig', 'bookingConfig', 'leaguesConfig'].includes(
            item.getId() ?? ''
          )
      ),
    ])
```

---

## Portable Text Renderer

For rich text fields in Sanity (`portableText`):

```typescript
// components/shared/PortableTextRenderer.tsx
import { PortableText } from 'next-sanity'
import type { PortableTextBlock } from 'sanity'

interface PortableTextRendererProps {
  value: PortableTextBlock[]
  className?: string
}

const components = {
  block: {
    h2: ({ children }: any) => <h2 className="text-2xl font-semibold font-body mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-semibold font-body mt-6 mb-3">{children}</h3>,
    normal: ({ children }: any) => <p className="text-base text-secondary leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-secondary my-6">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-2 mb-4 text-secondary">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 mb-4 text-secondary">{children}</ol>,
  },
}

export function PortableTextRenderer({ value, className }: PortableTextRendererProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
```

---

## Cache Tag Reference

| Document Type          | Cache Tag           | Pages affected                              |
|------------------------|---------------------|---------------------------------------------|
| `siteConfig`           | `site-config`       | All pages (footer, navbar)                  |
| `sport`                | `sports`            | /sports, /sports/[slug], /sports/coaching   |
| `committeeMember`      | `committee`         | /about/team                                 |
| `milestone`            | `milestones`        | /about                                      |
| `achievement`          | `achievements`      | /achievements                               |
| `event`                | `events`            | /events, /events/[slug], homepage           |
| `banquetHall`          | `banquets`          | /facilities/banquets, /facilities/banquets/[hall] |
| `diningVenue`          | `dining`            | /facilities/dining, /facilities/dining/[slug] |
| `membershipType`       | `membership`        | /membership/[type]                          |
| `membershipConfig`     | `membership-config` | /membership, /membership/affiliated-clubs   |
| `partnershipOpportunity` | `partners`        | /partners                                   |
| `teamSpiritEdition`    | `team-spirit`       | /partners/team-spirit                       |
| `annualReport`         | `annual-reports`    | /partners/annual-report                     |
| `download`             | `downloads`         | /downloads                                  |
| `legalPage`            | `legal`             | /legal, /legal/cancellation                 |
| `leaguesConfig`        | `leagues`           | /events/leagues                             |
