// =====================================================================
// NEYIMA ATHLETIC - MENÚ DE CUENTA ESTILO TWITTER/X (DROPDOWN DE PERFIL)
// =====================================================================

import React, { useEffect, useRef, useState } from 'react';
import { useTraining } from '../../context/TrainingContext';
import { IconInterface } from './icons/IconInterface';

interface UserAccountMenuProps {
  esModoOscuro: boolean;
  onAlternarTema: () => void;
  variant?: 'sidebar' | 'compact';
}

function obtenerIniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return 'NY';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

export const UserAccountMenu: React.FC<UserAccountMenuProps> = ({
  esModoOscuro,
  onAlternarTema,
  variant = 'sidebar',
}) => {
  const { rolActivo, atletaActual, usuarioEmail, clubes, atletas, cerrarSesion } = useTraining();
  const [abierto, setAbierto] = useState(false);
  const [urlImagenFallida, setUrlImagenFallida] = useState<string | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  const esCoach = rolActivo === 'COACH';
  const nombreMostrado = esCoach ? 'Coach NEYIMA' : atletaActual.nombreCompleto;
  const primerNombre = esCoach ? 'Coach' : atletaActual.nombreCompleto.split(' ')[0] || 'Atleta';
  const subtitulo = esCoach
    ? usuarioEmail
    : atletaActual.identificadorEquipoPerteneciente || 'Personalizado (1 a 1)';
  const fotoUrl =
    !esCoach && atletaActual.fotoPerfilUrl && urlImagenFallida !== atletaActual.fotoPerfilUrl
      ? atletaActual.fotoPerfilUrl
      : undefined;
  const iniciales = esCoach ? 'CO' : obtenerIniciales(atletaActual.nombreCompleto);

  useEffect(() => {
    if (!abierto) return;

    const handleClickAfuera = (event: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickAfuera);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickAfuera);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [abierto]);

  const renderAvatar = (tamano: 'sm' | 'md' | 'lg') => {
    const clasesTamano =
      tamano === 'sm'
        ? 'w-7 h-7 text-[11px]'
        : tamano === 'lg'
          ? 'w-12 h-12 text-sm'
          : 'w-10 h-10 text-xs';

    if (fotoUrl) {
      return (
        <img
          src={fotoUrl}
          alt={nombreMostrado}
          onError={() => setUrlImagenFallida(fotoUrl)}
          className={`${clasesTamano} rounded-full object-cover shrink-0 border border-[var(--bord)]`}
        />
      );
    }

    return (
      <div
        className={`${clasesTamano} rounded-full bg-[var(--navbg)] text-[var(--navon)] flex items-center justify-center font-extrabold shrink-0`}
        aria-hidden="true"
      >
        {iniciales}
      </div>
    );
  };

  return (
    <div ref={contenedorRef} className="relative">
      {/* Popover / Dropdown */}
      {abierto && (
        <div
          role="menu"
          aria-label="Menú de cuenta y configuraciones"
          className={`absolute z-50 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[var(--bord)] bg-[var(--surf)] text-[var(--txt)] shadow-xl overflow-hidden ${
            variant === 'sidebar' ? 'bottom-full left-0 mb-2.5' : 'top-full right-0 mt-2'
          }`}
        >
          {/* Cabecera del perfil */}
          <div className="p-4 border-b border-[var(--bord)] space-y-3">
            <div className="flex items-center gap-3">
              {renderAvatar('lg')}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-[var(--txt)] truncate">
                  {nombreMostrado}
                </p>
                <p className="text-xs text-[var(--mut)] truncate">{usuarioEmail}</p>
              </div>
            </div>

            {/* Datos de contexto: Club, Rol, Deporte / Planteles */}
            {esCoach ? (
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--bord)]/70 p-2.5 space-y-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--mut)] font-semibold">Rol</span>
                  <span className="font-bold text-[var(--txt)]">Preparador Físico</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--mut)] font-semibold">Gestión</span>
                  <span className="font-bold text-[var(--txt)]">
                    {clubes.length} clubes · {atletas.length} atletas
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--bord)]/70 p-2.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--mut)] font-semibold">Club</span>
                  <span className="font-bold text-[var(--txt)] truncate text-right">
                    {atletaActual.identificadorEquipoPerteneciente || 'Personalizado (1 a 1)'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--mut)] font-semibold">Deporte</span>
                  <span className="font-bold text-[var(--txt)] truncate text-right">
                    {atletaActual.deportePracticado}
                    {atletaActual.posicionEnElCampoDeJuego
                      ? ` · ${atletaActual.posicionEnElCampoDeJuego}`
                      : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--mut)] font-semibold">Perfil</span>
                  <span className="font-bold text-[var(--txt)]">
                    {atletaActual.generoAtleta === 'F' ? 'Femenino (F)' : 'Masculino (M)'} ·{' '}
                    {atletaActual.nivelRendimientoDeportivo}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Configuraciones */}
          <div className="p-2 border-b border-[var(--bord)]">
            <p className="px-2.5 pt-1 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--mut)]">
              Configuración
            </p>
            <button
              type="button"
              role="menuitem"
              onClick={onAlternarTema}
              className="w-full flex items-center justify-between gap-3 px-2.5 py-2.5 rounded-xl text-xs font-bold text-[var(--txt)] hover:bg-[var(--bg)] transition cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                {esModoOscuro ? (
                  <IconInterface name="star" size={16} className="text-amber-400" />
                ) : (
                  <IconInterface name="moon" size={16} />
                )}
                <span>Apariencia: {esModoOscuro ? 'Modo oscuro' : 'Modo claro'}</span>
              </span>
              <span
                aria-hidden="true"
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                  esModoOscuro ? 'bg-[var(--navbg)]' : 'bg-[var(--bord)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                    esModoOscuro
                      ? 'right-0.5 bg-[var(--navon)]'
                      : 'left-0.5 bg-[var(--surf)]'
                  }`}
                />
              </span>
            </button>
          </div>

          {/* Cierre de sesión */}
          <div className="p-2">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setAbierto(false);
                cerrarSesion();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-xs font-extrabold text-[var(--acc)] hover:bg-[var(--estado-bad-fondo)]/60 transition cursor-pointer"
            >
              <IconInterface name="logout" size={16} strokeWidth={2.2} />
              <span className="truncate">Cerrar sesión ({primerNombre})</span>
            </button>
          </div>
        </div>
      )}

      {/* Botón disparador */}
      {variant === 'sidebar' ? (
        <button
          type="button"
          onClick={() => setAbierto((prev) => !prev)}
          aria-expanded={abierto}
          aria-haspopup="menu"
          aria-label={`Abrir menú de cuenta de ${nombreMostrado}`}
          className={`w-full flex items-center gap-3 p-2.5 rounded-full transition cursor-pointer text-left border ${
            abierto
              ? 'bg-[var(--surf)] border-[var(--bord)] shadow-xs'
              : 'border-transparent hover:bg-[var(--surf)] hover:border-[var(--bord)]/70'
          }`}
        >
          {renderAvatar('md')}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-[var(--txt)] truncate leading-tight">
              {nombreMostrado}
            </p>
            <p className="text-xs text-[var(--mut)] truncate leading-tight mt-0.5">
              {subtitulo}
            </p>
          </div>
          <IconInterface
            name="more"
            size={18}
            className="text-[var(--mut)] mr-1"
            aria-hidden="true"
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setAbierto((prev) => !prev)}
          aria-expanded={abierto}
          aria-haspopup="menu"
          aria-label={`Abrir menú de cuenta de ${nombreMostrado}`}
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-[var(--bord)] bg-[var(--bg)] hover:bg-[var(--surf)] transition cursor-pointer"
        >
          {renderAvatar('sm')}
          <span className="text-xs font-extrabold text-[var(--txt)] max-w-[110px] truncate">
            {primerNombre}
          </span>
          <IconInterface name="more" size={15} className="text-[var(--mut)]" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
