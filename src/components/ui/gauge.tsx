import React from 'react';

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const CircularGauge: React.FC<GaugeProps> = ({
  value,
  max,
  label,
  subtitle,
  icon,
  size = 'medium',
  color = '#75c4cc',
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = size === 'large' ? 40 : size === 'large' ? 60 : 50;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative mb-4">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
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
          <div className="[font-family:'Lexend',Helvetica] font-bold text-2xl text-[#75c4cc]">
            {value}
          </div>
          {icon && <div className="mt-1">{icon}</div>}
        </div>
      </div>
      <div className="text-center">
        <div className="[font-family:'Lexend',Helvetica] font-semibold text-base text-gray-800">
          {label}
        </div>
        {subtitle && (
          <div className="[font-family:'Lexend',Helvetica] text-xs text-gray-500 mt-1">
            {subtitle}
          </div>
        )}
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
}

export const SemiCircleGauge: React.FC<SemiCircleGaugeProps> = ({
  value,
  max,
  label,
  subtitle,
  icon,
  color = '#75c4cc',
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 60;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative mb-2">
        <svg height={radius + 10} width={radius * 2 + 20} className="transform rotate-180">
          <path
            d={`M ${strokeWidth / 2 + 10} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${
              radius * 2 - strokeWidth / 2 + 10
            } ${radius}`}
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={`M ${strokeWidth / 2 + 10} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${
              radius * 2 - strokeWidth / 2 + 10
            } ${radius}`}
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '20%' }}>
          <div className="[font-family:'Lexend',Helvetica] font-bold text-3xl text-[#75c4cc]">
            {value}
          </div>
          {icon && <div className="mt-1">{icon}</div>}
          {subtitle && (
            <div className="[font-family:'Lexend',Helvetica] text-xs text-gray-500 mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-2">
        <div className="[font-family:'Lexend',Helvetica] font-semibold text-sm text-gray-800">
          {label}
        </div>
      </div>
    </div>
  );
};
