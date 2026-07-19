import { z } from "zod";

export const bookingSchema = z
  .object({
    bookingType: z.enum(["room", "banquet", "ground", "coaching"]),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    coachingLevel: z
      .enum(["Beginner", "Intermediate", "Advanced", "All levels"])
      .optional(),
    coachingSport: z.string().optional(),
    email: z.email("Please enter a valid email address"),
    eventDate: z.string().optional(),
    eventType: z.string().optional(),
    groundDate: z.string().optional(),
    groundTime: z.string().optional(),
    guestCount: z.number().int().min(1).optional(),
    guests: z.number().int().min(1).max(10).optional(),
    hallPreference: z.string().optional(),
    message: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Please enter a valid phone number").max(15),
    roomType: z.string().optional(),
    sport: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.bookingType === "room") {
      if (!data.checkIn) {
        ctx.addIssue({
          code: "custom",
          message: "Check-in date is required",
          path: ["checkIn"],
        });
      }
      if (!data.checkOut) {
        ctx.addIssue({
          code: "custom",
          message: "Check-out date is required",
          path: ["checkOut"],
        });
      }
    }
    if (data.bookingType === "banquet") {
      if (!data.eventType) {
        ctx.addIssue({
          code: "custom",
          message: "Event type is required",
          path: ["eventType"],
        });
      }
      if (!data.guestCount) {
        ctx.addIssue({
          code: "custom",
          message: "Guest count is required",
          path: ["guestCount"],
        });
      }
      if (!data.eventDate) {
        ctx.addIssue({
          code: "custom",
          message: "Event date is required",
          path: ["eventDate"],
        });
      }
    }
    if (data.bookingType === "ground") {
      if (!data.groundDate) {
        ctx.addIssue({
          code: "custom",
          message: "Date is required",
          path: ["groundDate"],
        });
      }
      if (!data.groundTime) {
        ctx.addIssue({
          code: "custom",
          message: "Time is required",
          path: ["groundTime"],
        });
      }
    }
    if (data.bookingType === "coaching" && !data.coachingSport) {
      ctx.addIssue({
        code: "custom",
        message: "Sport is required",
        path: ["coachingSport"],
      });
    }
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const membershipInterestSchema = z.object({
  email: z.email("Please enter a valid email address"),
  membershipType: z.string().min(1),
  message: z
    .string()
    .max(500, "Message cannot exceed 500 characters")
    .optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number").max(15),
});

export type MembershipInterestFormValues = z.infer<
  typeof membershipInterestSchema
>;

export const contactSchema = z.object({
  email: z.email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().max(15).optional(),
  subject: z.enum(
    ["general", "membership", "event", "partnership", "media", "leagues"],
    { error: "Please select a subject" }
  ),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const partnerSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.email("Please enter a valid email address"),
  message: z.string().max(1000).optional(),
  partnershipType: z.string().optional(),
  phone: z.string().min(10).max(15),
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;

export const achievementSchema = z.object({
  achievementTitle: z.string().min(5, "Achievement title is required"),
  description: z.string().max(500).optional(),
  email: z.email("Please enter a valid email address"),
  imageUrl: z.url().optional(),
  level: z.enum(["District", "State", "National", "International"], {
    error: "Please select achievement level",
  }),
  memberName: z.string().min(2, "Name is required"),
  phone: z.string().max(15).optional(),
  sport: z.string().min(2, "Sport is required"),
  year: z.number().int().min(1990).max(new Date().getFullYear()),
});

export type AchievementFormValues = z.infer<typeof achievementSchema>;

export const adminLoginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export const adminSportScheduleEntrySchema = z.object({
  closeTime: z.string().optional(),
  day: z.string().min(1, "Day is required"),
  openTime: z.string().optional(),
});

export const adminSportEditSchema = z.object({
  category: z.enum(["outdoor", "indoor", "aquatic", "health", "track"]),
  coachingInfo: z.string().optional(),
  coachingLevel: z
    .enum(["Beginner", "Intermediate", "Advanced", "All"])
    .optional(),
  coachingSchedule: z.string().optional(),
  coachName: z.string().optional(),
  externalRegistrationUrl: z.string().optional(),
  facilityDetails: z.string().optional(),
  fullDescription: z.string().optional(),
  hasCoaching: z.boolean(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  schedule: z.array(adminSportScheduleEntrySchema),
  shortDescription: z.string().optional(),
  threeObjectType: z.enum([
    "cricket-ball",
    "shuttlecock",
    "tennis-ball",
    "water-sphere",
    "none",
  ]),
});

export type AdminSportEditFormValues = z.infer<typeof adminSportEditSchema>;

export const adminEventSchema = z.object({
  description: z.string().optional(),
  endDate: z.string().optional(),
  isFeatured: z.boolean(),
  registrationUrl: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug may only contain lowercase letters, numbers, and hyphens"
    ),
  startDate: z.string().min(1, "Start date is required"),
  status: z.enum(["upcoming", "ongoing", "past"]),
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.enum(["Tournament", "Cultural", "League", "Special"]),
  venue: z.string().optional(),
});

export type AdminEventFormValues = z.infer<typeof adminEventSchema>;
