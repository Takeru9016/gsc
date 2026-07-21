"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/shared/Button.tsx";
import {
  type AdminBookingContactFormValues,
  adminBookingContactSchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface BookingContactFormProps {
  defaultValues: AdminBookingContactFormValues;
}

export function BookingContactForm({ defaultValues }: BookingContactFormProps) {
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AdminBookingContactFormValues>({
    defaultValues,
    resolver: zodResolver(adminBookingContactSchema),
  });

  const onSubmit = useCallback(async (data: AdminBookingContactFormValues) => {
    setSaveError(false);
    setSaveSuccess(false);
    try {
      const response = await fetch("/api/admin/content/booking-config", {
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
      <h2 className="mb-4 font-body font-semibold text-lg">Booking Contact</h2>
      <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses} htmlFor="bookingEmail">
              Booking Email
            </label>
            <p className="mb-2 text-(--color-text-secondary) text-xs">
              Receives booking inquiry notifications.
            </p>
            <input
              className={inputClasses}
              id="bookingEmail"
              type="email"
              {...register("bookingEmail")}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="responseTime">
              Response Time
            </label>
            <p className="mb-2 text-(--color-text-secondary) text-xs">
              e.g. "We respond within 24 hours"
            </p>
            <input
              className={inputClasses}
              id="responseTime"
              {...register("responseTime")}
            />
          </div>
        </div>

        {saveError ? (
          <p className={errorClasses}>
            Something went wrong saving booking contact info. Please try again.
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
