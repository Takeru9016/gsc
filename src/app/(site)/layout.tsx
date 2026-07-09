import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar.tsx";
import {
  ThemeProvider,
  ThemeScript,
} from "@/components/layout/ThemeProvider.tsx";
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

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${barlowCondensed.variable} ${inter.variable}`} lang="en">
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
          {/* TODO: Footer — 1A-06 */}
        </ThemeProvider>
      </body>
    </html>
  );
}
