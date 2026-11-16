import React from 'react';

export type DisciplineName = 'running' | 'fuerza' | 'natacion' | 'equipo';

export interface IconDisciplineProps extends React.SVGProps<SVGSVGElement> {
  discipline: DisciplineName;
  size?: number | string;
  rounded?: boolean;
}

export const IconDiscipline: React.FC<IconDisciplineProps> = ({
  discipline,
  size = 32,
  rounded = true,
  className = '',
  ...props
}) => {
  const rx = rounded ? '14' : '0';

  const renderContent = () => {
    switch (discipline) {
      case 'running':
        return (
          <>
            <rect width="48" height="48" rx={rx} fill="var(--burdeos, #3C0016)" />
            <circle cx="30" cy="11" r="4" fill="var(--rojo, #F92424)" />
            <path
              d="M27 17L21 30M26 20L34 22L37 17M25 21L17 24L15 30M21 30L28 36L27 43M21 30L14 35L9 33"
              fill="none"
              stroke="var(--navon, #F1EADD)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'fuerza':
        return (
          <>
            <rect width="48" height="48" rx={rx} fill="var(--burdeos, #3C0016)" />
            <circle cx="24" cy="12" r="4" fill="var(--rojo, #F92424)" />
            <path
              d="M8 20H40M9 14V26M39 14V26M24 20V33M24 33L18 43M24 33L30 43"
              fill="none"
              stroke="var(--navon, #F1EADD)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'natacion':
        return (
          <>
            <rect width="48" height="48" rx={rx} fill="var(--burdeos, #3C0016)" />
            <circle cx="32" cy="15" r="4" fill="var(--rojo, #F92424)" />
            <path
              d="M10 26L24 22L30 21M8 34Q13 30 18 34T28 34T38 34M8 41Q13 37 18 41T28 41T38 41"
              fill="none"
              stroke="var(--navon, #F1EADD)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'equipo':
        return (
          <>
            <rect width="48" height="48" rx={rx} fill="var(--burdeos, #3C0016)" />
            <circle cx="24" cy="24" r="15" fill="none" stroke="var(--navon, #F1EADD)" strokeWidth="3.2" />
            <path
              d="M9 24H39M15 12Q24 24 15 36M33 12Q24 24 33 36"
              fill="none"
              stroke="var(--rojo, #F92424)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`shrink-0 select-none ${className}`}
      role="img"
      aria-label={discipline}
      {...props}
    >
      {renderContent()}
    </svg>
  );
};
