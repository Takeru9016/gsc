import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityDelete, sanityPatch } from "@/lib/sanity/write.ts";
import { adminAnnualReportSchema } from "@/lib/validations.ts";

const patchBodySchema = adminAnnualReportSchema.partial();

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
    const result = patchBodySchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    await sanityPatch(id, result.data, "annual-reports");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/annual-reports] PATCH error:", error);
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
    await sanityDelete(id, "annual-reports");
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/annual-reports] DELETE error:", error);
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
      await sanityPatch(id, { coverImage: image }, "annual-reports");
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

    await sanityPatch(id, { pdfFile }, "annual-reports");

    return Response.json({ success: true, url: asset.url }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/annual-reports] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
