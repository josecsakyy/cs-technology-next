import { prisma } from "@/lib/db";
import LogoutButton from "./LogoutButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Productos</h1>
          <LogoutButton />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="text-sm text-gray-400">
              <tr className="border-b border-gray-800">
                <th className="p-4">Nombre</th>
                <th className="p-4">Activo</th>
                <th className="p-4">Precio ARS</th>
                <th className="p-4">Editar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-800">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.isActive ? "Sí" : "No"}</td>
                  <td className="p-4">$ {p.priceArs.toLocaleString("es-AR")}</td>
                  <td className="p-4">
                    <a
                      className="text-blue-400 hover:text-blue-300"
                      href={`/admin/products/${p.id}/edit`}
                    >
                      Editar
                    </a>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-400" colSpan={4}>
                    No hay productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}