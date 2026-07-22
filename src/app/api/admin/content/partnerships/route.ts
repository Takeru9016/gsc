import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { sanityCreate } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminPartnershipOpportunitySchema } from "@/lib/validations.ts";

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const result = adminPartnershipOpportunitySchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { data } = result;

    const created = await sanityCreate(
      {
        _type: "partnershipOpportunity",
        benefits: data.benefits.map((entry) => entry.value),
        description: data.description
          ? plainTextToPortableText(data.description)
          : undefined,
        isHighlighted: data.isHighlighted,
        order: data.order ?? 0,
        reachStats: data.reachStats || undefined,
        title: data.title,
      },
      "partners"
    );

    return Response.json({ id: created._id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/partnerships] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
