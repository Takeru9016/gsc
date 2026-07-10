import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/index.ts";
import {
  achievementSubmissions,
  type NewAchievementSubmission,
} from "@/lib/db/schema.ts";
import { resend } from "@/lib/email/resend.ts";
import {
  AchievementReceivedEmail,
  achievementReceivedSubject,
} from "@/lib/email/templates/achievement.tsx";
import { achievementSchema } from "@/lib/validations.ts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = achievementSchema.safeParse(body);
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

    const newAchievementSubmission: NewAchievementSubmission = { ...data };

    const [record] = await db
      .insert(achievementSubmissions)
      .values(newAchievementSubmission)
      .returning({ id: achievementSubmissions.id });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string,
      react: AchievementReceivedEmail({ data }),
      subject: achievementReceivedSubject,
      to: data.email,
    });

    return Response.json({ id: record.id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[achievement] error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
