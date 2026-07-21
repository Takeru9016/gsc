"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import {
  Controller,
  type ControllerRenderProps,
  useForm,
} from "react-hook-form";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { FilterBar } from "@/components/shared/FilterBar.tsx";
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
import type { AdminDownload } from "@/lib/sanity/queries.ts";
import {
  type AdminDownloadFormValues,
  adminDownloadSchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

const CATEGORY_OPTIONS: AdminDownloadFormValues["category"][] = [
  "Notice",
  "Circular",
  "Form",
  "Report",
];

const CATEGORY_FILTERS = [
  { label: "Notices", value: "Notice" },
  { label: "Circulars", value: "Circular" },
  { label: "Forms", value: "Form" },
  { label: "Reports", value: "Report" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const createFormSchema = adminDownloadSchema.omit({ isActive: true });
type CreateFormValues = Omit<AdminDownloadFormValues, "isActive">;

interface CreateDownloadDialogProps {
  onCreated: (download: AdminDownload) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function CreateDownloadDialog({
  onCreated,
  onOpenChange,
  open,
}: CreateDownloadDialogProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
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

  const renderCategoryField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<CreateFormValues, "category">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="category">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORY_OPTIONS.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const onSubmit = useCallback(
    async (data: CreateFormValues) => {
      if (!selectedFile) {
        setSubmitError(true);
        return;
      }
      setSubmitError(false);
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("category", data.category);
        formData.append("publishedDate", data.publishedDate);
        formData.append("file", selectedFile);

        const response = await fetch("/api/admin/content/downloads", {
          body: formData,
          method: "POST",
        });
        if (!response.ok) {
          setSubmitError(true);
          return;
        }
        const result = (await response.json()) as AdminDownload & {
          success: boolean;
        };
        onCreated(result);
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
          <DialogTitle>Add Download</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className={labelClasses} htmlFor="downloadTitle">
              Title *
            </label>
            <input
              className={inputClasses}
              id="downloadTitle"
              {...register("title")}
            />
            {errors.title ? (
              <p className={errorClasses}>{errors.title.message}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClasses} htmlFor="category">
              Category *
            </label>
            <Controller
              control={control}
              name="category"
              render={renderCategoryField}
            />
            {errors.category ? (
              <p className={errorClasses}>{errors.category.message}</p>
            ) : null}
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

          <div>
            <label className={labelClasses} htmlFor="downloadFile">
              File *
            </label>
            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
              htmlFor="downloadFile"
            >
              <Upload aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate text-sm">
                {fileName ?? "Upload file"}
              </span>
            </label>
            <input
              className="sr-only"
              id="downloadFile"
              onChange={handleFileChange}
              type="file"
            />
          </div>

          {submitError ? (
            <p className={errorClasses}>
              Something went wrong. Please check the fields and file, then try
              again.
            </p>
          ) : null}

          <Button loading={isSubmitting} type="submit">
            Add Download
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditDownloadDialogProps {
  download: AdminDownload | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (id: string, values: CreateFormValues) => void;
}

function EditDownloadDialog({
  download,
  onOpenChange,
  onSaved,
}: EditDownloadDialogProps) {
  const [saveError, setSaveError] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    values: {
      category: (download?.category ??
        "Notice") as CreateFormValues["category"],
      publishedDate: download?.publishedDate ?? "",
      title: download?.title ?? "",
    },
  });

  const renderCategoryField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<CreateFormValues, "category">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="editCategory">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORY_OPTIONS.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const onSubmit = useCallback(
    async (data: CreateFormValues) => {
      if (!download) {
        return;
      }
      setSaveError(false);
      try {
        const response = await fetch(
          `/api/admin/content/downloads/${download._id}`,
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
        onSaved(download._id, data);
      } catch {
        setSaveError(true);
      }
    },
    [download, onSaved]
  );

  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(download)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Download</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className={labelClasses} htmlFor="editTitle">
              Title *
            </label>
            <input
              className={inputClasses}
              id="editTitle"
              {...register("title")}
            />
            {errors.title ? (
              <p className={errorClasses}>{errors.title.message}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClasses} htmlFor="editCategory">
              Category *
            </label>
            <Controller
              control={control}
              name="category"
              render={renderCategoryField}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="editPublishedDate">
              Published Date *
            </label>
            <input
              className={inputClasses}
              id="editPublishedDate"
              type="date"
              {...register("publishedDate")}
            />
          </div>

          {saveError ? (
            <p className={errorClasses}>
              Something went wrong saving this download. Please try again.
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

interface DeleteConfirmDialogProps {
  download: AdminDownload | null;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
}

function DeleteConfirmDialog({
  download,
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(download)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Download</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{download?.title}</span>? This cannot be
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

interface DownloadRowProps {
  download: AdminDownload;
  onDeleteRequest: (download: AdminDownload) => void;
  onEditRequest: (download: AdminDownload) => void;
  onToggleActive: (download: AdminDownload) => void;
  pendingId: string | null;
}

function DownloadRow({
  download,
  onDeleteRequest,
  onEditRequest,
  onToggleActive,
  pendingId,
}: DownloadRowProps) {
  const isPending = pendingId === download._id;

  const handleEdit = useCallback(() => {
    onEditRequest(download);
  }, [onEditRequest, download]);

  const handleDelete = useCallback(() => {
    onDeleteRequest(download);
  }, [onDeleteRequest, download]);

  const handleToggleActive = useCallback(() => {
    onToggleActive(download);
  }, [onToggleActive, download]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{download.title}</td>
      <td className="px-4 py-3 align-top">
        <Badge size="sm" variant="outline">
          {download.category}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top">
        {formatDate(download.publishedDate)}
      </td>
      <td className="px-4 py-3 align-top">
        <Badge size="sm" variant={download.isActive ? "green" : "outline"}>
          {download.isActive ? "Active" : "Inactive"}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top">
        <a
          className="text-primary text-sm underline"
          href={download.file}
          rel="noopener noreferrer"
          target="_blank"
        >
          Download
        </a>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-2">
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
            onClick={handleToggleActive}
            size="sm"
            variant="secondary"
          >
            {download.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            disabled={isPending}
            onClick={handleDelete}
            size="sm"
            variant="secondary"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface DownloadsTableProps {
  downloads: AdminDownload[];
}

export function DownloadsTable({ downloads }: DownloadsTableProps) {
  const [rows, setRows] = useState(downloads);
  const [activeFilter, setActiveFilter] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<AdminDownload | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminDownload | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filteredRows = activeFilter
    ? rows.filter((row) => row.category === activeFilter)
    : rows;

  const handleToggleActive = useCallback(async (download: AdminDownload) => {
    setPendingId(download._id);
    try {
      const response = await fetch(
        `/api/admin/content/downloads/${download._id}`,
        {
          body: JSON.stringify({ isActive: !download.isActive }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        }
      );
      if (!response.ok) {
        return;
      }
      setRows((prev) =>
        prev.map((row) =>
          row._id === download._id
            ? { ...row, isActive: !download.isActive }
            : row
        )
      );
    } finally {
      setPendingId(null);
    }
  }, []);

  const handleEditRequest = useCallback((download: AdminDownload) => {
    setEditTarget(download);
  }, []);

  const handleEditOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setEditTarget(null);
    }
  }, []);

  const handleSaved = useCallback((id: string, values: CreateFormValues) => {
    setRows((prev) =>
      prev.map((row) => (row._id === id ? { ...row, ...values } : row))
    );
    setEditTarget(null);
  }, []);

  const handleDeleteRequest = useCallback((download: AdminDownload) => {
    setDeleteTarget(download);
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
    setPendingId(deleteTarget._id);
    try {
      const response = await fetch(
        `/api/admin/content/downloads/${deleteTarget._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      setRows((prev) => prev.filter((row) => row._id !== deleteTarget._id));
      setDeleteTarget(null);
    } finally {
      setPendingId(null);
    }
  }, [deleteTarget]);

  const handleOpenAdd = useCallback(() => {
    setAddOpen(true);
  }, []);

  const handleAddOpenChange = useCallback((open: boolean) => {
    setAddOpen(open);
  }, []);

  const handleCreated = useCallback((download: AdminDownload) => {
    setRows((prev) => [download, ...prev]);
    setAddOpen(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterBar
          activeValue={activeFilter}
          filters={CATEGORY_FILTERS}
          onFilterChange={setActiveFilter}
        />
        <Button onClick={handleOpenAdd} size="sm">
          <Plus aria-hidden="true" className="size-4" />
          Add Download
        </Button>
      </div>

      {filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No downloads match this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium">Download</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((download) => (
                <DownloadRow
                  download={download}
                  key={download._id}
                  onDeleteRequest={handleDeleteRequest}
                  onEditRequest={handleEditRequest}
                  onToggleActive={handleToggleActive}
                  pendingId={pendingId}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditDownloadDialog
        download={editTarget}
        onOpenChange={handleEditOpenChange}
        onSaved={handleSaved}
      />

      <DeleteConfirmDialog
        download={deleteTarget}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        pending={Boolean(pendingId) && pendingId === deleteTarget?._id}
      />

      <CreateDownloadDialog
        onCreated={handleCreated}
        onOpenChange={handleAddOpenChange}
        open={addOpen}
      />
    </div>
  );
}
