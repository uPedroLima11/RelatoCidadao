"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface Estado {
  id: number;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
}

interface NavbarProps {
  onFiltrar: (estadoId: number | null, cidadeId: number | null) => void;
  onRemoverFiltro: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onFiltrar, onRemoverFiltro }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState<number | null>(null);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get<Estado[]>(`${process.env.NEXT_PUBLIC_URL_API}/estados`);
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
          const response = await axios.get<Cidade[]>(
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-[1.3rem] font-bold ml-4">
          Relato Cidadão
        </Link>
        <button onClick={toggleMenu} className="text-white md:hidden">
          {isMenuOpen ? "Fechar" : "Menu"}
        </button>
      </div>
      <div className={`flex-col md:flex md:flex-row md:items-center ${isMenuOpen ? "flex" : "hidden"} md:flex`}>
        {isAuthenticated ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-center space-y-2 md:space-y-0 md:space-x-20 w-full">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex space-x-4">
                <select
                  className="bg-gray-700 text-white p-2 rounded-mb-2 md:mb-0 "
                  value={estadoSelecionado || ""}
                  onChange={(e) => setEstadoSelecionado(Number(e.target.value) || null)}
                >
                  <option value="">Estado</option>
                  {estados.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.nome}
                    </option>
                  ))}
                </select>
                <select
                  className="bg-gray-700 text-white p-2 rounded "
                  value={cidadeSelecionada || ""}
                  onChange={(e) => setCidadeSelecionada(Number(e.target.value) || null)}
                  disabled={!estadoSelecionado}
                >
                  <option value="">Cidade</option>
                  {cidades.map((cidade) => (
                    <option key={cidade.id} value={cidade.id}>
                      {cidade.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2 mt-2 md:mt-0">
                {estadoSelecionado !== null && cidadeSelecionada !== null && (
                  <button
                    onClick={handleFiltrar}
                    className="bg-green-700 text-white  px-2 py-2 ml-2 rounded-lg"
                  >
                    Filtrar
                  </button>
                )}
                {(estadoSelecionado !== null || cidadeSelecionada !== null) && (
                  <button
                    onClick={handleRemoverFiltro}
                    className="bg-red-400 text-white  px-3 py-2 rounded-2xl"
                  >
                    Remover Filtro
                  </button>
                )}
              </div>
            </div>
            <span className="text-white text-lg">
              Bem-vindo, {user?.nomeCompleto.split(' ')[0]}!
            </span>
            <div className="flex space-x-4 ml-auto md:ml-0">
              <Link
                href="/postagem"
                className="bg-gray-500 text-white  px-3 py-2 rounded-2xl"
              >
                Criar Postagem
              </Link>
              <Link
                href="/minhasPostagens"
                className="bg-[#e2cacad2] text-white  px-3 py-2 rounded-2xl"
              >
                Minhas Postagens
              </Link>
              <button
                onClick={logout}
                className="bg-red-400 text-white  px-3 py-2 rounded-2xl"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:justify-end space-y-2 md:space-y-0 md:space-x-4 w-full">
            <Link href="/login" className="bg-gray-500 px-3 py-1 rounded-2xl text-white text-lg">
              Login
            </Link>
            <Link href="/registro" className="bg-blue-600 text-white text-lg px-3 py-1 rounded-2xl w-24">
              Registrar
            </Link>
          </div>
        )}
      </div>
    </nav>

  );
};

export default Navbar;