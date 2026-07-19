"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { type UseFormRegister, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/shared/Button.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { BanquetHallDetail } from "@/lib/sanity/queries.ts";
import { portableTextToPlainText } from "@/lib/utils.ts";
import {
  type AdminBanquetHallEditFormValues,
  adminBanquetHallEditSchema,
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

function toFormValues(hall: BanquetHallDetail): AdminBanquetHallEditFormValues {
  return {
    amenities: portableTextToPlainText(hall.amenities),
    capacity: hall.capacity ?? undefined,
    description: portableTextToPlainText(hall.description),
    name: hall.name,
    setupOptions: hall.setupOptions.map((value) => ({ value })),
    tagline: hall.tagline ?? "",
  };
}

interface SetupOptionRowProps {
  index: number;
  onRemove: (index: number) => void;
  register: UseFormRegister<AdminBanquetHallEditFormValues>;
}

function SetupOptionRow({ index, onRemove, register }: SetupOptionRowProps) {
  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  return (
    <div className="flex items-center gap-2">
      <input
        className={inputClasses}
        placeholder="e.g. Theatre, Banquet, Cocktail"
        {...register(`setupOptions.${index}.value` as const)}
      />
      <Button
        ariaLabel="Remove setup option"
        onClick={handleRemove}
        size="sm"
        variant="secondary"
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

interface BanquetHallEditFormProps {
  hall: BanquetHallDetail;
}

export function BanquetHallEditForm({ hall }: BanquetHallEditFormProps) {
  const [gallery, setGallery] = useState<ImageValue[]>(
    hall.gallery as unknown as ImageValue[]
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminBanquetHallEditFormValues>({
    defaultValues: toFormValues(hall),
    resolver: zodResolver(adminBanquetHallEditSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "setupOptions",
  });

  const handleGalleryUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      setUploadError(false);
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(
          `/api/admin/content/banquets/${hall.slug}`,
          { body: formData, method: "POST" }
        );
        if (!response.ok) {
          throw new Error("upload-failed");
        }
        const result = (await response.json()) as { image: ImageValue };
        setGallery((prev) => [...prev, result.image]);
      } catch {
        setUploadError(true);
      } finally {
        setIsUploading(false);
      }
    },
    [hall.slug]
  );

  const handleAddSetupOption = useCallback(() => {
    append({ value: "" });
  }, [append]);

  const onSubmit = useCallback(
    async (data: AdminBanquetHallEditFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);
      try {
        const response = await fetch(
          `/api/admin/content/banquets/${hall.slug}`,
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
    [hall.slug]
  );

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
          <label className={labelClasses} htmlFor="tagline">
            Tagline
          </label>
          <input
            className={inputClasses}
            id="tagline"
            {...register("tagline")}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="capacity">
          Capacity
        </label>
        <input
          className={inputClasses}
          id="capacity"
          type="number"
          {...register("capacity", {
            setValueAs: (value) => (value === "" ? undefined : Number(value)),
          })}
        />
        {errors.capacity ? (
          <p className={errorClasses}>{errors.capacity.message}</p>
        ) : null}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className={labelClasses}>Setup Options</p>
          <Button onClick={handleAddSetupOption} size="sm" variant="secondary">
            <Plus aria-hidden="true" className="size-4" />
            Add Option
          </Button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <SetupOptionRow
              index={index}
              key={field.id}
              onRemove={remove}
              register={register}
            />
          ))}
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="description">
          Description
        </label>
        <textarea
          className={inputClasses}
          id="description"
          rows={5}
          {...register("description")}
        />
        <p className="mt-1 text-(--color-text-secondary) text-xs">
          [FUTURE] replace with a proper rich text editor (Tiptap or Plate).
          Plain text is converted to portable text blocks on save.
        </p>
      </div>

      <div>
        <label className={labelClasses} htmlFor="amenities">
          Amenities
        </label>
        <textarea
          className={inputClasses}
          id="amenities"
          rows={4}
          {...register("amenities")}
        />
      </div>

      <div>
        <p className={labelClasses}>Gallery</p>
        <div className="flex flex-wrap gap-3">
          {gallery.map((image, index) => (
            <Image
              alt={`${hall.name} gallery ${index + 1}`}
              className="rounded-xl object-cover"
              height={96}
              key={image.asset._ref}
              src={urlFor(image).width(160).height(96).url()}
              width={160}
            />
          ))}
          <label
            className="flex h-24 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) text-(--color-text-secondary) text-xs transition-all duration-200 hover:border-primary hover:text-primary"
            htmlFor="galleryUpload"
          >
            {isUploading ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Upload aria-hidden="true" className="size-4" />
            )}
            Add photo
          </label>
          <input
            accept="image/*"
            className="sr-only"
            id="galleryUpload"
            onChange={handleGalleryUpload}
            type="file"
          />
        </div>
        {uploadError ? (
          <p className={errorClasses}>Upload failed. Please try again.</p>
        ) : null}
      </div>

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving this hall. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <Button loading={isSubmitting} type="submit">
        Save Changes
      </Button>
    </form>
  );
}
