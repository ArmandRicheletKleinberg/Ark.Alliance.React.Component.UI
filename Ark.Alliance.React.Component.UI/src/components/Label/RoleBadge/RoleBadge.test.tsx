/**
 * @fileoverview RoleBadge Component Tests
 * @module components/Label/RoleBadge
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoleBadge } from './RoleBadge';
import { ROLE_CONFIG, ROLES } from './RoleBadge.model';

describe('RoleBadge', () => {
    describe('Rendering', () => {
        it('renders role label correctly', () => {
            render(<RoleBadge role="admin" />);
            expect(screen.getByText('Admin')).toBeInTheDocument();
        });

        it('renders all role types', () => {
            ROLES.forEach(role => {
                const { unmount } = render(<RoleBadge role={role} />);
                expect(screen.getByText(ROLE_CONFIG[role].label)).toBeInTheDocument();
                unmount();
            });
        });

        it('has correct data-role attribute', () => {
            render(<RoleBadge role="supervisor" />);
            expect(screen.getByRole('status')).toHaveAttribute('data-role', 'supervisor');
        });

        it('has correct aria-label', () => {
            render(<RoleBadge role="collaborator" />);
            expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Role: Collaborator');
        });
    });

    describe('Styling', () => {
        it('applies correct color for admin role', () => {
            render(<RoleBadge role="admin" />);
            const badge = screen.getByRole('status');
            expect(badge).toHaveStyle({ color: ROLE_CONFIG.admin.text });
        });

        it('applies size classes correctly', () => {
            const { rerender } = render(<RoleBadge role="member" size="sm" />);
            expect(screen.getByRole('status')).toHaveClass('ark-role-badge--sm');

            rerender(<RoleBadge role="member" size="lg" />);
            expect(screen.getByRole('status')).toHaveClass('ark-role-badge--lg');
        });

        it('applies custom className', () => {
            render(<RoleBadge role="guest" className="my-custom-class" />);
            expect(screen.getByRole('status')).toHaveClass('my-custom-class');
        });
    });

    describe('Remove functionality', () => {
        it('does not show remove button by default', () => {
            render(<RoleBadge role="admin" />);
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        it('shows remove button when removable=true', () => {
            render(<RoleBadge role="admin" removable onRemove={() => { }} />);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('calls onRemove when remove button clicked', () => {
            const onRemove = vi.fn();
            render(<RoleBadge role="admin" removable onRemove={onRemove} />);

            fireEvent.click(screen.getByRole('button'));
            expect(onRemove).toHaveBeenCalledTimes(1);
        });

        it('stops event propagation when remove clicked', () => {
            const onRemove = vi.fn();
            const onParentClick = vi.fn();

            render(
                <div onClick={onParentClick}>
                    <RoleBadge role="admin" removable onRemove={onRemove} />
                </div>
            );

            fireEvent.click(screen.getByRole('button'));
            expect(onRemove).toHaveBeenCalled();
            expect(onParentClick).not.toHaveBeenCalled();
        });

        it('has accessible remove button', () => {
            render(<RoleBadge role="supervisor" removable onRemove={() => { }} />);
            expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Remove Supervisor role');
        });
    });

    describe('Ref forwarding', () => {
        it('forwards ref to span element', () => {
            const ref = vi.fn();
            render(<RoleBadge role="member" ref={ref} />);
            expect(ref).toHaveBeenCalled();
        });
    });
});
