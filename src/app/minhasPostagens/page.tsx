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
  const { user, isLoading, refreshToken } = useAuth();
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [error, setError] = useState<string>("");
  const [editingPost, setEditingPost] = useState<Postagem | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

        if (!response.ok) {
          await refreshToken();
          const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/postagens/meus`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            setPostagens(retryData);
          } else {
            const retryData = await retryResponse.json();
            setError(retryData.error || "Erro ao carregar postagens");
          }
        } else {
          const data = await response.json();
          setPostagens(data);
        }
      } catch (error) {
        console.error("Erro ao conectar-se à API:", error);
        setError("Erro ao carregar postagens");
      }
    };

    if (!isLoading) {
      fetchPostagens();
    }
  }, [user, isLoading, refreshToken]);

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
        setModalMessage("Postagem alterada com sucesso!");
        setShowSuccessModal(true);
        setEditingPost(null);
        setFile(null);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const errorData = await response.json();
        setModalMessage(errorData.error || "Erro ao alterar postagem."); 
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Erro ao salvar a postagem:", error);
      setModalMessage("Erro ao alterar postagem.");
      setShowSuccessModal(true);
    }
  };

  const handleDelete = (postId: number) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!user || postToDelete === null) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/postagens/${postToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        setPostagens((prevPostagens) => prevPostagens.filter((postagem) => postagem.id !== postToDelete));
        setModalMessage("Postagem removida com sucesso!");
        setShowSuccessModal(true);
      } else {
        alert("Erro ao remover a postagem.");
      }
    } catch (error) {
      console.error("Erro ao remover a postagem:", error);
    } finally {
      setShowDeleteConfirm(false);
      setPostToDelete(null);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleDeleteConfirmClose = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
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
        <div>
          <p className="text-center">Você ainda não fez nenhuma postagem.</p>
          <div className="mt-[50rem]"></div>
        </div>
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
            <div className="flex justify-end space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Salvar
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setEditingPost(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Sucesso!</h2>
            <p>{modalMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSuccessModalClose}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirmação de Remoção</h2>
            <p>Você tem certeza que deseja remover esta postagem?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={confirmDelete}
              >
                Remover
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={handleDeleteConfirmClose}
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
