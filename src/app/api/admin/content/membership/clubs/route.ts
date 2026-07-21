import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { getOrCreateSingletonId } from "@/lib/sanity/write.ts";
import { adminAffiliatedClubSchema } from "@/lib/validations.ts";

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
    const result = adminAffiliatedClubSchema.safeParse({
      location: formData.get("location"),
      name: formData.get("name"),
      reciprocalBenefits: formData.get("reciprocalBenefits") || undefined,
    });
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { data } = result;
    const file = formData.get("file");

    let logo:
      | { _type: "image"; asset: { _ref: string; _type: "reference" } }
      | undefined;
    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const asset = await serverClient.assets.upload("image", buffer, {
        contentType: file.type,
        filename: file.name,
      });
      logo = {
        _type: "image" as const,
        asset: { _ref: asset._id, _type: "reference" as const },
      };
    }

    const configId = await getOrCreateSingletonId(
      "membershipConfig",
      "membership-config"
    );

    const club = {
      _key: crypto.randomUUID(),
      _type: "object" as const,
      location: data.location,
      name: data.name,
      reciprocalBenefits: data.reciprocalBenefits ?? "",
      ...(logo ? { logo } : {}),
    };

    await serverClient
      .patch(configId)
      .setIfMissing({ affiliatedClubs: [] })
      .append("affiliatedClubs", [club])
      .commit();
    revalidateTag("membership-config", "max");

    return Response.json({ club, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/membership/clubs] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
