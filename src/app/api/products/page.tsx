import { prisma } from "@/lib/db";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Productos</h1>

          <form
            action={async () => {
              "use server";
              // logout via fetch no aplica en server action; lo dejamos con un botón client abajo si querés.
            }}
          />
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
                    <a className="text-blue-400 hover:text-blue-300" href={`/admin/products/${p.id}/edit`}>
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

        <form
          className="mt-6"
          action={async () => {
            "use server";
          }}
        />

        <LogoutButton />
      </div>
    </main>
  );
}

// Botón logout como componente client
function LogoutButton() {
  return (
    <form
      className="mt-6"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
    >
      <button className="border border-gray-700 hover:border-gray-500 transition rounded-lg px-4 py-2 text-sm text-gray-200">
        Cerrar sesión
      </button>
    </form>
  );
}