/**
 * @fileoverview Icon Component Barrel Export
 * @module components/Icon
 * 
 * Central export point for all Icon-related functionality.
 * Includes both custom SVG icons and Font Awesome icons.
 */

// ═══════════════════════════════════════════════════════════════════════════
// BASE SVG ICON
// ═══════════════════════════════════════════════════════════════════════════

// Component
export { Icon, default } from './Base/Icon/Icon';
export type { IconProps } from './Base/Icon/Icon';

// Model
export {
    IconModelSchema,
    IconSize,
    IconRotation,
    IconFlip,
    createIconModel,
    defaultIconModel,
    ICON_SIZE_MAP,
} from './Base/Icon/Icon.model';
export type {
    IconModel,
    IconSizeType,
    IconRotationType,
    IconFlipType,
    IconDefinition,
} from './Base/Icon/Icon.model';

// ViewModel
export { useIcon, default as useIconHook } from './Base/Icon/Icon.viewmodel';
export type { UseIconOptions, UseIconResult } from './Base/Icon/Icon.viewmodel';

// Registry
export { IconRegistry } from './icons/IconRegistry';


// ═══════════════════════════════════════════════════════════════════════════
// FONT AWESOME ICON
// ═══════════════════════════════════════════════════════════════════════════

// Component
export { FAIcon } from './FAIcon';
export type { FAIconProps } from './FAIcon';

// Model
export {
    FAIconModelSchema,
    FAIconStyle,
    FAIconSize,
    FAIconPrefix,
    FA_SIZE_MAP,
    STYLE_PREFIX_MAP,
    defaultFAIconModel,
    createFAIconModel,
} from './FAIcon';
export type {
    FAIconModel,
    FAIconStyleType,
    FAIconSizeType,
    FAIconPrefixType,
} from './FAIcon';

// ViewModel
export { useFAIcon } from './FAIcon';
export type { UseFAIconOptions, UseFAIconResult } from './FAIcon';

// Catalog
export {
    FA_ICON_CATALOG,
    SOLID_ICONS,
    REGULAR_ICONS,
    BRAND_ICONS,
    getFAIconsByCategory,
    getFAIconsByStyle,
    searchFAIcons,
    getFAIconCategories,
} from './icons/FAIconCatalog';
export type { FAIconMeta } from './icons/FAIconCatalog';

// ═══════════════════════════════════════════════════════════════════════════
// UNIVERSAL ICON (RECOMMENDED)
// ═══════════════════════════════════════════════════════════════════════════

export { UniversalIcon } from './UniversalIcon';
export type { UniversalIconProps } from './UniversalIcon';

export {
    UniversalIconModelSchema,
    UniversalIconSizeSchema,
    IconSourceSchema,
    IconStyleSchema,
    defaultUniversalIconModel,
    createUniversalIconModel,
} from './UniversalIcon.model';
export type {
    UniversalIconModel,
    UniversalIconSize,
    IconSource,
    IconStyle,
} from './UniversalIcon.model';

export { useUniversalIcon } from './UniversalIcon.viewmodel';
export type { UseUniversalIconOptions, UseUniversalIconResult } from './UniversalIcon.viewmodel';

export { UniversalRegistry } from './UniversalRegistry';
export type { UniversalIconDefinition } from './UniversalRegistry';
