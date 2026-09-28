"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import BrandHeader from "../BrandHeader";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/agroplant/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      if (response.ok) { location.href = "/agroplant/conteo"; return; }
      const result = await response.json();
      setError(result.error || "No se pudo iniciar sesión.");
    } catch { setError("No pudimos conectarnos. Revisá tu conexión e intentá nuevamente."); }
    finally { setLoading(false); }
  }
  return <main className="min-h-screen bg-gradient-to-br from-[#f1faf4] via-white to-[#fff9e8] px-5 py-8 text-slate-900">
    <div className="mx-auto max-w-3xl"><BrandHeader />
      <form onSubmit={submit} className="mx-auto mt-10 w-full max-w-md rounded-3xl border border-emerald-900/10 bg-white/90 p-7 shadow-sm">
        <p className="text-xs font-semibold tracking-widest text-emerald-700">ACCESO PRIVADO</p>
        <h1 className="mt-3 text-3xl font-semibold">Iniciar sesión</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">Ingresá con tus credenciales de Agroplant para consultar conteos, órdenes y registros.</p>
        <label htmlFor="username" className="mt-6 block text-sm font-medium">Usuario</label>
        <input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={username} onChange={event=>setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-base focus:outline-emerald-700" />
        <label htmlFor="password" className="mt-4 block text-sm font-medium">Contraseña</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={event=>setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-base focus:outline-emerald-700" />
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">{loading ? "Ingresando…" : "Ingresar"}</button>
        <Link href="/" className="mt-5 block text-center text-sm text-emerald-800">Volver al sitio</Link>
      </form>
    </div>
  </main>;
}