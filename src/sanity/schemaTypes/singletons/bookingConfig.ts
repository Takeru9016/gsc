import { defineField, defineType } from "sanity";

export const bookingConfig = defineType({
  fields: [
    defineField({
      description: "Email that receives booking inquiries",
      name: "bookingEmail",
      title: "Booking Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      initialValue: "We respond within 24 hours",
      name: "responseTime",
      title: "Response Time",
      type: "string",
    }),
    defineField({
      name: "rooms",
      of: [
        {
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "type", title: "Type", type: "string" }),
            defineField({
              name: "capacity",
              title: "Capacity",
              type: "number",
            }),
          ],
          type: "object",
        },
      ],
      title: "Rooms",
      type: "array",
    }),
    defineField({
      name: "banquetHalls",
      of: [{ to: [{ type: "banquetHall" }], type: "reference" }],
      title: "Banquet Halls",
      type: "array",
    }),
  ],
  name: "bookingConfig",
  preview: {
    prepare() {
      return { title: "Booking Config" };
    },
  },
  title: "Booking Config",
  type: "document",
});
