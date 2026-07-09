import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/shared/SocialIcons.tsx";
import type { SiteConfig } from "@/lib/sanity/queries.ts";

interface FooterProps {
  siteConfig: SiteConfig;
}

interface FooterLink {
  href: string;
  label: string;
}

const QUICK_LINKS: FooterLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/downloads", label: "Downloads" },
  { href: "/legal", label: "Legal" },
];

const SPORTS_LINKS: FooterLink[] = [
  { href: "/sports/cricket", label: "Cricket" },
  { href: "/sports/badminton", label: "Badminton" },
  { href: "/sports/swimming", label: "Swimming" },
  { href: "/sports/lawn-tennis", label: "Lawn Tennis" },
  { href: "/sports/squash", label: "Squash" },
  { href: "/sports/gym", label: "Gym" },
];

const FACILITIES_LINKS: FooterLink[] = [
  { href: "/facilities/rooms", label: "Rooms" },
  { href: "/facilities/banquets", label: "Banquets" },
  { href: "/facilities/dining", label: "Dining" },
  { href: "/facilities/recreation", label: "Recreation" },
];

const linkClasses =
  "text-(--color-text-secondary) text-sm transition-colors duration-200 hover:text-primary";

function isPendingContent(value: string): boolean {
  return value === "[PENDING_CONTENT]";
}

function FooterColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 font-medium text-(--color-text-primary) text-sm">
      {children}
    </h3>
  );
}

export function Footer({ siteConfig }: FooterProps) {
  const { socialLinks } = siteConfig;

  return (
    <footer className="bg-(--color-surface-dark)" data-theme="dark">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="md:col-span-2 lg:col-span-1">
            <Link
              className="font-display text-(--color-primary-dark) text-2xl tracking-wide"
              href="/"
            >
              GOREGAON SPORTS CLUB
            </Link>
            <p className="mt-3 text-(--color-text-secondary) text-sm">
              {siteConfig.tagline}
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a
                aria-label="Instagram"
                className="text-(--color-text-secondary) transition-colors duration-200 hover:text-primary"
                href={socialLinks.instagram}
                rel="noopener noreferrer"
                target="_blank"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                aria-label="Facebook"
                className="text-(--color-text-secondary) transition-colors duration-200 hover:text-primary"
                href={socialLinks.facebook}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FacebookIcon size={20} />
              </a>
              <a
                aria-label="YouTube"
                className="text-(--color-text-secondary) transition-colors duration-200 hover:text-primary"
                href={socialLinks.youtube}
                rel="noopener noreferrer"
                target="_blank"
              >
                <YoutubeIcon size={20} />
              </a>
              <a
                aria-label="Twitter"
                className="text-(--color-text-secondary) transition-colors duration-200 hover:text-primary"
                href={socialLinks.twitter}
                rel="noopener noreferrer"
                target="_blank"
              >
                <TwitterIcon size={20} />
              </a>
            </div>
          </div>

          <div>
            <FooterColumnHeading>Quick Links</FooterColumnHeading>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link className={linkClasses} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterColumnHeading>Sports</FooterColumnHeading>
            <ul className="space-y-3">
              {SPORTS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link className={linkClasses} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterColumnHeading>Facilities</FooterColumnHeading>
            <ul className="space-y-3">
              {FACILITIES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link className={linkClasses} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterColumnHeading>Contact</FooterColumnHeading>
            <address className="space-y-3 text-(--color-text-secondary) text-sm not-italic">
              <p>{siteConfig.address}</p>
              <p>
                {isPendingContent(siteConfig.phone) ? (
                  siteConfig.phone
                ) : (
                  <a
                    className="transition-colors duration-200 hover:text-primary"
                    href={`tel:${siteConfig.phone}`}
                  >
                    {siteConfig.phone}
                  </a>
                )}
              </p>
              <p>
                {isPendingContent(siteConfig.email) ? (
                  siteConfig.email
                ) : (
                  <a
                    className="transition-colors duration-200 hover:text-primary"
                    href={`mailto:${siteConfig.email}`}
                  >
                    {siteConfig.email}
                  </a>
                )}
              </p>
            </address>
          </div>
        </div>
      </div>

      <div className="border-border-dark border-t">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-3 px-4 py-6 sm:px-6 md:flex-row md:justify-between lg:px-8">
          <p className="text-accent-red text-sm">
            Medical Cell: {siteConfig.emergencyPhone} | Emergency:{" "}
            {siteConfig.emergencyPhone2}
          </p>
          <p className="text-(--color-text-secondary) text-sm">
            © 2025 Goregaon Sports Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
