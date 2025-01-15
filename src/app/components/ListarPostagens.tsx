"use client";

import React, { useEffect, useState } from "react";
import CardPostagem from "./CardPostagem";

interface Postagem {
  id: number;
  titulo: string;
  descricao: string;
  usuarioNome?: string;
  localizacao: string;
  foto: string;
  estadoNome: string;
  cidadeNome: string;
}

interface ListaPostagensProps {
  estadoId: number | null;
  cidadeId: number | null;
}

const ListaPostagens: React.FC<ListaPostagensProps> = ({ estadoId, cidadeId }) => {
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPostagens = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_URL_API}/postagens`;
        if (estadoId && cidadeId) {
          url += `?estadoId=${estadoId}&cidadeId=${cidadeId}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar postagens.");
        }
        const data: Postagem[] = await response.json();
        setPostagens(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar postagens.");
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {postagens.map((postagem) => (
            <CardPostagem
              key={postagem.id}
              id={postagem.id}
              titulo={postagem.titulo}
              descricao={postagem.descricao}
              nome={postagem.usuarioNome || "Usuário Anônimo"}
              localizacao={postagem.localizacao}
              foto={postagem.foto}
              estadoNome={postagem.estadoNome}
              cidadeNome={postagem.cidadeNome}
            />
          ))}
        </div>
      ) : (
        <div>
        <p className="text-center">Nenhuma postagem encontrada.</p>
        <div className="mt-[52rem]"></div></div>
      )}
    </div>
  );
};

export default ListaPostagens;
