/**
 * @fileoverview ProjectCard Component
 * @module components/Grids/ProjectGrid
 * 
 * Individual project card for the grid.
 */

import { memo } from 'react';
import type { ProjectItem } from './ProjectGrid.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ProjectCardProps {
    /** Project data */
    project: ProjectItem;
    /** Max technologies to show */
    maxTechnologies: number;
    /** Click handler */
    onProjectClick?: (project: ProjectItem) => void;
    /** Technology click handler */
    onTechnologyClick?: (techKey: string) => void;
    /** Get technology name helper */
    getTechnologyName: (tech: string | { name: string }) => string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ProjectCard - Individual project card
 */
export const ProjectCard = memo(function ProjectCard(props: ProjectCardProps) {
    const {
        project,
        maxTechnologies,
        onProjectClick,
        onTechnologyClick,
        getTechnologyName,
    } = props;

    const visibleTechs = project.technologies.slice(0, maxTechnologies);
    const remainingCount = project.technologies.length - maxTechnologies;

    return (
        <div className="ark-project-card">
            {/* Image Section */}
            <div className="ark-project-card__image-container">
                {project.imageUrl ? (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="ark-project-card__image"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="ark-project-card__placeholder">
                        <span>NO IMAGE</span>
                    </div>
                )}
                <div className="ark-project-card__overlay" />
            </div>

            {/* Content */}
            <div className="ark-project-card__content">
                {/* Header */}
                <div className="ark-project-card__header">
                    <div>
                        <h3
                            className="ark-project-card__title"
                            onClick={() => onProjectClick?.(project)}
                        >
                            {project.title}
                            {onProjectClick && (
                                <svg
                                    className="ark-project-card__link-icon"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            )}
                        </h3>
                        <span className="ark-project-card__status">{project.status}</span>
                    </div>

                    {/* Actions */}
                    <div className="ark-project-card__actions">
                        {project.repoUrl && (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ark-project-card__action-btn"
                                title="View Repository"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>

                {/* Description */}
                <p className="ark-project-card__description">{project.description}</p>

                {/* Technologies */}
                <div className="ark-project-card__footer">
                    <p className="ark-project-card__tech-label">TECHNOLOGIES</p>
                    <div className="ark-project-card__tech-list">
                        {visibleTechs.map((tech, idx) => {
                            const techName = getTechnologyName(tech);
                            return (
                                <span
                                    key={techName || idx}
                                    className="ark-project-card__tech-badge"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTechnologyClick?.(techName);
                                    }}
                                >
                                    {techName}
                                </span>
                            );
                        })}
                        {remainingCount > 0 && (
                            <span className="ark-project-card__tech-more">+{remainingCount}</span>
                        )}
                    </div>
                </div>

                {/* CTA */}
                {onProjectClick && (
                    <div
                        className="ark-project-card__cta"
                        onClick={() => onProjectClick(project)}
                    >
                        <span className="ark-project-card__cta-text">
                            View Details
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
