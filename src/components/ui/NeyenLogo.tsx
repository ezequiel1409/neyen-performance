import React from 'react';
import { NeyimaLogo, type NeyimaLogoProps } from './NeyimaLogo';

export interface NeyenLogoProps extends NeyimaLogoProps {
  subtitle?: string;
  showSubtitle?: boolean;
}

export const NeyenLogo: React.FC<NeyenLogoProps> = ({
  subtitle,
  showSubtitle = true,
  roleTag,
  ...props
}) => {
  const effectiveTag = roleTag || (showSubtitle && subtitle?.toUpperCase().includes('COACH') ? 'COACH' : undefined);

  return (
    <NeyimaLogo
      roleTag={effectiveTag}
      {...props}
    />
  );
};
