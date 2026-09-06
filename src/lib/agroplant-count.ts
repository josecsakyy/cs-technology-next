import { cookies } from "next/headers";
import { getAgroplantSessionCookieName, verifyAgroplantSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
export async function hasCountSession() {
 const token=(await cookies()).get(getAgroplantSessionCookieName())?.value;
 if(!token)return false;
 try{await verifyAgroplantSession(token);return true;}catch{return false;}
}
export async function ensureCountTable(){
 await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS agroplant_counter_snapshot (id INTEGER PRIMARY KEY, payload JSONB NOT NULL, received_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
}
export async function fetchCounter(excel=false){
 await ensureCountTable();
 const rows=await prisma.$queryRaw<{payload:{snapshot:Record<string,unknown>;excel:string};received_at:Date}[]>`SELECT payload, received_at FROM agroplant_counter_snapshot WHERE id=1`;
 const row=rows[0];if(!row)throw new Error('Esperando la primera sincronización');
 if(excel)return new Response(Buffer.from(row.payload.excel,'base64'));
 return Response.json({...row.payload.snapshot,observed_at:row.received_at.toISOString(),stale:Date.now()-row.received_at.getTime()>20000});
}
