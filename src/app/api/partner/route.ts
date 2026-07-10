import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/index.ts";
import { type NewPartnerInquiry, partnerInquiries } from "@/lib/db/schema.ts";
import { resend } from "@/lib/email/resend.ts";
import {
  PartnerConfirmationEmail,
  partnerConfirmationSubject,
} from "@/lib/email/templates/partner.tsx";
import { partnerSchema } from "@/lib/validations.ts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = partnerSchema.safeParse(body);
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

    const newPartnerInquiry: NewPartnerInquiry = { ...data };

    const [record] = await db
      .insert(partnerInquiries)
      .values(newPartnerInquiry)
      .returning({ id: partnerInquiries.id });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string,
      react: PartnerConfirmationEmail({ data }),
      subject: partnerConfirmationSubject,
      to: data.email,
    });

    return Response.json({ id: record.id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[partner] error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
