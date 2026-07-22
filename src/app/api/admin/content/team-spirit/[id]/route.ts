import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityDelete, sanityPatch } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminTeamSpiritEditionSchema } from "@/lib/validations.ts";

const patchBodySchema = adminTeamSpiritEditionSchema.partial();

const UPLOAD_FIELDS = ["coverImage", "pdfFile"] as const;
type UploadField = (typeof UPLOAD_FIELDS)[number];

function isUploadField(value: unknown): value is UploadField {
  return UPLOAD_FIELDS.includes(value as UploadField);
}

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

    if (body.removePdfFile === true) {
      await sanityPatch(id, {}, "team-spirit", ["pdfFile"]);
      return Response.json({ success: true }, { status: 200 });
    }

    const result = patchBodySchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { data } = result;
    const patch: Record<string, unknown> = { ...data };

    if (data.adSpecs !== undefined) {
      patch.adSpecs = plainTextToPortableText(data.adSpecs);
    }

    await sanityPatch(id, patch, "team-spirit");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/team-spirit] PATCH error:", error);
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
    await sanityDelete(id, "team-spirit");
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/team-spirit] DELETE error:", error);
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
    const field = formData.get("field");
    if (!(file instanceof File && isUploadField(field))) {
      return Response.json(
        { error: "Invalid upload request", success: false },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (field === "coverImage") {
      const asset = await serverClient.assets.upload("image", buffer, {
        contentType: file.type,
        filename: file.name,
      });
      const image = {
        _type: "image" as const,
        asset: { _ref: asset._id, _type: "reference" as const },
      };
      await sanityPatch(id, { coverImage: image }, "team-spirit");
      return Response.json({ image, success: true }, { status: 200 });
    }

    const asset = await serverClient.assets.upload("file", buffer, {
      contentType: file.type,
      filename: file.name,
    });
    const pdfFile = {
      _type: "file" as const,
      asset: { _ref: asset._id, _type: "reference" as const },
    };

    await sanityPatch(id, { pdfFile }, "team-spirit");

    return Response.json({ success: true, url: asset.url }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/team-spirit] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
