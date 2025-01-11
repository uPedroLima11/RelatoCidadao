"use client";

import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/navigation"; 

export default function Login() {
  const { login } = useAuth();
  const router = useRouter(); 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [continuarConectado, setContinuarConectado] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, senha, continuarConectado);
      router.push("/pagina-logada"); 
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Falha no login. Verifique suas credenciais.");
      } else {
        setErrorMessage("Falha no login. Verifique suas credenciais.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4">Login</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Senha:</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label>
            <input
              type="checkbox"
              checked={continuarConectado}
              onChange={() => setContinuarConectado(!continuarConectado)}
            />{" "}
            Continuar conectado
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

