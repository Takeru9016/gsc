import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityCreate } from "@/lib/sanity/write.ts";
import { adminAchievementCreateSchema } from "@/lib/validations.ts";

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return Response.json(
        { error: "Image is required", success: false },
        { status: 400 }
      );
    }

    const yearValue = formData.get("year");
    const result = adminAchievementCreateSchema.safeParse({
      level: formData.get("level"),
      memberName: formData.get("memberName"),
      sport: formData.get("sport"),
      title: formData.get("title"),
      year: typeof yearValue === "string" ? Number(yearValue) : yearValue,
    });

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { data } = result;

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await serverClient.assets.upload("image", buffer, {
      contentType: file.type,
      filename: file.name,
    });
    const image = {
      _type: "image" as const,
      asset: { _ref: asset._id, _type: "reference" as const },
    };

    const created = await sanityCreate(
      {
        _type: "achievement",
        image,
        isApproved: true,
        level: data.level,
        memberName: data.memberName,
        sport: data.sport,
        title: data.title,
        type: "Individual",
        year: data.year,
      },
      "achievements"
    );

    return Response.json(
      {
        _id: created._id,
        image,
        level: data.level,
        memberName: data.memberName,
        sport: data.sport,
        success: true,
        title: data.title,
        year: data.year,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[admin/content/achievements] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
