import { defineField, defineType } from "sanity";

export const committeeMember = defineType({
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "designation",
      title: "Designation",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      options: {
        list: [
          "founderMember",
          "promoterMember",
          "officeBearer",
          "governingCouncil",
        ],
      },
      title: "Role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      options: { hotspot: true },
      title: "Photo",
      type: "image",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
    }),
    defineField({
      initialValue: 0,
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  name: "committeeMember",
  orderings: [
    {
      by: [{ direction: "asc", field: "order" }],
      name: "orderAsc",
      title: "Order",
    },
  ],
  preview: {
    select: { media: "photo", subtitle: "designation", title: "name" },
  },
  title: "Committee Member",
  type: "document",
});
