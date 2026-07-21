import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { getOrCreateSingletonId, sanityPatch } from "@/lib/sanity/write.ts";

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
    const siteConfigId = await getOrCreateSingletonId(
      "siteConfig",
      "site-config"
    );
    await sanityPatch(siteConfigId, {}, "site-config", [
      `corporatePartners[_key=="${key}"]`,
    ]);
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/settings/partners] DELETE error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
