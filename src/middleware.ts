import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, verifyAdminSession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitimos la página de login sin sesión
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Protegemos todo /admin/*
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(getSessionCookieName())?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    try {
      await verifyAdminSession(token);
      return NextResponse.next();
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};