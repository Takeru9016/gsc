# GSC — Remaining Prompts
# All prompts generated from the audit that need to be run in Claude Code.
# Run these in order. Each block is a separate Claude Code session prompt.
#
# WHEN TO RUN:
# FIX-01 through FIX-03 → run during Phase 1A (before 1A-07 builds Sanity)
# FIX-04 → run during Phase 1B (before 1B-02 builds /about)
# FIX-05 → run during Phase 1B (before 1B-04 builds /about/bye-laws)
# FIX-06 → run during Phase 2 (before 2-04 builds dining pages)
# SEED-10 through SEED-12 → run after all seed scripts in SANITY_DATA_ENTRY.md
# ADMIN-P4 → run after ADMIN-P3 is complete

---

## FIX-01 — Add aboutPage Singleton Schema

Run during or immediately after task 1A-07 (Sanity setup).

```
/build

Fix — Add missing aboutPage Sanity singleton.

Read docs/spec/SCHEMA.PATCH.md in full before writing any code.

1. Create sanity/schemaTypes/singletons/aboutPage.ts:

import { defineType, defineField } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'historyText',
      title: 'History & Legacy Text',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Founding story and growth narrative shown on the /about page.',
    }),
    defineField({
      name: 'historyImage',
      title: 'Historic Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Historic photo shown in the right column of the History section.',
    }),
    defineField({
      name: 'byeLawsPdfUrl',
      title: 'Bye-Laws PDF URL',
      type: 'url',
      description: 'Cloudinary URL of the bye-laws PDF. Shown on /about/bye-laws.',
    }),
    defineField({
      name: 'byeLawsUpdatedAt',
      title: 'Bye-Laws Last Updated',
      type: 'date',
      description: 'Date shown below the PDF viewer on /about/bye-laws.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'About Page Content' }),
  },
})

2. Add to sanity/schemaTypes/index.ts — import and include aboutPage in the types array.

3. Update sanity/desk/structure.ts:
   Add aboutPage as the FIRST singleton item (before siteConfig):

   S.listItem()
     .title('About Page')
     .id('aboutPage')
     .child(
       S.document()
         .schemaType('aboutPage')
         .documentId('aboutPage')
     ),

   Update the filter array to also exclude 'aboutPage':
   !['aboutPage', 'siteConfig', 'membershipConfig', 'bookingConfig', 'leaguesConfig']
     .includes(item.getId() ?? '')

4. Verify: pnpm dev → Studio shows "About Page" as first singleton in desk.
```

---

## FIX-02 — Add Missing GROQ Query Functions

Run during or immediately after task 1A-07.

```
/build

Fix — Add 3 missing GROQ query functions to lib/sanity/queries.ts.

Read docs/spec/SCHEMA.PATCH.md § Patch 5 for the exact implementations.

Add these 3 functions to lib/sanity/queries.ts:

1. getAboutPage()
   GROQ: *[_type == "aboutPage"][0] { historyText, historyImage, byeLawsPdfUrl, byeLawsUpdatedAt }
   ISR tag: 'about-page'

2. getBookingConfig()
   GROQ: *[_type == "bookingConfig"][0] { bookingEmail, responseTime, rooms }
   ISR tag: 'booking-config'

3. getFoodStalls()
   GROQ: *[_type == "foodStall"] | order(order asc) { _id, name, description, cuisineType, isVeg, image, order }
   ISR tag: 'food-stalls'

Add TypeScript return types for each function.
No any types — use proper interfaces.

After adding:
- Run pnpm typecheck — should pass
- Run pnpm biome check — should pass
```

---

## FIX-03 — Update TAG_MAP in /api/revalidate

Run during or immediately after task 1A-10 (API routes).

```
/build

Fix — Add 3 missing entries to TAG_MAP in app/api/revalidate/route.ts.

Open the existing revalidate route and add these 3 entries to TAG_MAP:

const TAG_MAP: Record<string, string> = {
  aboutPage: 'about-page',        // ADD THIS
  bookingConfig: 'booking-config', // ADD THIS
  foodStall: 'food-stalls',       // ADD THIS
  // ... all existing entries remain unchanged
}

Do not change any other code in this file.
Run pnpm typecheck after editing.
```

---

## FIX-04 — Update /about Page to Fetch aboutPage Singleton

Run during task 1B-02 (/about page build). Replace the placeholder history section.

```
/build

Fix — Wire up aboutPage Sanity singleton to /about page.

In app/(site)/about/page.tsx:

1. Add getAboutPage() to the data fetches at the top of the Server Component:
   const [aboutData, milestones] = await Promise.all([
     getAboutPage(),
     getMilestones(),
   ])

2. Update the History & Legacy section:
   - Left column: render PortableTextRenderer with aboutData?.historyText
     If null: show placeholder paragraph with [PENDING_CONTENT] comment
   - Right column: render next/image with urlFor(aboutData?.historyImage)
     If null: show grey aspect-video placeholder div

3. Remove any hardcoded placeholder text that was there before.
4. Keep [PENDING_CONTENT] comments in the code for the null states.

Run pnpm typecheck after editing.
```

---

## FIX-05 — Update /about/bye-laws to Use aboutPage Singleton

Run during task 1B-04 (/about/bye-laws build). Replace the placeholder PDF section.

```
/build

Fix — Wire up byeLawsPdfUrl from aboutPage singleton to /about/bye-laws page.

In app/(site)/about/bye-laws/page.tsx:

1. Add getAboutPage() fetch:
   const aboutData = await getAboutPage()

2. Replace the placeholder PDF section with:
   {aboutData?.byeLawsPdfUrl ? (
     <>
       <PDFViewer url={aboutData.byeLawsPdfUrl} title="GSC Bye-Laws" showDownload={true} />
       {aboutData.byeLawsUpdatedAt && (
         <p className="text-sm text-[--color-text-secondary] mt-3">
           Last updated: {new Date(aboutData.byeLawsUpdatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
         </p>
       )}
     </>
   ) : (
     <div className="rounded-2xl border border-[--color-border] p-8 text-center">
       <p className="text-[--color-text-secondary] mb-4">
         The bye-laws document is being prepared and will be available here soon.
       </p>
       <a href="/contact" className="btn-primary">Contact Us for a Copy</a>
     </div>
   )}

3. Add to generateMetadata:
   title: 'Club Bye-Laws | About | Goregaon Sports Club'

Run pnpm typecheck after editing.
```

---

## FIX-06 — Update Food Court Page to Render Food Stalls

Run during task 2-04 (dining hub + venue pages build).

```
/build

Fix — Render food stall documents on /facilities/dining/food-court page.

In app/(site)/facilities/dining/[venue]/page.tsx:

1. Add conditional fetch for food stalls when slug is 'food-court':

   // In the Server Component (alongside getDiningVenueBySlug):
   const [venue, foodStalls] = await Promise.all([
     getDiningVenueBySlug(slug),
     slug === 'food-court' ? getFoodStalls() : Promise.resolve([]),
   ])

2. Pass foodStalls as a prop to the venue page content.

3. Add a conditional section between About and Gallery, only when foodStalls.length > 0 OR slug === 'food-court':

   {slug === 'food-court' && (
     <SectionWrapper>
       <AnimatedText as="h2" className="font-display text-[--size-display-s] uppercase mb-4">
         What's Inside
       </AnimatedText>
       <p className="text-[--color-text-secondary] mb-8">
         Multiple cuisines from our resident stalls.
       </p>
       {foodStalls.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {foodStalls.map((stall) => (
             <div key={stall._id} className="bg-[--color-surface] rounded-2xl p-6 border border-[--color-border]">
               {stall.image && (
                 <div className="aspect-video rounded-xl overflow-hidden mb-4">
                   <Image src={urlFor(stall.image).width(400).url()} alt={stall.name} fill className="object-cover" />
                 </div>
               )}
               <h3 className="font-body font-semibold text-lg mb-1">{stall.name}</h3>
               <p className="text-[--color-text-secondary] text-sm mb-3">{stall.cuisineType}</p>
               <Badge variant={stall.isVeg ? 'green' : 'red'}>
                 {stall.isVeg ? 'Veg' : 'Non-Veg'}
               </Badge>
             </div>
           ))}
         </div>
       ) : (
         <p className="text-[--color-text-secondary]">
           {/* [PENDING_CONTENT] — Food stall listings coming soon */}
           Stall listings coming soon.
         </p>
       )}
     </SectionWrapper>
   )}

Run pnpm typecheck after editing.
```

---

## SEED-10 — Seed aboutPage Singleton

Run after completing SANITY_DATA_ENTRY.md prompts 1–9.

```
/build

Task SEED-10 — Seed aboutPage singleton.

Read prompts/SANITY_DATA_ENTRY.PATCH.md § PROMPT 10.

Write scripts/seed-about-page.ts per the spec.
Add "seed:about-page": "tsx scripts/seed-about-page.ts" to package.json scripts.
Add the import to scripts/seed-all.ts as step 9.
Run pnpm seed:about-page to verify.
```

---

## SEED-11 — Seed bookingConfig Singleton

```
/build

Task SEED-11 — Seed bookingConfig singleton.

Read prompts/SANITY_DATA_ENTRY.PATCH.md § PROMPT 11.

Write scripts/seed-booking-config.ts per the spec.
Add "seed:booking-config": "tsx scripts/seed-booking-config.ts" to package.json scripts.
Add the import to scripts/seed-all.ts as step 10.
Run pnpm seed:booking-config to verify.
```

---

## SEED-12 — Seed Partnership Opportunities

```
/build

Task SEED-12 — Seed partnershipOpportunity documents.

Read prompts/SANITY_DATA_ENTRY.PATCH.md § PROMPT 12.

Write scripts/seed-partnerships.ts per the spec.
Creates 3 documents: Title Sponsor, Event Partner, Digital Partner.
Add "seed:partnerships": "tsx scripts/seed-partnerships.ts" to package.json scripts.
Add the import to scripts/seed-all.ts as step 11.
Run pnpm seed:partnerships to verify (3 documents appear in Sanity Studio under Partnership Opportunity).
```

---

## ADMIN-P4 — About Page Admin

Run after completing ADMIN-P3.

```
/build

Task ADMIN-P4 — About Page Content Management Admin Page.

Read prompts/ADMIN_DASHBOARD_ABOUT.md in full.

Build app/(admin)/content/about/page.tsx with two sections:
1. History & Legacy — textarea for historyText + Cloudinary image upload for historyImage
2. Bye-Laws PDF — upload/replace/remove flow for byeLawsPdfUrl + byeLawsUpdatedAt

Create app/api/admin/content/about/route.ts — PATCH handler with requireAdminSession().

Add "About Page" to AdminSidebar as first item in Content group.

Update CLAUDE.md Phase 4 tracker — add:
[ ] ADMIN-P4  About Page content editor + bye-laws PDF upload

Run pnpm typecheck after building.
Test: upload a PDF → verify /about/bye-laws shows it within 60 seconds.
```

---

## Summary — Prompt Execution Order

```
DURING PHASE 1A:
  FIX-01  After 1A-07 (Sanity setup) — add aboutPage schema
  FIX-02  After 1A-07 — add missing GROQ queries
  FIX-03  After 1A-10 (API routes) — update TAG_MAP

DURING PHASE 1B:
  FIX-04  During/after 1B-02 (/about build)
  FIX-05  During/after 1B-04 (/about/bye-laws build)

DURING PHASE 2:
  FIX-06  During/after 2-04 (dining build)

AFTER SANITY_DATA_ENTRY.md PROMPTS 1–9:
  SEED-10  aboutPage singleton
  SEED-11  bookingConfig singleton
  SEED-12  partnershipOpportunity documents (3)

AFTER ADMIN-P3:
  ADMIN-P4  About page + bye-laws admin
```
