"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./components/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/pagina-logada");
    }
  }, [isAuthenticated, router]);

  return (
    <div>
      <div className="relative flex items-center justify-center h-[60vh]">
        <Image
          src="/buracorua2.jpg"
          alt="Cenário urbano com problemas"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0"
        />
        <div className="absolute bg-black bg-opacity-50 text-white p-8 rounded-lg text-center max-w-2xl z-10">
          <h1 className="text-4xl font-bold mb-4">Sua voz transforma a cidade!</h1>
          <p className="text-lg mb-6">
            Ajude a melhorar nossa cidade relatando problemas. É rápido, fácil e faz toda a diferença.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/registro">
              <p className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 md:py-2 md:px-6 rounded text-sm md:text-base">
                Registre-se Agora
              </p>
            </Link>
            <Link href="/saiba-mais">
              <p className="bg-gray-700 hover:bg-gray-800 text-white py-1 px-4 md:py-2 md:px-6 rounded text-sm md:text-base">
                Saiba Mais
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-xl mb-2">Registre o Problema</h3>
              <p className="text-gray-600">
                Faça upload de fotos e descreva o problema em detalhes. É simples e rápido!
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-xl mb-2">Acompanhe a Resolução</h3>
              <p className="text-gray-600">
                Veja o status das suas postagens e acompanhe a resposta das autoridades.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-xl mb-2">Transforme Sua Cidade</h3>
              <p className="text-gray-600">
                Ajude a melhorar a infraestrutura urbana, tornando a cidade um lugar melhor para todos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">O Que Nossos Usuários Dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <p className="text-gray-700 italic mb-4">
                &quot;Relatei um buraco enorme na minha rua e em menos de uma semana já estava resolvido!&quot;
              </p>
              <h4 className="font-semibold text-lg">Maria Silva</h4>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <p className="text-gray-700 italic mb-4">
                &quot;Muito fácil de usar! Recomendo a todos que queiram ajudar suas comunidades.&quot;
              </p>
              <h4 className="font-semibold text-lg">João Pereira</h4>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <p className="text-gray-700 italic mb-4">
                &quot;A plataforma é incrível e realmente faz a diferença!&quot;
              </p>
              <h4 className="font-semibold text-lg">Ana Souza</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-blue-500 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Nosso Impacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-4xl font-bold">1.245</h3>
              <p className="mt-2">Problemas Resolvidos</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">4.678</h3>
              <p className="mt-2">Postagens Criadas</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">3.234</h3>
              <p className="mt-2">Usuários Registrados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-800 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para Fazer a Diferença?</h2>
        <p className="text-lg mb-8">
          Junte-se a nós e transforme sua cidade. Sua voz importa!
        </p>
        <Link href="/registro">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg text-lg">
            Comece Agora
          </button>
        </Link>
      </div>
    </div>
  );
}
