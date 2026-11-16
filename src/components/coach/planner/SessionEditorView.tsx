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
          <span className="text-xs font-bold text-[var(--mut)] block">
            Macrociclo &gt; Mesociclo 05 &gt; Semana 02 &gt; Lunes
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
            Editor de sesión
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAgregarBloque}
            className="rounded-xl border-2 border-[var(--link)] text-[var(--link)] hover:bg-[var(--link)] hover:text-white font-bold text-xs sm:text-sm px-4 py-2 transition min-h-[44px] cursor-pointer"
          >
            + Agregar bloque
          </button>
          <button
            type="button"
            onClick={onGuardarSesion}
            className="rounded-xl bg-[var(--navbg)] text-[var(--navon)] hover:opacity-95 font-extrabold text-xs sm:text-sm px-5 py-2 shadow-2xs transition min-h-[44px] cursor-pointer"
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
