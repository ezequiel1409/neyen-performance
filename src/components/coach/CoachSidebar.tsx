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
  esModoOscuro?: boolean;
  onAlternarTema?: () => void;
}

export const CoachSidebar: React.FC<CoachSidebarProps> = ({
  seccionActiva,
  onCambiarSeccion,
  esModoOscuro = false,
  onAlternarTema,
}) => {
  const { cerrarSesion, usuarioEmail, atletas, clubes } = useTraining();

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

      {/* Pie de navegación: Sesión actual, Tema y Cerrar sesión */}
      <div className="pt-4 border-t border-[var(--bord)] space-y-2">
        <div className="rounded-xl border border-[var(--bord)] bg-[var(--surf)] p-3 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--navbg)] text-[var(--navon)] flex items-center justify-center font-extrabold text-xs shrink-0">
              FC
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[var(--txt)] truncate">Sesión Coach</p>
              <p className="text-xs text-[var(--mut)] truncate">{usuarioEmail}</p>
            </div>
          </div>
          <p className="text-xs text-[var(--mut)] pt-1 border-t border-[var(--bord)]">
            {clubes.length} clubes · {atletas.length} atletas
          </p>
        </div>

        {onAlternarTema && (
          <button
            type="button"
            onClick={onAlternarTema}
            aria-label={esModoOscuro ? 'Activar tema claro' : 'Activar tema oscuro'}
            className="w-full text-left text-xs font-bold text-[var(--txt)] hover:bg-[var(--surf)] transition flex items-center justify-between px-3.5 py-2.5 rounded-xl min-h-[42px] border border-[var(--bord)] cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              {esModoOscuro ? (
                <IconInterface name="star" size={16} className="text-amber-400" />
              ) : (
                <IconInterface name="moon" size={16} />
              )}
              <span>{esModoOscuro ? 'Modo claro' : 'Modo oscuro'}</span>
            </span>
            <span className="text-xs text-[var(--mut)]">Tema</span>
          </button>
        )}

        <button
          type="button"
          onClick={cerrarSesion}
          className="w-full text-left text-sm font-bold text-[var(--txt)] hover:text-[var(--acc)] hover:bg-[var(--surf)] transition flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl min-h-[44px] cursor-pointer"
        >
          <IconInterface name="logout" size={18} aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
