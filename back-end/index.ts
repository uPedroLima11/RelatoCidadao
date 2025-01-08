import express from "express";
import cors from "cors";
import estadosRoutes from "./routes/estados";
import postagensRoutes from "./routes/postagens";
const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());
app.use("/estados", estadosRoutes);
app.use("/postagens", postagensRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
