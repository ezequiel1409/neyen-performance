// =====================================================================
// NEYEN ATHLETIC PERFORMANCE OS - APLICACIÓN PRINCIPAL
// =====================================================================

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AnnualMacroTimelineView } from './components/coach/AnnualMacroTimelineView';
import { AthleteProfileView } from './components/coach/AthleteProfileView';
import { ExerciseBankView } from './components/coach/ExerciseBankView';
import { PeriodizationPlannerView } from './components/coach/PeriodizationPlannerView';
import { AthleteAnnualProgressView } from './components/athlete/AthleteAnnualProgressView';
import { AthleteGalleryMLP } from './components/athlete/AthleteGalleryMLP';
import { AthleteHomeView } from './components/athlete/AthleteHomeView';
import { AthleteSleepWearableMLP } from './components/athlete/AthleteSleepWearableMLP';
import { TrainingProvider, useTraining } from './context/TrainingContext';

const MainLayout: React.FC = () => {
  const { rolActivo } = useTraining();

  const [vistaCoachActual, setVistaCoachActual] = useState<'EJERCICIOS' | 'ATLETAS' | 'PLANES' | 'ANUAL'>('EJERCICIOS');
  const [vistaAlumnoActual, setVistaAlumnoActual] = useState<'RUTINA' | 'DASHBOARD' | 'FOTOS' | 'SUENIO'>('RUTINA');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Barra de Navegación con Selector de Rol */}
      <Navbar
        vistaCoachActual={vistaCoachActual}
        setVistaCoachActual={setVistaCoachActual}
        vistaAlumnoActual={vistaAlumnoActual}
        setVistaAlumnoActual={setVistaAlumnoActual}
      />

      {/* Área de Contenido Principal */}
      <main className="flex-1 px-4 py-6 sm:px-6 max-w-7xl mx-auto w-full">
        {rolActivo === 'COACH' ? (
          <>
            {vistaCoachActual === 'EJERCICIOS' && <ExerciseBankView />}
            {vistaCoachActual === 'ATLETAS' && <AthleteProfileView />}
            {vistaCoachActual === 'PLANES' && <PeriodizationPlannerView />}
            {vistaCoachActual === 'ANUAL' && <AnnualMacroTimelineView />}
          </>
        ) : (
          <>
            {vistaAlumnoActual === 'RUTINA' && <AthleteHomeView />}
            {vistaAlumnoActual === 'DASHBOARD' && <AthleteAnnualProgressView />}
            {vistaAlumnoActual === 'FOTOS' && <AthleteGalleryMLP />}
            {vistaAlumnoActual === 'SUENIO' && <AthleteSleepWearableMLP />}
          </>
        )}
      </main>

      {/* Pie de página */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>
          <strong>NEYEN Athletic Performance OS</strong> • Plataforma de Preparación Física Periodizada • Temporada 2025-2026
        </p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <TrainingProvider>
      <MainLayout />
    </TrainingProvider>
  );
}

export default App;
