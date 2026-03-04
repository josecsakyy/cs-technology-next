"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: "easeOut" },
  }),
};

const solutions = [
  {
    title: "AI & Automatización",
    desc: "Agentes, RAG, visión artificial y flujos inteligentes para agroindustria.",
    badge: "IA",
  },
  {
    title: "Trazabilidad & Datos",
    desc: "Dashboards, KPIs y gobierno de datos para producción y logística.",
    badge: "DATA",
  },
  {
    title: "IoT & Sensores",
    desc: "Telemetría, monitoreo y alertas en tiempo real.",
    badge: "IOT",
  },
  {
    title: "Software a Medida",
    desc: "Webs, paneles admin y APIs escalables para tu operación.",
    badge: "DEV",
  },
  {
    title: "Integraciones",
    desc: "Conectamos ERPs, CRMs, WhatsApp, pagos y más.",
    badge: "API",
  },
  {
    title: "Calidad & QA",
    desc: "Automatización de tests y mejora continua del producto.",
    badge: "QA",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060B14] text-white">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-yellow-400/10 blur-[120px]" />
        <div className="absolute top-1/3 left-0 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060B14]/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo-completo.png"
              alt="CS Technology"
              width={170}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex text-sm text-white/80">
            <a href="#soluciones" className="hover:text-white">
              Soluciones
            </a>
            <a href="#beneficios" className="hover:text-white">
              Beneficios
            </a>
            <a href="#contacto" className="hover:text-white">
              Contacto
            </a>
            <Link
              href="/admin/login"
              className="rounded-xl border border-white/15 px-4 py-2 hover:border-white/30"
            >
              Admin
            </Link>
          </nav>

          <a
            href="#contacto"
            className="md:hidden rounded-xl bg-white text-black px-4 py-2 font-medium"
          >
            Contacto
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-10 md:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <motion.p
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Agroindustria + Tecnología • CS Technology
            </motion.p>

            <motion.h1
              className="mt-5 text-4xl font-semibold leading-tight md:text-5xl"
              initial="hidden"
              animate="visible"
              variants={fadeUpItem}
              custom={1}
            >
              Automatizá, medí y escalá tu operación con{" "}
              <span className="text-emerald-300">IA</span> y{" "}
              <span className="text-yellow-300">datos</span>.
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-white/70"
              initial="hidden"
              animate="visible"
              variants={fadeUpItem}
              custom={2}
            >
              Construimos software, analítica e integraciones para agroindustria: desde
              trazabilidad y paneles de control, hasta automatización con agentes.
            </motion.p>

            <motion.div
              className="mt-7 flex flex-col gap-3 sm:flex-row"
              initial="hidden"
              animate="visible"
              variants={fadeUpItem}
              custom={3}
            >
              <a
                href="#contacto"
                className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
              >
                Hablar con CS
              </a>
              <a
                href="#soluciones"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:border-white/30"
              >
                Ver soluciones
              </a>
            </motion.div>

            {/* Powered by strip */}
            <motion.div
              className="mt-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-xs text-white/50">Tecnologías que usamos</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {["OpenAI", "PostgreSQL", "Vercel", "Neon", "Next.js", "Node.js"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Hero image card */}
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-yellow-400/10" />

            <Image
              src="/brand/hero-papas.png"
              alt="Agroindustria"
              width={1100}
              height={900}
              className="h-[420px] w-full object-cover"
              priority
            />

            {/* Decorative logo watermark */}
            <div className="absolute bottom-4 right-4 rounded-2xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur">
              <Image
                src="/brand/logo-cosechadora.png"
                alt="CS"
                width={120}
                height={50}
                className="h-7 w-auto"
              />
            </div>

            {/* subtle shine line */}
            <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm" />
          </motion.div>
        </div>
      </section>

      {/* SOLUCIONES */}
      <section id="soluciones" className="mx-auto max-w-6xl px-5 py-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs text-white/50">CS Technology</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Soluciones principales</h2>
          <p className="mt-3 max-w-2xl text-white/65">
            Un stack moderno para agro: datos confiables, automatización y software robusto.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-white/20 hover:bg-white/10 transition"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUpItem}
              custom={i}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
                  {s.badge}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/65">{s.desc}</p>
              <div className="mt-5 h-px w-full bg-white/10" />
              <p className="mt-4 text-xs text-white/45 group-hover:text-white/60">
                Ver detalles →
              </p>
            </motion.div>
          ))}
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
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUpItem}
              custom={i}
            >
              <p className="text-sm text-white/60">{b.k}</p>
              <p className="mt-2 text-lg font-semibold">{b.v}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="mx-auto max-w-6xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-[80px]" />

          <div className="relative">
            <h3 className="text-2xl font-semibold md:text-3xl">
              ¿Listo para modernizar tu operación?
            </h3>
            <p className="mt-3 max-w-2xl text-white/70">
              Contanos tu caso y te proponemos un plan (rápido) para automatizar, medir y escalar.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/"
                className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
              >
                Contactar por WhatsApp
              </a>

              <a
                href="mailto:contacto@cstechnology.com.ar"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:border-white/30"
              >
                Enviar email
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} CS Technology</p>
          <div className="flex gap-4">
            <a className="hover:text-white" href="#soluciones">
              Soluciones
            </a>
            <a className="hover:text-white" href="#beneficios">
              Beneficios
            </a>
            <a className="hover:text-white" href="#contacto">
              Contacto
            </a>
          </div>
        </footer>
      </section>
    </div>
  );
}