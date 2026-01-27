/**
 * @fileoverview DepartmentBadge Component Tests
 * @module components/Label/DepartmentBadge
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DepartmentBadge } from '../../../Ark.Alliance.React.Component.UI/src/components/Label/DepartmentBadge/DepartmentBadge';
import { DEPARTMENT_ICONS } from '../../../Ark.Alliance.React.Component.UI/src/components/Label/DepartmentBadge/DepartmentBadge.model';


describe('DepartmentBadge', () => {
    describe('Rendering', () => {
        it('renders department name correctly', () => {
            render(<DepartmentBadge department="Engineering" />);
            expect(screen.getByText('Engineering')).toBeInTheDocument();
        });

        it('renders icon for known departments', () => {
            const { container } = render(<DepartmentBadge department="Engineering" />);
            const icon = container.querySelector('.ark-department-badge__icon');
            expect(icon?.textContent).toBe(DEPARTMENT_ICONS['Engineering']);
        });

        it('renders default icon for unknown departments', () => {
            const { container } = render(<DepartmentBadge department="Custom" />);
            const icon = container.querySelector('.ark-department-badge__icon');
            expect(icon?.textContent).toBe('🏢');
        });

        it('hides icon when showIcon is false', () => {
            const { container } = render(<DepartmentBadge department="Engineering" showIcon={false} />);
            const icon = container.querySelector('.ark-department-badge__icon');
            expect(icon).not.toBeInTheDocument();
        });

        it('has correct data-department attribute', () => {
            const { container } = render(<DepartmentBadge department="HR" />);
            expect(container.firstChild).toHaveAttribute('data-department', 'HR');
        });
    });

    describe('Styling', () => {
        it('applies size classes correctly', () => {
            const { rerender, container } = render(<DepartmentBadge department="Sales" size="sm" />);
            expect(container.firstChild).toHaveClass('ark-department-badge--sm');

            rerender(<DepartmentBadge department="Sales" size="lg" />);
            expect(container.firstChild).toHaveClass('ark-department-badge--lg');
        });

        it('applies custom className', () => {
            const { container } = render(<DepartmentBadge department="Design" className="my-class" />);
            expect(container.firstChild).toHaveClass('my-class');
        });
    });

    describe('Known Departments', () => {
        const knownDepartments = Object.keys(DEPARTMENT_ICONS);

        knownDepartments.forEach(dept => {
            it(`renders ${dept} with correct icon`, () => {
                const { container } = render(<DepartmentBadge department={dept} />);
                const icon = container.querySelector('.ark-department-badge__icon');
                expect(icon?.textContent).toBe(DEPARTMENT_ICONS[dept]);
            });
        });
    });
});
