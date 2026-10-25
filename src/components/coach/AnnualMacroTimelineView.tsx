// =====================================================================
// NEYEN ATHLETIC - VISTA ANUAL DE 52 SEMANAS DEL MACROCICLO
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  Calendar,
  Layers,
  Trophy,
} from 'lucide-react';

export const AnnualMacroTimelineView: React.FC = () => {
  const { atletaActual } = useTraining();
  const [mesoFiltro, setMesoFiltro] = useState<number | 'TODOS'>('TODOS');

  // Generamos las 52 semanas mapeadas a partir del 15/12/2025
  const semanasDelAnio = Array.from({ length: 52 }, (_, i) => {
    const numSemana = i + 1;
    const numMeso = Math.floor(i / 4) + 1; // 13 Mesos de 4 semanas

    // Nombres temáticos de periodos
    let periodoNombre = 'Preparación Física General';
    let colorFase = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    if (numMeso <= 3) {
      periodoNombre = 'Adaptación e Hipertrofia';
      colorFase = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    } else if (numMeso <= 6) {
      periodoNombre = 'Fuerza Máxima';
      colorFase = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    } else if (numMeso <= 9) {
      periodoNombre = 'Conversión a Potencia';
      colorFase = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    } else if (numMeso <= 12) {
      periodoNombre = 'Competencia y Mantenimiento';
      colorFase = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    } else {
      periodoNombre = 'Transición y Descarga';
      colorFase = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }

    // Fechas semanales
    const fechaInicio = new Date(2025, 11, 15 + i * 7);
    const fechaString = `${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getFullYear()}`;

    // Eventos clave de la planilla
    let evento = null;
    if (numSemana === 1) evento = 'Diagnóstico Inicial';
    if (numSemana === 16) evento = 'Evaluación 2 (Potencia)';
    if (numSemana === 28) evento = 'Torneo Apertura';
    if (numSemana === 44) evento = 'Playoffs Nacionales';

    return {
      numSemana,
      numMeso,
      periodoNombre,
      colorFase,
      fechaString,
      evento,
      rpeObjetivo: numSemana % 4 === 0 ? 5 : 7 + (numSemana % 3),
    };
  });

  const semanasFiltradas =
    mesoFiltro === 'TODOS'
      ? semanasDelAnio
      : semanasDelAnio.filter((s) => s.numMeso === mesoFiltro);

  return (
    <div className="space-y-6">
      {/* Cabecera de la Vista Anual */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#163832] dark:text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[#E85938]" aria-hidden="true" />
            Macrociclo Anual: Periodización de 52 Semanas
          </h1>
          <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] mt-1">
            Vista anual consolidada para <strong className="text-[#163832] dark:text-white">{atletaActual.nombreCompleto}</strong>:
            13 mesociclos, competencias e hitos de evaluación física.
          </p>
        </div>

        {/* Selector de Mesociclo */}
        <div className="flex items-center gap-2">
          <label htmlFor="select-filtro-mesociclo" className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] font-semibold shrink-0">
            Filtrar Meso:
          </label>
          <select
            id="select-filtro-mesociclo"
            value={mesoFiltro}
            onChange={(e) =>
              setMesoFiltro(e.target.value === 'TODOS' ? 'TODOS' : parseInt(e.target.value))
            }
            className="min-h-[44px] rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#163630] px-3.5 py-2 text-xs font-semibold text-[#163832] dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E85938]"
          >
            <option value="TODOS">Ver las 52 Semanas (Año Completo)</option>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Mesociclo {i + 1}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Resumen de Fases Anuales (Bloques de Temporada) */}
      <section aria-label="Fases del macrociclo" className="grid grid-cols-2 gap-3 sm:grid-cols-5 text-xs">
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5">
          <span className="font-bold text-blue-400 block">Mesos 1 - 3</span>
          <p className="mt-1 font-semibold text-white">Adaptación & Hipertrofia</p>
          <span className="text-xs text-slate-400 block mt-0.5">Volumen alto / 70-75% 1RM</span>
        </div>
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3.5">
          <span className="font-bold text-indigo-400 block">Mesos 4 - 6</span>
          <p className="mt-1 font-semibold text-white">Fuerza Máxima</p>
          <span className="text-xs text-slate-400 block mt-0.5">Intensidad alta / 80-90% 1RM</span>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
          <span className="font-bold text-amber-400 block">Mesos 7 - 9</span>
          <p className="mt-1 font-semibold text-white">Conversión a Potencia</p>
          <span className="text-xs text-slate-400 block mt-0.5">Velocidad / Pliometría</span>
        </div>
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5">
          <span className="font-bold text-rose-400 block">Mesos 10 - 12</span>
          <p className="mt-1 font-semibold text-white">Competitivo Oficial</p>
          <span className="text-xs text-slate-400 block mt-0.5">Picos de forma & Tapering</span>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
          <span className="font-bold text-emerald-400 block">Meso 13</span>
          <p className="mt-1 font-semibold text-white">Transición / Descarga</p>
          <span className="text-xs text-slate-400 block mt-0.5">Regeneración activa</span>
        </div>
      </section>

      {/* Grid Calendario de las 52 Semanas */}
      <section
        aria-labelledby="titulo-cronograma-semanas"
        className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 id="titulo-cronograma-semanas" className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" aria-hidden="true" />
            Cronograma de Microciclos Semanales (2025 - 2026)
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            Mostrando {semanasFiltradas.length} semanas
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {semanasFiltradas.map((sem) => (
            <div
              key={sem.numSemana}
              className={`flex flex-col justify-between rounded-xl border p-3.5 transition ${
                sem.evento
                  ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                  : sem.numSemana % 4 === 0
                  ? 'border-emerald-500/30 bg-emerald-950/20'
                  : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Micro #{sem.numSemana}</span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300 font-semibold">
                    M{sem.numMeso}
                  </span>
                </div>

                <p className="mt-1 font-mono text-xs text-slate-400">{sem.fechaString}</p>

                {sem.evento ? (
                  <div className="mt-2 rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-300 flex items-center gap-1 border border-amber-500/40">
                    <Trophy className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{sem.evento}</span>
                  </div>
                ) : sem.numSemana % 4 === 0 ? (
                  <div className="mt-2 text-xs font-semibold text-emerald-400">
                    Descarga (-30%)
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-slate-400 font-semibold">
                    RPE: {sem.rpeObjetivo}/10
                  </div>
                )}
              </div>

              <div className="mt-3 border-t border-slate-800/80 pt-1.5 text-xs text-slate-400 truncate">
                {sem.periodoNombre}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
