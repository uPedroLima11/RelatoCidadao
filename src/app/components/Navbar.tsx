"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "./AuthContext";
import Image from "next/image";

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

export default function Navbar({ onFiltrar, onRemoverFiltro }: NavbarProps) {
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
          const response = await axios.get<Cidade[]>(`${process.env.NEXT_PUBLIC_URL_API}/estados/${estadoSelecionado}/cidades`);
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
    <nav className="bg-gray-800 p-2 sm:p-4">
  <div className="container mx-auto flex justify-between items-center">
    <div className="flex flex-col items-center space-x-2">
      <Image
        src="/logo2.png"
        alt="logo"
        width={50}
        height={50}
        quality={100}
        priority
        className="z-0"
      />
      <Link
        href={isAuthenticated ? "/pagina-logada" : "/"}
        className="text-white text-lg sm:text-xl font-bold"
      >
        Relato Cidadão
      </Link>
    </div>
    <button onClick={toggleMenu} className="text-white lg:hidden text-sm">
      {isMenuOpen ? "Fechar" : "Menu"}
    </button>
    <div
      className={`flex-col lg:flex lg:flex-row lg:items-center ${isMenuOpen ? "flex" : "hidden"} lg:flex`}
    >
      {isAuthenticated ? (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:w-auto mx-auto space-y-1 lg:space-y-0 lg:space-x-8">
          <div className="flex flex-col lg:flex-row lg:items-center">
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <select
                className="bg-gray-700 text-white p-2 rounded text-base sm:text-base w-48 mb-2 sm:mb-0"
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
                className="bg-gray-700 text-white p-2 rounded text-sm sm:text-base w-48"
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
            <div className="flex space-x-4 mt-1 lg:mt-0 ml-4">
              {estadoSelecionado !== null && cidadeSelecionada !== null && (
                <button
                  onClick={handleFiltrar}
                  className="bg-green-700 text-white px-4 py-2 rounded text-base sm:text-sm"
                >
                  Filtrar
                </button>
              )}
              {(estadoSelecionado !== null || cidadeSelecionada !== null) && (
                <button
                  onClick={handleRemoverFiltro}
                  className="bg-red-400 text-white px-4 py-2 rounded text-base sm:text-sm"
                >
                  Remover Filtro
                </button>
              )}
            </div>
          </div>
          <span className="text-white text-base sm:text-lg">
            Bem-vindo, {user?.nomeCompleto.split(" ")[0]}!
          </span>
          <div className="flex space-x-4">
            <Link
              href="/postagem"
              className="hover:scale-110 transition delay-150 duration-300 ease-in-out bg-gray-500 text-white px-2 sm:px-4 py rounded-2xl text-base sm:text-base flex items-center justify-center"
            >
              Criar
            </Link>
            <Link
              href="/minhasPostagens"
              className="hover:scale-110 transition delay-150 duration-300 ease-in-out bg-[#e2cacad2] text-white px-2 sm:px-4 py-2 rounded-2xl text-base sm:text-base flex items-center justify-center"
            >
              Postagens
            </Link>
            <button
              onClick={logout}
              className="hover:scale-110 transition delay-150 duration-300 ease-in-out bg-red-400 text-white px-2 sm:px-4 py-2 rounded-2xl text-base sm:text-base flex items-center justify-center"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center space-y-2 lg:space-y-0 lg:space-x-4 w-full">
          <Link
            href="/login"
            className="hover:scale-110 transition delay-150 duration-300 ease-in-out bg-gray-500 text-white text-center text-sm lg:text-base px-4 py-2 rounded-xl w-18 lg:w-auto"
          >
            Login
          </Link>
          <Link
            href="/registro"
            className="hover:scale-110 transition delay-150 duration-300 ease-in-out bg-blue-600 text-white text-center text-base lg:text-base px-4 py-2 rounded-xl w-18 lg:w-auto"
          >
            Registro
          </Link>
        </div>
      )}
    </div>
  </div>
</nav>


  );
}
