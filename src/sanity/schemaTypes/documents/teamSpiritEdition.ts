import { defineField, defineType } from "sanity";

export const teamSpiritEdition = defineType({
  fields: [
    defineField({
      description: 'e.g. "Summer 2024", "Diwali 2024"',
      name: "editionName",
      title: "Edition Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "edition",
      options: {
        list: ["Summer", "Diwali", "NewYear"],
      },
      title: "Edition",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      options: { hotspot: true },
      title: "Cover Image",
      type: "image",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "publicationDate",
      title: "Publication Date",
      type: "date",
    }),
    defineField({
      description: "Optional — if uploaded",
      name: "pdfFile",
      title: "PDF File",
      type: "file",
    }),
    defineField({
      description: "Ad sizes, rates, specs",
      name: "adSpecs",
      of: [{ type: "block" }],
      title: "Ad Specs",
      type: "array",
    }),
  ],
  name: "teamSpiritEdition",
  orderings: [
    {
      by: [{ direction: "desc", field: "publicationDate" }],
      name: "publicationDateDesc",
      title: "Publication Date, Newest First",
    },
  ],
  preview: {
    select: { media: "coverImage", subtitle: "year", title: "editionName" },
  },
  title: "Team Spirit Edition",
  type: "document",
});
