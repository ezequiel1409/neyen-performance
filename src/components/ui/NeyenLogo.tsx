// =====================================================================
// NEYEN LOGO & BRAND ICON COMPONENT (DISEÑO FIEL A BRANDING MOCKUP)
// =====================================================================

import React from 'react';

interface NeyenLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  showSubtitle?: boolean;
}

export const NeyenLogo: React.FC<NeyenLogoProps> = ({
  className = '',
  size = 'md',
  subtitle = 'Performance OS',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Isotipo: N ascendente + punto-sol naranja cálido */}
      <div
        className={`${iconSizes[size]} relative shrink-0 rounded-2xl bg-[#2F6B4F] flex items-center justify-center shadow-sm overflow-hidden`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Tallo izquierdo vertical */}
          <rect x="7" y="11" width="4" height="15" rx="2" fill="white" />
          {/* Diagonal ascendente */}
          <path
            d="M8.5 24.5L25.5 12"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Tallo derecho vertical */}
          <rect x="23" y="11" width="4" height="15" rx="2" fill="white" />
          {/* Punto-sol: progreso y energía (Arena #F4C98B) */}
          <circle cx="18" cy="8.5" r="2.8" fill="#F4C98B" />
        </svg>
      </div>

      {/* Logotipo tipográfico */}
      <div>
        <div className="flex items-baseline gap-2">
          <span
            className={`font-extrabold tracking-tight text-[#1D2B24] dark:text-white leading-none ${textSizes[size]}`}
          >
            NEYEN
          </span>
          {showSubtitle && subtitle && (
            <span className="text-[10px] font-semibold tracking-wider text-[#1D2B24]/60 dark:text-[#9EB5B0] hidden sm:inline">
              {subtitle}
            </span>
          )}
        </div>
        {showSubtitle && subtitle && (
          <span className="block text-[10px] font-semibold tracking-wider text-[#1D2B24]/60 dark:text-[#9EB5B0] sm:hidden">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
