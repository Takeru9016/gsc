import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  description: "Mumbai's Premier Sports Destination",
  title: "Goregaon Sports Club",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
