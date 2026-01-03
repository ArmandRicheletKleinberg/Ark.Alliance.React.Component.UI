/**
 * @fileoverview ProjectGrid Component ViewModel
 * @module components/Grids/ProjectGrid
 * 
 * Business logic for project grid components.
 */

import { useMemo, useCallback } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { ProjectGridModel, ProjectItem } from './ProjectGrid.model';
import {
    defaultProjectGridModel,
    ProjectGridModelSchema,
} from './ProjectGrid.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ProjectGrid ViewModel options
 */
export interface UseProjectGridOptions extends Partial<ProjectGridModel> { }

/**
 * ProjectGrid ViewModel return type
 */
export interface UseProjectGridResult extends BaseViewModelResult<ProjectGridModel> {
    /** Grid container styles */
    gridStyles: React.CSSProperties;
    /** Whether there are projects to display */
    hasProjects: boolean;
    /** Handle project click */
    handleProjectClick: (project: ProjectItem) => void;
    /** Handle technology click */
    handleTechnologyClick: (techKey: string) => void;
    /** Get technology display name */
    getTechnologyName: (tech: string | { name: string }) => string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ProjectGrid ViewModel hook
 * 
 * @example
 * ```tsx
 * const vm = useProjectGrid({
 *     projects: [...],
 *     onProjectClick: (p) => navigate(`/projects/${p.id}`)
 * });
 * ```
 */
export function useProjectGrid(options: UseProjectGridOptions = {}): UseProjectGridResult {
    // Parse model options
    const modelOptions = useMemo(() => {
        return ProjectGridModelSchema.parse({ ...defaultProjectGridModel, ...options });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    // Use base ViewModel
    const base = useBaseViewModel<ProjectGridModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'projectGrid',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const gridStyles: React.CSSProperties = useMemo(() => ({
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${base.model.minColumnWidth}, 1fr))`,
        gap: base.model.gap,
    }), [base.model.minColumnWidth, base.model.gap]);

    const hasProjects = useMemo(() => {
        return base.model.projects.length > 0;
    }, [base.model.projects.length]);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleProjectClick = useCallback((project: ProjectItem) => {
        if (base.model.onProjectClick) {
            base.model.onProjectClick(project);
        }
    }, [base.model.onProjectClick]);

    const handleTechnologyClick = useCallback((techKey: string) => {
        if (base.model.onTechnologyClick) {
            base.model.onTechnologyClick(techKey);
        }
    }, [base.model.onTechnologyClick]);

    const getTechnologyName = useCallback((tech: string | { name: string }): string => {
        return typeof tech === 'string' ? tech : tech.name;
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        gridStyles,
        hasProjects,
        handleProjectClick,
        handleTechnologyClick,
        getTechnologyName,
    };
}

export default useProjectGrid;
