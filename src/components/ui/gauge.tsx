import React from 'react';

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | number;
  color?: string;
}

export const CircularGauge: React.FC<GaugeProps> = ({
  value,
  max,
  label,
  subtitle,
  icon,
  size = 'medium',
  color = '#5c8bb0',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  let radius: number;
  if (typeof size === 'number') {
    radius = size;
  } else {
    switch (size) {
      case 'small':
        radius = 60;
        break;
      case 'large':
        radius = 120;
        break;
      case 'medium':
      default:
        radius = 90;
        break;
    }
  }

  const strokeWidth = Math.max(radius * 0.27, 10);
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const gradientId = `gradient-circular-${label.replace(/\s/g, '-')}`;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={`url(#${gradientId})`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            {icon}
            <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl" style={{ color: '#4a7090' }}>
              {value}
            </div>
          </div>
          {subtitle && (
            <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-500 mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ProgressBarGaugeProps {
  current: number;
  total: number;
  label: string;
  color?: string;
}

export const ProgressBarGauge: React.FC<ProgressBarGaugeProps> = ({
  current,
  total,
  label,
  color = '#10b981',
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="[font-family:'Lexend',Helvetica] text-sm font-medium text-gray-700">
          {label}
        </span>
        <span className="[font-family:'Lexend',Helvetica] text-sm font-semibold text-[#023c97]">
          {current} / {total}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

interface SemiCircleGaugeProps {
  value: number;
  max: number;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  valueFormatter?: (value: number) => string;
  size?: 'small' | 'medium' | 'large' | number;
  aspectRatio?: number;
}

export const SemiCircleGauge: React.FC<SemiCircleGaugeProps> = ({
  value,
  max,
  label,
  subtitle,
  icon,
  color = '#5c8bb0',
  valueFormatter,
  size = 110,
  aspectRatio = 1,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  let radius: number;
  if (typeof size === 'number') {
    radius = size;
  } else {
    switch (size) {
      case 'small':
        radius = 50;
        break;
      case 'large':
        radius = 100;
        break;
      case 'medium':
      default:
        radius = 72;
        break;
    }
  }

  const strokeWidth = Math.max(radius * 0.27, 10);
  const radiusX = radius * aspectRatio;
  const radiusY = radius;
  const normalizedRadiusX = radiusX - strokeWidth / 2;
  const normalizedRadiusY = radiusY - strokeWidth / 2;
  const circumference = normalizedRadiusX * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const displayValue = valueFormatter ? valueFormatter(value) : value;

  const padding = strokeWidth / 2;
  const startX = padding;
  const endX = startX + (radiusX * 2);
  const centerY = radiusY + padding;
  const pathD = `M ${startX} ${centerY} A ${radiusX} ${radiusY} 0 0 1 ${endX} ${centerY}`;

  const svgHeight = radiusY + strokeWidth;
  const svgWidth = radiusX * 2 + strokeWidth;
  const gradientId = `gradient-semi-${label.replace(/\s/g, '-')}`;

  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <div className="relative mb-4">
        <svg height={svgHeight} width={svgWidth}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.65" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
            <clipPath id={`clip-${label.replace(/\s/g, '-')}`}>
              <rect x={startX - strokeWidth/2} y="0" width={(endX - startX) + strokeWidth} height={svgHeight} />
            </clipPath>
          </defs>
          <path
            d={pathD}
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
          />
          {percentage > 0 && (
            <g clipPath={`url(#clip-${label.replace(/\s/g, '-')})`}>
              <path
                d={pathD}
                stroke={`url(#${gradientId})`}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
                strokeLinecap="round"
              />
            </g>
          )}
          <rect
            x={startX - strokeWidth/2}
            y={centerY} 
            width={strokeWidth}
            height={strokeWidth}
            fill="white"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center" style={{ top: '45%' }}>
          <div className="flex items-center gap-2">
            {icon}
            <div className="[font-family:'Lexend',Helvetica] font-bold text-3xl" style={{ color: '#4a7090' }}>
              {displayValue}
            </div>
          </div>
          {subtitle && (
            <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-500 mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
