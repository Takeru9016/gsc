import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { sanityDelete, sanityPatch } from "@/lib/sanity/write.ts";
import { adminDownloadSchema } from "@/lib/validations.ts";

const patchBodySchema = adminDownloadSchema.partial();

export async function PATCH(
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
    const body = await request.json();
    const result = patchBodySchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    await sanityPatch(id, result.data, "downloads");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/downloads] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

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
    await sanityDelete(id, "downloads");
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/downloads] DELETE error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
