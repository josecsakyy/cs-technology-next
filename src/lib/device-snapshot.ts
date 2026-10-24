// Convert the compact F767 directory into the existing monitor contract.
const ids = ["05256021", "05506929", "054C691B"];
type Report = {node:string;ip:string;online:boolean;sequence:number;rx_count:number;age_ms:number;health_version:number;alive_mask:number;heard_mask:number};
function object(v:unknown):v is Record<string,unknown>{return !!v&&typeof v==="object"&&!Array.isArray(v);}
function uint(v:unknown){return Number.isInteger(v)&&Number(v)>=0&&Number(v)<=0xffffffff;}
export function deviceSnapshot(input:unknown, now=new Date()) {
 if(!object(input)||input.type!=="rf-gateway"||input.version!==1||!Array.isArray(input.nodes)||input.nodes.length!==3)throw Error("Invalid directory");
 const rawNodes=input.nodes;
 const reports:Report[]=ids.map(id=>{
  const n=rawNodes.filter((v:unknown)=>object(v)&&v.node===id);
  if(n.length!==1)throw Error("Unknown or duplicate node");
  const r=n[0];
  if(typeof r.ip!=="string"||!/^\d{1,3}(\.\d{1,3}){3}$/.test(r.ip)||r.ip.split('.').some((v:string)=>Number(v)>255)||typeof r.online!=="boolean"||![r.sequence,r.rx_count,r.age_ms,r.health_version,r.alive_mask,r.heard_mask].every(uint)||r.alive_mask>7||r.heard_mask>7)throw Error("Invalid node");
  return r as Report;
 });
 const active=reports.map(r=>r.online&&r.age_ms<4000);
 const names=["Principal","Nodo A","Nodo B"];
 const nodes=reports.map((r,i)=>({id:r.node,name:names[i],model:i?"F446":"F767",short:i===0?"F767":i===1?"A":"B",gateway:i===0,active:active[i],ip:r.ip==="0.0.0.0"?null:r.ip,state:active[i]?"EN LÍNEA":"SIN LATIDOS",role:i?"Radio RF · IP vía F767":"Envío directo HTTPS desde F767"}));
 const links=reports.flatMap((src,i)=>reports.flatMap((dst,j)=>{
  if(i===j)return [];
  const state=j===0?active[i]:!active[j]||dst.health_version!==161?null:!!(dst.alive_mask&(1<<i));
  return [{src:src.node,dst:dst.node,state,medium:"Radio RF",status:state===true?"RECIBIENDO":state===false?"SIN LATIDOS":"SIN CONFIRMAR",detail:j===0?`${src.rx_count} RX en F767 · sec. ${src.sequence}`:"Vigilancia del receptor · enviada por F767 directamente"}];
 }));
 return {nodes,links,events:[] as string[],fresh:true,usb:0,time:now.toLocaleTimeString("es-AR",{timeZone:"America/Argentina/Buenos_Aires",hour12:false}),ethernet:{status:"HTTPS DIRECTO",detail:"F767 → router → servidor web · sin PC intermediaria"},eth_mode:"router",source:"f767-direct",error:""};
}
