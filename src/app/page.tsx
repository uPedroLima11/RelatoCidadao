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
  );
}
