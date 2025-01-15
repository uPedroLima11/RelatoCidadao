"use client";

import React, { useEffect, useState } from "react";
import CardPostagem from "./CardPostagem";

interface Postagem {
  id: number;
  titulo: string;
  descricao: string;
  usuario: {
    nome: string;
  };
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
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const POSTAGENS_POR_PAGINA = 9;

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
        console.log("Postagens retornadas:", data);
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

  const indexOfLastPost = paginaAtual * POSTAGENS_POR_PAGINA;
  const indexOfFirstPost = indexOfLastPost - POSTAGENS_POR_PAGINA;
  const currentPosts = postagens.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(postagens.length / POSTAGENS_POR_PAGINA);

  const handleNextPage = () => {
    if (paginaAtual < totalPages) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  const handlePrevPage = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Postagens</h1>
      {postagens.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentPosts.map((postagem) => (
              <CardPostagem
                key={postagem.id}
                id={postagem.id}
                titulo={postagem.titulo}
                descricao={postagem.descricao}
                nome={postagem.usuario?.nome}
                localizacao={postagem.localizacao}
                foto={postagem.foto}
                estadoNome={postagem.estadoNome}
                cidadeNome={postagem.cidadeNome}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={paginaAtual === 1}
              className="bg-blue-500 text-white rounded-lg px-4 py-2"
            >
              &lt; Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={paginaAtual === totalPages}
              className="bg-blue-500 text-white rounded-lg px-4 py-2"
            >
              Próximo &gt;
            </button>
          </div>
        </>
      ) : (
        <div>
          <p className="text-center">Nenhuma postagem encontrada.</p>
          <div className="mt-[50rem]"></div>
        </div>
      )}
    </div>
  );
};

export default ListaPostagens;
