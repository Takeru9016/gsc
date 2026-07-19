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
import { Button } from "@/components/shared/Button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { SportDetail } from "@/lib/sanity/queries.ts";
import { portableTextToPlainText } from "@/lib/utils.ts";
import {
  type AdminSportEditFormValues,
  adminSportEditSchema,
} from "@/lib/validations.ts";

const CATEGORY_OPTIONS: AdminSportEditFormValues["category"][] = [
  "outdoor",
  "indoor",
  "aquatic",
  "health",
  "track",
];

const COACHING_LEVEL_OPTIONS: NonNullable<
  AdminSportEditFormValues["coachingLevel"]
>[] = ["Beginner", "Intermediate", "Advanced", "All"];

const THREE_OBJECT_OPTIONS: AdminSportEditFormValues["threeObjectType"][] = [
  "cricket-ball",
  "shuttlecock",
  "tennis-ball",
  "water-sphere",
  "none",
];

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface HeroImageValue {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

function toFormValues(sport: SportDetail): AdminSportEditFormValues {
  return {
    category: sport.category as AdminSportEditFormValues["category"],
    coachingInfo: portableTextToPlainText(sport.coachingInfo),
    coachingLevel:
      (sport.coachingLevel as AdminSportEditFormValues["coachingLevel"]) ??
      undefined,
    coachingSchedule: sport.coachingSchedule ?? "",
    coachName: sport.coachName ?? "",
    externalRegistrationUrl: sport.externalRegistrationUrl ?? "",
    facilityDetails: portableTextToPlainText(sport.facilityDetails),
    fullDescription: portableTextToPlainText(sport.fullDescription),
    hasCoaching: sport.hasCoaching,
    name: sport.name,
    schedule: sport.schedule.map((entry) => ({
      closeTime: entry.closeTime,
      day: entry.day,
      openTime: entry.openTime,
    })),
    shortDescription: sport.shortDescription ?? "",
    threeObjectType:
      sport.threeObjectType as AdminSportEditFormValues["threeObjectType"],
  };
}

interface ScheduleRowProps {
  index: number;
  onRemove: (index: number) => void;
  register: UseFormRegister<AdminSportEditFormValues>;
}

function ScheduleRow({ index, onRemove, register }: ScheduleRowProps) {
  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-(--color-border) p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
      <input
        className={inputClasses}
        placeholder="Day"
        {...register(`schedule.${index}.day` as const)}
      />
      <input
        className={inputClasses}
        placeholder="Open Time"
        {...register(`schedule.${index}.openTime` as const)}
      />
      <input
        className={inputClasses}
        placeholder="Close Time"
        {...register(`schedule.${index}.closeTime` as const)}
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

interface SportEditFormProps {
  sport: SportDetail;
}

export function SportEditForm({ sport }: SportEditFormProps) {
  const [heroImage, setHeroImage] = useState<HeroImageValue | null>(
    (sport.heroImage as HeroImageValue | null) ?? null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminSportEditFormValues>({
    defaultValues: toFormValues(sport),
    resolver: zodResolver(adminSportEditSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  const hasCoaching = watch("hasCoaching");

  const handleImageChange = useCallback(
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
          `/api/admin/content/sports/${sport.slug}`,
          { body: formData, method: "POST" }
        );
        if (!response.ok) {
          throw new Error("upload-failed");
        }
        const result = (await response.json()) as { heroImage: HeroImageValue };
        setHeroImage(result.heroImage);
      } catch {
        setUploadError(true);
      } finally {
        setIsUploading(false);
      }
    },
    [sport.slug]
  );

  const renderCategoryField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AdminSportEditFormValues, "category">;
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

  const renderCoachingLevelField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AdminSportEditFormValues, "coachingLevel">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="coachingLevel">
          <SelectValue placeholder="Select coaching level" />
        </SelectTrigger>
        <SelectContent>
          {COACHING_LEVEL_OPTIONS.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const renderThreeObjectField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AdminSportEditFormValues, "threeObjectType">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="threeObjectType">
          <SelectValue placeholder="Select 3D object type" />
        </SelectTrigger>
        <SelectContent>
          {THREE_OBJECT_OPTIONS.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const handleAddScheduleEntry = useCallback(() => {
    append({ closeTime: "", day: "", openTime: "" });
  }, [append]);

  const onSubmit = useCallback(
    async (data: AdminSportEditFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);
      try {
        const response = await fetch(
          `/api/admin/content/sports/${sport.slug}`,
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
    [sport.slug]
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
      </div>

      <div>
        <label className={labelClasses} htmlFor="shortDescription">
          Short Description
        </label>
        <textarea
          className={inputClasses}
          id="shortDescription"
          rows={2}
          {...register("shortDescription")}
        />
      </div>

      <div>
        <label className={labelClasses} htmlFor="fullDescription">
          Full Description
        </label>
        <textarea
          className={inputClasses}
          id="fullDescription"
          rows={6}
          {...register("fullDescription")}
        />
        <p className="mt-1 text-(--color-text-secondary) text-xs">
          [FUTURE] replace with a proper rich text editor (Tiptap or Plate).
          Plain text is converted to portable text blocks on save.
        </p>
      </div>

      <div>
        <label className={labelClasses} htmlFor="facilityDetails">
          Facility Details
        </label>
        <textarea
          className={inputClasses}
          id="facilityDetails"
          rows={4}
          {...register("facilityDetails")}
        />
      </div>

      <div>
        <p className={labelClasses}>Hero Image</p>
        <div className="flex items-center gap-4">
          {heroImage ? (
            <Image
              alt={sport.name}
              className="rounded-xl object-cover"
              height={96}
              src={urlFor(heroImage).width(160).height(96).url()}
              width={160}
            />
          ) : (
            <div className="flex h-24 w-40 items-center justify-center rounded-xl bg-(--color-surface) text-(--color-text-secondary) text-xs">
              No image
            </div>
          )}
          <label
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
            htmlFor="heroImage"
          >
            <Upload aria-hidden="true" className="size-4 shrink-0" />
            <span className="text-sm">Upload new image</span>
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
            id="heroImage"
            onChange={handleImageChange}
            type="file"
          />
        </div>
        {uploadError ? (
          <p className={errorClasses}>Image upload failed. Please try again.</p>
        ) : null}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className={labelClasses}>Schedule</p>
          <Button
            onClick={handleAddScheduleEntry}
            size="sm"
            variant="secondary"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add Day
          </Button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <ScheduleRow
              index={index}
              key={field.id}
              onRemove={remove}
              register={register}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          className="size-4 rounded border-(--color-border)"
          id="hasCoaching"
          type="checkbox"
          {...register("hasCoaching")}
        />
        <label className="font-medium text-sm" htmlFor="hasCoaching">
          Has Coaching
        </label>
      </div>

      {hasCoaching ? (
        <div className="space-y-6 rounded-2xl border border-(--color-border) p-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={labelClasses} htmlFor="coachName">
                Coach Name
              </label>
              <input
                className={inputClasses}
                id="coachName"
                {...register("coachName")}
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="coachingLevel">
                Coaching Level
              </label>
              <Controller
                control={control}
                name="coachingLevel"
                render={renderCoachingLevelField}
              />
            </div>
          </div>
          <div>
            <label className={labelClasses} htmlFor="coachingSchedule">
              Coaching Schedule
            </label>
            <textarea
              className={inputClasses}
              id="coachingSchedule"
              rows={2}
              {...register("coachingSchedule")}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="coachingInfo">
              Coaching Info
            </label>
            <textarea
              className={inputClasses}
              id="coachingInfo"
              rows={4}
              {...register("coachingInfo")}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="externalRegistrationUrl">
              External Registration URL
            </label>
            <input
              className={inputClasses}
              id="externalRegistrationUrl"
              {...register("externalRegistrationUrl")}
              type="url"
            />
          </div>
        </div>
      ) : null}

      <div>
        <label className={labelClasses} htmlFor="threeObjectType">
          3D Object Type
        </label>
        <Controller
          control={control}
          name="threeObjectType"
          render={renderThreeObjectField}
        />
      </div>

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving this sport. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <Button loading={isSubmitting} type="submit">
        Save Changes
      </Button>
    </form>
  );
}
