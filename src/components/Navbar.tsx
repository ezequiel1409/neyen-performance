// =====================================================================
// NEYIMA ATHLETIC - BARRA DE NAVEGACIÓN SUPERIOR (LIGHT & DARK THEME)
// =====================================================================

import React, { useEffect, useState } from 'react';
import { useTraining } from '../context/TrainingContext';
import { NeyimaLogo } from './ui/NeyimaLogo';
import { IndicatorStatus } from './ui/IndicatorStatus';
import { IconInterface } from './ui/icons/IconInterface';

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
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const saved = localStorage.getItem('neyen_theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('neyen_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('neyen_theme', 'light');
    }
  };

  const tieneAlertaRetraso =
    atletaActual.generoAtleta === 'F' && atletaActual.datosCicloMenstrual?.enRetrasoMenstrual;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--bord)] bg-[var(--surf)]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Marca y Logotipo Oficial NEYIMA */}
        <div className="flex items-center gap-3">
          <NeyimaLogo
            variant="emblema"
            size="md"
            roleTag={rolActivo === 'COACH' ? 'COACH' : 'ALUMNO'}
          />
        </div>

        {/* Zona de Contexto: Atleta, Selector de Rol & Botón de Tema */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Selector de Atleta (Solo Coach) */}
          {rolActivo === 'COACH' ? (
            <div className="flex items-center gap-2 rounded-xl border border-[var(--bord)] bg-[var(--bg)] px-3 py-1.5 text-xs text-[var(--txt)] min-h-[44px]">
              <label htmlFor="selector-atleta-activo" className="flex items-center gap-1.5 cursor-pointer text-[var(--mut)]">
                <IconInterface name="users" size={16} aria-hidden="true" />
                <span className="hidden sm:inline font-bold">Atleta:</span>
              </label>
              <select
                id="selector-atleta-activo"
                aria-label="Seleccionar atleta para gestionar"
                value={atletaSeleccionadoId}
                onChange={(e) => setAtletaSeleccionadoId(e.target.value)}
                className="bg-transparent font-bold text-[var(--txt)] cursor-pointer focus:outline-none rounded px-1 min-h-[36px]"
              >
                {atletas.map((atleta) => (
                  <option
                    key={atleta.identificadorAtleta}
                    value={atleta.identificadorAtleta}
                    className="bg-[var(--surf)] text-[var(--txt)]"
                  >
                    {atleta.nombreCompleto} ({atleta.deportePracticado})
                  </option>
                ))}
              </select>

              {tieneAlertaRetraso && (
                <IndicatorStatus
                  status="warn"
                  label="Retraso"
                  size="sm"
                />
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[var(--bord)] bg-[var(--bg)] px-3 py-1.5 text-xs text-[var(--txt)] min-h-[44px]">
              <IconInterface name="users" size={16} className="text-[var(--mut)]" aria-hidden="true" />
              <span className="font-bold text-[var(--txt)]">{atletaActual.nombreCompleto}</span>
              <span className="text-xs text-[var(--mut)]">({atletaActual.deportePracticado})</span>
            </div>
          )}

          {/* Selector de Rol: Coach vs Alumno */}
          <div
            role="group"
            aria-label="Selector de rol de usuario"
            className="flex rounded-xl border border-[var(--bord)] bg-[var(--bg)] p-1 min-h-[44px] items-center"
          >
            <button
              type="button"
              onClick={() => setRolActivo('COACH')}
              aria-pressed={rolActivo === 'COACH'}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition min-h-[36px] cursor-pointer ${
                rolActivo === 'COACH'
                  ? 'bg-[var(--navbg)] text-[var(--navon)] shadow-xs'
                  : 'text-[var(--mut)] hover:text-[var(--txt)]'
              }`}
            >
              <IconInterface name="users" size={14} aria-hidden="true" />
              <span>Coach</span>
            </button>
            <button
              type="button"
              onClick={() => setRolActivo('ALUMNO')}
              aria-pressed={rolActivo === 'ALUMNO'}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition min-h-[36px] cursor-pointer ${
                rolActivo === 'ALUMNO'
                  ? 'bg-[var(--navbg)] text-[var(--navon)] shadow-xs font-extrabold'
                  : 'text-[var(--mut)] hover:text-[var(--txt)]'
              }`}
            >
              <IconInterface name="heart" size={14} aria-hidden="true" />
              <span>Alumno</span>
            </button>
          </div>

          {/* Botón de alternancia de tema (Claro / Oscuro) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--bord)] bg-[var(--bg)] text-[var(--txt)] hover:bg-[var(--surf)] active:scale-95 transition cursor-pointer"
          >
            {isDark ? (
              <IconInterface name="star" size={18} strokeWidth={2.2} aria-hidden="true" />
            ) : (
              <IconInterface name="moon" size={18} strokeWidth={2.2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Navegación secundaria (Pestañas) */}
      <nav
        aria-label="Vistas de sección"
        className={`border-t border-[var(--bord)] bg-[var(--surf)] px-4 sm:px-6 ${
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
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap cursor-pointer ${
                  vistaCoachActual === 'EJERCICIOS'
                    ? 'bg-[var(--okbg)] text-[var(--oktx)] border border-[var(--bord)] shadow-xs'
                    : 'text-[var(--mut)] hover:text-[var(--txt)] hover:bg-[var(--bg)]'
                }`}
              >
                <IconInterface name="dumbbell" size={16} aria-hidden="true" />
                <span>Banco de Ejercicios</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaCoachActual === 'ATLETAS'}
                onClick={() => setVistaCoachActual('ATLETAS')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap cursor-pointer ${
                  vistaCoachActual === 'ATLETAS'
                    ? 'bg-[var(--okbg)] text-[var(--oktx)] border border-[var(--bord)] shadow-xs'
                    : 'text-[var(--mut)] hover:text-[var(--txt)] hover:bg-[var(--bg)]'
                }`}
              >
                <IconInterface name="users" size={16} aria-hidden="true" />
                <span>Ficha Técnica & Tests 1RM</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaCoachActual === 'PLANES'}
                onClick={() => setVistaCoachActual('PLANES')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap cursor-pointer ${
                  vistaCoachActual === 'PLANES'
                    ? 'bg-[var(--okbg)] text-[var(--oktx)] border border-[var(--bord)] shadow-xs'
                    : 'text-[var(--mut)] hover:text-[var(--txt)] hover:bg-[var(--bg)]'
                }`}
              >
                <IconInterface name="clipboard" size={16} aria-hidden="true" />
                <span>Planificador (Meso / Sesiones)</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaCoachActual === 'ANUAL'}
                onClick={() => setVistaCoachActual('ANUAL')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap cursor-pointer ${
                  vistaCoachActual === 'ANUAL'
                    ? 'bg-[var(--okbg)] text-[var(--oktx)] border border-[var(--bord)] shadow-xs'
                    : 'text-[var(--mut)] hover:text-[var(--txt)] hover:bg-[var(--bg)]'
                }`}
              >
                <IconInterface name="calendar" size={16} aria-hidden="true" />
                <span>Macrociclo Anual (52 Semanas)</span>
              </button>
            </>
          ) : (
            <>
              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'RUTINA'}
                onClick={() => setVistaAlumnoActual('RUTINA')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap cursor-pointer ${
                  vistaAlumnoActual === 'RUTINA'
                    ? 'bg-[var(--okbg)] text-[var(--oktx)] border border-[var(--bord)] shadow-xs'
                    : 'text-[var(--mut)] hover:text-[var(--txt)] hover:bg-[var(--bg)]'
                }`}
              >
                <IconInterface name="dumbbell" size={16} aria-hidden="true" />
                <span>Mi Sesión de Hoy</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'DASHBOARD'}
                onClick={() => setVistaAlumnoActual('DASHBOARD')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap cursor-pointer ${
                  vistaAlumnoActual === 'DASHBOARD'
                    ? 'bg-[var(--okbg)] text-[var(--oktx)] border border-[var(--bord)] shadow-xs'
                    : 'text-[var(--mut)] hover:text-[var(--txt)] hover:bg-[var(--bg)]'
                }`}
              >
                <IconInterface name="trend" size={16} aria-hidden="true" />
                <span>Mis Tests & Progreso Anual</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'FOTOS'}
                onClick={() => setVistaAlumnoActual('FOTOS')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap cursor-pointer ${
                  vistaAlumnoActual === 'FOTOS'
                    ? 'bg-[var(--okbg)] text-[var(--oktx)] border border-[var(--bord)] shadow-xs'
                    : 'text-[var(--mut)] hover:text-[var(--txt)] hover:bg-[var(--bg)]'
                }`}
              >
                <IconInterface name="camera" size={16} aria-hidden="true" />
                <span>Galería de Fotos (MLP)</span>
              </button>

              <button
                role="tab"
                aria-selected={vistaAlumnoActual === 'SUENIO'}
                onClick={() => setVistaAlumnoActual('SUENIO')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[44px] whitespace-nowrap cursor-pointer ${
                  vistaAlumnoActual === 'SUENIO'
                    ? 'bg-[var(--okbg)] text-[var(--oktx)] border border-[var(--bord)] shadow-xs'
                    : 'text-[var(--mut)] hover:text-[var(--txt)] hover:bg-[var(--bg)]'
                }`}
              >
                <IconInterface name="moon" size={16} aria-hidden="true" />
                <span>Descanso & Smartwatch</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
