"use client";

import { Check, Minus } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { TeamSpiritEdition } from "@/lib/sanity/queries.ts";

interface EditionRowProps {
  edition: TeamSpiritEdition;
  onDeleteRequest: (edition: TeamSpiritEdition) => void;
}

function EditionRow({ edition, onDeleteRequest }: EditionRowProps) {
  const handleDeleteRequest = useCallback(() => {
    onDeleteRequest(edition);
  }, [onDeleteRequest, edition]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{edition.editionName}</td>
      <td className="px-4 py-3 align-top">
        <Badge size="sm" variant="outline">
          {edition.edition}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top">{edition.year}</td>
      <td className="px-4 py-3 align-top">
        {edition.pdfFile ? (
          <Check
            aria-label="PDF uploaded"
            className="size-4 text-accent-green"
          />
        ) : (
          <Minus
            aria-label="No PDF uploaded"
            className="size-4 text-(--color-text-secondary)"
          />
        )}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/admin/content/team-spirit/${edition._id}`}
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
  edition: TeamSpiritEdition | null;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
}

function DeleteConfirmDialog({
  edition,
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(edition)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team Spirit Edition</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{edition?.editionName}</span>? This
          cannot be undone.
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

interface TeamSpiritTableProps {
  editions: TeamSpiritEdition[];
}

export function TeamSpiritTable({ editions }: TeamSpiritTableProps) {
  const [rows, setRows] = useState(editions);
  const [deleteTarget, setDeleteTarget] = useState<TeamSpiritEdition | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRequest = useCallback((edition: TeamSpiritEdition) => {
    setDeleteTarget(edition);
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
        `/api/admin/content/team-spirit/${deleteTarget._id}`,
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
        <Button href="/admin/content/team-spirit/new" size="sm">
          Add Edition
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No Team Spirit editions yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Edition Name</th>
                <th className="px-4 py-3 font-medium">Edition Type</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">PDF Uploaded</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((edition) => (
                <EditionRow
                  edition={edition}
                  key={edition._id}
                  onDeleteRequest={handleDeleteRequest}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmDialog
        edition={deleteTarget}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        pending={deleting}
      />
    </div>
  );
}
