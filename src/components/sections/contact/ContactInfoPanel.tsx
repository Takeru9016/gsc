import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteConfig } from "@/lib/sanity/queries.ts";

interface ContactInfoPanelProps {
  siteConfig: SiteConfig;
}

function isPendingContent(value: string): boolean {
  return value === "[PENDING_CONTENT]";
}

export function ContactInfoPanel({ siteConfig }: ContactInfoPanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
        <h3 className="font-body font-semibold text-(--color-text-primary) text-lg">
          Contact Details
        </h3>
        <address className="mt-6 space-y-5 not-italic">
          <div className="flex items-start gap-3">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary"
            />
            <p className="text-(--color-text-secondary)">
              {siteConfig.address}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Phone
              aria-hidden="true"
              className="size-5 shrink-0 text-primary"
            />
            {isPendingContent(siteConfig.phone) ? (
              <span className="text-(--color-text-secondary)">
                {siteConfig.phone}
              </span>
            ) : (
              <a
                className="text-(--color-text-secondary) transition-colors duration-200 hover:text-primary"
                href={`tel:${siteConfig.phone}`}
              >
                {siteConfig.phone}
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Mail aria-hidden="true" className="size-5 shrink-0 text-primary" />
            {isPendingContent(siteConfig.email) ? (
              <span className="text-(--color-text-secondary)">
                {siteConfig.email}
              </span>
            ) : (
              <a
                className="text-(--color-text-secondary) transition-colors duration-200 hover:text-primary"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
            )}
          </div>
        </address>
      </div>

      {/* [PENDING_CONTENT] — Google Maps embed URL from manager */}
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-(--color-border) bg-surface-dark">
        <p className="text-sm text-text-secondary-dark">
          Map will be available here.
        </p>
      </div>
    </div>
  );
}
