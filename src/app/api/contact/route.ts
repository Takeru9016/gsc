import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/index.ts";
import { contactInquiries, type NewContactInquiry } from "@/lib/db/schema.ts";
import { resend } from "@/lib/email/resend.ts";
import {
  ContactConfirmationEmail,
  contactConfirmationSubject,
} from "@/lib/email/templates/contact.tsx";
import { contactSchema } from "@/lib/validations.ts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = contactSchema.safeParse(body);
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

    const newContactInquiry: NewContactInquiry = {
      contactType: data.subject,
      email: data.email,
      message: data.message,
      name: data.name,
      phone: data.phone,
      subject: data.subject,
    };

    const [record] = await db
      .insert(contactInquiries)
      .values(newContactInquiry)
      .returning({ id: contactInquiries.id });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string,
      react: ContactConfirmationEmail({ data }),
      subject: contactConfirmationSubject,
      to: data.email,
    });

    return Response.json({ id: record.id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[contact] error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
