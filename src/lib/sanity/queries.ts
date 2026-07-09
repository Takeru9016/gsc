import { client } from "@/sanity/lib/client.ts";

export interface SiteConfigSocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface SiteConfig {
  address: string;
  email: string;
  emergencyPhone: string;
  emergencyPhone2: string;
  phone: string;
  siteName: string;
  socialLinks: SiteConfigSocialLinks;
  tagline: string;
}

// siteConfig singleton schema (sanity/schemaTypes) lands in 1A-07 — until then
// every fetch resolves null and we fall back to these placeholders.
const DEFAULT_SITE_CONFIG: SiteConfig = {
  address: "[PENDING_CONTENT]",
  email: "[PENDING_CONTENT]",
  emergencyPhone: "[PENDING_CONTENT]",
  emergencyPhone2: "[PENDING_CONTENT]",
  phone: "[PENDING_CONTENT]",
  siteName: "Goregaon Sports Club",
  socialLinks: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    youtube: "#",
  },
  tagline: "Mumbai's Premier Sports Destination",
};

const SITE_CONFIG_QUERY = `*[_type == "siteConfig"][0]{
  siteName,
  tagline,
  phone,
  email,
  address,
  emergencyPhone,
  emergencyPhone2,
  socialLinks
}`;

export async function getSiteConfig(): Promise<SiteConfig> {
  const data = await client.fetch<Partial<SiteConfig> | null>(
    SITE_CONFIG_QUERY,
    {},
    { next: { tags: ["site-config"] } }
  );

  return {
    ...DEFAULT_SITE_CONFIG,
    ...data,
    socialLinks: {
      ...DEFAULT_SITE_CONFIG.socialLinks,
      ...data?.socialLinks,
    },
  };
}
