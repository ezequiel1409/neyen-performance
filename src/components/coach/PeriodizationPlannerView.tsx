// =====================================================================
// NEYEN ATHLETIC - PLANIFICADOR: EDITOR DE SESIÓN & ESTRUCTURA DEL PLAN
// ORQUESTADOR MODULAR (< 150 LÍNEAS) - SRP & CLEAN ARCHITECTURE
// =====================================================================

import React, { useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { AlertBanner } from '../ui/AlertBanner';
import type { StatusType } from '../ui/IndicatorStatus';
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
  const [alerta, setAlerta] = useState<{ status: StatusType; message: string } | null>(null);

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
    if (nombreSesion.trim().length < 3) {
      setAlerta({ status: 'bad', message: 'El nombre de la sesión debe tener al menos 3 caracteres.' });
      return;
    }
    if (Number.isNaN(duracionMinutos) || duracionMinutos < 10 || duracionMinutos > 240) {
      setAlerta({ status: 'bad', message: 'La duración de la sesión debe estar entre 10 y 240 minutos.' });
      return;
    }
    if (Number.isNaN(rpeObjetivo) || rpeObjetivo < 1 || rpeObjetivo > 10) {
      setAlerta({ status: 'bad', message: 'El RPE objetivo debe estar entre 1 y 10.' });
      return;
    }
    setAlerta({ status: 'ok', message: 'Sesión guardada con éxito en el planificador.' });
  };

  const handleCrearPlan = () => {
    if (nombreMacrociclo.trim().length < 3) {
      setAlerta({ status: 'bad', message: 'El nombre del macrociclo debe tener al menos 3 caracteres.' });
      return;
    }
    if (Number.isNaN(duracionSemanas) || duracionSemanas < 4 || duracionSemanas > 52) {
      setAlerta({ status: 'bad', message: 'La duración del plan debe estar entre 4 y 52 semanas.' });
      return;
    }
    setAlerta({
      status: 'ok',
      message: `Estructura del plan de ${duracionSemanas} semanas actualizada correctamente.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Selector de sub-vista del planificador */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSubVista('EDITOR_SESION')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition select-none cursor-pointer ${
              subVista === 'EDITOR_SESION'
                ? 'bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                : 'border border-[var(--bord)] text-[var(--mut)] hover:bg-[var(--surf)]'
            }`}
          >
            Editor de sesión
          </button>
          <button
            type="button"
            onClick={() => setSubVista('ESTRUCTURA_PLAN')}
            className={`rounded-full px-5 py-2 text-xs font-bold transition select-none cursor-pointer ${
              subVista === 'ESTRUCTURA_PLAN'
                ? 'bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                : 'border border-[var(--bord)] text-[var(--mut)] hover:bg-[var(--surf)]'
            }`}
          >
            Estructura del plan
          </button>
        </div>

        <span className="text-xs text-[var(--mut)] font-bold">
          Atleta: <strong className="text-[var(--txt)]">{atletaActual.nombreCompleto}</strong>
        </span>
      </div>

      {alerta && (
        <AlertBanner
          status={alerta.status}
          message={alerta.message}
          onClose={() => setAlerta(null)}
        />
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
