"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import {
  Controller,
  type ControllerRenderProps,
  type UseFormRegister,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { DiningVenueDetail } from "@/lib/sanity/queries.ts";
import { portableTextToPlainText } from "@/lib/utils.ts";
import {
  type AdminDiningVenueEditFormValues,
  adminDiningVenueEditSchema,
} from "@/lib/validations.ts";

const TYPE_OPTIONS: AdminDiningVenueEditFormValues["type"][] = [
  "Veg",
  "NonVeg",
  "Mixed",
];

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface ImageValue {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

function toFormValues(
  venue: DiningVenueDetail
): AdminDiningVenueEditFormValues {
  return {
    cuisineType: venue.cuisineType ?? "",
    description: portableTextToPlainText(venue.description),
    name: venue.name,
    openingHours: venue.openingHours.map((entry) => ({
      day: entry.day,
      hours: entry.hours,
    })),
    reservationInfo: venue.reservationInfo ?? "",
    seatingCapacity: venue.seatingCapacity ?? undefined,
    tagline: venue.tagline ?? "",
    type: venue.type as AdminDiningVenueEditFormValues["type"],
  };
}

interface HoursRowProps {
  index: number;
  onRemove: (index: number) => void;
  register: UseFormRegister<AdminDiningVenueEditFormValues>;
}

function HoursRow({ index, onRemove, register }: HoursRowProps) {
  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-(--color-border) p-4 md:grid-cols-[1fr_1fr_auto]">
      <input
        className={inputClasses}
        placeholder="Day"
        {...register(`openingHours.${index}.day` as const)}
      />
      <input
        className={inputClasses}
        placeholder="Hours"
        {...register(`openingHours.${index}.hours` as const)}
      />
      <Button
        ariaLabel="Remove day"
        onClick={handleRemove}
        size="sm"
        variant="secondary"
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

interface GalleryUploadProps {
  images: ImageValue[];
  isUploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  venueName: string;
}

function GalleryUpload({
  images,
  isUploading,
  onUpload,
  venueName,
}: GalleryUploadProps) {
  return (
    <div>
      <p className={labelClasses}>Gallery</p>
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <Image
            alt={`${venueName} gallery ${index + 1}`}
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
          onChange={onUpload}
          type="file"
        />
      </div>
    </div>
  );
}

interface PdfUploadProps {
  fileUrl: string | null;
  isUploading: boolean;
  label: string;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadId: string;
}

function PdfUpload({
  fileUrl,
  isUploading,
  label,
  onUpload,
  uploadId,
}: PdfUploadProps) {
  return (
    <div>
      <p className={labelClasses}>{label}</p>
      <div className="flex items-center gap-4">
        {fileUrl ? (
          <a
            className="text-primary text-sm underline"
            href={fileUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            View current PDF
          </a>
        ) : (
          <span className="text-(--color-text-secondary) text-xs">
            No file uploaded
          </span>
        )}
        <label
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
          htmlFor={uploadId}
        >
          <Upload aria-hidden="true" className="size-4 shrink-0" />
          <span className="text-sm">Upload new PDF</span>
          {isUploading ? (
            <Loader2
              aria-hidden="true"
              className="size-4 shrink-0 animate-spin"
            />
          ) : null}
        </label>
        <input
          accept="application/pdf"
          className="sr-only"
          id={uploadId}
          onChange={onUpload}
          type="file"
        />
      </div>
    </div>
  );
}

interface DiningVenueEditFormProps {
  venue: DiningVenueDetail;
}

export function DiningVenueEditForm({ venue }: DiningVenueEditFormProps) {
  const [gallery, setGallery] = useState<ImageValue[]>(
    venue.gallery as unknown as ImageValue[]
  );
  const [menuPdfUrl, setMenuPdfUrl] = useState<string | null>(venue.menuPdf);
  const [barMenuPdfUrl, setBarMenuPdfUrl] = useState<string | null>(
    venue.barMenuPdf
  );
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminDiningVenueEditFormValues>({
    defaultValues: toFormValues(venue),
    resolver: zodResolver(adminDiningVenueEditSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "openingHours",
  });

  const uploadFile = useCallback(
    async (field: "gallery" | "menuPdf" | "barMenuPdf", file: File) => {
      setUploadError(false);
      setUploadingField(field);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("field", field);
        const response = await fetch(
          `/api/admin/content/dining/${venue.slug}`,
          { body: formData, method: "POST" }
        );
        if (!response.ok) {
          throw new Error("upload-failed");
        }
        const result = (await response.json()) as {
          image?: ImageValue;
          url?: string;
        };
        if (field === "gallery" && result.image) {
          setGallery((prev) => [...prev, result.image as ImageValue]);
        } else if (field === "menuPdf" && result.url) {
          setMenuPdfUrl(result.url);
        } else if (field === "barMenuPdf" && result.url) {
          setBarMenuPdfUrl(result.url);
        }
      } catch {
        setUploadError(true);
      } finally {
        setUploadingField(null);
      }
    },
    [venue.slug]
  );

  const handleGalleryUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadFile("gallery", file);
      }
    },
    [uploadFile]
  );

  const handleMenuPdfUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadFile("menuPdf", file);
      }
    },
    [uploadFile]
  );

  const handleBarMenuPdfUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadFile("barMenuPdf", file);
      }
    },
    [uploadFile]
  );

  const renderTypeField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AdminDiningVenueEditFormValues, "type">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="type">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {TYPE_OPTIONS.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const handleAddHoursEntry = useCallback(() => {
    append({ day: "", hours: "" });
  }, [append]);

  const onSubmit = useCallback(
    async (data: AdminDiningVenueEditFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);
      try {
        const response = await fetch(
          `/api/admin/content/dining/${venue.slug}`,
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
    [venue.slug]
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="type">
            Type *
          </label>
          <Controller control={control} name="type" render={renderTypeField} />
          {errors.type ? (
            <p className={errorClasses}>{errors.type.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClasses} htmlFor="cuisineType">
            Cuisine Type
          </label>
          <input
            className={inputClasses}
            id="cuisineType"
            {...register("cuisineType")}
          />
        </div>
      </div>

      {venue.hasBar ? (
        <div>
          <p className={labelClasses}>Age Restriction</p>
          <Badge variant="gold">{`${venue.ageRestriction ?? 25}+`}</Badge>
        </div>
      ) : null}

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

      <GalleryUpload
        images={gallery}
        isUploading={uploadingField === "gallery"}
        onUpload={handleGalleryUpload}
        venueName={venue.name}
      />

      <PdfUpload
        fileUrl={menuPdfUrl}
        isUploading={uploadingField === "menuPdf"}
        label="Menu PDF"
        onUpload={handleMenuPdfUpload}
        uploadId="menuPdfUpload"
      />

      {venue.hasBar ? (
        <PdfUpload
          fileUrl={barMenuPdfUrl}
          isUploading={uploadingField === "barMenuPdf"}
          label="Bar Menu PDF"
          onUpload={handleBarMenuPdfUpload}
          uploadId="barMenuPdfUpload"
        />
      ) : null}

      {uploadError ? (
        <p className={errorClasses}>Upload failed. Please try again.</p>
      ) : null}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className={labelClasses}>Opening Hours</p>
          <Button onClick={handleAddHoursEntry} size="sm" variant="secondary">
            <Plus aria-hidden="true" className="size-4" />
            Add Day
          </Button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <HoursRow
              index={index}
              key={field.id}
              onRemove={remove}
              register={register}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="seatingCapacity">
            Seating Capacity
          </label>
          <input
            className={inputClasses}
            id="seatingCapacity"
            type="number"
            {...register("seatingCapacity", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {errors.seatingCapacity ? (
            <p className={errorClasses}>{errors.seatingCapacity.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClasses} htmlFor="reservationInfo">
            Reservation Info
          </label>
          <input
            className={inputClasses}
            id="reservationInfo"
            {...register("reservationInfo")}
          />
        </div>
      </div>

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving this venue. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <Button loading={isSubmitting} type="submit">
        Save Changes
      </Button>
    </form>
  );
}
