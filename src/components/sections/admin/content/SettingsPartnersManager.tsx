"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { CorporatePartner } from "@/lib/sanity/queries.ts";
import {
  type AdminCorporatePartnerFormValues,
  adminCorporatePartnerSchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface PartnerCardProps {
  isPending: boolean;
  onDeleteRequest: (partner: CorporatePartner) => void;
  partner: CorporatePartner;
}

function PartnerCard({
  isPending,
  onDeleteRequest,
  partner,
}: PartnerCardProps) {
  const handleDelete = useCallback(() => {
    onDeleteRequest(partner);
  }, [onDeleteRequest, partner]);

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
      <div className="flex items-center gap-3">
        {partner.logo ? (
          <Image
            alt={partner.name}
            className="rounded-lg object-contain"
            height={48}
            src={urlFor(partner.logo).width(96).height(48).url()}
            width={96}
          />
        ) : null}
        <p className="font-medium text-sm">{partner.name}</p>
      </div>
      <Button
        disabled={isPending}
        loading={isPending}
        onClick={handleDelete}
        size="sm"
        variant="secondary"
      >
        <Trash2 aria-hidden="true" className="size-4" />
        Delete
      </Button>
    </div>
  );
}

interface DeleteConfirmDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  partner: CorporatePartner | null;
  pending: boolean;
}

function DeleteConfirmDialog({
  onCancel,
  onConfirm,
  onOpenChange,
  partner,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(partner)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Partner</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{partner?.name}</span>? This cannot be
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

interface AddPartnerDialogProps {
  onCreated: (partner: CorporatePartner) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function AddPartnerDialog({
  onCreated,
  onOpenChange,
  open,
}: AddPartnerDialogProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminCorporatePartnerFormValues>({
    resolver: zodResolver(adminCorporatePartnerSchema),
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setFileName(file.name);
      }
    },
    []
  );

  const onSubmit = useCallback(
    async (data: AdminCorporatePartnerFormValues) => {
      if (!selectedFile) {
        setSubmitError(true);
        return;
      }
      setSubmitError(false);
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        // biome-ignore lint/suspicious/noUnnecessaryConditions: url is optional in adminCorporatePartnerSchema (string | undefined); tsc agrees, this is a biome type-inference gap
        formData.append("url", data.url ?? "");
        formData.append("file", selectedFile);

        const response = await fetch("/api/admin/content/settings/partners", {
          body: formData,
          method: "POST",
        });
        if (!response.ok) {
          setSubmitError(true);
          return;
        }
        const result = (await response.json()) as {
          partner: CorporatePartner;
        };
        onCreated(result.partner);
        reset();
        setSelectedFile(null);
        setFileName(null);
      } catch {
        setSubmitError(true);
      }
    },
    [selectedFile, onCreated, reset]
  );

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Corporate Partner</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className={labelClasses} htmlFor="partnerName">
              Name *
            </label>
            <input
              className={inputClasses}
              id="partnerName"
              {...register("name")}
            />
            {errors.name ? (
              <p className={errorClasses}>{errors.name.message}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClasses} htmlFor="partnerUrl">
              Website URL
            </label>
            <input
              className={inputClasses}
              id="partnerUrl"
              {...register("url")}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="partnerLogo">
              Logo *
            </label>
            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
              htmlFor="partnerLogo"
            >
              <Upload aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate text-sm">
                {fileName ?? "Upload partner logo"}
              </span>
            </label>
            <input
              accept="image/*"
              className="sr-only"
              id="partnerLogo"
              onChange={handleFileChange}
              type="file"
            />
          </div>
          {submitError ? (
            <p className={errorClasses}>
              Something went wrong. Please check the fields and logo, then try
              again.
            </p>
          ) : null}
          <Button loading={isSubmitting} type="submit">
            Add Partner
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface SettingsPartnersManagerProps {
  partners: CorporatePartner[];
}

export function SettingsPartnersManager({
  partners,
}: SettingsPartnersManagerProps) {
  const [rows, setRows] = useState(partners);
  const [deleteTarget, setDeleteTarget] = useState<CorporatePartner | null>(
    null
  );
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const handleDeleteRequest = useCallback((partner: CorporatePartner) => {
    setDeleteTarget(partner);
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
    setDeletingKey(deleteTarget._key);
    try {
      const response = await fetch(
        `/api/admin/content/settings/partners/${deleteTarget._key}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      setRows((prev) => prev.filter((row) => row._key !== deleteTarget._key));
      setDeleteTarget(null);
    } finally {
      setDeletingKey(null);
    }
  }, [deleteTarget]);

  const handleOpenAdd = useCallback(() => {
    setAddOpen(true);
  }, []);

  const handleAddOpenChange = useCallback((open: boolean) => {
    setAddOpen(open);
  }, []);

  const handleCreated = useCallback((partner: CorporatePartner) => {
    setRows((prev) => [...prev, partner]);
    setAddOpen(false);
  }, []);

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-body font-semibold text-lg">Corporate Partners</h2>
        <Button onClick={handleOpenAdd} size="sm">
          <Plus aria-hidden="true" className="size-4" />
          Add Partner
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-(--color-text-secondary) text-sm">
          No corporate partners yet.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((partner) => (
            <PartnerCard
              isPending={deletingKey === partner._key}
              key={partner._key}
              onDeleteRequest={handleDeleteRequest}
              partner={partner}
            />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        partner={deleteTarget}
        pending={Boolean(deletingKey)}
      />

      <AddPartnerDialog
        onCreated={handleCreated}
        onOpenChange={handleAddOpenChange}
        open={addOpen}
      />
    </div>
  );
}
