import React from 'react';

type Props = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

const AstraLogo: React.FC<Props> = ({ width = 200, height = 'auto', className = '' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 420 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Astra logo"
      className={className}
    >
      <defs>
        <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#b89cff" />
          <stop offset="50%" stopColor="#9c6bff" />
          <stop offset="100%" stopColor="#6b47ff" />
        </linearGradient>
        <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(28,12)">
        <polygon points="0,96 40,0 80,96" fill="url(#g1)" filter="url(#glow)" opacity={0.98} />
        <rect x="16" y="50" width="48" height="10" rx="3" ry="3" fill="#0d0d0d" opacity={0.6} />
        <polygon points="22,86 40,12 58,86" fill="#0d0d0d" />
      </g>

      <g transform="translate(140,78)">
        <text
          x={0}
          y={0}
          fontFamily="Inter, Roboto, system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial"
          fontSize={34}
          fontWeight={700}
          fill="url(#g1)"
        >
          ASTRA
        </text>
      </g>

      <circle cx={340} cy={20} r={18} fill="rgba(156,107,255,0.08)" />
    </svg>
  );
};

export default AstraLogo;
