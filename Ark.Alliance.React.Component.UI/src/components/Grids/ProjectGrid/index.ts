/**
 * @fileoverview ProjectGrid Module Barrel Export
 * @module components/Grids/ProjectGrid
 * 
 * Exports ProjectGrid and ProjectCard components with their models.
 */

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export { ProjectGrid, type ProjectGridProps } from './ProjectGrid';
export { ProjectCard, type ProjectCardProps } from './ProjectCard';

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL
// ═══════════════════════════════════════════════════════════════════════════

export { useProjectGrid, type UseProjectGridOptions, type UseProjectGridResult } from './ProjectGrid.viewmodel';

// ═══════════════════════════════════════════════════════════════════════════
// MODEL
// ═══════════════════════════════════════════════════════════════════════════

export {
    ProjectGridModelSchema,
    ProjectItemSchema,
    ProjectTechnologySchema,
    ProjectStatusEnum,
    defaultProjectGridModel,
    createProjectGridModel,
    type ProjectGridModel,
    type ProjectItem,
    type ProjectTechnology,
    type ProjectStatus,
} from './ProjectGrid.model';
