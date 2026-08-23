import {cookies} from "next/headers";import {NextResponse} from "next/server";import {getAgroplantSessionCookieName} from "@/lib/auth";
export async function POST(request:Request){(await cookies()).delete(getAgroplantSessionCookieName());return NextResponse.redirect(new URL("/agroplant/login",request.url),303);}
