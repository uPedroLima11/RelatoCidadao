
"use client"; 

import React, { useState } from 'react';

const PostagemForm = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('local', local);
    formData.append('estado', estado);
    formData.append('cidade', cidade);
    formData.append('nome', nome);
    formData.append('email', email);
    if (foto) {
      formData.append('foto', foto); 
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/postagens`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Postagem criada com sucesso:', data);
      } else {
        console.error('Erro ao criar postagem:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Criar Nova Postagem</h2>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Local"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        required
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Estado"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        required
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Cidade"
        value={cidade}
        onChange={(e) => setCidade(e.target.value)}
        required
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Seu Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <input
        type="email"
        placeholder="Seu Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <input
        type="file"
        onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
        className="w-full mb-2"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Criar Postagem
      </button>
    </form>
  );
};

export default PostagemForm;
