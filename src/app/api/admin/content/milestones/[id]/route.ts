import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityDelete, sanityPatch } from "@/lib/sanity/write.ts";
import { adminMilestoneSchema } from "@/lib/validations.ts";

const patchBodySchema = adminMilestoneSchema.partial();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const result = patchBodySchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    await sanityPatch(id, result.data, "milestones");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/milestones] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    await sanityDelete(id, "milestones");
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/milestones] DELETE error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return Response.json(
        { error: "No file provided", success: false },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await serverClient.assets.upload("image", buffer, {
      contentType: file.type,
      filename: file.name,
    });

    const image = {
      _type: "image" as const,
      asset: { _ref: asset._id, _type: "reference" as const },
    };

    await sanityPatch(id, { image }, "milestones");

    return Response.json({ image, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/milestones] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
