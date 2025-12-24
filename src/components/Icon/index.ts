/**
 * @fileoverview Icon Component Barrel Export
 * @module components/Icon
 * 
 * Central export point for all Icon-related functionality.
 */

// Component
export { Icon, default } from './Icon';
export type { IconProps } from './Icon';

// Model
export {
    IconModelSchema,
    IconSize,
    IconRotation,
    IconFlip,
    createIconModel,
    defaultIconModel,
    ICON_SIZE_MAP,
} from './Icon.model';
export type {
    IconModel,
    IconSizeType,
    IconRotationType,
    IconFlipType,
    IconDefinition,
} from './Icon.model';

// ViewModel
export { useIcon, default as useIconHook } from './Icon.viewmodel';
export type { UseIconOptions, UseIconResult } from './Icon.viewmodel';

// Registry
export { IconRegistry } from './icons/IconRegistry';
