import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityDelete, sanityPatch } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminEventSchema } from "@/lib/validations.ts";

const patchBodySchema = adminEventSchema.partial();

async function getEventId(slug: string) {
  return await serverClient.fetch<string | null>(
    `*[_type == "event" && slug.current == $slug][0]._id`,
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

    const eventId = await getEventId(slug);
    if (!eventId) {
      return Response.json(
        { error: "Event not found", success: false },
        { status: 404 }
      );
    }

    const { data } = result;
    const patch: Record<string, unknown> = { ...data };
    const unset: string[] = [];

    if (data.description !== undefined) {
      patch.description = plainTextToPortableText(data.description);
    }
    if (data.slug !== undefined) {
      patch.slug = { _type: "slug", current: data.slug };
    }
    if (data.endDate !== undefined && !data.endDate) {
      patch.endDate = undefined;
      unset.push("endDate");
    }

    await sanityPatch(eventId, patch, "events", unset);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/events] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const eventId = await getEventId(slug);
    if (!eventId) {
      return Response.json(
        { error: "Event not found", success: false },
        { status: 404 }
      );
    }

    await sanityDelete(eventId, "events");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/events] DELETE error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
