import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const estados = await prisma.estado.findFirst();
  const cidades = await prisma.cidade.findFirst();

  if (estados && cidades) {
    await prisma.postagem.updateMany({
      data: {
        estadoId: estados.id,
        cidadeId: cidades.id,
      },
    });
  } else {
    console.log("Não foi possível encontrar estados ou cidades.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
