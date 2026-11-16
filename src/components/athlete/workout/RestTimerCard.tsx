// =====================================================================
// NEYIMA ATHLETIC - TARJETA DE DESCANSO INTER-SERIE v2
// RESPONSABILIDAD ÚNICA: Temporizador de descanso con cuenta regresiva
// =====================================================================

import React from 'react';

interface RestTimerCardProps {
  descansoActivo: boolean;
  tiempoRestanteFormateado: string;
  onIniciarOReiniciar: (segundos: number) => void;
}

export const RestTimerCard: React.FC<RestTimerCardProps> = ({
  descansoActivo,
  tiempoRestanteFormateado,
  onIniciarOReiniciar,
}) => {
  return (
    <div className="rounded-xl border border-[var(--bord)] bg-[var(--surf)] p-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-1.5">
        <span className="font-extrabold text-[var(--txt)] text-sm">Descanso</span>
        <span className="text-xs text-[var(--mut)]">opcional</span>
        {descansoActivo && (
          <span className="ml-2 font-mono font-extrabold text-sm text-[var(--acc)] animate-pulse">
            {tiempoRestanteFormateado}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onIniciarOReiniciar(90)}
        className="rounded-xl border-2 border-[var(--link)] px-4 py-2 font-bold text-sm text-[var(--link)] bg-transparent hover:bg-[var(--bg)] active:scale-95 transition cursor-pointer"
      >
        {descansoActivo ? 'Reiniciar 01:30' : 'Iniciar 01:30'}
      </button>
    </div>
  );
};
