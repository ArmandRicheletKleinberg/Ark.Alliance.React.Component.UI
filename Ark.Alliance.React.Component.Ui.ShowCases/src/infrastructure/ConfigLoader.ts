/**
 * @fileoverview Configuration Loader
 * @module infrastructure/ConfigLoader
 */

import catalogueData from './data/catalogue.json';
// In a real app we might fetch these dynamically. 
// For now, we import them directly or use a dynamic import map.
// To keep it simple and effective with Vite, we can use glob imports.

import { CatalogueConfig, ComponentPanelConfig } from '@/domain/entities';

// Import all panel configs
const panelModules = import.meta.glob('./data/panels/*.json', { eager: true }); // Glob import

export const ConfigLoader = {
    getCatalogue: (): CatalogueConfig => {
        return catalogueData as CatalogueConfig;
    },

    getPanelConfig: (panelId: string): ComponentPanelConfig | null => {
        const path = `./data/panels/${panelId}.json`;
        const module = panelModules[path] as any;
        return module?.default || module || null;
    }
};
