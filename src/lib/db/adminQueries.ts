import { count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/index.ts";
import {
  type AchievementSubmission,
  achievementSubmissions,
  type BookingInquiry,
  bookingInquiries,
  type ContactInquiry,
  contactInquiries,
  type MembershipInquiry,
  membershipInquiries,
  type PartnerInquiry,
  partnerInquiries,
} from "@/lib/db/schema.ts";

export interface SubmissionPendingCounts {
  achievements: number;
  bookings: number;
  contacts: number;
  memberships: number;
  partners: number;
}

async function countPendingBookings() {
  const [row] = await db
    .select({ value: count() })
    .from(bookingInquiries)
    .where(eq(bookingInquiries.status, "pending"));
  return row?.value ?? 0;
}

async function countPendingMemberships() {
  const [row] = await db
    .select({ value: count() })
    .from(membershipInquiries)
    .where(eq(membershipInquiries.status, "pending"));
  return row?.value ?? 0;
}

async function countPendingContacts() {
  const [row] = await db
    .select({ value: count() })
    .from(contactInquiries)
    .where(eq(contactInquiries.status, "pending"));
  return row?.value ?? 0;
}

async function countPendingPartners() {
  const [row] = await db
    .select({ value: count() })
    .from(partnerInquiries)
    .where(eq(partnerInquiries.status, "pending"));
  return row?.value ?? 0;
}

async function countPendingAchievements() {
  const [row] = await db
    .select({ value: count() })
    .from(achievementSubmissions)
    .where(eq(achievementSubmissions.status, "pending"));
  return row?.value ?? 0;
}

export async function getSubmissionPendingCounts(): Promise<SubmissionPendingCounts> {
  const [bookings, memberships, contacts, partners, achievements] =
    await Promise.all([
      countPendingBookings(),
      countPendingMemberships(),
      countPendingContacts(),
      countPendingPartners(),
      countPendingAchievements(),
    ]);

  return { achievements, bookings, contacts, memberships, partners };
}

export async function getLatestBookings(limit = 5): Promise<BookingInquiry[]> {
  return await db
    .select()
    .from(bookingInquiries)
    .orderBy(desc(bookingInquiries.createdAt))
    .limit(limit);
}

export async function getLatestContacts(limit = 5): Promise<ContactInquiry[]> {
  return await db
    .select()
    .from(contactInquiries)
    .orderBy(desc(contactInquiries.createdAt))
    .limit(limit);
}

export async function getAllBookings(): Promise<BookingInquiry[]> {
  return await db
    .select()
    .from(bookingInquiries)
    .orderBy(desc(bookingInquiries.createdAt));
}

export async function getLatestMemberships(
  limit = 10
): Promise<MembershipInquiry[]> {
  return await db
    .select()
    .from(membershipInquiries)
    .orderBy(desc(membershipInquiries.createdAt))
    .limit(limit);
}

export async function getAllMemberships(): Promise<MembershipInquiry[]> {
  return await db
    .select()
    .from(membershipInquiries)
    .orderBy(desc(membershipInquiries.createdAt));
}

export async function getAllContacts(): Promise<ContactInquiry[]> {
  return await db
    .select()
    .from(contactInquiries)
    .orderBy(desc(contactInquiries.createdAt));
}

export async function getAllPartners(): Promise<PartnerInquiry[]> {
  return await db
    .select()
    .from(partnerInquiries)
    .orderBy(desc(partnerInquiries.createdAt));
}

export async function getAllAchievementSubmissions(): Promise<
  AchievementSubmission[]
> {
  return await db
    .select()
    .from(achievementSubmissions)
    .orderBy(desc(achievementSubmissions.createdAt));
}
