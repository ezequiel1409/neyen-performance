// =====================================================================
// NEYEN ATHLETIC - TARJETA DE CONFIGURACIÓN DE MACROCICLO
// RESPONSABILIDAD ÚNICA: Configurar nombre, objetivo general y semanas del macrociclo
// =====================================================================

import React from 'react';

interface MacrocycleCardProps {
  nombreMacrociclo: string;
  setNombreMacrociclo: (nombre: string) => void;
  objetivoGeneral: string;
  setObjetivoGeneral: (obj: string) => void;
  duracionSemanas: number;
  setDuracionSemanas: (semanas: number) => void;
  usarMesociclos: boolean;
  setUsarMesociclos: (usar: boolean) => void;
}

export const MacrocycleCard: React.FC<MacrocycleCardProps> = ({
  nombreMacrociclo,
  setNombreMacrociclo,
  objetivoGeneral,
  setObjetivoGeneral,
  duracionSemanas,
  setDuracionSemanas,
  usarMesociclos,
  setUsarMesociclos,
}) => {
  return (
    <div className="lg:col-span-5 rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-5 space-y-4 shadow-2xs">
      <h2 className="text-base sm:text-lg font-bold">
        Macrociclo
      </h2>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-[var(--mut)]">
          Nombre
        </label>
        <input
          type="text"
          value={nombreMacrociclo}
          onChange={(e) => setNombreMacrociclo(e.target.value)}
          placeholder="[Temporada 2025-2026]"
          className="w-full rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] px-3.5 py-2.5 text-sm font-semibold text-[var(--txt)] focus:border-[var(--link)] outline-hidden"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-[var(--mut)]">
          Objetivo general
        </label>
        <textarea
          rows={4}
          value={objetivoGeneral}
          onChange={(e) => setObjetivoGeneral(e.target.value)}
          className="w-full rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] p-3 text-sm text-[var(--txt)] focus:border-[var(--link)] outline-hidden leading-relaxed"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-[var(--mut)]">
          Duración (semanas)
        </label>
        <input
          type="number"
          value={duracionSemanas}
          onChange={(e) => setDuracionSemanas(parseInt(e.target.value) || 52)}
          className="w-full rounded-xl border-2 border-[var(--bord)] bg-[var(--bg)] px-3.5 py-2.5 text-sm font-semibold text-[var(--txt)] focus:border-[var(--link)] outline-hidden"
        />
      </div>

      {/* Switch: Usar mesociclos (opcional) */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={usarMesociclos}
            onClick={() => setUsarMesociclos(!usarMesociclos)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out ${
              usarMesociclos
                ? 'bg-[var(--navbg)]'
                : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-2xs ring-0 transition duration-200 ease-in-out ${
                usarMesociclos ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="font-bold text-sm text-[var(--txt)]">
            Usar mesociclos (opcional)
          </span>
        </div>
        <p className="text-xs text-[var(--mut)] leading-relaxed">
          Sin mesociclos, cada microciclo se vincula directo al macrociclo: útil para semanas de transición o programas exprés.
        </p>
      </div>
    </div>
  );
};
