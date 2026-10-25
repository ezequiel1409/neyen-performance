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
    <div className="lg:col-span-5 rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-5 space-y-4 shadow-sm">
      <h2 className="text-lg font-bold text-[#163832] dark:text-white">
        Macrociclo
      </h2>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0]">
          Nombre
        </label>
        <input
          type="text"
          value={nombreMacrociclo}
          onChange={(e) => setNombreMacrociclo(e.target.value)}
          placeholder="[Temporada 2025-2026]"
          className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm font-semibold text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0]"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0]">
          Objetivo general
        </label>
        <textarea
          rows={4}
          value={objetivoGeneral}
          onChange={(e) => setObjetivoGeneral(e.target.value)}
          className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] p-3 text-sm text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0]"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0]">
          Duración (semanas)
        </label>
        <input
          type="number"
          value={duracionSemanas}
          onChange={(e) => setDuracionSemanas(parseInt(e.target.value) || 52)}
          className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm font-semibold text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0]"
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
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out ${
              usarMesociclos
                ? 'bg-[#163832] dark:bg-[#2F6B4F]'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white dark:bg-[#102824] shadow ring-0 transition duration-200 ease-in-out ${
                usarMesociclos ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="font-bold text-sm text-[#163832] dark:text-white">
            Usar mesociclos (opcional)
          </span>
        </div>
        <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] leading-relaxed">
          Sin mesociclos, cada microciclo se vincula directo al macrociclo: útil para semanas de transición o programas exprés.
        </p>
      </div>
    </div>
  );
};
