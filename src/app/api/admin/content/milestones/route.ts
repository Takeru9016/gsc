import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityCreate } from "@/lib/sanity/write.ts";
import { adminMilestoneSchema } from "@/lib/validations.ts";

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

    const yearValue = formData.get("year");
    const result = adminMilestoneSchema.safeParse({
      description: formData.get("description"),
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

    const doc: Record<string, unknown> & { _type: string } = {
      _type: "milestone",
      description: data.description,
      title: data.title,
      year: data.year,
    };

    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const asset = await serverClient.assets.upload("image", buffer, {
        contentType: file.type,
        filename: file.name,
      });
      doc.image = {
        _type: "image" as const,
        asset: { _ref: asset._id, _type: "reference" as const },
      };
    }

    const created = await sanityCreate(doc, "milestones");

    return Response.json({ id: created._id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/milestones] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
