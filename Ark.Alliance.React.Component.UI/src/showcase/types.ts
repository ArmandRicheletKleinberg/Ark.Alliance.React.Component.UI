/**
 * @fileoverview Showcase Type Definitions
 * @module showcase/types
 * 
 * Shared type definitions for the component showcase application.
 */

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT REGISTRY TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Property definition for component showcase controls
 */
export interface PropDefinition {
    /** Property name */
    name: string;
    /** Property type for input control */
    type: 'string' | 'number' | 'boolean' | 'select' | 'color';
    /** Default value */
    default: unknown;
    /** Options for select type */
    options?: string[];
    /** Property description */
    description?: string;
}

/**
 * Style preset for quick component configuration
 */
export interface StylePreset {
    /** Preset display name */
    name: string;
    /** Props applied by this preset */
    props: Record<string, unknown>;
}

/**
 * Component information for showcase display
 */
export interface ComponentInfo {
    /** Component display name */
    name: string;
    /** Component description */
    description: string;
    /** React component reference - using any to allow diverse component signatures */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<any>;
    /** Default props for preview */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultProps: Record<string, any>;
    /** Editable property definitions */
    propDefs: PropDefinition[];
    /** Available style presets */
    presets: StylePreset[];
}

/**
 * Component category/family grouping
 */
export interface ComponentCategory {
    /** Category display name */
    name: string;
    /** Category icon (emoji) */
    icon: string;
    /** Category description */
    description: string;
    /** Components in this category */
    components: ComponentInfo[];
}
