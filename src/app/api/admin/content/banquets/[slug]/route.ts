import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityPatch } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminBanquetHallEditSchema } from "@/lib/validations.ts";

const patchBodySchema = adminBanquetHallEditSchema.partial();

async function getBanquetHallId(slug: string) {
  return await serverClient.fetch<string | null>(
    `*[_type == "banquetHall" && slug.current == $slug][0]._id`,
    { slug }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { slug } = await params;

  try {
    const body = await request.json();
    const result = patchBodySchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const hallId = await getBanquetHallId(slug);
    if (!hallId) {
      return Response.json(
        { error: "Banquet hall not found", success: false },
        { status: 404 }
      );
    }

    const { data } = result;
    const patch: Record<string, unknown> = { ...data };

    if (data.description !== undefined) {
      patch.description = plainTextToPortableText(data.description);
    }
    if (data.amenities !== undefined) {
      patch.amenities = plainTextToPortableText(data.amenities);
    }
    if (data.setupOptions !== undefined) {
      patch.setupOptions = data.setupOptions.map((entry) => entry.value);
    }

    await sanityPatch(hallId, patch, "banquets");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/banquets] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { slug } = await params;

  try {
    const hallId = await getBanquetHallId(slug);
    if (!hallId) {
      return Response.json(
        { error: "Banquet hall not found", success: false },
        { status: 404 }
      );
    }

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

    await serverClient
      .patch(hallId)
      .setIfMissing({ gallery: [] })
      .append("gallery", [{ ...image, _key: crypto.randomUUID() }])
      .commit();
    revalidateTag("banquets", "max");

    return Response.json({ image, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/banquets] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
