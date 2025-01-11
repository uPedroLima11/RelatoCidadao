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
    const [foto, setFoto] = useState("");
    const [estadoId, setEstadoId] = useState<number | "">("");
    const [cidadeId, setCidadeId] = useState<number | "">("");
    const [estados, setEstados] = useState<Estado[]>([]);
    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/estados`);
                if (response.ok) {
                    const data = await response.json();
                    setEstados(data);
                } else {
                    console.error("Erro ao buscar estados.");
                    setError("Erro ao carregar estados");
                }
            } catch (error) {
                console.error("Erro ao conectar-se à API:", error);
                setError("Erro ao carregar estados");
            }
        };

        fetchEstados();
    }, []);

    useEffect(() => {
        const fetchCidades = async () => {
            if (estadoId) {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_URL_API}/estados/${estadoId}/cidades`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setCidades(data);
                    } else {
                        console.error("Erro ao buscar cidades.");
                        setError("Erro ao carregar cidades");
                    }
                } catch (error) {
                    console.error("Erro ao conectar-se à API:", error);
                    setError("Erro ao carregar cidades");
                }
            } else {
                setCidades([]);
            }
        };

        fetchCidades();
    }, [estadoId]);

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isValidUrl(foto)) {
            setError("A URL da foto não é válida.");
            return;
        }

        const formData = {
            titulo,
            descricao,
            localizacao,
            foto,
            estadoId: Number(estadoId),
            cidadeId: Number(cidadeId),
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/postagens`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`, 
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Postagem criada com sucesso!");
                setTitulo("");
                setDescricao("");
                setLocalizacao("");
                setFoto("");
                setEstadoId("");
                setCidadeId("");
            } else {
                console.error("Erro do servidor:", data.error);
                setError(data.error || "Erro ao criar postagem");
            }
        } catch (error) {
            console.error("Erro ao criar postagem:", error);
            setError("Erro ao criar postagem");
        }
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
                    <label className="block mb-2 text-sm font-medium">Foto (URL):</label>
                    <input
                        type="text"
                        value={foto}
                        maxLength={100}
                        onChange={(e) => setFoto(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Estado:</label>
                    <select
                        value={estadoId}
                        onChange={(e) => setEstadoId(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    >
                        <option value="">Selecione o Estado</option>
                        {estados.map((estado) => (
                            <option key={estado.id} value={estado.id}>
                                {estado.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Cidade:</label>
                    <select
                        value={cidadeId}
                        onChange={(e) => setCidadeId(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        disabled={!estadoId}
                    >
                        <option value="">Selecione a Cidade</option>
                        {cidades.map((cidade) => (
                            <option key={cidade.id} value={cidade.id}>
                                {cidade.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                    Enviar Postagem
                </button>
            </form>

            {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
};

