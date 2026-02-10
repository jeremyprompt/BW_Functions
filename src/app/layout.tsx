import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bandwidth Functions",
  description: "Perform various functions using the Bandwidth API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
