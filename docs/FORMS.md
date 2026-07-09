# GSC — Forms Reference
# All form field lists, Zod validation schemas, API route pattern, and Resend setup.

---

## Form Overview

| Form                   | Route               | Component                     | Submits to          |
|------------------------|---------------------|-------------------------------|---------------------|
| Booking Inquiry        | /booking            | BookingForm.tsx               | POST /api/booking   |
| Membership Interest    | /membership/[type]  | MembershipInterestForm.tsx    | POST /api/membership|
| Contact                | /contact            | ContactForm.tsx               | POST /api/contact   |
| Partner Inquiry        | /partners           | PartnerForm.tsx               | POST /api/partner   |
| Achievement Submission | /achievements       | AchievementSubmitForm.tsx     | POST /api/achievement|

All forms use **React Hook Form + Zod**. No uncontrolled inputs.

---

## Zod Schemas

### Booking Form

```typescript
import { z } from 'zod'

export const bookingSchema = z.object({
  bookingType: z.enum(['room', 'banquet', 'ground', 'coaching']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15),
  message: z.string().optional(),
  // Room fields
  roomType: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().int().min(1).max(10).optional(),
  // Banquet fields
  hallPreference: z.string().optional(),
  eventType: z.string().optional(),
  guestCount: z.number().int().min(1).optional(),
  eventDate: z.string().optional(),
  // Ground fields
  sport: z.string().optional(),
  groundDate: z.string().optional(),
  groundTime: z.string().optional(),
  // Coaching fields
  coachingSport: z.string().optional(),
  coachingLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All levels']).optional(),
}).superRefine((data, ctx) => {
  if (data.bookingType === 'room') {
    if (!data.checkIn) ctx.addIssue({ code: 'custom', path: ['checkIn'], message: 'Check-in date is required' })
    if (!data.checkOut) ctx.addIssue({ code: 'custom', path: ['checkOut'], message: 'Check-out date is required' })
  }
  if (data.bookingType === 'banquet') {
    if (!data.eventType) ctx.addIssue({ code: 'custom', path: ['eventType'], message: 'Event type is required' })
    if (!data.guestCount) ctx.addIssue({ code: 'custom', path: ['guestCount'], message: 'Guest count is required' })
    if (!data.eventDate) ctx.addIssue({ code: 'custom', path: ['eventDate'], message: 'Event date is required' })
  }
  if (data.bookingType === 'ground') {
    if (!data.groundDate) ctx.addIssue({ code: 'custom', path: ['groundDate'], message: 'Date is required' })
    if (!data.groundTime) ctx.addIssue({ code: 'custom', path: ['groundTime'], message: 'Time is required' })
  }
  if (data.bookingType === 'coaching') {
    if (!data.coachingSport) ctx.addIssue({ code: 'custom', path: ['coachingSport'], message: 'Sport is required' })
  }
})

export type BookingFormValues = z.infer<typeof bookingSchema>
```

---

### Membership Interest Form

```typescript
export const membershipInterestSchema = z.object({
  membershipType: z.string().min(1),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
})

export type MembershipInterestFormValues = z.infer<typeof membershipInterestSchema>
```

---

### Contact Form

```typescript
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(15).optional(),
  subject: z.enum(['general', 'membership', 'event', 'partnership', 'media', 'leagues'], {
    errorMap: () => ({ message: 'Please select a subject' }),
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
})

export type ContactFormValues = z.infer<typeof contactSchema>
```

---

### Partner Inquiry Form

```typescript
export const partnerSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10).max(15),
  partnershipType: z.string().optional(),
  message: z.string().max(1000).optional(),
})

export type PartnerFormValues = z.infer<typeof partnerSchema>
```

---

### Achievement Submission Form

```typescript
export const achievementSchema = z.object({
  memberName: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(15).optional(),
  sport: z.string().min(2, 'Sport is required'),
  achievementTitle: z.string().min(5, 'Achievement title is required'),
  level: z.enum(['District', 'State', 'National', 'International'], {
    errorMap: () => ({ message: 'Please select achievement level' }),
  }),
  year: z.number().int().min(1990).max(new Date().getFullYear()),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(), // Set by Cloudinary upload
})

export type AchievementFormValues = z.infer<typeof achievementSchema>
```

---

## API Route Pattern

Every API route follows the same structure:

```typescript
// app/api/[route]/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { [table] } from '@/lib/db/schema'
import { [schema] } from '@/lib/validations'
import { resend } from '@/lib/email/resend'
import { [EmailTemplate] } from '@/lib/email/templates/[template]'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. Validate with Zod
    const result = [schema].safeParse(body)
    if (!result.success) {
      return Response.json(
        { success: false, error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // 2. Insert into database
    const [record] = await db
      .insert([table])
      .values(data)
      .returning({ id: [table].id })

    // 3. Send confirmation email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: data.email,
      subject: '[Subject line]',
      react: <[EmailTemplate] data={data} />,
    })

    // 4. Return success
    return Response.json({ success: true, id: record.id }, { status: 200 })

  } catch (error) {
    console.error('[Route] error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Resend Setup

### `lib/email/resend.ts`

```typescript
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

### Email Template Pattern

All templates use `@react-email/components`:

```typescript
// lib/email/templates/booking.tsx
import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text
} from '@react-email/components'

interface BookingEmailProps {
  data: {
    name: string
    email: string
    bookingType: string
    // ... other fields
  }
}

export function BookingConfirmationEmail({ data }: BookingEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your booking inquiry has been received — Goregaon Sports Club</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Inquiry Received</Heading>
          <Text style={text}>Dear {data.name},</Text>
          <Text style={text}>
            Thank you for your {data.bookingType} booking inquiry at Goregaon Sports Club.
            We have received your request and will contact you within 24 hours.
          </Text>
          <Hr />
          <Text style={footer}>
            Goregaon Sports Club | Mumbai | gsc.in
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#F8FAFF', fontFamily: 'Inter, sans-serif' }
const container = { maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }
const h1 = { color: '#0F172A', fontSize: '24px', fontWeight: '600' }
const text = { color: '#6B7280', fontSize: '16px', lineHeight: '1.6' }
const footer = { color: '#9CA3AF', fontSize: '14px' }
```

---

## Cloudinary Upload (Achievement Form)

Upload happens client-side before form submission. Image URL stored in form state.

```typescript
// In AchievementSubmitForm.tsx

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  const data = await response.json()
  return data.secure_url
}

// In form submit handler
const handleImageUpload = async (file: File) => {
  setIsUploading(true)
  try {
    const url = await uploadToCloudinary(file)
    setValue('imageUrl', url) // react-hook-form setValue
  } finally {
    setIsUploading(false)
  }
}
```

**Cloudinary unsigned upload preset**: Create in Cloudinary dashboard → Settings → Upload → Add upload preset → Mode: Unsigned. Name: `gsc-achievements`.

---

## Form UX Rules

1. **No submit without validation** — Zod blocks malformed data before DB insert.
2. **Inline error messages** — below each field, not in a toast.
3. **Loading state** — button shows spinner during submission. Disabled during loading.
4. **Success state** — inline success message replaces form or shows below. No full-page redirect.
5. **Error state** — show friendly message, not technical error. Log actual error server-side.
6. **Required fields** — marked with `*` in label. Never hidden asterisks.
7. **Phone field** — always optional unless explicitly required (booking, membership = required).
