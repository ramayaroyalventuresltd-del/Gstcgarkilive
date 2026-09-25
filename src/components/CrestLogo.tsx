import React from 'react';

interface CrestLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
}

export const CrestLogo: React.FC<CrestLogoProps> = ({
  size = 48,
  className = '',
  showText = false,
  textColor = 'text-stone-900',
  subtextColor = 'text-stone-600',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-200 hover:scale-105"
        role="img"
        aria-label="GSTC Garki Official School Crest"
      >
        {/* Outer Ring with deep school green */}
        <circle cx="50" cy="50" r="47" fill="#14532D" stroke="#166534" strokeWidth="2" />
        <circle cx="50" cy="50" r="43" fill="#FFFFFF" stroke="#CA8A04" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="39" fill="#F0FDF4" />

        {/* Laurel Wreath left & right */}
        <g stroke="#15803D" strokeWidth="1.2" fill="#22C55E">
          {/* Left branches */}
          <path d="M22 60 C18 48 20 36 28 26" fill="none" strokeWidth="1.8" />
          <path d="M19 55 C16 53 17 49 21 51 Z" />
          <path d="M18 45 C15 43 17 39 21 42 Z" />
          <path d="M21 35 C18 33 21 29 25 32 Z" />
          <path d="M26 27 C24 24 28 21 31 25 Z" />

          {/* Right branches */}
          <path d="M78 60 C82 48 80 36 72 26" fill="none" strokeWidth="1.8" />
          <path d="M81 55 C84 53 83 49 79 51 Z" />
          <path d="M82 45 C85 43 83 39 79 42 Z" />
          <path d="M79 35 C82 33 79 29 75 32 Z" />
          <path d="M74 27 C76 24 72 21 69 25 Z" />
        </g>

        {/* Inner Shield */}
        <path
          d="M32 30 H68 V54 C68 66 50 74 50 74 C50 74 32 66 32 54 Z"
          fill="#14532D"
          stroke="#CA8A04"
          strokeWidth="1.5"
        />

        {/* Shield Interior split: Tech Gear, Science Flask & Torch */}
        {/* Technical Gear */}
        <g transform="translate(42, 38) scale(0.65)">
          <circle cx="12" cy="12" r="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
          <circle cx="12" cy="12" r="3" fill="#14532D" />
          {/* Gear teeth */}
          <rect x="10.5" y="2" width="3" height="3" fill="#CA8A04" rx="0.5" />
          <rect x="10.5" y="19" width="3" height="3" fill="#CA8A04" rx="0.5" />
          <rect x="2" y="10.5" width="3" height="3" fill="#CA8A04" rx="0.5" />
          <rect x="19" y="10.5" width="3" height="3" fill="#CA8A04" rx="0.5" />
        </g>

        {/* Science Flask & Torch of Knowledge */}
        <path
          d="M48 50 L52 50 L54 58 C55 60 53 62 50 62 C47 62 45 60 46 58 Z"
          fill="#38BDF8"
          stroke="#FFFFFF"
          strokeWidth="0.8"
        />
        {/* Flame on top */}
        <path
          d="M50 48 C49 46 50 44 50 42 C51 44 53 45 52 48 C51 49 50 49 50 48 Z"
          fill="#F59E0B"
        />

        {/* National Green-White-Green Ribbon / Banner at base */}
        <g transform="translate(24, 73)">
          {/* Ribbon shape */}
          <path d="M0 4 L10 0 L42 0 L52 4 L48 10 L26 12 L4 10 Z" fill="#FFFFFF" stroke="#CA8A04" strokeWidth="1" />
          <rect x="16" y="2" width="20" height="8" fill="#15803D" />
          <rect x="22" y="2" width="8" height="8" fill="#FFFFFF" />
        </g>

        {/* Motto letters */}
        <text
          x="50"
          y="23"
          textAnchor="middle"
          fill="#14532D"
          fontSize="4.8"
          fontWeight="bold"
          fontFamily="sans-serif"
          letterSpacing="0.4"
        >
          GSTC GARKI
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold tracking-tight text-lg ${textColor}`}>
            GSTC Garki
          </span>
          <span className={`text-xs font-medium ${subtextColor}`}>
            Govt. Science & Tech. College
          </span>
        </div>
      )}
    </div>
  );
};
