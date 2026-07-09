Generate a Sanity document schema or Drizzle database table by name.

Usage: /schema [name]

Examples:
  /schema sport                  → generates sanity/schemaTypes/documents/sport.ts
  /schema banquetHall            → generates sanity/schemaTypes/documents/banquetHall.ts
  /schema siteConfig             → generates sanity/schemaTypes/singletons/siteConfig.ts
  /schema leaguesConfig          → generates sanity/schemaTypes/singletons/leaguesConfig.ts
  /schema booking_inquiries      → adds/updates table in lib/db/schema.ts
  /schema contact_inquiries      → adds/updates table in lib/db/schema.ts

Steps:

1. Read @docs/spec/SCHEMA.md — find the definition for the named schema.

2. Determine the schema type:
   - Sanity singleton: siteConfig | membershipConfig | bookingConfig | leaguesConfig
   - Sanity document: all other Sanity types
   - Drizzle table: names with underscores (booking_inquiries, contact_inquiries, etc.)

3. For Sanity schemas:
   - Generate the complete schema file using Sanity v3 defineType/defineField syntax
   - Include all fields, validation rules, and descriptions from SCHEMA.md
   - Place singletons in: sanity/schemaTypes/singletons/[name].ts
   - Place documents in: sanity/schemaTypes/documents/[name].ts
   - After generating, confirm it is exported in sanity/schemaTypes/index.ts

4. For Drizzle tables:
   - Generate the table definition using drizzle-orm/pg-core syntax
   - Add to lib/db/schema.ts (do not create a separate file)
   - Include the corresponding type exports ($inferSelect, $inferInsert)
   - After generating, remind to run: pnpm db:generate && pnpm db:migrate

5. Sanity schema template to follow:

```typescript
import { defineType, defineField } from 'sanity'

export const [typeName] = defineType({
  name: '[typeName]',
  title: '[Human Readable Title]',
  type: 'document',
  fields: [
    defineField({
      name: 'fieldName',
      title: 'Field Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Helper text for Sanity Studio editors',
    }),
    // ... all fields from SCHEMA.md
  ],
  preview: {
    select: {
      title: 'name',        // or whatever the primary display field is
      subtitle: 'category',
    },
  },
})
```

6. After generating, report:
   - File path created or modified
   - Number of fields generated
   - Any fields marked [PENDING] that need content from the client
   - Next step (add to index.ts or run migration)
