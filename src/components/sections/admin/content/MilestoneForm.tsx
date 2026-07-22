"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import type { Milestone } from "@/lib/sanity/queries.ts";
import {
  type AdminMilestoneFormValues,
  adminMilestoneSchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface ImageValue {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

function toFormValues(milestone?: Milestone): AdminMilestoneFormValues {
  if (!milestone) {
    return { description: "", title: "", year: new Date().getFullYear() };
  }
  return {
    description: milestone.description ?? "",
    title: milestone.title,
    year: milestone.year,
  };
}

interface MilestoneFormProps {
  milestone?: Milestone;
  mode: "create" | "edit";
}

export function MilestoneForm({ milestone, mode }: MilestoneFormProps) {
  const router = useRouter();
  const [image, setImage] = useState<ImageValue | null>(
    (milestone?.image as ImageValue | null) ?? null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AdminMilestoneFormValues>({
    defaultValues: toFormValues(milestone),
    resolver: zodResolver(adminMilestoneSchema),
  });

  const uploadImage = useCallback(
    async (file: File) => {
      if (!milestone) {
        return;
      }
      setUploadError(false);
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(
          `/api/admin/content/milestones/${milestone._id}`,
          { body: formData, method: "POST" }
        );
        if (!response.ok) {
          throw new Error("upload-failed");
        }
        const result = (await response.json()) as { image: ImageValue };
        setImage(result.image);
      } catch {
        setUploadError(true);
      } finally {
        setIsUploading(false);
      }
    },
    [milestone]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      if (mode === "create") {
        setSelectedFile(file);
        setFileName(file.name);
        return;
      }
      uploadImage(file);
    },
    [mode, uploadImage]
  );

  const onSubmit = useCallback(
    async (data: AdminMilestoneFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);

      try {
        if (mode === "create") {
          const formData = new FormData();
          formData.append("title", data.title);
          formData.append("year", String(data.year));
          formData.append("description", data.description ?? "");
          if (selectedFile) {
            formData.append("file", selectedFile);
          }

          const response = await fetch("/api/admin/content/milestones", {
            body: formData,
            method: "POST",
          });
          if (!response.ok) {
            setSaveError(true);
            return;
          }
          const result = (await response.json()) as { id: string };
          router.push(`/admin/content/milestones/${result.id}`);
          return;
        }

        const response = await fetch(
          `/api/admin/content/milestones/${milestone?._id}`,
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
        setSaveSuccess(true);
      } catch {
        setSaveError(true);
      }
    },
    [mode, milestone?._id, router, selectedFile]
  );

  const handleDeleteOpenChange = useCallback((open: boolean) => {
    setDeleteOpen(open);
  }, []);

  const handleDeleteRequest = useCallback(() => {
    setDeleteOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!milestone) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/content/milestones/${milestone._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      router.push("/admin/content/milestones");
    } finally {
      setDeleting(false);
    }
  }, [milestone, router]);

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="year">
            Year *
          </label>
          <input
            className={inputClasses}
            id="year"
            type="number"
            {...register("year", { valueAsNumber: true })}
          />
          {errors.year ? (
            <p className={errorClasses}>{errors.year.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClasses} htmlFor="title">
            Title *
          </label>
          <input
            className={inputClasses}
            id="title"
            placeholder="GSC Founded"
            {...register("title")}
          />
          {errors.title ? (
            <p className={errorClasses}>{errors.title.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="description">
          Description *
        </label>
        <textarea
          className={inputClasses}
          id="description"
          rows={4}
          {...register("description")}
        />
        {errors.description ? (
          <p className={errorClasses}>{errors.description.message}</p>
        ) : null}
      </div>

      <div>
        <p className={labelClasses}>Image</p>
        <div className="flex items-center gap-4">
          {image ? (
            <Image
              alt={milestone?.title ?? "Milestone"}
              className="rounded-xl object-cover"
              height={96}
              src={urlFor(image).width(160).height(96).url()}
              width={160}
            />
          ) : (
            <div className="flex h-24 w-40 items-center justify-center rounded-xl bg-(--color-surface) text-(--color-text-secondary) text-xs">
              No image
            </div>
          )}
          <label
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
            htmlFor="image"
          >
            <Upload aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate text-sm">
              {fileName ?? "Upload new image"}
            </span>
            {isUploading ? (
              <Loader2
                aria-hidden="true"
                className="size-4 shrink-0 animate-spin"
              />
            ) : null}
          </label>
          <input
            accept="image/*"
            className="sr-only"
            id="image"
            onChange={handleFileChange}
            type="file"
          />
        </div>
        {uploadError ? (
          <p className={errorClasses}>Image upload failed. Please try again.</p>
        ) : null}
      </div>

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving this milestone. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <div className="flex items-center gap-3">
        <Button loading={isSubmitting} type="submit">
          {mode === "create" ? "Create Milestone" : "Save Changes"}
        </Button>
        {mode === "edit" ? (
          <Button onClick={handleDeleteRequest} variant="secondary">
            Delete Milestone
          </Button>
        ) : null}
      </div>

      <Dialog onOpenChange={handleDeleteOpenChange} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Milestone</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-medium">{getValues("title")}</span>? This
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancelDelete} size="sm" variant="secondary">
              Cancel
            </Button>
            <Button loading={deleting} onClick={handleConfirmDelete} size="sm">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
