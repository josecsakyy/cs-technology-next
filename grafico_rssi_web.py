import json
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

import serial


SERIAL_PORT = sys.argv[1] if len(sys.argv) > 1 else "COM6"
SERIAL_BAUD = 115200
WEB_HOST = "127.0.0.1"
WEB_PORT = 8765
WINDOW_SECONDS = 120

state_lock = threading.Lock()
state = {
    "samples": [],
    "start_time": time.time(),
    "last_rx_at": 0.0,
    "last_rssi": None,
    "last_seq": "-",
    "sender_mac": "-",
    "receiver_mac": "-",
    "serial_error": "",
}


HTML = r"""<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RSSI ESP-NOW</title>
  <style>
    body { margin: 0; background: #101418; color: #e8edf2; font-family: Consolas, monospace; }
    header { padding: 18px 24px 8px; }
    h1 { margin: 0 0 8px; font-size: 24px; }
    .meta { color: #b8c2cc; line-height: 1.5; }
    .status { font-weight: 700; }
    .ok { color: #43d17a; }
    .bad { color: #ff6b6b; }
    canvas { display: block; width: calc(100vw - 32px); height: calc(100vh - 150px); margin: 8px 16px 0; background: #151b20; border: 1px solid #34404a; }
    footer { padding: 10px 24px; color: #b8c2cc; }
  </style>
</head>
<body>
  <header>
    <h1>RSSI en tiempo real</h1>
    <div class="meta" id="meta">Cargando...</div>
  </header>
  <canvas id="plot"></canvas>
  <footer>Guia: -45 excelente | -70 media | -85 debil. Mas arriba = mejor señal.</footer>
<script>
const canvas = document.getElementById("plot");
const ctx = canvas.getContext("2d");
const meta = document.getElementById("meta");
const WINDOW_SECONDS = 120;
const Y_MIN = -95;
const Y_MAX = -30;

function resize() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(800, Math.floor(rect.width * devicePixelRatio));
  canvas.height = Math.max(420, Math.floor(rect.height * devicePixelRatio));
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function quality(rssi) {
  if (rssi >= -55) return "excelente";
  if (rssi >= -67) return "buena";
  if (rssi >= -75) return "media";
  if (rssi >= -85) return "debil";
  return "muy debil";
}

function yToPx(rssi, top, bottom) {
  const value = Math.max(Y_MIN, Math.min(Y_MAX, rssi));
  const ratio = (value - Y_MIN) / (Y_MAX - Y_MIN);
  return bottom - ratio * (bottom - top);
}

function draw(data) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const left = 72, right = w - 28, top = 34, bottom = h - 58;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#151b20";
  ctx.fillRect(0, 0, w, h);

  const now = Date.now() / 1000;
  const recent = data.last_rx_at && (now - data.last_rx_at < 3.5);
  const last = recent && data.last_rssi !== null ? `${data.last_rssi} dBm (${quality(data.last_rssi)})` : "-- dBm";
  const status = recent ? `<span class="status ok">RECIBIENDO</span>` : `<span class="status bad">SIN SEÑAL RECIBIDA</span>`;
  meta.innerHTML = `Puerto: ${data.port} | Estado: ${status} | Último: ${last} | Mensaje: ${data.last_seq} | Emisor: ${data.sender_mac}`;

  ctx.strokeStyle = "#34404a";
  ctx.strokeRect(left, top, right - left, bottom - top);

  ctx.font = "12px Consolas";
  ctx.fillStyle = "#c9d1d9";
  [-30, -45, -55, -70, -85, -95].forEach(rssi => {
    const y = yToPx(rssi, top, bottom);
    ctx.strokeStyle = [-45, -70, -85].includes(rssi) ? "#56636f" : "#29323a";
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    ctx.fillText(String(rssi), 22, y + 4);
  });

  ctx.fillText("dBm", 20, (top + bottom) / 2);
  for (let s = 0; s <= WINDOW_SECONDS; s += 20) {
    const x = left + (s / WINDOW_SECONDS) * (right - left);
    ctx.strokeStyle = "#263039";
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
    ctx.fillStyle = "#c9d1d9";
    ctx.fillText(`-${WINDOW_SECONDS - s}s`, x - 18, bottom + 24);
  }

  const samples = data.samples || [];
  if (samples.length >= 2) {
    const end = Math.max(WINDOW_SECONDS, samples[samples.length - 1][0]);
    const start = Math.max(0, end - WINDOW_SECONDS);
    function xToPx(t) {
      return left + Math.max(0, Math.min(1, (t - start) / WINDOW_SECONDS)) * (right - left);
    }
    ctx.strokeStyle = "#43d17a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    samples.forEach(([t, rssi], i) => {
      const x = xToPx(t);
      const y = yToPx(rssi, top, bottom);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    const [lt, lr] = samples[samples.length - 1];
    ctx.fillStyle = "#e8ff6a";
    ctx.beginPath();
    ctx.arc(xToPx(lt), yToPx(lr, top, bottom), 5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!recent) {
    ctx.fillStyle = "#ff6b6b";
    ctx.font = "bold 28px Consolas";
    ctx.fillText("SIN SEÑAL RECIBIDA", (left + right) / 2 - 150, (top + bottom) / 2);
  }
}

async function poll() {
  try {
    const res = await fetch("/data", { cache: "no-store" });
    draw(await res.json());
  } catch (e) {
    meta.innerHTML = `<span class="status bad">Error leyendo datos: ${e}</span>`;
  }
  setTimeout(poll, 250);
}
poll();
</script>
</body>
</html>
"""


def serial_reader():
    try:
        with serial.Serial(SERIAL_PORT, SERIAL_BAUD, timeout=0.2) as ser:
            ser.dtr = False
            ser.rts = False
            while True:
                raw = ser.readline()
                if not raw:
                    continue
                line = raw.decode("utf-8", errors="ignore").strip()

                with state_lock:
                    if line.startswith("ROLE,"):
                        parts = line.split(",")
                        if len(parts) >= 3:
                            state["receiver_mac"] = parts[2]
                    elif line.startswith("RX,"):
                        parts = line.split(",")
                        if len(parts) >= 4:
                            try:
                                elapsed = time.time() - state["start_time"]
                                rssi = int(parts[2])
                            except ValueError:
                                continue
                            state["samples"].append([elapsed, rssi])
                            state["last_rx_at"] = time.time()
                            state["last_rssi"] = rssi
                            state["last_seq"] = parts[1]
                            state["sender_mac"] = parts[3]
                            state["samples"] = [
                                sample for sample in state["samples"]
                                if elapsed - sample[0] <= WINDOW_SECONDS
                            ]
                    elif line == "NO_SIGNAL":
                        state["last_rx_at"] = 0.0
    except Exception as exc:
        with state_lock:
            state["serial_error"] = str(exc)


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/":
            body = HTML.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if path == "/data":
            with state_lock:
                payload = dict(state)
                payload["port"] = SERIAL_PORT
            body = json.dumps(payload).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        return


def main():
    threading.Thread(target=serial_reader, daemon=True).start()
    server = ThreadingHTTPServer((WEB_HOST, WEB_PORT), Handler)
    print(f"Grafico abierto en: http://{WEB_HOST}:{WEB_PORT}")
    print("Ctrl+C para salir.")
    server.serve_forever()


if __name__ == "__main__":
    main()
