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
import type { FoodStall } from "@/lib/sanity/queries.ts";

interface StallRowProps {
  onDeleteRequest: (stall: FoodStall) => void;
  stall: FoodStall;
}

function StallRow({ stall, onDeleteRequest }: StallRowProps) {
  const handleDeleteRequest = useCallback(() => {
    onDeleteRequest(stall);
  }, [onDeleteRequest, stall]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{stall.name}</td>
      <td className="px-4 py-3 align-top">{stall.cuisineType ?? "—"}</td>
      <td className="px-4 py-3 align-top">
        <Badge size="sm" variant={stall.isVeg ? "green" : "red"}>
          {stall.isVeg ? "Veg" : "Non-Veg"}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top">{stall.order}</td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/admin/content/food-stalls/${stall._id}`}
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
  pending: boolean;
  stall: FoodStall | null;
}

function DeleteConfirmDialog({
  stall,
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(stall)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Food Stall</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{stall?.name}</span>? This cannot be
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

interface FoodStallsTableProps {
  stalls: FoodStall[];
}

export function FoodStallsTable({ stalls }: FoodStallsTableProps) {
  const [rows, setRows] = useState(stalls);
  const [deleteTarget, setDeleteTarget] = useState<FoodStall | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRequest = useCallback((stall: FoodStall) => {
    setDeleteTarget(stall);
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
        `/api/admin/content/food-stalls/${deleteTarget._id}`,
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
        <Button href="/admin/content/food-stalls/new" size="sm">
          Add Stall
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No food stalls yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Cuisine Type</th>
                <th className="px-4 py-3 font-medium">Veg / Non-Veg</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((stall) => (
                <StallRow
                  key={stall._id}
                  onDeleteRequest={handleDeleteRequest}
                  stall={stall}
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
        pending={deleting}
        stall={deleteTarget}
      />
    </div>
  );
}
