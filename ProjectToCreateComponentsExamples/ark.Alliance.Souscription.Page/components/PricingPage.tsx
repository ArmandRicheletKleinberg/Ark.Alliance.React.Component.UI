import React from 'react';
import { Tier, BillingCycle, AppConfig } from '../types';
import { Button } from './ui/Button';
import { Toggle } from './ui/Toggle';
import { GlowCard } from './ui/GlowCard';
import { Check, Star, PlayCircle } from 'lucide-react';

interface PricingPageProps {
  config: AppConfig;
  currentCycle: BillingCycle;
  onToggleCycle: () => void;
  onSelectTier: (tier: Tier) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ 
  config, 
  currentCycle, 
  onToggleCycle, 
  onSelectTier 
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
          {config.productName}
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          {config.productTagline}
        </p>

        <div className="flex justify-center">
          <Toggle 
            leftLabel="Monthly" 
            rightLabel="Yearly (Save ~15%)" 
            checked={currentCycle === 'yearly'}
            onChange={onToggleCycle}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {config.tiers.map((tier) => {
          const price = currentCycle === 'monthly' ? tier.pricing.monthly : tier.pricing.yearly;
          const isRecommended = tier.isRecommended;

          return (
            <GlowCard 
              key={tier.id} 
              highlight={isRecommended} 
              intensity={config.theme.glowIntensity}
            >
              {isRecommended && (
                <div className="absolute top-0 right-0 -mt-3 -mr-3 z-20">
                  <span className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Recommended
                  </span>
                </div>
              )}

              {/* Icon & Header */}
              <div className="mb-4 flex items-center gap-3">
                {tier.icon && (
                  <div className="w-10 h-10 rounded-lg bg-white/5 p-1.5 border border-white/10 flex-shrink-0">
                    <img src={tier.icon} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  {tier.tagline && <p className="text-sm text-primary">{tier.tagline}</p>}
                </div>
              </div>

              {/* Media Presentation */}
              {tier.media && (
                <div className="mb-4 w-full aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/5 relative group">
                  {tier.media.type === 'video' ? (
                    <video 
                      src={tier.media.url}
                      poster={tier.media.poster}
                      controls
                      muted={tier.media.autoPlay}
                      autoPlay={tier.media.autoPlay}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={tier.media.url} 
                      alt={tier.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
              )}

              <p className="text-gray-400 mb-6 text-sm">{tier.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">{tier.pricing.currency}{price}</span>
                  <span className="text-gray-500 ml-2">/{currentCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>

              <div className="flex-grow mb-8 space-y-3">
                {tier.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check className="text-primary mt-0.5 mr-3 flex-shrink-0" size={18} />
                    <span className="text-gray-300 text-sm">{feat}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={isRecommended ? 'primary' : 'outline'} 
                className="w-full"
                onClick={() => onSelectTier(tier)}
              >
                Choose Plan
              </Button>
            </GlowCard>
          );
        })}
      </div>
    </div>
  );
};