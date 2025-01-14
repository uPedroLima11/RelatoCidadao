"use client";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="text-white text-lg font-bold mb-4 md:mb-0">
          Relato Cidadão
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
