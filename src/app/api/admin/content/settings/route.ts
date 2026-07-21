import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { getOrCreateSingletonId, sanityPatch } from "@/lib/sanity/write.ts";
import { adminSiteConfigSchema } from "@/lib/validations.ts";

const patchBodySchema = adminSiteConfigSchema.partial();

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

    const { bookingEmail, ...siteConfigFields } = result.data;

    if (Object.keys(siteConfigFields).length > 0) {
      const siteConfigId = await getOrCreateSingletonId(
        "siteConfig",
        "site-config"
      );
      await sanityPatch(siteConfigId, siteConfigFields, "site-config");
    }

    if (bookingEmail !== undefined) {
      const bookingConfigId = await getOrCreateSingletonId(
        "bookingConfig",
        "booking-config"
      );
      await sanityPatch(bookingConfigId, { bookingEmail }, "booking-config");
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/settings] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
