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
import type { AffiliatedClub } from "@/lib/sanity/queries.ts";
import {
  type AdminAffiliatedClubFormValues,
  adminAffiliatedClubSchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface ClubCardProps {
  club: AffiliatedClub;
  isPending: boolean;
  onDeleteRequest: (club: AffiliatedClub) => void;
  onEditRequest: (club: AffiliatedClub) => void;
}

function ClubCard({
  club,
  isPending,
  onDeleteRequest,
  onEditRequest,
}: ClubCardProps) {
  const handleEdit = useCallback(() => {
    onEditRequest(club);
  }, [onEditRequest, club]);

  const handleDelete = useCallback(() => {
    onDeleteRequest(club);
  }, [onDeleteRequest, club]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
      <div className="flex items-center gap-4">
        {club.logo ? (
          <Image
            alt={club.name}
            className="rounded-lg object-cover"
            height={48}
            src={urlFor(club.logo).width(48).height(48).url()}
            width={48}
          />
        ) : null}
        <div>
          <p className="font-medium text-sm">{club.name}</p>
          <p className="text-(--color-text-secondary) text-xs">
            {club.location}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          disabled={isPending}
          onClick={handleEdit}
          size="sm"
          variant="secondary"
        >
          Edit
        </Button>
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
    </div>
  );
}

interface DeleteConfirmDialogProps {
  club: AffiliatedClub | null;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
}

function DeleteConfirmDialog({
  club,
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(club)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Affiliated Club</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{club?.name}</span>? This cannot be
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

function clubToFormValues(
  club: AffiliatedClub | null
): AdminAffiliatedClubFormValues {
  return {
    location: club?.location ?? "",
    name: club?.name ?? "",
    reciprocalBenefits: club?.reciprocalBenefits ?? "",
  };
}

interface EditClubDialogProps {
  club: AffiliatedClub | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (key: string, values: AdminAffiliatedClubFormValues) => void;
}

function EditClubDialog({ club, onOpenChange, onSaved }: EditClubDialogProps) {
  const [saveError, setSaveError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminAffiliatedClubFormValues>({
    resolver: zodResolver(adminAffiliatedClubSchema),
    values: clubToFormValues(club),
  });

  const onSubmit = useCallback(
    async (data: AdminAffiliatedClubFormValues) => {
      if (!club) {
        return;
      }
      setSaveError(false);
      try {
        const response = await fetch(
          `/api/admin/content/membership/clubs/${club._key}`,
          {
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
            method: "PATCH",
          }
        );
        if (!response.ok) {
          setSaveError(true);
          return;
        }
        onSaved(club._key, data);
      } catch {
        setSaveError(true);
      }
    },
    [club, onSaved]
  );

  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(club)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Affiliated Club</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className={labelClasses} htmlFor="editClubName">
              Name *
            </label>
            <input
              className={inputClasses}
              id="editClubName"
              {...register("name")}
            />
            {errors.name ? (
              <p className={errorClasses}>{errors.name.message}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClasses} htmlFor="editClubLocation">
              Location *
            </label>
            <input
              className={inputClasses}
              id="editClubLocation"
              {...register("location")}
            />
            {errors.location ? (
              <p className={errorClasses}>{errors.location.message}</p>
            ) : null}
          </div>
          <div>
            <label
              className={labelClasses}
              htmlFor="editClubReciprocalBenefits"
            >
              Reciprocal Benefits
            </label>
            <textarea
              className={inputClasses}
              id="editClubReciprocalBenefits"
              rows={3}
              {...register("reciprocalBenefits")}
            />
          </div>
          {saveError ? (
            <p className={errorClasses}>
              Something went wrong. Please try again.
            </p>
          ) : null}
          <Button loading={isSubmitting} type="submit">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface AddClubDialogProps {
  onCreated: (club: AffiliatedClub) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function AddClubDialog({ onCreated, onOpenChange, open }: AddClubDialogProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminAffiliatedClubFormValues>({
    resolver: zodResolver(adminAffiliatedClubSchema),
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
    async (data: AdminAffiliatedClubFormValues) => {
      setSubmitError(false);
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("location", data.location);
        formData.append("reciprocalBenefits", data.reciprocalBenefits ?? "");
        if (selectedFile) {
          formData.append("file", selectedFile);
        }

        const response = await fetch("/api/admin/content/membership/clubs", {
          body: formData,
          method: "POST",
        });
        if (!response.ok) {
          setSubmitError(true);
          return;
        }
        const result = (await response.json()) as { club: AffiliatedClub };
        onCreated(result.club);
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
          <DialogTitle>Add Affiliated Club</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className={labelClasses} htmlFor="addClubName">
              Name *
            </label>
            <input
              className={inputClasses}
              id="addClubName"
              {...register("name")}
            />
            {errors.name ? (
              <p className={errorClasses}>{errors.name.message}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClasses} htmlFor="addClubLocation">
              Location *
            </label>
            <input
              className={inputClasses}
              id="addClubLocation"
              {...register("location")}
            />
            {errors.location ? (
              <p className={errorClasses}>{errors.location.message}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClasses} htmlFor="addClubReciprocalBenefits">
              Reciprocal Benefits
            </label>
            <textarea
              className={inputClasses}
              id="addClubReciprocalBenefits"
              rows={3}
              {...register("reciprocalBenefits")}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="addClubLogo">
              Logo
            </label>
            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
              htmlFor="addClubLogo"
            >
              <Upload aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate text-sm">
                {fileName ?? "Upload club logo (optional)"}
              </span>
            </label>
            <input
              accept="image/*"
              className="sr-only"
              id="addClubLogo"
              onChange={handleFileChange}
              type="file"
            />
          </div>
          {submitError ? (
            <p className={errorClasses}>
              Something went wrong. Please try again.
            </p>
          ) : null}
          <Button loading={isSubmitting} type="submit">
            Add Club
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface AffiliatedClubsManagerProps {
  clubs: AffiliatedClub[];
}

export function AffiliatedClubsManager({ clubs }: AffiliatedClubsManagerProps) {
  const [rows, setRows] = useState(clubs);
  const [editTarget, setEditTarget] = useState<AffiliatedClub | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AffiliatedClub | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const handleEditRequest = useCallback((club: AffiliatedClub) => {
    setEditTarget(club);
  }, []);

  const handleEditOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setEditTarget(null);
    }
  }, []);

  const handleSaved = useCallback(
    (key: string, values: AdminAffiliatedClubFormValues) => {
      setRows((prev) =>
        prev.map((row) => (row._key === key ? { ...row, ...values } : row))
      );
      setEditTarget(null);
    },
    []
  );

  const handleDeleteRequest = useCallback((club: AffiliatedClub) => {
    setDeleteTarget(club);
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
        `/api/admin/content/membership/clubs/${deleteTarget._key}`,
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

  const handleCreated = useCallback((club: AffiliatedClub) => {
    setRows((prev) => [...prev, club]);
    setAddOpen(false);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-body font-semibold text-lg">Affiliated Clubs</h2>
        <Button onClick={handleOpenAdd} size="sm">
          <Plus aria-hidden="true" className="size-4" />
          Add Club
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No affiliated clubs yet.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((club) => (
            <ClubCard
              club={club}
              isPending={deletingKey === club._key}
              key={club._key}
              onDeleteRequest={handleDeleteRequest}
              onEditRequest={handleEditRequest}
            />
          ))}
        </div>
      )}

      <EditClubDialog
        club={editTarget}
        onOpenChange={handleEditOpenChange}
        onSaved={handleSaved}
      />

      <DeleteConfirmDialog
        club={deleteTarget}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        pending={Boolean(deletingKey)}
      />

      <AddClubDialog
        onCreated={handleCreated}
        onOpenChange={handleAddOpenChange}
        open={addOpen}
      />
    </div>
  );
}
