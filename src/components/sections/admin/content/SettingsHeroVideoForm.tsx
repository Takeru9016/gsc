"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/shared/Button.tsx";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface SettingsHeroVideoFormProps {
  defaultValue: string;
}

export function SettingsHeroVideoForm({
  defaultValue,
}: SettingsHeroVideoFormProps) {
  const [heroVideoUrl, setHeroVideoUrl] = useState(defaultValue);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setHeroVideoUrl(event.target.value);
    },
    []
  );

  const handleUpdate = useCallback(async () => {
    setSaveError(false);
    setSaveSuccess(false);
    setSaving(true);
    try {
      const response = await fetch("/api/admin/content/settings", {
        body: JSON.stringify({ heroVideoUrl }),
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
    } finally {
      setSaving(false);
    }
  }, [heroVideoUrl]);

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
      <h2 className="mb-4 font-body font-semibold text-lg">Hero Video</h2>
      <label className={labelClasses} htmlFor="heroVideoUrl">
        Hero Video URL
      </label>
      <input
        className={inputClasses}
        id="heroVideoUrl"
        onChange={handleChange}
        placeholder="https://res.cloudinary.com/.../gsc-hero.mp4"
        value={heroVideoUrl}
      />
      <p className="mt-2 text-(--color-text-secondary) text-xs">
        Update triggers ISR revalidation — public site reflects within 60
        seconds.
      </p>
      {saveError ? (
        <p className={errorClasses}>Failed to save. Please try again.</p>
      ) : null}
      {saveSuccess ? (
        <p className="mt-1 text-accent-green text-sm">Saved.</p>
      ) : null}
      <div className="mt-4">
        <Button loading={saving} onClick={handleUpdate} size="sm">
          Update
        </Button>
      </div>
    </div>
  );
}
