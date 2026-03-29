/**
 * [INPUT]:  @/styles/globals.css (theme system), next/font/google (SUSE, VT323)
 * [OUTPUT]: Root <html> + <body> with font vars, Google Fonts preload
 * [POS]:    App shell — wraps every page, loads global CSS + fonts
 * [PROTOCOL]: Update this header on any layout change, then check CLAUDE.md
 */

import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "FRI Interface v2026",
  description: "FRI — personal interface system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=SUSE:wght@100;200;300;400;500;600;700&family=VT323&family=Workbench&family=Noto+Sans+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
