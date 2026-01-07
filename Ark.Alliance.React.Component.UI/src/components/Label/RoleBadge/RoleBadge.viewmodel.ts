/**
 * @fileoverview RoleBadge ViewModel
 * @module components/Label/RoleBadge
 * 
 * Business logic hook for role badge components.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import {
    type RoleBadgeModel,
    type RoleType,
    defaultRoleBadgeModel,
    RoleBadgeModelSchema,
    ROLE_CONFIG,
    ROLE_BADGE_SIZE_CLASSES,
} from './RoleBadge.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * RoleBadge ViewModel options
 */
export interface UseRoleBadgeOptions extends Partial<RoleBadgeModel> {
    /** Required role (only role is required) */
    role: RoleType;
}

/**
 * RoleBadge ViewModel return type
 */
export interface UseRoleBadgeResult extends BaseViewModelResult<RoleBadgeModel> {
    /** Display label for the role */
    displayLabel: string;
    /** Role color configuration */
    roleConfig: typeof ROLE_CONFIG[RoleType];
    /** Computed badge classes */
    badgeClasses: string;
    /** Computed badge styles */
    badgeStyles: React.CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * RoleBadge ViewModel hook
 * 
 * Manages state and computed values for role badge rendering.
 * 
 * @example
 * ```tsx
 * const vm = useRoleBadge({ role: 'admin' });
 * // vm.displayLabel === 'Admin'
 * // vm.roleConfig.text === '#dc2626'
 * ```
 */
export function useRoleBadge(options: UseRoleBadgeOptions): UseRoleBadgeResult {
    // Parse and validate model
    const modelOptions = useMemo(() => {
        return RoleBadgeModelSchema.parse({ ...defaultRoleBadgeModel, ...options });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    // Use base ViewModel
    const base = useBaseViewModel<RoleBadgeModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'role-badge',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const roleConfig = useMemo(() => {
        return ROLE_CONFIG[base.model.role];
    }, [base.model.role]);

    const displayLabel = useMemo(() => {
        return roleConfig.label;
    }, [roleConfig.label]);

    const badgeClasses = useMemo(() => {
        const classes = [
            'ark-role-badge',
            ROLE_BADGE_SIZE_CLASSES[base.model.size],
        ];

        if (base.model.removable) classes.push('ark-role-badge--removable');
        if (base.model.className) classes.push(base.model.className);

        return classes.join(' ');
    }, [base.model.size, base.model.removable, base.model.className]);

    const badgeStyles: React.CSSProperties = useMemo(() => ({
        background: roleConfig.bg,
        color: roleConfig.text,
        borderColor: roleConfig.text,
    }), [roleConfig]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        displayLabel,
        roleConfig,
        badgeClasses,
        badgeStyles,
    };
}

export default useRoleBadge;
