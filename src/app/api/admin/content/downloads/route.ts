import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityCreate } from "@/lib/sanity/write.ts";
import { adminDownloadSchema } from "@/lib/validations.ts";

const createSchema = adminDownloadSchema.omit({ isActive: true });

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
        { error: "File is required", success: false },
        { status: 400 }
      );
    }

    const result = createSchema.safeParse({
      category: formData.get("category"),
      publishedDate: formData.get("publishedDate"),
      title: formData.get("title"),
    });
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { data } = result;

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await serverClient.assets.upload("file", buffer, {
      contentType: file.type,
      filename: file.name,
    });

    const created = await sanityCreate(
      {
        _type: "download",
        category: data.category,
        file: {
          _type: "file" as const,
          asset: { _ref: asset._id, _type: "reference" as const },
        },
        isActive: true,
        publishedDate: data.publishedDate,
        title: data.title,
      },
      "downloads"
    );

    return Response.json(
      {
        _id: created._id,
        category: data.category,
        file: asset.url,
        fileSize: null,
        isActive: true,
        publishedDate: data.publishedDate,
        success: true,
        title: data.title,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[admin/content/downloads] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
