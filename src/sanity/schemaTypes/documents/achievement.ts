import { defineField, defineType } from "sanity";

export const achievement = defineType({
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      description: "Free text — matches filter",
      name: "sport",
      title: "Sport",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "level",
      options: {
        list: ["District", "State", "National", "International"],
      },
      title: "Level",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      options: {
        list: ["Individual", "Team"],
      },
      title: "Type",
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
      description: "Primary content — the achievement post",
      name: "image",
      options: { hotspot: true },
      title: "Image",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "memberName",
      title: "Member Name",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      description: "Staff approves before publishing",
      initialValue: false,
      name: "isApproved",
      title: "Is Approved",
      type: "boolean",
    }),
  ],
  name: "achievement",
  orderings: [
    {
      by: [{ direction: "desc", field: "year" }],
      name: "yearDesc",
      title: "Year, Newest First",
    },
  ],
  preview: {
    prepare({ title, subtitle, media, isApproved }) {
      return {
        media,
        subtitle: `${subtitle} — ${isApproved ? "Approved" : "Pending"}`,
        title,
      };
    },
    select: {
      isApproved: "isApproved",
      media: "image",
      subtitle: "sport",
      title: "title",
    },
  },
  title: "Achievement",
  type: "document",
});
