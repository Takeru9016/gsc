import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityCreate } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminEventSchema } from "@/lib/validations.ts";

async function slugExists(slug: string) {
  const id = await serverClient.fetch<string | null>(
    `*[_type == "event" && slug.current == $slug][0]._id`,
    { slug }
  );
  return Boolean(id);
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const result = adminEventSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { data } = result;

    if (await slugExists(data.slug)) {
      return Response.json(
        { error: "An event with this slug already exists", success: false },
        { status: 409 }
      );
    }

    const doc: Record<string, unknown> & { _type: string } = {
      _type: "event",
      description: plainTextToPortableText(data.description ?? ""),
      isFeatured: data.isFeatured,
      registrationUrl: data.registrationUrl || undefined,
      slug: { _type: "slug", current: data.slug },
      startDate: data.startDate,
      status: data.status,
      title: data.title,
      type: data.type,
      venue: data.venue || undefined,
    };

    if (data.endDate) {
      doc.endDate = data.endDate;
    }

    const created = await sanityCreate(doc, "events");

    return Response.json({ id: created._id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/events] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
