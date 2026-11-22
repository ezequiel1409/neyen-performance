import React from 'react';
import { IconInterface, type IconInterfaceName } from './icons/IconInterface';
import { triggerHaptic } from '../../utils/nativeBridge';
import { useTraining } from '../../context/TrainingContext';

export type VistaAlumno =
  | 'HOY'
  | 'RUTINA'
  | 'PROGRESO'
  | 'DASHBOARD'
  | 'BIENESTAR'
  | 'HISTORIAL'
  | 'CICLO'
  | 'FOTOS'
  | 'SUENIO';

interface BottomNavProps {
  vistaActual: VistaAlumno;
  onCambiarVista: (vista: VistaAlumno) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ vistaActual, onCambiarVista }) => {
  const { atletaActual } = useTraining();
  const esFemenino = atletaActual.generoAtleta === 'F';

  const baseTabs: Array<{
    id: VistaAlumno;
    matches: VistaAlumno[];
    label: string;
    icon: IconInterfaceName;
    soloFemenino?: boolean;
  }> = [
    {
      id: 'HOY',
      matches: ['HOY', 'RUTINA'],
      label: 'Hoy',
      icon: 'home',
    },
    {
      id: 'PROGRESO',
      matches: ['PROGRESO', 'DASHBOARD', 'FOTOS'],
      label: 'Progreso',
      icon: 'trend',
    },
    {
      id: 'BIENESTAR',
      matches: ['BIENESTAR'],
      label: 'Bienestar',
      icon: 'heart',
    },
    {
      id: 'HISTORIAL',
      matches: ['HISTORIAL'],
      label: 'Historial',
      icon: 'history',
    },
    {
      id: 'CICLO',
      matches: ['CICLO'],
      label: 'Ciclo',
      icon: 'drop',
      soloFemenino: true,
    },
  ];

  const tabs = baseTabs.filter((t) => !t.soloFemenino || esFemenino);

  return (
    <nav
      aria-label="Navegación principal del alumno"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surf)] border-t border-[var(--bord)] px-2 pt-2 pb-4 md:hidden safe-area-pb"
    >
      <div className="flex gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.matches.includes(vistaActual);

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                onCambiarVista(tab.id);
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 min-h-[56px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all select-none cursor-pointer text-xs font-bold active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--focus)] ${
                isActive
                  ? 'bg-[var(--navbg)] text-[var(--navon)]'
                  : 'bg-transparent text-[var(--txt)] hover:bg-[var(--bg)]'
              }`}
            >
              <IconInterface
                name={tab.icon}
                size={20}
                strokeWidth={2.2}
                aria-hidden="true"
              />
              <span className="tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
