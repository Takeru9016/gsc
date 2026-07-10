import { defineField, defineType } from "sanity";

export const banquetHall = defineType({
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
      description: "PENDING from manager",
      name: "capacity",
      title: "Capacity",
      type: "number",
    }),
    defineField({
      description: "Theatre, Banquet, Cocktail, etc.",
      name: "setupOptions",
      of: [{ type: "string" }],
      title: "Setup Options",
      type: "array",
    }),
    defineField({
      description: "PENDING",
      name: "amenities",
      of: [{ type: "block" }],
      title: "Amenities",
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
      name: "description",
      of: [{ type: "block" }],
      title: "Description",
      type: "array",
    }),
    defineField({
      name: "floorPlanImage",
      title: "Floor Plan Image",
      type: "image",
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
  name: "banquetHall",
  preview: {
    select: { media: "heroImage", subtitle: "tagline", title: "name" },
  },
  title: "Banquet Hall",
  type: "document",
});
