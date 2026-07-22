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
import type { CommitteeMember } from "@/lib/sanity/queries.ts";
import {
  type AdminCommitteeMemberFormValues,
  adminCommitteeMemberSchema,
} from "@/lib/validations.ts";

const ROLE_OPTIONS: {
  label: string;
  value: AdminCommitteeMemberFormValues["role"];
}[] = [
  { label: "Founder Member", value: "founderMember" },
  { label: "Promoter Member", value: "promoterMember" },
  { label: "Office Bearer", value: "officeBearer" },
  { label: "Governing Council", value: "governingCouncil" },
];

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface PhotoValue {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

function toFormValues(
  member?: CommitteeMember
): AdminCommitteeMemberFormValues {
  if (!member) {
    return {
      bio: "",
      designation: "",
      name: "",
      order: 0,
      role: "founderMember",
    };
  }
  return {
    bio: member.bio ?? "",
    designation: member.designation,
    name: member.name,
    order: member.order,
    role: member.role as AdminCommitteeMemberFormValues["role"],
  };
}

interface CommitteeMemberFormProps {
  member?: CommitteeMember;
  mode: "create" | "edit";
}

export function CommitteeMemberForm({
  member,
  mode,
}: CommitteeMemberFormProps) {
  const router = useRouter();
  const [photo, setPhoto] = useState<PhotoValue | null>(
    (member?.photo as PhotoValue | null) ?? null
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
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AdminCommitteeMemberFormValues>({
    defaultValues: toFormValues(member),
    resolver: zodResolver(adminCommitteeMemberSchema),
  });

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!member) {
        return;
      }
      setUploadError(false);
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(
          `/api/admin/content/committee/${member._id}`,
          { body: formData, method: "POST" }
        );
        if (!response.ok) {
          throw new Error("upload-failed");
        }
        const result = (await response.json()) as { photo: PhotoValue };
        setPhoto(result.photo);
      } catch {
        setUploadError(true);
      } finally {
        setIsUploading(false);
      }
    },
    [member]
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
      uploadPhoto(file);
    },
    [mode, uploadPhoto]
  );

  const renderRoleField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AdminCommitteeMemberFormValues, "role">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="role">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const onSubmit = useCallback(
    async (data: AdminCommitteeMemberFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);

      try {
        if (mode === "create") {
          const formData = new FormData();
          formData.append("name", data.name);
          formData.append("designation", data.designation);
          formData.append("role", data.role);
          formData.append("bio", data.bio ?? "");
          formData.append("order", String(data.order ?? 0));
          if (selectedFile) {
            formData.append("file", selectedFile);
          }

          const response = await fetch("/api/admin/content/committee", {
            body: formData,
            method: "POST",
          });
          if (!response.ok) {
            setSaveError(true);
            return;
          }
          const result = (await response.json()) as { id: string };
          router.push(`/admin/content/committee/${result.id}`);
          return;
        }

        const response = await fetch(
          `/api/admin/content/committee/${member?._id}`,
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
    [mode, member?._id, router, selectedFile]
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
    if (!member) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/content/committee/${member._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      router.push("/admin/content/committee");
    } finally {
      setDeleting(false);
    }
  }, [member, router]);

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
          <label className={labelClasses} htmlFor="designation">
            Designation *
          </label>
          <input
            className={inputClasses}
            id="designation"
            placeholder="President, Secretary, ..."
            {...register("designation")}
          />
          {errors.designation ? (
            <p className={errorClasses}>{errors.designation.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="role">
            Role *
          </label>
          <Controller control={control} name="role" render={renderRoleField} />
          {errors.role ? (
            <p className={errorClasses}>{errors.role.message}</p>
          ) : null}
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
        <label className={labelClasses} htmlFor="bio">
          Bio
        </label>
        <textarea
          className={inputClasses}
          id="bio"
          rows={4}
          {...register("bio")}
        />
      </div>

      <div>
        <p className={labelClasses}>Photo</p>
        <div className="flex items-center gap-4">
          {photo ? (
            <Image
              alt={member?.name ?? "Committee member"}
              className="rounded-xl object-cover"
              height={96}
              src={urlFor(photo).width(96).height(96).url()}
              width={96}
            />
          ) : (
            <div className="flex size-24 items-center justify-center rounded-xl bg-(--color-surface) text-(--color-text-secondary) text-xs">
              No photo
            </div>
          )}
          <label
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
            htmlFor="photo"
          >
            <Upload aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate text-sm">
              {fileName ?? "Upload new photo"}
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
            id="photo"
            onChange={handleFileChange}
            type="file"
          />
        </div>
        {uploadError ? (
          <p className={errorClasses}>Photo upload failed. Please try again.</p>
        ) : null}
      </div>

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving this member. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <div className="flex items-center gap-3">
        <Button loading={isSubmitting} type="submit">
          {mode === "create" ? "Create Member" : "Save Changes"}
        </Button>
        {mode === "edit" ? (
          <Button onClick={handleDeleteRequest} variant="secondary">
            Delete Member
          </Button>
        ) : null}
      </div>

      <Dialog onOpenChange={handleDeleteOpenChange} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Committee Member</DialogTitle>
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
