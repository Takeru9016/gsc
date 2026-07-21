import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth.ts";
import { getSession } from "@/lib/auth/session.ts";

const roleBodySchema = z.object({
  role: z.enum(["admin", "staff"]),
});

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
  if (session.user.role !== "admin") {
    return Response.json(
      { error: "Forbidden", success: false },
      { status: 403 }
    );
  }

  const { id } = await params;

  if (id === session.user.id) {
    return Response.json(
      { error: "You cannot change your own role", success: false },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const result = roleBodySchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const updated = await auth.api.setRole({
      body: {
        role: result.data.role as unknown as "admin" | "user",
        userId: id,
      },
      headers: request.headers,
    });

    return Response.json(
      { success: true, user: updated.user },
      { status: 200 }
    );
  } catch (error) {
    console.error("[admin/users/role] PATCH error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
