"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  priceArs: number;
  priceUsdRef: number;
  isActive: boolean;
};

export default function EditProductForm({ product }: { product: Product }) {
  const [form, setForm] = useState({
    name: product.name ?? "",
    slug: product.slug ?? "",
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    priceArs: product.priceArs ?? 0,
    priceUsdRef: product.priceUsdRef ?? 0,
    isActive: product.isActive ?? true,
  });

  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!product?.id) {
      setStatus("Error: product.id undefined (no se puede guardar)");
      return;
    }

    setSaving(true);

    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const text = await res.text().catch(() => "");
    setSaving(false);

    if (!res.ok) {
      setStatus(`Error guardando (${res.status}): ${text || "sin detalle"}`);
      return;
    }

    setStatus("Guardado OK");
  }

  return (
    <form
      onSubmit={onSave}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4"
    >
      <div className="text-xs text-gray-500">
        ID: <span className="text-gray-300">{product.id}</span>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Nombre</label>
        <input
          className="w-full rounded-lg bg-gray-950 border border-gray-800 px-3 py-2"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Slug</label>
        <input
          className="w-full rounded-lg bg-gray-950 border border-gray-800 px-3 py-2"
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Descripción corta</label>
        <textarea
          className="w-full rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 min-h-[80px]"
          value={form.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Descripción</label>
        <textarea
          className="w-full rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 min-h-[140px]"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Precio ARS</label>
          <input
            type="number"
            className="w-full rounded-lg bg-gray-950 border border-gray-800 px-3 py-2"
            value={form.priceArs}
            onChange={(e) => set("priceArs", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">USD (ref.)</label>
          <input
            type="number"
            className="w-full rounded-lg bg-gray-950 border border-gray-800 px-3 py-2"
            value={form.priceUsdRef}
            onChange={(e) => set("priceUsdRef", Number(e.target.value))}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => set("isActive", e.target.checked)}
        />
        Producto activo
      </label>

      {status && (
        <p className={status.includes("OK") ? "text-green-400" : "text-red-400"}>
          {status}
        </p>
      )}

      <div className="flex gap-3">
        <button
          disabled={saving}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 transition rounded-lg px-5 py-2 font-semibold"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>

        <a
          href="/admin/products"
          className="border border-gray-700 hover:border-gray-500 transition rounded-lg px-5 py-2"
        >
          Volver
        </a>
      </div>
    </form>
  );
}