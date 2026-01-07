/**
 * @fileoverview DepartmentBadge Model
 * @module components/Label/DepartmentBadge
 * 
 * Data model for department badge components.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Department icon mappings
 */
export const DEPARTMENT_ICONS: Record<string, string> = {
    'Engineering': '💻',
    'Design': '🎨',
    'Product': '📦',
    'Marketing': '📣',
    'Sales': '💼',
    'Operations': '⚙️',
    'HR': '👥',
    'Finance': '💰',
    'Legal': '⚖️',
    'Executive': '👔',
    'Support': '🎧',
    'Research': '🔬',
    'Data': '📊',
    'Security': '🔒',
    'DevOps': '🚀',
    'QA': '✅',
};

/**
 * Size class mappings
 */
export const DEPARTMENT_BADGE_SIZE_CLASSES = {
    sm: 'ark-department-badge--sm',
    md: 'ark-department-badge--md',
    lg: 'ark-department-badge--lg',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DepartmentBadge data model interface
 */
export interface DepartmentBadgeModel {
    /** Department name */
    department: string;
    /** Size variant */
    size: 'sm' | 'md' | 'lg';
    /** Show icon */
    showIcon: boolean;
    /** Additional CSS class */
    className?: string;
    /** Test ID for testing */
    testId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ZOD SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const DepartmentBadgeModelSchema = z.object({
    department: z.string().min(1),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    showIcon: z.boolean().default(true),
    className: z.string().optional(),
    testId: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

export const defaultDepartmentBadgeModel: DepartmentBadgeModel = {
    department: 'General',
    size: 'md',
    showIcon: true,
};

export default DepartmentBadgeModelSchema;
