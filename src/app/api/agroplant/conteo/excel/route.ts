import { NextResponse } from "next/server";
import { fetchCounter, hasCountSession } from "@/lib/agroplant-count";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
  if (!await hasCountSession()) return NextResponse.json({error:"Iniciá sesión en Agroplant."},{status:401});
  try {
    const response = await fetchCounter(true);
    return new Response(await response.arrayBuffer(),{headers:{
      "Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":'attachment; filename="conteo_ordenes.xlsx"',"Cache-Control":"no-store",
    }});
  } catch {
    return NextResponse.json({error:"No se pudo descargar el Excel. La Raspberry no responde."},{status:503});
  }
}
