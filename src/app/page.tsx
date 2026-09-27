"use client";

import Image from "next/image";
import CounterPreview from "./CounterPreview";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";

const WHATSAPP_NUMBER = "5493513454027";
const WHATSAPP_MESSAGE =
  "Hola! Quiero información sobre CS Technology. Quiero asesoramiento sobre automatización industrial, IA o IoT para mi operación.";
const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

const EMAIL_TO = "createsolutionsarg@gmail.com";
const EMAIL_SUBJECT = "Interesado en CS Technology";
const EMAIL_BODY =
  "Hola, quiero conversar sobre un proyecto con CS Technology.\n\nMi nombre es:\nEmpresa:\nTeléfono:\nMensaje:\n";
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
  { title: "Inteligencia artificial", desc: "Aplicamos IA a problemas concretos de producción: interpretar imágenes, reconocer patrones y asistir tareas operativas.", tag: "IA" },
  { title: "Procesamiento de imágenes", desc: "Transformamos imágenes de cámaras en información útil para detectar, contar e inspeccionar productos.", tag: "VISIÓN" },
  { title: "Soluciones IoT", desc: "Conectamos sensores y equipos para conocer las condiciones de la operación y reunir sus mediciones.", tag: "IoT" },
  { title: "Automatización industrial y PLC", desc: "Integración y programación de PLC para automatizar secuencias, coordinar equipos y reducir intervenciones manuales en tu proceso.", tag: "PLC" },
  { title: "Monitoreo", desc: "Diseñamos herramientas para visualizar variables, seguir el estado de los equipos y detectar desvíos.", tag: "DATOS" },
  { title: "Sensores industriales", desc: "Selección e integración de sensores para medir variables del proceso y detectar presencia, posición o condiciones de operación.", tag: "CAMPO" },
];


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
    <div aria-hidden="true" className="home-background">
      <div className="home-grid" />
      <div className="home-glow home-glow-green" />
      <div className="home-glow home-glow-gold" />
      <div className="home-glow home-glow-teal" />
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} className="home-particle" style={{ left: ((i * 17 + 8) % 100) + "%", top: ((i * 23 + 12) % 100) + "%", animationDelay: (-i * 1.3) + "s" }} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
    <div className="relative isolate min-h-screen text-[#0b1220]">
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
                IA · Agroindustria · Industria
              </div>
            </div>
          </Link>

          {/* IMPORTANTE: /#... para historial (Atrás vuelve) */}
          <nav className="hidden items-center gap-7 md:flex text-sm text-black/70">
            <a href="#producto" className="hover:text-black">
              Proyectos
            </a>
            <a href="#soluciones" className="hover:text-black">
              Soluciones
            </a>
            <a href="#beneficios" className="hover:text-black">
              Beneficios
            </a>
            <a href="#contacto" className="hover:text-black">
              Contacto
            </a>
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
              Inteligencia aplicada a la producción
            </motion.div>

            <motion.h1
              className="mt-5 text-4xl font-semibold leading-tight md:text-5xl"
              initial="hidden"
              animate="visible"
              variants={fade}
              custom={1}
            >
              Automatizá, medí y escalá tu operación con <span className="text-emerald-700">IA</span> y <span className="text-yellow-600">datos</span>.
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-black/65"
              initial="hidden"
              animate="visible"
              variants={fade}
              custom={2}
            >
              Integramos automatización industrial, PLC, sensores y visión artificial para que tengas más control sobre tu producción. Combinamos equipos, conectividad e inteligencia artificial en soluciones a medida para agroindustria e industria.
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
                Impulsá tu próximo proyecto
              </a>
              <a
                href="#producto"
                className="rounded-2xl border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-black hover:bg-black/[0.03]"
              >
                Explorar proyectos
              </a>
            </motion.div>
          </div>

          {/* IMAGEN HERO */}
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-yellow-300/10" />
            <div className="relative aspect-[4/5] max-h-[580px] w-full">
              <Image
                src="/brand/equipo-invernadero.png"
                alt="Equipo en un invernadero"
                fill
                className="object-cover object-center" sizes="(max-width: 768px) 100vw, 560px"
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
      <section id="producto" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-10">
        <div className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Uno de nuestros proyectos · En desarrollo</p>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Del conteo automático al control de producción</h2>
              <p className="mt-4 leading-relaxed text-black/65">Nuestro contador de minitubérculos combina visión artificial con un panel de seguimiento. Detecta unidades en la línea y permite consultar registros por orden y descargar la información en Excel.</p>
            </div>
            <a href={waLink} className="inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Consultar por esta solución</a>
          </div>
          <div className="mt-7 grid min-w-0 gap-5 lg:grid-cols-[1.2fr_1fr]">
            <figure className="min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs text-emerald-800"><span className="font-semibold tracking-widest">VISIÓN ARTIFICIAL EN ACCIÓN</span><span>Captura del contador funcionando</span></div>
              <Image src="/brand/contador-funcionando.png" alt="Contador de minitubérculos funcionando: detecciones de IA y líneas de conteo y verificación sobre la cinta" width={1169} height={647} sizes="(max-width: 1024px) 100vw, 610px" className="h-auto w-full" />
              <figcaption className="px-5 py-5 text-sm leading-relaxed text-black/65">Detección de cada unidad y seguimiento sobre la línea de producción. Una aplicación concreta de IA al trabajo en planta.</figcaption>
            </figure>
            <CounterPreview />
          </div>
        </div>
      </section>
      {/* SOLUCIONES */}
      <section id="soluciones" className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-3xl border border-black/10 bg-white/70 p-8 shadow-sm">
          <p className="text-xs text-black/50">CS Technology</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
            Tecnología que trabaja en tu producción
          </h2>
          <p className="mt-3 max-w-2xl text-black/65">
            Desde los sensores en campo hasta el control con PLC y el análisis con IA: integramos cada parte según las necesidades de tu proceso.
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
                <a href={waLink} className="mt-4 inline-block text-xs font-semibold text-emerald-800 hover:underline">Consultar sobre {s.title.toLowerCase()}</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="mx-auto max-w-6xl px-5 pb-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { k: "Automatización", v: "Menos tareas manuales y más atención al proceso productivo." },
            { k: "Visibilidad", v: "Imágenes y mediciones para comprender lo que pasa en tu operación." },
            { k: "Integración", v: "PLC, sensores, cámaras y software integrados a tu operación." },
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
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm md:p-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yellow-200/35 blur-[80px]" />

          <div className="relative">
            <h3 className="text-2xl font-semibold md:text-3xl">
              ¿Listo para modernizar tu operación?
            </h3>
            <p className="mt-3 max-w-2xl text-black/65">
              Contanos cómo trabajás y qué querés mejorar. Evaluamos tu proceso y definimos una propuesta con los equipos, la automatización y las herramientas de monitoreo que necesitás.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink}
                className="rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Hablemos de tu proyecto
              </a>

              <a
                href={mailLink}
                className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-black/[0.03]"
              >
                Enviar email
              </a>
            </div>

            <p className="mt-4 break-words text-xs text-black/60">
              WhatsApp: +{WHATSAPP_NUMBER} · Email: {EMAIL_TO}
            </p>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 text-xs text-black/50 md:flex-row">
          <p>© {new Date().getFullYear()} CS Technology</p>
          <div className="flex gap-4">
            <a className="hover:text-black" href="#producto">
              Proyectos
            </a>
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
        <section aria-label="Colaboración con Agroplant" className="mt-10 flex flex-col items-center gap-5 border-t border-emerald-900/10 py-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">En colaboración con</p>
          <Image src="/brand/agroplant.png" alt="Logo de Agroplant: Agricultura para el futuro" width={112} height={112} sizes="112px" className="h-28 w-28 rounded-full bg-white object-contain" />
          <h2 className="text-xl font-semibold text-[#0b1220]">Agroplant</h2>
        </section>
      </section>
    </div>
    </MotionConfig>
  );
}
