import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, signAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (!ADMIN_USER || !ADMIN_PASS) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_USER / ADMIN_PASS no configurados" },
      { status: 500 }
    );
  }

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return NextResponse.json(
      { ok: false, error: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  const token = await signAdminSession({ user: username });

  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}