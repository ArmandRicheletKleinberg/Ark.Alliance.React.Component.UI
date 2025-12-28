/**
 * @fileoverview GenericPanel Component Barrel Export
 * @module components/GenericPanel
 */

// Main component
export { GenericPanel, type GenericPanelProps } from './GenericPanel';
export { default } from './GenericPanel';

// Model & types
export {
    GenericPanelModelSchema,
    defaultGenericPanelModel,
    createGenericPanelModel,
    PanelLayoutSchema,
    type GenericPanelModel,
    type PanelLayout,
} from './GenericPanel.model';

// ViewModel
export {
    useGenericPanel,
    type UseGenericPanelOptions,
    type UseGenericPanelResult,
} from './GenericPanel.viewmodel';

// Primitives
export * from './primitives';
