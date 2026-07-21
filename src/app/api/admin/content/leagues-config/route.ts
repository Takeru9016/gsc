import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { getOrCreateSingletonId, sanityPatch } from "@/lib/sanity/write.ts";
import { adminLeaguePatchSchema } from "@/lib/validations.ts";

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
    const result = adminLeaguePatchSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { key, ...fields } = result.data;

    const configId = await getOrCreateSingletonId("leaguesConfig", "leagues");

    const patch: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(fields)) {
      patch[`leagues[_key=="${key}"].${field}`] = value;
    }

    await sanityPatch(configId, patch, "leagues");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/leagues-config] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
