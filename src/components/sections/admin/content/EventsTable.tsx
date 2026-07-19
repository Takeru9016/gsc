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
import type { EventListItem } from "@/lib/sanity/queries.ts";
import { getStatusBadgeVariant } from "@/lib/utils.ts";

const STATUS_FILTERS = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Past", value: "past" },
];

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface EventRowProps {
  event: EventListItem;
  onDeleteRequest: (event: EventListItem) => void;
  onToggleFeatured: (event: EventListItem) => void;
  pendingSlug: string | null;
}

function EventRow({
  event,
  onDeleteRequest,
  onToggleFeatured,
  pendingSlug,
}: EventRowProps) {
  const isPending = pendingSlug === event.slug;

  const handleToggleFeatured = useCallback(() => {
    onToggleFeatured(event);
  }, [onToggleFeatured, event]);

  const handleDeleteRequest = useCallback(() => {
    onDeleteRequest(event);
  }, [onDeleteRequest, event]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{event.title}</td>
      <td className="px-4 py-3 align-top">
        <Badge size="sm" variant="outline">
          {event.type}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top">
        <Badge size="sm" variant={getStatusBadgeVariant(event.status)}>
          {event.status}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top">{formatDate(event.startDate)}</td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/admin/content/events/${event.slug}`}
            size="sm"
            variant="secondary"
          >
            Edit
          </Button>
          <Button
            disabled={isPending}
            onClick={handleToggleFeatured}
            size="sm"
            variant={event.isFeatured ? "primary" : "secondary"}
          >
            {event.isFeatured ? "Featured" : "Feature"}
          </Button>
          <Button
            disabled={isPending}
            onClick={handleDeleteRequest}
            size="sm"
            variant="secondary"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface DeleteConfirmDialogProps {
  event: EventListItem | null;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
}

function DeleteConfirmDialog({
  event,
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(event)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{event?.title}</span>? This cannot be
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

interface EventsTableProps {
  events: EventListItem[];
}

export function EventsTable({ events }: EventsTableProps) {
  const [rows, setRows] = useState(events);
  const [activeFilter, setActiveFilter] = useState("");
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredRows = activeFilter
    ? rows.filter((row) => row.status === activeFilter)
    : rows;

  const handleToggleFeatured = useCallback(async (event: EventListItem) => {
    setPendingSlug(event.slug);
    try {
      const response = await fetch(`/api/admin/content/events/${event.slug}`, {
        body: JSON.stringify({ isFeatured: !event.isFeatured }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) {
        return;
      }
      setRows((prev) =>
        prev.map((row) =>
          row.slug === event.slug
            ? { ...row, isFeatured: !event.isFeatured }
            : row
        )
      );
    } finally {
      setPendingSlug(null);
    }
  }, []);

  const handleDeleteRequest = useCallback((event: EventListItem) => {
    setDeleteTarget(event);
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
        `/api/admin/content/events/${deleteTarget.slug}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      setRows((prev) => prev.filter((row) => row.slug !== deleteTarget.slug));
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
          filters={STATUS_FILTERS}
          onFilterChange={setActiveFilter}
        />
        <Button href="/admin/content/events/new" size="sm">
          New Event
        </Button>
      </div>

      {filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No events match this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Start Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((event) => (
                <EventRow
                  event={event}
                  key={event._id}
                  onDeleteRequest={handleDeleteRequest}
                  onToggleFeatured={handleToggleFeatured}
                  pendingSlug={pendingSlug}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmDialog
        event={deleteTarget}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        pending={deleting}
      />
    </div>
  );
}
