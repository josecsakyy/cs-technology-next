import html from "./template";
import {hasCountSession} from "@/lib/agroplant-count";
export async function GET(request:Request){
 if(!await hasCountSession())return Response.redirect(new URL("/agroplant/login",request.url));
 return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"private, no-store","X-Frame-Options":"SAMEORIGIN"}});
}