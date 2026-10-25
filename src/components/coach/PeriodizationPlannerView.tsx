// =====================================================================
// NEYEN ATHLETIC - PLANIFICADOR: EDITOR DE SESIÓN & ESTRUCTURA DEL PLAN
// ORQUESTADOR MODULAR (< 150 LÍNEAS) - SRP & CLEAN ARCHITECTURE
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { BloquePrescripcionData } from './planner/PrescriptionBlockCard';
import { SessionEditorView } from './planner/SessionEditorView';
import { PlanStructureView } from './planner/PlanStructureView';

export const PeriodizationPlannerView: React.FC = () => {
  const { macrociclo, atletaActual } = useTraining();

  // Sub-vista del Planificador: 'EDITOR_SESION' vs 'ESTRUCTURA_PLAN'
  const [subVista, setSubVista] = useState<'EDITOR_SESION' | 'ESTRUCTURA_PLAN'>('EDITOR_SESION');

  // Estado del Editor de Sesión
  const [nombreSesion, setNombreSesion] = useState<string>('Sesión 1 - Fuerza Torso');
  const [duracionMinutos, setDuracionMinutos] = useState<number>(60);
  const [rpeObjetivo, setRpeObjetivo] = useState<number>(8);

  // Estado de series y ejercicios en Bloques
  const [bloquesData, setBloquesData] = useState<BloquePrescripcionData[]>([
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

  // Estado de Estructura del Plan
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

  const handleAgregarBloque = () => {
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

      {subVista === 'EDITOR_SESION' ? (
        <SessionEditorView
          nombreSesion={nombreSesion}
          setNombreSesion={setNombreSesion}
          duracionMinutos={duracionMinutos}
          setDuracionMinutos={setDuracionMinutos}
          rpeObjetivo={rpeObjetivo}
          setRpeObjetivo={setRpeObjetivo}
          bloquesData={bloquesData}
          onAgregarBloque={handleAgregarBloque}
          onGuardarSesion={handleGuardarSesion}
          onActualizarEjercicioBloque={handleActualizarEjercicioBloque}
        />
      ) : (
        <PlanStructureView
          nombreMacrociclo={nombreMacrociclo}
          setNombreMacrociclo={setNombreMacrociclo}
          objetivoGeneral={objetivoGeneral}
          setObjetivoGeneral={setObjetivoGeneral}
          duracionSemanas={duracionSemanas}
          setDuracionSemanas={setDuracionSemanas}
          usarMesociclos={usarMesociclos}
          setUsarMesociclos={setUsarMesociclos}
          onCrearPlan={handleCrearPlan}
        />
      )}
    </div>
  );
};
