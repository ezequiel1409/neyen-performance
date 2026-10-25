// =====================================================================
// NEYEN ATHLETIC - BARRA DE NAVEGACIÓN SUPERIOR (LIGHT & DARK THEME)
// =====================================================================

import React, { useEffect, useState } from 'react';
import { useTraining } from '../context/TrainingContext';
import {
  Activity,
  AlertTriangle,
  Award,
  Calendar,
  Dumbbell,
  Moon,
  Sparkles,
  Sun,
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

  // Control de Tema (Claro / Oscuro)
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const saved = localStorage.getItem('neyen_theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('neyen_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('neyen_theme', 'light');
    }
  };

  const tieneAlertaRetraso =
    atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.enRetrasoMenstrual;

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#E5E2D5] dark:border-[#25524A] bg-[#FAF7EE]/95 dark:bg-[#0E2420]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Marca y Logotipo */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#163832] dark:bg-[#E85938] shadow-md transition"
            aria-hidden="true"
          >
            <Activity className="h-6 w-6 text-white dark:text-[#112B26]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-[#163832] dark:text-white">
                NEYEN
              </span>
              <span className="rounded-full bg-[#E1ECE5] dark:bg-[#1C4740] px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest text-[#163832] dark:text-[#E1ECE5]">
                Performance OS
              </span>
            </div>
            <p className="hidden text-xs text-[#163832]/70 dark:text-[#9EB5B0] sm:block">
              Preparación Física Periodizada & Rendimiento
            </p>
          </div>
        </div>

        {/* Zona de Contexto: Atleta, Selector de Rol & Botón de Tema */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Selector de Atleta (Solo Coach) */}
          {rolActivo === 'COACH' ? (
            <div className="flex items-center gap-2 rounded-xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] px-3 py-1.5 text-xs text-[#163832] dark:text-white min-h-[44px]">
              <label htmlFor="selector-atleta-activo" className="flex items-center gap-1.5 cursor-pointer">
                <User className="h-4 w-4 text-[#E85938] shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Atleta:</span>
              </label>
              <select
                id="selector-atleta-activo"
                aria-label="Seleccionar atleta para gestionar"
                value={atletaSeleccionadoId}
                onChange={(e) => setAtletaSeleccionadoId(e.target.value)}
                className="bg-transparent font-bold text-[#163832] dark:text-white cursor-pointer focus:outline-none rounded px-1 min-h-[36px]"
              >
                {atletas.map((atleta) => (
                  <option
                    key={atleta.identificadorAtleta}
                    value={atleta.identificadorAtleta}
                    className="bg-white dark:bg-[#163630] text-[#163832] dark:text-white"
                  >
                    {atleta.nombreCompleto} ({atleta.deportePracticado})
                  </option>
                ))}
              </select>

              {tieneAlertaRetraso && (
                <span
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-1 rounded-full bg-[#E85938] px-2.5 py-1 text-xs font-bold text-[#112B26]"
                >
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Retraso</span>
                </span>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 rounded-xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] px-3 py-1.5 text-xs text-[#163832] dark:text-white min-h-[44px]">
              <User className="h-4 w-4 text-[#E85938]" aria-hidden="true" />
              <span className="font-bold text-[#163832] dark:text-white">{atletaActual.nombreCompleto}</span>
              <span className="text-xs text-[#163832]/70 dark:text-[#9EB5B0]">({atletaActual.deportePracticado})</span>
            </div>
          )}

          {/* Selector de Rol: Coach vs Alumno */}
          <div
            role="group"
            aria-label="Selector de rol de usuario"
            className="flex rounded-xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] p-1 min-h-[44px] items-center"
          >
            <button
              type="button"
              onClick={() => setRolActivo('COACH')}
              aria-pressed={rolActivo === 'COACH'}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition min-h-[36px] ${
                rolActivo === 'COACH'
                  ? 'bg-[#163832] text-white shadow-sm'
                  : 'text-[#163832]/70 dark:text-[#9EB5B0] hover:text-[#163832] dark:hover:text-white'
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
                  ? 'bg-[#E85938] text-[#112B26] shadow-sm font-extrabold'
                  : 'text-[#163832]/70 dark:text-[#9EB5B0] hover:text-[#163832] dark:hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Alumno</span>
            </button>
          </div>

          {/* Botón de alternancia de tema (Claro / Oscuro) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#E5E2D5] dark:border-[#25524A] bg-white dark:bg-[#163630] text-[#163832] dark:text-[#FAF7EE] hover:bg-[#E1ECE5]/40 active:scale-95 transition"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-400 stroke-[2.5]" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5 text-[#163832] stroke-[2.5]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Navegación secundaria (Pestañas) */}
      <nav
        aria-label="Vistas de sección"
        className={`border-t-2 border-[#E5E2D5] dark:border-[#25524A] bg-[#FAF7EE]/60 dark:bg-[#0E2420]/60 px-4 sm:px-6 ${
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
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap ${
                  vistaCoachActual === 'EJERCICIOS'
                    ? 'bg-[#E1ECE5] dark:bg-[#1C4740] text-[#163832] dark:text-[#FAF7EE] border-2 border-[#163832] dark:border-[#25524A]'
                    : 'text-[#163832]/70 dark:text-[#9EB5B0] hover:bg-[#E1ECE5]/40'
                }`}
              >
                <Dumbbell className="h-4 w-4" aria-hidden="true" />
                <span>Banco de Ejercicios</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaCoachActual === 'ATLETAS'}
                onClick={() => setVistaCoachActual('ATLETAS')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap ${
                  vistaCoachActual === 'ATLETAS'
                    ? 'bg-[#E1ECE5] dark:bg-[#1C4740] text-[#163832] dark:text-[#FAF7EE] border-2 border-[#163832] dark:border-[#25524A]'
                    : 'text-[#163832]/70 dark:text-[#9EB5B0] hover:bg-[#E1ECE5]/40'
                }`}
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                <span>Ficha Técnica & Tests 1RM</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaCoachActual === 'PLANES'}
                onClick={() => setVistaCoachActual('PLANES')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap ${
                  vistaCoachActual === 'PLANES'
                    ? 'bg-[#E1ECE5] dark:bg-[#1C4740] text-[#163832] dark:text-[#FAF7EE] border-2 border-[#163832] dark:border-[#25524A]'
                    : 'text-[#163832]/70 dark:text-[#9EB5B0] hover:bg-[#E1ECE5]/40'
                }`}
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>Planificador (Meso / Sesiones)</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaCoachActual === 'ANUAL'}
                onClick={() => setVistaCoachActual('ANUAL')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap ${
                  vistaCoachActual === 'ANUAL'
                    ? 'bg-[#E1ECE5] dark:bg-[#1C4740] text-[#163832] dark:text-[#FAF7EE] border-2 border-[#163832] dark:border-[#25524A]'
                    : 'text-[#163832]/70 dark:text-[#9EB5B0] hover:bg-[#E1ECE5]/40'
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
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap ${
                  vistaAlumnoActual === 'RUTINA'
                    ? 'bg-[#E1ECE5] dark:bg-[#1C4740] text-[#163832] dark:text-[#FAF7EE] border-2 border-[#163832] dark:border-[#25524A]'
                    : 'text-[#163832]/70 dark:text-[#9EB5B0] hover:bg-[#E1ECE5]/40'
                }`}
              >
                <Dumbbell className="h-4 w-4" aria-hidden="true" />
                <span>Mi Sesión de Hoy</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'DASHBOARD'}
                onClick={() => setVistaAlumnoActual('DASHBOARD')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap ${
                  vistaAlumnoActual === 'DASHBOARD'
                    ? 'bg-[#E1ECE5] dark:bg-[#1C4740] text-[#163832] dark:text-[#FAF7EE] border-2 border-[#163832] dark:border-[#25524A]'
                    : 'text-[#163832]/70 dark:text-[#9EB5B0] hover:bg-[#E1ECE5]/40'
                }`}
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>Mis Tests & Progreso Anual</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'FOTOS'}
                onClick={() => setVistaAlumnoActual('FOTOS')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap ${
                  vistaAlumnoActual === 'FOTOS'
                    ? 'bg-[#E1ECE5] dark:bg-[#1C4740] text-[#163832] dark:text-[#FAF7EE] border-2 border-[#163832] dark:border-[#25524A]'
                    : 'text-[#163832]/70 dark:text-[#9EB5B0] hover:bg-[#E1ECE5]/40'
                }`}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Galería de Fotos (MLP)</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'SUENIO'}
                onClick={() => setVistaAlumnoActual('SUENIO')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap ${
                  vistaAlumnoActual === 'SUENIO'
                    ? 'bg-[#E1ECE5] dark:bg-[#1C4740] text-[#163832] dark:text-[#FAF7EE] border-2 border-[#163832] dark:border-[#25524A]'
                    : 'text-[#163832]/70 dark:text-[#9EB5B0] hover:bg-[#E1ECE5]/40'
                }`}
              >
                <Moon className="h-4 w-4" aria-hidden="true" />
                <span>Descanso & Smartwatch</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
