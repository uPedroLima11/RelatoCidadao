import { Router, Request, Response } from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

const BASE_URL_ESTADOS = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
const BASE_URL_CIDADES = (estadoId: number) =>
  `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`;

const getEstadoPorId = async (estadoId: number) => {
  try {
    const { data } = await axios.get(BASE_URL_ESTADOS);
    const estado = data.find((estado: any) => estado.id === estadoId);
    return estado ? estado.nome : null;
  } catch (error) {
    console.error("Erro ao obter estado:", error instanceof Error ? error.message : error);
    return null;
  }
};

const getCidadePorId = async (estadoId: number, cidadeId: number) => {
  try {
    const { data } = await axios.get(BASE_URL_CIDADES(estadoId));
    const cidade = data.find((cidade: any) => cidade.id === cidadeId);
    return cidade ? cidade.nome : null;
  } catch (error) {
    console.error("Erro ao obter cidade:", error instanceof Error ? error.message : error);
    return null;
  }
};

router.get("/", async (req: Request, res: Response) => {
  const { estadoId, cidadeId } = req.query;

  try {
    const postagens = await prisma.postagem.findMany({
      where: {
        ...(estadoId ? { estadoId: Number(estadoId) } : {}),
        ...(cidadeId ? { cidadeId: Number(cidadeId) } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const postagensComNomes = await Promise.all(
      postagens.map(async (postagem) => {
        const estadoNome = await getEstadoPorId(postagem.estadoId);
        const cidadeNome = await getCidadePorId(postagem.estadoId, postagem.cidadeId);
        return {
          ...postagem,
          estadoNome: estadoNome || "Estado não encontrado",
          cidadeNome: cidadeNome || "Cidade não encontrada",
        };
      })
    );

    res.status(200).json(postagensComNomes);
  } catch (error) {
    console.error("Erro ao buscar postagens:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Erro ao buscar postagens." });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { titulo, email, descricao, localizacao, foto, estadoId, cidadeId, nome } = req.body;

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!isValidUrl(foto)) {
    return res.status(400).json({ error: "A URL da foto não é válida." });
  }

  try {
    const { data: estados } = await axios.get(BASE_URL_ESTADOS);
    const estadoExistente = estados.find((estado: any) => estado.id === estadoId);

    if (!estadoExistente) {
      return res.status(404).json({ error: "Estado não encontrado." });
    }

    const { data: cidades } = await axios.get(`${BASE_URL_ESTADOS}/${estadoId}/municipios`);
    const cidadeExistente = cidades.find((cidade: any) => cidade.id === cidadeId);

    if (!cidadeExistente) {
      return res.status(404).json({ error: "Cidade não encontrada no estado selecionado." });
    }

    const novaPostagem = await prisma.postagem.create({
      data: {
        titulo,
        email,
        descricao,
        localizacao,
        foto,
        estadoId,
        cidadeId,
        nome,
      },
    });

    res.status(201).json(novaPostagem);
  } catch (error) {
    console.error("Erro ao criar postagem:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Erro ao criar postagem." });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const postagem = await prisma.postagem.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(postagem);
  } catch (error) {
    console.error("Erro ao deletar postagem:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Erro ao deletar postagem." });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { titulo, email, descricao, localizacao, foto } = req.body;

  try {
    const postagem = await prisma.postagem.update({
      where: { id: Number(id) },
      data: { titulo, email, descricao, localizacao, foto },
    });
    res.status(200).json(postagem);
  } catch (error) {
    console.error("Erro ao atualizar postagem:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Erro ao atualizar postagem." });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const postagem = await prisma.postagem.findUnique({
      where: { id: Number(id) },
    });
    if (!postagem) {
      return res.status(404).json({ error: "Postagem não encontrada." });
    }

    const estadoNome = await getEstadoPorId(postagem.estadoId);
    const cidadeNome = await getCidadePorId(postagem.estadoId, postagem.cidadeId);

    res.status(200).json({
      ...postagem,
      estadoNome: estadoNome || "Estado não encontrado",
      cidadeNome: cidadeNome || "Cidade não encontrada",
    });
  } catch (error) {
    console.error("Erro ao buscar postagem:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Erro ao buscar postagem." });
  }
});

export default router;
