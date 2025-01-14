"use client";

import Link from "next/link";
import Image from "next/image";

export default function SaibaMais() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative flex items-center justify-center h-[50vh]">
        <Image
          src="cidadania.jpg"
          alt="Cenário urbano"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
          className="z-0"
        />
        <div className="absolute bg-black bg-opacity-50 text-white p-8 rounded-lg text-center max-w-3xl z-10">
          <h1 className="text-4xl font-bold mb-4">Por que Relatar Problemas?</h1>
          <p className="text-lg">
            Relatar problemas em vias públicas é um ato de cidadania. Ajude a
            melhorar a infraestrutura da sua cidade e facilite a vida de todos!
          </p>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">O que Fazemos?</h2>
          <p className="text-gray-700 text-lg mb-12">
            Nossa plataforma conecta cidadãos com autoridades locais para
            identificar e resolver problemas urbanos. Com relatos detalhados e
            localização precisa, juntos construímos um ambiente mais seguro e
            funcional.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Apoio à Comunidade</h3>
              <p className="text-gray-600">
                Facilitamos o diálogo entre moradores e prefeituras para atender
                demandas locais com mais agilidade.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Transparência</h3>
              <p className="text-gray-600">
                Todas as postagens são públicas, promovendo responsabilidade e
                engajamento.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Facilidade de Uso</h3>
              <p className="text-gray-600">
                Com poucos cliques, você pode registrar um problema e acompanhar
                sua resolução.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Crie uma Conta</h3>
              <p className="text-gray-600">
                Cadastre-se gratuitamente e faça parte da nossa comunidade de
                cidadãos ativos.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Relate um Problema</h3>
              <p className="text-gray-600">
                Envie fotos, escolha a localização e descreva o problema para
                que seja solucionado.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Acompanhe</h3>
              <p className="text-gray-600">
                Veja o status da sua solicitação e interaja com outros
                usuários.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-blue-500 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Junte-se a Nós!</h2>
          <p className="text-lg mb-8">
            Faça parte da mudança que deseja ver na sua cidade. Cadastre-se
            agora e comece a relatar problemas na sua região.
          </p>
          <Link href="/registro">
            <p className="bg-white text-blue-500 hover:text-blue-600 py-2 px-6 rounded-lg text-lg font-semibold inline-block">
              Registrar Agora
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
