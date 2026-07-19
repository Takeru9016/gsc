import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session.ts";
import { db } from "@/lib/db/index.ts";
import { achievementSubmissions } from "@/lib/db/schema.ts";
import { serverClient } from "@/lib/sanity/client.ts";

const approveSchema = z.object({
  submissionId: z.string().min(1),
});

async function uploadSubmissionImage(imageUrl: string, filename: string) {
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    return null;
  }

  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";

  const asset = await serverClient.assets.upload("image", buffer, {
    contentType,
    filename,
  });

  return { _ref: asset._id, _type: "reference" as const };
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const result = approveSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { submissionId } = result.data;

    const [submission] = await db
      .select()
      .from(achievementSubmissions)
      .where(eq(achievementSubmissions.id, submissionId));

    if (!submission) {
      return Response.json(
        { error: "Submission not found", success: false },
        { status: 404 }
      );
    }

    const imageAssetRef = submission.imageUrl
      ? await uploadSubmissionImage(
          submission.imageUrl,
          `${submission.memberName}-${submission.year}`
        )
      : null;

    const sanityDoc = await serverClient.create({
      _type: "achievement",
      ...(imageAssetRef
        ? { image: { _type: "image" as const, asset: imageAssetRef } }
        : {}),
      isApproved: true,
      level: submission.level,
      memberName: submission.memberName,
      sport: submission.sport,
      title: submission.achievementTitle,
      type: "Individual",
      year: submission.year,
    });

    await db
      .update(achievementSubmissions)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(achievementSubmissions.id, submissionId));

    return Response.json(
      { sanityId: sanityDoc._id, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("[admin/achievements/approve] error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
