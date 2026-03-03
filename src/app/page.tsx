import { prisma } from "@/lib/db";

const WHATSAPP_NUMBER = "5493513454027";

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default async function Home() {
  const product = await prisma.product.findFirst({
    where: { isActive: true },
  });

  // Fallback por si no hay producto activo en la DB
  const PRODUCT_NAME = product?.name ?? "TuberIQ One";
  const shortDesc =
    product?.shortDescription ??
    "Conteo y clasificación inteligente de tubérculos mediante visión artificial.";
  const description =
    product?.description ??
    "Diseñado para automatizar procesos en entornos productivos. Compatible con papa, batata, cebolla y productos similares.";

  const priceArs = product?.priceArs ?? 0;
  const priceUsdRef = product?.priceUsdRef ?? 0;

  const msgInfo = `Hola! Quiero información sobre ${PRODUCT_NAME} (contador y clasificador de tubérculos). ¿Precio, disponibilidad y tiempos de entrega?`;
  const msgQuote = `Hola! Quiero cotizar ${PRODUCT_NAME}. ¿Podemos coordinar una llamada o demo?`;

  return (
    <main className="bg-gray-950 text-white">
      {/* HERO */}
      <section
        id="producto"
        className="min-h-screen px-6 flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900"
      >
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm text-gray-400 tracking-widest uppercase mb-3">
              CS Technology
            </p>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              {PRODUCT_NAME}
            </h1>

            <p className="text-xl text-gray-300 mb-4">{shortDesc}</p>

            <p className="text-gray-400 mb-8">{description}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={waLink(msgInfo)}
                target="_blank"
                className="bg-green-500 hover:bg-green-600 transition px-8 py-3 rounded-lg font-semibold text-lg text-center"
              >
                Consultar por WhatsApp
              </a>

              <a
                href="#especificaciones"
                className="border border-gray-700 hover:border-gray-500 transition px-8 py-3 rounded-lg font-semibold text-lg text-center"
              >
                Ver especificaciones
              </a>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              * Precio en ARS + referencia en USD. Venta y soporte en Argentina.
            </div>
          </div>

          {/* Placeholder visual */}
          <div className="relative">
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
              <div className="text-sm text-gray-400 mb-2">
                Vista general (placeholder)
              </div>
              <div className="h-64 rounded-xl bg-gradient-to-br from-gray-800 to-gray-950 border border-gray-800 flex items-center justify-center text-gray-500">
                Imagen / render del equipo
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="h-20 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center text-xs text-gray-600">
                  Foto 1
                </div>
                <div className="h-20 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center text-xs text-gray-600">
                  Foto 2
                </div>
                <div className="h-20 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center text-xs text-gray-600">
                  Foto 3
                </div>
              </div>
            </div>

            <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
            <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-green-500/10 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="py-24 bg-gray-900 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Beneficios clave
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <h3 className="text-xl font-semibold mb-2 text-blue-300">
                Conteo automático
              </h3>
              <p className="text-gray-400">
                Reduce errores de conteo manual y mejora la velocidad de operación.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <h3 className="text-xl font-semibold mb-2 text-blue-300">
                Clasificación configurable
              </h3>
              <p className="text-gray-400">
                Separación por tamaño y criterios ajustables según tu proceso.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <h3 className="text-xl font-semibold mb-2 text-blue-300">
                Trazabilidad
              </h3>
              <p className="text-gray-400">
                Registro digital para control y análisis productivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-24 bg-gray-950 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Cómo funciona</h2>
            <p className="text-gray-400 mb-6">
              El sistema detecta el paso de cada unidad y aplica un modelo de visión
              artificial para estimar categoría (por ejemplo, tamaño/calidad). La salida
              puede configurarse según el criterio de clasificación.
            </p>

            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-green-400">■</span>
                <span>Captura y detección en tiempo real</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400">■</span>
                <span>Clasificación por categorías configurables</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400">■</span>
                <span>Registro de datos para seguimiento operativo</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="text-xl font-semibold mb-4">Casos de uso</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <div className="text-sm text-gray-400">Empaque</div>
                <div className="text-gray-200 font-semibold">Conteo por caja/lote</div>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <div className="text-sm text-gray-400">Selección</div>
                <div className="text-gray-200 font-semibold">Clasificación por tamaño</div>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <div className="text-sm text-gray-400">Control</div>
                <div className="text-gray-200 font-semibold">Auditoría y trazabilidad</div>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <div className="text-sm text-gray-400">Escalado</div>
                <div className="text-gray-200 font-semibold">Adaptación a línea</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESPECIFICACIONES */}
      <section id="especificaciones" className="py-24 bg-gray-900 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Especificaciones (preliminares)
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <h3 className="text-xl font-semibold mb-4">Hardware</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Integración a cinta/línea existente (según instalación)</li>
                <li>• Sensores y cámara (según configuración)</li>
                <li>• Actuación para desvío/clasificación (opcional)</li>
                <li>• Diseño modular para mantenimiento</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <h3 className="text-xl font-semibold mb-4">Software</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Clasificación por categorías configurables</li>
                <li>• Registro de conteo por lote/caja</li>
                <li>• Exportación de datos (a definir según instalación)</li>
                <li>• Roadmap: panel de configuración web</li>
              </ul>
            </div>
          </div>

          {/* Precio (DINÁMICO DESDE DB) */}
          <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold">Precio</h3>
                <p className="text-gray-400 mt-2">
                  ARS (venta local) + referencia en USD. La cotización final depende de
                  instalación y configuración.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-4">
                  <div className="text-sm text-gray-400">Desde</div>
                  <div className="text-xl font-bold">
                    $ {priceArs.toLocaleString("es-AR")} ARS
                  </div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-4">
                  <div className="text-sm text-gray-400">Ref.</div>
                  <div className="text-xl font-bold">USD {priceUsdRef}</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={waLink(msgQuote)}
                target="_blank"
                className="inline-block bg-blue-500 hover:bg-blue-600 transition px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Pedir cotización
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-24 text-center px-6 bg-gray-950">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          ¿Querés coordinar una demo?
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Escribinos y te pasamos opciones de configuración, tiempos de entrega y una
          propuesta según tu línea.
        </p>

        <a
          href={waLink(msgInfo)}
          target="_blank"
          className="bg-green-500 hover:bg-green-600 transition px-10 py-4 rounded-lg font-semibold text-lg"
        >
          Hablar por WhatsApp
        </a>

        <div className="mt-10 text-sm text-gray-600">
          © {new Date().getFullYear()} CS Technology. Todos los derechos reservados.
        </div>
      </section>
    </main>
  );
}