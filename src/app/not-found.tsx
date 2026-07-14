import { Barlow_Condensed, Inter } from "next/font/google";
import { Button } from "@/components/shared/Button.tsx";
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
          <Button href="/">Go Home</Button>
          <Button href="/contact" variant="secondary">
            Contact Us
          </Button>
        </PageHero>
      </body>
    </html>
  );
}
