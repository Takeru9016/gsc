"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  Controller,
  type ControllerRenderProps,
  useForm,
} from "react-hook-form";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { TeamSpiritEdition } from "@/lib/sanity/queries.ts";
import { portableTextToPlainText } from "@/lib/utils.ts";
import {
  type AdminTeamSpiritEditionFormValues,
  adminTeamSpiritEditionSchema,
} from "@/lib/validations.ts";

const EDITION_OPTIONS: AdminTeamSpiritEditionFormValues["edition"][] = [
  "Summer",
  "Diwali",
  "NewYear",
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
  edition?: TeamSpiritEdition
): AdminTeamSpiritEditionFormValues {
  if (!edition) {
    return {
      adSpecs: "",
      description: "",
      edition: "Summer",
      editionName: "",
      publicationDate: "",
      year: new Date().getFullYear(),
    };
  }
  return {
    adSpecs: portableTextToPlainText(edition.adSpecs),
    description: edition.description ?? "",
    edition: edition.edition as AdminTeamSpiritEditionFormValues["edition"],
    editionName: edition.editionName,
    publicationDate: edition.publicationDate ?? "",
    year: edition.year,
  };
}

interface TeamSpiritFormProps {
  edition?: TeamSpiritEdition;
  mode: "create" | "edit";
}

export function TeamSpiritForm({ edition, mode }: TeamSpiritFormProps) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<ImageValue | null>(
    (edition?.coverImage as ImageValue | null) ?? null
  );
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(
    edition?.pdfFile ?? null
  );
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<
    "coverImage" | "pdfFile" | null
  >(null);
  const [uploadError, setUploadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AdminTeamSpiritEditionFormValues>({
    defaultValues: toFormValues(edition),
    resolver: zodResolver(adminTeamSpiritEditionSchema),
  });

  const uploadFile = useCallback(
    async (field: "coverImage" | "pdfFile", file: File) => {
      if (!edition) {
        return;
      }
      setUploadError(false);
      setUploadingField(field);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("field", field);
        const response = await fetch(
          `/api/admin/content/team-spirit/${edition._id}`,
          { body: formData, method: "POST" }
        );
        if (!response.ok) {
          throw new Error("upload-failed");
        }
        const result = (await response.json()) as {
          image?: ImageValue;
          url?: string;
        };
        if (field === "coverImage" && result.image) {
          setCoverImage(result.image);
        } else if (field === "pdfFile" && result.url) {
          setPdfFileUrl(result.url);
        }
      } catch {
        setUploadError(true);
      } finally {
        setUploadingField(null);
      }
    },
    [edition]
  );

  const handleCoverFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      if (mode === "create") {
        setSelectedCoverFile(file);
        setCoverFileName(file.name);
        return;
      }
      uploadFile("coverImage", file);
    },
    [mode, uploadFile]
  );

  const handlePdfFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      if (mode === "create") {
        setSelectedPdfFile(file);
        setPdfFileName(file.name);
        return;
      }
      uploadFile("pdfFile", file);
    },
    [mode, uploadFile]
  );

  const handleRemovePdf = useCallback(async () => {
    if (!edition) {
      return;
    }
    setUploadError(false);
    setUploadingField("pdfFile");
    try {
      const response = await fetch(
        `/api/admin/content/team-spirit/${edition._id}`,
        {
          body: JSON.stringify({ removePdfFile: true }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        }
      );
      if (!response.ok) {
        throw new Error("remove-failed");
      }
      setPdfFileUrl(null);
    } catch {
      setUploadError(true);
    } finally {
      setUploadingField(null);
    }
  }, [edition]);

  const renderEditionField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AdminTeamSpiritEditionFormValues, "edition">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="edition">
          <SelectValue placeholder="Select edition" />
        </SelectTrigger>
        <SelectContent>
          {EDITION_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const onSubmit = useCallback(
    async (data: AdminTeamSpiritEditionFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);

      try {
        if (mode === "create") {
          const formData = new FormData();
          formData.append("editionName", data.editionName);
          formData.append("edition", data.edition);
          formData.append("year", String(data.year));
          formData.append("description", data.description ?? "");
          formData.append("publicationDate", data.publicationDate ?? "");
          formData.append("adSpecs", data.adSpecs ?? "");
          if (selectedCoverFile) {
            formData.append("coverImage", selectedCoverFile);
          }
          if (selectedPdfFile) {
            formData.append("pdfFile", selectedPdfFile);
          }

          const response = await fetch("/api/admin/content/team-spirit", {
            body: formData,
            method: "POST",
          });
          if (!response.ok) {
            setSaveError(true);
            return;
          }
          const result = (await response.json()) as { id: string };
          router.push(`/admin/content/team-spirit/${result.id}`);
          return;
        }

        const response = await fetch(
          `/api/admin/content/team-spirit/${edition?._id}`,
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
    [mode, edition?._id, router, selectedCoverFile, selectedPdfFile]
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
    if (!edition) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/content/team-spirit/${edition._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      router.push("/admin/content/team-spirit");
    } finally {
      setDeleting(false);
    }
  }, [edition, router]);

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="editionName">
            Edition Name *
          </label>
          <input
            className={inputClasses}
            id="editionName"
            placeholder="Summer 2025"
            {...register("editionName")}
          />
          {errors.editionName ? (
            <p className={errorClasses}>{errors.editionName.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClasses} htmlFor="edition">
            Edition *
          </label>
          <Controller
            control={control}
            name="edition"
            render={renderEditionField}
          />
          {errors.edition ? (
            <p className={errorClasses}>{errors.edition.message}</p>
          ) : null}
        </div>
      </div>

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
          <label className={labelClasses} htmlFor="publicationDate">
            Publication Date
          </label>
          <input
            className={inputClasses}
            id="publicationDate"
            type="date"
            {...register("publicationDate")}
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
          rows={3}
          {...register("description")}
        />
      </div>

      <div>
        <p className={labelClasses}>Cover Image *</p>
        <div className="flex items-center gap-4">
          {coverImage ? (
            <Image
              alt={edition?.editionName ?? "Team Spirit cover"}
              className="rounded-xl object-cover"
              height={96}
              src={urlFor(coverImage).width(160).height(96).url()}
              width={160}
            />
          ) : (
            <div className="flex h-24 w-40 items-center justify-center rounded-xl bg-(--color-surface) text-(--color-text-secondary) text-xs">
              No image
            </div>
          )}
          <label
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
            htmlFor="coverImageUpload"
          >
            <Upload aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate text-sm">
              {coverFileName ?? "Upload cover image"}
            </span>
            {uploadingField === "coverImage" ? (
              <Loader2
                aria-hidden="true"
                className="size-4 shrink-0 animate-spin"
              />
            ) : null}
          </label>
          <input
            accept="image/*"
            className="sr-only"
            id="coverImageUpload"
            onChange={handleCoverFileChange}
            type="file"
          />
        </div>
      </div>

      <div>
        <p className={labelClasses}>PDF File</p>
        <div className="flex flex-wrap items-center gap-4">
          {pdfFileUrl ? (
            <a
              className="text-primary text-sm underline"
              href={pdfFileUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              View current PDF
            </a>
          ) : (
            <span className="text-(--color-text-secondary) text-xs">
              No PDF uploaded
            </span>
          )}
          <label
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
            htmlFor="pdfFileUpload"
          >
            <Upload aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate text-sm">
              {pdfFileName ?? (pdfFileUrl ? "Replace PDF" : "Upload PDF")}
            </span>
            {uploadingField === "pdfFile" ? (
              <Loader2
                aria-hidden="true"
                className="size-4 shrink-0 animate-spin"
              />
            ) : null}
          </label>
          <input
            accept="application/pdf"
            className="sr-only"
            id="pdfFileUpload"
            onChange={handlePdfFileChange}
            type="file"
          />
          {mode === "edit" && pdfFileUrl ? (
            <Button onClick={handleRemovePdf} size="sm" variant="secondary">
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      {uploadError ? (
        <p className={errorClasses}>Upload failed. Please try again.</p>
      ) : null}

      <div>
        <label className={labelClasses} htmlFor="adSpecs">
          Ad Specs
        </label>
        <textarea
          className={inputClasses}
          id="adSpecs"
          rows={4}
          {...register("adSpecs")}
        />
        <p className="mt-1 text-(--color-text-secondary) text-xs">
          Ad sizes, rates, and specifications shown on /partners/team-spirit.
          Plain text is converted to portable text blocks on save.
        </p>
      </div>

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving this edition. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <div className="flex items-center gap-3">
        <Button loading={isSubmitting} type="submit">
          {mode === "create" ? "Create Edition" : "Save Changes"}
        </Button>
        {mode === "edit" ? (
          <Button onClick={handleDeleteRequest} variant="secondary">
            Delete Edition
          </Button>
        ) : null}
      </div>

      <Dialog onOpenChange={handleDeleteOpenChange} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team Spirit Edition</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-medium">{getValues("editionName")}</span>?
            This cannot be undone.
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
