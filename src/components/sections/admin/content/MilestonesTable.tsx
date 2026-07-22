"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { Milestone } from "@/lib/sanity/queries.ts";

const DESCRIPTION_PREVIEW_LENGTH = 100;

function previewText(value: string | null) {
  if (!value) {
    return "—";
  }
  return value.length > DESCRIPTION_PREVIEW_LENGTH
    ? `${value.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`
    : value;
}

interface MilestoneRowProps {
  milestone: Milestone;
  onDeleteRequest: (milestone: Milestone) => void;
}

function MilestoneRow({ milestone, onDeleteRequest }: MilestoneRowProps) {
  const handleDeleteRequest = useCallback(() => {
    onDeleteRequest(milestone);
  }, [onDeleteRequest, milestone]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{milestone.year}</td>
      <td className="px-4 py-3 align-top">{milestone.title}</td>
      <td className="px-4 py-3 align-top text-(--color-text-secondary)">
        {previewText(milestone.description)}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/admin/content/milestones/${milestone._id}`}
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
  milestone: Milestone | null;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
}

function DeleteConfirmDialog({
  milestone,
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(milestone)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Milestone</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{milestone?.title}</span>? This cannot
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

interface MilestonesTableProps {
  milestones: Milestone[];
}

export function MilestonesTable({ milestones }: MilestonesTableProps) {
  const [rows, setRows] = useState(milestones);
  const [deleteTarget, setDeleteTarget] = useState<Milestone | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRequest = useCallback((milestone: Milestone) => {
    setDeleteTarget(milestone);
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
        `/api/admin/content/milestones/${deleteTarget._id}`,
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
        <Button href="/admin/content/milestones/new" size="sm">
          Add Milestone
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No milestones yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((milestone) => (
                <MilestoneRow
                  key={milestone._id}
                  milestone={milestone}
                  onDeleteRequest={handleDeleteRequest}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmDialog
        milestone={deleteTarget}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        pending={deleting}
      />
    </div>
  );
}
