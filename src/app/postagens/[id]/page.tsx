"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../components/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface Comentario {
    id: number;
    conteudo: string;
    usuarioNome: string;
}

interface Postagem {
    id: number;
    titulo: string;
    descricao: string;
    localizacao: string;
    foto: string;
    usuarioNome: string;
    estadoNome: string;
    cidadeNome: string;
}

const PostagemPage: React.FC = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [postagem, setPostagem] = useState<Postagem | null>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchPostagem = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/postagens/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPostagem(data);
                } else {
                    throw new Error("Erro ao buscar a postagem.");
                }
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar a postagem.");
            }
        };

        const fetchComentarios = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/comentarios/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setComentarios(data);
                } else {
                    throw new Error("Erro ao buscar os comentários.");
                }
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar os comentários.");
            }
        };

        fetchPostagem();
        fetchComentarios();
    }, [id]);

    const handleAdicionarComentario = async () => {
        if (!novoComentario.trim()) return;

        if (novoComentario.length > 300) {
            setError("O comentário não pode exceder 300 caracteres.");
            return;
        }

        const token = user?.token;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/comentarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ conteudo: novoComentario, postagemId: id }),
            });

            if (response.ok) {
                setNovoComentario("");
                window.location.reload();
            } else {
                const errorData = await response.json();
                throw new Error(`Erro ao adicionar o comentário: ${errorData.error}`);
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao adicionar o comentário.");
        }
    };

    const handleExcluirComentario = async (comentarioId: number) => {
        const token = user?.token;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/comentarios/${comentarioId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setComentarios((prev) => prev.filter((comentario) => comentario.id !== comentarioId));
                alert("Comentário apagado com sucesso!");
            } else {
                const errorData = await response.json();
                throw new Error(`Erro ao excluir o comentário: ${errorData.error}`);
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao excluir o comentário.");
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!postagem) {
        return <div>Carregando... <div className="mt-[40rem]"></div></div>;
    }

    const fotoUrl = postagem.foto && postagem.foto.startsWith('http')
        ? postagem.foto
        : `${process.env.NEXT_PUBLIC_URL_API}${postagem.foto || '/default-image.jpg'}`;

    try {
        new URL(fotoUrl);
    } catch (e) {
        console.error("URL da imagem inválida:", fotoUrl);
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <Image
                    src={fotoUrl}
                    alt={postagem.titulo}
                    width={800}
                    height={400}
                    className="rounded-lg"
                />
                <h1 className="text-2xl font-bold mt-4">{postagem.titulo}</h1>
                <p className="text-gray-700">{postagem.descricao}</p>
                <p className="text-gray-500 mt-2">
                    <strong>Local:</strong> {postagem.localizacao}
                </p>
                <p className="text-gray-500">
                    <strong>Usuário:</strong> {postagem.usuarioNome}
                </p>
                <p className="text-gray-500">
                    <strong>Estado:</strong> {postagem.estadoNome}
                </p>
                <p className="text-gray-500">
                    <strong>Cidade:</strong> {postagem.cidadeNome}
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Comentários</h2>
                <ul className="mb-4">
                    {comentarios.map((comentario) => (
                        <li key={comentario.id} className="mb-2">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-700">
                                    <strong>{comentario.usuarioNome}:</strong> {comentario.conteudo}
                                </p>
                                {comentario.usuarioNome === user?.nomeCompleto && (
                                    <button onClick={() => handleExcluirComentario(comentario.id)} className="text-red-500">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={novoComentario}
                        onChange={(e) => setNovoComentario(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 flex-grow"
                        placeholder="Adicionar um comentário..."
                    />
                    <button
                        onClick={handleAdicionarComentario}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostagemPage;
