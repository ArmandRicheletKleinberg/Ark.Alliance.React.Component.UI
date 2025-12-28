import React from 'react';

interface LedBarProps {
  percentage: number; // 0 to 100
  totalBars?: number;
}

const LedBar: React.FC<LedBarProps> = ({ percentage, totalBars = 20 }) => {
  const activeBars = Math.floor((percentage / 100) * totalBars);

  return (
    <div className="flex items-center gap-[2px] h-3 w-full max-w-[120px]">
      {Array.from({ length: totalBars }).map((_, i) => {
        const isActive = i < activeBars;
        let bgClass = 'bg-gray-700';
        
        if (isActive) {
            // Gradient effect for the bars
            if (i < totalBars * 0.6) bgClass = 'bg-green-500 shadow-[0_0_5px_#22c55e]';
            else if (i < totalBars * 0.8) bgClass = 'bg-yellow-400 shadow-[0_0_5px_#eab308]';
            else bgClass = 'bg-red-500 shadow-[0_0_5px_#ef4444]';
        }

        return (
          <div
            key={i}
            className={`flex-1 h-full rounded-[1px] transition-colors duration-200 ${bgClass}`}
          />
        );
      })}
    </div>
  );
};

export default LedBar;