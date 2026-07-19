import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
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
  robots: {
    follow: false,
    index: false,
  },
  title: {
    default: "Admin",
    template: "%s | GSC Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`dark ${barlowCondensed.variable} ${inter.variable}`}
      data-theme="dark"
      lang="en"
    >
      <body className="bg-(--color-bg) text-(--color-text-primary)">
        {children}
      </body>
    </html>
  );
}
