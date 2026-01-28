import { useState, useEffect } from 'react';
import { BillingCycle, AppConfig } from '../types';

export const usePricingVM = (config: AppConfig) => {
  const [cycle, setCycle] = useState<BillingCycle>(config.defaults.billingCycle);

  // Sync with defaults if config changes/resets
  useEffect(() => {
    setCycle(config.defaults.billingCycle);
  }, [config.defaults.billingCycle]);

  const toggleCycle = () => {
    setCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly');
  };

  return {
    cycle,
    toggleCycle
  };
};
