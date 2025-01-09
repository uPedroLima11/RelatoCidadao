import { Router, Request, Response } from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest, verificaToken } from "../middlewares/verificatoken"
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

router.post("/", verificaToken, async (req: AuthenticatedRequest, res: Response) => {
  const { titulo, descricao, localizacao, foto, estadoId, cidadeId } = req.body;

  if (!req.usuario) {
    return res.status(400).json({ error: "Usuário não autenticado." });
  }

  try {
    const novaPostagem = await prisma.postagem.create({
      data: {
        titulo,
        descricao,
        localizacao,
        foto,
        estadoId,
        cidadeId,
        usuarioId: req.usuario.id,
      },
    });

    res.status(201).json(novaPostagem);
  } catch (error) {
    console.error("Erro ao criar postagem:", error);
    res.status(500).json({ error: "Erro ao criar postagem." });
  }
});


router.delete("/:id", verificaToken, async (req: AuthenticatedRequest, res: Response) => {
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

router.put("/:id", verificaToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { titulo, descricao, localizacao, foto } = req.body;

  try {
    const postagem = await prisma.postagem.update({
      where: { id: Number(id) },
      data: { titulo, descricao, localizacao, foto },
    });
    res.status(200).json(postagem);
  } catch (error) {
    console.error("Erro ao atualizar postagem:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Erro ao atualizar postagem." });
  }
});

router.get("/:id", verificaToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const postagem = await prisma.postagem.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: true, 
      },
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
      email: postagem.usuario.email, 
      nome: postagem.usuario.nome,    
    });
  } catch (error) {
    console.error("Erro ao buscar postagem:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Erro ao buscar postagem." });
  }
});


export default router;
