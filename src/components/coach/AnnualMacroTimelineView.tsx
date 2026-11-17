// =====================================================================
// NEYEN ATHLETIC - VISTA ANUAL DE 52 SEMANAS DEL MACROCICLO
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { IconInterface } from '../ui/icons/IconInterface';

export const AnnualMacroTimelineView: React.FC = () => {
  const { atletaActual } = useTraining();
  const [mesoFiltro, setMesoFiltro] = useState<number | 'TODOS'>('TODOS');

  // Generamos las 52 semanas mapeadas a partir del 15/12/2025
  const semanasDelAnio = Array.from({ length: 52 }, (_, i) => {
    const numSemana = i + 1;
    const numMeso = Math.floor(i / 4) + 1; // 13 Mesos de 4 semanas

    let periodoNombre = 'Preparación Física General';
    if (numMeso <= 3) {
      periodoNombre = 'Adaptación e Hipertrofia';
    } else if (numMeso <= 6) {
      periodoNombre = 'Fuerza Máxima';
    } else if (numMeso <= 9) {
      periodoNombre = 'Conversión a Potencia';
    } else if (numMeso <= 12) {
      periodoNombre = 'Competencia y Mantenimiento';
    } else {
      periodoNombre = 'Transición y Descarga';
    }

    const fechaInicio = new Date(2025, 11, 15 + i * 7);
    const fechaString = `${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getFullYear()}`;

    let evento = null;
    if (numSemana === 1) evento = 'Diagnóstico Inicial';
    if (numSemana === 16) evento = 'Evaluación 2 (Potencia)';
    if (numSemana === 28) evento = 'Torneo Apertura';
    if (numSemana === 44) evento = 'Playoffs Nacionales';

    return {
      numSemana,
      numMeso,
      periodoNombre,
      fechaString,
      evento,
      rpeObjetivo: numSemana % 4 === 0 ? 5 : 7 + (numSemana % 3),
      esActivo: numMeso === 4,
    };
  });

  const semanasFiltradas =
    mesoFiltro === 'TODOS'
      ? semanasDelAnio
      : semanasDelAnio.filter((s) => s.numMeso === mesoFiltro);

  return (
    <div className="space-y-4">
      {/* Cabecera */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm font-bold text-[var(--mut)]">
            Macrociclo Anual › {atletaActual.nombreCompleto}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Periodización de 52 Semanas</h1>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="select-filtro-mesociclo" className="text-xs font-bold text-[var(--mut)] shrink-0">
            Filtrar:
          </label>
          <select
            id="select-filtro-mesociclo"
            value={mesoFiltro}
            onChange={(e) =>
              setMesoFiltro(e.target.value === 'TODOS' ? 'TODOS' : parseInt(e.target.value))
            }
            className="h-10 px-3 rounded-xl border-2 border-[var(--bord)] bg-[var(--surf)] text-[var(--txt)] text-xs font-bold outline-hidden cursor-pointer"
          >
            <option value="TODOS">52 Semanas (Año Completo)</option>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Mesociclo {i + 1} {i + 1 === 4 ? '(Activo)' : ''}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Resumen de Fases Anuales */}
      <section aria-label="Fases del macrociclo" className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs">
        <div className="rounded-xl border border-[var(--bord)] bg-[var(--surf)] p-3">
          <span className="font-bold text-[var(--txt)] block">Mesos 1 - 3</span>
          <p className="font-bold text-[var(--mut)] mt-0.5">Adaptación</p>
          <span className="text-xs text-[var(--mut)] block mt-0.5">70-75% 1RM</span>
        </div>
        <div className="rounded-xl border-2 border-[#F92424] bg-[var(--surf)] p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[#F92424] block">Mesos 4 - 6</span>
            <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-[#F92424] text-white">ACTIVO</span>
          </div>
          <p className="font-bold text-[var(--txt)] mt-0.5">Fuerza Máxima</p>
          <span className="text-xs text-[var(--mut)] block mt-0.5">80-90% 1RM</span>
        </div>
        <div className="rounded-xl border border-[var(--bord)] bg-[var(--surf)] p-3">
          <span className="font-bold text-[var(--txt)] block">Mesos 7 - 9</span>
          <p className="font-bold text-[var(--mut)] mt-0.5">Potencia</p>
          <span className="text-xs text-[var(--mut)] block mt-0.5">Velocidad / Pliometría</span>
        </div>
        <div className="rounded-xl border border-[var(--bord)] bg-[var(--surf)] p-3">
          <span className="font-bold text-[var(--txt)] block">Mesos 10 - 12</span>
          <p className="font-bold text-[var(--mut)] mt-0.5">Competencia</p>
          <span className="text-xs text-[var(--mut)] block mt-0.5">Picos & Tapering</span>
        </div>
        <div className="rounded-xl border border-[var(--bord)] bg-[var(--surf)] p-3">
          <span className="font-bold text-[var(--txt)] block">Meso 13</span>
          <p className="font-bold text-[var(--mut)] mt-0.5">Descarga</p>
          <span className="text-xs text-[var(--mut)] block mt-0.5">Regeneración</span>
        </div>
      </section>

      {/* Grid Calendario de las 52 Semanas */}
      <section
        aria-labelledby="titulo-cronograma-semanas"
        className="rounded-2xl border border-[var(--bord)] bg-[var(--surf)] p-4 sm:p-5 space-y-3 shadow-2xs"
      >
        <div className="flex items-center justify-between border-b border-[var(--bord)] pb-2.5">
          <h2 id="titulo-cronograma-semanas" className="text-sm font-bold flex items-center gap-2">
            <IconInterface name="calendar" size={16} />
            <span>Cronograma de Microciclos Semanales</span>
          </h2>
          <span className="text-xs text-[var(--mut)] font-bold">
            Mostrando {semanasFiltradas.length} semanas
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {semanasFiltradas.map((sem) => (
            <div
              key={sem.numSemana}
              className={`flex flex-col justify-between rounded-xl border p-2.5 transition text-xs ${
                sem.esActivo
                  ? 'border-[#F92424] bg-[var(--bg)] shadow-2xs'
                  : sem.evento
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30'
                  : 'border-[var(--bord)] bg-[var(--bg)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Micro #{sem.numSemana}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-extrabold text-xs ${
                      sem.esActivo ? 'bg-[#F92424] text-white' : 'bg-[var(--surf)] text-[var(--mut)]'
                    }`}
                  >
                    M{sem.numMeso}
                  </span>
                </div>

                <p className="mt-1 font-mono text-xs text-[var(--mut)]">{sem.fechaString}</p>

                {sem.evento ? (
                  <div className="mt-1.5 rounded-md bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 text-xs font-bold text-amber-900 dark:text-amber-200 truncate">
                    ★ {sem.evento}
                  </div>
                ) : sem.numSemana % 4 === 0 ? (
                  <div className="mt-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Descarga (-30%)
                  </div>
                ) : (
                  <div className="mt-1.5 text-xs text-[var(--mut)]">
                    RPE: {sem.rpeObjetivo}/10
                  </div>
                )}
              </div>

              <div className="mt-2 border-t border-[var(--bord)] pt-1 text-xs text-[var(--mut)] truncate">
                {sem.periodoNombre}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
