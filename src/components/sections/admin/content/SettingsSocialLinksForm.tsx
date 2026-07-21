"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/shared/Button.tsx";
import type { SiteConfigSocialLinks } from "@/lib/sanity/queries.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface SettingsSocialLinksFormProps {
  defaultValues: SiteConfigSocialLinks;
}

export function SettingsSocialLinksForm({
  defaultValues,
}: SettingsSocialLinksFormProps) {
  const [socialLinks, setSocialLinks] =
    useState<SiteConfigSocialLinks>(defaultValues);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFieldChange = useCallback(
    (field: keyof SiteConfigSocialLinks) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setSocialLinks((prev) => ({ ...prev, [field]: event.target.value }));
      },
    []
  );

  const handleSave = useCallback(async () => {
    setSaveError(false);
    setSaveSuccess(false);
    setSaving(true);
    try {
      const response = await fetch("/api/admin/content/settings", {
        body: JSON.stringify({ socialLinks }),
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
  }, [socialLinks]);

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
      <h2 className="mb-4 font-body font-semibold text-lg">Social Links</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="instagram">
            Instagram
          </label>
          <input
            className={inputClasses}
            id="instagram"
            onChange={handleFieldChange("instagram")}
            value={socialLinks.instagram}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="facebook">
            Facebook
          </label>
          <input
            className={inputClasses}
            id="facebook"
            onChange={handleFieldChange("facebook")}
            value={socialLinks.facebook}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="youtube">
            YouTube
          </label>
          <input
            className={inputClasses}
            id="youtube"
            onChange={handleFieldChange("youtube")}
            value={socialLinks.youtube}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="twitter">
            Twitter
          </label>
          <input
            className={inputClasses}
            id="twitter"
            onChange={handleFieldChange("twitter")}
            value={socialLinks.twitter}
          />
        </div>
      </div>
      {saveError ? (
        <p className={errorClasses}>Failed to save. Please try again.</p>
      ) : null}
      {saveSuccess ? (
        <p className="mt-1 text-accent-green text-sm">Saved.</p>
      ) : null}
      <div className="mt-4">
        <Button loading={saving} onClick={handleSave} size="sm">
          Save
        </Button>
      </div>
    </div>
  );
}
