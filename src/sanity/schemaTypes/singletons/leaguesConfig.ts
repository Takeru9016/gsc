import { defineField, defineType } from "sanity";

export const leaguesConfig = defineType({
  fields: [
    defineField({
      name: "leagues",
      of: [
        {
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "sport", title: "Sport", type: "string" }),
            defineField({
              description: "T20, Singles, Doubles, etc.",
              name: "format",
              title: "Format",
              type: "string",
            }),
            defineField({
              description: "Annual, Biannual",
              name: "frequency",
              title: "Frequency",
              type: "string",
            }),
            defineField({
              description: "e.g. March–April",
              name: "approximateDates",
              title: "Approximate Dates",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({
              initialValue: true,
              name: "isActive",
              title: "Is Active",
              type: "boolean",
            }),
          ],
          preview: {
            select: { subtitle: "sport", title: "name" },
          },
          type: "object",
        },
      ],
      title: "Leagues",
      type: "array",
    }),
  ],
  name: "leaguesConfig",
  preview: {
    prepare() {
      return { title: "Leagues Config" };
    },
  },
  title: "Leagues Config",
  type: "document",
});
