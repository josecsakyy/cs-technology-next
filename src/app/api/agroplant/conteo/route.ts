import { NextResponse } from "next/server";
import { fetchCounter, hasCountSession } from "@/lib/agroplant-count";
import type { CountSnapshot } from "@/lib/agroplant-count-types";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
  if (!await hasCountSession()) return NextResponse.json({error:"Iniciá sesión en Agroplant."},{status:401});
  try {
    const snapshot = await (await fetchCounter()).json() as CountSnapshot;
    if (!Array.isArray(snapshot.rows) || !snapshot.current) throw new Error("Invalid data");
    return NextResponse.json(snapshot,{headers:{"Cache-Control":"no-store"}});
  } catch {
    return NextResponse.json({error:"No hay conexión con la Raspberry. Revisá que esté encendida y conectada a Internet."},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
