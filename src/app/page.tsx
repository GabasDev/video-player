"use client"; // Necessário para usar useState no App Router

import { useState } from "react";

export default function Home() {
  const [contador, setContador] = useState(0);
  const [historico, setHistorico] = useState([]);

  const incrementar = () => {
    setContador(contador + 1);
  };

  const decrementar = () => {
    setContador(contador - 1);
  };

  const salvarHistorico = () => {
    setHistorico([...historico, contador]);
  };

  const limparHistorico = () => {
    setHistorico([]);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Exemplo com useState - Next.js</h1>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={decrementar}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow"
        >
          -1
        </button>

        <span className="text-xl font-semibold">{contador}</span>

        <button
          onClick={incrementar}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow"
        >
          +1
        </button>
      </div>

      <button
        onClick={salvarHistorico}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
      >
        Salvar no Histórico
      </button>

      {historico.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">Histórico:</h2>
          <ul className="mb-4">
            {historico.map((item, index) => (
              <li key={index} className="text-sm text-gray-700">
                Valor salvo #{index + 1}: {item}
              </li>
            ))}
          </ul>

          <button
            onClick={limparHistorico}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow"
          >
            Limpar Histórico
          </button>
        </>
      )}
    </main>
  );
}
