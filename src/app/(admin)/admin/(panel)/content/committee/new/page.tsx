import { CommitteeMemberForm } from "@/components/sections/admin/content/CommitteeMemberForm.tsx";

export default function AdminCommitteeCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          Add Committee Member
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Create a new committee member entry.
        </p>
      </div>
      <CommitteeMemberForm mode="create" />
    </div>
  );
}
