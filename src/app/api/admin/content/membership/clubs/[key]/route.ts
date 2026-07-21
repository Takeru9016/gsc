import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { getOrCreateSingletonId, sanityPatch } from "@/lib/sanity/write.ts";
import { adminAffiliatedClubSchema } from "@/lib/validations.ts";

const patchBodySchema = adminAffiliatedClubSchema.partial();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { key } = await params;

  try {
    const body = await request.json();
    const result = patchBodySchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const configId = await getOrCreateSingletonId(
      "membershipConfig",
      "membership-config"
    );

    const patch: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(result.data)) {
      patch[`affiliatedClubs[_key=="${key}"].${field}`] = value;
    }

    await sanityPatch(configId, patch, "membership-config");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/membership/clubs] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { key } = await params;

  try {
    const configId = await getOrCreateSingletonId(
      "membershipConfig",
      "membership-config"
    );
    await sanityPatch(configId, {}, "membership-config", [
      `affiliatedClubs[_key=="${key}"]`,
    ]);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/membership/clubs] DELETE error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
