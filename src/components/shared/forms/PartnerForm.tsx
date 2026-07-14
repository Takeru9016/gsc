"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import {
  Controller,
  type ControllerRenderProps,
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
import { type PartnerFormValues, partnerSchema } from "@/lib/validations.ts";

const PARTNERSHIP_TYPE_OPTIONS = [
  { label: "Title Sponsor", value: "Title Sponsor" },
  { label: "Event Partner", value: "Event Partner" },
  { label: "Digital Partner", value: "Digital Partner" },
  { label: "Other", value: "Other" },
];

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

export function PartnerForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
  });

  const renderPartnershipTypeField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<PartnerFormValues, "partnershipType">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="partnershipType">
          <SelectValue placeholder="Select a partnership type" />
        </SelectTrigger>
        <SelectContent>
          {PARTNERSHIP_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const onSubmit = async (data: PartnerFormValues) => {
    try {
      const response = await fetch("/api/partner", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const result = await response.json();

      if (!(response.ok && result.success)) {
        setError("root", { message: "submit-failed" });
        return;
      }

      reset();
    } catch {
      setError("root", { message: "submit-failed" });
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="rounded-2xl border border-accent-green/20 bg-accent-green/10 p-6 text-accent-green">
        Inquiry received. Our partnerships team will be in touch within 48
        hours.
      </div>
    );
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className={labelClasses} htmlFor="companyName">
          Company Name *
        </label>
        <input
          className={inputClasses}
          id="companyName"
          type="text"
          {...register("companyName")}
        />
        {errors.companyName ? (
          <p className={errorClasses}>{errors.companyName.message}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClasses} htmlFor="contactName">
          Contact Name *
        </label>
        <input
          className={inputClasses}
          id="contactName"
          type="text"
          {...register("contactName")}
        />
        {errors.contactName ? (
          <p className={errorClasses}>{errors.contactName.message}</p>
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
          Phone *
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
        <label className={labelClasses} htmlFor="partnershipType">
          Partnership Type
        </label>
        <Controller
          control={control}
          name="partnershipType"
          render={renderPartnershipTypeField}
        />
        {errors.partnershipType ? (
          <p className={errorClasses}>{errors.partnershipType.message}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClasses} htmlFor="message">
          Message
        </label>
        <textarea
          className={inputClasses}
          id="message"
          rows={5}
          {...register("message")}
        />
        {errors.message ? (
          <p className={errorClasses}>{errors.message.message}</p>
        ) : null}
      </div>

      {errors.root ? (
        <p className={errorClasses}>
          Something went wrong. Please try again or call us directly.
        </p>
      ) : null}

      <Button loading={isSubmitting} type="submit">
        Submit Inquiry
      </Button>
    </form>
  );
}
