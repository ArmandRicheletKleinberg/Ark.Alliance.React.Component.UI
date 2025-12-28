/**
 * @fileoverview ControlPanel Barrel Export
 * @module components/ControlPanel
 * 
 * Exports ControlPanel primitive and related types.
 */

// Main Component and Sub-components
export {
    ControlPanel,
    ControlPanelSection,
    ControlPanelRow,
} from './ControlPanel';
export type {
    ControlPanelProps,
    ControlPanelSectionProps,
    ControlPanelRowProps,
} from './ControlPanel';

// ViewModel
export { useControlPanel } from './ControlPanel.viewmodel';
export type {
    UseControlPanelOptions,
    UseControlPanelResult,
} from './ControlPanel.viewmodel';

// Model
export {
    ControlPanelModelSchema,
    ControlPanelPositionSchema,
    ControlPanelSectionSchema,
    HeaderActionSchema,
    defaultControlPanelModel,
    createControlPanelModel,
} from './ControlPanel.model';
export type {
    ControlPanelModel,
    ControlPanelPosition,
    ControlPanelSection as ControlPanelSectionConfig,
    HeaderAction,
} from './ControlPanel.model';
