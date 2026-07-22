"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/shared/Button.tsx";
import type { LegalPage } from "@/lib/sanity/queries.ts";
import { portableTextToPlainText } from "@/lib/utils.ts";
import {
  type AdminLegalPageFormValues,
  adminLegalPageSchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

function formatDate(value: string | null) {
  if (!value) {
    return "Never";
  }
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toFormValues(page: LegalPage): AdminLegalPageFormValues {
  return {
    content: portableTextToPlainText(page.content),
    metaDescription: page.metaDescription ?? "",
    metaTitle: page.metaTitle ?? "",
    title: page.title,
  };
}

interface LegalPageFormProps {
  page: LegalPage;
}

export function LegalPageForm({ page }: LegalPageFormProps) {
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(page.lastUpdated);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLegalPageFormValues>({
    defaultValues: toFormValues(page),
    resolver: zodResolver(adminLegalPageSchema),
  });

  const onSubmit = useCallback(
    async (data: AdminLegalPageFormValues) => {
      setSaveError(false);
      setSaveSuccess(false);
      try {
        const response = await fetch(`/api/admin/content/legal/${page.slug}`, {
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });
        if (!response.ok) {
          setSaveError(true);
          return;
        }
        const result = (await response.json()) as { lastUpdated: string };
        setLastUpdated(result.lastUpdated);
        setSaveSuccess(true);
      } catch {
        setSaveError(true);
      }
    },
    [page.slug]
  );

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
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
        <p className={labelClasses}>Last Updated</p>
        <p className="text-(--color-text-secondary) text-sm">
          {formatDate(lastUpdated)} — updated automatically on save.
        </p>
      </div>

      <div>
        <label className={labelClasses} htmlFor="content">
          Content *
        </label>
        <textarea
          className={inputClasses}
          id="content"
          rows={16}
          {...register("content")}
        />
        {errors.content ? (
          <p className={errorClasses}>{errors.content.message}</p>
        ) : null}
        <p className="mt-1 text-(--color-text-secondary) text-xs">
          Format with blank lines between paragraphs. Basic markdown-style
          structure. [FUTURE] Replace with a Tiptap rich text editor for proper
          portable text editing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="metaTitle">
            Meta Title
          </label>
          <input
            className={inputClasses}
            id="metaTitle"
            {...register("metaTitle")}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="metaDescription">
            Meta Description
          </label>
          <input
            className={inputClasses}
            id="metaDescription"
            {...register("metaDescription")}
          />
        </div>
      </div>

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving this page. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <Button loading={isSubmitting} type="submit">
        Save Changes
      </Button>
    </form>
  );
}
