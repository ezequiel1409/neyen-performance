// =====================================================================
// NEYEN ATHLETIC PERFORMANCE OS - APLICACIÓN PRINCIPAL
// =====================================================================

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav, VistaAlumno } from './components/ui/BottomNav';
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
  const [vistaAlumnoActual, setVistaAlumnoActual] = useState<VistaAlumno>('RUTINA');

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col font-sans selection:bg-[#E85938] selection:text-white transition-colors duration-200">
      {/* Barra de Navegación con Selector de Rol */}
      <Navbar
        vistaCoachActual={vistaCoachActual}
        setVistaCoachActual={setVistaCoachActual}
        vistaAlumnoActual={vistaAlumnoActual}
        setVistaAlumnoActual={setVistaAlumnoActual}
      />

      {/* Área de Contenido Principal (con padding inferior en mobile para el BottomNav del alumno) */}
      <main className={`flex-1 px-4 py-6 sm:px-6 max-w-7xl mx-auto w-full ${rolActivo === 'ALUMNO' ? 'pb-24 sm:pb-6' : ''}`}>
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

      {/* Barra inferior de navegación nativa para el Alumno en mobile */}
      {rolActivo === 'ALUMNO' && (
        <BottomNav vistaActual={vistaAlumnoActual} onCambiarVista={setVistaAlumnoActual} />
      )}

      {/* Pie de página (oculto en mobile para alumno para no chocar con el bottom nav) */}
      <footer className={`border-t-2 border-[#E5E2D5] dark:border-[#25524A] bg-[#FAF7EE] dark:bg-[#0E2420] py-4 text-center text-xs text-[#163832]/60 dark:text-[#9EB5B0] ${rolActivo === 'ALUMNO' ? 'hidden sm:block' : 'block'}`}>
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
