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
  isLoading: boolean;
  login: (email: string, senha: string, continuarConectado: boolean) => Promise<boolean>; 
  register: (nome: string, email: string, senha: string) => Promise<User>;
  logout: () => void;
  setToken: (token: string) => void;
  refreshToken: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token_usuario_logado");
    const nomeCompleto = Cookies.get("nomeCompleto");

    if (token && nomeCompleto) {
      setUser({ nomeCompleto, token });
    }

    setIsLoading(false);
  }, []);

  const setToken = (token: string) => {
    if (user) {
      const updatedUser = { ...user, token };
      setUser(updatedUser);
      Cookies.set("token_usuario_logado", token);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/auth/refresh`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
  
      const { token } = response.data;
      if (token) {
        setToken(token);
        return; 
      } else {
        throw new Error("Erro ao renovar o token");
      }
    } catch (error) {
      console.error("Erro ao renovar o token:", error);
      logout();
      return; 
    }
  };
  

  const login = async (email: string, senha: string, continuarConectado: boolean): Promise<boolean> => {
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
        return true; 
      } else {
        throw new Error("Credenciais inválidas. Verifique e tente novamente.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw new Error("Erro no login. Verifique suas credenciais ou tente novamente mais tarde.");
    }
  };
  
  
  const register = async (nome: string, email: string, senha: string): Promise<User> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/usuarios/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao registrar.");
      }
  
      const data = await response.json();
      const { token, usuario } = data;
  
      if (usuario && usuario.nome) {
        Cookies.set("token_usuario_logado", token);
        Cookies.set("nomeCompleto", usuario.nome);
        setUser({ nomeCompleto: usuario.nome, token });
        return { nomeCompleto: usuario.nome, token };
      } else {
        throw new Error("Usuário não retornado na resposta.");
      }
    } catch (error: any) {
      console.error("Erro no registro:", error.message);
      throw new Error(error.message || "Erro no registro. Tente novamente mais tarde.");
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
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setToken,
        refreshToken,
      }}
    >
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
