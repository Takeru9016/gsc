"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/shared/Button.tsx";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

const basicInfoSchema = z.object({
  address: z.string().optional(),
  bookingEmail: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  siteName: z.string().min(2, "Site name is required"),
  tagline: z.string().optional(),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

interface SettingsBasicInfoFormProps {
  bookingEmail: string;
  defaultValues: {
    address: string;
    email: string;
    phone: string;
    phone2: string;
    siteName: string;
    tagline: string;
  };
}

export function SettingsBasicInfoForm({
  bookingEmail,
  defaultValues,
}: SettingsBasicInfoFormProps) {
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BasicInfoFormValues>({
    defaultValues: { ...defaultValues, bookingEmail },
    resolver: zodResolver(basicInfoSchema),
  });

  const onSubmit = useCallback(async (data: BasicInfoFormValues) => {
    setSaveError(false);
    setSaveSuccess(false);
    try {
      const response = await fetch("/api/admin/content/settings", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) {
        setSaveError(true);
        return;
      }
      setSaveSuccess(true);
    } catch {
      setSaveError(true);
    }
  }, []);

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
      <h2 className="mb-4 font-body font-semibold text-lg">Basic Info</h2>
      <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses} htmlFor="siteName">
              Site Name *
            </label>
            <input
              className={inputClasses}
              id="siteName"
              {...register("siteName")}
            />
            {errors.siteName ? (
              <p className={errorClasses}>{errors.siteName.message}</p>
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses} htmlFor="phone">
              Phone
            </label>
            <input className={inputClasses} id="phone" {...register("phone")} />
          </div>
          <div>
            <label className={labelClasses} htmlFor="phone2">
              Phone (Secondary)
            </label>
            <input
              className={inputClasses}
              id="phone2"
              {...register("phone2")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses} htmlFor="email">
              Email
            </label>
            <input
              className={inputClasses}
              id="email"
              type="email"
              {...register("email")}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="bookingEmail">
              Booking Email
            </label>
            <input
              className={inputClasses}
              id="bookingEmail"
              type="email"
              {...register("bookingEmail")}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses} htmlFor="address">
            Address
          </label>
          <textarea
            className={inputClasses}
            id="address"
            rows={3}
            {...register("address")}
          />
        </div>

        {saveError ? (
          <p className={errorClasses}>
            Something went wrong saving basic info. Please try again.
          </p>
        ) : null}
        {saveSuccess ? (
          <p className="text-accent-green text-sm">Saved.</p>
        ) : null}

        <Button loading={isSubmitting} type="submit">
          Save
        </Button>
      </form>
    </div>
  );
}
