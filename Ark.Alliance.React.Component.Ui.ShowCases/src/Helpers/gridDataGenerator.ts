/**
 * @fileoverview Grid Data Generator Helper
 * @module Helpers/gridDataGenerator
 */

export interface ProjectData {
    id: string;
    title: string;
    description: string;
    technologies: (string | { name: string; category?: string })[];
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'ARCHIVED';
    isFeatured: boolean;
    updatedAt: string;
    imageUrl?: string;
    repoUrl?: string;
    demoUrl?: string;
}

export const generateGridData = (count: number = 6): ProjectData[] => {
    const statuses: ProjectData['status'][] = ['IN_PROGRESS', 'COMPLETED', 'PLANNED', 'ON_HOLD', 'ARCHIVED'];

    return Array.from({ length: count }).map((_, i) => ({
        id: `proj-${i + 1}`,
        title: `Project Alpha ${i + 1}`,
        description: `This is a sample project description for project ${i + 1}.`,
        technologies: ['React', 'TypeScript', 'Tailwind'].slice(0, (i % 3) + 1),
        status: statuses[i % 5],
        isFeatured: i % 2 === 0,
        updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));
};
