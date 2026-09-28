import Image from "next/image";

export const helpLink = "https://wa.me/5493513454027?text=" + encodeURIComponent("Hola, necesito ayuda con Create Solutions y el panel de conteo y órdenes.");

export default function BrandHeader() {
  return <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-white"><Image src="/brand/logo-cosechadora.png" alt="Create Solutions" fill sizes="96px" className="scale-[1.75] object-cover" /></div>
      <div><p className="text-lg font-semibold text-slate-900">Create <span className="text-emerald-700">Solutions</span></p><p className="text-xs text-slate-600">Conteo y órdenes · Agroplant</p></div>
    </div>
    <a href={helpLink} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-emerald-700/20 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">Ayuda por WhatsApp</a>
  </div>;
}
