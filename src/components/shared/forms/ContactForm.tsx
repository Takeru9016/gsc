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
import { type ContactFormValues, contactSchema } from "@/lib/validations.ts";

const SUBJECT_OPTIONS: {
  label: string;
  value: ContactFormValues["subject"];
}[] = [
  { label: "General", value: "general" },
  { label: "Membership", value: "membership" },
  { label: "Event", value: "event" },
  { label: "Partnership", value: "partnership" },
  { label: "Media", value: "media" },
  { label: "Leagues", value: "leagues" },
];

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

export function ContactForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const renderSubjectField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<ContactFormValues, "subject">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="subject">
          <SelectValue placeholder="Select a subject" />
        </SelectTrigger>
        <SelectContent>
          {SUBJECT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await fetch("/api/contact", {
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
        Message sent. We'll respond within 2 business days.
      </div>
    );
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className={labelClasses} htmlFor="name">
          Name *
        </label>
        <input
          className={inputClasses}
          id="name"
          type="text"
          {...register("name")}
        />
        {errors.name ? (
          <p className={errorClasses}>{errors.name.message}</p>
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
        <label className={labelClasses} htmlFor="subject">
          Subject *
        </label>
        <Controller
          control={control}
          name="subject"
          render={renderSubjectField}
        />
        {errors.subject ? (
          <p className={errorClasses}>{errors.subject.message}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClasses} htmlFor="message">
          Message *
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
        Send Message
      </Button>
    </form>
  );
}
