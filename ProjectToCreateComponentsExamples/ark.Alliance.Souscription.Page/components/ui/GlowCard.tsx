import React from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  highlight?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  intensity = 'medium', 
  className = '',
  highlight = false
}) => {
  const blurAmount = intensity === 'low' ? 'blur-md' : intensity === 'medium' ? 'blur-xl' : 'blur-2xl';
  const opacity = intensity === 'low' ? 'opacity-30' : intensity === 'medium' ? 'opacity-50' : 'opacity-70';

  return (
    <div className={`relative group ${className}`}>
      {/* The Glow Layer */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl ${blurAmount} transition duration-500 group-hover:opacity-100 ${highlight ? 'opacity-75' : 'opacity-20'}`}></div>
      
      {/* The Card Content */}
      <div className="relative bg-surface rounded-xl p-6 h-full border border-white/10 flex flex-col">
        {children}
      </div>
    </div>
  );
};
