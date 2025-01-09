"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface User {
  nomeCompleto: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string, continuarConectado: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token_usuario_logado");
    const nomeCompleto = Cookies.get("nomeCompleto");
    if (token && nomeCompleto) {
      setUser({ nomeCompleto, token });
    }
  }, []);

  const login = async (email: string, senha: string, continuarConectado: boolean) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/usuarios/login`, { email, senha });

      if (response.status === 200) {
        const { token, usuario } = response.data;

        Cookies.set("token_usuario_logado", token);
        Cookies.set("nomeCompleto", usuario.nome);

        if (continuarConectado) {
          localStorage.setItem("client_key", JSON.stringify(usuario.id));
        } else {
          localStorage.removeItem("client_key");
        }

        setUser({ nomeCompleto: usuario.nome, token });

        router.push("/logado");
        alert("Login efetuado com sucesso!");
      } else {
        alert("Credenciais inválidas. Verifique e tente novamente.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro no login. Tente novamente mais tarde.");
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("token_usuario_logado");
    Cookies.remove("nomeCompleto");
    localStorage.removeItem("client_key");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
