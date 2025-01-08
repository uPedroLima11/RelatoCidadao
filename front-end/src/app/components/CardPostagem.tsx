import React from "react";

interface CardPostagemProps {
  titulo: string;
  nome: string;
  descricao: string;
  localizacao: string;
  foto: string;
  estadoNome: string;
  cidadeNome: string;
}

const CardPostagem: React.FC<CardPostagemProps> = ({
  titulo,
  nome,
  descricao,
  localizacao,
  foto,
  estadoNome,
  cidadeNome,
}) => {
  return (
    <div className="mt-10 bg-[#f8f6fa] border-gray-500 border-[0.1rem] shadow-md rounded-lg max-w-md mx-auto mb-4">
      <img
        src={foto}
        alt="Imagem do problema"
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold mt-2 text-center">{titulo}</h2>
        <p className="text-black"> {descricao}</p>
        <br />
        <p className="text-black text-sm mt-1">Local: {localizacao}</p>
        <p className="text-black text-sm mt-1">Nome: {nome}</p>
        <p className="text-black text-sm mt-1">Estado: {estadoNome}</p>
        <p className="text-black text-sm mt-1">Cidade: {cidadeNome}</p>
      </div>
    </div>
  );
};

export default CardPostagem;
  