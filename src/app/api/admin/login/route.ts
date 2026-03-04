import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, signAdminSession } from "@/lib/auth";

export const runtime = "nodejs"; // evita líos con edge/env

const norm = (s?: string) =>
  (s ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1");

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = norm(body.username);
    const password = norm(body.password);

    const ADMIN_USER = norm(process.env.ADMIN_USER);
    const ADMIN_PASS = norm(process.env.ADMIN_PASS);

    // Debug seguro (no muestra secretos, solo si existen y longitudes)
    if (!ADMIN_USER || !ADMIN_PASS) {
      return NextResponse.json(
        {
          ok: false,
          error: "ADMIN_USER / ADMIN_PASS no configurados",
          debug: {
            hasUser: Boolean(process.env.ADMIN_USER),
            hasPass: Boolean(process.env.ADMIN_PASS),
            lenUser: (process.env.ADMIN_USER ?? "").length,
            lenPass: (process.env.ADMIN_PASS ?? "").length,
            vercelEnv: process.env.VERCEL_ENV,
            nodeEnv: process.env.NODE_ENV,
          },
        },
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
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "Fallo interno en login",
        detail: e?.message ?? String(e),
      },
      { status: 500 }
    );
  }
}