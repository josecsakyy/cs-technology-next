import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS Technology",
  description: "Soluciones de inteligencia artificial, datos, visión artificial, IoT y automatización para agroindustria e industria.",
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