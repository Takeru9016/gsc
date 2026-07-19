import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session.ts";
import { db } from "@/lib/db/index.ts";
import {
  achievementStatusEnum,
  achievementSubmissions,
  bookingInquiries,
  bookingStatusEnum,
  contactInquiries,
  contactStatusEnum,
  membershipInquiries,
  membershipStatusEnum,
  partnerInquiries,
  partnerStatusEnum,
} from "@/lib/db/schema.ts";

const STATUS_VALUES_BY_TABLE = {
  achievements: achievementStatusEnum.enumValues,
  bookings: bookingStatusEnum.enumValues,
  contacts: contactStatusEnum.enumValues,
  memberships: membershipStatusEnum.enumValues,
  partners: partnerStatusEnum.enumValues,
} as const;

type TableKey = keyof typeof STATUS_VALUES_BY_TABLE;

function isTableKey(value: string): value is TableKey {
  return value in STATUS_VALUES_BY_TABLE;
}

async function updateTableStatus(
  table: TableKey,
  id: string,
  status: string,
  notes: string | undefined
) {
  const updatedAt = new Date();

  if (table === "bookings") {
    const values: Partial<typeof bookingInquiries.$inferInsert> = {
      status: status as (typeof bookingStatusEnum.enumValues)[number],
      updatedAt,
    };
    if (notes !== undefined) {
      values.notes = notes;
    }
    await db
      .update(bookingInquiries)
      .set(values)
      .where(eq(bookingInquiries.id, id));
    return;
  }

  if (table === "memberships") {
    const values: Partial<typeof membershipInquiries.$inferInsert> = {
      status: status as (typeof membershipStatusEnum.enumValues)[number],
      updatedAt,
    };
    if (notes !== undefined) {
      values.notes = notes;
    }
    await db
      .update(membershipInquiries)
      .set(values)
      .where(eq(membershipInquiries.id, id));
    return;
  }

  if (table === "contacts") {
    const values: Partial<typeof contactInquiries.$inferInsert> = {
      status: status as (typeof contactStatusEnum.enumValues)[number],
      updatedAt,
    };
    if (notes !== undefined) {
      values.notes = notes;
    }
    await db
      .update(contactInquiries)
      .set(values)
      .where(eq(contactInquiries.id, id));
    return;
  }

  if (table === "partners") {
    const values: Partial<typeof partnerInquiries.$inferInsert> = {
      status: status as (typeof partnerStatusEnum.enumValues)[number],
      updatedAt,
    };
    if (notes !== undefined) {
      values.notes = notes;
    }
    await db
      .update(partnerInquiries)
      .set(values)
      .where(eq(partnerInquiries.id, id));
    return;
  }

  const values: Partial<typeof achievementSubmissions.$inferInsert> = {
    status: status as (typeof achievementStatusEnum.enumValues)[number],
    updatedAt,
  };
  if (notes !== undefined) {
    values.notes = notes;
  }
  await db
    .update(achievementSubmissions)
    .set(values)
    .where(eq(achievementSubmissions.id, id));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; table: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { table, id } = await params;
  if (!isTableKey(table)) {
    return Response.json(
      { error: "Unknown submission table", success: false },
      { status: 400 }
    );
  }

  const statusValues = STATUS_VALUES_BY_TABLE[table] as unknown as [
    string,
    ...string[],
  ];
  const bodySchema = z.object({
    notes: z.string().optional(),
    status: z.enum(statusValues),
  });

  try {
    const body = await request.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    await updateTableStatus(table, id, result.data.status, result.data.notes);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/submissions/status] error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
