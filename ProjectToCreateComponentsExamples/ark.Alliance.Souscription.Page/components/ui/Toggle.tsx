import React from 'react';

interface ToggleProps {
  leftLabel: string;
  rightLabel: string;
  checked: boolean; // false = left, true = right
  onChange: () => void;
}

export const Toggle: React.FC<ToggleProps> = ({ leftLabel, rightLabel, checked, onChange }) => {
  return (
    <div 
      className="inline-flex bg-surface rounded-full p-1 cursor-pointer border border-white/10 relative"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') onChange(); }}
    >
      {/* Sliding Pill */}
      <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full transition-all duration-300 shadow-lg`}
        style={{ left: checked ? '50%' : '4px' }}
      />
      
      <span className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${!checked ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
        {leftLabel}
      </span>
      <span className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${checked ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
        {rightLabel}
      </span>
    </div>
  );
};
