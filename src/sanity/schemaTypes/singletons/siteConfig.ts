import { defineField, defineType } from "sanity";

export const siteConfig = defineType({
  fields: [
    defineField({
      initialValue: "Goregaon Sports Club",
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      initialValue: "https://gsc.in",
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
    }),
    defineField({
      description:
        "Cloudinary or hosted URL for the homepage hero background video",
      name: "heroVideoUrl",
      title: "Hero Video URL",
      type: "url",
    }),
    defineField({
      description: "PENDING — confirm with club management",
      name: "emergencyPhone",
      title: "Emergency Phone (Medical Cell)",
      type: "string",
    }),
    defineField({
      description: "PENDING — confirm with club management",
      name: "emergencyPhone2",
      title: "Emergency Phone (General)",
      type: "string",
    }),
    defineField({
      description: "PENDING — confirm with club management",
      name: "whatsapp",
      title: "WhatsApp Number",
      type: "string",
    }),
    defineField({
      fields: [
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "twitter", title: "Twitter", type: "url" }),
      ],
      name: "socialLinks",
      title: "Social Links",
      type: "object",
    }),
    defineField({
      name: "corporatePartners",
      of: [
        {
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "logo", title: "Logo", type: "image" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          type: "object",
        },
      ],
      title: "Corporate Partners",
      type: "array",
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
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
    }),
  ],
  name: "siteConfig",
  preview: {
    prepare() {
      return { title: "Site Config" };
    },
  },
  title: "Site Config",
  type: "document",
});
