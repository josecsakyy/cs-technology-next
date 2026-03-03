import { prisma } from "@/lib/db";
import EditProductForm from "./EditProductForm";

export default async function AdminEditProductPage() {
  // Tomamos el primero (o el activo si querés)
  const product = await prisma.product.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">No hay productos para editar.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Editar producto</h1>
        <EditProductForm product={product} />
      </div>
    </main>
  );
}