import {createHash,timingSafeEqual} from "node:crypto";
import {prisma} from "@/lib/db";
import {deviceSnapshot} from "@/lib/device-snapshot";
import {DEVICE_TOKEN_SHA256} from "@/lib/device-auth";
export const runtime="nodejs";
function authorized(request:Request){
 const token=request.headers.get("authorization")?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
 if(!token)return false;
 return timingSafeEqual(createHash("sha256").update(token).digest(),Buffer.from(DEVICE_TOKEN_SHA256,"hex"));
}
async function table(){await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS agroplant_network_snapshot (id INTEGER PRIMARY KEY, payload JSONB NOT NULL, received_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;}
export async function POST(request:Request){
 if(!authorized(request))return Response.json({error:"Unauthorized"},{status:401});
 let data;
 try{
  const reader=request.body?.getReader();if(!reader)throw Error();let size=0;const chunks:Uint8Array[]=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();return Response.json({error:"Too large"},{status:413});}chunks.push(value);}
  data=deviceSnapshot(JSON.parse(Buffer.concat(chunks).toString("utf8")));
 }catch{return Response.json({error:"Invalid telemetry"},{status:400});}
 try{
  await table();
  await prisma.$transaction(async tx=>{
   await tx.$executeRaw`SELECT pg_advisory_xact_lock(746767)`;
   const rows=await tx.$queryRaw<{payload:ReturnType<typeof deviceSnapshot>}[]>`SELECT payload FROM agroplant_network_snapshot WHERE id=1`;
   const prev=rows[0]?.payload;
   data.events=Array.isArray(prev?.events)?prev.events.slice(-30):[];
   if(prev?.source==="f767-direct")for(const link of data.links){
    const old=prev.links.find(l=>l.src===link.src&&l.dst===link.dst);
    if(old&&old.state!==link.state){
     const src=data.nodes.find(n=>n.id===link.src)!.name,dst=data.nodes.find(n=>n.id===link.dst)!.name;
     data.events.push(`${data.time}  ${src} → ${dst}: ${link.state===true?"recuperado":link.state===false?"sin latidos":"sin observación"}`);
    }
   }
   data.events=data.events.slice(-40);
   await tx.$executeRaw`INSERT INTO agroplant_network_snapshot (id,payload,received_at) VALUES (1,${JSON.stringify(data)}::jsonb,NOW()) ON CONFLICT (id) DO UPDATE SET payload=EXCLUDED.payload,received_at=NOW()`;
  });
  return Response.json({ok:true},{headers:{"Cache-Control":"no-store"}});
 }catch{return Response.json({error:"Storage unavailable"},{status:503});}
}
// Device-authenticated diagnostic; the dashboard keeps its user-session check.
export async function GET(request:Request){
 if(!authorized(request))return Response.json({error:"Unauthorized"},{status:401});
 try{await table();const rows=await prisma.$queryRaw`SELECT payload,received_at FROM agroplant_network_snapshot WHERE id=1`;return Response.json(rows,{headers:{"Cache-Control":"no-store"}});}
 catch{return Response.json({error:"Storage unavailable"},{status:503});}
}
