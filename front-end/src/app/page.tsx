"use client";

import { useState } from "react";
import ListaPostagens from "./components/ListarPostagens";
import Navbar from "./components/Navbar";

export default function Home() {
  const [estadoId, setEstadoId] = useState<number | null>(null);
  const [cidadeId, setCidadeId] = useState<number | null>(null);

  const handleFilter = (selectedEstadoId: number, selectedCidadeId: number) => {
    console.log("Filtrando postagens para:", { selectedEstadoId, selectedCidadeId });
    setEstadoId(selectedEstadoId);
    setCidadeId(selectedCidadeId);
  };

  return (
    <div>
      <Navbar onFilter={handleFilter} />
      <ListaPostagens estadoId={estadoId} cidadeId={cidadeId} />
    </div>
  );
}
