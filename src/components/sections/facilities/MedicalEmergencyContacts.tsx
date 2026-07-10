import { Phone } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { SiteConfig } from "@/lib/sanity/queries.ts";

interface MedicalEmergencyContactsProps {
  siteConfig: SiteConfig;
}

function isPendingContent(value: string): boolean {
  return value === "[PENDING_CONTENT]";
}

export function MedicalEmergencyContacts({
  siteConfig,
}: MedicalEmergencyContactsProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="mx-auto max-w-3xl rounded-2xl border-2 border-accent-red bg-accent-red/10 p-6 md:p-8">
        <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
          Emergency Contacts
        </h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Phone
              aria-hidden="true"
              className="size-5 shrink-0 text-accent-red"
            />
            <span className="text-(--color-text-primary)">
              Medical Cell:{" "}
              {isPendingContent(siteConfig.emergencyPhone) ? (
                siteConfig.emergencyPhone
              ) : (
                <a
                  className="font-medium hover:underline"
                  href={`tel:${siteConfig.emergencyPhone}`}
                >
                  {siteConfig.emergencyPhone}
                </a>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone
              aria-hidden="true"
              className="size-5 shrink-0 text-accent-red"
            />
            <span className="text-(--color-text-primary)">
              Emergency:{" "}
              {isPendingContent(siteConfig.emergencyPhone2) ? (
                siteConfig.emergencyPhone2
              ) : (
                <a
                  className="font-medium hover:underline"
                  href={`tel:${siteConfig.emergencyPhone2}`}
                >
                  {siteConfig.emergencyPhone2}
                </a>
              )}
            </span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
