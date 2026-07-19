import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { sanityDelete } from "@/lib/sanity/write.ts";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    await sanityDelete(id, "achievements");
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/achievements] DELETE error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
