"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      setLoading(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Error al iniciar sesión");
        return;
      }

      // Si login OK → redirigimos
      window.location.href = "/admin/products";
    } catch (err) {
      setLoading(false);
      setError("Error de conexión");
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Panel Admin
        </h1>

        <label className="block text-sm text-gray-400 mb-2">
          Usuario
        </label>
        <input
          className="w-full mb-4 rounded-lg bg-gray-950 border border-gray-800 px-3 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block text-sm text-gray-400 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          className="w-full mb-4 rounded-lg bg-gray-950 border border-gray-800 px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 transition rounded-lg py-2 font-semibold"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}