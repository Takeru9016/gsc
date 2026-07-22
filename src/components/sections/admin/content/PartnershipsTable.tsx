"use client";

import { useCallback, useState } from "react";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { PartnershipOpportunity } from "@/lib/sanity/queries.ts";

interface OpportunityRowProps {
  onDeleteRequest: (opportunity: PartnershipOpportunity) => void;
  opportunity: PartnershipOpportunity;
}

function OpportunityRow({ opportunity, onDeleteRequest }: OpportunityRowProps) {
  const handleDeleteRequest = useCallback(() => {
    onDeleteRequest(opportunity);
  }, [onDeleteRequest, opportunity]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{opportunity.title}</td>
      <td className="px-4 py-3 align-top">{opportunity.reachStats ?? "—"}</td>
      <td className="px-4 py-3 align-top">
        <Badge
          size="sm"
          variant={opportunity.isHighlighted ? "gold" : "outline"}
        >
          {opportunity.isHighlighted ? "Highlighted" : "Standard"}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top">{opportunity.order}</td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/admin/content/partnerships/${opportunity._id}`}
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
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  opportunity: PartnershipOpportunity | null;
  pending: boolean;
}

function DeleteConfirmDialog({
  opportunity,
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(opportunity)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Partnership Opportunity</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{opportunity?.title}</span>? This cannot
          be undone.
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

interface PartnershipsTableProps {
  opportunities: PartnershipOpportunity[];
}

export function PartnershipsTable({ opportunities }: PartnershipsTableProps) {
  const [rows, setRows] = useState(opportunities);
  const [deleteTarget, setDeleteTarget] =
    useState<PartnershipOpportunity | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRequest = useCallback(
    (opportunity: PartnershipOpportunity) => {
      setDeleteTarget(opportunity);
    },
    []
  );

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
        `/api/admin/content/partnerships/${deleteTarget._id}`,
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
      <div className="flex justify-end">
        <Button href="/admin/content/partnerships/new" size="sm">
          Add Opportunity
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No partnership opportunities yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Reach Stats</th>
                <th className="px-4 py-3 font-medium">Highlighted</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((opportunity) => (
                <OpportunityRow
                  key={opportunity._id}
                  onDeleteRequest={handleDeleteRequest}
                  opportunity={opportunity}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmDialog
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        opportunity={deleteTarget}
        pending={deleting}
      />
    </div>
  );
}
