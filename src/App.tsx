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
import { CoachNavSection, CoachSidebar } from './components/coach/CoachSidebar';
import { AthleteAnnualProgressView } from './components/athlete/AthleteAnnualProgressView';
import { AthleteGalleryMLP } from './components/athlete/AthleteGalleryMLP';
import { AthleteHomeView } from './components/athlete/AthleteHomeView';
import { AthleteSleepWearableMLP } from './components/athlete/AthleteSleepWearableMLP';
import { TrainingProvider, useTraining } from './context/TrainingContext';

const MainLayout: React.FC = () => {
  const { rolActivo } = useTraining();

  const [seccionCoach, setSeccionCoach] = useState<CoachNavSection>('BANCO_EJERCICIOS');
  const [vistaCoachActual, setVistaCoachActual] = useState<'EJERCICIOS' | 'ATLETAS' | 'PLANES' | 'ANUAL'>('EJERCICIOS');
  const [vistaAlumnoActual, setVistaAlumnoActual] = useState<VistaAlumno>('RUTINA');

  const handleCambiarSeccionCoach = (s: CoachNavSection) => {
    setSeccionCoach(s);
    if (s === 'BANCO_EJERCICIOS') setVistaCoachActual('EJERCICIOS');
    else if (s === 'ATLETAS' || s === 'RESUMEN' || s === 'ALERTAS') setVistaCoachActual('ATLETAS');
    else if (s === 'PLANIFICADOR') setVistaCoachActual('PLANES');
    else if (s === 'EVALUACIONES') setVistaCoachActual('ANUAL');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col font-sans selection:bg-[#E85938] selection:text-white transition-colors duration-200">
      {/* Barra de Navegación con Selector de Rol */}
      <Navbar
        vistaCoachActual={vistaCoachActual}
        setVistaCoachActual={(v) => {
          setVistaCoachActual(v);
          if (v === 'EJERCICIOS') setSeccionCoach('BANCO_EJERCICIOS');
          else if (v === 'ATLETAS') setSeccionCoach('ATLETAS');
          else if (v === 'PLANES') setSeccionCoach('PLANIFICADOR');
          else if (v === 'ANUAL') setSeccionCoach('EVALUACIONES');
        }}
        vistaAlumnoActual={vistaAlumnoActual}
        setVistaAlumnoActual={setVistaAlumnoActual}
      />

      {/* Contenido Principal */}
      {rolActivo === 'COACH' ? (
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 flex">
          {/* Sidebar lateral del Coach (visible en desktop como en los mockups) */}
          <div className="hidden md:block">
            <CoachSidebar
              seccionActiva={seccionCoach}
              onCambiarSeccion={handleCambiarSeccionCoach}
            />
          </div>

          {/* Área de trabajo de la vista seleccionada */}
          <main className="flex-1 min-w-0 py-6">
            {seccionCoach === 'BANCO_EJERCICIOS' && <ExerciseBankView />}
            {(seccionCoach === 'ATLETAS' || seccionCoach === 'RESUMEN' || seccionCoach === 'ALERTAS') && (
              <AthleteProfileView />
            )}
            {seccionCoach === 'PLANIFICADOR' && <PeriodizationPlannerView />}
            {seccionCoach === 'EVALUACIONES' && <AnnualMacroTimelineView />}
          </main>
        </div>
      ) : (
        <main className="flex-1 px-4 py-6 sm:px-6 max-w-7xl mx-auto w-full pb-24 sm:pb-6">
          {vistaAlumnoActual === 'RUTINA' && <AthleteHomeView />}
          {vistaAlumnoActual === 'DASHBOARD' && <AthleteAnnualProgressView />}
          {vistaAlumnoActual === 'FOTOS' && <AthleteGalleryMLP />}
          {vistaAlumnoActual === 'SUENIO' && <AthleteSleepWearableMLP />}
        </main>
      )}

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
