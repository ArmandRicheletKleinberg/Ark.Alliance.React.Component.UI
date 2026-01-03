/**
 * @fileoverview Domain Entities for Component Showcase
 * @module domain/entities
 */

import { ComponentType } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION TYPES (JSON Schema)
// ═══════════════════════════════════════════════════════════════════════════

export type ControlType = 'text' | 'number' | 'boolean' | 'select' | 'color' | 'slider' | 'icon';

export interface ControlDefinition {
    propName: string;
    type: ControlType;
    label?: string;
    description?: string;
    group?: 'content' | 'style' | 'behavior';
    // Specific options
    options?: string[]; // For select
    min?: number;       // For slider
    max?: number;       // For slider
    step?: number;      // For slider
}

export interface ComponentPanelConfig {
    id: string;           // Unique ID for the show case panel
    title: string;        // Display title
    description: string;  // Description
    componentId: string;  // Key to resolve the actual React component

    layout: {
        width?: string;    // e.g. "100%", "fix-content"
        height?: string;   // e.g. "400px"
        minWidth?: string; // e.g. "600px", "lg", "full" - triggers full width if needed
    };

    preview: {
        background?: 'light' | 'dark' | 'checker' | string;
    };

    controls: ControlDefinition[];
    defaultProps: Record<string, any>;
}

export interface CategoryConfig {
    name: string;      // Category Name (Button, Inputs...)
    icon: string;      // FontAwesome icon name
    description: string;
    componentIds: string[]; // List of ComponentPanel IDs included in this category
}

export interface CatalogueConfig {
    categories: CategoryConfig[];
}

// ═══════════════════════════════════════════════════════════════════════════
// RUNTIME TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ComponentResolved {
    component: ComponentType<any>;
}
