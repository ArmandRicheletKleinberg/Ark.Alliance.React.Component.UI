/**
 * @fileoverview TabControl Component Barrel Export
 * @module components/TabControl
 */

// TabItem sub-component
export * from './TabItem';

// Model
export {
    TabControlModelSchema,
    defaultTabControlModel,
    createTabControlModel,
} from './TabControl.model';
export type {
    TabVariantType,
    TabOrientationType,
    TabAlignmentType,
    TabControlModel,
    TabItemModel,
} from './TabControl.model';

// ViewModel
export { useTabControl, default as useTabControlHook } from './TabControl.viewmodel';
export type { UseTabControlOptions, UseTabControlResult } from './TabControl.viewmodel';

// View
export { TabControl, default } from './TabControl';
export type { TabControlProps } from './TabControl';
