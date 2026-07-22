import { CommitteeTable } from "@/components/sections/admin/content/CommitteeTable.tsx";
import { getCommitteeMembers } from "@/lib/sanity/queries.ts";

export default async function AdminCommitteePage() {
  const members = await getCommitteeMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Committee</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage founder members, promoter members, office bearers, and the
          governing council.
        </p>
      </div>
      <CommitteeTable members={members} />
    </div>
  );
}
