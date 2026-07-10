import { defineField, defineType } from "sanity";

export const diningVenue = defineType({
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
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "type",
      options: {
        list: ["Veg", "NonVeg", "Mixed"],
      },
      title: "Type",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      initialValue: false,
      name: "hasBar",
      title: "Has Bar",
      type: "boolean",
    }),
    defineField({
      hidden: ({ document }) => !document?.hasBar,
      name: "ageRestriction",
      title: "Age Restriction",
      type: "number",
    }),
    defineField({
      name: "cuisineType",
      title: "Cuisine Type",
      type: "string",
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
      name: "description",
      of: [{ type: "block" }],
      title: "Description",
      type: "array",
    }),
    defineField({
      name: "menuPdf",
      title: "Menu PDF",
      type: "file",
    }),
    defineField({
      hidden: ({ document }) => !document?.hasBar,
      name: "barMenuPdf",
      title: "Bar Menu PDF",
      type: "file",
    }),
    defineField({
      name: "openingHours",
      of: [
        {
          fields: [
            defineField({ name: "day", title: "Day", type: "string" }),
            defineField({ name: "hours", title: "Hours", type: "string" }),
          ],
          type: "object",
        },
      ],
      title: "Opening Hours",
      type: "array",
    }),
    defineField({
      name: "seatingCapacity",
      title: "Seating Capacity",
      type: "number",
    }),
    defineField({
      name: "reservationInfo",
      title: "Reservation Info",
      type: "text",
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
  name: "diningVenue",
  preview: {
    select: { media: "heroImage", subtitle: "type", title: "name" },
  },
  title: "Dining Venue",
  type: "document",
});
