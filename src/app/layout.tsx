"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthContext";
import { useAuth } from "./components/AuthContext";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ListaPostagens from "./components/ListarPostagens";
import { usePathname } from "next/navigation";

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

  const isCreatingPostagem = pathname === "/postagem";
  const isMinhasPostagensPage = pathname === "/minhasPostagens";

  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LayoutContent
            estadoId={estadoId}
            cidadeId={cidadeId}
            onFiltrar={handleFiltrar}
            onRemoverFiltro={handleRemoverFiltro}
            isCreatingPostagem={isCreatingPostagem}
            isMinhasPostagensPage={isMinhasPostagensPage}
          >
            {children}
          </LayoutContent>
        </body>
      </html>
    </AuthProvider>
  );
}

const LayoutContent = ({
  children,
  estadoId,
  cidadeId,
  onFiltrar,
  onRemoverFiltro,
  isCreatingPostagem,
  isMinhasPostagensPage,
}: {
  children: React.ReactNode;
  estadoId: number | null;
  cidadeId: number | null;
  onFiltrar: (estadoId: number | null, cidadeId: number | null) => void;
  onRemoverFiltro: () => void;
  isCreatingPostagem: boolean;
  isMinhasPostagensPage: boolean;
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar onFiltrar={onFiltrar} onRemoverFiltro={onRemoverFiltro} />
      {isAuthenticated && !isCreatingPostagem && !isMinhasPostagensPage && (
        <ListaPostagens estadoId={estadoId} cidadeId={cidadeId} />
      )}
      {children}
    </>
  );
};
