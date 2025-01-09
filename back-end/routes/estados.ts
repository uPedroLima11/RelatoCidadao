import express from "express";
import { getEstados, getCidadesPorEstado } from "../src/services/apiIBGE";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const estados = await getEstados();
    res.json(estados);
  } catch (error) {
    console.error("Erro ao buscar estados:", error);
    res.status(500).json({ error: "Erro ao buscar estados." });
  }
});

router.get("/:siglaEstado/cidades", async (req, res) => {
  const { siglaEstado } = req.params;

  try {
    const cidades = await getCidadesPorEstado(siglaEstado);
    res.json(cidades);
  } catch (error) {
    console.error(`Erro ao buscar cidades do estado ${siglaEstado}:`, error);
    res.status(500).json({ error: "Erro ao buscar cidades." });
  }
});

router.get("/:id/cidades", async (req, res) => {
  const { id } = req.params;

  try {
    const cidades = await getCidadesPorEstado(id); 
    res.json(cidades);
  } catch (error) {
    console.error(`Erro ao buscar cidades do estado ${id}:`, error);
    res.status(500).json({ error: "Erro ao buscar cidades." });
  }
});

export default router;
