// =====================================================================
// NEYEN ATHLETIC - TARJETA DE METADATOS DE SESIÓN EN PLANIFICADOR
// RESPONSABILIDAD ÚNICA: Capturar nombre, duración estimada y RPE objetivo
// =====================================================================

import React from 'react';

interface SessionMetadataCardProps {
  nombreSesion: string;
  setNombreSesion: (nombre: string) => void;
  duracionMinutos: number;
  setDuracionMinutos: (duracion: number) => void;
  rpeObjetivo: number;
  setRpeObjetivo: (rpe: number) => void;
}

export const SessionMetadataCard: React.FC<SessionMetadataCardProps> = ({
  nombreSesion,
  setNombreSesion,
  duracionMinutos,
  setDuracionMinutos,
  rpeObjetivo,
  setRpeObjetivo,
}) => {
  return (
    <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
      <div>
        <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
          Nombre de la sesión
        </label>
        <input
          type="text"
          value={nombreSesion}
          onChange={(e) => setNombreSesion(e.target.value)}
          placeholder="[Sesión]"
          className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm font-bold text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
          Duración estimada (min)
        </label>
        <input
          type="number"
          value={duracionMinutos}
          onChange={(e) => setDuracionMinutos(parseInt(e.target.value) || 0)}
          placeholder="00"
          className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm font-bold text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#163832] dark:text-[#9EB5B0] mb-1">
          RPE objetivo
        </label>
        <input
          type="number"
          value={rpeObjetivo}
          onChange={(e) => setRpeObjetivo(parseInt(e.target.value) || 0)}
          placeholder="0"
          className="w-full rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] px-3.5 py-2.5 text-sm font-bold text-[#163832] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F5FA0]"
        />
      </div>
    </div>
  );
};
