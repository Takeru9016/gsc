# GSC — Database Reference
# Drizzle ORM + Neon Postgres setup, full schema, and migration workflow.

---

## Setup

### 1. Create Neon Project
1. Go to console.neon.tech → Create project → Name: `gsc-production`
2. Get two connection strings:
   - **Pooled** (for app runtime): `DATABASE_URL`
   - **Direct** (for migrations): `DATABASE_URL_UNPOOLED`

### 2. Install Dependencies
```bash
pnpm add drizzle-orm @neondatabase/serverless drizzle-zod
pnpm add -D drizzle-kit
```

### 3. `drizzle.config.ts`
```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED!,  // Direct connection for migrations
  },
} satisfies Config
```

### 4. Package Scripts
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push"
  }
}
```

---

## `lib/db/index.ts`

```typescript
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })
```

---

## `lib/db/schema.ts` — Complete Schema

```typescript
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core'

// ─── Enums ──────────────────────────────────────────────────────────────────

export const bookingTypeEnum = pgEnum('booking_type', [
  'room',
  'banquet',
  'ground',
  'coaching',
])

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'reviewed',
  'confirmed',
  'rejected',
  'cancelled',
])

export const membershipStatusEnum = pgEnum('membership_status', [
  'pending',
  'reviewed',
  'contacted',
  'closed',
])

export const contactTypeEnum = pgEnum('contact_type', [
  'general',
  'membership',
  'event',
  'partnership',
  'media',
  'leagues',
])

export const contactStatusEnum = pgEnum('contact_status', [
  'pending',
  'reviewed',
  'responded',
  'closed',
])

export const partnerStatusEnum = pgEnum('partner_status', [
  'pending',
  'reviewing',
  'negotiating',
  'active',
  'declined',
])

export const achievementStatusEnum = pgEnum('achievement_status', [
  'pending',
  'approved',
  'rejected',
])

// ─── Tables ─────────────────────────────────────────────────────────────────

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
  notes: text('notes'),
})

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
  imageUrl: varchar('image_url', { length: 500 }),
  status: achievementStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  notes: text('notes'),
})

// ─── Type Exports ────────────────────────────────────────────────────────────

export type BookingInquiry = typeof bookingInquiries.$inferSelect
export type NewBookingInquiry = typeof bookingInquiries.$inferInsert

export type MembershipInquiry = typeof membershipInquiries.$inferSelect
export type NewMembershipInquiry = typeof membershipInquiries.$inferInsert

export type ContactInquiry = typeof contactInquiries.$inferSelect
export type NewContactInquiry = typeof contactInquiries.$inferInsert

export type PartnerInquiry = typeof partnerInquiries.$inferSelect
export type NewPartnerInquiry = typeof partnerInquiries.$inferInsert

export type AchievementSubmission = typeof achievementSubmissions.$inferSelect
export type NewAchievementSubmission = typeof achievementSubmissions.$inferInsert
```

---

## Migration Workflow

### First-time setup
```bash
pnpm db:generate     # generates SQL migration files in /drizzle
pnpm db:migrate      # applies migrations to Neon
```

### After schema changes
```bash
pnpm db:generate     # generates new migration file
pnpm db:migrate      # applies to Neon
```

### Verify in Neon
```bash
pnpm db:studio       # opens Drizzle Studio — visual table browser
```

### Direct push (dev only — skips migration files)
```bash
pnpm db:push         # pushes schema directly — only for local dev
```

**Never use `db:push` against production Neon.** Always use `db:generate` + `db:migrate` for production schema changes.

---

## Query Patterns in API Routes

### Insert + return ID
```typescript
import { db } from '@/lib/db'
import { bookingInquiries, type NewBookingInquiry } from '@/lib/db/schema'

const newBooking: NewBookingInquiry = {
  bookingType: 'room',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  roomType: 'Deluxe',
  checkIn: '2024-12-01',
  checkOut: '2024-12-03',
  guests: 2,
}

const [result] = await db
  .insert(bookingInquiries)
  .values(newBooking)
  .returning({ id: bookingInquiries.id })
```

### Common import pattern in API routes
```typescript
import { db } from '@/lib/db'
import { bookingInquiries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
```

---

## Notes

- **All tables use UUID primary keys** — not auto-increment integers. Safer for distributed inserts.
- **`notes` column on every table** — internal staff notes. Never shown to public.
- **`status` enum on every table** — drives internal workflow. Sanity Studio not involved in DB records.
- **`updatedAt` column** — not auto-updated by Drizzle. Update manually on status changes if building an admin panel later.
- Neon free tier is sufficient for the volume of inquiries expected (< 100/day). No connection pooling issues expected at this scale.
