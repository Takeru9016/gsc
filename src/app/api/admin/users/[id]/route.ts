import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.ts";
import { getSession } from "@/lib/auth/session.ts";

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
  if (session.user.role !== "admin") {
    return Response.json(
      { error: "Forbidden", success: false },
      { status: 403 }
    );
  }

  const { id } = await params;

  if (id === session.user.id) {
    return Response.json(
      { error: "You cannot delete your own account", success: false },
      { status: 400 }
    );
  }

  try {
    await auth.api.removeUser({
      body: { userId: id },
      headers: request.headers,
    });
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/users] DELETE error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
