"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useCallback, useState } from "react";
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
import type { EventDetail } from "@/lib/sanity/queries.ts";
import { portableTextToPlainText } from "@/lib/utils.ts";
import {
  type AdminEventFormValues,
  adminEventSchema,
} from "@/lib/validations.ts";

const TYPE_OPTIONS: AdminEventFormValues["type"][] = [
  "Tournament",
  "Cultural",
  "League",
  "Special",
];

const STATUS_OPTIONS: AdminEventFormValues["status"][] = [
  "upcoming",
  "ongoing",
  "past",
];

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDatetimeLocal(value: string | null | undefined) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  const localMs = date.getTime() - date.getTimezoneOffset() * 60_000;
  return new Date(localMs).toISOString().slice(0, 16);
}

function toFormValues(event: EventDetail): AdminEventFormValues {
  return {
    description: portableTextToPlainText(event.description),
    endDate: toDatetimeLocal(event.endDate),
    isFeatured: event.isFeatured,
    registrationUrl: event.registrationUrl ?? "",
    slug: event.slug,
    startDate: toDatetimeLocal(event.startDate),
    status: event.status as AdminEventFormValues["status"],
    title: event.title,
    type: event.type as AdminEventFormValues["type"],
    venue: event.venue ?? "",
  };
}

const DEFAULT_VALUES: AdminEventFormValues = {
  description: "",
  endDate: "",
  isFeatured: false,
  registrationUrl: "",
  slug: "",
  startDate: "",
  status: "upcoming",
  title: "",
  type: "Tournament",
  venue: "",
};

interface EventFormProps {
  event?: EventDetail;
  mode: "create" | "edit";
}

export function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AdminEventFormValues>({
    defaultValues: event ? toFormValues(event) : DEFAULT_VALUES,
    resolver: zodResolver(adminEventSchema),
  });

  const handleTitleChange = useCallback(
    (changeEvent: ChangeEvent<HTMLInputElement>) => {
      if (!slugTouched) {
        setValue("slug", slugify(changeEvent.target.value));
      }
    },
    [slugTouched, setValue]
  );

  const handleSlugChange = useCallback(() => {
    setSlugTouched(true);
  }, []);

  const renderTypeField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AdminEventFormValues, "type">;
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

  const renderStatusField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AdminEventFormValues, "status">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="status">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const onSubmit = useCallback(
    async (data: AdminEventFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);

      const body = {
        ...data,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : "",
        startDate: new Date(data.startDate).toISOString(),
      };

      try {
        if (mode === "create") {
          const response = await fetch("/api/admin/content/events", {
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          if (!response.ok) {
            setSaveError(true);
            return;
          }
          router.push("/admin/content/events");
          return;
        }

        const response = await fetch(
          `/api/admin/content/events/${event?.slug}`,
          {
            body: JSON.stringify(body),
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
    [mode, event?.slug, router]
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
    if (!event) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/content/events/${event.slug}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        return;
      }
      router.push("/admin/content/events");
    } finally {
      setDeleting(false);
    }
  }, [event, router]);

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className={labelClasses} htmlFor="title">
          Title *
        </label>
        <input
          className={inputClasses}
          id="title"
          {...register("title", { onChange: handleTitleChange })}
        />
        {errors.title ? (
          <p className={errorClasses}>{errors.title.message}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClasses} htmlFor="slug">
          Slug *
        </label>
        <input
          className={inputClasses}
          id="slug"
          {...register("slug", { onChange: handleSlugChange })}
        />
        {errors.slug ? (
          <p className={errorClasses}>{errors.slug.message}</p>
        ) : null}
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
          <label className={labelClasses} htmlFor="status">
            Status *
          </label>
          <Controller
            control={control}
            name="status"
            render={renderStatusField}
          />
          {errors.status ? (
            <p className={errorClasses}>{errors.status.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="startDate">
            Start Date *
          </label>
          <input
            className={inputClasses}
            id="startDate"
            type="datetime-local"
            {...register("startDate")}
          />
          {errors.startDate ? (
            <p className={errorClasses}>{errors.startDate.message}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClasses} htmlFor="endDate">
            End Date
          </label>
          <input
            className={inputClasses}
            id="endDate"
            type="datetime-local"
            {...register("endDate")}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="venue">
          Venue
        </label>
        <input className={inputClasses} id="venue" {...register("venue")} />
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
      </div>

      <div>
        <label className={labelClasses} htmlFor="registrationUrl">
          Registration URL
        </label>
        <input
          className={inputClasses}
          id="registrationUrl"
          type="url"
          {...register("registrationUrl")}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          className="size-4 rounded border-(--color-border)"
          id="isFeatured"
          type="checkbox"
          {...register("isFeatured")}
        />
        <label className="font-medium text-sm" htmlFor="isFeatured">
          Is Featured
        </label>
      </div>

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving this event. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <div className="flex items-center gap-3">
        <Button loading={isSubmitting} type="submit">
          {mode === "create" ? "Create Event" : "Save Changes"}
        </Button>
        {mode === "edit" ? (
          <Button onClick={handleDeleteRequest} variant="secondary">
            Delete Event
          </Button>
        ) : null}
      </div>

      <Dialog onOpenChange={handleDeleteOpenChange} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
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
