import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer.tsx";
import { Navbar } from "@/components/layout/Navbar.tsx";
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

export const metadata: Metadata = {
  description: "Mumbai's Premier Sports Destination",
  title: "Goregaon Sports Club",
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
          className="fixed top-4 left-4 z-[100] -translate-y-full rounded-full bg-primary px-6 py-3 text-white transition-transform focus:-translate-y-0 focus:translate-y-0"
          href="#main-content"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer siteConfig={siteConfig} />
        </ThemeProvider>
      </body>
    </html>
  );
}
