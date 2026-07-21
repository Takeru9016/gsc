import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  type AdminUserRow,
  UsersTable,
} from "@/components/sections/admin/UsersTable.tsx";
import { auth } from "@/lib/auth/auth.ts";
import { requireSession } from "@/lib/auth/session.ts";
import { getLastSignInMap } from "@/lib/db/adminQueries.ts";

export const metadata: Metadata = {
  title: "Users",
};

export default async function AdminUsersPage() {
  const session = await requireSession();
  if (session?.user.role !== "admin") {
    redirect("/admin/dashboard?notice=unauthorized");
  }

  const [{ users }, lastSignInMap] = await Promise.all([
    auth.api.listUsers({
      headers: await headers(),
      query: { sortBy: "createdAt", sortDirection: "desc" },
    }),
    getLastSignInMap(),
  ]);

  const rows: AdminUserRow[] = users.map((user) => ({
    createdAt: user.createdAt.toISOString(),
    email: user.email,
    id: user.id,
    lastSignIn: lastSignInMap[user.id]?.toISOString() ?? null,
    name: user.name,
    role: user.role ?? "staff",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Users</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage admin panel access for GSC staff.
        </p>
      </div>

      <UsersTable currentUserId={session.user.id} users={rows} />
    </div>
  );
}
