import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityPatch } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminLegalPageSchema } from "@/lib/validations.ts";

const patchBodySchema = adminLegalPageSchema.partial();

async function getLegalPageId(slug: string) {
  return await serverClient.fetch<string | null>(
    `*[_type == "legalPage" && slug.current == $slug][0]._id`,
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

    const legalPageId = await getLegalPageId(slug);
    if (!legalPageId) {
      return Response.json(
        { error: "Legal page not found", success: false },
        { status: 404 }
      );
    }

    const { data } = result;
    const lastUpdated = new Date().toISOString().slice(0, 10);
    const patch: Record<string, unknown> = { ...data, lastUpdated };

    if (data.content !== undefined) {
      patch.content = plainTextToPortableText(data.content);
    }

    await sanityPatch(legalPageId, patch, "legal");

    return Response.json({ lastUpdated, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/legal] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
