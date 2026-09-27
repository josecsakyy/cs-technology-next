import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS Technology",
  description: "Automatización industrial con PLC, sensores industriales, inteligencia artificial, visión artificial e IoT para agroindustria e industria.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}