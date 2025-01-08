"use client"; 

import Link from 'next/link';
import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#9caaac] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-lg">Relato Cidadão</Link>
        <div className="hidden md:flex space-x-4"> 
          <select className="p-2 rounded" aria-label="Selecione o estado">
            <option value="default">Selecione o Estado</option>
            {/* Adicionar opções de estados */}
          </select>
          <select className="p-2 rounded" aria-label="Selecione a cidade">
            <option value="default">Selecione a Cidade</option>
            {/* Adicionar opções de cidades */}
          </select>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Filtrar</button>
          <Link href="/postagem" className="bg-red-500 text-white px-4 py-2 rounded">Criar Postagem</Link>
        </div>
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✖' : '☰'} 
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-2"> 
          <select className="p-2 rounded" aria-label="Selecione o estado">
            <option value="default">Selecione o Estado</option>
            {/* Adicionar opções de estados */}
          </select>
          <select className="p-2 rounded" aria-label="Selecione a cidade">
            <option value="default">Selecione a Cidade</option>
            {/* Adicionar opções de cidades */}
          </select>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Filtrar</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">Criar Postagem</button>
        </div>
      )}
    </nav>
  );
};
