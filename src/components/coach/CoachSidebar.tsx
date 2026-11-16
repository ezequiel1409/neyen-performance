// =====================================================================
// NEYIMA ATHLETIC - BARRA LATERAL DEL COACH (DESKTOP/TABLET SIDEBAR)
// DISEÑO FIEL A MOCKUPS NEYIMA (TOKENS BURDEOS & ARENA)
// =====================================================================

import React from 'react';
import { NeyimaLogo } from '../ui/NeyimaLogo';
import { useTraining } from '../../context/TrainingContext';
import { IconInterface, type IconInterfaceName } from '../ui/icons/IconInterface';

export type CoachNavSection =
  | 'RESUMEN'
  | 'ATLETAS'
  | 'PLANIFICADOR'
  | 'BANCO_EJERCICIOS'
  | 'CONTROL_CARGA'
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
  const { cerrarSesion } = useTraining();

  const items: Array<{ id: CoachNavSection; label: string; icon: IconInterfaceName }> = [
    { id: 'RESUMEN', label: 'Resumen', icon: 'home' },
    { id: 'ATLETAS', label: 'Atletas', icon: 'users' },
    { id: 'PLANIFICADOR', label: 'Planificador', icon: 'calendar' },
    { id: 'BANCO_EJERCICIOS', label: 'Banco de ejercicios', icon: 'dumbbell' },
    { id: 'CONTROL_CARGA', label: 'Control de carga', icon: 'gauge' },
    { id: 'EVALUACIONES', label: 'Evaluaciones', icon: 'clipboard' },
    { id: 'ALERTAS', label: 'Alertas', icon: 'bell' },
  ];

  return (
    <aside
      aria-label="Navegación del Coach"
      className="w-64 shrink-0 py-6 pr-6 flex flex-col justify-between min-h-[calc(100vh-2rem)] select-none border-r border-[var(--bord)]"
    >
      <div className="space-y-6">
        {/* Logo NEYIMA COACH con Isotipo oficial */}
        <div className="px-2">
          <NeyimaLogo size="md" variant="emblema" roleTag="COACH" />
        </div>

        {/* Lista de navegación vertical */}
        <nav className="flex flex-col space-y-1" role="navigation">
          {items.map((item) => {
            const isActive = seccionActiva === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onCambiarSeccion(item.id)}
                className={`text-left text-sm transition min-h-[46px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer ${
                  isActive
                    ? 'bg-[var(--navbg)] text-[var(--navon)] font-extrabold shadow-xs'
                    : 'text-[var(--txt)] font-bold hover:bg-[var(--surf)]'
                }`}
              >
                <IconInterface
                  name={item.icon}
                  size={18}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pie de navegación: Cerrar sesión */}
      <div className="pt-4 border-t border-[var(--bord)] space-y-2">
        <button
          type="button"
          onClick={cerrarSesion}
          className="w-full text-left text-sm font-bold text-[var(--txt)] hover:text-[var(--acc)] transition flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl min-h-[44px] cursor-pointer"
        >
          <IconInterface name="logout" size={18} aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
