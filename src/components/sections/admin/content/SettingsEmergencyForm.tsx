"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/shared/Button.tsx";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

interface SettingsEmergencyFormProps {
  defaultValues: {
    emergencyPhone: string;
    emergencyPhone2: string;
  };
}

export function SettingsEmergencyForm({
  defaultValues,
}: SettingsEmergencyFormProps) {
  const [emergencyPhone, setEmergencyPhone] = useState(
    defaultValues.emergencyPhone
  );
  const [emergencyPhone2, setEmergencyPhone2] = useState(
    defaultValues.emergencyPhone2
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEmergencyPhoneChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmergencyPhone(event.target.value);
    },
    []
  );

  const handleEmergencyPhone2Change = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmergencyPhone2(event.target.value);
    },
    []
  );

  const handleSave = useCallback(async () => {
    setSaveError(false);
    setSaveSuccess(false);
    setSaving(true);
    try {
      const response = await fetch("/api/admin/content/settings", {
        body: JSON.stringify({ emergencyPhone, emergencyPhone2 }),
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
  }, [emergencyPhone, emergencyPhone2]);

  return (
    <div className="rounded-2xl border border-accent-gold/30 bg-(--color-surface) p-6 md:p-8">
      <h2 className="mb-1 font-body font-semibold text-lg">
        Emergency Contacts
      </h2>
      <p className="mb-4 text-(--color-text-secondary) text-sm">
        These appear in the footer of every public page.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="emergencyPhone">
            Emergency Phone (Medical Cell)
          </label>
          <input
            className={inputClasses}
            id="emergencyPhone"
            onChange={handleEmergencyPhoneChange}
            value={emergencyPhone}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="emergencyPhone2">
            Emergency Phone (General)
          </label>
          <input
            className={inputClasses}
            id="emergencyPhone2"
            onChange={handleEmergencyPhone2Change}
            value={emergencyPhone2}
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
