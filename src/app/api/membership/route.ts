import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/index.ts";
import {
  membershipInquiries,
  type NewMembershipInquiry,
} from "@/lib/db/schema.ts";
import { resend } from "@/lib/email/resend.ts";
import {
  MembershipConfirmationEmail,
  membershipConfirmationSubject,
} from "@/lib/email/templates/membership.tsx";
import { membershipInterestSchema } from "@/lib/validations.ts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = membershipInterestSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        {
          details:
            process.env.NODE_ENV === "development"
              ? z.flattenError(result.error)
              : undefined,
          error: "Validation failed",
          success: false,
        },
        { status: 400 }
      );
    }

    const { data } = result;

    const newMembershipInquiry: NewMembershipInquiry = { ...data };

    const [record] = await db
      .insert(membershipInquiries)
      .values(newMembershipInquiry)
      .returning({ id: membershipInquiries.id });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string,
      react: MembershipConfirmationEmail({ data }),
      subject: membershipConfirmationSubject,
      to: data.email,
    });

    return Response.json({ id: record.id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[membership] error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
