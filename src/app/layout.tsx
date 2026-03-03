import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS Technology",
  description: "Clasificador y contador inteligente de tubérculos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white">
        <header className="fixed top-0 left-0 w-full bg-gray-900/80 backdrop-blur border-b border-gray-800 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <span className="font-bold text-lg tracking-wide">
              CS Technology
            </span>
            <nav className="space-x-6 text-sm text-gray-400">
              <a href="#producto" className="hover:text-white">Producto</a>
              <a href="#beneficios" className="hover:text-white">Beneficios</a>
              <a href="#contacto" className="hover:text-white">Contacto</a>
            </nav>
          </div>
        </header>

        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}