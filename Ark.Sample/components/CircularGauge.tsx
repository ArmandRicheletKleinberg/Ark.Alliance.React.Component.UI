import React from 'react';

interface CircularGaugeProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  max = 100,
  size = 60,
  strokeWidth = 6,
  color = '#4ade80',
  label
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;

  // Determine color based on value if standard green
  let activeColor = color;
  if (value < 50) activeColor = '#ef4444'; // Red
  else if (value < 80) activeColor = '#eab308'; // Yellow
  else activeColor = '#22c55e'; // Green

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 transition-all duration-500 ease-out"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Foreground Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-sm font-bold" style={{ color: activeColor }}>
          {value}
        </span>
      </div>
      {label && <span className="absolute -bottom-6 text-[10px] text-gray-400 whitespace-nowrap">{label}</span>}
    </div>
  );
};

export default CircularGauge;