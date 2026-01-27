/**
 * @fileoverview Domain Entities for Component Showcase
 * @module domain/entities
 */

import { ComponentType } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION TYPES (JSON Schema)
// ═══════════════════════════════════════════════════════════════════════════

export type ControlType = 'text' | 'number' | 'boolean' | 'select' | 'color' | 'slider' | 'icon' | 'divider';

export interface ControlDefinition {
    propName: string;
    type: ControlType;
    label?: string;
    description?: string;
    group?: 'content' | 'style' | 'behavior' | 'data' | 'demo';
    // Specific options
    options?: string[]; // For select
    min?: number;       // For slider/number
    max?: number;       // For slider/number
    step?: number;      // For slider/number
    defaultValue?: any;
}

export interface EnhancedControlDefinition extends ControlDefinition {
    // Advanced control types
    conditional?: {
        dependsOn: string;
        showWhen: any;
    };
    validation?: {
        required?: boolean;
        pattern?: RegExp;
        min?: number;
        max?: number;
    };
    // Code generation hints
    codeTemplate?: string;
}

export interface ComponentDocumentation {
    overview: string;
    features: string[];
    useCases: string[];
    apiReference: {
        props: PropDefinition[];
        methods?: MethodDefinition[];
        events?: EventDefinition[];
    };
    examples: CodeExample[];
}

export interface PropDefinition {
    name: string;
    type: string;
    description: string;
    defaultValue?: string;
}

export interface MethodDefinition {
    name: string;
    description: string;
    signature: string;
}

export interface EventDefinition {
    name: string;
    description: string;
}

export interface CodeExample {
    title: string;
    description: string;
    code: string;
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
        background?: 'light' | 'dark' | 'checker' | 'none' | string;
        fullscreen?: boolean;
    };

    controls: ControlDefinition[];
    defaultProps: Record<string, any>;
}

export interface EnhancedComponentPanelConfig extends ComponentPanelConfig {
    documentation?: ComponentDocumentation;
    mockDataGenerators?: Record<string, () => any>;
    variants?: VariantConfig[];
    relatedComponents?: string[];
}

export interface VariantConfig {
    name: string;
    props: Record<string, any>;
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
