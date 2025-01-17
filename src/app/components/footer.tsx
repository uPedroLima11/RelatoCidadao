"use client";

import Image from 'next/image';
import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="bg-zinc-900 py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="flex flex-col items-center mb-4 md:mb-0">
          <Link href="/" scroll={false} className="flex flex-col items-center">
            <Image
              src="/logo2.png"
              alt="logo"
              width={50}
              height={50}
              quality={100}
              priority
              className="mb-2"
            />
            <span className="text-white text-lg font-bold text-center">Relato Cidadão</span>
          </Link>
        </div>

        <div className="text-sm text-white text-center md:text-right">
          Copyright © 2024 by{" "}
          <a
            href="https://www.linkedin.com/in/upedrolima/"
            className="hover:underline font-medium"
          >
            Pedro Mendes Lima™
          </a>
        </div>
      </div>
    </footer>
  );
}
