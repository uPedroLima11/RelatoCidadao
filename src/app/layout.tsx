"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      onPrechatSubmit?: (data: { name: string; email: string; telefone?: string; message?: string }) => void;
    };
  }
}
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthContext";
import { useAuth } from "./components/AuthContext";
import Navbar from "./components/Navbar";
import ListaPostagens from "./components/ListarPostagens";
import { usePathname } from "next/navigation";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [estadoId, setEstadoId] = useState<number | null>(null);
  const [cidadeId, setCidadeId] = useState<number | null>(null);

  const pathname = usePathname();
  const criarPostagem = pathname === "/postagem";
  const minhasPostagensPage = pathname === "/minhasPostagens";
  const postagemDetalhePage = pathname.startsWith("/postagens/");

  useEffect(() => {
    if (document.getElementById("tawk-script")) return;

    const s1 = document.createElement("script");
    s1.id = "tawk-script";
    s1.async = true;
    s1.src = process.env.NEXT_PUBLIC_TAWK_API_KEY || "";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.body.appendChild(s1);

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onPrechatSubmit = function (data) {
      console.log("🚀 Dados recebidos do Tawk.to:", data); 
      fetch(process.env.NEXT_PUBLIC_CLIENT_KEY || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: data.name || "Não informado",
          email: data.email || "Não informado",
          telefone: data.telefone || "Não informado",
          mensagem: data.message ?? "Não informado",
          raw: data, 
        }),
      });
    };

  }, []);

  return (
    <AuthProvider>
      <html lang="pt-br">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LayoutContent
            estadoId={estadoId}
            cidadeId={cidadeId}
            onFiltrar={setEstadoId}
            onRemoverFiltro={() => {
              setEstadoId(null);
              setCidadeId(null);
            }}
            criarPostagem={criarPostagem}
            minhasPostagensPage={minhasPostagensPage}
            postagemDetalhePage={postagemDetalhePage}
          >
            {children}
          </LayoutContent>
        </body>
      </html>
    </AuthProvider>
  );
}

const LayoutContent = (props: {
  children: React.ReactNode;
  estadoId: number | null;
  cidadeId: number | null;
  onFiltrar: (estadoId: number | null, cidadeId: number | null) => void;
  onRemoverFiltro: () => void;
  criarPostagem: boolean;
  minhasPostagensPage: boolean;
  postagemDetalhePage: boolean;
}) => {
  const { isAuthenticated } = useAuth();
  const {
    children,
    estadoId,
    cidadeId,
    onFiltrar,
    onRemoverFiltro,
    criarPostagem,
    minhasPostagensPage,
    postagemDetalhePage,
  } = props;

  return (
    <>
      <Navbar onFiltrar={onFiltrar} onRemoverFiltro={onRemoverFiltro} />
      {isAuthenticated &&
        !criarPostagem &&
        !minhasPostagensPage &&
        !postagemDetalhePage && (
          <ListaPostagens estadoId={estadoId} cidadeId={cidadeId} />
        )}
      {children}
      <Footer />
    </>
  );
};
