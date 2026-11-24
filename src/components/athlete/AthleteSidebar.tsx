// =====================================================================
// NEYIMA ATHLETIC - BARRA LATERAL DEL ALUMNO (DESKTOP/TABLET SIDEBAR)
// =====================================================================

import React from 'react';
import { NeyimaLogo } from '../ui/NeyimaLogo';
import { useTraining } from '../../context/TrainingContext';
import { VistaAlumno } from '../ui/BottomNav';
import { IconInterface, type IconInterfaceName } from '../ui/icons/IconInterface';
import { UserAccountMenu } from '../ui/UserAccountMenu';

interface AthleteSidebarProps {
  vistaActual: VistaAlumno;
  onCambiarVista: (vista: VistaAlumno) => void;
  esModoOscuro: boolean;
  onAlternarTema: () => void;
}

export const AthleteSidebar: React.FC<AthleteSidebarProps> = ({
  vistaActual,
  onCambiarVista,
  esModoOscuro,
  onAlternarTema,
}) => {
  const { atletaActual } = useTraining();
  const esFemenino = atletaActual.generoAtleta === 'F';

  const baseItems: Array<{
    id: VistaAlumno;
    matches: VistaAlumno[];
    label: string;
    icon: IconInterfaceName;
    soloFemenino?: boolean;
  }> = [
    { id: 'HOY', matches: ['HOY', 'RUTINA'], label: 'Inicio (Hoy)', icon: 'home' },
    { id: 'PROGRESO', matches: ['PROGRESO', 'FOTOS'], label: 'Progreso y fotos', icon: 'trend' },
    { id: 'BIENESTAR', matches: ['BIENESTAR'], label: 'Bienestar diario', icon: 'heart' },
    { id: 'HISTORIAL', matches: ['HISTORIAL'], label: 'Historial', icon: 'history' },
    { id: 'CICLO', matches: ['CICLO'], label: 'Mi ciclo', icon: 'drop', soloFemenino: true },
    { id: 'SUENIO', matches: ['SUENIO'], label: 'Descanso y reloj', icon: 'moon' },
    { id: 'DASHBOARD', matches: ['DASHBOARD'], label: 'Panel expandido', icon: 'clipboard' },
  ];

  const items = baseItems.filter((item) => !item.soloFemenino || esFemenino);

  return (
    <aside
      aria-label="Navegación del Alumno"
      className="w-64 lg:w-72 shrink-0 px-4 py-6 flex flex-col justify-between sticky top-0 h-screen select-none border-r border-[var(--bord)] bg-[var(--bg)]"
    >
      <div className="space-y-6 overflow-y-auto">
        {/* Logo NEYIMA */}
        <div className="px-2.5">
          <NeyimaLogo size="md" variant="emblema" roleTag="ALUMNO" />
        </div>

        {/* Lista de navegación vertical */}
        <nav className="flex flex-col space-y-1" role="navigation">
          {items.map((item) => {
            const isActive = item.matches.includes(vistaActual);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onCambiarVista(item.id)}
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

      {/* Pie de navegación: Dropdown de perfil, configuraciones y sesión (estilo Twitter/X) */}
      <div className="pt-4 border-t border-[var(--bord)]">
        <UserAccountMenu
          esModoOscuro={esModoOscuro}
          onAlternarTema={onAlternarTema}
          variant="sidebar"
        />
      </div>
    </aside>
  );
};
