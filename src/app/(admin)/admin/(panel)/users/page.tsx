import { redirect } from "next/navigation";
import { AdminPlaceholder } from "@/components/shared/AdminPlaceholder.tsx";
import { requireSession } from "@/lib/auth/session.ts";

export default async function AdminUsersPage() {
  const session = await requireSession();
  if (session?.user.role !== "admin") {
    redirect("/admin/dashboard");
  }

  return <AdminPlaceholder taskCode="ADMIN-08" title="User Management" />;
}
