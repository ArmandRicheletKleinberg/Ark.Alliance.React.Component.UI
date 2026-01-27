/**
 * @fileoverview OrgChart Component Tests
 * @module components/TreeView/OrgChart
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { OrgChart } from '../../../Ark.Alliance.React.Component.UI/src/components/TreeView/OrgChart/OrgChart';
import { OrgChartNode } from '../../../Ark.Alliance.React.Component.UI/src/components/TreeView/OrgChart/OrgChartNode';
import type { OrgChartNodeData } from '../../../Ark.Alliance.React.Component.UI/src/components/TreeView/OrgChart/OrgChart.model';


// Mock data
const mockNode: OrgChartNodeData = {
    id: 'test-1',
    name: 'John Doe',
    position: 'CEO',
    department: 'Executive',
    email: 'john@test.com',
};

const mockOrgData: OrgChartNodeData[] = [
    {
        id: '1',
        name: 'CEO',
        position: 'Chief Executive Officer',
        department: 'Executive',
        children: [
            {
                id: '2',
                name: 'CTO',
                position: 'Chief Technology Officer',
                department: 'Engineering',
                children: [
                    { id: '4', name: 'Dev Lead', position: 'Lead Developer', department: 'Engineering' },
                ],
            },
            {
                id: '3',
                name: 'CFO',
                position: 'Chief Financial Officer',
                department: 'Finance',
            },
        ],
    },
];

describe('OrgChartNode', () => {
    describe('Rendering', () => {
        it('renders collaborator name and position', () => {
            render(<OrgChartNode node={mockNode} />);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('CEO')).toBeInTheDocument();
        });

        it('renders avatar fallback when no avatarUrl', () => {
            const { container } = render(<OrgChartNode node={mockNode} />);
            const fallback = container.querySelector('.ark-org-node__avatar-fallback');
            expect(fallback).toBeInTheDocument();
            expect(fallback?.textContent).toBe('JD');
        });

        it('renders avatar image when avatarUrl provided', () => {
            const nodeWithAvatar = { ...mockNode, avatarUrl: '/avatar.jpg' };
            const { container } = render(<OrgChartNode node={nodeWithAvatar} />);
            const img = container.querySelector('.ark-org-node__avatar');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', '/avatar.jpg');
        });

        it('has correct aria-label', () => {
            render(<OrgChartNode node={mockNode} />);
            expect(screen.getByRole('button')).toHaveAttribute(
                'aria-label',
                'John Doe, CEO, Executive'
            );
        });
    });

    describe('Interactions', () => {
        it('calls onClick when clicked', () => {
            const onClick = vi.fn();
            render(<OrgChartNode node={mockNode} onClick={onClick} />);
            fireEvent.click(screen.getByRole('button'));
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('is keyboard accessible', () => {
            const onClick = vi.fn();
            render(<OrgChartNode node={mockNode} onClick={onClick} />);
            fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
            expect(onClick).toHaveBeenCalled();
        });
    });

    describe('Styling', () => {
        it('shows selected state when isSelected is true', () => {
            render(<OrgChartNode node={mockNode} isSelected />);
            expect(screen.getByRole('button')).toHaveClass('ark-org-node--selected');
        });

        it('shows compact mode styling', () => {
            render(<OrgChartNode node={mockNode} compact />);
            expect(screen.getByRole('button')).toHaveClass('ark-org-node--compact');
        });
    });
});

describe('OrgChart', () => {
    describe('Empty state', () => {
        it('renders empty message when no nodes', () => {
            render(React.createElement(OrgChart, { rootNodes: [] }));
            expect(screen.getByText('No team members to display')).toBeInTheDocument();
        });

        it('has correct role for empty state', () => {
            render(React.createElement(OrgChart, { rootNodes: [] }));
            expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Empty organization chart');
        });
    });

    describe('Rendering', () => {
        it('renders root nodes', () => {
            render(React.createElement(OrgChart, { rootNodes: mockOrgData }));
            expect(screen.getByText('CEO')).toBeInTheDocument();
        });

        it('displays team member count', () => {
            render(React.createElement(OrgChart, { rootNodes: mockOrgData }));
            expect(screen.getByText('4 team members')).toBeInTheDocument();
        });

        it('uses totalCount when provided', () => {
            render(React.createElement(OrgChart, { rootNodes: mockOrgData, totalCount: 10 }));
            expect(screen.getByText('10 team members')).toBeInTheDocument();
        });

        it('has correct aria-label with organization name', () => {
            render(React.createElement(OrgChart, { rootNodes: mockOrgData, organizationName: 'M2H' }));
            expect(screen.getByRole('tree')).toHaveAttribute('aria-label', 'Organization chart for M2H');
        });
    });

    describe('Interactions', () => {
        it('calls onNodeClick with node id', () => {
            const onNodeClick = vi.fn();
            render(React.createElement(OrgChart, { rootNodes: mockOrgData, onNodeClick }));

            fireEvent.click(screen.getByText('CEO'));
            expect(onNodeClick).toHaveBeenCalledWith('1');
        });
    });
});

