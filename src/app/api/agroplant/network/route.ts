import { prisma } from "@/lib/db";
import { hasCountSession } from "@/lib/agroplant-count";
export const runtime = "nodejs";
type Node = {id:string;name:string;model:string;short:string;gateway:boolean;active:boolean;ip:string|null;state:string;role:string};
type Edge = {src:string;dst:string;state:boolean|null;medium:string;status:string;detail:string};
type Snapshot = {nodes:Node[];links:Edge[];events:string[];fresh:boolean;usb:number;time:string;ethernet:{status:string;detail:string};error:string};
async function table(){await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS agroplant_network_snapshot (id INTEGER PRIMARY KEY, payload JSONB NOT NULL, received_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;}
function empty():Snapshot {
 const nodes:Node[]=[{id:"gateway",name:"Principal",model:"F767",short:"F767",gateway:true,active:false,ip:null,state:"SIN CONFIRMAR",role:""},{id:"a",name:"Nodo A",model:"F446",short:"A",gateway:false,active:false,ip:null,state:"SIN CONFIRMAR",role:""},{id:"b",name:"Nodo B",model:"F446",short:"B",gateway:false,active:false,ip:null,state:"SIN CONFIRMAR",role:""}];
 return {nodes,links:nodes.flatMap(a=>nodes.filter(b=>a.id!==b.id).map(b=>({src:a.id,dst:b.id,state:null,medium:"Radio RF",status:"SIN CONFIRMAR",detail:"Esperando sincronización del monitor USB"}))),events:[],fresh:false,usb:0,time:"—",ethernet:{status:"SIN CONFIRMAR",detail:"Sin sincronización con la PC"},error:""};
}
export async function GET(){
 if(!await hasCountSession())return Response.json({error:"Iniciá sesión"},{status:401});
 try{await table();const rows=await prisma.$queryRaw<{payload:Snapshot;received_at:Date}[]>`SELECT payload, received_at FROM agroplant_network_snapshot WHERE id=1`;
 const row=rows[0], stale=!row||Date.now()-row.received_at.getTime()>15000;const data=row?row.payload:empty();
 if(stale){data.fresh=false;data.usb=0;data.nodes=data.nodes.map(n=>({...n,active:false,state:"SIN CONFIRMAR"}));data.links=data.links.map(l=>({...l,state:null,status:"SIN CONFIRMAR",detail:"Sin sincronización reciente con la PC"}));data.ethernet={status:"SIN CONFIRMAR",detail:"Sin sincronización reciente con la PC"};}
 return Response.json({...data,cloud_stale:stale},{headers:{"Cache-Control":"private, no-store"}});
 }catch{return Response.json({error:"No se pudo consultar el monitor"},{status:503});}
}
export async function POST(request:Request){
 if(!await hasCountSession())return Response.json({error:"Iniciá sesión"},{status:401});
 if(request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Origen no autorizado"},{status:403});
 try{
 const reader=request.body?.getReader();if(!reader)throw Error();let size=0;const chunks:Uint8Array[]=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>100000){await reader.cancel();return Response.json({error:"Datos demasiado grandes"},{status:413});}chunks.push(value);}
 const data=JSON.parse(Buffer.concat(chunks).toString("utf8")) as Snapshot;
 const str=(v:unknown)=>typeof v==="string"&&v.length<2000;
 if(!Array.isArray(data.nodes)||data.nodes.length!==3||!data.nodes.every(n=>/^[a-zA-Z0-9_-]{1,40}$/.test(n.id)&&[n.name,n.model,n.short,n.state,n.role].every(str)&&typeof n.active==="boolean"&&typeof n.gateway==="boolean"&&(n.ip===null||str(n.ip)))||new Set(data.nodes.map(n=>n.id)).size!==3||data.nodes.filter(n=>n.gateway).length!==1)throw Error();
 if(!Array.isArray(data.links)||data.links.length!==6||!data.links.every(l=>data.nodes.some(n=>n.id===l.src)&&data.nodes.some(n=>n.id===l.dst)&&l.src!==l.dst&&(l.state===null||typeof l.state==="boolean")&&[l.medium,l.status,l.detail].every(str))||new Set(data.links.map(l=>l.src+":"+l.dst)).size!==6)throw Error();
 if(!Array.isArray(data.events)||data.events.length>40||!data.events.every(str)||typeof data.fresh!=="boolean"||!Number.isInteger(data.usb)||data.usb<0||data.usb>3||!str(data.time)||!data.ethernet||![data.ethernet.status,data.ethernet.detail,data.error].every(str))throw Error();
 await table();await prisma.$executeRaw`INSERT INTO agroplant_network_snapshot (id,payload,received_at) VALUES (1,${JSON.stringify(data)}::jsonb,NOW()) ON CONFLICT (id) DO UPDATE SET payload=EXCLUDED.payload,received_at=NOW()`;
 return Response.json({ok:true});
 }catch{return Response.json({error:"Snapshot de red inválido"},{status:400});}
}
