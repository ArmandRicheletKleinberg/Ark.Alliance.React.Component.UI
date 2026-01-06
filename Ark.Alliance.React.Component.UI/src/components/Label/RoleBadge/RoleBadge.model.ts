/**
 * @fileoverview RoleBadge Model
 * @module components/Label/RoleBadge
 * 
 * Data model and validation schema for role badge components.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Available user roles in the system
 */
export const ROLES = ['admin', 'supervisor', 'collaborator', 'member', 'guest'] as const;
export type RoleType = typeof ROLES[number];

/**
 * Role configuration with colors and labels
 */
export const ROLE_CONFIG: Record<RoleType, { bg: string; text: string; label: string }> = {
    admin: { bg: 'rgba(220, 38, 38, 0.15)', text: '#dc2626', label: 'Admin' },
    supervisor: { bg: 'rgba(147, 51, 234, 0.15)', text: '#9333ea', label: 'Supervisor' },
    collaborator: { bg: 'rgba(37, 99, 235, 0.15)', text: '#2563eb', label: 'Collaborator' },
    member: { bg: 'rgba(22, 163, 74, 0.15)', text: '#16a34a', label: 'Member' },
    guest: { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280', label: 'Guest' }
};

/**
 * Size class mappings
 */
export const ROLE_BADGE_SIZE_CLASSES = {
    sm: 'ark-role-badge--sm',
    md: 'ark-role-badge--md',
    lg: 'ark-role-badge--lg',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * RoleBadge data model interface
 */
export interface RoleBadgeModel {
    /** Role to display */
    role: RoleType;
    /** Size variant */
    size: 'sm' | 'md' | 'lg';
    /** Show remove button */
    removable: boolean;
    /** Additional CSS class */
    className?: string;
    /** Test ID for testing */
    testId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ZOD SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Zod validation schema for RoleBadge model
 */
export const RoleBadgeModelSchema = z.object({
    role: z.enum(ROLES),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    removable: z.boolean().default(false),
    className: z.string().optional(),
    testId: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default RoleBadge model values
 */
export const defaultRoleBadgeModel: RoleBadgeModel = {
    role: 'guest',
    size: 'md',
    removable: false,
};

export default RoleBadgeModelSchema;
