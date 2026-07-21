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
import type { MembershipConfig } from "@/lib/sanity/queries.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface ToggleConfirmDialogProps {
  enrollmentOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  pending: boolean;
}

function ToggleConfirmDialog({
  enrollmentOpen,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  pending,
}: ToggleConfirmDialogProps) {
  const nextAction = enrollmentOpen ? "close" : "open";

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${enrollmentOpen ? "Close" : "Open"} Enrollment`}</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to {nextAction} membership enrollment? This
          affects the public site immediately.
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} size="sm" variant="secondary">
            Cancel
          </Button>
          <Button loading={pending} onClick={onConfirm} size="sm">
            {enrollmentOpen ? "Close Enrollment" : "Open Enrollment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface MembershipEnrollmentCardProps {
  config: MembershipConfig;
}

export function MembershipEnrollmentCard({
  config,
}: MembershipEnrollmentCardProps) {
  const [enrollmentOpen, setEnrollmentOpen] = useState(config.enrollmentOpen);
  const [notice, setNotice] = useState(config.enrollmentNotice ?? "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [togglePending, setTogglePending] = useState(false);
  const [noticeSaving, setNoticeSaving] = useState(false);
  const [noticeSaveError, setNoticeSaveError] = useState(false);
  const [noticeSaveSuccess, setNoticeSaveSuccess] = useState(false);

  const handleOpenConfirm = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleConfirmOpenChange = useCallback((open: boolean) => {
    setConfirmOpen(open);
  }, []);

  const handleCancelToggle = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const handleConfirmToggle = useCallback(async () => {
    setTogglePending(true);
    try {
      const response = await fetch("/api/admin/content/membership", {
        body: JSON.stringify({ enrollmentOpen: !enrollmentOpen }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) {
        return;
      }
      setEnrollmentOpen((prev) => !prev);
      setConfirmOpen(false);
    } finally {
      setTogglePending(false);
    }
  }, [enrollmentOpen]);

  const handleNoticeChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotice(event.target.value);
    },
    []
  );

  const handleSaveNotice = useCallback(async () => {
    setNoticeSaveError(false);
    setNoticeSaveSuccess(false);
    setNoticeSaving(true);
    try {
      const response = await fetch("/api/admin/content/membership", {
        body: JSON.stringify({ enrollmentNotice: notice }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) {
        setNoticeSaveError(true);
        return;
      }
      setNoticeSaveSuccess(true);
    } catch {
      setNoticeSaveError(true);
    } finally {
      setNoticeSaving(false);
    }
  }, [notice]);

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 font-medium text-(--color-text-secondary) text-sm">
            Enrollment Status
          </p>
          <Badge size="md" variant={enrollmentOpen ? "green" : "red"}>
            {enrollmentOpen ? "Enrollment OPEN" : "Enrollment CLOSED"}
          </Badge>
        </div>
        <Button onClick={handleOpenConfirm} variant="secondary">
          {enrollmentOpen ? "Close Enrollment" : "Open Enrollment"}
        </Button>
      </div>

      <div className="mt-6">
        <label className={labelClasses} htmlFor="enrollmentNotice">
          Enrollment Notice
        </label>
        <p className="mb-2 text-(--color-text-secondary) text-xs">
          Shown to visitors on the public site when enrollment is closed.
        </p>
        <textarea
          className={inputClasses}
          id="enrollmentNotice"
          onChange={handleNoticeChange}
          rows={4}
          value={notice}
        />
        {noticeSaveError ? (
          <p className={errorClasses}>Failed to save notice. Try again.</p>
        ) : null}
        {noticeSaveSuccess ? (
          <p className="mt-1 text-accent-green text-sm">Saved.</p>
        ) : null}
        <div className="mt-3">
          <Button loading={noticeSaving} onClick={handleSaveNotice} size="sm">
            Save Notice
          </Button>
        </div>
      </div>

      <ToggleConfirmDialog
        enrollmentOpen={enrollmentOpen}
        onCancel={handleCancelToggle}
        onConfirm={handleConfirmToggle}
        onOpenChange={handleConfirmOpenChange}
        open={confirmOpen}
        pending={togglePending}
      />
    </div>
  );
}
