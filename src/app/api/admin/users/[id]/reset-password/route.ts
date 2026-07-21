import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.ts";
import { getSession } from "@/lib/auth/session.ts";

const PASSWORD_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

function generateTempPassword(length = 14) {
  const bytes = randomBytes(length);
  let password = "";
  for (const byte of bytes) {
    password += PASSWORD_ALPHABET[byte % PASSWORD_ALPHABET.length];
  }
  return password;
}

export async function POST(
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

  try {
    const tempPassword = generateTempPassword();

    await auth.api.setUserPassword({
      body: { newPassword: tempPassword, userId: id },
      headers: request.headers,
    });

    return Response.json(
      { password: tempPassword, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("[admin/users/reset-password] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
