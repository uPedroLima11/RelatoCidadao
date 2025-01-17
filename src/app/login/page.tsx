"use client";

import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/navigation";

const Modal = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-md text-center w-96">
      <h2 className="text-xl font-bold mb-4">Sucesso!</h2>
      <p className="mb-4">{message}</p>
      <button
        onClick={onClose}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Fechar
      </button>
    </div>
  </div>
);

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [continuarConectado, setContinuarConectado] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); 

    try {
      const loginSuccess = await login(email, senha, continuarConectado);

      if (loginSuccess) {
        setSuccessMessage(`Login feito com sucesso, seja bem-vindo(a)!`);
      } else {
        setErrorMessage("Falha no login. Verifique suas credenciais.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Falha no login. Verifique suas credenciais.");
      } else {
        setErrorMessage("Falha no login. Verifique suas credenciais.");
      }
    }
  };

  const handleCloseModal = () => {
    setSuccessMessage(null); 
    router.push("/pagina-logada", { scroll: false }); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {successMessage && (
        <Modal
          message={successMessage}
          onClose={handleCloseModal} 
        />
      )}
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
}
