/**
 * @fileoverview Page Component ViewModel
 * @module components/Page
 * 
 * ViewModel hook for the Page component providing state management,
 * computed properties, and event handlers.
 */

import { useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import { useTheme } from '../../core/theme/useTheme';
import type { PageModel } from './Page.model';
import { PageModelSchema, defaultPageModel } from './Page.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for usePage hook
 */
export interface UsePageOptions extends Partial<PageModel> {
    /** Back button click handler */
    onBack?: () => void;
    /** Breadcrumb click handler */
    onBreadcrumbClick?: (path: string) => void;
}

/**
 * Page ViewModel result interface
 */
export interface UsePageResult extends BaseViewModelResult<PageModel> {
    // Computed CSS classes
    pageClasses: string;
    headerClasses: string;
    contentClasses: string;

    // Computed properties
    hasIcon: boolean;
    hasBreadcrumbs: boolean;
    itemCountLabel: string;

    // Event handlers
    handleBack: () => void;
    handleBreadcrumbClick: (path: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Page ViewModel Hook
 * 
 * Manages page state, computes CSS classes, and provides event handlers.
 * 
 * @param options - Page configuration options
 * @returns ViewModel result with model, classes, and handlers
 * 
 * @example
 * ```tsx
 * const vm = usePage({
 *     title: 'Dashboard',
 *     subtitle: 'Overview of system status',
 *     icon: '📊',
 *     onBack: () => navigate(-1),
 * });
 * ```
 */
export function usePage(options: UsePageOptions = {}): UsePageResult {
    const { onBack, onBreadcrumbClick, ...modelOptions } = options;

    // Parse and validate model with explicit dependencies
    const modelData = useMemo(() => {
        return PageModelSchema.parse({ ...defaultPageModel, ...modelOptions });
    }, [
        modelOptions.title,
        modelOptions.subtitle,
        modelOptions.icon,
        modelOptions.itemCount,
        modelOptions.itemLabel,
        modelOptions.showHeader,
        modelOptions.showBackButton,
        modelOptions.headerVariant,
        modelOptions.layout,
        modelOptions.padding,
        modelOptions.isDark,
        modelOptions.disabled,
        modelOptions.loading,
        modelOptions.testId,
        modelOptions.className,
    ]);

    const base = useBaseViewModel<PageModel>(modelData, {
        model: modelData,
        eventChannel: 'page',
    });

    const { resolvedMode } = useTheme();
    const isDark = base.model.isDark !== undefined ? base.model.isDark : resolvedMode === 'dark';

    // Computed CSS classes for page container
    const pageClasses = useMemo(() => {
        const classes = ['ark-page'];
        if (base.model.className) classes.push(base.model.className);
        if (base.model.className) classes.push(base.model.className);
        if (isDark) classes.push('ark-page--dark');
        else classes.push('ark-page--light');
        classes.push(`ark-page--layout-${base.model.layout}`);
        classes.push(`ark-page--padding-${base.model.padding}`);
        if (base.model.loading) classes.push('ark-page--loading');
        return classes.join(' ');
    }, [base.model.className, base.model.isDark, base.model.layout, base.model.padding, base.model.loading]);

    // Computed CSS classes for header
    const headerClasses = useMemo(() => {
        const classes = ['ark-page__header'];
        classes.push(`ark-page__header--${base.model.headerVariant}`);
        return classes.join(' ');
    }, [base.model.headerVariant]);

    // Computed CSS classes for content
    const contentClasses = useMemo(() => {
        const classes = ['ark-page__content'];
        return classes.join(' ');
    }, []);

    // Computed properties
    const hasIcon = !!base.model.icon;
    const hasBreadcrumbs = !!(base.model.breadcrumbs && base.model.breadcrumbs.length > 0);

    const itemCountLabel = useMemo(() => {
        if (base.model.itemCount === undefined) return '';
        return `${base.model.itemCount} ${base.model.itemLabel}`;
    }, [base.model.itemCount, base.model.itemLabel]);

    // Event handlers
    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const handleBreadcrumbClick = (path: string) => {
        if (onBreadcrumbClick && path) {
            onBreadcrumbClick(path);
        }
    };

    return {
        ...base,
        pageClasses,
        headerClasses,
        contentClasses,
        hasIcon,
        hasBreadcrumbs,
        itemCountLabel,
        handleBack,
        handleBreadcrumbClick,
    };
}

export default usePage;
