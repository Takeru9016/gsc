import type { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityPatch } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminSportEditSchema } from "@/lib/validations.ts";

const patchBodySchema = adminSportEditSchema.partial().extend({
  order: z.number().int().optional(),
});

async function getSportId(slug: string) {
  return await serverClient.fetch<string | null>(
    `*[_type == "sport" && slug.current == $slug][0]._id`,
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

    const sportId = await getSportId(slug);
    if (!sportId) {
      return Response.json(
        { error: "Sport not found", success: false },
        { status: 404 }
      );
    }

    const { data } = result;
    const patch: Record<string, unknown> = { ...data };

    if (data.fullDescription !== undefined) {
      patch.fullDescription = plainTextToPortableText(data.fullDescription);
    }
    if (data.facilityDetails !== undefined) {
      patch.facilityDetails = plainTextToPortableText(data.facilityDetails);
    }
    if (data.coachingInfo !== undefined) {
      patch.coachingInfo = plainTextToPortableText(data.coachingInfo);
    }
    if (data.schedule !== undefined) {
      patch.schedule = data.schedule.map((entry) => ({
        _key: crypto.randomUUID(),
        _type: "object",
        ...entry,
      }));
    }

    await sanityPatch(sportId, patch, "sports");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/sports] PATCH error:", error);
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
    const sportId = await getSportId(slug);
    if (!sportId) {
      return Response.json(
        { error: "Sport not found", success: false },
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

    const heroImage = {
      _type: "image" as const,
      asset: { _ref: asset._id, _type: "reference" as const },
    };

    await sanityPatch(sportId, { heroImage }, "sports");

    return Response.json({ heroImage, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/sports] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
