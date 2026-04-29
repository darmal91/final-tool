import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Final Tool — Website Builder",
  description: "Minimal modular website builder for local businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
