import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityPatch } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminMembershipTypeEditSchema } from "@/lib/validations.ts";

const patchBodySchema = adminMembershipTypeEditSchema.partial();

async function getMembershipTypeId(type: string) {
  return await serverClient.fetch<string | null>(
    `*[_type == "membershipType" && type == $type][0]._id`,
    { type }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { type } = await params;

  try {
    const body = await request.json();
    const result = patchBodySchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const membershipTypeId = await getMembershipTypeId(type);
    if (!membershipTypeId) {
      return Response.json(
        { error: "Membership type not found", success: false },
        { status: 404 }
      );
    }

    const { data } = result;
    const patch: Record<string, unknown> = { ...data };

    if (data.eligibility !== undefined) {
      patch.eligibility = plainTextToPortableText(data.eligibility);
    }
    if (data.benefits !== undefined) {
      patch.benefits = plainTextToPortableText(data.benefits);
    }
    if (data.feeStructure !== undefined) {
      patch.feeStructure = plainTextToPortableText(data.feeStructure);
    }

    await sanityPatch(membershipTypeId, patch, "membership");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/membership-types] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
