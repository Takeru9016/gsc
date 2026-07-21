import { SettingsBasicInfoForm } from "@/components/sections/admin/content/SettingsBasicInfoForm.tsx";
import { SettingsEmergencyForm } from "@/components/sections/admin/content/SettingsEmergencyForm.tsx";
import { SettingsHeroVideoForm } from "@/components/sections/admin/content/SettingsHeroVideoForm.tsx";
import { SettingsPartnersManager } from "@/components/sections/admin/content/SettingsPartnersManager.tsx";
import { SettingsSocialLinksForm } from "@/components/sections/admin/content/SettingsSocialLinksForm.tsx";
import { getBookingConfig, getSiteConfig } from "@/lib/sanity/queries.ts";

export default async function AdminSettingsPage() {
  const [siteConfig, bookingConfig] = await Promise.all([
    getSiteConfig(),
    getBookingConfig(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-semibold text-3xl">Settings</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage global site configuration. Each section saves independently.
        </p>
      </div>

      <SettingsBasicInfoForm
        bookingEmail={bookingConfig?.bookingEmail ?? ""}
        defaultValues={{
          address: siteConfig.address,
          email: siteConfig.email,
          phone: siteConfig.phone,
          phone2: siteConfig.phone2,
          siteName: siteConfig.siteName,
          tagline: siteConfig.tagline,
        }}
      />

      <SettingsEmergencyForm
        defaultValues={{
          emergencyPhone: siteConfig.emergencyPhone,
          emergencyPhone2: siteConfig.emergencyPhone2,
        }}
      />

      <SettingsHeroVideoForm defaultValue={siteConfig.heroVideoUrl ?? ""} />

      <SettingsSocialLinksForm defaultValues={siteConfig.socialLinks} />

      <SettingsPartnersManager partners={siteConfig.corporatePartners} />
    </div>
  );
}
