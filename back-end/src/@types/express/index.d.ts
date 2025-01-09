import * as express from "express";

declare global {
  namespace Express {
    interface Request {
     testeProp?: string; 
      usuario: {
        id: number;
        email: string;
        nome: string;
      };
    }
  }
}
