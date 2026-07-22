"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { type UseFormRegister, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { PartnershipOpportunity } from "@/lib/sanity/queries.ts";
import { portableTextToPlainText } from "@/lib/utils.ts";
import {
  type AdminPartnershipOpportunityFormValues,
  adminPartnershipOpportunitySchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

function toFormValues(
  opportunity?: PartnershipOpportunity
): AdminPartnershipOpportunityFormValues {
  if (!opportunity) {
    return {
      benefits: [],
      description: "",
      isHighlighted: false,
      order: 0,
      reachStats: "",
      title: "",
    };
  }
  return {
    benefits: opportunity.benefits.map((value) => ({ value })),
    description: portableTextToPlainText(opportunity.description),
    isHighlighted: opportunity.isHighlighted,
    order: opportunity.order,
    reachStats: opportunity.reachStats ?? "",
    title: opportunity.title,
  };
}

interface BenefitRowProps {
  index: number;
  onRemove: (index: number) => void;
  register: UseFormRegister<AdminPartnershipOpportunityFormValues>;
}

function BenefitRow({ index, onRemove, register }: BenefitRowProps) {
  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
      <input
        className={inputClasses}
        placeholder="Benefit"
        {...register(`benefits.${index}.value` as const)}
      />
      <Button
        ariaLabel="Remove benefit"
        onClick={handleRemove}
        size="sm"
        variant="secondary"
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

interface PartnershipFormProps {
  mode: "create" | "edit";
  opportunity?: PartnershipOpportunity;
}

export function PartnershipForm({ opportunity, mode }: PartnershipFormProps) {
  const router = useRouter();
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AdminPartnershipOpportunityFormValues>({
    defaultValues: toFormValues(opportunity),
    resolver: zodResolver(adminPartnershipOpportunitySchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  const handleAddBenefit = useCallback(() => {
    append({ value: "" });
  }, [append]);

  const onSubmit = useCallback(
    async (data: AdminPartnershipOpportunityFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);

      try {
        if (mode === "create") {
          const response = await fetch("/api/admin/content/partnerships", {
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          if (!response.ok) {
            setSaveError(true);
            return;
          }
          const result = (await response.json()) as { id: string };
          router.push(`/admin/content/partnerships/${result.id}`);
          return;
        }

        const response = await fetch(
          `/api/admin/content/partnerships/${opportunity?._id}`,
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
    [mode, opportunity?._id, router]
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
    if (!opportunity) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/content/partnerships/${opportunity._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      router.push("/admin/content/partnerships");
    } finally {
      setDeleting(false);
    }
  }, [opportunity, router]);

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="title">
            Title *
          </label>
          <input
            className={inputClasses}
            id="title"
            placeholder="Title Sponsor"
            {...register("title")}
          />
          {errors.title ? (
            <p className={errorClasses}>{errors.title.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClasses} htmlFor="reachStats">
            Reach Stats
          </label>
          <input
            className={inputClasses}
            id="reachStats"
            placeholder="40,000+ member network"
            {...register("reachStats")}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="description">
          Description *
        </label>
        <textarea
          className={inputClasses}
          id="description"
          rows={4}
          {...register("description")}
        />
        <p className="mt-1 text-(--color-text-secondary) text-xs">
          [FUTURE] replace with a proper rich text editor (Tiptap or Plate).
          Plain text is converted to portable text blocks on save.
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className={labelClasses}>Benefits</p>
          <Button onClick={handleAddBenefit} size="sm" variant="secondary">
            <Plus aria-hidden="true" className="size-4" />
            Add Benefit
          </Button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <BenefitRow
              index={index}
              key={field.id}
              onRemove={remove}
              register={register}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center gap-3">
          <input
            className="size-4 rounded border-(--color-border)"
            id="isHighlighted"
            type="checkbox"
            {...register("isHighlighted")}
          />
          <label className="font-medium text-sm" htmlFor="isHighlighted">
            Is Highlighted (featured card treatment)
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
          Something went wrong saving this opportunity. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <div className="flex items-center gap-3">
        <Button loading={isSubmitting} type="submit">
          {mode === "create" ? "Create Opportunity" : "Save Changes"}
        </Button>
        {mode === "edit" ? (
          <Button onClick={handleDeleteRequest} variant="secondary">
            Delete Opportunity
          </Button>
        ) : null}
      </div>

      <Dialog onOpenChange={handleDeleteOpenChange} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Partnership Opportunity</DialogTitle>
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
