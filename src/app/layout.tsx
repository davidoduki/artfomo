import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArtFOMO — Don't Miss the Next Basquiat",
  description:
    "ArtFOMO is the data-driven directory of hot emerging artists, limited drops, and market momentum — built for collectors and investors who move early.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
