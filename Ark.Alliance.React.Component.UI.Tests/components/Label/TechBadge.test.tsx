/**
 * @fileoverview TechBadge Component Unit Tests
 * @module tests/components/Label/TechBadge
 * 
 * Tests TechBadge and BadgeDetailModal components with real technology mock data
 * from Ark.Portfolio technologies.json
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real components
import {
    TechBadge,
    TechBadgeModelSchema,
    BadgeDetailModal,
    BadgeDetailModalModelSchema,
    type TechnologyData,
    type BadgeDetailData,
} from '@components/Label';

// Import mock data from scenario file
import techBadgeScenarios from '../../fixtures/data/scenarios/tech-badge-scenarios.json';

// ═══════════════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════════════

// Get technologies from mock data
const mockTechnologies = techBadgeScenarios.technologies as TechnologyData[];

// Helper to get a specific technology
function getTechnology(key: string): TechnologyData | undefined {
    return mockTechnologies.find(t => t.key === key);
}

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    cleanup();
});

// ═══════════════════════════════════════════════════════════════════════════
// TECH BADGE COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('TechBadge Component', () => {
    describe('TECH-001: Render with Technology Data', () => {
        it('should render badge with technology name', () => {
            const react = getTechnology('react')!;

            const { container } = render(
                React.createElement(TechBadge, {
                    techKey: 'react',
                    technology: react,
                })
            );

            const badge = container.querySelector('.ark-tech-badge');
            expect(badge).not.toBeNull();
            expect(badge?.textContent).toContain('React');
        });

        it('should display icon when showIcon is true', () => {
            const react = getTechnology('react')!;

            const { container } = render(
                React.createElement(TechBadge, {
                    techKey: 'react',
                    technology: react,
                    showIcon: true,
                })
            );

            const icon = container.querySelector('i');
            expect(icon).not.toBeNull();
            expect(icon?.className).toContain('fa-react');
        });

        it('should not display icon when showIcon is false', () => {
            const react = getTechnology('react')!;

            const { container } = render(
                React.createElement(TechBadge, {
                    techKey: 'react',
                    technology: react,
                    showIcon: false,
                })
            );

            const icon = container.querySelector('i');
            expect(icon).toBeNull();
        });
    });

    describe('TECH-002: Click Handler', () => {
        it('should call onClick when clicked with technology data', async () => {
            const typescript = getTechnology('typescript')!;
            const onClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(TechBadge, {
                    techKey: 'typescript',
                    technology: typescript,
                    onClick,
                })
            );

            const badge = container.querySelector('.ark-tech-badge')!;
            await user.click(badge);

            expect(onClick).toHaveBeenCalledTimes(1);
            // Check that onClick was called with technology containing expected properties
            expect(onClick).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: 'typescript',
                    name: 'TypeScript',
                    color: '#3178C6',
                })
            );
        });

        it('should have clickable class when onClick is provided', () => {
            const typescript = getTechnology('typescript')!;

            const { container } = render(
                React.createElement(TechBadge, {
                    techKey: 'typescript',
                    technology: typescript,
                    onClick: vi.fn(),
                })
            );

            const badge = container.querySelector('.ark-tech-badge');
            expect(badge?.className).toContain('ark-tech-badge--clickable');
        });
    });

    describe('TECH-003: Size Variants', () => {
        const sizes = ['sm', 'md', 'lg'] as const;

        sizes.forEach(size => {
            it(`should render with ${size} size`, () => {
                const nodejs = getTechnology('nodejs')!;

                const { container } = render(
                    React.createElement(TechBadge, {
                        techKey: 'nodejs',
                        technology: nodejs,
                        size,
                    })
                );

                const badge = container.querySelector('.ark-tech-badge');
                expect(badge).not.toBeNull();
            });
        });
    });

    describe('Active State', () => {
        it('should apply active class when active is true', () => {
            const docker = getTechnology('docker')!;

            const { container } = render(
                React.createElement(TechBadge, {
                    techKey: 'docker',
                    technology: docker,
                    active: true,
                })
            );

            const badge = container.querySelector('.ark-tech-badge');
            expect(badge?.className).toContain('ark-tech-badge--active');
        });
    });

    describe('Technology Categories', () => {
        it('should render frontend technology (React)', () => {
            const react = getTechnology('react')!;
            expect(react.category).toBe('frontend');

            const { container } = render(
                React.createElement(TechBadge, {
                    techKey: 'react',
                    technology: react,
                })
            );

            expect(container.textContent).toContain('React');
        });

        it('should render language technology (C#)', () => {
            const csharp = getTechnology('csharp')!;
            expect(csharp.category).toBe('languages');

            const { container } = render(
                React.createElement(TechBadge, {
                    techKey: 'csharp',
                    technology: csharp,
                })
            );

            expect(container.textContent).toContain('C#');
        });

        it('should render cloud technology (AWS)', () => {
            const aws = getTechnology('aws')!;
            expect(aws.category).toBe('cloud');

            const { container } = render(
                React.createElement(TechBadge, {
                    techKey: 'aws',
                    technology: aws,
                })
            );

            expect(container.textContent).toContain('AWS');
        });

        it('should render database technology (PostgreSQL)', () => {
            const postgresql = getTechnology('postgresql')!;
            expect(postgresql.category).toBe('databases');

            const { container } = render(
                React.createElement(TechBadge, {
                    techKey: 'postgresql',
                    technology: postgresql,
                })
            );

            expect(container.textContent).toContain('PostgreSQL');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// TECH BADGE MODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('TechBadgeModelSchema', () => {
    it('should parse valid badge model', () => {
        const result = TechBadgeModelSchema.parse({
            techKey: 'react',
        });

        expect(result.techKey).toBe('react');
        expect(result.size).toBe('md'); // default
        expect(result.showIcon).toBe(false); // default
    });

    it('should accept all size variants', () => {
        const sizes = ['sm', 'md', 'lg'];
        sizes.forEach(size => {
            const result = TechBadgeModelSchema.parse({ techKey: 'test', size });
            expect(result.size).toBe(size);
        });
    });

    it('should accept technology data', () => {
        const react = getTechnology('react')!;
        const result = TechBadgeModelSchema.parse({
            techKey: 'react',
            technology: react,
        });

        expect(result.technology?.name).toBe('React');
        expect(result.technology?.color).toBe('#61DAFB');
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// BADGE DETAIL MODAL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('BadgeDetailModal Component', () => {
    describe('TECH-004: Modal Open', () => {
        it('should render when isOpen is true with technology data', () => {
            const docker = getTechnology('docker')!;
            const detailData: BadgeDetailData = {
                name: docker.name,
                category: docker.category,
                description: docker.description,
                icon: docker.icon,
                color: docker.color,
                links: docker.website ? [{ label: 'Website', url: docker.website }] : undefined,
            };

            const { container } = render(
                React.createElement(BadgeDetailModal, {
                    isOpen: true,
                    data: detailData,
                    onClose: vi.fn(),
                })
            );

            const modal = container.querySelector('.ark-badge-modal__overlay');
            expect(modal).not.toBeNull();

            // Check content
            expect(container.textContent).toContain('Docker');
            expect(container.textContent).toContain('devops');
        });

        it('should not render when isOpen is false', () => {
            const { container } = render(
                React.createElement(BadgeDetailModal, {
                    isOpen: false,
                    data: { name: 'Test', color: '#000' },
                    onClose: vi.fn(),
                })
            );

            const modal = container.querySelector('.ark-badge-modal__overlay');
            expect(modal).toBeNull();
        });
    });

    describe('TECH-005: Modal Close on Escape', () => {
        it('should call onClose when Escape key is pressed', () => {
            const onClose = vi.fn();
            const kubernetes = getTechnology('kubernetes')!;

            render(
                React.createElement(BadgeDetailModal, {
                    isOpen: true,
                    data: {
                        name: kubernetes.name,
                        description: kubernetes.description,
                        color: kubernetes.color,
                    },
                    onClose,
                    closeOnEscape: true,
                })
            );

            fireEvent.keyDown(document, { key: 'Escape' });
            expect(onClose).toHaveBeenCalled();
        });
    });

    describe('Modal Close on Overlay Click', () => {
        it('should call onClose when overlay is clicked', async () => {
            const onClose = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(BadgeDetailModal, {
                    isOpen: true,
                    data: { name: 'Test', color: '#000' },
                    onClose,
                    closeOnOverlayClick: true,
                })
            );

            const overlay = container.querySelector('.ark-badge-modal__overlay');
            await user.click(overlay!);

            expect(onClose).toHaveBeenCalled();
        });

        it('should not close when content is clicked', async () => {
            const onClose = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(BadgeDetailModal, {
                    isOpen: true,
                    data: { name: 'Test', color: '#000' },
                    onClose,
                })
            );

            const content = container.querySelector('.ark-badge-modal__content');
            await user.click(content!);

            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('Modal Content Display', () => {
        it('should display technology with versions', () => {
            const dotnet = getTechnology('dotnet')!;

            const { container } = render(
                React.createElement(BadgeDetailModal, {
                    isOpen: true,
                    data: {
                        name: dotnet.name,
                        description: dotnet.description,
                        color: dotnet.color,
                        version: dotnet.versions?.[dotnet.versions.length - 1],
                    },
                    onClose: vi.fn(),
                })
            );

            expect(container.textContent).toContain('.NET');
        });

        it('should display website link', () => {
            const python = getTechnology('python')!;

            const { container } = render(
                React.createElement(BadgeDetailModal, {
                    isOpen: true,
                    data: {
                        name: python.name,
                        description: python.description,
                        color: python.color,
                        links: [{ label: 'Official Website', url: python.website! }],
                    },
                    onClose: vi.fn(),
                })
            );

            const link = container.querySelector('.ark-badge-modal__link');
            expect(link).not.toBeNull();
            expect(link?.getAttribute('href')).toBe('https://www.python.org');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// BADGE DETAIL MODAL MODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('BadgeDetailModalModelSchema', () => {
    it('should parse valid modal model', () => {
        const result = BadgeDetailModalModelSchema.parse({
            isOpen: true,
            data: { name: 'React', color: '#61DAFB' },
        });

        expect(result.isOpen).toBe(true);
        expect(result.data?.name).toBe('React');
    });

    it('should use defaults for boolean options', () => {
        const result = BadgeDetailModalModelSchema.parse({});

        expect(result.isOpen).toBe(false);
        expect(result.showBackdrop).toBe(true);
        expect(result.closeOnOverlayClick).toBe(true);
        expect(result.closeOnEscape).toBe(true);
    });

    it('should accept complete badge detail data', () => {
        const aws = getTechnology('aws')!;

        const result = BadgeDetailModalModelSchema.parse({
            isOpen: true,
            data: {
                name: aws.name,
                category: aws.category,
                description: aws.description,
                icon: aws.icon,
                color: aws.color,
                links: [{ label: 'Website', url: aws.website }],
            },
        });

        expect(result.data?.name).toBe('AWS');
        expect(result.data?.category).toBe('cloud');
        expect(result.data?.links?.[0].url).toBe('https://aws.amazon.com');
    });
});
