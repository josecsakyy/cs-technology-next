"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "5493513454027";
const WHATSAPP_MESSAGE =
  "Hola! Quiero información sobre CS Technology. Me interesa automatización / datos para agroindustria.";
const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

const EMAIL_TO = "josecsx4@gmail.com";
const EMAIL_SUBJECT = "Interesado en CS Technology";
const EMAIL_BODY =
  "Hola, estoy interesado en el producto de CS Technology.\n\nMi nombre es:\nEmpresa:\nTeléfono:\nMensaje:\n";
const mailLink = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(
  EMAIL_SUBJECT
)}&body=${encodeURIComponent(EMAIL_BODY)}`;

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: "easeOut" as const },
  }),
};

const solutions = [
  {
    title: "IA & Automatización",
    desc: "Agentes, RAG, visión artificial y flujos para operar más rápido y con menos error.",
    tag: "IA",
  },
  {
    title: "Trazabilidad & Datos",
    desc: "Dashboards, KPIs, reporting, calidad de datos y decisiones basadas en evidencia.",
    tag: "DATA",
  },
  {
    title: "IoT & Sensores",
    desc: "Telemetría, monitoreo y alertas. Integración con hardware en tiempo real.",
    tag: "IOT",
  },
  {
    title: "Software a medida",
    desc: "Webs, paneles admin, APIs y herramientas internas adaptadas a tu operación.",
    tag: "DEV",
  },
  {
    title: "Integraciones",
    desc: "ERP/CRM, WhatsApp, pagos, logística, BI. Menos planillas, más automatización.",
    tag: "API",
  },
  {
    title: "Calidad & QA",
    desc: "Automatización de tests, control de releases y mejora continua del producto.",
    tag: "QA",
  },
];

const tech = ["OpenAI", "PostgreSQL", "Neon", "Vercel", "Next.js", "Node.js"];

type RssiData = {
  samples: [number, number][];
  last_rx_at: number;
  last_rssi: number | null;
  last_seq: string;
  sender_mac: string;
  receiver_mac: string;
  serial_error?: string;
  port?: string;
};

function LogoRound({
  src,
  alt,
  size = 56,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-full border border-black/10 bg-white shadow-sm"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}

function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f4fbf5] via-white to-[#fffdf4]" />

      {/* Grid sutil */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.10) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Blobs animados */}
      <motion.div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-emerald-300/35 blur-[90px]"
        animate={{ x: [0, 35, 0], y: [0, 25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-48 -right-48 h-[560px] w-[560px] rounded-full bg-yellow-200/45 blur-[110px]"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Partículas suaves */}
      <div className="absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-full bg-emerald-400/20"
            style={{
              left: `${(i * 7 + 9) % 100}%`,
              top: `${(i * 11 + 13) % 100}%`,
            }}
            animate={{ y: [0, -14, 0], opacity: [0.12, 0.28, 0.12] }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 6) * 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function classifyRssi(rssi: number | null) {
  if (rssi === null) return "sin señal";
  if (rssi >= -55) return "excelente";
  if (rssi >= -67) return "buena";
  if (rssi >= -75) return "media";
  if (rssi >= -85) return "débil";
  return "muy débil";
}

function RssiLiveChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [data, setData] = useState<RssiData>({
    samples: [],
    last_rx_at: 0,
    last_rssi: null,
    last_seq: "-",
    sender_mac: "-",
    receiver_mac: "-",
    port: "COM6",
  });

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch("http://127.0.0.1:8765/data", {
          cache: "no-store",
        });
        const payload = (await response.json()) as RssiData;
        if (!cancelled) setData(payload);
      } catch {
        if (!cancelled) {
          setData((current) => ({
            ...current,
            last_rx_at: 0,
            last_rssi: null,
            serial_error: "No se pudo leer RSSI",
          }));
        }
      }
    }

    poll();
    const timer = window.setInterval(poll, 500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(420, Math.floor(rect.width * dpr));
    canvas.height = Math.max(116, Math.floor(rect.height * dpr));

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;
    const left = 38;
    const right = width - 12;
    const top = 10;
    const bottom = height - 26;
    const yMin = -95;
    const yMax = -30;
    const windowSeconds = 120;

    const signalRecent =
      data.last_rx_at > 0 && Date.now() / 1000 - data.last_rx_at < 3.5;

    const yToPx = (rssi: number) => {
      const value = Math.max(yMin, Math.min(yMax, rssi));
      const ratio = (value - yMin) / (yMax - yMin);
      return bottom - ratio * (bottom - top);
    };

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(15,23,42,0.12)";
    ctx.strokeRect(left, top, right - left, bottom - top);

    ctx.font = "10px Arial";
    ctx.fillStyle = "rgba(15,23,42,0.55)";
    [-45, -70, -85].forEach((rssi) => {
      const y = yToPx(rssi);
      ctx.strokeStyle = "rgba(15,23,42,0.12)";
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
      ctx.fillText(String(rssi), 8, y + 3);
    });

    const samples = data.samples ?? [];
    if (samples.length >= 2) {
      const end = Math.max(windowSeconds, samples[samples.length - 1][0]);
      const start = Math.max(0, end - windowSeconds);
      const xToPx = (time: number) =>
        left +
        Math.max(0, Math.min(1, (time - start) / windowSeconds)) *
          (right - left);

      ctx.strokeStyle = "#047857";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      samples.forEach(([time, rssi], index) => {
        const x = xToPx(time);
        const y = yToPx(rssi);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      const [lastTime, lastRssi] = samples[samples.length - 1];
      ctx.fillStyle = "#ca8a04";
      ctx.beginPath();
      ctx.arc(xToPx(lastTime), yToPx(lastRssi), 4, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!signalRecent) {
      ctx.fillStyle = "rgba(185,28,28,0.86)";
      ctx.font = "bold 13px Arial";
      ctx.fillText("SIN SEÑAL RECIBIDA", left + 16, (top + bottom) / 2);
    }

    ctx.fillStyle = "rgba(15,23,42,0.52)";
    ctx.font = "10px Arial";
    ctx.fillText("120s", left, height - 8);
    ctx.fillText("ahora", right - 28, height - 8);
  }, [data]);

  const signalRecent =
    data.last_rx_at > 0 && Date.now() / 1000 - data.last_rx_at < 3.5;
  const status = signalRecent ? "Recibiendo" : "Sin señal";
  const rssiText =
    signalRecent && data.last_rssi !== null ? `${data.last_rssi} dBm` : "-- dBm";

  return (
    <div className="mt-4 rounded-xl border border-black/10 bg-gradient-to-r from-emerald-50 to-yellow-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-black/50">Enlace ESP-NOW</div>
          <div className="mt-1 text-lg font-semibold text-emerald-700">
            {rssiText}
          </div>
        </div>
        <div className="text-right">
          <div
            className={
              signalRecent
                ? "text-xs font-semibold text-emerald-700"
                : "text-xs font-semibold text-red-700"
            }
          >
            {status}
          </div>
          <div className="mt-1 text-[11px] text-black/45">
            {classifyRssi(signalRecent ? data.last_rssi : null)}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="mt-2 h-[96px] w-full" />
      <div className="mt-1 flex justify-between text-[10px] text-black/45">
        <span>Y: dBm</span>
        <span>Msg {data.last_seq}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen text-[#0b1220]">
      <BackgroundFX />

      {/* NAVBAR */}
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <LogoRound src="/brand/logo-cosechadora.png" alt="CS" size={56} />
            <div className="leading-tight">
              <div className="font-semibold text-[16px]">
                CS <span className="text-emerald-700">Technology</span>
              </div>
              <div className="text-[12px] text-black/55">
                Agroindustria + Software + IA
              </div>
            </div>
          </Link>

          {/* IMPORTANTE: /#... para historial (Atrás vuelve) */}
          <nav className="hidden items-center gap-7 md:flex text-sm text-black/70">
            <a href="/#producto" className="hover:text-black">
              Producto
            </a>
            <a href="/#soluciones" className="hover:text-black">
              Soluciones
            </a>
            <a href="/#beneficios" className="hover:text-black">
              Beneficios
            </a>
            <a href="/#contacto" className="hover:text-black">
              Contacto
            </a>
            <Link
              href="/admin/login"
              className="rounded-xl border border-black/10 bg-white px-4 py-2 hover:bg-black/[0.03]"
            >
              Admin
            </Link>
          </nav>

          <a
            href={waLink}
            className="md:hidden rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-10 md:pt-14">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs text-black/70"
              initial="hidden"
              animate="visible"
              variants={fade}
              custom={0}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Tecnología aplicada al agro • CS Technology
            </motion.div>

            <motion.h1
              className="mt-5 text-4xl font-semibold leading-tight md:text-5xl"
              initial="hidden"
              animate="visible"
              variants={fade}
              custom={1}
            >
              Automatizá, medí y escalá tu operación con{" "}
              <span className="text-emerald-700">IA</span> y{" "}
              <span className="text-yellow-600">datos</span>.
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-black/65"
              initial="hidden"
              animate="visible"
              variants={fade}
              custom={2}
            >
              Software + analítica + integraciones para agroindustria: trazabilidad,
              paneles de control, automatización y herramientas internas que mejoran la
              eficiencia real del día a día.
            </motion.p>

            <motion.div
              className="mt-7 flex flex-col gap-3 sm:flex-row"
              initial="hidden"
              animate="visible"
              variants={fade}
              custom={3}
            >
              <a
                href={waLink}
                className="rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Hablar por WhatsApp
              </a>
              <a
                href="/#producto"
                className="rounded-2xl border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-black hover:bg-black/[0.03]"
              >
                Ver producto
              </a>
            </motion.div>

            <div className="mt-10">
              <p className="text-xs text-black/50">Tecnologías que usamos</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* IMAGEN HERO */}
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-yellow-300/10" />
            <div className="relative h-[420px] w-full">
              <Image
                src="/brand/hero-papas.png"
                alt="Agroindustria"
                fill
                className="object-cover object-[50%_20%]"
                priority
              />
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-2 backdrop-blur">
              <LogoRound src="/brand/logo-cosechadora.png" alt="CS" size={42} />
              <span className="text-xs font-semibold text-black/70">
                CS Technology
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTO */}
      <section id="producto" className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-3xl border border-black/10 bg-white/70 p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs text-black/50">Producto</p>
              <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
                Panel de control + automatización para tu operación
              </h2>
              <p className="mt-3 text-black/65">
                Centralizá indicadores, alertas y flujos. Menos “parches”, más sistema.
              </p>

              <div className="mt-6 grid gap-3">
                {[
                  "KPIs de producción y calidad en tiempo real",
                  "Alertas automáticas (WhatsApp / email)",
                  "Trazabilidad por lote / campaña / planta",
                  "Integración con ERP/CRM y sensores",
                ].map((x) => (
                  <div
                    key={x}
                    className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/70"
                  >
                    {x}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waLink}
                  className="inline-flex rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                  Pedir demo por WhatsApp
                </a>
                <a
                  href={mailLink}
                  className="inline-flex rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-black/[0.03]"
                >
                  Enviar email
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-yellow-300/10" />
              <div className="relative p-6">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Dashboard</div>
                    <div className="text-xs text-black/50">Hoy</div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {["Eficiencia", "Rendimiento", "Calidad", "Alertas"].map((k) => (
                      <div
                        key={k}
                        className="rounded-xl border border-black/10 bg-white px-3 py-4"
                      >
                        <div className="text-xs text-black/50">{k}</div>
                        <div className="mt-2 text-lg font-semibold text-emerald-700">
                          {Math.floor(70 + Math.random() * 25)}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <RssiLiveChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUCIONES */}
      <section id="soluciones" className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-3xl border border-black/10 bg-white/70 p-8 shadow-sm">
          <p className="text-xs text-black/50">CS Technology</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
            Soluciones principales
          </h2>
          <p className="mt-3 max-w-2xl text-black/65">
            Datos confiables, automatización y software robusto para agroindustria.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s, i) => (
              <motion.div
                key={s.title}
                className="group rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fade}
                custom={i}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {s.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm text-black/65">{s.desc}</p>
                <div className="mt-5 h-px w-full bg-black/10" />
                <p className="mt-4 text-xs text-black/45 group-hover:text-black/60">
                  Ver detalles →
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="mx-auto max-w-6xl px-5 pb-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { k: "Tiempo", v: "Procesos más rápidos y menos errores operativos." },
            { k: "Control", v: "KPIs claros y trazabilidad end-to-end." },
            { k: "Escala", v: "Infraestructura lista para crecer sin romperse." },
          ].map((b, i) => (
            <motion.div
              key={b.k}
              className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fade}
              custom={i}
            >
              <p className="text-sm text-black/60">{b.k}</p>
              <p className="mt-2 text-lg font-semibold">{b.v}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="mx-auto max-w-6xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/70 p-10 shadow-sm">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yellow-200/35 blur-[80px]" />

          <div className="relative">
            <h3 className="text-2xl font-semibold md:text-3xl">
              ¿Listo para modernizar tu operación?
            </h3>
            <p className="mt-3 max-w-2xl text-black/65">
              Contanos tu caso y te proponemos un plan rápido para automatizar, medir y escalar.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink}
                className="rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Contactar por WhatsApp
              </a>

              <a
                href={mailLink}
                className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-black/[0.03]"
              >
                Enviar email
              </a>
            </div>

            <p className="mt-4 text-xs text-black/45">
              WhatsApp: +{WHATSAPP_NUMBER} · Email: {EMAIL_TO}
            </p>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 text-xs text-black/50 md:flex-row">
          <p>© {new Date().getFullYear()} CS Technology</p>
          <div className="flex gap-4">
            <a className="hover:text-black" href="/#producto">
              Producto
            </a>
            <a className="hover:text-black" href="/#soluciones">
              Soluciones
            </a>
            <a className="hover:text-black" href="/#beneficios">
              Beneficios
            </a>
            <a className="hover:text-black" href="/#contacto">
              Contacto
            </a>
          </div>
        </footer>
      </section>
    </div>
  );
}
