import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface TokenPayload {
  id: number;
  email: string;
  nome: string;
}


export interface AuthenticatedRequest extends Request {
  usuario?: {
    id: number;
    email: string;
    nome: string;
  };
}


export function verificaToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não informado" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as TokenPayload;

    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      nome: decoded.nome,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
