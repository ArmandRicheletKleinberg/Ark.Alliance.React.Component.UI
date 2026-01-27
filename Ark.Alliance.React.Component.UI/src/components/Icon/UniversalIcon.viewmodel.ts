/**
 * @fileoverview Universal Icon Component ViewModel
 * @module components/Icon/UniversalIcon
 * 
 * Business logic for the universal icon component.
 * Determines whether to render an internal SVG icon or a Font Awesome icon
 * based on the source prop and registry availability.
 */

import { useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import { IconRegistry } from './icons/IconRegistry';
import {
    UniversalIconModelSchema,
    defaultUniversalIconModel,
    type UniversalIconModel
} from './UniversalIcon.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseUniversalIconOptions extends Partial<UniversalIconModel> {
    name: string;
}

export interface UseUniversalIconResult extends BaseViewModelResult<UniversalIconModel> {
    /** Resolved source (svg or font-awesome) */
    resolvedSource: 'svg' | 'font-awesome';
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useUniversalIcon(options: UseUniversalIconOptions): UseUniversalIconResult {
    // Parse model options
    const modelOptions = useMemo(() => {
        return UniversalIconModelSchema.parse({ ...defaultUniversalIconModel, ...options });
    }, [options]);

    // Use base ViewModel
    const base = useBaseViewModel<UniversalIconModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'universal-icon',
    });

    // Determine effective source
    const resolvedSource = useMemo(() => {
        if (base.model.source !== 'auto') {
            return base.model.source;
        }

        // Auto-detection: strict registry check
        // If it exists in the registry, it's an internal SVG icon
        if (IconRegistry.has(base.model.name)) {
            return 'svg';
        }

        // Otherwise assume it's a Font Awesome icon
        return 'font-awesome';
    }, [base.model.source, base.model.name]);

    return {
        ...base,
        resolvedSource,
    };
}
