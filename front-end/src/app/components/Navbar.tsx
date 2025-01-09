"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface NavbarProps {
  onFiltrar: (estadoId: number | null, cidadeId: number | null) => void;
  onRemoverFiltro: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onFiltrar, onRemoverFiltro }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [estados, setEstados] = useState<{ id: number; nome: string }[]>([]);
  const [cidades, setCidades] = useState<{ id: number; nome: string }[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState<number | null>(null);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<number | null>(null);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/estados`);
        setEstados(response.data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    if (estadoSelecionado !== null) {
      const fetchCidades = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_URL_API}/estados/${estadoSelecionado}/cidades`
          );
          setCidades(response.data);
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
        }
      };
      fetchCidades();
    } else {
      setCidades([]);
    }
  }, [estadoSelecionado]);

  const handleFiltrar = () => {
    if (estadoSelecionado !== null && cidadeSelecionada !== null) {
      onFiltrar(estadoSelecionado, cidadeSelecionada);
    }
  };

  const handleRemoverFiltro = () => {
    setEstadoSelecionado(null);
    setCidadeSelecionada(null);
    onRemoverFiltro();
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          Relato Cidadão
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div>
              <select
                className="bg-gray-700 text-white p-2 rounded"
                value={estadoSelecionado || ""}
                onChange={(e) => setEstadoSelecionado(Number(e.target.value) || null)}
              >
                <option value="">Selecione um estado</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nome}
                  </option>
                ))}
              </select>
              <select
                className="bg-gray-700 text-white p-2 rounded ml-2"
                value={cidadeSelecionada || ""}
                onChange={(e) => setCidadeSelecionada(Number(e.target.value) || null)}
                disabled={!estadoSelecionado}
              >
                <option value="">Selecione uma cidade</option>
                {cidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
              {estadoSelecionado !== null && cidadeSelecionada !== null && (
                <button
                  onClick={handleFiltrar}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl ml-2"
                >
                  Filtrar
                </button>
              )}
              {(estadoSelecionado !== null || cidadeSelecionada !== null) && (
                <button
                  onClick={handleRemoverFiltro}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl ml-2"
                >
                  Remover Filtro
                </button>
              )}
            </div>
            <span className="text-white">
              Bem-vindo, {user?.nomeCompleto.split(' ')[0]}!
            </span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-xl"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-white">
              Login
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded">
              Registrar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
