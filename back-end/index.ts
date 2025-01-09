import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuariosRoutes from "./routes/usuarios";
import postagensRoutes from "./routes/postagens";
import estadosRoutes from "./routes/estados";

dotenv.config();

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());
app.use("/usuarios", usuariosRoutes);
app.use("/postagens", postagensRoutes);
app.use("/estados", estadosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
