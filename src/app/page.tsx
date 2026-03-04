"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "5493513454027";
const WHATSAPP_MESSAGE =
  "Hola! Quiero información sobre CS Technology. Me interesa automatización / datos para agroindustria.";

const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

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
    desc: "Telemetría, monitoreo y alertas. Integración con hardware y servicios en tiempo real.",
    tag: "IOT",
  },
  {
    title: "Software a medida",
    desc: "Webs, paneles admin, APIs y herramientas internas que se adaptan a tu operación.",
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

function LogoRound({
  src,
  alt,
  size = 44,
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
  // Fondo claro con: blobs animados + grilla sutil + partículas suaves
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {/* Base */}
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
      <motion.div
        className="absolute top-[25%] -right-40 h-[420px] w-[420px] rounded-full bg-lime-200/35 blur-[100px]"
        animate={{ x: [0, -18, 0], y: [0, 18, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Partículas suaves */}
      <div className="absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            // eslint-disable-next-line react/no-array-index-key
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

export default function Home() {
  return (
    <div className="min-h-screen text-[#0b1220]">
      <BackgroundFX />

      {/* NAVBAR */}
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <LogoRound src="/brand/logo-cosechadora.png" alt="CS" size={44} />
            <div className="leading-tight">
              <div className="font-semibold text-[15px]">
                CS <span className="text-emerald-700">Technology</span>
              </div>
              <div className="text-[12px] text-black/55">
                Agroindustria + Software + IA
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex text-sm text-black/70">
            <a href="#soluciones" className="hover:text-black">
              Soluciones
            </a>
            <a href="#beneficios" className="hover:text-black">
              Beneficios
            </a>
            <a href="#contacto" className="hover:text-black">
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
            href="#contacto"
            className="md:hidden rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
          >
            Contacto
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-10 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Texto */}
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
                href="#soluciones"
                className="rounded-2xl border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-black hover:bg-black/[0.03]"
              >
                Ver soluciones
              </a>
            </motion.div>

            {/* Tira tech */}
            <motion.div
              className="mt-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fade}
              custom={0}
            >
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
            </motion.div>
          </div>

          {/* Imagen: sin cortar */}
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* overlay suave */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-yellow-300/10" />

            {/* IMPORTANTE: object-contain para que NO corte */}
            <div className="relative h-[420px] w-full">
              <Image
                src="/brand/hero-papas.png"
                alt="Agroindustria"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* marca en esquina */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl border border-black/10 bg-white/75 px-3 py-2 backdrop-blur">
              <LogoRound src="/brand/logo-cosechadora.png" alt="CS" size={30} />
              <span className="text-xs font-semibold text-black/70">
                CS Technology
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOLUCIONES (con “cambio suave de área” pero claro) */}
      <section
        id="soluciones"
        className="mx-auto max-w-6xl px-5 py-14"
      >
        <div className="rounded-3xl border border-black/10 bg-white/70 p-8 shadow-sm">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fade}
            custom={0}
          >
            <p className="text-xs text-black/50">CS Technology</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
              Soluciones principales
            </h2>
            <p className="mt-3 max-w-2xl text-black/65">
              Un stack moderno para agro: datos confiables, automatización y software robusto.
            </p>
          </motion.div>

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
      <section id="beneficios" className="mx-auto max-w-6xl px-5 pb-14">
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
                href="mailto:contacto@cstechnology.com.ar"
                className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-black/[0.03]"
              >
                Enviar email
              </a>
            </div>

            <p className="mt-4 text-xs text-black/45">
              WhatsApp: +{WHATSAPP_NUMBER}
            </p>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 text-xs text-black/50 md:flex-row">
          <p>© {new Date().getFullYear()} CS Technology</p>
          <div className="flex gap-4">
            <a className="hover:text-black" href="#soluciones">
              Soluciones
            </a>
            <a className="hover:text-black" href="#beneficios">
              Beneficios
            </a>
            <a className="hover:text-black" href="#contacto">
              Contacto
            </a>
          </div>
        </footer>
      </section>
    </div>
  );
}