/**
 * @fileoverview Project Grid Wrapper
 * @module infrastructure/wrappers/ProjectGridWrapper
 */

import React, { useMemo } from 'react';
import { ProjectGrid } from 'ark-alliance-react-ui';
import { generateGridData } from '@/Helpers/gridDataGenerator';

interface ProjectGridWrapperProps {
    count?: number;
    title?: string;
    description?: string;
    // Pass-through props that might be controlled
    [key: string]: any;
}

export const ProjectGridWrapper: React.FC<ProjectGridWrapperProps> = ({
    count = 6,
    title = "My Projects",
    description,
    ...props
}) => {
    // Generate data based on count prop (which can be controlled via JSON/UI)
    const projects = useMemo(() => generateGridData(Number(count) || 6), [count]);

    return (
        <div className="w-full h-full p-4 overflow-auto">
            {(title || description) && (
                <div className="mb-6">
                    {title && <h3 className="text-xl font-bold text-ark-text-primary mb-1">{title}</h3>}
                    {description && <p className="text-sm text-ark-text-secondary">{description}</p>}
                </div>
            )}
            <ProjectGrid
                projects={projects}
                {...props}
            />
        </div>
    );
};
