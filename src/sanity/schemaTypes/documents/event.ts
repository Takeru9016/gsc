import { defineField, defineType } from "sanity";

export const event = defineType({
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      options: { source: "title" },
      title: "Slug",
      type: "slug",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      options: {
        list: ["Tournament", "Cultural", "League", "Special"],
      },
      title: "Type",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      options: {
        list: ["upcoming", "ongoing", "past"],
      },
      title: "Status",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
    }),
    defineField({
      name: "heroImage",
      options: { hotspot: true },
      title: "Hero Image",
      type: "image",
    }),
    defineField({
      name: "description",
      of: [{ type: "block" }],
      title: "Description",
      type: "array",
    }),
    defineField({
      name: "schedule",
      of: [{ type: "block" }],
      title: "Schedule",
      type: "array",
    }),
    defineField({
      name: "registrationUrl",
      title: "Registration URL",
      type: "url",
    }),
    defineField({
      name: "registrationDeadline",
      title: "Registration Deadline",
      type: "date",
    }),
    defineField({
      initialValue: false,
      name: "isFeatured",
      title: "Is Featured",
      type: "boolean",
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
  name: "event",
  orderings: [
    {
      by: [{ direction: "asc", field: "startDate" }],
      name: "startDateAsc",
      title: "Start Date, Soonest First",
    },
  ],
  preview: {
    select: { media: "heroImage", subtitle: "type", title: "title" },
  },
  title: "Event",
  type: "document",
});
