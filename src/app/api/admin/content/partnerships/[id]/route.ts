import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { sanityDelete, sanityPatch } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminPartnershipOpportunitySchema } from "@/lib/validations.ts";

const patchBodySchema = adminPartnershipOpportunitySchema.partial();

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

    const { data } = result;
    const patch: Record<string, unknown> = { ...data };

    if (data.benefits !== undefined) {
      patch.benefits = data.benefits.map((entry) => entry.value);
    }
    if (data.description !== undefined) {
      patch.description = plainTextToPortableText(data.description);
    }

    await sanityPatch(id, patch, "partners");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/partnerships] PATCH error:", error);
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
    await sanityDelete(id, "partners");
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/partnerships] DELETE error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
