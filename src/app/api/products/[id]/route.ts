import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getSessionCookieName, verifyAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) throw new Error("UNAUTHORIZED");
  await verifyAdminSession(token);
}

type Ctx = { params: Promise<{ id: string }> | { id: string } };

async function getId(ctx: Ctx): Promise<string> {
  // Next 16 puede pasar params como Promise
  const p = await ctx.params;
  return p.id;
}

export async function GET(_: Request, ctx: Ctx) {
  try {
    const id = await getId(ctx);

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (err) {
    console.error("GET /api/products/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = await getId(ctx);

    const body = await req.json();

    const name = String(body?.name ?? "").trim();
    const slug = String(body?.slug ?? "").trim();
    const shortDescription = String(body?.shortDescription ?? "").trim();
    const description = String(body?.description ?? "").trim();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Faltan campos: name y slug son obligatorios" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        shortDescription,
        description,
        priceArs: Number(body?.priceArs) || 0,
        priceUsdRef: Number(body?.priceUsdRef) || 0,
        isActive: Boolean(body?.isActive),
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "Slug ya existente (tiene que ser único)" },
        { status: 409 }
      );
    }

    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}