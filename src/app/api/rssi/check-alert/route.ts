import { NextResponse } from "next/server";
import { checkRssiDisconnectAlert } from "@/lib/rssi-alerts";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.RSSI_ALERT_CRON_SECRET;
  const requestSecret = request.headers.get("x-alert-token");

  if (cronSecret && requestSecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await checkRssiDisconnectAlert();
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Alert check failed",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
