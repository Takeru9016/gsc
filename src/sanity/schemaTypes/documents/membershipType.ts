import { defineField, defineType } from "sanity";

export const membershipType = defineType({
  fields: [
    defineField({
      name: "type",
      options: {
        list: ["life", "corporate", "ward", "service", "yearly"],
      },
      title: "Type",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      options: { source: "type" },
      title: "Slug",
      type: "slug",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "eligibility",
      of: [{ type: "block" }],
      title: "Eligibility",
      type: "array",
    }),
    defineField({
      name: "benefits",
      of: [{ type: "block" }],
      title: "Benefits",
      type: "array",
    }),
    defineField({
      description: "Optional — display per policy decision",
      name: "feeStructure",
      of: [{ type: "block" }],
      title: "Fee Structure",
      type: "array",
    }),
    defineField({
      initialValue: false,
      name: "isActive",
      title: "Is Active",
      type: "boolean",
    }),
    defineField({
      description:
        'Yearly membership only — e.g. "Available to children and parents of Life Members, and senior citizens 65 years and above."',
      hidden: ({ document }) => document?.type !== "yearly",
      name: "eligibilityNote",
      title: "Eligibility Note (Yearly only)",
      type: "string",
    }),
    defineField({
      initialValue: 0,
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  name: "membershipType",
  orderings: [
    {
      by: [{ direction: "asc", field: "order" }],
      name: "orderAsc",
      title: "Order",
    },
  ],
  preview: {
    select: { subtitle: "type", title: "title" },
  },
  title: "Membership Type",
  type: "document",
});
