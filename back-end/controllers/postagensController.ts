import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPostagens = async (req: Request, res: Response) => {
  const { estadoId, cidadeId } = req.query;

  try {
    let postagens = await prisma.postagem.findMany();

    if (estadoId) {
      postagens = postagens.filter((post) => post.estadoId === Number(estadoId));
    }
    if (cidadeId) {
      postagens = postagens.filter((post) => post.cidadeId === Number(cidadeId));
    }

    res.json(postagens);
  } catch (error) {
    console.error("Erro ao buscar postagens:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Erro ao buscar postagens." });
  }
};
