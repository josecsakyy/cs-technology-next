import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRssiDisconnectAlert } from "@/lib/rssi-alerts";

export const dynamic = "force-dynamic";

type RssiRow = {
  sequence: number;
  rssi: number;
  sender_mac: string;
  receiver_mac: string;
  created_at: Date;
};

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

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS rssi_samples_created_at_idx
    ON rssi_samples (created_at DESC);
  `);
}

export async function GET() {
  try {
    await ensureTable();
    checkRssiDisconnectAlert().catch(() => undefined);

    const rows = await prisma.$queryRaw<RssiRow[]>`
      SELECT sequence, rssi, sender_mac, receiver_mac, created_at
      FROM rssi_samples
      WHERE created_at > NOW() - INTERVAL '120 seconds'
      ORDER BY created_at ASC
    `;

    const firstTime = rows[0]?.created_at.getTime() ?? Date.now();
    const last = rows[rows.length - 1];

    return NextResponse.json(
      {
        samples: rows.map((row) => [
          (row.created_at.getTime() - firstTime) / 1000,
          row.rssi,
        ]),
        last_rx_at: last ? last.created_at.getTime() / 1000 : 0,
        last_rssi: last?.rssi ?? null,
        last_seq: last ? String(last.sequence) : "-",
        sender_mac: last?.sender_mac ?? "-",
        receiver_mac: last?.receiver_mac ?? "-",
        port: "WiFi",
        serial_error: "",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        samples: [],
        last_rx_at: 0,
        last_rssi: null,
        last_seq: "-",
        sender_mac: "-",
        receiver_mac: "-",
        port: "WiFi",
        serial_error: error instanceof Error ? error.message : "RSSI API error",
      },
      { headers: { "Cache-Control": "no-store" }, status: 200 }
    );
  }
}
