"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "./AuthContext";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const isMinhasPostagensPage = pathname === "/minhasPostagens";

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
    if (estadoSelecionado) {
      const fetchCidades = async () => {
        try {
          const estado = estados.find((e) => e.nome === estadoSelecionado);
          if (estado) {
            const response = await axios.get<Cidade[]>(`${process.env.NEXT_PUBLIC_URL_API}/estados/${estado.id}/cidades`);
            setCidades(response.data);
          }
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
        }
      };
      fetchCidades();
    } else {
      setCidades([]);
    }
  }, [estadoSelecionado, estados]);

  const handleFiltrar = () => {
    const estado = estados.find((e) => e.nome === estadoSelecionado);
    const cidade = cidades.find((c) => c.nome === cidadeSelecionada);
    if (estado && cidade) {
      onFiltrar(estado.id, cidade.id);
    }
  };

  const handleRemoverFiltro = () => {
    setEstadoSelecionado("");
    setCidadeSelecionada("");
    onRemoverFiltro();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-2 sm:p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col items-center space-x-2">
          <Link href={isAuthenticated ? "/pagina-logada" : "/"} scroll={false}>
            <Image
              src="/logo2.png"
              alt="logo"
              width={50}
              height={50}
              quality={100}
              priority
              className=""
            />
          </Link>
          <Link
            href={isAuthenticated ? "/pagina-logada" : "/"} scroll={false}
            className="text-white text-center text-[1.1rem] sm:text-xl font-bold"
          >
            Relato Cidadão
          </Link>
        </div>
        <div className="flex items-center lg:hidden">
          <button onClick={toggleMenu} className="text-white text-sm">
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <div
          className={`flex-col lg:flex lg:flex-row lg:items-center mr-10 sm:mr-0 lg:justify-center lg:w-auto mx-auto space-y-1 lg:space-y-0 lg:space-x-8 ${isMenuOpen ? "flex" : "hidden"} lg:flex`}
        >
          {isAuthenticated ? (
            <div className="flex flex-col lg:flex-row lg:items-center">
              {!isMinhasPostagensPage && (
                <div className="flex flex-col lg:flex-row lg:space-x-4">
                  <div className="flex flex-col lg:flex-row lg:space-x-4">
                    <input
                      className="bg-gray-700 text-white p-2 mt-2 sm:mt-0 rounded"
                      value={estadoSelecionado}
                      onChange={(e) => setEstadoSelecionado(e.target.value)}
                      list="estados"
                      placeholder="Estado"
                    />
                    <datalist id="estados">
                      {estados.map((estado) => (
                        <option key={estado.id} value={estado.nome} />
                      ))}
                    </datalist>
                    <input
                      className="bg-gray-700 text-white p-2 mt-2 sm:mt-0 rounded"
                      value={cidadeSelecionada}
                      onChange={(e) => setCidadeSelecionada(e.target.value)}
                      list="cidades"
                      placeholder="Cidade"
                      disabled={!estadoSelecionado}
                    />
                    <datalist id="cidades">
                      {cidades.map((cidade) => (
                        <option key={cidade.id} value={cidade.nome} />
                      ))}
                    </datalist>
                  </div>
                  <div className="flex sm:space-x-4 mt-1 lg:mt-0 ml-4">
                    {estadoSelecionado && cidadeSelecionada && (
                      <button
                        onClick={handleFiltrar}
                        className="bg-green-700 -ml-2 mr-2 sm:-ml-0 sm:mr-0 text-white px-2 sm:px-4 sm:py-3 py-2 rounded text-base sm:text-sm"
                      >
                        Filtrar
                      </button>
                    )}
                    {(estadoSelecionado || cidadeSelecionada) && (
                      <button
                        onClick={handleRemoverFiltro}
                        className="bg-red-400 text-white px-2 sm:px-4 sm:py-3 py-2 rounded text-base sm:text-sm"
                      >
                        Remover Filtro
                      </button>
                    )}
                  </div>
                </div>
              )}
              <span className="text-white text-base sm:text-lg mr-2">
                Bem-vindo, {user?.nomeCompleto.split(" ")[0]}!
              </span>
              <div className="flex space-x-4">
                <Link
                  href="/postagem"
                  className="hover:scale-110 transition delay-150 duration-300 ease-in-out bg-gray-500 text-white px-2 sm:px-4 py-2 rounded-2xl text-base sm:text-base flex items-center justify-center"
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
            <div className="flex space-x-3 sm:mt-2 mt-3 -mr-3">
              <Link
                href="/login"
                className="hover:scale-110 transition delay-150 duration-300 ease-in-out bg-gray-500 text-white text-center text-base lg:text-base px-4 py-2 rounded-xl flex-grow"
              >
                Login
              </Link>
              <Link
                href="/registro"
                className="hover:scale-110 transition delay-150 duration-300 ease-in-out bg-blue-600 text-white text-center text-base lg:text-base px-4 py-2 rounded-xl flex-grow"
              >
                Registro
              </Link>
            </div>

          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute top-0 right-0 z-10 p-2">
          <button
            onClick={toggleMenu}
            className={`inline-flex lg:hidden items-center justify-center p-1 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ${isMenuOpen ? "ring-2 ring-white ring-offset-1" : ""
              }`}
          >
            {isMenuOpen ? (
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

      )}
    </nav>
  );
}
