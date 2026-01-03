/**
 * @fileoverview Badge Detail Modal ViewModel
 * @module components/Label/TechBadge
 * 
 * Business logic for the generic badge detail modal.
 */

import { useMemo, useCallback, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { BadgeDetailModalModel, BadgeDetailData } from './BadgeDetailModal.model';
import {
    defaultBadgeDetailModalModel,
    BadgeDetailModalModelSchema,
} from './BadgeDetailModal.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Badge Detail Modal ViewModel options
 */
export interface UseBadgeDetailModalOptions extends Partial<BadgeDetailModalModel> {}

/**
 * Badge Detail Modal ViewModel return type
 */
export interface UseBadgeDetailModalResult extends BaseViewModelResult<BadgeDetailModalModel> {
    /** Brand color from data */
    brandColor: string;
    /** Whether modal has data to display */
    hasData: boolean;
    /** Handle overlay click */
    handleOverlayClick: () => void;
    /** Handle close */
    handleClose: () => void;
    /** Overlay classes */
    overlayClasses: string;
    /** Content classes */
    contentClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Badge Detail Modal ViewModel hook
 * 
 * @example
 * ```tsx
 * const vm = useBadgeDetailModal({
 *     isOpen: true,
 *     data: { name: 'React', color: '#61dafb', description: 'A JavaScript library' },
 *     onClose: () => setOpen(false)
 * });
 * ```
 */
export function useBadgeDetailModal(options: UseBadgeDetailModalOptions = {}): UseBadgeDetailModalResult {
    // Parse model options
    const modelOptions = useMemo(() => {
        return BadgeDetailModalModelSchema.parse({ ...defaultBadgeDetailModalModel, ...options });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    // Use base ViewModel
    const base = useBaseViewModel<BadgeDetailModalModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'badgeDetailModal',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // ESCAPE KEY HANDLER
    // ═══════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (!base.model.isOpen || !base.model.closeOnEscape) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && base.model.onClose) {
                base.model.onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [base.model.isOpen, base.model.closeOnEscape, base.model.onClose]);

    // ═══════════════════════════════════════════════════════════════════════
    // BODY SCROLL LOCK
    // ═══════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (base.model.isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [base.model.isOpen]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const brandColor = useMemo(() => {
        return base.model.data?.color || '#3b82f6';
    }, [base.model.data?.color]);

    const hasData = useMemo(() => {
        return !!base.model.data?.name;
    }, [base.model.data?.name]);

    const overlayClasses = useMemo(() => {
        const classes = ['ark-badge-modal__overlay'];
        if (base.model.showBackdrop) {
            classes.push('ark-badge-modal__overlay--backdrop');
        }
        return classes.join(' ');
    }, [base.model.showBackdrop]);

    const contentClasses = useMemo(() => {
        return 'ark-badge-modal__content';
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleOverlayClick = useCallback(() => {
        if (base.model.closeOnOverlayClick && base.model.onClose) {
            base.model.onClose();
        }
    }, [base.model.closeOnOverlayClick, base.model.onClose]);

    const handleClose = useCallback(() => {
        if (base.model.onClose) {
            base.model.onClose();
        }
    }, [base.model.onClose]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        brandColor,
        hasData,
        handleOverlayClick,
        handleClose,
        overlayClasses,
        contentClasses,
    };
}

export default useBadgeDetailModal;
