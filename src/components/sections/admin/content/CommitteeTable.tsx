"use client";

import { useCallback, useState } from "react";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { FilterBar } from "@/components/shared/FilterBar.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { CommitteeMember } from "@/lib/sanity/queries.ts";

const ROLE_FILTERS = [
  { label: "Founder Members", value: "founderMember" },
  { label: "Promoter Members", value: "promoterMember" },
  { label: "Office Bearers", value: "officeBearer" },
  { label: "Governing Council", value: "governingCouncil" },
];

const ROLE_LABELS: Record<string, string> = {
  founderMember: "Founder Member",
  governingCouncil: "Governing Council",
  officeBearer: "Office Bearer",
  promoterMember: "Promoter Member",
};

interface MemberRowProps {
  member: CommitteeMember;
  onDeleteRequest: (member: CommitteeMember) => void;
}

function MemberRow({ member, onDeleteRequest }: MemberRowProps) {
  const handleDeleteRequest = useCallback(() => {
    onDeleteRequest(member);
  }, [onDeleteRequest, member]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{member.name}</td>
      <td className="px-4 py-3 align-top">{member.designation}</td>
      <td className="px-4 py-3 align-top">
        <Badge size="sm" variant="outline">
          {ROLE_LABELS[member.role] ?? member.role}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top">{member.order}</td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/admin/content/committee/${member._id}`}
            size="sm"
            variant="secondary"
          >
            Edit
          </Button>
          <Button onClick={handleDeleteRequest} size="sm" variant="secondary">
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface DeleteConfirmDialogProps {
  member: CommitteeMember | null;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
}

function DeleteConfirmDialog({
  member,
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(member)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Committee Member</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{member?.name}</span>? This cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} size="sm" variant="secondary">
            Cancel
          </Button>
          <Button loading={pending} onClick={onConfirm} size="sm">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CommitteeTableProps {
  members: CommitteeMember[];
}

export function CommitteeTable({ members }: CommitteeTableProps) {
  const [rows, setRows] = useState(members);
  const [activeFilter, setActiveFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CommitteeMember | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const filteredRows = activeFilter
    ? rows.filter((row) => row.role === activeFilter)
    : rows;

  const handleDeleteRequest = useCallback((member: CommitteeMember) => {
    setDeleteTarget(member);
  }, []);

  const handleDeleteOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setDeleteTarget(null);
    }
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/content/committee/${deleteTarget._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      setRows((prev) => prev.filter((row) => row._id !== deleteTarget._id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterBar
          activeValue={activeFilter}
          filters={ROLE_FILTERS}
          onFilterChange={setActiveFilter}
        />
        <Button href="/admin/content/committee/new" size="sm">
          Add Member
        </Button>
      </div>

      {filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No committee members match this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Designation</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((member) => (
                <MemberRow
                  key={member._id}
                  member={member}
                  onDeleteRequest={handleDeleteRequest}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmDialog
        member={deleteTarget}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        pending={deleting}
      />
    </div>
  );
}
