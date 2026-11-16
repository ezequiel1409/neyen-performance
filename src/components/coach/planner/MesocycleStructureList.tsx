// =====================================================================
// NEYEN ATHLETIC - LISTA DE ESTRUCTURA DE MESOCICLOS Y MICROCICLOS
// RESPONSABILIDAD ÚNICA: Renderizar jerarquía de mesociclos y microciclos
// =====================================================================

import React from 'react';

export const MesocycleStructureList: React.FC = () => {
  return (
    <div className="lg:col-span-7 space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-base sm:text-lg font-bold">
          Estructura
        </h2>
        <button
          type="button"
          className="rounded-xl border border-[var(--bord)] px-4 py-1.5 font-bold text-xs text-[var(--txt)] hover:bg-[var(--surf)] transition cursor-pointer"
        >
          + Mesociclo
        </button>
      </div>

      {/* Mesociclo 01 */}
      <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[var(--txt)]">
              Mesociclo 01
            </span>
            <span className="rounded-full bg-[var(--okbg)] px-2.5 py-0.5 text-xs font-bold text-[var(--oktx)]">
              [2 a 6] semanas
            </span>
          </div>
          <button
            type="button"
            className="rounded-xl border border-[var(--bord)] px-3 py-1 font-bold text-xs text-[var(--txt)] hover:bg-[var(--bg)] cursor-pointer"
          >
            Editar
          </button>
        </div>
        <p className="text-xs text-[var(--mut)]">
          Objetivo específico: [objetivo de fase]
        </p>

        <div className="border-t border-[var(--bord)] pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs py-1">
            <span className="font-semibold text-[var(--txt)]">
              Micro 1 · [Carga progresiva] · [3 a 7] días
            </span>
            <button
              type="button"
              className="rounded-xl border border-[var(--bord)] px-3 py-1 font-bold text-xs hover:bg-[var(--bg)] cursor-pointer"
            >
              Editar
            </button>
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <span className="font-semibold text-[var(--txt)]">
              Micro 2 · [Descarga] · [3 a 7] días
            </span>
            <button
              type="button"
              className="rounded-xl border border-[var(--bord)] px-3 py-1 font-bold text-xs hover:bg-[var(--bg)] cursor-pointer"
            >
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Mesociclo 02 */}
      <div className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[var(--txt)]">
              Mesociclo 02
            </span>
            <span className="rounded-full bg-[var(--okbg)] px-2.5 py-0.5 text-xs font-bold text-[var(--oktx)]">
              [2 a 6] semanas
            </span>
          </div>
          <button
            type="button"
            className="rounded-xl border border-[var(--bord)] px-3 py-1 font-bold text-xs text-[var(--txt)] hover:bg-[var(--bg)] cursor-pointer"
          >
            Editar
          </button>
        </div>
        <p className="text-xs text-[var(--mut)]">
          Objetivo específico: [objetivo de fase]
        </p>

        <div className="border-t border-[var(--bord)] pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs py-1">
            <span className="font-semibold text-[var(--txt)]">
              Micro 1 · [Carga progresiva] · [3 a 7] días
            </span>
            <button
              type="button"
              className="rounded-xl border border-[var(--bord)] px-3 py-1 font-bold text-xs hover:bg-[var(--bg)] cursor-pointer"
            >
              Editar
            </button>
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <span className="font-semibold text-[var(--txt)]">
              Micro 2 · [Descarga] · [3 a 7] días
            </span>
            <button
              type="button"
              className="rounded-xl border border-[var(--bord)] px-3 py-1 font-bold text-xs hover:bg-[var(--bg)] cursor-pointer"
            >
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Semana suelta · sin mesociclo (Dashed border) */}
      <div className="rounded-2xl border border-dashed border-[var(--bord)] bg-[var(--surf)] p-4 flex items-center justify-between shadow-2xs">
        <div>
          <span className="font-bold text-sm text-[var(--txt)] block">
            Semana suelta · sin mesociclo
          </span>
          <span className="text-xs text-[var(--mut)]">
            Micro [n] · [objetivo semanal] · vinculado al macrociclo
          </span>
        </div>
        <button
          type="button"
          className="rounded-xl border border-[var(--bord)] px-4 py-1.5 font-bold text-xs text-[var(--txt)] hover:bg-[var(--bg)] transition cursor-pointer"
        >
          + Microciclo
        </button>
      </div>
    </div>
  );
};
