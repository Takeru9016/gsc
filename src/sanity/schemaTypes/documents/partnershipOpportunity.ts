import { defineField, defineType } from "sanity";

export const partnershipOpportunity = defineType({
  fields: [
    defineField({
      description: 'e.g. "Title Sponsor", "Event Partner"',
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      of: [{ type: "block" }],
      title: "Description",
      type: "array",
    }),
    defineField({
      name: "reachStats",
      title: "Reach Stats",
      type: "string",
    }),
    defineField({
      name: "benefits",
      of: [{ type: "string" }],
      title: "Benefits",
      type: "array",
    }),
    defineField({
      initialValue: false,
      name: "isHighlighted",
      title: "Is Highlighted",
      type: "boolean",
    }),
    defineField({
      initialValue: 0,
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  name: "partnershipOpportunity",
  orderings: [
    {
      by: [{ direction: "asc", field: "order" }],
      name: "orderAsc",
      title: "Order",
    },
  ],
  preview: {
    select: { subtitle: "reachStats", title: "title" },
  },
  title: "Partnership Opportunity",
  type: "document",
});
