import { defineField, defineType } from "sanity";

export const annualReport = defineType({
  fields: [
    defineField({
      description: 'e.g. "Annual Report 2023-24"',
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      options: { hotspot: true },
      title: "Cover Image",
      type: "image",
    }),
    defineField({
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedDate",
      title: "Published Date",
      type: "date",
    }),
  ],
  name: "annualReport",
  orderings: [
    {
      by: [{ direction: "desc", field: "publishedDate" }],
      name: "publishedDateDesc",
      title: "Published Date, Newest First",
    },
  ],
  preview: {
    select: { media: "coverImage", subtitle: "year", title: "title" },
  },
  title: "Annual Report",
  type: "document",
});
