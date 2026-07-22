import { notFound } from "next/navigation";
import { CommitteeMemberForm } from "@/components/sections/admin/content/CommitteeMemberForm.tsx";
import { getCommitteeMemberById } from "@/lib/sanity/queries.ts";

export default async function AdminCommitteeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getCommitteeMemberById(id);

  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">{member.name}</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit committee member details.
        </p>
      </div>
      <CommitteeMemberForm member={member} mode="edit" />
    </div>
  );
}
