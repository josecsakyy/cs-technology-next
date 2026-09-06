import {NextResponse} from 'next/server';
import {ensureCountTable,hasCountSession} from '@/lib/agroplant-count';
import {prisma} from '@/lib/db';
export const runtime='nodejs';
export async function POST(request:Request){
 if(!await hasCountSession())return NextResponse.json({error:'Iniciá sesión en Agroplant.'},{status:401});
 if(request.headers.get('origin')!==new URL(request.url).origin)return NextResponse.json({error:'Origen no autorizado'},{status:403});
 try{
  const reader=request.body?.getReader();if(!reader)throw Error();
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>3000000){await reader.cancel();return NextResponse.json({error:'Registro demasiado grande'},{status:413});}chunks.push(value);}
  const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
  const s=body.snapshot;
  if(!s||!Array.isArray(s.rows)||!s.rows.length||s.rows.length>10000||!s.current||!Number.isInteger(s.revision)||!s.export||!Array.isArray(s.export.usb)||typeof body.excel!=='string'||!/^UEs[A-Za-z0-9+/=]+$/.test(body.excel))throw Error();
  if(!s.rows.every((r:Record<string,unknown>)=>Number.isInteger(r.id)&&Number.isInteger(r.quantity)&&Number(r.quantity)>=0&&['started','updated','order_number','variety','description'].every(k=>typeof r[k]==='string'))||!s.rows.some((r:{id:number})=>r.id===s.current.id))throw Error();
  await ensureCountTable();const payload=JSON.stringify({snapshot:s,excel:body.excel});
  await prisma.$executeRaw`INSERT INTO agroplant_counter_snapshot (id,payload,received_at) VALUES (1,${payload}::jsonb,NOW()) ON CONFLICT (id) DO UPDATE SET payload=EXCLUDED.payload,received_at=NOW()`;
  return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'No se pudo sincronizar el registro.'},{status:400});}
}
