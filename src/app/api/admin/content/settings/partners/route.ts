import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { getOrCreateSingletonId } from "@/lib/sanity/write.ts";
import { adminCorporatePartnerSchema } from "@/lib/validations.ts";

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return Response.json(
        { error: "Logo is required", success: false },
        { status: 400 }
      );
    }

    const result = adminCorporatePartnerSchema.safeParse({
      name: formData.get("name"),
      url: formData.get("url") || undefined,
    });
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }
    const { data } = result;

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await serverClient.assets.upload("image", buffer, {
      contentType: file.type,
      filename: file.name,
    });
    const logo = {
      _type: "image" as const,
      asset: { _ref: asset._id, _type: "reference" as const },
    };

    const siteConfigId = await getOrCreateSingletonId(
      "siteConfig",
      "site-config"
    );

    const partner = {
      _key: crypto.randomUUID(),
      _type: "object" as const,
      logo,
      name: data.name,
      ...(data.url ? { url: data.url } : {}),
    };

    await serverClient
      .patch(siteConfigId)
      .setIfMissing({ corporatePartners: [] })
      .append("corporatePartners", [partner])
      .commit();
    revalidateTag("site-config", "max");

    return Response.json({ partner, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/settings/partners] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
