// =====================================================================
// NEYEN ATHLETIC - LISTA DE ESTRUCTURA DE MESOCICLOS Y MICROCICLOS
// RESPONSABILIDAD ÚNICA: Renderizar jerarquía de mesociclos y microciclos
// =====================================================================

import React from 'react';

export const MesocycleStructureList: React.FC = () => {
  return (
    <div className="lg:col-span-7 space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-lg font-bold text-[#163832] dark:text-white">
          Estructura
        </h2>
        <button
          type="button"
          className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-1.5 font-bold text-xs text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40 transition"
        >
          + Mesociclo
        </button>
      </div>

      {/* Mesociclo 01 */}
      <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[#163832] dark:text-white">
              Mesociclo 01
            </span>
            <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-2.5 py-0.5 text-xs font-semibold text-[#163832] dark:text-[#E1ECE5]">
              [2 a 6] semanas
            </span>
          </div>
          <button
            type="button"
            className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-1 font-bold text-xs text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40"
          >
            Editar
          </button>
        </div>
        <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">
          Objetivo específico: [objetivo de fase]
        </p>

        <div className="border-t border-[#E5E2D5] dark:border-[#25524A] pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs py-1">
            <span className="font-semibold text-[#163832] dark:text-white">
              Micro 1 · [Carga progresiva] · [3 a 7] días
            </span>
            <button
              type="button"
              className="rounded-xl border border-[#163832] dark:border-[#25524A] px-3 py-1 font-bold text-xs hover:bg-[#E1ECE5]/40"
            >
              Editar
            </button>
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <span className="font-semibold text-[#163832] dark:text-white">
              Micro 2 · [Descarga] · [3 a 7] días
            </span>
            <button
              type="button"
              className="rounded-xl border border-[#163832] dark:border-[#25524A] px-3 py-1 font-bold text-xs hover:bg-[#E1ECE5]/40"
            >
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Mesociclo 02 */}
      <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[#163832] dark:text-white">
              Mesociclo 02
            </span>
            <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-2.5 py-0.5 text-xs font-semibold text-[#163832] dark:text-[#E1ECE5]">
              [2 a 6] semanas
            </span>
          </div>
          <button
            type="button"
            className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-1 font-bold text-xs text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40"
          >
            Editar
          </button>
        </div>
        <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">
          Objetivo específico: [objetivo de fase]
        </p>

        <div className="border-t border-[#E5E2D5] dark:border-[#25524A] pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs py-1">
            <span className="font-semibold text-[#163832] dark:text-white">
              Micro 1 · [Carga progresiva] · [3 a 7] días
            </span>
            <button
              type="button"
              className="rounded-xl border border-[#163832] dark:border-[#25524A] px-3 py-1 font-bold text-xs hover:bg-[#E1ECE5]/40"
            >
              Editar
            </button>
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <span className="font-semibold text-[#163832] dark:text-white">
              Micro 2 · [Descarga] · [3 a 7] días
            </span>
            <button
              type="button"
              className="rounded-xl border border-[#163832] dark:border-[#25524A] px-3 py-1 font-bold text-xs hover:bg-[#E1ECE5]/40"
            >
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Semana suelta · sin mesociclo (Dashed border) */}
      <div className="rounded-2xl border-2 border-dashed border-[#163832] dark:border-[#25524A] p-4 flex items-center justify-between shadow-sm">
        <div>
          <span className="font-bold text-sm text-[#163832] dark:text-white block">
            Semana suelta · sin mesociclo
          </span>
          <span className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">
            Micro [n] · [objetivo semanal] · vinculado al macrociclo
          </span>
        </div>
        <button
          type="button"
          className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-1.5 font-bold text-xs text-[#163832] dark:text-white hover:bg-[#E1ECE5]/40 transition"
        >
          + Microciclo
        </button>
      </div>
    </div>
  );
};
