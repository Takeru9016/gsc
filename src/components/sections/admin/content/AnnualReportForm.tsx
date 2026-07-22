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
import type { AnnualReport } from "@/lib/sanity/queries.ts";
import {
  type AdminAnnualReportFormValues,
  adminAnnualReportSchema,
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

function toFormValues(report?: AnnualReport): AdminAnnualReportFormValues {
  if (!report) {
    return { publishedDate: "", title: "", year: "" };
  }
  return {
    publishedDate: report.publishedDate ?? "",
    title: report.title,
    year: report.year,
  };
}

interface CoverImageFieldProps {
  coverFileName: string | null;
  coverImage: ImageValue | null;
  isUploading: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}

function CoverImageField({
  coverFileName,
  coverImage,
  isUploading,
  onChange,
  title,
}: CoverImageFieldProps) {
  return (
    <div>
      <p className={labelClasses}>Cover Image</p>
      <div className="flex items-center gap-4">
        {coverImage ? (
          <Image
            alt={title}
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
          id="coverImageUpload"
          onChange={onChange}
          type="file"
        />
      </div>
    </div>
  );
}

interface PdfFileFieldProps {
  fileName: string | null;
  fileUrl: string | null;
  isUploading: boolean;
  mode: "create" | "edit";
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  selectedFile: File | null;
}

function PdfFileField({
  fileName,
  fileUrl,
  isUploading,
  mode,
  onChange,
  onRemove,
  selectedFile,
}: PdfFileFieldProps) {
  return (
    <div>
      <p className={labelClasses}>PDF File *</p>
      <div className="flex flex-wrap items-center gap-4">
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
            No PDF uploaded
          </span>
        )}
        <label
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
          htmlFor="pdfFileUpload"
        >
          <Upload aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate text-sm">
            {fileName ?? (fileUrl ? "Replace PDF" : "Upload PDF")}
          </span>
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
          id="pdfFileUpload"
          onChange={onChange}
          type="file"
        />
        {mode === "edit" && fileUrl ? (
          <Button onClick={onRemove} size="sm" variant="secondary">
            Remove
          </Button>
        ) : null}
      </div>
      {mode === "create" && !selectedFile ? (
        <p className="mt-1 text-(--color-text-secondary) text-xs">
          A PDF file is required to create an annual report.
        </p>
      ) : null}
    </div>
  );
}

interface AnnualReportFormProps {
  mode: "create" | "edit";
  report?: AnnualReport;
}

export function AnnualReportForm({ report, mode }: AnnualReportFormProps) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<ImageValue | null>(
    (report?.coverImage as ImageValue | null) ?? null
  );
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(
    report?.pdfFile ?? null
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
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AdminAnnualReportFormValues>({
    defaultValues: toFormValues(report),
    resolver: zodResolver(adminAnnualReportSchema),
  });

  const uploadFile = useCallback(
    async (field: "coverImage" | "pdfFile", file: File) => {
      if (!report) {
        return;
      }
      setUploadError(false);
      setUploadingField(field);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("field", field);
        const response = await fetch(
          `/api/admin/content/annual-reports/${report._id}`,
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
    [report]
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
    if (!report) {
      return;
    }
    setUploadError(false);
    setUploadingField("pdfFile");
    try {
      const response = await fetch(
        `/api/admin/content/annual-reports/${report._id}`,
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
  }, [report]);

  const onSubmit = useCallback(
    async (data: AdminAnnualReportFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);

      try {
        if (mode === "create") {
          if (!selectedPdfFile) {
            setSaveError(true);
            return;
          }
          const formData = new FormData();
          formData.append("title", data.title);
          formData.append("year", data.year);
          formData.append("publishedDate", data.publishedDate);
          if (selectedCoverFile) {
            formData.append("coverImage", selectedCoverFile);
          }
          formData.append("pdfFile", selectedPdfFile);

          const response = await fetch("/api/admin/content/annual-reports", {
            body: formData,
            method: "POST",
          });
          if (!response.ok) {
            setSaveError(true);
            return;
          }
          const result = (await response.json()) as { id: string };
          router.push(`/admin/content/annual-reports/${result.id}`);
          return;
        }

        const response = await fetch(
          `/api/admin/content/annual-reports/${report?._id}`,
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
    [mode, report?._id, router, selectedCoverFile, selectedPdfFile]
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
    if (!report) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/content/annual-reports/${report._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      router.push("/admin/content/annual-reports");
    } finally {
      setDeleting(false);
    }
  }, [report, router]);

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="title">
            Title *
          </label>
          <input
            className={inputClasses}
            id="title"
            placeholder="Annual Report 2024-25"
            {...register("title")}
          />
          {errors.title ? (
            <p className={errorClasses}>{errors.title.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClasses} htmlFor="year">
            Year *
          </label>
          <input
            className={inputClasses}
            id="year"
            placeholder="2024-25"
            {...register("year")}
          />
          {errors.year ? (
            <p className={errorClasses}>{errors.year.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="publishedDate">
          Published Date *
        </label>
        <input
          className={inputClasses}
          id="publishedDate"
          type="date"
          {...register("publishedDate")}
        />
        {errors.publishedDate ? (
          <p className={errorClasses}>{errors.publishedDate.message}</p>
        ) : null}
      </div>

      <CoverImageField
        coverFileName={coverFileName}
        coverImage={coverImage}
        isUploading={uploadingField === "coverImage"}
        onChange={handleCoverFileChange}
        title={report?.title ?? "Annual report cover"}
      />

      <PdfFileField
        fileName={pdfFileName}
        fileUrl={pdfFileUrl}
        isUploading={uploadingField === "pdfFile"}
        mode={mode}
        onChange={handlePdfFileChange}
        onRemove={handleRemovePdf}
        selectedFile={selectedPdfFile}
      />

      {uploadError ? (
        <p className={errorClasses}>Upload failed. Please try again.</p>
      ) : null}

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving this report. Please check the fields and
          file, then try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <div className="flex items-center gap-3">
        <Button loading={isSubmitting} type="submit">
          {mode === "create" ? "Create Report" : "Save Changes"}
        </Button>
        {mode === "edit" ? (
          <Button onClick={handleDeleteRequest} variant="secondary">
            Delete Report
          </Button>
        ) : null}
      </div>

      <Dialog onOpenChange={handleDeleteOpenChange} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Annual Report</DialogTitle>
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
