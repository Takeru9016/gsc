import { defineField, defineType } from "sanity";

export const sport = defineType({
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      options: { source: "name" },
      title: "Slug",
      type: "slug",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      options: {
        list: ["outdoor", "indoor", "aquatic", "health", "track"],
      },
      title: "Category",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
    }),
    defineField({
      name: "fullDescription",
      of: [{ type: "block" }],
      title: "Full Description",
      type: "array",
    }),
    defineField({
      name: "heroImage",
      options: { hotspot: true },
      title: "Hero Image",
      type: "image",
    }),
    defineField({
      name: "gallery",
      of: [{ type: "image" }],
      title: "Gallery",
      type: "array",
    }),
    defineField({
      name: "schedule",
      of: [
        {
          fields: [
            defineField({ name: "day", title: "Day", type: "string" }),
            defineField({
              name: "openTime",
              title: "Open Time",
              type: "string",
            }),
            defineField({
              name: "closeTime",
              title: "Close Time",
              type: "string",
            }),
          ],
          type: "object",
        },
      ],
      title: "Schedule",
      type: "array",
    }),
    defineField({
      initialValue: false,
      name: "hasCoaching",
      title: "Has Coaching",
      type: "boolean",
    }),
    defineField({
      hidden: ({ document }) => !document?.hasCoaching,
      name: "coachingInfo",
      of: [{ type: "block" }],
      title: "Coaching Info",
      type: "array",
    }),
    defineField({
      hidden: ({ document }) => !document?.hasCoaching,
      name: "coachName",
      title: "Coach Name",
      type: "string",
    }),
    defineField({
      hidden: ({ document }) => !document?.hasCoaching,
      name: "coachingSchedule",
      title: "Coaching Schedule",
      type: "text",
    }),
    defineField({
      hidden: ({ document }) => !document?.hasCoaching,
      name: "coachingLevel",
      options: {
        list: ["Beginner", "Intermediate", "Advanced", "All"],
      },
      title: "Coaching Level",
      type: "string",
    }),
    defineField({
      hidden: ({ document }) => !document?.hasCoaching,
      name: "externalRegistrationUrl",
      title: "External Registration URL",
      type: "url",
    }),
    defineField({
      name: "facilityDetails",
      of: [{ type: "block" }],
      title: "Facility Details",
      type: "array",
    }),
    defineField({
      initialValue: "none",
      name: "threeObjectType",
      options: {
        list: [
          "cricket-ball",
          "shuttlecock",
          "tennis-ball",
          "water-sphere",
          "none",
        ],
      },
      title: "3D Object Type",
      type: "string",
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
    defineField({
      initialValue: 0,
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  name: "sport",
  orderings: [
    {
      by: [{ direction: "asc", field: "order" }],
      name: "orderAsc",
      title: "Order",
    },
  ],
  preview: {
    select: { media: "heroImage", subtitle: "category", title: "name" },
  },
  title: "Sport",
  type: "document",
});
