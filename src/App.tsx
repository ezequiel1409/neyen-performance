// =====================================================================
// NEYIMA ATHLETIC PERFORMANCE OS - APLICACIÓN PRINCIPAL
// INTEGRACIÓN NATIVA CON DESIGN SYSTEM Y VISTAS DE PERFIL
// =====================================================================

import React, { useState, useEffect } from 'react';
import { BottomNav, VistaAlumno } from './components/ui/BottomNav';
import { AthleteProfileView } from './components/coach/AthleteProfileView';
import { ExerciseBankView } from './components/coach/ExerciseBankView';
import { PeriodizationPlannerView } from './components/coach/PeriodizationPlannerView';
import { CoachNavSection, CoachSidebar } from './components/coach/CoachSidebar';
import { CoachDashboardView } from './components/coach/CoachDashboardView';
import { LoadControlACWRView } from './components/coach/LoadControlACWRView';
import { CoachAthletesListView } from './components/coach/CoachAthletesListView';
import { CoachAlertsView } from './components/coach/CoachAlertsView';
import { CoachEvaluationsView } from './components/coach/CoachEvaluationsView';
import { AthleteSidebar } from './components/athlete/AthleteSidebar';
import { AthleteTodayView } from './components/athlete/AthleteTodayView';
import { AthleteWellnessView } from './components/athlete/AthleteWellnessView';
import { AthleteCycleView } from './components/athlete/AthleteCycleView';
import { AthleteHistoryView } from './components/athlete/AthleteHistoryView';
import { AthleteAnnualProgressView } from './components/athlete/AthleteAnnualProgressView';
import { AthleteGalleryMLP } from './components/athlete/AthleteGalleryMLP';
import { AthleteSleepWearableMLP } from './components/athlete/AthleteSleepWearableMLP';
import { ActiveWorkoutModal } from './components/athlete/ActiveWorkoutModal';
import { LoginView } from './components/auth/LoginView';
import { OnboardingView } from './components/auth/OnboardingView';
import { NeyimaLogo } from './components/ui/NeyimaLogo';
import { IconInterface } from './components/ui/icons/IconInterface';
import { TrainingProvider, useTraining } from './context/TrainingContext';
import { useAndroidBackNavigation } from './utils/nativeBridge';

const MainLayout: React.FC = () => {
  const { estaAutenticado, perfilCompletado, rolActivo, atletaActual, cerrarSesion, macrociclo } = useTraining();

  const [seccionCoach, setSeccionCoach] = useState<CoachNavSection>('RESUMEN');
  const [atletaDetalleAbierto, setAtletaDetalleAbierto] = useState<boolean>(false);
  const [vistaAlumnoActual, setVistaAlumnoActual] = useState<VistaAlumno>('HOY');
  const [workoutActivo, setWorkoutActivo] = useState<boolean>(false);

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
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      try {
        localStorage.setItem('theme', 'light');
      } catch {}
    }
  }, [esModoOscuro]);

  const alternarTema = () => {
    setEsModoOscuro((prev) => !prev);
  };

  // Soporte del gesto/botón físico "Atrás" de Android para navegación nativa sin cerrar la APK
  const esVistaPrincipal =
    rolActivo === 'ALUMNO' ? vistaAlumnoActual === 'HOY' : seccionCoach === 'RESUMEN';

  useAndroidBackNavigation({
    workoutActivo,
    onCerrarWorkout: () => setWorkoutActivo(false),
    atletaDetalleAbierto,
    onCerrarAtletaDetalle: () => setAtletaDetalleAbierto(false),
    esVistaPrincipal,
    onVolverAVistaPrincipal: () => {
      if (rolActivo === 'ALUMNO') {
        setVistaAlumnoActual('HOY');
      } else {
        setSeccionCoach('RESUMEN');
      }
    },
  });

  // Sesión del día para el modal activo
  const sesionDelDia =
    macrociclo.mesociclos[0]?.microciclos[0]?.sesionesDeEntrenamiento[0] || {
      identificadorSesion: 'SES-01',
      nombreSesion: 'Sesión 1 – Lunes | Tren superior (Empuje)',
      duracionEstimadaMinutos: 60,
      esfuerzoPercibidoObjetivoDeLaSesion: 8,
      bloquesDeEjercicios: [],
    };

  // Si no está autenticado, renderizar la pantalla de Login
  if (!estaAutenticado) {
    return <LoginView />;
  }

  // Si no completó onboarding de perfil
  if (!perfilCompletado) {
    return <OnboardingView />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--txt)] flex flex-col font-sans transition-colors duration-200">
      {/* =====================================================================
          HEADER MÓVIL COMPACTO (SÓLO VISIBLE EN DISPOSITIVOS MÓVILES < MD)
          ===================================================================== */}
      <header className="md:hidden flex items-center justify-between px-4 py-2.5 bg-[var(--surf)] border-b border-[var(--bord)] sticky top-0 z-30 safe-area-pt">
        <NeyimaLogo size="sm" variant="emblema" roleTag={rolActivo === 'COACH' ? 'COACH' : 'ALUMNO'} />

        <div className="flex items-center gap-1.5">
          {/* Indicador de Sesión Activa */}
          <span className="px-2.5 py-1 rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] text-xs font-bold truncate max-w-[155px]">
            {rolActivo === 'COACH'
              ? 'Coach'
              : `${atletaActual.nombreCompleto.split(' ')[0]} (${atletaActual.generoAtleta})`}
          </span>

          {/* Toggle de tema */}
          <button
            type="button"
            onClick={alternarTema}
            aria-label={esModoOscuro ? 'Activar tema claro' : 'Activar tema oscuro'}
            className="p-2 rounded-xl border border-[var(--bord)] text-[var(--txt)] hover:bg-[var(--bg)] cursor-pointer"
          >
            {esModoOscuro ? (
              <IconInterface name="star" size={16} strokeWidth={2.2} />
            ) : (
              <IconInterface name="moon" size={16} strokeWidth={2.2} />
            )}
          </button>

          {/* Cerrar sesión para cambiar de cuenta */}
          <button
            type="button"
            onClick={cerrarSesion}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="p-2 rounded-xl border border-[var(--bord)] text-[var(--acc)] hover:bg-[var(--bg)] cursor-pointer"
          >
            <IconInterface name="logout" size={16} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {/* Selector móvil de secciones para Coach (sólo en móviles < md) */}
      {rolActivo === 'COACH' && (
        <div className="md:hidden overflow-x-auto bg-[var(--surf)] border-b border-[var(--bord)] px-3 py-2 flex gap-1.5 scrollbar-none">
          {[
            { id: 'RESUMEN', label: 'Resumen' },
            { id: 'ATLETAS', label: 'Atletas' },
            { id: 'PLANIFICADOR', label: 'Planner' },
            { id: 'CONTROL_CARGA', label: 'Carga' },
            { id: 'BANCO_EJERCICIOS', label: 'Banco' },
            { id: 'EVALUACIONES', label: 'Evaluaciones' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSeccionCoach(item.id as CoachNavSection)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer ${
                seccionCoach === item.id
                  ? 'bg-[var(--navbg)] text-[var(--navon)]'
                  : 'text-[var(--mut)]'
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
        {/* SIDEBAR LATERAL: COACH VS ALUMNO (Con Sesión Actual y Tema integrados) */}
        <div className="hidden md:block">
          {rolActivo === 'COACH' ? (
            <CoachSidebar
              seccionActiva={seccionCoach}
              onCambiarSeccion={setSeccionCoach}
              esModoOscuro={esModoOscuro}
              onAlternarTema={alternarTema}
            />
          ) : (
            <AthleteSidebar
              vistaActual={vistaAlumnoActual}
              onCambiarVista={setVistaAlumnoActual}
              esModoOscuro={esModoOscuro}
              onAlternarTema={alternarTema}
            />
          )}
        </div>

        {/* ÁREA DE CONTENIDO DE LA PANTALLA */}
        <main
          className={`flex-1 min-w-0 py-6 md:pl-6 ${
            rolActivo === 'ALUMNO' ? 'pb-24 md:pb-6' : ''
          }`}
        >
          {/* VISTAS DE COACH (CATÁLOGO NEYIMA COACH) */}
          {rolActivo === 'COACH' && (
            <>
              {seccionCoach === 'RESUMEN' && (
                <CoachDashboardView
                  onAbrirPlanificador={() => setSeccionCoach('PLANIFICADOR')}
                  onVerAlertas={() => setSeccionCoach('ALERTAS')}
                  onIrAAtletas={() => {
                    setAtletaDetalleAbierto(false);
                    setSeccionCoach('ATLETAS');
                  }}
                  onSeleccionarAtleta={() => {
                    setAtletaDetalleAbierto(true);
                    setSeccionCoach('ATLETAS');
                  }}
                />
              )}

              {seccionCoach === 'CONTROL_CARGA' && (
                <LoadControlACWRView
                  onVerTodasLasSesiones={() => setSeccionCoach('PLANIFICADOR')}
                />
              )}

              {seccionCoach === 'BANCO_EJERCICIOS' && <ExerciseBankView />}

              {seccionCoach === 'ATLETAS' && (
                atletaDetalleAbierto ? (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setAtletaDetalleAbierto(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--mut)] hover:text-[var(--txt)] cursor-pointer"
                    >
                      <IconInterface name="back" size={14} />
                      <span>Volver a la lista de atletas</span>
                    </button>
                    <AthleteProfileView
                      onIrAlPlan={() => setSeccionCoach('PLANIFICADOR')}
                      onVerEvaluaciones={() => setSeccionCoach('EVALUACIONES')}
                    />
                  </div>
                ) : (
                  <CoachAthletesListView
                    onAbrirAtleta={() => setAtletaDetalleAbierto(true)}
                  />
                )
              )}

              {seccionCoach === 'ALERTAS' && (
                <CoachAlertsView
                  onNavegarA={(destino) => {
                    if (destino === 'FICHA') {
                      setAtletaDetalleAbierto(true);
                      setSeccionCoach('ATLETAS');
                    } else if (destino === 'CARGA') {
                      setSeccionCoach('CONTROL_CARGA');
                    }
                  }}
                />
              )}

              {seccionCoach === 'PLANIFICADOR' && <PeriodizationPlannerView />}

              {seccionCoach === 'EVALUACIONES' && <CoachEvaluationsView />}
            </>
          )}

          {/* VISTAS DE ALUMNO (CATÁLOGO NEYIMA ALUMNO) */}
          {rolActivo === 'ALUMNO' && (
            <>
              {(vistaAlumnoActual === 'HOY' || vistaAlumnoActual === 'RUTINA') && (
                <AthleteTodayView
                  onIniciarEntrenamiento={() => setWorkoutActivo(true)}
                  onIrABienestar={() => setVistaAlumnoActual('BIENESTAR')}
                />
              )}

              {(vistaAlumnoActual === 'PROGRESO' || vistaAlumnoActual === 'FOTOS') && (
                <AthleteGalleryMLP />
              )}

              {vistaAlumnoActual === 'BIENESTAR' && (
                <AthleteWellnessView
                  onGuardadoExitoso={() => setVistaAlumnoActual('HOY')}
                />
              )}

              {vistaAlumnoActual === 'HISTORIAL' && <AthleteHistoryView />}

              {vistaAlumnoActual === 'CICLO' && (
                atletaActual.generoAtleta === 'F' ? (
                  <AthleteCycleView />
                ) : (
                  <AthleteTodayView
                    onIniciarEntrenamiento={() => setWorkoutActivo(true)}
                    onIrABienestar={() => setVistaAlumnoActual('BIENESTAR')}
                  />
                )
              )}

              {vistaAlumnoActual === 'SUENIO' && <AthleteSleepWearableMLP />}

              {vistaAlumnoActual === 'DASHBOARD' && <AthleteAnnualProgressView />}
            </>
          )}
        </main>
      </div>

      {/* MODAL DE ENTRENAMIENTO ACTIVO & CIERRE v2 */}
      {workoutActivo && (
        <ActiveWorkoutModal
          sesion={sesionDelDia}
          onCerrar={() => setWorkoutActivo(false)}
        />
      )}

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
