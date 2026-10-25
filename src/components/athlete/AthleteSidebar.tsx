// =====================================================================
// NEYEN ATHLETIC - BARRA LATERAL DEL ALUMNO (DESKTOP/TABLET SIDEBAR)
// DISEÑO FIEL A MOCKUP (IMAGEN 1)
// =====================================================================

import React from 'react';
import { NeyenLogo } from '../ui/NeyenLogo';
import { useTraining } from '../../context/TrainingContext';
import { VistaAlumno } from '../ui/BottomNav';

interface AthleteSidebarProps {
  vistaActual: VistaAlumno;
  onCambiarVista: (vista: VistaAlumno) => void;
}

export const AthleteSidebar: React.FC<AthleteSidebarProps> = ({
  vistaActual,
  onCambiarVista,
}) => {
  const { cerrarSesion } = useTraining();

  const items: Array<{ id: VistaAlumno; label: string }> = [
    { id: 'RUTINA', label: 'Mi sesión de hoy' },
    { id: 'DASHBOARD', label: 'Progreso anual' },
    { id: 'FOTOS', label: 'Fotos de progreso' },
    { id: 'SUENIO', label: 'Descanso y reloj' },
  ];

  return (
    <aside
      aria-label="Navegación del Alumno"
      className="w-60 shrink-0 py-8 pr-6 flex flex-col justify-between min-h-[calc(100vh-2rem)] select-none"
    >
      <div className="space-y-10">
        {/* Logo NEYEN */}
        <div className="px-2">
          <NeyenLogo size="md" showSubtitle={false} />
        </div>

        {/* Lista de navegación vertical */}
        <nav className="flex flex-col space-y-1.5" role="navigation">
          {items.map((item) => {
            const isActive = vistaActual === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onCambiarVista(item.id)}
                className={`text-left text-sm transition min-h-[48px] flex items-center px-4 py-3 rounded-2xl ${
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
