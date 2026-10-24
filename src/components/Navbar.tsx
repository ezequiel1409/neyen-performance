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

  const tieneAlertaRetraso = atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.enRetrasoMenstrual;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Marca y Logotipo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 shadow-lg shadow-blue-500/20">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white">NEYEN</span>
              <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 border border-blue-500/30">
                Performance OS
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">Preparación Física Periodizada & Rendimiento</p>
          </div>
        </div>

        {/* Selector de Atleta Activo (contexto rápido) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300">
            <User className="h-4 w-4 text-blue-400" />
            <span className="hidden text-slate-400 sm:inline">Atleta:</span>
            <select
              value={atletaSeleccionadoId}
              onChange={(e) => setAtletaSeleccionadoId(e.target.value)}
              className="bg-transparent font-medium text-white outline-none cursor-pointer"
            >
              {atletas.map((atleta) => (
                <option key={atleta.identificadorAtleta} value={atleta.identificadorAtleta} className="bg-slate-900 text-white">
                  {atleta.nombreCompleto} ({atleta.deportePracticado})
                </option>
              ))}
            </select>

            {tieneAlertaRetraso && (
              <span className="flex items-center gap-1 rounded bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-300 animate-pulse border border-rose-500/40">
                <AlertTriangle className="h-3 w-3" />
                Retraso
              </span>
            )}
          </div>

          {/* Selector de Rol: Coach vs Alumno */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
            <button
              onClick={() => setRolActivo('COACH')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                rolActivo === 'COACH'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Coach
            </button>
            <button
              onClick={() => setRolActivo('ALUMNO')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                rolActivo === 'ALUMNO'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Alumno
            </button>
          </div>
        </div>
      </div>

      {/* Navegación secundaria según el Rol activo */}
      <div className="border-t border-slate-800/80 bg-slate-900/50 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto py-2">
          {rolActivo === 'COACH' ? (
            <>
              <button
                onClick={() => setVistaCoachActual('EJERCICIOS')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  vistaCoachActual === 'EJERCICIOS'
                    ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Dumbbell className="h-3.5 w-3.5" />
                Banco de Ejercicios & Maestros
              </button>

              <button
                onClick={() => setVistaCoachActual('ATLETAS')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  vistaCoachActual === 'ATLETAS'
                    ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Ficha Técnica & Tests 1RM
              </button>

              <button
                onClick={() => setVistaCoachActual('PLANES')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  vistaCoachActual === 'PLANES'
                    ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Award className="h-3.5 w-3.5" />
                Planificador (Meso / Sesiones / %1RM)
              </button>

              <button
                onClick={() => setVistaCoachActual('ANUAL')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  vistaCoachActual === 'ANUAL'
                    ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                Macrociclo Anual (52 Semanas)
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setVistaAlumnoActual('RUTINA')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  vistaAlumnoActual === 'RUTINA'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Dumbbell className="h-3.5 w-3.5" />
                Mi Sesión de Hoy
              </button>

              <button
                onClick={() => setVistaAlumnoActual('DASHBOARD')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  vistaAlumnoActual === 'DASHBOARD'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Award className="h-3.5 w-3.5" />
                Mis Tests & Progreso Anual
              </button>

              <button
                onClick={() => setVistaAlumnoActual('FOTOS')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  vistaAlumnoActual === 'FOTOS'
                    ? 'bg-slate-800 text-purple-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                Galería de Progreso (MLP)
              </button>

              <button
                onClick={() => setVistaAlumnoActual('SUENIO')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  vistaAlumnoActual === 'SUENIO'
                    ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-indigo-400" />
                Descanso & Smartwatch (MLP)
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
