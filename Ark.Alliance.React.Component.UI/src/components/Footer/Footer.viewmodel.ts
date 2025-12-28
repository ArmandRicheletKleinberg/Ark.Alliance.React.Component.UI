/**
 * @fileoverview Footer Component ViewModel
 * @module components/Footer
 */

import { useMemo, useCallback, type CSSProperties } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { FooterModel, PagingConfig } from './Footer.model';
import { defaultFooterModel, FooterModelSchema, defaultPagingConfig } from './Footer.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseFooterOptions extends Partial<FooterModel> {
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
}

export interface UseFooterResult extends BaseViewModelResult<FooterModel> {
    footerClasses: string;
    backgroundStyles: CSSProperties;
    pagingConfig: PagingConfig;
    goToPage: (page: number) => void;
    goToPrevious: () => void;
    goToNext: () => void;
    goToFirst: () => void;
    goToLast: () => void;
    changePageSize: (size: number) => void;
    canGoPrevious: boolean;
    canGoNext: boolean;
    pageNumbers: number[];
    startItem: number;
    endItem: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function buildBackgroundStyles(bg?: FooterModel['background']): CSSProperties {
    if (!bg) return {};

    const styles: CSSProperties = {};

    if (bg.type === 'solid' && bg.color) {
        styles.backgroundColor = bg.color;
    } else if (bg.type === 'gradient') {
        styles.background = `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientStart || '#00d4ff'}, ${bg.gradientEnd || '#7c3aed'})`;
    }

    return styles;
}

function generatePageNumbers(current: number, total: number, maxVisible: number = 5): number[] {
    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: number[] = [];
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, current - half);
    const end = Math.min(total, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useFooter(options: UseFooterOptions): UseFooterResult {
    const { onPageChange, onPageSizeChange, ...modelData } = options;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const modelOptions = useMemo(() => {
        return FooterModelSchema.parse({ ...defaultFooterModel, ...modelData });
    }, [JSON.stringify(modelData)]);

    const base = useBaseViewModel<FooterModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'footer',
    });

    // Paging config with defaults
    const pagingConfig = useMemo(() => {
        return { ...defaultPagingConfig, ...base.model.paging };
    }, [base.model.paging]);

    // Navigation
    const goToPage = useCallback((page: number) => {
        const validPage = Math.max(1, Math.min(page, pagingConfig.totalPages));
        onPageChange?.(validPage);
    }, [pagingConfig.totalPages, onPageChange]);

    const goToPrevious = useCallback(() => {
        if (pagingConfig.currentPage > 1) {
            goToPage(pagingConfig.currentPage - 1);
        }
    }, [pagingConfig.currentPage, goToPage]);

    const goToNext = useCallback(() => {
        if (pagingConfig.currentPage < pagingConfig.totalPages) {
            goToPage(pagingConfig.currentPage + 1);
        }
    }, [pagingConfig.currentPage, pagingConfig.totalPages, goToPage]);

    const goToFirst = useCallback(() => goToPage(1), [goToPage]);
    const goToLast = useCallback(() => goToPage(pagingConfig.totalPages), [pagingConfig.totalPages, goToPage]);

    const changePageSize = useCallback((size: number) => {
        onPageSizeChange?.(size);
    }, [onPageSizeChange]);

    // Computed values
    const canGoPrevious = pagingConfig.currentPage > 1;
    const canGoNext = pagingConfig.currentPage < pagingConfig.totalPages;
    const pageNumbers = generatePageNumbers(pagingConfig.currentPage, pagingConfig.totalPages);

    const startItem = pagingConfig.totalItems === 0
        ? 0
        : (pagingConfig.currentPage - 1) * pagingConfig.pageSize + 1;
    const endItem = Math.min(pagingConfig.currentPage * pagingConfig.pageSize, pagingConfig.totalItems);

    // CSS classes
    const footerClasses = useMemo(() => {
        const classes = [
            'ark-footer',
            `ark-footer--${base.model.variant}`,
            `ark-footer--${base.model.visualMode}`,
            `ark-footer--${base.model.height}`,
            base.model.isDark ? 'ark-footer--dark' : 'ark-footer--light',
        ];

        if (base.model.borderRadius !== 'none') {
            classes.push(`ark-footer--radius-${base.model.borderRadius}`);
        }
        if (base.model.sticky) {
            classes.push('ark-footer--sticky');
        }
        if (base.model.alignment !== 'center') {
            classes.push(`ark-footer--align-${base.model.alignment}`);
        }
        if (base.model.className) {
            classes.push(base.model.className);
        }

        return classes.join(' ');
    }, [base.model]);

    const backgroundStyles = useMemo(() => {
        return buildBackgroundStyles(base.model.background);
    }, [base.model.background]);

    return {
        ...base,
        footerClasses,
        backgroundStyles,
        pagingConfig,
        goToPage,
        goToPrevious,
        goToNext,
        goToFirst,
        goToLast,
        changePageSize,
        canGoPrevious,
        canGoNext,
        pageNumbers,
        startItem,
        endItem,
    };
}

export default useFooter;
