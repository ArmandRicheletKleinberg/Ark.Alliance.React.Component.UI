/**
 * @fileoverview TechBadge Module Barrel Export
 * @module components/Label/TechBadge
 * 
 * Exports TechBadge and BadgeDetailModal components with their models.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TECH BADGE
// ═══════════════════════════════════════════════════════════════════════════

export { TechBadge, type TechBadgeProps } from './TechBadge';
export { useTechBadge, type UseTechBadgeOptions, type UseTechBadgeResult } from './TechBadge.viewmodel';
export {
    TechBadgeModelSchema,
    TechnologyDataSchema,
    TECH_BADGE_SIZE_CLASSES,
    TECH_BADGE_ICON_SIZES,
    defaultTechBadgeModel,
    createTechBadgeModel,
    type TechBadgeModel,
    type TechnologyData,
    type TechBadgeSizeType,
} from './TechBadge.model';

// ═══════════════════════════════════════════════════════════════════════════
// BADGE DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════

export { BadgeDetailModal, type BadgeDetailModalProps } from './BadgeDetailModal';
export { useBadgeDetailModal, type UseBadgeDetailModalOptions, type UseBadgeDetailModalResult } from './BadgeDetailModal.viewmodel';
export {
    BadgeDetailModalModelSchema,
    BadgeDetailDataSchema,
    BadgeDetailLinkSchema,
    defaultBadgeDetailModalModel,
    createBadgeDetailModalModel,
    type BadgeDetailModalModel,
    type BadgeDetailData,
    type BadgeDetailLink,
} from './BadgeDetailModal.model';
