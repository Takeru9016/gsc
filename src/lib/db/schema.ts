import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Enums ──────────────────────────────────────────────────────────────────

export const bookingTypeEnum = pgEnum("booking_type", [
  "room",
  "banquet",
  "ground",
  "coaching",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "reviewed",
  "confirmed",
  "rejected",
  "cancelled",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "pending",
  "reviewed",
  "contacted",
  "closed",
]);

export const contactTypeEnum = pgEnum("contact_type", [
  "general",
  "membership",
  "event",
  "partnership",
  "media",
  "leagues",
]);

export const contactStatusEnum = pgEnum("contact_status", [
  "pending",
  "reviewed",
  "responded",
  "closed",
]);

export const partnerStatusEnum = pgEnum("partner_status", [
  "pending",
  "reviewing",
  "negotiating",
  "active",
  "declined",
]);

export const achievementStatusEnum = pgEnum("achievement_status", [
  "pending",
  "approved",
  "rejected",
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

export const bookingInquiries = pgTable("booking_inquiries", {
  bookingType: bookingTypeEnum("booking_type").notNull(),
  checkIn: date("check_in"),
  checkOut: date("check_out"),
  coachingLevel: varchar("coaching_level", { length: 50 }),
  // Coaching fields
  coachingSport: varchar("coaching_sport", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: varchar("email", { length: 300 }).notNull(),
  eventDate: date("event_date"),
  eventType: varchar("event_type", { length: 100 }),
  groundDate: date("ground_date"),
  groundTime: varchar("ground_time", { length: 50 }),
  guestCount: integer("guest_count"),
  guests: integer("guests"),
  // Banquet fields
  hallPreference: varchar("hall_preference", { length: 100 }),
  id: uuid("id").defaultRandom().primaryKey(),
  message: text("message"),
  // Common fields
  name: varchar("name", { length: 200 }).notNull(),
  notes: text("notes"),
  phone: varchar("phone", { length: 20 }).notNull(),
  // Room fields
  roomType: varchar("room_type", { length: 100 }),
  // Ground fields
  sport: varchar("sport", { length: 100 }),
  status: bookingStatusEnum("status").default("pending").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const membershipInquiries = pgTable("membership_inquiries", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: varchar("email", { length: 300 }).notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  membershipType: varchar("membership_type", { length: 50 }).notNull(),
  message: text("message"),
  name: varchar("name", { length: 200 }).notNull(),
  notes: text("notes"),
  phone: varchar("phone", { length: 20 }).notNull(),
  status: membershipStatusEnum("status").default("pending").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  contactType: contactTypeEnum("contact_type").default("general").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: varchar("email", { length: 300 }).notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  message: text("message").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  notes: text("notes"),
  phone: varchar("phone", { length: 20 }),
  status: contactStatusEnum("status").default("pending").notNull(),
  subject: varchar("subject", { length: 300 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const partnerInquiries = pgTable("partner_inquiries", {
  companyName: varchar("company_name", { length: 300 }).notNull(),
  contactName: varchar("contact_name", { length: 200 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: varchar("email", { length: 300 }).notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  message: text("message"),
  notes: text("notes"),
  partnershipType: varchar("partnership_type", { length: 100 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  status: partnerStatusEnum("status").default("pending").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const achievementSubmissions = pgTable("achievement_submissions", {
  achievementTitle: varchar("achievement_title", { length: 300 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  description: text("description"),
  email: varchar("email", { length: 300 }).notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: varchar("image_url", { length: 500 }),
  level: varchar("level", { length: 50 }).notNull(),
  memberName: varchar("member_name", { length: 200 }).notNull(),
  notes: text("notes"),
  phone: varchar("phone", { length: 20 }),
  sport: varchar("sport", { length: 100 }).notNull(),
  status: achievementStatusEnum("status").default("pending").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  year: integer("year").notNull(),
});

// ─── Type Exports ────────────────────────────────────────────────────────────

export type BookingInquiry = typeof bookingInquiries.$inferSelect;
export type NewBookingInquiry = typeof bookingInquiries.$inferInsert;

export type MembershipInquiry = typeof membershipInquiries.$inferSelect;
export type NewMembershipInquiry = typeof membershipInquiries.$inferInsert;

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type NewContactInquiry = typeof contactInquiries.$inferInsert;

export type PartnerInquiry = typeof partnerInquiries.$inferSelect;
export type NewPartnerInquiry = typeof partnerInquiries.$inferInsert;

export type AchievementSubmission = typeof achievementSubmissions.$inferSelect;
export type NewAchievementSubmission =
  typeof achievementSubmissions.$inferInsert;
