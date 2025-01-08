"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface NavbarProps {
  onFilter: (estadoId: number, cidadeId: number) => void;
}

export default function Navbar({ onFilter = () => {} }: NavbarProps) {
 const [estados, setEstados] = useState<{ id: number; nome: string }[]>([]);
  const [cidades, setCidades] = useState<{ id: number; nome: string }[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState<number | null>(null);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchEstados() {
      try {
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        setEstados(response.data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    }
    fetchEstados();
  }, []);

  useEffect(() => {
    async function fetchCidades() {
      if (estadoSelecionado) {
        try {
          const response = await axios.get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`
          );
          setCidades(response.data);
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
        }
      } else {
        setCidades([]);
      }
    }
    fetchCidades();
  }, [estadoSelecionado]);

  const handleFiltrar = () => {
    if (estadoSelecionado && cidadeSelecionada) {
      onFilter(estadoSelecionado, cidadeSelecionada);
    }
  };

  return (
    <nav className="bg-[#9caaac] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-lg">
          Relato Cidadão
        </Link>
        <div className="hidden md:flex space-x-4">
          <select
            className="p-2 rounded"
            aria-label="Selecione o estado"
            value={estadoSelecionado || ""}
            onChange={(e) => setEstadoSelecionado(Number(e.target.value))}
          >
            <option value="">Selecione o Estado</option>
            {estados.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.nome}
              </option>
            ))}
          </select>
          <select
            className="p-2 rounded"
            aria-label="Selecione a cidade"
            value={cidadeSelecionada || ""}
            onChange={(e) => setCidadeSelecionada(Number(e.target.value))}
            disabled={!estadoSelecionado}
          >
            <option value="">Selecione a Cidade</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.id}>
                {cidade.nome}
              </option>
            ))}
          </select>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleFiltrar}
          >
            Filtrar
          </button>
          <Link href="/postagem" className="bg-red-500 text-white px-4 py-2 rounded">
            Criar Postagem
          </Link>
        </div>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-2">
          <select
            className="p-2 rounded"
            aria-label="Selecione o estado"
            value={estadoSelecionado || ""}
            onChange={(e) => setEstadoSelecionado(Number(e.target.value))}
          >
            <option value="">Selecione o Estado</option>
            {estados.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.nome}
              </option>
            ))}
          </select>
          <select
            className="p-2 rounded"
            aria-label="Selecione a cidade"
            value={cidadeSelecionada || ""}
            onChange={(e) => setCidadeSelecionada(Number(e.target.value))}
            disabled={!estadoSelecionado}
          >
            <option value="">Selecione a Cidade</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.id}>
                {cidade.nome}
              </option>
            ))}
          </select>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleFiltrar}
          >
            Filtrar
          </button>
          <Link href="/postagem" className="bg-red-500 text-white px-4 py-2 rounded">
            Criar Postagem
          </Link>
        </div>
      )}
    </nav>
  );
}
