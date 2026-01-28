// --- Data Models ---

export type BillingCycle = 'monthly' | 'yearly';

export interface Pricing {
  monthly: number;
  yearly: number;
  currency: string;
  priceNote?: string;
}

export interface MediaAsset {
  type: 'image' | 'video';
  url: string;
  poster?: string; // Optional thumbnail for video
  autoPlay?: boolean;
}

export interface Tier {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  features: string[];
  
  // Visual Assets
  icon?: string; // Small icon URL next to name
  media?: MediaAsset; // Main presentation media
  imageUrl?: string; // Deprecated, prefer media
  
  isRecommended?: boolean;
  pricing: Pricing;
}

export interface CryptoConfig {
  chain: string;
  symbol: string;
  address: string;
  memo?: string;
  minAmount?: number;
  confirmationsHint?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'paypal' | 'crypto';
  label: string;
  enabled: boolean;
  cryptoConfig?: CryptoConfig; // Only present if type === 'crypto'
  icon?: string;
}

export interface ThemeConfig {
  gradientBackground: string;
  primaryColor: string;
  secondaryColor: string;
  surfaceColor: string;
  glowIntensity: 'low' | 'medium' | 'high';
  cornerRadius: string;
}

export interface AppConfig {
  productName: string;
  productTagline: string;
  tiers: Tier[];
  paymentMethods: PaymentMethod[];
  theme: ThemeConfig;
  defaults: {
    billingCycle: BillingCycle;
    currency: string;
  };
}