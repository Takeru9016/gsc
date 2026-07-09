import type { Metadata } from "next";
import "../globals.css";

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
    <html lang="en">
      <body>
        {/* TODO: font variables — 1A-03 */}
        {/* TODO: ThemeProvider — 1A-03 */}
        {/* TODO: Navbar — 1A-05 */}
        {children}
        {/* TODO: Footer — 1A-06 */}
      </body>
    </html>
  );
}
