import { Barlow_Condensed, Inter } from "next/font/google";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero.tsx";
import "./globals.css";

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

export default function NotFound() {
  return (
    <html className={`${barlowCondensed.variable} ${inter.variable}`} lang="en">
      <body>
        <PageHero
          badge="Goregaon Sports Club"
          headline="404 — Page Not Found"
          minHeight="screen"
          subline="The page you're looking for doesn't exist or has been moved."
        >
          <Link
            className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover"
            href="/"
          >
            Go Home
          </Link>
          <Link
            className="inline-flex min-w-[120px] items-center justify-center rounded-full border border-primary px-6 py-3 font-medium text-primary transition-all duration-200 hover:bg-primary/10"
            href="/contact"
          >
            Contact Us
          </Link>
        </PageHero>
      </body>
    </html>
  );
}
