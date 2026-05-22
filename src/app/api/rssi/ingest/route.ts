import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const RSSI_INGEST_TOKEN =
  process.env.RSSI_INGEST_TOKEN ?? "cs-technology-rssi-demo-token";

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS rssi_samples (
      id BIGSERIAL PRIMARY KEY,
      sequence INTEGER NOT NULL,
      rssi INTEGER NOT NULL,
      sender_mac TEXT NOT NULL,
      receiver_mac TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export async function POST(request: Request) {
  const token = request.headers.get("x-rssi-token");
  if (token !== RSSI_INGEST_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const sequence = Number(body?.sequence);
    const rssi = Number(body?.rssi);
    const senderMac = String(body?.sender_mac ?? "").trim();
    const receiverMac = String(body?.receiver_mac ?? "").trim();

    if (!Number.isFinite(sequence) || !Number.isFinite(rssi) || !senderMac || !receiverMac) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await ensureTable();

    await prisma.$executeRaw`
      INSERT INTO rssi_samples (sequence, rssi, sender_mac, receiver_mac)
      VALUES (${sequence}, ${rssi}, ${senderMac}, ${receiverMac})
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
