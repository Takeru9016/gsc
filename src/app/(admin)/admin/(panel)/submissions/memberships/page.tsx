import { MembershipsTable } from "@/components/sections/admin/submissions/MembershipsTable.tsx";
import { getAllMemberships } from "@/lib/db/adminQueries.ts";

export default async function AdminMembershipSubmissionsPage() {
  const memberships = await getAllMemberships();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          Membership Submissions
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Membership interest inquiries across all types.
        </p>
      </div>
      <MembershipsTable memberships={memberships} />
    </div>
  );
}
