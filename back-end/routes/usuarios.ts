import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest, verificaToken } from "../middlewares/verificatoken";
import { Response, Request } from "express";
const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_KEY || "segredo";
router.post("/register", async (req, res) => {
  const { email, nome, senha } = req.body;
  console.log(req.body);
  if (!email || !nome || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const emailExistente = await prisma.usuario.findUnique({ where: { email } });

    if (emailExistente) {
      return res.status(400).json({ error: "O email já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    await prisma.usuario.create({
      data: {
        email,
        nome,
        senha: hashedPassword,
      },
    });

    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  console.log(req.body); 

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email }, 
    });

    if (!usuario) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login." });
  }
});

router.get("/", verificaToken, async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nome: true,
      },
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
});

router.delete("/:id", verificaToken, async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Usuário deletado com sucesso.", usuario });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao deletar usuário." });
  }
});

router.get("/:id", verificaToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: { id: true, email: true, nome: true }, 
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
});
export default router;
