import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/index.ts";
import { bookingInquiries, type NewBookingInquiry } from "@/lib/db/schema.ts";
import { resend } from "@/lib/email/resend.ts";
import {
  BookingConfirmationEmail,
  bookingConfirmationSubject,
} from "@/lib/email/templates/booking.tsx";
import { bookingSchema } from "@/lib/validations.ts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = bookingSchema.safeParse(body);
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

    const newBooking: NewBookingInquiry = { ...data };

    const [record] = await db
      .insert(bookingInquiries)
      .values(newBooking)
      .returning({ id: bookingInquiries.id });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string,
      react: BookingConfirmationEmail({ data }),
      subject: bookingConfirmationSubject,
      to: data.email,
    });

    return Response.json({ id: record.id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[booking] error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
