export default function CounterPreview() {
  return (
    <figure className="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-[#0c141d] text-slate-100 shadow-xl">
      <figcaption className="border-b border-white/10 px-5 py-3 text-xs text-slate-300">
        Vista ilustrativa de la interfaz del contador · Datos de ejemplo
      </figcaption>
      <div className="p-5 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs tracking-widest text-emerald-300">CONTROL DE PRODUCCIÓN</p><h3 className="mt-2 text-2xl font-semibold">Conteo y órdenes</h3></div>
          <div className="flex flex-wrap gap-2" aria-label="Funciones disponibles en el panel privado">
            <span className="rounded-xl border border-slate-600 px-4 py-3 text-sm">Ver Excel</span>
            <span className="rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-emerald-950">↓ Descargar Excel</span>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[{label:"Cantidad del lote actual",value:"1.240",note:"Orden DEMO-003"},{label:"Total registrado",value:"3.600",note:"Unidades en los registros de ejemplo"},{label:"Lotes registrados",value:"3",note:"Historial y lote en curso"}].map(card => (
            <div key={card.label} className="rounded-xl border border-white/10 bg-[#15212e] p-5"><p className="text-xs text-slate-400">{card.label}</p><p className="mt-2 text-2xl font-semibold text-emerald-200">{card.value}</p><p className="mt-2 text-xs text-slate-400">{card.note}</p></div>
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#15212e]">
          <h4 className="p-4 text-sm font-semibold">Registro del Excel</h4>
          <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-white/5 text-xs text-slate-400"><tr>{["Orden","Variedad","Cantidad","Estado"].map(label=><th key={label} className="px-4 py-3">{label}</th>)}</tr></thead><tbody>
            {[{order:"DEMO-003",quantity:"1.240",state:"En curso"},{order:"DEMO-002",quantity:"1.180",state:"Cerrado"},{order:"DEMO-001",quantity:"1.180",state:"Cerrado"}].map(row=><tr key={row.order} className="border-t border-white/5"><td className="px-4 py-3">{row.order}</td><td className="px-4 py-3 text-slate-400">Ejemplo</td><td className="px-4 py-3 font-semibold text-emerald-200">{row.quantity}</td><td className="px-4 py-3">{row.state}</td></tr>)}
          </tbody></table></div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">El panel permite consultar órdenes y cantidades, visualizar el registro y descargarlo en Excel. Esta vista es demostrativa; la consulta y la descarga operan desde el acceso privado.</p>
      </div>
    </figure>
  );
}
