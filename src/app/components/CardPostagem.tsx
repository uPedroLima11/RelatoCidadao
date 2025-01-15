import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CardPostagemProps {
  id: number;
  titulo: string;
  descricao: string;
  localizacao: string;
  foto: string;
  nome: string;
  estadoNome: string;
  cidadeNome: string;
}

const CardPostagem: React.FC<CardPostagemProps> = ({
  id,
  titulo,
  descricao,
  localizacao,
  foto,
  nome,
  estadoNome,
  cidadeNome,
}) => {
  const fotoUrl = foto ? `${process.env.NEXT_PUBLIC_URL_API}${foto}` : '/default-image.jpg';

  return (
    <div className="mt-10 bg-[#f8f6fa] border-gray-500 border-[0.1rem] shadow-md rounded-lg max-w-sm md:max-w-md mx-auto mb-6">
      <Image
        src={fotoUrl}
        alt="Imagem do problema"
        width={500}
        height={300}
        quality={100}
        className="w-full h-60 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold mt-2 text-center">{titulo}</h2>
        <p className="text-black font-normal mb-4" style={{ maxHeight: '140px', overflowY: 'auto' }}>
          {descricao}
        </p>
        <p className="text-black text-sm mt-1">
          <span className="font-semibold">Local:</span> {localizacao}
        </p>
        <p className="text-black text-sm mt-1">
          <span className="font-semibold">Nome:</span> {nome}
        </p>
        <p className="text-black text-sm mt-1">
          <span className="font-semibold">Estado:</span> {estadoNome}
        </p>
        <p className="text-black text-sm mt-1">
          <span className="font-semibold">Cidade:</span> {cidadeNome}
        </p>
        <div className="flex justify-end mt-4">
          <Link href={`/postagens/${id}`} className="bg-blue-500 text-white rounded-lg px-4 py-2">
            Comentários
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardPostagem;