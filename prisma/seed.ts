import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const slug = "tuberiq-one";

  const exists = await prisma.product.findUnique({ where: { slug } });

  if (!exists) {
    await prisma.product.create({
      data: {
        name: "TuberIQ One",
        slug,
        shortDescription:
          "Conteo y clasificación inteligente de tubérculos mediante visión artificial.",
        description:
          "Sistema diseñado para automatizar procesos en entornos productivos. Compatible con papa, batata, cebolla y productos similares. Configuración según línea e instalación.",
        priceArs: 0,
        priceUsdRef: 0,
        isActive: true,
      },
    });

    console.log("Seed OK: producto creado");
  } else {
    console.log("Seed OK: producto ya existía");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });