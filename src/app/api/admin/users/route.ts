import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.ts";
import { getSession } from "@/lib/auth/session.ts";
import { adminCreateUserSchema } from "@/lib/validations.ts";

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();
    const result = adminCreateUserSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { data } = result;

    const created = await auth.api.createUser({
      body: {
        data: { role: data.role },
        email: data.email,
        name: data.name,
        password: data.password,
      },
      headers: request.headers,
    });

    return Response.json(
      { success: true, user: created.user },
      { status: 200 }
    );
  } catch (error) {
    console.error("[admin/users] POST error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: message, success: false }, { status: 400 });
  }
}
