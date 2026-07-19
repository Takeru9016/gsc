import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.ts";

export async function getSession(request?: NextRequest) {
  return await auth.api.getSession({
    headers: request?.headers ?? new Headers(),
  });
}

export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return null;
  }
  return session;
}
