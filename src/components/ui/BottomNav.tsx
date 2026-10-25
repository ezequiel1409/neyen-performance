import React from 'react';
import { Dumbbell, TrendingUp, Camera, Moon } from 'lucide-react';

export type VistaAlumno = 'RUTINA' | 'DASHBOARD' | 'FOTOS' | 'SUENIO';

interface BottomNavProps {
  vistaActual: VistaAlumno;
  onCambiarVista: (vista: VistaAlumno) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ vistaActual, onCambiarVista }) => {
  const tabs = [
    {
      id: 'RUTINA' as VistaAlumno,
      label: 'Rutina',
      icon: Dumbbell,
      badge: null,
    },
    {
      id: 'DASHBOARD' as VistaAlumno,
      label: 'Progreso',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'FOTOS' as VistaAlumno,
      label: 'Fotos',
      icon: Camera,
      badge: null,
    },
    {
      id: 'SUENIO' as VistaAlumno,
      label: 'Descanso',
      icon: Moon,
      badge: null,
    },
  ];

  return (
    <nav
      aria-label="Navegación de alumno"
      className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-[#E5E2D5] dark:border-[#25524A] bg-[#FAF7EE]/95 dark:bg-[#0E2420]/95 backdrop-blur-lg sm:hidden safe-area-pb"
    >
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = vistaActual === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onCambiarVista(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-h-[48px] w-full transition select-none ${
                isActive
                  ? 'text-[#E85938] font-bold'
                  : 'text-[#163832]/60 dark:text-[#9EB5B0] hover:text-[#163832] dark:hover:text-white font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition ${isActive ? 'scale-110 text-[#E85938]' : ''}`}
                  aria-hidden="true"
                />
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-8 rounded-full bg-[#E85938] shadow-sm shadow-[#E85938]/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
