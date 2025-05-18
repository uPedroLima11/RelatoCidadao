"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthContext";
import { useAuth } from "./components/AuthContext";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ListaPostagens from "./components/ListarPostagens";
import { usePathname } from "next/navigation";
import Footer from "./components/footer";
import Head from "next/head";

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

  const criarPostagem = pathname === "/postagem";
  const minhasPostagensPage = pathname === "/minhasPostagens";
  const postagemDetalhePage = pathname.startsWith("/postagens/");

  return (
    <AuthProvider>
      <html lang="pt-br">
  <body
    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
  >
    <Head>
      <script
        type="text/javascript"
        id="hs-script-loader"
        async
        defer
        src="https://js-na1.hs-scripts.com/50069560.js"
      ></script>
    </Head>

    <LayoutContent
      estadoId={estadoId}
      cidadeId={cidadeId}
      onFiltrar={handleFiltrar}
      onRemoverFiltro={handleRemoverFiltro}
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
  const { children, estadoId, cidadeId, onFiltrar, onRemoverFiltro, criarPostagem, minhasPostagensPage, postagemDetalhePage } = props;

  return (
    <>
      <Navbar onFiltrar={onFiltrar} onRemoverFiltro={onRemoverFiltro} />
      {isAuthenticated && !criarPostagem && !minhasPostagensPage && !postagemDetalhePage && (
        <ListaPostagens estadoId={estadoId} cidadeId={cidadeId} />
      )}
      {children}
      <Footer />
    </>
  );
};
