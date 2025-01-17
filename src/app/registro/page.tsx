"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthContext";

export default function Registro() {
  const { register, setToken } = useAuth();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showRequirementsAlert, setShowRequirementsAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowRequirementsAlert(false);
    setErrorMessage("");

    if (senha.length < 10 || !/[a-z]/.test(senha) || !/[!@#?]/.test(senha)) {
      setShowRequirementsAlert(true);
      return;
    }

    try {
      const response = await register(nome, email, senha);
      const token = response.token;
      setToken(token);
      setIsModalVisible(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro inesperado. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Registro</h2>

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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Registrar
        </button>

        {errorMessage && (
          <div className="mt-4 text-red-500">{errorMessage}</div>
        )}

        {showRequirementsAlert && (
          <div
            className="flex p-4 mb-4 mt-5 text-sm text-white rounded-lg bg-red-50 dark:bg-gray-800"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Danger</span>
            <div>
              <span className="font-medium">
                Certifique-se de que esses requisitos sejam atendidos:
              </span>
              <ul className="mt-1.5 list-disc list-inside">
                <li>Pelo menos 10 caracteres (e até 100 caracteres)</li>
                <li>Pelo menos um caractere minúsculo</li>
                <li>
                  Inclusão de pelo menos um caractere especial, e.g., ! @ # ?
                </li>
              </ul>
            </div>
          </div>
        )}

        {isModalVisible && (
          <div
            id="popup-modal"
            tabIndex={-1}
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
          >
            <div className="relative p-4 w-full max-w-md">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    setIsModalVisible(false);
                    router.push("/pagina-logada");
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 text-center">
                  <svg
                    className="mx-auto mb-4 text-green-500 w-12 h-12 dark:text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 1a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm3.54 6.54L9 12.08l-2.04-2.04"
                    />
                  </svg>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Cadastro concluído com sucesso! Seja bem vindo
                  </h3>
                  <button
                    type="button"
                    className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={() => {
                      setIsModalVisible(false);
                      router.push("/pagina-logada", { scroll: false }); 
                    }}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
