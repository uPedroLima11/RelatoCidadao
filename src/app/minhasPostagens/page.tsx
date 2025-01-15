"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import CardPostagem from "../components/CardPostagem";

interface Postagem {
  id: number;
  titulo: string;
  descricao: string;
  localizacao: string;
  foto: string;
  estadoNome: string;
  cidadeNome: string;
  usuario: {
    nome: string;
  };
}

export default function MinhasPostagens() {
  const { user, isLoading } = useAuth();
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [error, setError] = useState<string>("");
  const [editingPost, setEditingPost] = useState<Postagem | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPostagens = async () => {
      if (!user) {
        setError("Usuário não autenticado.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/postagens/meus`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setPostagens(data);
        } else {
          setError(data.error || "Erro ao carregar postagens");
        }
      } catch (error) {
        console.error("Erro ao conectar-se à API:", error);
        setError("Erro ao carregar postagens");
      }
    };

    if (!isLoading) {
      fetchPostagens();
    }
  }, [user, isLoading]);

  const handleEdit = (postagem: Postagem) => {
    setEditingPost(postagem);
    setFile(null);
  };

  const handleSave = async () => {
    if (!editingPost || !user) return;

    const formData = new FormData();
    formData.append("titulo", editingPost.titulo);
    formData.append("descricao", editingPost.descricao);
    formData.append("localizacao", editingPost.localizacao);
    if (file) {
      formData.append("foto", file);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/postagens/${editingPost.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedPostagem = await response.json();
        setPostagens((prevPostagens) =>
          prevPostagens.map((post) => (post.id === updatedPostagem.id ? updatedPostagem : post))
        );
        alert("Postagem atualizada com sucesso!");
        setEditingPost(null);
        setFile(null);
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erro ao atualizar a postagem.");
      }
    } catch (error) {
      console.error("Erro ao salvar a postagem:", error);
    }
  };

  const handleDelete = async (postId: number) => {
    if (confirm("Tem certeza que deseja remover esta postagem?")) {
      try {
        if (!user) {
          alert("Usuário não autenticado.");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/postagens/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          setPostagens((prevPostagens) => prevPostagens.filter((postagem) => postagem.id !== postId));
          alert("Postagem removida com sucesso!");
        } else {
          alert("Erro ao remover a postagem.");
        }
      } catch (error) {
        console.error("Erro ao remover a postagem:", error);
      }
    }
  };

  if (isLoading) {
    return <p className="text-center">Carregando...</p>;
  }

  if (!user) {
    return <p className="text-center text-red-500">Usuário não autenticado.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Minhas Postagens</h1>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {postagens.length === 0 ? (
        <div> <p className="text-center">Você ainda não fez nenhuma postagem.</p>
        <div className="mt-[50rem]"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {postagens.map((postagem) => (
            <div key={postagem.id} className="mb-4">
              <CardPostagem
                titulo={postagem.titulo}
                id={postagem.id}
                nome={postagem.usuario ? postagem.usuario.nome : "Desconhecido"}
                descricao={postagem.descricao}
                localizacao={postagem.localizacao}
                foto={postagem.foto}
                estadoNome={postagem.estadoNome}
                cidadeNome={postagem.cidadeNome}
              />
              <div className="mt-2 flex justify-center space-x-4">
                <button
                  className="bg-[#253746] rounded-xl p-2 text-white"
                  onClick={() => handleEdit(postagem)}
                >
                  Editar
                </button>
                <button
                  className="bg-[#a53425] rounded-xl p-2 text-white"
                  onClick={() => handleDelete(postagem.id)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Editar Postagem</h2>
            <div className="mb-4">
              <label className="block mb-2">Título:</label>
              <input
                type="text"
                value={editingPost.titulo}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, titulo: e.target.value })
                }
                maxLength={100}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Descrição:</label>
              <textarea
                value={editingPost.descricao}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, descricao: e.target.value })
                }
                maxLength={500}
                className="w-full border px-3 py-2 rounded min-h-[150px] h-40"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Localização:</label>
              <input
                type="text"
                value={editingPost.localizacao}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, localizacao: e.target.value })
                }
                maxLength={200}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Foto:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleSave}
              >
                Salvar
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setEditingPost(null);
                  setFile(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
