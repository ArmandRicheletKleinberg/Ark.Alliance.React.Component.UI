/**
 * @fileoverview ProjectGrid Component
 * @module components/Grids/ProjectGrid
 * 
 * Displays a responsive grid of project cards.
 */

import { forwardRef, memo } from 'react';
import { useProjectGrid, type UseProjectGridOptions } from './ProjectGrid.viewmodel';
import { ProjectCard } from './ProjectCard';
import './ProjectGrid.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ProjectGridProps extends UseProjectGridOptions {
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ProjectGrid - Responsive grid of project cards
 * 
 * Features:
 * - Auto-fill responsive grid layout
 * - Project card with image, title, description
 * - Technology badges per card
 * - Loading and error states
 * - Click handlers for project and technology
 * 
 * @example
 * ```tsx
 * <ProjectGrid
 *     projects={projects}
 *     onProjectClick={(p) => navigate(`/projects/${p.id}`)}
 *     onTechnologyClick={(t) => setSelectedTech(t)}
 * />
 * ```
 */
export const ProjectGrid = memo(forwardRef<HTMLDivElement, ProjectGridProps>(
    function ProjectGrid(props, ref) {
        const { className = '', ...gridOptions } = props;

        const vm = useProjectGrid(gridOptions);

        // Loading state
        if (vm.model.isLoading) {
            return (
                <div className={`ark-project-grid ark-project-grid--loading ${className}`}>
                    <div className="ark-project-grid__spinner" />
                    <p>Loading projects...</p>
                </div>
            );
        }

        // Error state
        if (vm.model.error) {
            return (
                <div className={`ark-project-grid ark-project-grid--error ${className}`}>
                    <h3>Unable to Load Projects</h3>
                    <p>{vm.model.error}</p>
                </div>
            );
        }

        // Empty state
        if (!vm.hasProjects) {
            return (
                <div className={`ark-project-grid ark-project-grid--empty ${className}`}>
                    <p>No projects to display</p>
                </div>
            );
        }

        return (
            <div
                ref={ref}
                className={`ark-project-grid ${className}`}
                style={vm.gridStyles}
                data-testid={vm.model.testId}
            >
                {vm.model.projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        maxTechnologies={vm.model.maxTechnologies}
                        onProjectClick={vm.handleProjectClick}
                        onTechnologyClick={vm.handleTechnologyClick}
                        getTechnologyName={vm.getTechnologyName}
                    />
                ))}
            </div>
        );
    }
));

ProjectGrid.displayName = 'ProjectGrid';

export default ProjectGrid;
