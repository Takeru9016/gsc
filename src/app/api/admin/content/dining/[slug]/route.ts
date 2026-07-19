import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityPatch } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminDiningVenueEditSchema } from "@/lib/validations.ts";

const patchBodySchema = adminDiningVenueEditSchema.partial();

const UPLOAD_FIELDS = ["gallery", "menuPdf", "barMenuPdf"] as const;
type UploadField = (typeof UPLOAD_FIELDS)[number];

function isUploadField(value: unknown): value is UploadField {
  return UPLOAD_FIELDS.includes(value as UploadField);
}

async function getDiningVenueId(slug: string) {
  return await serverClient.fetch<string | null>(
    `*[_type == "diningVenue" && slug.current == $slug][0]._id`,
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

    const venueId = await getDiningVenueId(slug);
    if (!venueId) {
      return Response.json(
        { error: "Dining venue not found", success: false },
        { status: 404 }
      );
    }

    const { data } = result;
    const patch: Record<string, unknown> = { ...data };

    if (data.description !== undefined) {
      patch.description = plainTextToPortableText(data.description);
    }
    if (data.openingHours !== undefined) {
      patch.openingHours = data.openingHours.map((entry) => ({
        _key: crypto.randomUUID(),
        _type: "object",
        ...entry,
      }));
    }

    await sanityPatch(venueId, patch, "dining");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/dining] PATCH error:", error);
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
    const venueId = await getDiningVenueId(slug);
    if (!venueId) {
      return Response.json(
        { error: "Dining venue not found", success: false },
        { status: 404 }
      );
    }

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

    if (field === "gallery") {
      const asset = await serverClient.assets.upload("image", buffer, {
        contentType: file.type,
        filename: file.name,
      });
      const image = {
        _type: "image" as const,
        asset: { _ref: asset._id, _type: "reference" as const },
      };

      await serverClient
        .patch(venueId)
        .setIfMissing({ gallery: [] })
        .append("gallery", [{ ...image, _key: crypto.randomUUID() }])
        .commit();
      revalidateTag("dining", "max");

      return Response.json({ image, success: true }, { status: 200 });
    }

    const asset = await serverClient.assets.upload("file", buffer, {
      contentType: file.type,
      filename: file.name,
    });
    const fileValue = {
      _type: "file" as const,
      asset: { _ref: asset._id, _type: "reference" as const },
    };

    await sanityPatch(venueId, { [field]: fileValue }, "dining");

    return Response.json({ success: true, url: asset.url }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/dining] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
