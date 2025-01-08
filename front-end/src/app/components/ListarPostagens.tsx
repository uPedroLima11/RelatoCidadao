"use client";

import React, { useEffect, useState } from "react";
import CardPostagem from "./CardPostagem";

const ListaPostagens: React.FC = () => {
  const [postagens, setPostagens] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostagens = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/postagens`);
        if (response.ok) {
          const data = await response.json();
          setPostagens(data);
        } else {
          throw new Error("Erro ao buscar postagens.");
        }
      } catch (error) {
        console.error(error);
        setError("Erro ao carregar postagens");
      }
    };

    fetchPostagens();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Postagens</h1>
      {postagens.map((postagem) => (
        <CardPostagem
          key={postagem.id}
          titulo={postagem.titulo}
          nome={postagem.nome} 
          descricao={postagem.descricao}
          localizacao={postagem.localizacao} 
          foto={postagem.foto} 
          estadoNome={postagem.estadoNome} 
          cidadeNome={postagem.cidadeNome} 
        />
      ))}
    </div>
  );
};

export default ListaPostagens;
