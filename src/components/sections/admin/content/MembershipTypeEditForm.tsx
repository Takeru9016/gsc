"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/shared/Button.tsx";
import type { MembershipTypeAdminDetail } from "@/lib/sanity/queries.ts";
import { portableTextToPlainText } from "@/lib/utils.ts";
import {
  type AdminMembershipTypeEditFormValues,
  adminMembershipTypeEditSchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

function toFormValues(
  membershipType: MembershipTypeAdminDetail
): AdminMembershipTypeEditFormValues {
  return {
    benefits: portableTextToPlainText(membershipType.benefits),
    eligibility: portableTextToPlainText(membershipType.eligibility),
    eligibilityNote: membershipType.eligibilityNote ?? "",
    feeStructure: portableTextToPlainText(membershipType.feeStructure),
    isActive: membershipType.isActive,
    order: membershipType.order,
    tagline: membershipType.tagline ?? "",
    title: membershipType.title,
  };
}

interface MembershipTypeEditFormProps {
  membershipType: MembershipTypeAdminDetail;
}

export function MembershipTypeEditForm({
  membershipType,
}: MembershipTypeEditFormProps) {
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminMembershipTypeEditFormValues>({
    defaultValues: toFormValues(membershipType),
    resolver: zodResolver(adminMembershipTypeEditSchema),
  });

  const onSubmit = useCallback(
    async (data: AdminMembershipTypeEditFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);
      try {
        const body =
          membershipType.type === "yearly"
            ? data
            : { ...data, eligibilityNote: undefined };
        const response = await fetch(
          `/api/admin/content/membership-types/${membershipType.type}`,
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
    [membershipType.type]
  );

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="title">
            Title *
          </label>
          <input className={inputClasses} id="title" {...register("title")} />
          {errors.title ? (
            <p className={errorClasses}>{errors.title.message}</p>
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

      <div>
        <label className={labelClasses} htmlFor="eligibility">
          Eligibility *
        </label>
        <textarea
          className={inputClasses}
          id="eligibility"
          rows={4}
          {...register("eligibility")}
        />
        <p className="mt-1 text-(--color-text-secondary) text-xs">
          [FUTURE] replace with a proper rich text editor (Tiptap or Plate).
          Plain text is converted to portable text blocks on save.
        </p>
      </div>

      <div>
        <label className={labelClasses} htmlFor="benefits">
          Benefits *
        </label>
        <textarea
          className={inputClasses}
          id="benefits"
          rows={4}
          {...register("benefits")}
        />
      </div>

      <div>
        <label className={labelClasses} htmlFor="feeStructure">
          Fee Structure
        </label>
        <textarea
          className={inputClasses}
          id="feeStructure"
          rows={4}
          {...register("feeStructure")}
        />
        <p className="mt-1 text-(--color-text-secondary) text-xs">
          Optional — display or hide on the public site per policy decision.
        </p>
      </div>

      {membershipType.type === "yearly" ? (
        <div>
          <label className={labelClasses} htmlFor="eligibilityNote">
            Eligibility Note (Yearly only)
          </label>
          <input
            className={inputClasses}
            id="eligibilityNote"
            placeholder="Available to children and parents of Life Members, and senior citizens 65 years and above."
            {...register("eligibilityNote")}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center gap-3">
          <input
            className="size-4 rounded border-(--color-border)"
            id="isActive"
            type="checkbox"
            {...register("isActive")}
          />
          <label className="font-medium text-sm" htmlFor="isActive">
            Is Active (shown on public site)
          </label>
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

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving this membership type. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <Button loading={isSubmitting} type="submit">
        Save Changes
      </Button>
    </form>
  );
}
