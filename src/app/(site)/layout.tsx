import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer.tsx";
import { Navbar } from "@/components/layout/Navbar.tsx";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider.tsx";
import {
  ThemeProvider,
  ThemeScript,
} from "@/components/layout/ThemeProvider.tsx";
import { getSiteConfig } from "@/lib/sanity/queries.ts";
import "../globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  weight: ["600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gsc.in";

export const metadata: Metadata = {
  description:
    "Mumbai's premier sports club — 30+ years, 23+ sports, 12,000+ members.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description:
      "Mumbai's premier sports club — 30+ years, 23+ sports, 12,000+ members.",
    siteName: "Goregaon Sports Club",
    type: "website",
  },
  title: {
    default: "Goregaon Sports Club",
    template: "%s | Goregaon Sports Club",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = await getSiteConfig();

  return (
    <html className={`${barlowCondensed.variable} ${inter.variable}`} lang="en">
      <head>
        <ThemeScript />
      </head>
      <body>
        <a
          className="fixed top-4 left-4 z-100 -translate-y-full rounded-full bg-primary px-6 py-3 text-white transition-transform focus:translate-y-0"
          href="#main-content"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <SmoothScrollProvider>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer siteConfig={siteConfig} />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
