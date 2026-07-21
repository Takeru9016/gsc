import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { getOrCreateSingletonId, sanityPatch } from "@/lib/sanity/write.ts";
import { adminMembershipConfigSchema } from "@/lib/validations.ts";

const patchBodySchema = adminMembershipConfigSchema.partial();

export async function PATCH(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

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
    await sanityPatch(configId, result.data, "membership-config");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/membership] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
