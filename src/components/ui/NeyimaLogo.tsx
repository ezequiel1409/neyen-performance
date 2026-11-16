import React from 'react';

export interface NeyimaLogoProps {
  variant?: 'emblema' | 'lockup';
  theme?: 'claro' | 'oscuro' | 'auto';
  roleTag?: 'COACH' | 'ALUMNO';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const NeyimaLogo: React.FC<NeyimaLogoProps> = ({
  variant = 'lockup',
  theme = 'auto',
  roleTag,
  size = 'md',
  className = '',
  showText = true,
}) => {
  const heightClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  // Rutas a los assets oficiales de branding
  const emblemaSrcClaro = '/assets/branding/neyima-claro-emblema.png';
  const emblemaSrcOscuro = '/assets/branding/neyima-oscuro-emblema.png';
  const lockupSrcClaro = '/assets/branding/neyima-claro-lockup.png';
  const lockupSrcOscuro = '/assets/branding/neyima-oscuro-lockup.png';

  if (variant === 'lockup' && !roleTag) {
    if (theme === 'claro') {
      return (
        <img
          src={lockupSrcClaro}
          alt="NEYIMA Performance OS"
          className={`${heightClasses[size]} w-auto object-contain select-none ${className}`}
        />
      );
    }
    if (theme === 'oscuro') {
      return (
        <img
          src={lockupSrcOscuro}
          alt="NEYIMA Performance OS"
          className={`${heightClasses[size]} w-auto object-contain select-none ${className}`}
        />
      );
    }

    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={lockupSrcClaro}
          alt="NEYIMA Performance OS"
          className={`${heightClasses[size]} w-auto object-contain dark:hidden`}
        />
        <img
          src={lockupSrcOscuro}
          alt="NEYIMA Performance OS"
          className={`${heightClasses[size]} w-auto object-contain hidden dark:block`}
        />
      </div>
    );
  }

  // Si es emblema o tiene roleTag ('COACH' | 'ALUMNO')
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative shrink-0">
        {theme === 'claro' ? (
          <img
            src={emblemaSrcClaro}
            alt="NEYIMA"
            className={`${heightClasses[size]} w-auto object-contain`}
          />
        ) : theme === 'oscuro' ? (
          <img
            src={emblemaSrcOscuro}
            alt="NEYIMA"
            className={`${heightClasses[size]} w-auto object-contain`}
          />
        ) : (
          <>
            <img
              src={emblemaSrcClaro}
              alt="NEYIMA"
              className={`${heightClasses[size]} w-auto object-contain dark:hidden`}
            />
            <img
              src={emblemaSrcOscuro}
              alt="NEYIMA"
              className={`${heightClasses[size]} w-auto object-contain hidden dark:block`}
            />
          </>
        )}
      </div>

      {showText && (
        <div className="leading-tight">
          <span className="font-extrabold tracking-wider text-[var(--txt)] text-lg block">
            NEYIMA
          </span>
          {roleTag && (
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[var(--mut)] block -mt-0.5">
              {roleTag}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
