"use client";

import { type ChangeEvent, useCallback, useState } from "react";
import {
  type SubmissionColumn,
  SubmissionsTableShell,
} from "@/components/sections/admin/submissions/SubmissionsTableShell.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { BookingInquiry } from "@/lib/db/schema.ts";
import { getStatusBadgeVariant } from "@/lib/utils.ts";

const STATUS_FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

const BOOKING_TYPE_LABELS: Record<BookingInquiry["bookingType"], string> = {
  banquet: "Banquet",
  coaching: "Coaching",
  ground: "Ground",
  room: "Room",
};

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) text-sm outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getRelevantDate(booking: BookingInquiry) {
  if (booking.bookingType === "room") {
    return booking.checkIn;
  }
  if (booking.bookingType === "banquet") {
    return booking.eventDate;
  }
  if (booking.bookingType === "ground") {
    return booking.groundDate;
  }
  return null;
}

function getBookingId(row: BookingInquiry) {
  return row.id;
}

function getBookingStatus(row: BookingInquiry) {
  return row.status;
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-(--color-text-secondary) text-xs uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}

interface DetailFieldEntry {
  label: string;
  value: string;
}

function getBookingDetailFields(row: BookingInquiry): DetailFieldEntry[] {
  const fields: DetailFieldEntry[] = [
    { label: "Name", value: row.name },
    { label: "Email", value: row.email },
    { label: "Phone", value: row.phone },
    { label: "Booking Type", value: BOOKING_TYPE_LABELS[row.bookingType] },
  ];

  const optionalEntries: [string | null | undefined, string, string?][] = [
    [row.roomType, "Room Type"],
    [row.checkIn, "Check In", formatDate(row.checkIn)],
    [row.checkOut, "Check Out", formatDate(row.checkOut)],
    [row.guests ? String(row.guests) : null, "Guests"],
    [row.hallPreference, "Hall Preference"],
    [row.eventType, "Event Type"],
    [row.guestCount ? String(row.guestCount) : null, "Guest Count"],
    [row.eventDate, "Event Date", formatDate(row.eventDate)],
    [row.sport, "Sport"],
    [row.groundDate, "Ground Date", formatDate(row.groundDate)],
    [row.groundTime, "Ground Time"],
    [row.coachingSport, "Coaching Sport"],
    [row.coachingLevel, "Coaching Level"],
  ];

  for (const [rawValue, label, formatted] of optionalEntries) {
    if (rawValue) {
      fields.push({ label, value: formatted ?? rawValue });
    }
  }

  fields.push({ label: "Status", value: row.status });
  fields.push({ label: "Created", value: formatDate(row.createdAt) });

  return fields;
}

interface BookingRowActionsProps {
  onConfirm: (row: BookingInquiry) => void;
  onMarkReviewed: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (row: BookingInquiry) => void;
  pendingId: string | null;
  row: BookingInquiry;
}

function BookingRowActions({
  onConfirm,
  onMarkReviewed,
  onReject,
  onViewDetails,
  pendingId,
  row,
}: BookingRowActionsProps) {
  const { id } = row;
  const isPending = pendingId === id;

  const handleReviewed = useCallback(() => {
    onMarkReviewed(id);
  }, [onMarkReviewed, id]);

  const handleConfirm = useCallback(() => {
    onConfirm(row);
  }, [onConfirm, row]);

  const handleReject = useCallback(() => {
    onReject(id);
  }, [onReject, id]);

  const handleViewDetails = useCallback(() => {
    onViewDetails(row);
  }, [onViewDetails, row]);

  return (
    <>
      <Button
        disabled={isPending}
        onClick={handleReviewed}
        size="sm"
        variant="secondary"
      >
        Mark Reviewed
      </Button>
      <Button
        disabled={isPending}
        onClick={handleConfirm}
        size="sm"
        variant="primary"
      >
        Confirm
      </Button>
      <Button
        disabled={isPending}
        onClick={handleReject}
        size="sm"
        variant="secondary"
      >
        Reject
      </Button>
      <Button onClick={handleViewDetails} size="sm" variant="secondary">
        View Details
      </Button>
    </>
  );
}

interface BookingConfirmDialogProps {
  notes: string;
  onCancel: () => void;
  onNotesChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  pending: boolean;
  row: BookingInquiry | null;
}

function BookingConfirmDialog({
  notes,
  onCancel,
  onNotesChange,
  onOpenChange,
  onSubmit,
  pending,
  row,
}: BookingConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(row)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
        </DialogHeader>
        <div>
          <label className={labelClasses} htmlFor="confirm-notes">
            Internal Notes
          </label>
          <textarea
            className={inputClasses}
            id="confirm-notes"
            onChange={onNotesChange}
            rows={4}
            value={notes}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} size="sm" variant="secondary">
            Cancel
          </Button>
          <Button loading={pending} onClick={onSubmit} size="sm">
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface BookingDetailDialogProps {
  notes: string;
  onClose: () => void;
  onNotesChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  row: BookingInquiry | null;
  saving: boolean;
}

function BookingDetailDialog({
  notes,
  onClose,
  onNotesChange,
  onOpenChange,
  onSave,
  row,
  saving,
}: BookingDetailDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(row)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        {row ? (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {getBookingDetailFields(row).map((field) => (
                <DetailField
                  key={field.label}
                  label={field.label}
                  value={field.value}
                />
              ))}
            </dl>
            {row.message ? (
              <div>
                <p className="text-(--color-text-secondary) text-xs uppercase tracking-wide">
                  Message
                </p>
                <p className="mt-1 text-sm">{row.message}</p>
              </div>
            ) : null}
            <div>
              <label className={labelClasses} htmlFor="detail-notes">
                Internal Notes
              </label>
              <textarea
                className={inputClasses}
                id="detail-notes"
                onChange={onNotesChange}
                rows={4}
                value={notes}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={onClose} size="sm" variant="secondary">
                Close
              </Button>
              <Button loading={saving} onClick={onSave} size="sm">
                Save Notes
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface BookingsTableProps {
  bookings: BookingInquiry[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const [rows, setRows] = useState(bookings);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmRow, setConfirmRow] = useState<BookingInquiry | null>(null);
  const [confirmNotes, setConfirmNotes] = useState("");
  const [detailRow, setDetailRow] = useState<BookingInquiry | null>(null);
  const [detailNotes, setDetailNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const updateStatus = useCallback(
    async (id: string, status: BookingInquiry["status"], notes?: string) => {
      setPendingId(id);
      try {
        const response = await fetch(
          `/api/admin/submissions/bookings/${id}/status`,
          {
            body: JSON.stringify({ notes, status }),
            headers: { "Content-Type": "application/json" },
            method: "PATCH",
          }
        );
        if (!response.ok) {
          return;
        }
        setRows((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, notes: notes ?? row.notes, status } : row
          )
        );
      } finally {
        setPendingId(null);
      }
    },
    []
  );

  const handleMarkReviewed = useCallback(
    (id: string) => {
      updateStatus(id, "reviewed");
    },
    [updateStatus]
  );

  const handleReject = useCallback(
    (id: string) => {
      updateStatus(id, "rejected");
    },
    [updateStatus]
  );

  const openConfirm = useCallback((row: BookingInquiry) => {
    setConfirmRow(row);
    setConfirmNotes(row.notes ?? "");
  }, []);

  const openDetail = useCallback((row: BookingInquiry) => {
    setDetailRow(row);
    setDetailNotes(row.notes ?? "");
  }, []);

  const handleConfirmOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setConfirmRow(null);
    }
  }, []);

  const handleDetailOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setDetailRow(null);
    }
  }, []);

  const handleCancelConfirm = useCallback(() => {
    setConfirmRow(null);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailRow(null);
  }, []);

  const handleConfirmNotesChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setConfirmNotes(event.target.value);
    },
    []
  );

  const handleDetailNotesChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setDetailNotes(event.target.value);
    },
    []
  );

  const submitConfirm = useCallback(async () => {
    if (!confirmRow) {
      return;
    }
    await updateStatus(confirmRow.id, "confirmed", confirmNotes);
    setConfirmRow(null);
  }, [confirmRow, confirmNotes, updateStatus]);

  const saveDetailNotes = useCallback(async () => {
    if (!detailRow) {
      return;
    }
    setSavingNotes(true);
    try {
      const response = await fetch(
        `/api/admin/submissions/bookings/${detailRow.id}/status`,
        {
          body: JSON.stringify({
            notes: detailNotes,
            status: detailRow.status,
          }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        }
      );
      if (!response.ok) {
        return;
      }
      const savedId = detailRow.id;
      setRows((prev) =>
        prev.map((row) =>
          row.id === savedId ? { ...row, notes: detailNotes } : row
        )
      );
      setDetailRow(null);
    } finally {
      setSavingNotes(false);
    }
  }, [detailRow, detailNotes]);

  const columns: SubmissionColumn<BookingInquiry>[] = [
    { header: "Name", key: "name", render: (row) => row.name },
    { header: "Phone", key: "phone", render: (row) => row.phone },
    {
      header: "Booking Type",
      key: "bookingType",
      render: (row) => BOOKING_TYPE_LABELS[row.bookingType],
    },
    {
      header: "Date",
      key: "date",
      render: (row) => formatDate(getRelevantDate(row)),
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <Badge size="sm" variant={getStatusBadgeVariant(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (row) => formatDate(row.createdAt),
    },
  ];

  const renderActions = useCallback(
    (row: BookingInquiry) => (
      <BookingRowActions
        onConfirm={openConfirm}
        onMarkReviewed={handleMarkReviewed}
        onReject={handleReject}
        onViewDetails={openDetail}
        pendingId={pendingId}
        row={row}
      />
    ),
    [openConfirm, handleMarkReviewed, handleReject, openDetail, pendingId]
  );

  return (
    <>
      <SubmissionsTableShell
        columns={columns}
        emptyLabel="No booking inquiries match this filter."
        getId={getBookingId}
        getStatus={getBookingStatus}
        renderActions={renderActions}
        rows={rows}
        statusFilters={STATUS_FILTERS}
      />

      <BookingConfirmDialog
        notes={confirmNotes}
        onCancel={handleCancelConfirm}
        onNotesChange={handleConfirmNotesChange}
        onOpenChange={handleConfirmOpenChange}
        onSubmit={submitConfirm}
        pending={pendingId === confirmRow?.id}
        row={confirmRow}
      />

      <BookingDetailDialog
        notes={detailNotes}
        onClose={handleCloseDetail}
        onNotesChange={handleDetailNotesChange}
        onOpenChange={handleDetailOpenChange}
        onSave={saveDetailNotes}
        row={detailRow}
        saving={savingNotes}
      />
    </>
  );
}
