import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar.tsx";
import { AdminTopBar } from "@/components/layout/AdminTopBar.tsx";
import { requireSession } from "@/lib/auth/session.ts";
import { getSubmissionPendingCounts } from "@/lib/db/adminQueries.ts";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  if (!session) {
    redirect("/admin/login");
  }

  const pendingCounts = await getSubmissionPendingCounts();
  const isAdmin = session.user.role === "admin";

  return (
    <div className="flex min-h-screen">
      <AdminSidebar isAdmin={isAdmin} pendingCounts={pendingCounts} />
      <div className="flex flex-1 flex-col">
        <AdminTopBar userName={session.user.name} />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
