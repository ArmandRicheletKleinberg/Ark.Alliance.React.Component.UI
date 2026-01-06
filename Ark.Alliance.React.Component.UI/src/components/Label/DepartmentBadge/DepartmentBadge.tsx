/**
 * @fileoverview DepartmentBadge Component
 * @module components/Label/DepartmentBadge
 * 
 * Displays department with icon and styling.
 * 
 * @example
 * ```tsx
 * <DepartmentBadge department="Engineering" />
 * <DepartmentBadge department="HR" size="sm" showIcon={false} />
 * ```
 */

import { forwardRef, memo } from 'react';
import { useDepartmentBadge, type UseDepartmentBadgeOptions } from './DepartmentBadge.viewmodel';
import './DepartmentBadge.styles.css';

export interface DepartmentBadgeProps extends UseDepartmentBadgeOptions {
    className?: string;
}

export const DepartmentBadge = memo(forwardRef<HTMLSpanElement, DepartmentBadgeProps>(
    function DepartmentBadge(props, ref) {
        const { className = '', ...badgeOptions } = props;

        const vm = useDepartmentBadge(badgeOptions);

        return (
            <span
                ref={ref}
                className={`${vm.badgeClasses} ${className}`.trim()}
                data-testid={vm.model.testId || `department-badge-${vm.model.department.toLowerCase()}`}
                data-department={vm.model.department}
            >
                {vm.model.showIcon && (
                    <span className="ark-department-badge__icon" aria-hidden="true">
                        {vm.displayIcon}
                    </span>
                )}
                <span className="ark-department-badge__text">
                    {vm.model.department}
                </span>
            </span>
        );
    }
));

DepartmentBadge.displayName = 'DepartmentBadge';

export default DepartmentBadge;
