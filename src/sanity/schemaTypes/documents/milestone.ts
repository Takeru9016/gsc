import { defineField, defineType } from "sanity";

export const milestone = defineType({
  fields: [
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      options: { hotspot: true },
      title: "Image",
      type: "image",
    }),
  ],
  name: "milestone",
  orderings: [
    {
      by: [{ direction: "desc", field: "year" }],
      name: "yearDesc",
      title: "Year, Newest First",
    },
  ],
  preview: {
    select: { media: "image", subtitle: "year", title: "title" },
  },
  title: "Milestone",
  type: "document",
});
