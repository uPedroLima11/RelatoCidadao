"use client";

import React, { useEffect, useState } from "react";
import CardPostagem from "./CardPostagem";

interface ListaPostagensProps {
  estadoId: number | null;
  cidadeId: number | null;
}

const ListaPostagens: React.FC<ListaPostagensProps> = ({ estadoId, cidadeId }) => {
  const [postagens, setPostagens] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostagens = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_URL_API}/postagens`;
        if (estadoId && cidadeId) {
          url += `?estadoId=${estadoId}&cidadeId=${cidadeId}`;
        }
        const response = await fetch(url);
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
  }, [estadoId, cidadeId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Postagens</h1>
      {postagens.length > 0 ? (
        postagens.map((postagem) => (
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
        ))
      ) : (
        <p className="text-center">Nenhuma postagem encontrada.</p>
      )}
    </div>
  );
};

export default ListaPostagens;
