import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const estados = await prisma.estado.findMany();
  const cidades = await prisma.cidade.findMany();

 
  
  const postagens = await prisma.postagem.findMany();

  for (const postagem of postagens) {
    const estado = estados[0]; 
    const cidade = cidades[0]; 

    await prisma.postagem.update({
      where: { id: postagem.id },
      data: {
        estadoId: estado.id,
        cidadeId: cidade.id,
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
