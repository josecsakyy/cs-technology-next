import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Create Solutions | Conteo y órdenes",
  manifest: "/monitor.webmanifest",
  appleWebApp: { capable: true, title: "Create Solutions", statusBarStyle: "default" },
  icons: { apple: "/brand/monitor-192.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#047857",
};

export default function MonitorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
