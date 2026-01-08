/**
 * @fileoverview Breadcrumb Component ViewModel
 * @module components/SEO/Breadcrumb
 */

import { useMemo } from 'react';
import { useBaseViewModel } from '../../../core/base';
import { BreadcrumbSchema, type BreadcrumbModel, defaultBreadcrumbModel } from './Breadcrumb.model';
import { generateBreadcrumbListSchema, type BreadcrumbItem } from '../../../Helpers/seo/generateSchema';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseBreadcrumbOptions extends Partial<BreadcrumbModel> {
    /** Callback when breadcrumb item is clicked */
    onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL
// ═══════════════════════════════════════════════════════════════════════════

export function useBreadcrumb(options: UseBreadcrumbOptions = {}) {
    // Pass defaultModel as first arg, options as second (correct signature)
    const base = useBaseViewModel<BreadcrumbModel>(
        defaultBreadcrumbModel,
        { model: options }  // Wrap options.items etc. in model property
    );

    // ========================================================================
    // Computed Values
    // ========================================================================

    /**
     * Generate JSON-LD schema for breadcrumbs
     */
    const jsonLdSchema = useMemo(() => {
        if (!base.model.generateSchema || !base.model.items.length) {
            return null;
        }

        const schemaItems: BreadcrumbItem[] = base.model.items.map((item) => ({
            position: item.position,
            name: item.label,
            item: item.href
                ? base.model.baseUrl
                    ? `${base.model.baseUrl}${item.href}`
                    : item.href
                : undefined,
        }));

        return generateBreadcrumbListSchema(schemaItems);
    }, [base.model.generateSchema, base.model.items, base.model.baseUrl]);

    /**
     * CSS classes for breadcrumb container
     */
    const breadcrumbClasses = useMemo(() => {
        const classes = ['ark-breadcrumb'];

        classes.push(`ark-breadcrumb--${base.model.size}`);
        classes.push(`ark-breadcrumb--${base.model.variant}`);

        if (base.model.disabled) classes.push('ark-breadcrumb--disabled');
        if (base.model.loading) classes.push('ark-breadcrumb--loading');

        return classes.join(' ');
    }, [base.model.size, base.model.variant, base.model.disabled, base.model.loading]);

    /**
     * Get separator display
     */
    const separatorDisplay = useMemo(() => {
        if (base.model.customSeparator) {
            return base.model.customSeparator;
        }
        return base.model.separator;
    }, [base.model.separator, base.model.customSeparator]);

    // ========================================================================
    // Event Handlers
    // ========================================================================

    /**
     * Handle breadcrumb item click
     */
    const handleItemClick = (item: BreadcrumbItem, index: number, event: React.MouseEvent) => {
        if (item.current || base.model.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.href) {
            event.preventDefault();
        }

        options.onItemClick?.(item, index);
    };

    // ========================================================================
    // Return
    // ========================================================================

    return {
        ...base,
        jsonLdSchema,
        breadcrumbClasses,
        separatorDisplay,
        handleItemClick,
    };
}

export type UseBreadcrumbReturn = ReturnType<typeof useBreadcrumb>;
