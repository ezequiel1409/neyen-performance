// =====================================================================
// NEYEN ATHLETIC - PLANIFICADOR: EDITOR DE SESIÓN & ESTRUCTURA DEL PLAN
// DISEÑO FIEL A MOCKUPS (IMÁGENES 3, 4 Y 5 - LIGHT & DARK THEME)
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { Plus } from 'lucide-react';

export const PeriodizationPlannerView: React.FC = () => {
  const { macrociclo, atletaActual } = useTraining();

  // Sub-vista del Planificador: 'EDITOR_SESION' (Imágenes 3 y 4) vs 'ESTRUCTURA_PLAN' (Imagen 5)
  const [subVista, setSubVista] = useState<'EDITOR_SESION' | 'ESTRUCTURA_PLAN'>('EDITOR_SESION');

  // Estado del Editor de Sesión (Imágenes 3 y 4)
  const [nombreSesion, setNombreSesion] = useState<string>('Sesión 1 - Fuerza Torso');
  const [duracionMinutos, setDuracionMinutos] = useState<number>(60);
  const [rpeObjetivo, setRpeObjetivo] = useState<number>(8);

  // Estado de series y ejercicios en Bloques
  const [bloquesData, setBloquesData] = useState([
    {
      id: 'A',
      nombre: 'Bloque A · Fuerza principal',
      tipo: 'Serie simple',
      rpeBloque: 8,
      ejercicios: [
        { nombre: 'Sentadilla Trasera con barra', series: 4, reps: 6, porcentaje: 80, rir: 2, rpe: 8, desc: 120, kgCalc: 90 },
        { nombre: 'Press de Pecho Plano con barra', series: 4, reps: 6, porcentaje: 80, rir: 2, rpe: 8, desc: 120, kgCalc: 110 },
      ],
    },
    {
      id: 'B',
      nombre: 'Bloque B',
      tipo: 'Biserie',
      rpeBloque: 7,
      ejercicios: [
        { nombre: 'A1 · Hip Thrust con barra', series: 3, reps: 10, porcentaje: 70, rir: 3, rpe: 7, desc: 90, kgCalc: 130 },
        { nombre: 'A2 · Remo con mancuerna', series: 3, reps: 10, porcentaje: 70, rir: 3, rpe: 7, desc: 90, kgCalc: 32 },
      ],
    },
    {
      id: 'C',
      nombre: 'Bloque C',
      tipo: 'Circuito',
      rpeBloque: 6,
      ejercicios: [
        { nombre: 'A1 · Plancha isométrica', series: 3, reps: 45, porcentaje: 0, rir: 2, rpe: 6, desc: 60, kgCalc: 0 },
        { nombre: 'A2 · Face Pull en polea', series: 3, reps: 15, porcentaje: 60, rir: 2, rpe: 6, desc: 60, kgCalc: 25 },
      ],
    },
  ]);

  // Estado de Estructura del Plan (Imagen 5)
  const [nombreMacrociclo, setNombreMacrociclo] = useState<string>(macrociclo.nombreMacrociclo || 'Temporada 2025-2026');
  const [objetivoGeneral, setObjetivoGeneral] = useState<string>(
    macrociclo.objetivoGeneralMacrociclo ||
      'Desarrollo de fuerza máxima excéntrica, potencia de aceleración y prevención de lesiones en fase competitiva.'
  );
  const [duracionSemanas, setDuracionSemanas] = useState<number>(52);
  const [usarMesociclos, setUsarMesociclos] = useState<boolean>(true);
  const [mensajeNotificacion, setMensajeNotificacion] = useState<string | null>(null);

  const handleActualizarEjercicioBloque = (
    bIdx: number,
    eIdx: number,
    campo: 'series' | 'reps' | 'porcentaje' | 'rir' | 'rpe' | 'desc',
    valor: number
  ) => {
    setBloquesData((prev) => {
      const copy = [...prev];
      const bloque = { ...copy[bIdx] };
      const ejs = [...bloque.ejercicios];
      ejs[eIdx] = { ...ejs[eIdx], [campo]: valor };
      bloque.ejercicios = ejs;
      copy[bIdx] = bloque;
      return copy;
    });
  };

  const handleGuardarSesion = () => {
    setMensajeNotificacion('Sesión guardada con éxito en el planificador.');
    setTimeout(() => setMensajeNotificacion(null), 3000);
  };

  const handleCrearPlan = () => {
    setMensajeNotificacion('Estructura del plan de 52 semanas actualizada correctamente.');
    setTimeout(() => setMensajeNotificacion(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Selector de sub-vista del planificador */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSubVista('EDITOR_SESION')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition select-none ${
              subVista === 'EDITOR_SESION'
                ? 'bg-[#2F6B4F] text-white shadow-sm'
                : 'border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40'
            }`}
          >
            Editor de sesión
          </button>
          <button
            type="button"
            onClick={() => setSubVista('ESTRUCTURA_PLAN')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition select-none ${
              subVista === 'ESTRUCTURA_PLAN'
                ? 'bg-[#2F6B4F] text-white shadow-sm'
                : 'border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40'
            }`}
          >
            Estructura del plan
          </button>
        </div>

        <span className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] font-semibold">
          Atleta: <strong className="text-[#163832] dark:text-white">{atletaActual.nombreCompleto}</strong>
        </span>
      </div>

      {mensajeNotificacion && (
        <div className="rounded-2xl bg-emerald-600 text-white p-3 text-xs font-bold text-center animate-fade-in shadow-md">
          {mensajeNotificacion}
        </div>
      )}

      {/* =====================================================================
          SUB-VISTA 1: EDITOR DE SESIÓN (MOCKUPS 3 Y 4)
          ===================================================================== */}
      {subVista === 'EDITOR_SESION' && (
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
                onClick={() => {
                  setBloquesData((prev) => [
                    ...prev,
                    {
                      id: String.fromCharCode(65 + prev.length),
                      nombre: `Bloque ${String.fromCharCode(65 + prev.length)}`,
                      tipo: 'Biserie',
                      rpeBloque: 7,
                      ejercicios: [
                        { nombre: '[Nuevo ejercicio 1]', series: 3, reps: 10, porcentaje: 70, rir: 2, rpe: 7, desc: 90, kgCalc: 50 },
                        { nombre: '[Nuevo ejercicio 2]', series: 3, reps: 10, porcentaje: 70, rir: 2, rpe: 7, desc: 90, kgCalc: 50 },
                      ],
                    },
                  ]);
                }}
                className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] text-[#163832] dark:text-white font-bold text-xs px-4 py-3 bg-transparent hover:bg-[#E1ECE5]/40 transition min-h-[44px]"
              >
                + Agregar bloque
              </button>
              <button
                type="button"
                onClick={handleGuardarSesion}
                className="rounded-xl bg-[#2F6B4F] hover:bg-[#265740] active:scale-[0.99] text-white font-extrabold text-xs px-6 py-3 shadow-md transition min-h-[44px]"
              >
                Guardar sesión
              </button>
            </div>
          </div>

          {/* Tarjeta Superior de Metadatos de Sesión */}
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

          {/* Bloques de Prescripción de Ejercicios */}
          {bloquesData.map((bloque, bIdx) => (
            <div
              key={bloque.id}
              className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 sm:p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E2D5] dark:border-[#25524A]">
                <div className="flex items-center gap-3">
                  <h2 className="font-bold text-[#163832] dark:text-white text-base">
                    {bloque.nombre}
                  </h2>
                  <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-3 py-0.5 text-xs font-semibold text-[#163832] dark:text-[#E1ECE5]">
                    {bloque.tipo}
                  </span>
                </div>
                <span className="text-xs text-[#163832]/70 dark:text-[#9EB5B0] font-medium">
                  RPE objetivo del bloque: <strong>{bloque.rpeBloque}</strong>
                </span>
              </div>

              {/* Tabla de Ejercicios y Parámetros del Bloque */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead>
                    <tr className="text-[#163832]/60 dark:text-[#9EB5B0] font-bold uppercase tracking-wider pb-2">
                      <th className="py-2 px-2">EJERCICIO</th>
                      <th className="py-2 px-2 text-center">SERIES</th>
                      <th className="py-2 px-2 text-center">REPS</th>
                      <th className="py-2 px-2 text-center">%1RM</th>
                      <th className="py-2 px-2 text-center">RIR</th>
                      <th className="py-2 px-2 text-center">RPE</th>
                      <th className="py-2 px-2 text-center">DESC. S</th>
                      <th className="py-2 px-2 text-right">KG CALC.</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {bloque.ejercicios.map((ej, eIdx) => (
                      <tr key={eIdx} className="border-b border-[#E5E2D5]/50 dark:border-[#25524A]/40 last:border-b-0">
                        <td className="py-3 px-2 font-bold text-sm text-[#163832] dark:text-white">
                          {ej.nombre}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <input
                            type="number"
                            value={ej.series}
                            onChange={(e) =>
                              handleActualizarEjercicioBloque(bIdx, eIdx, 'series', parseInt(e.target.value) || 0)
                            }
                            className="w-14 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                          />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <input
                            type="number"
                            value={ej.reps}
                            onChange={(e) =>
                              handleActualizarEjercicioBloque(bIdx, eIdx, 'reps', parseInt(e.target.value) || 0)
                            }
                            className="w-14 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                          />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <input
                            type="number"
                            value={ej.porcentaje}
                            onChange={(e) =>
                              handleActualizarEjercicioBloque(bIdx, eIdx, 'porcentaje', parseInt(e.target.value) || 0)
                            }
                            className="w-14 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                          />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <input
                            type="number"
                            value={ej.rir}
                            onChange={(e) =>
                              handleActualizarEjercicioBloque(bIdx, eIdx, 'rir', parseInt(e.target.value) || 0)
                            }
                            className="w-14 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                          />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <input
                            type="number"
                            value={ej.rpe}
                            onChange={(e) =>
                              handleActualizarEjercicioBloque(bIdx, eIdx, 'rpe', parseInt(e.target.value) || 0)
                            }
                            className="w-14 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                          />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <input
                            type="number"
                            value={ej.desc}
                            onChange={(e) =>
                              handleActualizarEjercicioBloque(bIdx, eIdx, 'desc', parseInt(e.target.value) || 0)
                            }
                            className="w-16 rounded-xl border-2 border-[#163832] dark:border-[#25524A] bg-white dark:bg-[#102824] py-1.5 text-center font-bold text-xs text-[#163832] dark:text-white"
                          />
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-sm text-[#163832] dark:text-white font-mono">
                          {ej.kgCalc > 0 ? `${ej.kgCalc} kg` : 'Autocarga'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          SUB-VISTA 2: ESTRUCTURA DEL PLAN / NUEVO MACROCICLO (MOCKUP 5)
          ===================================================================== */}
      {subVista === 'ESTRUCTURA_PLAN' && (
        <div className="space-y-6">
          {/* Cabecera: Breadcrumb, Título y Botón Crear plan */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-xs font-semibold text-[#163832]/60 dark:text-[#9EB5B0] block">
                Planificador &gt; Nuevo macrociclo
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-[#163832] dark:text-white mt-0.5">
                Estructura del plan
              </h1>
            </div>

            <button
              type="button"
              onClick={handleCrearPlan}
              className="rounded-2xl bg-[#2F6B4F] hover:bg-[#265740] active:scale-[0.99] text-white font-extrabold text-sm px-7 py-3.5 shadow-md transition self-start"
            >
              Crear plan
            </button>
          </div>

          {/* Grid de 2 Columnas: Macrociclo vs Estructura de Mesos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda: Tarjeta Macrociclo */}
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

            {/* Columna Derecha: Estructura de Mesos y Micros */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-lg font-bold text-[#163832] dark:text-white">
                  Estructura
                </h2>
                <button
                  type="button"
                  className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-1.5 font-bold text-xs text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40 transition"
                >
                  + Mesociclo
                </button>
              </div>

              {/* Mesociclo 01 */}
              <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#163832] dark:text-white">
                      Mesociclo 01
                    </span>
                    <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-2.5 py-0.5 text-xs font-semibold text-[#163832] dark:text-[#E1ECE5]">
                      [2 a 6] semanas
                    </span>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-1 font-bold text-xs text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40"
                  >
                    Editar
                  </button>
                </div>
                <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">
                  Objetivo específico: [objetivo de fase]
                </p>

                <div className="border-t border-[#E5E2D5] dark:border-[#25524A] pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="font-semibold text-[#163832] dark:text-white">
                      Micro 1 · [Carga progresiva] · [3 a 7] días
                    </span>
                    <button type="button" className="rounded-xl border border-[#163832] dark:border-[#25524A] px-3 py-1 font-bold text-xs hover:bg-[#E1ECE5]/40">
                      Editar
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="font-semibold text-[#163832] dark:text-white">
                      Micro 2 · [Descarga] · [3 a 7] días
                    </span>
                    <button type="button" className="rounded-xl border border-[#163832] dark:border-[#25524A] px-3 py-1 font-bold text-xs hover:bg-[#E1ECE5]/40">
                      Editar
                    </button>
                  </div>
                </div>
              </div>

              {/* Mesociclo 02 */}
              <div className="rounded-2xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#163832] dark:text-white">
                      Mesociclo 02
                    </span>
                    <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-2.5 py-0.5 text-xs font-semibold text-[#163832] dark:text-[#E1ECE5]">
                      [2 a 6] semanas
                    </span>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-1 font-bold text-xs text-[#163832] dark:text-white bg-transparent hover:bg-[#E1ECE5]/40"
                  >
                    Editar
                  </button>
                </div>
                <p className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">
                  Objetivo específico: [objetivo de fase]
                </p>

                <div className="border-t border-[#E5E2D5] dark:border-[#25524A] pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="font-semibold text-[#163832] dark:text-white">
                      Micro 1 · [Carga progresiva] · [3 a 7] días
                    </span>
                    <button type="button" className="rounded-xl border border-[#163832] dark:border-[#25524A] px-3 py-1 font-bold text-xs hover:bg-[#E1ECE5]/40">
                      Editar
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="font-semibold text-[#163832] dark:text-white">
                      Micro 2 · [Descarga] · [3 a 7] días
                    </span>
                    <button type="button" className="rounded-xl border border-[#163832] dark:border-[#25524A] px-3 py-1 font-bold text-xs hover:bg-[#E1ECE5]/40">
                      Editar
                    </button>
                  </div>
                </div>
              </div>

              {/* Semana suelta · sin mesociclo (Dashed border) */}
              <div className="rounded-2xl border-2 border-dashed border-[#163832] dark:border-[#25524A] p-4 flex items-center justify-between shadow-sm">
                <div>
                  <span className="font-bold text-sm text-[#163832] dark:text-white block">
                    Semana suelta · sin mesociclo
                  </span>
                  <span className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">
                    Micro [n] · [objetivo semanal] · vinculado al macrociclo
                  </span>
                </div>
                <button
                  type="button"
                  className="rounded-xl border-2 border-[#163832] dark:border-[#25524A] px-4 py-1.5 font-bold text-xs text-[#163832] dark:text-white hover:bg-[#E1ECE5]/40 transition"
                >
                  + Microciclo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
