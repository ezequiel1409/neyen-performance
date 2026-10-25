// =====================================================================
// NEYEN ATHLETIC - BARRA LATERAL DEL COACH (DESKTOP/TABLET SIDEBAR)
// DISEÑO FIEL A BRANDING MOCKUPS (SALVIA #2F6B4F & BOSQUE #1D2B24)
// =====================================================================

import React from 'react';
import { NeyenLogo } from '../ui/NeyenLogo';
import { useTraining } from '../../context/TrainingContext';

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
  const { cerrarSesion } = useTraining();

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
      className="w-56 shrink-0 py-8 pr-6 flex flex-col justify-between min-h-[calc(100vh-2rem)] select-none"
    >
      <div className="space-y-8">
        {/* Logo NEYEN COACH con Isotipo oficial */}
        <div className="px-2">
          <NeyenLogo size="md" subtitle="COACH" showSubtitle={true} />
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
                className={`text-left text-sm transition select-none min-h-[48px] flex items-center px-4 py-3 rounded-2xl ${
                  isActive
                    ? 'bg-[#2F6B4F] text-white font-extrabold shadow-sm'
                    : 'text-[#1D2B24] dark:text-[#FAF7EE]/80 font-bold hover:bg-[#E3EFE7]/50 dark:hover:bg-[#15332B]/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pie de navegación: Cerrar sesión */}
      <div className="pt-6 border-t border-[#E5E2D5] dark:border-[#244E43] space-y-2">
        <button
          type="button"
          onClick={cerrarSesion}
          className="w-full text-left text-sm font-bold text-[#1D2B24] dark:text-[#FAF7EE]/80 hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center px-4 py-3 rounded-2xl min-h-[48px]"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};
