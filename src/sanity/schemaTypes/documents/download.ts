import { defineField, defineType } from "sanity";

export const download = defineType({
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      options: {
        list: ["Notice", "Circular", "Form", "Report"],
      },
      title: "Category",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
      validation: (rule) => rule.required(),
    }),
    defineField({
      description: 'e.g. "2.4 MB" — optional, for display',
      name: "fileSize",
      title: "File Size",
      type: "string",
    }),
    defineField({
      name: "publishedDate",
      title: "Published Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      initialValue: true,
      name: "isActive",
      title: "Is Active",
      type: "boolean",
    }),
  ],
  name: "download",
  orderings: [
    {
      by: [{ direction: "desc", field: "publishedDate" }],
      name: "publishedDateDesc",
      title: "Published Date, Newest First",
    },
  ],
  preview: {
    select: { subtitle: "category", title: "title" },
  },
  title: "Download",
  type: "document",
});
