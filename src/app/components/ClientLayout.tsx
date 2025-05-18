"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar";
import ListaPostagens from "./ListarPostagens";
import Footer from "./footer";
import Script from "next/script";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [estadoId, setEstadoId] = useState<number | null>(null);
    const [cidadeId, setCidadeId] = useState<number | null>(null);

    const handleFiltrar = (
        selectedEstadoId: number | null,
        selectedCidadeId: number | null
    ) => {
        setEstadoId(selectedEstadoId);
        setCidadeId(selectedCidadeId);
    };

    const handleRemoverFiltro = () => {
        setEstadoId(null);
        setCidadeId(null);
    };

    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    const criarPostagem = pathname === "/postagem";
    const minhasPostagensPage = pathname === "/minhasPostagens";
    const postagemDetalhePage = pathname.startsWith("/postagens/");

    return (
        <>
            <Script
                strategy="afterInteractive"
                id="hs-script-loader"
                src="https://js-na1.hs-scripts.com/50069658.js"
            />
            <Navbar onFiltrar={handleFiltrar} onRemoverFiltro={handleRemoverFiltro} />
            {isAuthenticated && !criarPostagem && !minhasPostagensPage && !postagemDetalhePage && (
                <ListaPostagens estadoId={estadoId} cidadeId={cidadeId} />
            )}
            {children}
            <Footer />
        </>
    );
}
