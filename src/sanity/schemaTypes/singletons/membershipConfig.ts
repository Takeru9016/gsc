import { defineField, defineType } from "sanity";

export const membershipConfig = defineType({
  fields: [
    defineField({
      initialValue: false,
      name: "enrollmentOpen",
      title: "Enrollment Open",
      type: "boolean",
    }),
    defineField({
      description: "Shown when enrollment is closed",
      name: "enrollmentNotice",
      title: "Enrollment Notice",
      type: "text",
    }),
    defineField({
      name: "affiliatedClubs",
      of: [
        {
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
            }),
            defineField({
              name: "reciprocalBenefits",
              title: "Reciprocal Benefits",
              type: "text",
            }),
            defineField({ name: "logo", title: "Logo", type: "image" }),
          ],
          type: "object",
        },
      ],
      title: "Affiliated Clubs",
      type: "array",
    }),
  ],
  name: "membershipConfig",
  preview: {
    prepare() {
      return { title: "Membership Config" };
    },
  },
  title: "Membership Config",
  type: "document",
});
