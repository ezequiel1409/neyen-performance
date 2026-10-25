// =====================================================================
// NEYEN ATHLETIC - VISTA EDITOR DE SESIÓN EN PLANIFICADOR
// RESPONSABILIDAD ÚNICA: Orquestar la edición detallada de la sesión deportiva
// =====================================================================

import React from 'react';
import {
  BloquePrescripcionData,
  PrescriptionBlockCard,
} from './PrescriptionBlockCard';
import { SessionMetadataCard } from './SessionMetadataCard';

interface SessionEditorViewProps {
  nombreSesion: string;
  setNombreSesion: (nombre: string) => void;
  duracionMinutos: number;
  setDuracionMinutos: (duracion: number) => void;
  rpeObjetivo: number;
  setRpeObjetivo: (rpe: number) => void;
  bloquesData: BloquePrescripcionData[];
  onAgregarBloque: () => void;
  onGuardarSesion: () => void;
  onActualizarEjercicioBloque: (
    bIdx: number,
    eIdx: number,
    campo: 'series' | 'reps' | 'porcentaje' | 'rir' | 'rpe' | 'desc',
    valor: number
  ) => void;
}

export const SessionEditorView: React.FC<SessionEditorViewProps> = ({
  nombreSesion,
  setNombreSesion,
  duracionMinutos,
  setDuracionMinutos,
  rpeObjetivo,
  setRpeObjetivo,
  bloquesData,
  onAgregarBloque,
  onGuardarSesion,
  onActualizarEjercicioBloque,
}) => {
  return (
    <div className="space-y-6">
      {/* Cabecera: Breadcrumb, Título y Botones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-xs font-semibold text-[#163832]/60 dark:text-[#9EB5B0] block">
            Macrociclo &gt; Mesociclo 05 &gt; Semana 02 &gt; Lunes
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[#163832] dark:text-white mt-0.5">
            Editor de sesión
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAgregarBloque}
            className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-white font-bold text-xs px-4 py-3 bg-transparent hover:bg-[#E1ECE5]/40 transition min-h-[44px]"
          >
            + Agregar bloque
          </button>
          <button
            type="button"
            onClick={onGuardarSesion}
            className="rounded-xl bg-[#2F6B4F] hover:bg-[#265740] active:scale-[0.99] text-white font-extrabold text-xs px-6 py-3 shadow-md transition min-h-[44px]"
          >
            Guardar sesión
          </button>
        </div>
      </div>

      {/* Tarjeta de Metadatos de Sesión */}
      <SessionMetadataCard
        nombreSesion={nombreSesion}
        setNombreSesion={setNombreSesion}
        duracionMinutos={duracionMinutos}
        setDuracionMinutos={setDuracionMinutos}
        rpeObjetivo={rpeObjetivo}
        setRpeObjetivo={setRpeObjetivo}
      />

      {/* Bloques de Prescripción */}
      {bloquesData.map((bloque, bIdx) => (
        <PrescriptionBlockCard
          key={bloque.id}
          bloque={bloque}
          bIdx={bIdx}
          onActualizarEjercicio={onActualizarEjercicioBloque}
        />
      ))}
    </div>
  );
};
