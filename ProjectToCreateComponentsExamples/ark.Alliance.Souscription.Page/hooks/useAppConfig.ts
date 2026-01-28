import { useState, useEffect, useCallback } from 'react';
import { AppConfig, ThemeConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

// Hook to manage global app configuration and theme injection
export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);

  // Load from local storage on mount (persistence)
  useEffect(() => {
    const saved = localStorage.getItem('nexus_app_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
  }, []);

  // Save to local storage whenever config changes
  useEffect(() => {
    localStorage.setItem('nexus_app_config', JSON.stringify(config));
    applyTheme(config.theme);
  }, [config]);

  // Update CSS Variables for Theming
  const applyTheme = (theme: ThemeConfig) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-surface', theme.surfaceColor);
    root.style.setProperty('--color-background', theme.gradientBackground);
    
    // Convert hex to rgb for tailwind opacity modifiers if needed, 
    // but here we just rely on CSS variables directly.
  };

  const updateConfig = useCallback((newConfig: AppConfig) => {
    setConfig(newConfig);
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  return {
    config,
    updateConfig,
    resetConfig,
    isConfigPanelOpen,
    setIsConfigPanelOpen
  };
};
