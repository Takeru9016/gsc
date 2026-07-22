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
import type { FoodStall } from "@/lib/sanity/queries.ts";
import {
  type AdminFoodStallFormValues,
  adminFoodStallSchema,
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

function toFormValues(stall?: FoodStall): AdminFoodStallFormValues {
  if (!stall) {
    return {
      cuisineType: "",
      description: "",
      isVeg: true,
      name: "",
      order: 0,
    };
  }
  return {
    cuisineType: stall.cuisineType ?? "",
    description: stall.description ?? "",
    isVeg: stall.isVeg,
    name: stall.name,
    order: stall.order,
  };
}

interface FoodStallFormProps {
  mode: "create" | "edit";
  stall?: FoodStall;
}

export function FoodStallForm({ stall, mode }: FoodStallFormProps) {
  const router = useRouter();
  const [image, setImage] = useState<ImageValue | null>(
    (stall?.image as ImageValue | null) ?? null
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
  } = useForm<AdminFoodStallFormValues>({
    defaultValues: toFormValues(stall),
    resolver: zodResolver(adminFoodStallSchema),
  });

  const uploadImage = useCallback(
    async (file: File) => {
      if (!stall) {
        return;
      }
      setUploadError(false);
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(
          `/api/admin/content/food-stalls/${stall._id}`,
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
    [stall]
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
    async (data: AdminFoodStallFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);

      try {
        if (mode === "create") {
          const formData = new FormData();
          formData.append("name", data.name);
          formData.append("description", data.description ?? "");
          formData.append("cuisineType", data.cuisineType ?? "");
          formData.append("isVeg", String(data.isVeg));
          formData.append("order", String(data.order ?? 0));
          if (selectedFile) {
            formData.append("file", selectedFile);
          }

          const response = await fetch("/api/admin/content/food-stalls", {
            body: formData,
            method: "POST",
          });
          if (!response.ok) {
            setSaveError(true);
            return;
          }
          const result = (await response.json()) as { id: string };
          router.push(`/admin/content/food-stalls/${result.id}`);
          return;
        }

        const response = await fetch(
          `/api/admin/content/food-stalls/${stall?._id}`,
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
    [mode, stall?._id, router, selectedFile]
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
    if (!stall) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/content/food-stalls/${stall._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      router.push("/admin/content/food-stalls");
    } finally {
      setDeleting(false);
    }
  }, [stall, router]);

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="name">
            Name *
          </label>
          <input className={inputClasses} id="name" {...register("name")} />
          {errors.name ? (
            <p className={errorClasses}>{errors.name.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClasses} htmlFor="cuisineType">
            Cuisine Type *
          </label>
          <input
            className={inputClasses}
            id="cuisineType"
            placeholder="South Indian, Chinese, ..."
            {...register("cuisineType")}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="description">
          Description
        </label>
        <textarea
          className={inputClasses}
          id="description"
          rows={4}
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center gap-3">
          <input
            className="size-4 rounded border-(--color-border)"
            id="isVeg"
            type="checkbox"
            {...register("isVeg")}
          />
          <label className="font-medium text-sm" htmlFor="isVeg">
            Is Veg
          </label>
        </div>

        <div>
          <label className={labelClasses} htmlFor="order">
            Order
          </label>
          <input
            className={inputClasses}
            id="order"
            type="number"
            {...register("order", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
        </div>
      </div>

      <div>
        <p className={labelClasses}>Image</p>
        <div className="flex items-center gap-4">
          {image ? (
            <Image
              alt={stall?.name ?? "Food stall"}
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
          Something went wrong saving this stall. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <div className="flex items-center gap-3">
        <Button loading={isSubmitting} type="submit">
          {mode === "create" ? "Create Stall" : "Save Changes"}
        </Button>
        {mode === "edit" ? (
          <Button onClick={handleDeleteRequest} variant="secondary">
            Delete Stall
          </Button>
        ) : null}
      </div>

      <Dialog onOpenChange={handleDeleteOpenChange} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Food Stall</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-medium">{getValues("name")}</span>? This
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
