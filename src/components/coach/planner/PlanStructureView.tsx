// =====================================================================
// NEYEN ATHLETIC - VISTA ESTRUCTURA DEL PLAN (PLANIFICADOR)
// RESPONSABILIDAD ÚNICA: Orquestar la vista de macrociclo y mesociclos
// =====================================================================

import React from 'react';
import { MacrocycleCard } from './MacrocycleCard';
import { MesocycleStructureList } from './MesocycleStructureList';

interface PlanStructureViewProps {
  nombreMacrociclo: string;
  setNombreMacrociclo: (nombre: string) => void;
  objetivoGeneral: string;
  setObjetivoGeneral: (obj: string) => void;
  duracionSemanas: number;
  setDuracionSemanas: (semanas: number) => void;
  usarMesociclos: boolean;
  setUsarMesociclos: (usar: boolean) => void;
  onCrearPlan: () => void;
}

export const PlanStructureView: React.FC<PlanStructureViewProps> = ({
  nombreMacrociclo,
  setNombreMacrociclo,
  objetivoGeneral,
  setObjetivoGeneral,
  duracionSemanas,
  setDuracionSemanas,
  usarMesociclos,
  setUsarMesociclos,
  onCrearPlan,
}) => {
  return (
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
          onClick={onCrearPlan}
          className="rounded-2xl bg-[#2F6B4F] hover:bg-[#265740] active:scale-[0.99] text-white font-extrabold text-sm px-7 py-3.5 shadow-md transition self-start"
        >
          Crear plan
        </button>
      </div>

      {/* Grid de 2 Columnas: Macrociclo vs Estructura de Mesos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <MacrocycleCard
          nombreMacrociclo={nombreMacrociclo}
          setNombreMacrociclo={setNombreMacrociclo}
          objetivoGeneral={objetivoGeneral}
          setObjetivoGeneral={setObjetivoGeneral}
          duracionSemanas={duracionSemanas}
          setDuracionSemanas={setDuracionSemanas}
          usarMesociclos={usarMesociclos}
          setUsarMesociclos={setUsarMesociclos}
        />

        <MesocycleStructureList />
      </div>
    </div>
  );
};
