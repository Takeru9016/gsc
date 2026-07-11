"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import {
  Controller,
  type ControllerRenderProps,
  useForm,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  type AchievementFormValues,
  achievementSchema,
} from "@/lib/validations.ts";

const LEVEL_OPTIONS: AchievementFormValues["level"][] = [
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

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { body: formData, method: "POST" }
  );

  if (!response.ok) {
    throw new Error("upload-failed");
  }

  const data = (await response.json()) as { secure_url: string };
  return data.secure_url;
}

export function AchievementSubmitForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
  });

  const imageUrl = watch("imageUrl");

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      setFileName(file.name);
      setUploadError(false);
      setIsUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        setValue("imageUrl", url, { shouldValidate: true });
      } catch {
        setUploadError(true);
      } finally {
        setIsUploading(false);
      }
    },
    [setValue]
  );

  const renderLevelField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AchievementFormValues, "level">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="level">
          <SelectValue placeholder="Select achievement level" />
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

  const onSubmit = async (data: AchievementFormValues) => {
    try {
      const response = await fetch("/api/achievement", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const result = await response.json();

      if (!(response.ok && result.success)) {
        setError("root", { message: "submit-failed" });
      }
    } catch {
      setError("root", { message: "submit-failed" });
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="rounded-2xl border border-accent-green/20 bg-accent-green/10 p-6 text-accent-green">
        Submission received. Our team will review and add it to the champions
        wall.
      </div>
    );
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className={labelClasses} htmlFor="memberName">
          Member Name *
        </label>
        <input
          className={inputClasses}
          id="memberName"
          type="text"
          {...register("memberName")}
        />
        {errors.memberName ? (
          <p className={errorClasses}>{errors.memberName.message}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClasses} htmlFor="email">
          Email *
        </label>
        <input
          className={inputClasses}
          id="email"
          type="email"
          {...register("email")}
        />
        {errors.email ? (
          <p className={errorClasses}>{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClasses} htmlFor="phone">
          Phone
        </label>
        <input
          className={inputClasses}
          id="phone"
          type="tel"
          {...register("phone")}
        />
        {errors.phone ? (
          <p className={errorClasses}>{errors.phone.message}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClasses} htmlFor="sport">
          Sport *
        </label>
        <input
          className={inputClasses}
          id="sport"
          type="text"
          {...register("sport")}
        />
        {errors.sport ? (
          <p className={errorClasses}>{errors.sport.message}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClasses} htmlFor="achievementTitle">
          Achievement Title *
        </label>
        <input
          className={inputClasses}
          id="achievementTitle"
          type="text"
          {...register("achievementTitle")}
        />
        {errors.achievementTitle ? (
          <p className={errorClasses}>{errors.achievementTitle.message}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClasses} htmlFor="level">
          Level *
        </label>
        <Controller control={control} name="level" render={renderLevelField} />
        {errors.level ? (
          <p className={errorClasses}>{errors.level.message}</p>
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

      <div>
        <label className={labelClasses} htmlFor="description">
          Description
        </label>
        <textarea
          className={inputClasses}
          id="description"
          maxLength={500}
          rows={4}
          {...register("description")}
        />
        {errors.description ? (
          <p className={errorClasses}>{errors.description.message}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClasses} htmlFor="photo">
          Photo
        </label>
        <label
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--color-border) border-dashed bg-(--color-surface) px-4 py-3 text-(--color-text-secondary) transition-all duration-200 hover:border-primary hover:text-primary"
          htmlFor="photo"
        >
          <Upload aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate text-sm">
            {fileName ?? "Upload achievement photo"}
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
        {imageUrl ? (
          <p className="mt-1 text-accent-green text-sm">Photo uploaded.</p>
        ) : null}
        {uploadError ? (
          <p className={errorClasses}>Photo upload failed. Please try again.</p>
        ) : null}
      </div>

      {errors.root ? (
        <p className={errorClasses}>
          Something went wrong. Please try again or contact us directly.
        </p>
      ) : null}

      <button
        className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting || isUploading}
        type="submit"
      >
        {isSubmitting ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : null}
        Submit Achievement
      </button>
    </form>
  );
}
