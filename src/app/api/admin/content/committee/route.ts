import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityCreate } from "@/lib/sanity/write.ts";
import { adminCommitteeMemberSchema } from "@/lib/validations.ts";

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

    const orderValue = formData.get("order");
    const result = adminCommitteeMemberSchema.safeParse({
      bio: formData.get("bio") || undefined,
      designation: formData.get("designation"),
      name: formData.get("name"),
      order: typeof orderValue === "string" ? Number(orderValue) : undefined,
      role: formData.get("role"),
    });

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { data } = result;

    const doc: Record<string, unknown> & { _type: string } = {
      _type: "committeeMember",
      bio: data.bio || undefined,
      designation: data.designation,
      name: data.name,
      order: data.order ?? 0,
      role: data.role,
    };

    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const asset = await serverClient.assets.upload("image", buffer, {
        contentType: file.type,
        filename: file.name,
      });
      doc.photo = {
        _type: "image" as const,
        asset: { _ref: asset._id, _type: "reference" as const },
      };
    }

    const created = await sanityCreate(doc, "committee");

    return Response.json({ id: created._id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/committee] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
