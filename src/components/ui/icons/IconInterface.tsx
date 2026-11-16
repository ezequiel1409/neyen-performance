import React from 'react';

export type IconInterfaceName =
  | 'activity'
  | 'alert'
  | 'back'
  | 'bandage'
  | 'bell'
  | 'calclock'
  | 'calendar'
  | 'camera'
  | 'check'
  | 'clipboard'
  | 'clock'
  | 'drop'
  | 'dumbbell'
  | 'gauge'
  | 'heart'
  | 'history'
  | 'home'
  | 'info'
  | 'logout'
  | 'moon'
  | 'plus'
  | 'star'
  | 'trend'
  | 'users'
  | 'x';

export interface IconInterfaceProps extends React.SVGProps<SVGSVGElement> {
  name: IconInterfaceName;
  size?: number | string;
  strokeWidth?: number;
}

export const IconInterface: React.FC<IconInterfaceProps> = ({
  name,
  size = 24,
  strokeWidth = 2,
  className = '',
  ...props
}) => {
  const renderPath = () => {
    switch (name) {
      case 'activity':
        return <path d="M3 12h4l3-8 4 16 3-8h4" />;
      case 'alert':
        return (
          <>
            <path d="M12 4L2.8 20h18.4L12 4z" />
            <path d="M12 10v4.5M12 17.5v.01" />
          </>
        );
      case 'back':
        return <path d="M19 12H5M11 6l-6 6 6 6" />;
      case 'bandage':
        return (
          <g transform="rotate(-45 12 12)">
            <rect x="2" y="8.5" width="20" height="7" rx="3.5" />
            <path d="M9 8.5v7M15 8.5v7" />
          </g>
        );
      case 'bell':
        return (
          <>
            <path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15L6 17z" />
            <path d="M10 21a2 2 0 0 0 4 0" />
          </>
        );
      case 'calclock':
        return (
          <>
            <rect x="3" y="5" width="14" height="14" rx="2" />
            <path d="M3 10h14M7 3v4M13 3v4" />
            <circle cx="17.5" cy="17.5" r="4.5" />
            <path d="M17.5 15.5v2l1.2.8" />
          </>
        );
      case 'calendar':
        return (
          <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </>
        );
      case 'camera':
        return (
          <>
            <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
            <circle cx="12" cy="13" r="3.5" />
          </>
        );
      case 'check':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12.5l2.7 2.7L16 9.5" />
          </>
        );
      case 'clipboard':
        return (
          <>
            <rect x="5" y="4" width="14" height="17" rx="2" />
            <path d="M9 4h6v3H9zM9 14l2 2 4-4" />
          </>
        );
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </>
        );
      case 'drop':
        return <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />;
      case 'dumbbell':
        return <path d="M3 9v6M6 6.5v11M18 6.5v11M21 9v6M6 12h12" />;
      case 'gauge':
        return (
          <>
            <path d="M4 17a8 8 0 1 1 16 0" />
            <path d="M12 17l4-5" />
          </>
        );
      case 'heart':
        return <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />;
      case 'history':
        return (
          <>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5M12 7v5l3 2" />
          </>
        );
      case 'home':
        return <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" />;
      case 'info':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8v.01" />
          </>
        );
      case 'logout':
        return (
          <>
            <path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5M15 8l4 4-4 4M19 12H9" />
          </>
        );
      case 'moon':
        return <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />;
      case 'plus':
        return <path d="M12 5v14M5 12h14" />;
      case 'star':
        return <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8L12 3.5z" />;
      case 'trend':
        return <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />;
      case 'users':
        return (
          <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.4c2.2.7 3.5 2.6 3.5 5.6" />
          </>
        );
      case 'x':
        return <path d="M6 6l12 12M18 6L6 18" />;
      default:
        return null;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {renderPath()}
    </svg>
  );
};
