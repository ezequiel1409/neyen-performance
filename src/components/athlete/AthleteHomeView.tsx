// =====================================================================
// NEYEN ATHLETIC - PANEL DEL ALUMNO (ATHLETE HOME VIEW)
// DISEÑO EXACTO FIEL A MOCKUP (IMAGEN 1) & SISTEMA DE DISEÑO (IMAGEN 3)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { ActiveWorkoutModal } from './ActiveWorkoutModal';
import { AthleteCycleModal } from './AthleteCycleModal';

interface AthleteHomeViewProps {
  onIrADescanso?: () => void;
}

export const AthleteHomeView: React.FC<AthleteHomeViewProps> = ({ onIrADescanso }) => {
  const { atletaActual, macrociclo, historialSesiones } = useTraining();

  const [modalWorkoutAbierto, setModalWorkoutAbierto] = useState<boolean>(false);
  const [modalCicloAbierto, setModalCicloAbierto] = useState<boolean>(false);

  // Sesión del día
  const sesionDelDia =
    macrociclo.mesociclos[0]?.microciclos[0]?.sesionesDeEntrenamiento[0] || {
      identificadorSesion: 'SES-01',
      nombreSesion: 'Sesión 1 - Fuerza Torso',
      duracionEstimadaMinutos: 60,
    };

  // Cálculo de métricas
  const totalSesiones = historialSesiones.length || 12;
  const cargaSemanalUA = 420;
  const horasSuenio = '7,8';
  const hrvMs = 68;

  // Estado de recuperación
  const estadoRecuperacion = 'Óptimo para alta intensidad';

  return (
    <div className="space-y-6">
      {/* =====================================================================
          CABECERA: PANEL DEL ALUMNO | Hola, [Nombre] | Semana 02 de 52 | Avatar
          ===================================================================== */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1D2B24]/60 dark:text-[#9EB5B0] block mb-0.5">
            PANEL DEL ALUMNO
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D2B24] dark:text-white tracking-tight">
            Hola, {atletaActual.nombreCompleto.split(' ')[0]}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#E3EFE7] dark:bg-[#1C4439] px-4 py-1.5 text-xs font-bold text-[#1D2B24] dark:text-[#E3EFE7] shadow-xs">
            Semana 02 de 52
          </span>
          <div
            className="h-10 w-10 rounded-full bg-[#DCE9F4] dark:bg-[#1B3E4F] flex items-center justify-center font-bold text-xs text-[#1F5FA0] dark:text-[#8CC2F5] shadow-xs border border-white/50"
            title={atletaActual.nombreCompleto}
          >
            {atletaActual.nombreCompleto.charAt(0)}
          </div>
        </div>
      </div>

      {/* =====================================================================
          FILA 1: 4 TARJETAS DE MÉTRICAS CLAVE
          ===================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Sesiones hechas */}
        <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#244E43] bg-white dark:bg-[#15332B] p-4 sm:p-5 shadow-xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#1D2B24]/60 dark:text-[#9EB5B0]">
            SESIONES HECHAS
          </span>
          <span className="block text-3xl sm:text-4xl font-extrabold text-[#1D2B24] dark:text-white my-1 tracking-tight">
            {String(totalSesiones).padStart(2, '0')}
          </span>
          <span className="block text-xs text-[#1D2B24]/60 dark:text-[#9EB5B0]">
            esta temporada
          </span>
        </div>

        {/* Card 2: Carga semanal */}
        <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#244E43] bg-white dark:bg-[#15332B] p-4 sm:p-5 shadow-xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#1D2B24]/60 dark:text-[#9EB5B0]">
            CARGA SEMANAL
          </span>
          <span className="block text-3xl sm:text-4xl font-extrabold text-[#1D2B24] dark:text-white my-1 tracking-tight">
            {cargaSemanalUA} UA
          </span>
          <span className="block text-xs text-[#1D2B24]/60 dark:text-[#9EB5B0]">
            sRPE × minutos
          </span>
        </div>

        {/* Card 3: Sueño */}
        <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#244E43] bg-white dark:bg-[#15332B] p-4 sm:p-5 shadow-xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#1D2B24]/60 dark:text-[#9EB5B0]">
            SUEÑO
          </span>
          <span className="block text-3xl sm:text-4xl font-extrabold text-[#1D2B24] dark:text-white my-1 tracking-tight">
            {horasSuenio} h
          </span>
          <span className="block text-xs text-[#1D2B24]/60 dark:text-[#9EB5B0]">
            última noche
          </span>
        </div>

        {/* Card 4: HRV */}
        <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#244E43] bg-white dark:bg-[#15332B] p-4 sm:p-5 shadow-xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#1D2B24]/60 dark:text-[#9EB5B0]">
            HRV
          </span>
          <span className="block text-3xl sm:text-4xl font-extrabold text-[#1D2B24] dark:text-white my-1 tracking-tight">
            {hrvMs} ms
          </span>
          <span className="block text-xs text-[#1D2B24]/60 dark:text-[#9EB5B0]">
            recuperación
          </span>
        </div>
      </div>

      {/* =====================================================================
          FILA 2: SESIÓN PROGRAMADA (IZQUIERDA) & RECUPERACIÓN (DERECHA)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Tarjeta Sesión Programada */}
        <div className="lg:col-span-8 rounded-2xl border-2 border-[#E5E2D5] dark:border-[#244E43] bg-white dark:bg-[#15332B] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="rounded-full bg-[#E3EFE7] dark:bg-[#1C4439] text-[#2F6B4F] dark:text-[#A3D9BE] px-3 py-1 text-[11px] font-bold inline-block mb-1.5">
                SESIÓN PROGRAMADA · ~{sesionDelDia.duracionEstimadaMinutos || 60} min
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1D2B24] dark:text-white tracking-tight">
                {sesionDelDia.nombreSesion}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setModalWorkoutAbierto(true)}
              className="rounded-2xl bg-[#2F6B4F] hover:bg-[#265740] active:scale-[0.99] text-white font-extrabold text-sm px-6 py-3 shadow-md transition self-start sm:self-auto min-h-[48px]"
            >
              Comenzar entrenamiento
            </button>
          </div>

          {/* 3 Bloques de la sesión */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="rounded-xl bg-[#F4F8F5] dark:bg-[#0F231D] p-3.5 border border-[#E3EFE7] dark:border-[#244E43]">
              <span className="block font-bold text-xs text-[#1D2B24] dark:text-white">
                Bloque A
              </span>
              <span className="block text-xs text-[#1D2B24]/70 dark:text-[#9EB5B0] mt-0.5 font-medium">
                Sentadilla · 4 × 6 · 90 kg
              </span>
            </div>

            <div className="rounded-xl bg-[#F4F8F5] dark:bg-[#0F231D] p-3.5 border border-[#E3EFE7] dark:border-[#244E43]">
              <span className="block font-bold text-xs text-[#1D2B24] dark:text-white">
                Bloque B
              </span>
              <span className="block text-xs text-[#1D2B24]/70 dark:text-[#9EB5B0] mt-0.5 font-medium">
                Press Pecho · 4 × 6 · 110 kg
              </span>
            </div>

            <div className="rounded-xl bg-[#F4F8F5] dark:bg-[#0F231D] p-3.5 border border-[#E3EFE7] dark:border-[#244E43]">
              <span className="block font-bold text-xs text-[#1D2B24] dark:text-white">
                Bloque C
              </span>
              <span className="block text-xs text-[#1D2B24]/70 dark:text-[#9EB5B0] mt-0.5 font-medium">
                Hip Thrust · 3 × 10 · 130 kg
              </span>
            </div>
          </div>
        </div>

        {/* Tarjeta Recuperación (Cielo #DCE9F4) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#DCE9F4] dark:bg-[#16384C] p-5 sm:p-6 border border-[#B8D7ED] dark:border-[#28556D] flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#1F5FA0] dark:text-[#8CC2F5]">
              RECUPERACIÓN
            </span>
            <h3 className="text-xl font-extrabold text-[#1D2B24] dark:text-white mt-1 mb-2">
              {estadoRecuperacion}
            </h3>
            <p className="text-xs text-[#1D2B24]/80 dark:text-[#CFE7F8] leading-relaxed">
              Sincronizado desde tu reloj. Tocá para ver el detalle del sueño.
            </p>
          </div>

          <button
            type="button"
            onClick={onIrADescanso}
            className="rounded-xl border-2 border-[#1F5FA0] dark:border-[#8CC2F5] text-[#1F5FA0] dark:text-[#8CC2F5] bg-white dark:bg-[#0F231D] px-5 py-2.5 font-bold text-xs hover:bg-[#DCE9F4]/50 dark:hover:bg-[#1B3E4F] transition self-start min-h-[44px]"
          >
            Ver descanso
          </button>
        </div>
      </div>

      {/* =====================================================================
          FILA 3: CARGA DE LA SEMANA (BAR CHART) & MACROCICLO (13 MESOS)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carga de la Semana */}
        <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#244E43] bg-white dark:bg-[#15332B] p-5 sm:p-6 shadow-xs space-y-4">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#1D2B24]/60 dark:text-[#9EB5B0]">
            CARGA DE LA SEMANA
          </span>

          <div className="h-40 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { dia: 'L', pct: 40, highlight: false },
              { dia: 'M', pct: 70, highlight: false },
              { dia: 'X', pct: 50, highlight: false },
              { dia: 'J', pct: 95, highlight: true }, // Hoy
              { dia: 'V', pct: 30, highlight: false },
              { dia: 'S', pct: 0, highlight: false },
              { dia: 'D', pct: 0, highlight: false },
            ].map((col) => (
              <div key={col.dia} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center h-28">
                  {col.pct > 0 ? (
                    <div
                      style={{ height: `${col.pct}%` }}
                      className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${
                        col.highlight
                          ? 'bg-[#2F6B4F] dark:bg-[#3A8261]'
                          : 'bg-[#C5DFD0] dark:bg-[#20493E]'
                      }`}
                    />
                  ) : (
                    <div className="w-full h-1 bg-transparent" />
                  )}
                </div>
                <span className="text-xs font-bold text-[#1D2B24]/70 dark:text-[#9EB5B0]">
                  {col.dia}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Macrociclo · 13 Mesociclos */}
        <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#244E43] bg-white dark:bg-[#15332B] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#1D2B24]/60 dark:text-[#9EB5B0] mb-4">
              MACROCICLO · 13 MESOCICLOS
            </span>

            {/* Fila de 13 pastillas de mesociclos */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { n: 1, estado: 'COMPLETO' },
                { n: 2, estado: 'COMPLETO' },
                { n: 3, estado: 'COMPLETO' },
                { n: 4, estado: 'ACTUAL' }, // Destacado en Arena #F4C98B
                { n: 5, estado: 'FUTURO' },
                { n: 6, estado: 'FUTURO' },
                { n: 7, estado: 'FUTURO' },
                { n: 8, estado: 'FUTURO' },
                { n: 9, estado: 'FUTURO' },
                { n: 10, estado: 'FUTURO' },
                { n: 11, estado: 'FUTURO' },
                { n: 12, estado: 'FUTURO' },
                { n: 13, estado: 'FUTURO' },
              ].map((m) => {
                let bgClass = 'bg-[#D5E7DC] dark:bg-[#1F4A3C]';
                if (m.estado === 'COMPLETO') {
                  bgClass = 'bg-[#2F6B4F] dark:bg-[#3A8261]';
                } else if (m.estado === 'ACTUAL') {
                  bgClass = 'bg-[#F4C98B] ring-2 ring-[#F4C98B]/50';
                }

                return (
                  <div
                    key={m.n}
                    className={`h-3.5 w-6 sm:w-7 rounded-full ${bgClass} transition`}
                    title={`Mesociclo ${m.n} (${m.estado})`}
                  />
                );
              })}
            </div>
          </div>

          <p className="text-xs text-[#1D2B24]/70 dark:text-[#9EB5B0] leading-relaxed pt-2">
            Mesociclo actual destacado en arena · objetivo: Fuerza máxima e hipertrofia funcional.
          </p>
        </div>
      </div>

      {/* Modal de entrenamiento en vivo */}
      {modalWorkoutAbierto && (
        <ActiveWorkoutModal
          sesion={sesionDelDia}
          onCerrar={() => setModalWorkoutAbierto(false)}
        />
      )}

      {/* Modal de ciclo femenino */}
      <AthleteCycleModal
        isOpen={modalCicloAbierto}
        onClose={() => setModalCicloAbierto(false)}
      />
    </div>
  );
};
