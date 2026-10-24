// =====================================================================
// NEYEN ATHLETIC - BARRA DE NAVEGACIÓN SUPERIOR
// =====================================================================

import React from 'react';
import { useTraining } from '../context/TrainingContext';
import {
  Activity,
  AlertTriangle,
  Award,
  Calendar,
  Dumbbell,
  Moon,
  Sparkles,
  User,
  Users,
} from 'lucide-react';

interface NavbarProps {
  vistaCoachActual: 'EJERCICIOS' | 'ATLETAS' | 'PLANES' | 'ANUAL';
  setVistaCoachActual: (vista: 'EJERCICIOS' | 'ATLETAS' | 'PLANES' | 'ANUAL') => void;
  vistaAlumnoActual: 'RUTINA' | 'DASHBOARD' | 'FOTOS' | 'SUENIO';
  setVistaAlumnoActual: (vista: 'RUTINA' | 'DASHBOARD' | 'FOTOS' | 'SUENIO') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  vistaCoachActual,
  setVistaCoachActual,
  vistaAlumnoActual,
  setVistaAlumnoActual,
}) => {
  const {
    rolActivo,
    setRolActivo,
    atletaActual,
    atletas,
    atletaSeleccionadoId,
    setAtletaSeleccionadoId,
  } = useTraining();

  const tieneAlertaRetraso =
    atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.enRetrasoMenstrual;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Marca y Logotipo */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 shadow-lg shadow-blue-500/20"
            aria-hidden="true"
          >
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white">NEYEN</span>
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-blue-400 border border-blue-500/30">
                Performance OS
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Preparación Física Periodizada & Rendimiento
            </p>
          </div>
        </div>

        {/* Zona de Contexto: Atleta & Selector de Rol */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Si el rol es COACH, permite cambiar de atleta. Si es ALUMNO, solo muestra el atleta actual */}
          {rolActivo === 'COACH' ? (
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300 min-h-[44px]">
              <label htmlFor="selector-atleta-activo" className="flex items-center gap-1.5 cursor-pointer">
                <User className="h-4 w-4 text-blue-400 shrink-0" aria-hidden="true" />
                <span className="hidden text-slate-400 sm:inline">Atleta:</span>
              </label>
              <select
                id="selector-atleta-activo"
                aria-label="Seleccionar atleta para gestionar"
                value={atletaSeleccionadoId}
                onChange={(e) => setAtletaSeleccionadoId(e.target.value)}
                className="bg-transparent font-medium text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 min-h-[36px]"
              >
                {atletas.map((atleta) => (
                  <option
                    key={atleta.identificadorAtleta}
                    value={atleta.identificadorAtleta}
                    className="bg-slate-900 text-white"
                  >
                    {atleta.nombreCompleto} ({atleta.deportePracticado})
                  </option>
                ))}
              </select>

              {tieneAlertaRetraso && (
                <span
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-1 rounded bg-rose-500/20 px-2 py-1 text-xs font-bold text-rose-300 border border-rose-500/40 animate-pulse motion-reduce:animate-none"
                >
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Retraso</span>
                </span>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300 min-h-[44px]">
              <User className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span className="font-semibold text-white">{atletaActual.nombreCompleto}</span>
              <span className="text-slate-400">({atletaActual.deportePracticado})</span>
            </div>
          )}

          {/* Selector de Rol: Coach vs Alumno */}
          <div
            role="group"
            aria-label="Selector de rol de usuario"
            className="flex rounded-xl border border-slate-800 bg-slate-900 p-1 min-h-[44px] items-center"
          >
            <button
              type="button"
              onClick={() => setRolActivo('COACH')}
              aria-pressed={rolActivo === 'COACH'}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition min-h-[36px] ${
                rolActivo === 'COACH'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Coach</span>
            </button>
            <button
              type="button"
              onClick={() => setRolActivo('ALUMNO')}
              aria-pressed={rolActivo === 'ALUMNO'}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition min-h-[36px] ${
                rolActivo === 'ALUMNO'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Alumno</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navegación secundaria:
          En mobile para ALUMNO se oculta porque entra en juego el BottomNav.
          En desktop siempre está visible.
      */}
      <nav
        aria-label="Vistas de sección"
        className={`border-t border-slate-800/80 bg-slate-900/50 px-4 sm:px-6 ${
          rolActivo === 'ALUMNO' ? 'hidden sm:block' : 'block'
        }`}
      >
        <div
          role="tablist"
          className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-2 scrollbar-none"
        >
          {rolActivo === 'COACH' ? (
            <>
              <button
                role="tab"
                aria-selected={vistaCoachActual === 'EJERCICIOS'}
                onClick={() => setVistaCoachActual('EJERCICIOS')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition min-h-[44px] whitespace-nowrap ${
                  vistaCoachActual === 'EJERCICIOS'
                    ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Dumbbell className="h-4 w-4" aria-hidden="true" />
                <span>Banco de Ejercicios & Maestros</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaCoachActual === 'ATLETAS'}
                onClick={() => setVistaCoachActual('ATLETAS')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition min-h-[44px] whitespace-nowrap ${
                  vistaCoachActual === 'ATLETAS'
                    ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                <span>Ficha Técnica & Tests 1RM</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaCoachActual === 'PLANES'}
                onClick={() => setVistaCoachActual('PLANES')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition min-h-[44px] whitespace-nowrap ${
                  vistaCoachActual === 'PLANES'
                    ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>Planificador (Meso / Sesiones / %1RM)</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaCoachActual === 'ANUAL'}
                onClick={() => setVistaCoachActual('ANUAL')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition min-h-[44px] whitespace-nowrap ${
                  vistaCoachActual === 'ANUAL'
                    ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Macrociclo Anual (52 Semanas)</span>
              </button>
            </>
          ) : (
            <>
              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'RUTINA'}
                onClick={() => setVistaAlumnoActual('RUTINA')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition min-h-[44px] whitespace-nowrap ${
                  vistaAlumnoActual === 'RUTINA'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Dumbbell className="h-4 w-4" aria-hidden="true" />
                <span>Mi Sesión de Hoy</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'DASHBOARD'}
                onClick={() => setVistaAlumnoActual('DASHBOARD')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition min-h-[44px] whitespace-nowrap ${
                  vistaAlumnoActual === 'DASHBOARD'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>Mis Tests & Progreso Anual</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'FOTOS'}
                onClick={() => setVistaAlumnoActual('FOTOS')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition min-h-[44px] whitespace-nowrap ${
                  vistaAlumnoActual === 'FOTOS'
                    ? 'bg-slate-800 text-purple-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Sparkles className="h-4 w-4 text-purple-400" aria-hidden="true" />
                <span>Galería de Progreso (MLP)</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'SUENIO'}
                onClick={() => setVistaAlumnoActual('SUENIO')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition min-h-[44px] whitespace-nowrap ${
                  vistaAlumnoActual === 'SUENIO'
                    ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Moon className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                <span>Descanso & Smartwatch (MLP)</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
