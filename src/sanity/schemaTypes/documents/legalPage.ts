import { defineField, defineType } from "sanity";

export const legalPage = defineType({
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      description: "privacy-policy | terms-of-use | cancellation",
      name: "slug",
      options: { source: "title" },
      title: "Slug",
      type: "slug",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      of: [{ type: "block" }],
      title: "Content",
      type: "array",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
    }),
  ],
  name: "legalPage",
  preview: {
    select: { subtitle: "lastUpdated", title: "title" },
  },
  title: "Legal Page",
  type: "document",
});
