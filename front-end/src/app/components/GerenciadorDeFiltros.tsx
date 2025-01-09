"use client";

import { useState } from "react";
import ListaPostagens from "./ListarPostagens";
import Navbar from "./Navbar";

export default function GerenciadorDeFiltros() {
  const [estadoId, setEstadoId] = useState<number | null>(null);
  const [cidadeId, setCidadeId] = useState<number | null>(null);

  const handleFilter = (selectedEstadoId: number | null, selectedCidadeId: number | null) => {
    setEstadoId(selectedEstadoId);
    setCidadeId(selectedCidadeId);
  };

  const handleRemoveFilters = () => {
    setEstadoId(null);
    setCidadeId(null);
  };

  return (
    <>
      <Navbar onFiltrar={handleFilter} onRemoverFiltro={handleRemoveFilters} />
      <ListaPostagens estadoId={estadoId} cidadeId={cidadeId} />
    </>
  );
}
