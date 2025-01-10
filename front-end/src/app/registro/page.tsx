"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { useAuth } from "../components/AuthContext"; 

const RegisterPage: React.FC = () => {
  const { register, setToken } = useAuth(); 
  const router = useRouter(); 
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); 
    setSuccessMessage(""); 
    try {
      const response = await register(nome, email, senha); 
      const token = response.token; 
      setToken(token);
      setSuccessMessage(`Registro feito com sucesso, seja bem-vindo ${response.nomeCompleto}.`); 
      router.push("/pagina-logada");
    } catch (error: any) {
      setErrorMessage("Erro ao cadastrar-se."); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4">Registro</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}
        {successMessage && ( 
          <div className="mb-4 text-green-500">
            {successMessage}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Nome:</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
