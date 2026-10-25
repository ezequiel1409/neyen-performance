// =====================================================================
// NEYEN ATHLETIC - BARRA LATERAL DEL COACH (DESKTOP/TABLET SIDEBAR)
// =====================================================================

import React from 'react';
import { Activity } from 'lucide-react';

export type CoachNavSection =
  | 'RESUMEN'
  | 'ATLETAS'
  | 'PLANIFICADOR'
  | 'BANCO_EJERCICIOS'
  | 'EVALUACIONES'
  | 'ALERTAS';

interface CoachSidebarProps {
  seccionActiva: CoachNavSection;
  onCambiarSeccion: (seccion: CoachNavSection) => void;
}

export const CoachSidebar: React.FC<CoachSidebarProps> = ({
  seccionActiva,
  onCambiarSeccion,
}) => {
  const items: Array<{ id: CoachNavSection; label: string }> = [
    { id: 'RESUMEN', label: 'Resumen' },
    { id: 'ATLETAS', label: 'Atletas' },
    { id: 'PLANIFICADOR', label: 'Planificador' },
    { id: 'BANCO_EJERCICIOS', label: 'Banco de ejercicios' },
    { id: 'EVALUACIONES', label: 'Evaluaciones' },
    { id: 'ALERTAS', label: 'Alertas' },
  ];

  return (
    <aside
      aria-label="Navegación del Coach"
      className="w-56 shrink-0 py-6 pr-6 flex flex-col justify-between"
    >
      <div className="space-y-8">
        {/* Logo NEYEN COACH */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163832] dark:bg-[#E85938] shadow-sm">
            <Activity className="h-5 w-5 text-white dark:text-[#112B26]" />
          </div>
          <div>
            <span className="block text-lg font-black tracking-wider text-[#163832] dark:text-white leading-none">
              NEYEN
            </span>
            <span className="block text-[10px] font-bold tracking-widest text-[#163832]/60 dark:text-[#9EB5B0] uppercase mt-0.5">
              COACH
            </span>
          </div>
        </div>

        {/* Lista de navegación vertical */}
        <nav className="flex flex-col space-y-1.5" role="navigation">
          {items.map((item) => {
            const isActive = seccionActiva === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onCambiarSeccion(item.id)}
                className={`text-left text-sm transition select-none min-h-[44px] flex items-center px-4 py-2.5 rounded-2xl ${
                  isActive
                    ? 'bg-[#1D4A41] dark:bg-[#E85938] text-white dark:text-[#112B26] font-extrabold shadow-sm'
                    : 'text-[#163832] dark:text-[#FAF7EE]/70 font-semibold hover:bg-[#E1ECE5]/40 dark:hover:bg-[#163630]/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
