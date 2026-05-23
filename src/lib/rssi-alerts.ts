import { prisma } from "@/lib/db";

type LatestRssiRow = {
  sequence: number;
  rssi: number;
  sender_mac: string;
  receiver_mac: string;
  created_at: Date;
};

const ALERT_KEY = "esp_now_main";
const DEFAULT_STALE_SECONDS = 30;
const DEFAULT_COOLDOWN_SECONDS = 60 * 30;

function numberFromEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

async function ensureAlertTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS rssi_alert_state (
      alert_key TEXT PRIMARY KEY,
      disconnected_notified BOOLEAN NOT NULL DEFAULT FALSE,
      last_alert_at TIMESTAMPTZ NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await prisma.$executeRaw`
    INSERT INTO rssi_alert_state (alert_key)
    VALUES (${ALERT_KEY})
    ON CONFLICT (alert_key) DO NOTHING
  `;
}

async function getLatestRssi() {
  const rows = await prisma.$queryRaw<LatestRssiRow[]>`
    SELECT sequence, rssi, sender_mac, receiver_mac, created_at
    FROM rssi_samples
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return rows[0] ?? null;
}

function whatsappConfigured() {
  return Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_TO_NUMBER &&
      process.env.WHATSAPP_TEMPLATE_NAME
  );
}

async function sendDisconnectWhatsapp(params: {
  ageSeconds: number;
  latest: LatestRssiRow | null;
}) {
  if (!whatsappConfigured()) {
    return { sent: false, reason: "WhatsApp env vars missing" };
  }

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const url = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
  const lastSeen =
    params.latest?.created_at.toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    }) ?? "sin datos previos";
  const lastRssi =
    typeof params.latest?.rssi === "number" ? `${params.latest.rssi} dBm` : "sin RSSI";
  const linkName =
    params.latest?.sender_mac && params.latest?.receiver_mac
      ? `${params.latest.sender_mac} -> ${params.latest.receiver_mac}`
      : "Enlace ESP-NOW";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: process.env.WHATSAPP_TO_NUMBER,
      type: "template",
      template: {
        name: process.env.WHATSAPP_TEMPLATE_NAME,
        language: {
          code: process.env.WHATSAPP_TEMPLATE_LANGUAGE ?? "es_AR",
        },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: linkName },
              { type: "text", text: `${Math.round(params.ageSeconds)} segundos` },
              { type: "text", text: lastSeen },
              { type: "text", text: lastRssi },
            ],
          },
        ],
      },
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`WhatsApp API ${response.status}: ${body}`);
  }

  return { sent: true, response: body };
}

export async function checkRssiDisconnectAlert() {
  await ensureAlertTable();

  const staleSeconds = numberFromEnv("RSSI_ALERT_STALE_SECONDS", DEFAULT_STALE_SECONDS);
  const cooldownSeconds = numberFromEnv(
    "RSSI_ALERT_COOLDOWN_SECONDS",
    DEFAULT_COOLDOWN_SECONDS
  );
  const latest = await getLatestRssi();
  const nowMs = Date.now();
  const latestMs = latest?.created_at.getTime() ?? 0;
  const ageSeconds = latestMs > 0 ? (nowMs - latestMs) / 1000 : Number.POSITIVE_INFINITY;
  const disconnected = !latest || ageSeconds > staleSeconds;

  const stateRows = await prisma.$queryRaw<
    { disconnected_notified: boolean; last_alert_at: Date | null }[]
  >`
    SELECT disconnected_notified, last_alert_at
    FROM rssi_alert_state
    WHERE alert_key = ${ALERT_KEY}
    LIMIT 1
  `;
  const state = stateRows[0] ?? { disconnected_notified: false, last_alert_at: null };

  if (!disconnected) {
    if (state.disconnected_notified) {
      await prisma.$executeRaw`
        UPDATE rssi_alert_state
        SET disconnected_notified = FALSE, updated_at = NOW()
        WHERE alert_key = ${ALERT_KEY}
      `;
    }

    return {
      ok: true,
      disconnected: false,
      alerted: false,
      age_seconds: ageSeconds,
      last_rssi: latest?.rssi ?? null,
    };
  }

  const lastAlertAgeSeconds = state.last_alert_at
    ? (nowMs - state.last_alert_at.getTime()) / 1000
    : Number.POSITIVE_INFINITY;
  const canAlert = !state.disconnected_notified || lastAlertAgeSeconds > cooldownSeconds;

  if (!canAlert) {
    return {
      ok: true,
      disconnected: true,
      alerted: false,
      reason: "cooldown",
      age_seconds: ageSeconds,
    };
  }

  const result = await sendDisconnectWhatsapp({ ageSeconds, latest });

  await prisma.$executeRaw`
    UPDATE rssi_alert_state
    SET disconnected_notified = TRUE, last_alert_at = NOW(), updated_at = NOW()
    WHERE alert_key = ${ALERT_KEY}
  `;

  return {
    ok: true,
    disconnected: true,
    alerted: result.sent,
    reason: result.reason ?? null,
    age_seconds: ageSeconds,
  };
}
