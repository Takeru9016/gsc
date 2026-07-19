"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import {
  Controller,
  type ControllerRenderProps,
  useForm,
} from "react-hook-form";
import { Badge } from "@/components/shared/Badge.tsx";
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
import type { Achievement } from "@/lib/sanity/queries.ts";
import {
  type AdminAchievementCreateFormValues,
  adminAchievementCreateSchema,
} from "@/lib/validations.ts";

const LEVEL_OPTIONS: AdminAchievementCreateFormValues["level"][] = [
  "District",
  "State",
  "National",
  "International",
];

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface AchievementCardProps {
  achievement: Achievement;
  isPending: boolean;
  onDeleteRequest: (achievement: Achievement) => void;
}

function AchievementCard({
  achievement,
  isPending,
  onDeleteRequest,
}: AchievementCardProps) {
  const handleDeleteRequest = useCallback(() => {
    onDeleteRequest(achievement);
  }, [onDeleteRequest, achievement]);

  return (
    <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <div className="relative aspect-square">
        <Image
          alt={achievement.title}
          className="object-cover"
          fill
          src={urlFor(achievement.image).width(400).height(400).url()}
        />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-2">
          <Badge size="sm" variant="outline">
            {achievement.sport}
          </Badge>
          <Badge size="sm" variant="primary">
            {achievement.level}
          </Badge>
          <Badge size="sm" variant="gold">
            {achievement.year}
          </Badge>
        </div>
        <p className="font-medium text-sm">{achievement.memberName ?? "—"}</p>
        <Button
          disabled={isPending}
          loading={isPending}
          onClick={handleDeleteRequest}
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
  achievement: Achievement | null;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
}

function DeleteConfirmDialog({
  achievement,
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(achievement)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Achievement</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{achievement?.title}</span>? This cannot
          be undone.
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

interface CreateAchievementDialogProps {
  onCreated: (achievement: Achievement) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function CreateAchievementDialog({
  onCreated,
  onOpenChange,
  open,
}: CreateAchievementDialogProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminAchievementCreateFormValues>({
    resolver: zodResolver(adminAchievementCreateSchema),
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

  const renderLevelField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AdminAchievementCreateFormValues, "level">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="level">
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          {LEVEL_OPTIONS.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const onSubmit = useCallback(
    async (data: AdminAchievementCreateFormValues) => {
      if (!selectedFile) {
        setSubmitError(true);
        return;
      }

      setSubmitError(false);
      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("memberName", data.memberName);
        formData.append("title", data.title);
        formData.append("sport", data.sport);
        formData.append("level", data.level);
        formData.append("year", String(data.year));

        const response = await fetch("/api/admin/content/achievements", {
          body: formData,
          method: "POST",
        });
        if (!response.ok) {
          setSubmitError(true);
          return;
        }
        const result = (await response.json()) as Achievement & {
          success: boolean;
        };
        onCreated({
          _id: result._id,
          description: null,
          image: result.image,
          level: result.level,
          memberName: result.memberName,
          sport: result.sport,
          title: result.title,
          type: "Individual",
          year: result.year,
        });
        reset();
        setSelectedFile(null);
        setFileName(null);
      } catch {
        setSubmitError(true);
      } finally {
        setSubmitting(false);
      }
    },
    [selectedFile, onCreated, reset]
  );

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Historical Achievement</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className={labelClasses} htmlFor="memberName">
              Member Name *
            </label>
            <input
              className={inputClasses}
              id="memberName"
              {...register("memberName")}
            />
            {errors.memberName ? (
              <p className={errorClasses}>{errors.memberName.message}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClasses} htmlFor="title">
              Achievement Title *
            </label>
            <input className={inputClasses} id="title" {...register("title")} />
            {errors.title ? (
              <p className={errorClasses}>{errors.title.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClasses} htmlFor="sport">
                Sport *
              </label>
              <input
                className={inputClasses}
                id="sport"
                {...register("sport")}
              />
              {errors.sport ? (
                <p className={errorClasses}>{errors.sport.message}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClasses} htmlFor="year">
                Year *
              </label>
              <input
                className={inputClasses}
                id="year"
                max={new Date().getFullYear()}
                min={1990}
                type="number"
                {...register("year", { valueAsNumber: true })}
              />
              {errors.year ? (
                <p className={errorClasses}>{errors.year.message}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label className={labelClasses} htmlFor="level">
              Level *
            </label>
            <Controller
              control={control}
              name="level"
              render={renderLevelField}
            />
            {errors.level ? (
              <p className={errorClasses}>{errors.level.message}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClasses} htmlFor="photo">
              Photo *
            </label>
            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
              htmlFor="photo"
            >
              <Upload aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate text-sm">
                {fileName ?? "Upload achievement photo"}
              </span>
            </label>
            <input
              accept="image/*"
              className="sr-only"
              id="photo"
              onChange={handleFileChange}
              type="file"
            />
          </div>

          {submitError ? (
            <p className={errorClasses}>
              Something went wrong. Please check the fields and photo, then try
              again.
            </p>
          ) : null}

          <Button loading={submitting} type="submit">
            Add Achievement
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface AchievementsGridProps {
  achievements: Achievement[];
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  const [rows, setRows] = useState(achievements);
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const handleDeleteRequest = useCallback((achievement: Achievement) => {
    setDeleteTarget(achievement);
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
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/content/achievements/${deleteTarget._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      setRows((prev) => prev.filter((row) => row._id !== deleteTarget._id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget]);

  const handleOpenAdd = useCallback(() => {
    setAddOpen(true);
  }, []);

  const handleAddOpenChange = useCallback((open: boolean) => {
    setAddOpen(open);
  }, []);

  const handleCreated = useCallback((achievement: Achievement) => {
    setRows((prev) => [achievement, ...prev]);
    setAddOpen(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleOpenAdd} size="sm">
          <Plus aria-hidden="true" className="size-4" />
          Add Achievement
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No approved achievements yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {rows.map((achievement) => (
            <AchievementCard
              achievement={achievement}
              isPending={deleting && deleteTarget?._id === achievement._id}
              key={achievement._id}
              onDeleteRequest={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        achievement={deleteTarget}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        pending={deleting}
      />

      <CreateAchievementDialog
        onCreated={handleCreated}
        onOpenChange={handleAddOpenChange}
        open={addOpen}
      />
    </div>
  );
}
