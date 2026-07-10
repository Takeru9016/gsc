"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  type MembershipInterestFormValues,
  membershipInterestSchema,
} from "@/lib/validations.ts";

interface MembershipInterestFormProps {
  membershipType: string;
  membershipTypeLabel: string;
}

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

export function MembershipInterestForm({
  membershipType,
  membershipTypeLabel,
}: MembershipInterestFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<MembershipInterestFormValues>({
    defaultValues: { membershipType },
    resolver: zodResolver(membershipInterestSchema),
  });

  const onSubmit = async (data: MembershipInterestFormValues) => {
    try {
      const response = await fetch("/api/membership", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const result = await response.json();

      if (!(response.ok && result.success)) {
        setError("root", { message: "submit-failed" });
        return;
      }

      reset({ membershipType });
    } catch {
      setError("root", { message: "submit-failed" });
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="rounded-2xl border border-accent-green/20 bg-accent-green/10 p-6 text-accent-green">
        Interest registered. You'll be among the first notified when enrollment
        opens.
      </div>
    );
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <span className={labelClasses}>Membership Type</span>
        <div className="rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary)">
          {membershipTypeLabel}
        </div>
        <input type="hidden" {...register("membershipType")} />
      </div>

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
        <label className={labelClasses} htmlFor="message">
          Message
        </label>
        <textarea
          className={inputClasses}
          id="message"
          maxLength={500}
          rows={4}
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

      <button
        className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : null}
        Express Interest
      </button>
    </form>
  );
}
