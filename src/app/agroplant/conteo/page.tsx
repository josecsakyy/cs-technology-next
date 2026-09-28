"use client";
import Link from "next/link";
import BrandHeader from "../BrandHeader";
import InstallGuide from "./InstallGuide";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CountSnapshot } from "@/lib/agroplant-count-types";

const number = (n: number) => n.toLocaleString("es-AR");
const date = (s: string) => new Date(s).toLocaleString("es-AR",{dateStyle:"short",timeStyle:"short"});

export default function CountDashboard() {
  const [data,setData]=useState<CountSnapshot|null>(null);
  const [error,setError]=useState("");
  const [updated,setUpdated]=useState<Date|null>(null);
  const [query,setQuery]=useState("");
  const [downloading,setDownloading]=useState(false);
  const [downloadError,setDownloadError]=useState("");
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    let closed=false;let timer:ReturnType<typeof setTimeout>;let controller:AbortController;
    const poll=async()=>{
      controller=new AbortController();
      try{
        const response=await fetch("/api/agroplant/conteo",{cache:"no-store",signal:controller.signal});
        const result=await response.json();
        if(!response.ok)throw new Error(result.error||"No se pudo leer el contador.");
        if(!closed){setData(result);setError(result.stale?"La Raspberry dejó de enviar datos.":"");setUpdated(new Date(result.observed_at));}
      }catch(e){if(!closed)setError(e instanceof Error?e.message:"Sin conexión con la Raspberry.");}
      finally{if(!closed)timer=setTimeout(poll,2000);}
    };poll();return()=>{closed=true;clearTimeout(timer);controller?.abort();};
  },[]);
  const rows=useMemo(()=>data?.rows.filter(r=>[r.order_number,r.variety,r.description,String(r.id)].join(" ").toLocaleLowerCase().includes(query.toLocaleLowerCase()))??[],[data,query]);
  const total=data?.rows.reduce((sum,r)=>sum+r.quantity,0)??0;
  const chart=data?.rows.slice(0,10).reverse()??[];
  const max=Math.max(1,...chart.map(r=>r.quantity));
  const usb=data?.export.usb??[];
  const usbSaved=usb.length>0&&usb.every(v=>v.status==="saved"&&v.saved_revision===data?.revision);
  async function download(){
    setDownloading(true);setDownloadError("");
    try{const response=await fetch("/api/agroplant/conteo/excel",{cache:"no-store"});
      if(!response.ok){const result=await response.json();throw new Error(result.error||"No se pudo descargar.");}
      const url=URL.createObjectURL(await response.blob()),a=document.createElement("a");a.href=url;a.download="conteo_ordenes.xlsx";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }catch(e){setDownloadError(e instanceof Error?e.message:"No se pudo descargar.");}finally{setDownloading(false);}
  }
  return <main className="min-h-screen bg-gradient-to-br from-[#f1faf4] via-white to-[#fff9e8] px-5 py-8 text-slate-900">
    <div className="mx-auto max-w-7xl">
      <BrandHeader />
      <div className="mb-5 flex justify-end"><form action="/api/agroplant/logout" method="post"><button className="text-sm font-medium text-emerald-800 underline">Cerrar sesión</button></form></div>
      <InstallGuide />
      <header className="flex flex-wrap items-center justify-between gap-5">
        <div><Link href="/agroplant" className="text-sm text-slate-600 hover:text-emerald-800">← Monitoreo Agroplant</Link><p className="mt-6 text-xs tracking-[.24em] text-emerald-700">AGROPLANT · PRODUCCIÓN</p><h1 className="mt-2 text-3xl font-semibold md:text-4xl">Conteo y órdenes</h1><p className="mt-3 text-sm text-slate-600">Datos del registro Excel de la Raspberry · Actualización cada 2 segundos</p></div>
        <div className="flex flex-wrap gap-3"><button onClick={()=>dialog.current?.showModal()} disabled={!data} className="rounded-xl border border-emerald-900/20 px-5 py-3 text-sm disabled:opacity-40 hover:bg-emerald-50">Ver Excel</button><button onClick={download} disabled={!data||downloading} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{downloading?"Descargando…":"Descargar Excel"}</button></div>
      </header>
      <div className={`mt-7 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${error?"border-amber-400/30 bg-amber-400/10 text-amber-800":"border-emerald-400/20 bg-emerald-400/5 text-emerald-800"}`} role="status"><span>{error?`Sin conexión · ${error}`:data?"● En vivo · Raspberry conectada":"Conectando con la Raspberry…"}</span><span className="text-xs">{updated?`Última lectura ${updated.toLocaleTimeString("es-AR")}`:"Esperando primera lectura"}</span></div>
      {error&&data&&<p className="mt-2 text-xs text-amber-800">Se conserva la última lectura; los valores no se están actualizando.</p>}
      {downloadError&&<p role="alert" className="mt-3 text-sm text-red-700">{downloadError}</p>}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{label:"Cantidad del lote actual",value:data?number(data.current.quantity):"—",note:data?.current.order_number?`Orden ${data.current.order_number}`:"Sin número de orden"},{label:"Total registrado",value:data?number(total):"—",note:"Suma de los lotes del Excel"},{label:"Lotes registrados",value:data?number(data.rows.length):"—",note:"Historial y lote en curso"},{label:"Respaldo USB",value:!data?"—":usbSaved?"Guardado":usb.length?"Pendiente":"Sin pendrive",note:usb.map(v=>v.label).join(", ")||"Copia local en la Raspberry"}].map(card=><article key={card.label} className="rounded-2xl border border-emerald-900/10 bg-white p-6"><p className="text-sm text-slate-600">{card.label}</p><p className="mt-3 text-3xl font-semibold text-emerald-800">{card.value}</p><p className="mt-3 text-xs text-slate-600">{card.note}</p></article>)}
      </section>
      <section className="mt-5 grid gap-5 lg:grid-cols-[.85fr_1.4fr]">
        <article className="rounded-2xl border border-emerald-900/10 bg-white p-6"><p className="text-xs tracking-widest text-emerald-700">LOTE EN CURSO</p><h2 className="mt-3 text-2xl font-semibold">{data?.current.order_number?`Orden ${data.current.order_number}`:data?`Lote #${data.current.id}`:"Esperando datos"}</h2><dl className="mt-6 space-y-5"><div><dt className="text-xs text-slate-600">Variedad</dt><dd className="mt-1 break-words">{data?.current.variety||"Sin especificar"}</dd></div><div><dt className="text-xs text-slate-600">Descripción</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">{data?.current.description||"Sin descripción"}</dd></div><div><dt className="text-xs text-slate-600">Inicio</dt><dd className="mt-1 text-sm">{data?date(data.current.started):"—"}</dd></div></dl></article>
        <article className="rounded-2xl border border-emerald-900/10 bg-white p-6"><h2 className="text-lg font-semibold">Cantidad por lote</h2><p className="mt-1 text-xs text-slate-600">Últimos 10 registros · Unidades contadas</p><div className="mt-6 space-y-3">{chart.map(row=><div key={row.id} className="grid grid-cols-[85px_1fr_55px] items-center gap-3 text-xs"><span className="truncate text-slate-700" title={row.order_number}>#{row.id}{row.order_number?` · ${row.order_number}`:""}</span><div className="h-3 rounded bg-emerald-50"><div className={`h-3 rounded transition-[width] duration-500 ${row.active?"bg-emerald-700":"bg-emerald-400"}`} style={{width:`${row.quantity/max*100}%`}} /></div><span className="text-right tabular-nums">{number(row.quantity)}</span></div>)}{!chart.length&&<p className="py-16 text-center text-sm text-slate-600">El gráfico aparecerá al recibir los registros.</p>}</div></article>
      </section>
      <section className="mt-5 overflow-hidden rounded-2xl border border-emerald-900/10 bg-white"><div className="flex flex-wrap items-center justify-between gap-4 p-6"><div><h2 className="text-lg font-semibold">Registro del Excel</h2><p className="mt-1 text-xs text-slate-600">Las correcciones y los borrados de la aplicación se reflejan aquí.</p></div><input aria-label="Buscar órdenes" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar orden, variedad o descripción" className="w-full rounded-lg border border-emerald-900/20 bg-[#f1faf4] px-4 py-3 text-sm sm:w-80"/></div><CountTable rows={rows}/></section>
      <p className="mt-5 text-xs text-slate-600">{data?.export.local_saved?`Excel local actualizado: ${date(data.export.local_saved)}`:"El Excel se mantiene en la Raspberry."}</p>
      <dialog ref={dialog} className="m-auto max-h-[85vh] w-[1200px] max-w-[95vw] overflow-auto rounded-2xl border border-emerald-900/20 bg-white p-0 text-slate-900 backdrop:bg-black/70"><header className="sticky top-0 flex items-center justify-between gap-4 border-b border-emerald-900/10 bg-white p-6"><h2 className="text-xl font-semibold">Vista del Excel</h2><button aria-label="Cerrar vista del Excel" onClick={()=>dialog.current?.close()} className="rounded-lg border border-emerald-900/20 px-3 py-2">✕</button></header><CountTable rows={data?.rows??[]}/><footer className="flex justify-end p-5"><button onClick={download} disabled={downloading} className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white">Descargar Excel</button></footer></dialog>
    </div>
  </main>;
}
function CountTable({rows}:{rows:CountSnapshot["rows"]}){
 return <><div className="space-y-3 p-4 md:hidden">{rows.map(row=><article key={row.id} className="rounded-xl border border-emerald-900/10 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{row.order_number || `Lote #${row.id}`}</h3><p className="mt-1 text-xs text-slate-600">{date(row.started)}</p></div><span className="text-xs text-emerald-800">{row.active ? "En curso" : "Cerrado"}</span></div><p className="mt-4 text-2xl font-semibold text-emerald-800">{number(row.quantity)} <span className="text-xs font-normal text-slate-600">unidades</span></p><p className="mt-2 break-words text-sm">{row.variety || "Sin variedad"}</p>{row.description && <p className="mt-1 break-words text-sm text-slate-600">{row.description}</p>}</article>)}{!rows.length && <p className="py-6 text-center text-sm text-slate-600">Sin registros para mostrar.</p>}</div><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-emerald-50 text-xs text-slate-600"><tr>{["Lote / fecha","Número de orden","Variedad","Descripción","Cantidad","Estado"].map(h=><th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.id} className="border-t border-emerald-900/10"><td className="px-5 py-4">#{row.id}<span className="mt-1 block whitespace-nowrap text-xs text-slate-600">{date(row.started)}</span></td><td className="px-5 py-4">{row.order_number||"—"}</td><td className="px-5 py-4">{row.variety||"—"}</td><td className="max-w-sm whitespace-pre-wrap break-words px-5 py-4 text-slate-700">{row.description||"—"}</td><td className="px-5 py-4 font-semibold tabular-nums text-emerald-800">{number(row.quantity)}</td><td className="px-5 py-4"><span className={`whitespace-nowrap rounded-md px-2 py-1 text-xs ${row.active?"bg-emerald-700/15 text-emerald-800":"bg-emerald-50 text-slate-600"}`}>{row.active?"En curso":"Cerrado"}</span></td></tr>)}{!rows.length&&<tr><td colSpan={6} className="px-5 py-10 text-center text-slate-600">Sin registros para mostrar.</td></tr>}</tbody></table></div></>;
}
