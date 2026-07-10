import { defineField, defineType } from "sanity";

export const foodStall = defineType({
  fields: [
    defineField({
      name: "name",
      title: "Name",
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
    defineField({
      name: "cuisineType",
      title: "Cuisine Type",
      type: "string",
    }),
    defineField({
      initialValue: true,
      name: "isVeg",
      title: "Is Veg",
      type: "boolean",
    }),
    defineField({
      initialValue: 0,
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  name: "foodStall",
  orderings: [
    {
      by: [{ direction: "asc", field: "order" }],
      name: "orderAsc",
      title: "Order",
    },
  ],
  preview: {
    select: { media: "image", subtitle: "cuisineType", title: "name" },
  },
  title: "Food Stall",
  type: "document",
});
