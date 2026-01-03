/**
 * @fileoverview ProjectGrid Component Model
 * @module components/Grids/ProjectGrid
 * 
 * Defines the data structure, validation, and defaults for project grids.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Project technology schema
 */
export const ProjectTechnologySchema = z.object({
    /** Technology name */
    name: z.string(),
    /** Technology category */
    category: z.string().optional(),
});

/**
 * Project status enum
 */
export const ProjectStatusEnum = z.enum([
    'PLANNED',
    'IN_PROGRESS',
    'COMPLETED',
    'ON_HOLD',
    'ARCHIVED',
]);

/**
 * Project item schema for grid display
 */
export const ProjectItemSchema = z.object({
    /** Unique identifier */
    id: z.string(),
    /** Project title */
    title: z.string(),
    /** Project description */
    description: z.string(),
    /** Project status */
    status: ProjectStatusEnum.default('IN_PROGRESS'),
    /** Project image URL */
    imageUrl: z.string().optional(),
    /** Technologies used */
    technologies: z.array(z.union([z.string(), ProjectTechnologySchema])).default([]),
    /** Repository URL */
    repoUrl: z.string().optional(),
    /** Demo/live URL */
    demoUrl: z.string().optional(),
    /** Whether project is featured */
    isFeatured: z.boolean().default(false),
});

/**
 * ProjectGrid model schema
 */
export const ProjectGridModelSchema = extendSchema({
    /** Projects to display */
    projects: z.array(ProjectItemSchema).default([]),

    /** Minimum column width (CSS value) */
    minColumnWidth: z.string().default('380px'),

    /** Grid gap (CSS value) */
    gap: z.string().default('1.5rem'),

    /** Number of technologies to show per card */
    maxTechnologies: z.number().default(5),

    /** Show loading state */
    isLoading: z.boolean().default(false),

    /** Error message */
    error: z.string().optional(),

    /** Click handler for project */
    onProjectClick: z.function().optional(),

    /** Click handler for technology badge */
    onTechnologyClick: z.function().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type ProjectTechnology = z.infer<typeof ProjectTechnologySchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type ProjectGridModel = z.infer<typeof ProjectGridModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default project grid model values
 */
export const defaultProjectGridModel: ProjectGridModel = ProjectGridModelSchema.parse({});

/**
 * Create a project grid model with custom values
 */
export function createProjectGridModel(data: Partial<ProjectGridModel> = {}): ProjectGridModel {
    return ProjectGridModelSchema.parse({ ...defaultProjectGridModel, ...data });
}
