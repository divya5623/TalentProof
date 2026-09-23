import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talent Proof — Prove Skills. Build Trust. Discover Talent.",
  description:
    "Evidence-based skill verification: submit a project, face project-specific questions, earn transparent verification reports.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
