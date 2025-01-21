"use client"; 

import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";

interface Estado {
    id: number;
    nome: string;
}

interface Cidade {
    id: number;
    nome: string;
}

export default function MinhasPostagens() {
    const { user } = useAuth();
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [localizacao, setLocalizacao] = useState("");
    const [foto, setFoto] = useState<File | null>(null);
    const [estadoInput, setEstadoInput] = useState("");
    const [cidadeInput, setCidadeInput] = useState("");
    const [estadoSelecionado, setEstadoSelecionado] = useState<Estado | null>(null);
    const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(null);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [filtradosEstados, setFiltradosEstados] = useState<Estado[]>([]);
    const [filtradosCidades, setFiltradosCidades] = useState<Cidade[]>([]);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/estados`);
                if (response.ok) {
                    const data = await response.json();
                    setEstados(data);
                } else {
                    throw new Error("Erro ao buscar estados.");
                }
            } catch (error) {
                console.error("Erro ao conectar-se à API:", error);
                setError("Erro ao carregar estados");
            }
        };

        fetchEstados();
    }, []);

    useEffect(() => {
        if (estadoSelecionado) {
            const fetchCidades = async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_URL_API}/estados/${estadoSelecionado.id}/cidades`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setCidades(data);
                    } else {
                        throw new Error("Erro ao buscar cidades.");
                    }
                } catch (error) {
                    console.error("Erro ao conectar-se à API:", error);
                    setError("Erro ao carregar cidades");
                }
            };

            fetchCidades();
        }
    }, [estadoSelecionado]);

    const handleEstadoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEstadoInput(value);
        setFiltradosEstados(estados.filter((estado) =>
            estado.nome.toLowerCase().includes(value.toLowerCase())
        ));
    };

    const handleCidadeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCidadeInput(value);
        setFiltradosCidades(cidades.filter((cidade) =>
            cidade.nome.toLowerCase().includes(value.toLowerCase())
        ));
    };

    const handleEstadoSelect = (estado: Estado) => {
        setEstadoInput(estado.nome);
        setEstadoSelecionado(estado);
        setFiltradosEstados([]);
    };

    const handleCidadeSelect = (cidade: Cidade) => {
        setCidadeInput(cidade.nome);
        setCidadeSelecionada(cidade);
        setFiltradosCidades([]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!estadoSelecionado) {
            setError("Selecione um estado válido.");
            return;
        }
        if (!cidadeSelecionada) {
            setError("Selecione uma cidade válida.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descricao", descricao);
        formData.append("localizacao", localizacao);

        if (foto) {
            formData.append("foto", foto);
        } else {
            setError("A imagem é obrigatória.");
            setIsSubmitting(false);
            return;
        }

        formData.append("estadoId", String(estadoSelecionado.id));
        formData.append("cidadeId", String(cidadeSelecionada.id));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/postagens`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Erro do servidor:", errorText);
                setModalMessage("Erro ao criar postagem");
                setShowModal(true);
                setIsSubmitting(false);
                return;
            }

            setModalMessage("Postagem criada com sucesso e enviada para ser aprovada!");
            setShowModal(true);
            setTitulo("");
            setDescricao("");
            setLocalizacao("");
            setFoto(null);
            setEstadoInput("");
            setCidadeInput("");
            setEstadoSelecionado(null);
            setCidadeSelecionada(null);
            setError("");
        } catch (error) {
            console.error("Erro ao criar postagem:", error);
            setModalMessage("Erro ao criar postagem");
            setShowModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setModalMessage("");
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Criar Postagem</h1>
            <form onSubmit={handleSubmit} className="bg-[#e6d1d1] p-8 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Título:</label>
                    <input
                        type="text"
                        value={titulo}
                        maxLength={100}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Descrição:</label>
                    <textarea
                        value={descricao}
                        maxLength={1000}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={4}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Localização:</label>
                    <input
                        type="text"
                        value={localizacao}
                        maxLength={100}
                        onChange={(e) => setLocalizacao(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Foto:</label>
                    <input
                        type="file"
                        name="foto"
                        onChange={(e) => setFoto(e.target.files?.[0] || null)}
                        className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        accept="image/*"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Estado:</label>
                    <input
                        type="text"
                        value={estadoInput}
                        onChange={handleEstadoInputChange}
                        className="p-2 border border-gray-300 rounded w-full focus:outline-none"
                        placeholder="Digite o estado"
                    />
                    {filtradosEstados.length > 0 && (
                        <ul className="bg-white border border-gray-300 mt-2 rounded shadow-md max-h-48 overflow-y-auto">
                            {filtradosEstados.map((estado) => (
                                <li
                                    key={estado.id}
                                    onClick={() => handleEstadoSelect(estado)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {estado.nome}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Cidade:</label>
                    <input
                        type="text"
                        value={cidadeInput}
                        onChange={handleCidadeInputChange}
                        className="p-2 border border-gray-300 rounded w-full focus:outline-none"
                        placeholder="Digite a cidade"
                        disabled={!estadoSelecionado}
                    />
                    {filtradosCidades.length > 0 && (
                        <ul className="bg-white border border-gray-300 mt-2 rounded shadow-md max-h-48 overflow-y-auto">
                            {filtradosCidades.map((cidade) => (
                                <li
                                    key={cidade.id}
                                    onClick={() => handleCidadeSelect(cidade)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {cidade.nome}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    className={`bg-green-500 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Criando..." : "Criar Postagem"}
                </button>
            </form>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-md">
                        <p className="mb-4">{modalMessage}</p>
                        <button onClick={handleModalClose} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}