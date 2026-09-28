"use client";

export default function InstallGuide() {
  return (
    <details className="mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-700/5 p-4 text-sm text-slate-700">
      <summary className="cursor-pointer font-semibold text-emerald-800">Instalar Create Solutions en tu iPhone</summary>
      <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>Abrí esta pantalla en Safari.</li>
        <li>Tocá Compartir y elegí “Agregar a inicio”.</li>
        <li>Si aparece “Abrir como app”, dejalo activado y tocá Agregar.</li>
        <li>Abrí Create Solutions desde el nuevo ícono e iniciá sesión.</li>
      </ol>
      <p className="mt-4 text-xs text-slate-600">Prueba piloto Agroplant. Requiere internet. Las notificaciones de cierre de orden o lote todavía no están activas.</p>
    </details>
  );
}
