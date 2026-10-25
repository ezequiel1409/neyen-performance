// =====================================================================
// NEYEN ATHLETIC PERFORMANCE OS - APLICACIÓN PRINCIPAL
// SIN NAVBAR SUPERIOR REDUNDANTE · INTEGRACIÓN CON LOGIN Y SIDEBARS
// =====================================================================

import React, { useState, useEffect } from 'react';
import { BottomNav, VistaAlumno } from './components/ui/BottomNav';
import { AnnualMacroTimelineView } from './components/coach/AnnualMacroTimelineView';
import { AthleteProfileView } from './components/coach/AthleteProfileView';
import { ExerciseBankView } from './components/coach/ExerciseBankView';
import { PeriodizationPlannerView } from './components/coach/PeriodizationPlannerView';
import { CoachNavSection, CoachSidebar } from './components/coach/CoachSidebar';
import { AthleteSidebar } from './components/athlete/AthleteSidebar';
import { AthleteAnnualProgressView } from './components/athlete/AthleteAnnualProgressView';
import { AthleteGalleryMLP } from './components/athlete/AthleteGalleryMLP';
import { AthleteHomeView } from './components/athlete/AthleteHomeView';
import { AthleteSleepWearableMLP } from './components/athlete/AthleteSleepWearableMLP';
import { LoginView } from './components/auth/LoginView';
import { NeyenLogo } from './components/ui/NeyenLogo';
import { TrainingProvider, useTraining } from './context/TrainingContext';
import { Sun, Moon, LogOut } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { estaAutenticado, rolActivo, cerrarSesion } = useTraining();

  const [seccionCoach, setSeccionCoach] = useState<CoachNavSection>('BANCO_EJERCICIOS');
  const [vistaAlumnoActual, setVistaAlumnoActual] = useState<VistaAlumno>('RUTINA');

  // Control de Modo Oscuro instantáneo
  const [esModoOscuro, setEsModoOscuro] = useState<boolean>(() => {
    try {
      const guardado = localStorage.getItem('theme');
      if (guardado) return guardado === 'dark';
      return document.documentElement.classList.contains('dark');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (esModoOscuro) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch {}
    }
  }, [esModoOscuro]);

  const alternarTema = () => {
    setEsModoOscuro((prev) => !prev);
  };

  // Si no está autenticado, renderizar la pantalla de Login oficial (Imagen 2)
  if (!estaAutenticado) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col font-sans selection:bg-[#2F6B4F] selection:text-white transition-colors duration-200">
      {/* =====================================================================
          HEADER MÓVIL COMPACTO (SÓLO VISIBLE EN DISPOSITIVOS MÓVILES < MD)
          ===================================================================== */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#15332B] border-b-2 border-[#E5E2D5] dark:border-[#244E43] sticky top-0 z-30">
        <NeyenLogo size="sm" showSubtitle={false} />

        <div className="flex items-center gap-2">
          {/* Toggle de tema */}
          <button
            type="button"
            onClick={alternarTema}
            aria-label={esModoOscuro ? 'Activar tema claro' : 'Activar tema oscuro'}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#244E43] text-[#1D2B24] dark:text-[#FAF7EE] hover:bg-[#E3EFE7]/50"
          >
            {esModoOscuro ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Cerrar sesión */}
          <button
            type="button"
            onClick={cerrarSesion}
            aria-label="Cerrar sesión"
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Selector móvil de secciones para Coach (sólo en móviles < md) */}
      {rolActivo === 'COACH' && (
        <div className="md:hidden overflow-x-auto bg-white dark:bg-[#15332B] border-b border-[#E5E2D5] dark:border-[#244E43] px-3 py-2 flex gap-1.5 scrollbar-none">
          {[
            { id: 'BANCO_EJERCICIOS', label: 'Banco' },
            { id: 'PLANIFICADOR', label: 'Planificador' },
            { id: 'ATLETAS', label: 'Atletas' },
            { id: 'EVALUACIONES', label: 'Evaluaciones' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSeccionCoach(item.id as CoachNavSection)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                seccionCoach === item.id
                  ? 'bg-[#2F6B4F] text-white'
                  : 'text-[#1D2B24]/70 dark:text-[#9EB5B0]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* =====================================================================
          CONTENIDO PRINCIPAL (DESKTOP / TABLET CON SIDEBAR LATERAL NATIVO)
          ===================================================================== */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 flex">
        {/* SIDEBAR LATERAL: COACH VS ALUMNO */}
        <div className="hidden md:block">
          {rolActivo === 'COACH' ? (
            <CoachSidebar
              seccionActiva={seccionCoach}
              onCambiarSeccion={setSeccionCoach}
            />
          ) : (
            <AthleteSidebar
              vistaActual={vistaAlumnoActual}
              onCambiarVista={setVistaAlumnoActual}
            />
          )}
        </div>

        {/* ÁREA DE CONTENIDO DE LA PANTALLA */}
        <main
          className={`flex-1 min-w-0 py-6 md:pl-4 ${
            rolActivo === 'ALUMNO' ? 'pb-24 md:pb-6' : ''
          }`}
        >
          {/* Barra superior sutil de utilidades de pantalla (Toggle Dark/Light) */}
          <div className="hidden md:flex justify-end items-center mb-4">
            <button
              type="button"
              onClick={alternarTema}
              aria-label={esModoOscuro ? 'Activar tema claro' : 'Activar tema oscuro'}
              className="flex items-center gap-2 rounded-xl border border-[#E5E2D5] dark:border-[#244E43] bg-white dark:bg-[#15332B] px-3 py-1.5 text-xs font-bold text-[#1D2B24] dark:text-[#FAF7EE] hover:bg-[#E3EFE7]/40 transition shadow-2xs"
            >
              {esModoOscuro ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Modo claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-slate-600" />
                  <span>Modo oscuro</span>
                </>
              )}
            </button>
          </div>

          {/* VISTAS DE COACH */}
          {rolActivo === 'COACH' && (
            <>
              {seccionCoach === 'BANCO_EJERCICIOS' && <ExerciseBankView />}
              {(seccionCoach === 'ATLETAS' || seccionCoach === 'RESUMEN' || seccionCoach === 'ALERTAS') && (
                <AthleteProfileView />
              )}
              {seccionCoach === 'PLANIFICADOR' && <PeriodizationPlannerView />}
              {seccionCoach === 'EVALUACIONES' && <AnnualMacroTimelineView />}
            </>
          )}

          {/* VISTAS DE ALUMNO (IMAGEN 1 PANEL DEL ALUMNO) */}
          {rolActivo === 'ALUMNO' && (
            <>
              {vistaAlumnoActual === 'RUTINA' && (
                <AthleteHomeView onIrADescanso={() => setVistaAlumnoActual('SUENIO')} />
              )}
              {vistaAlumnoActual === 'DASHBOARD' && <AthleteAnnualProgressView />}
              {vistaAlumnoActual === 'FOTOS' && <AthleteGalleryMLP />}
              {vistaAlumnoActual === 'SUENIO' && <AthleteSleepWearableMLP />}
            </>
          )}
        </main>
      </div>

      {/* BARRA INFERIOR DE NAVEGACIÓN PARA ALUMNO EN MÓVILES */}
      {rolActivo === 'ALUMNO' && (
        <BottomNav vistaActual={vistaAlumnoActual} onCambiarVista={setVistaAlumnoActual} />
      )}
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
