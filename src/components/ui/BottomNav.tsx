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
      label: 'Sesión',
      icon: Dumbbell,
    },
    {
      id: 'DASHBOARD' as VistaAlumno,
      label: 'Progreso',
      icon: TrendingUp,
    },
    {
      id: 'FOTOS' as VistaAlumno,
      label: 'Fotos',
      icon: Camera,
    },
    {
      id: 'SUENIO' as VistaAlumno,
      label: 'Descanso',
      icon: Moon,
    },
  ];

  return (
    <nav
      aria-label="Navegación de alumno"
      className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-[#E5E2D5] dark:border-[#244E43] bg-[#FAF7EE]/95 dark:bg-[#0F231D]/95 backdrop-blur-lg md:hidden safe-area-pb"
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
                  ? 'text-[#2F6B4F] dark:text-[#A3D9BE] font-bold'
                  : 'text-[#1D2B24]/60 dark:text-[#9EB5B0] hover:text-[#1D2B24] dark:hover:text-white font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition ${isActive ? 'scale-110 text-[#2F6B4F] dark:text-[#A3D9BE]' : ''}`}
                  aria-hidden="true"
                />
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-8 rounded-full bg-[#2F6B4F] dark:bg-[#A3D9BE] shadow-xs" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
