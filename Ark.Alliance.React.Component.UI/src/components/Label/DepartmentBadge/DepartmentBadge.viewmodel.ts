/**
 * @fileoverview DepartmentBadge ViewModel
 * @module components/Label/DepartmentBadge
 */

import { useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import {
    type DepartmentBadgeModel,
    defaultDepartmentBadgeModel,
    DepartmentBadgeModelSchema,
    DEPARTMENT_ICONS,
    DEPARTMENT_BADGE_SIZE_CLASSES,
} from './DepartmentBadge.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseDepartmentBadgeOptions extends Partial<DepartmentBadgeModel> {
    department: string;
}

export interface UseDepartmentBadgeResult extends BaseViewModelResult<DepartmentBadgeModel> {
    displayIcon: string;
    badgeClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useDepartmentBadge(options: UseDepartmentBadgeOptions): UseDepartmentBadgeResult {
    const modelOptions = useMemo(() => {
        return DepartmentBadgeModelSchema.parse({ ...defaultDepartmentBadgeModel, ...options });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    const base = useBaseViewModel<DepartmentBadgeModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'department-badge',
    });

    const displayIcon = useMemo(() => {
        return DEPARTMENT_ICONS[base.model.department] || '🏢';
    }, [base.model.department]);

    const badgeClasses = useMemo(() => {
        const classes = [
            'ark-department-badge',
            DEPARTMENT_BADGE_SIZE_CLASSES[base.model.size],
        ];
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model.size, base.model.className]);

    return {
        ...base,
        displayIcon,
        badgeClasses,
    };
}

export default useDepartmentBadge;
