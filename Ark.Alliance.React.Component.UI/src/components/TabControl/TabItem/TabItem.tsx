/**
 * @fileoverview TabItem Component
 * @module components/TabControl/TabItem
 * 
 * Individual tab item using Icon and Label primitives.
 */

import { forwardRef, memo, useMemo } from 'react';
import { Icon } from '../../Icon';
import { Label } from '../../Label';
import { useTabItem, type UseTabItemOptions } from './TabItem.viewmodel';
import './TabItem.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TabItem component props
 */
export interface TabItemProps extends UseTabItemOptions {
    /** Tab index for ARIA */
    index?: number;
    /** ARIA props from parent */
    ariaProps?: Record<string, string | boolean | number>;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TabItem Component - Individual tab using Icon and Label primitives
 */
export const TabItem = memo(forwardRef<HTMLButtonElement, TabItemProps>(
    function TabItem(props, ref) {
        const { index = 0, ariaProps = {}, ...options } = props;
        const vm = useTabItem(options);

        // Icon size based on tab size
        const iconSize = useMemo(() => {
            const sizeMap: Record<string, 'xs' | 'sm' | 'md'> = {
                xs: 'xs',
                sm: 'xs',
                md: 'sm',
                lg: 'sm',
                xl: 'md',
            };
            return sizeMap[vm.model.size] || 'sm';
        }, [vm.model.size]);

        // Badge content
        const badgeContent = vm.model.badge !== undefined && (
            <span className={`ark-tab-item__badge ark-tab-item__badge--${vm.model.badgeVariant}`}>
                {vm.model.badge}
            </span>
        );

        // Close button
        const closeButton = vm.model.closeable && (
            <button
                type="button"
                className="ark-tab-item__close"
                onClick={vm.handleClose}
                aria-label={`Close ${vm.model.label}`}
                tabIndex={-1}
            >
                <Icon name="x" size="xs" />
            </button>
        );

        return (
            <button
                ref={ref}
                type="button"
                className={vm.tabClasses}
                onClick={vm.handleClick}
                onKeyDown={vm.handleKeyDown}
                disabled={vm.model.disabled}
                title={vm.model.tooltip}
                style={vm.model.style}
                data-testid={vm.model.testId}
                {...ariaProps}
            >
                {/* Icon (left position) */}
                {vm.model.icon && vm.model.iconPosition === 'left' && (
                    <Icon
                        name={vm.model.icon}
                        size={iconSize}
                        className="ark-tab-item__icon"
                    />
                )}

                {/* Label */}
                <Label
                    text={vm.model.label}
                    size={vm.model.size}
                    className="ark-tab-item__label"
                    weight={vm.model.isActive ? 'semibold' : 'medium'}
                />

                {/* Icon (right position) */}
                {vm.model.icon && vm.model.iconPosition === 'right' && (
                    <Icon
                        name={vm.model.icon}
                        size={iconSize}
                        className="ark-tab-item__icon"
                    />
                )}

                {/* Badge */}
                {badgeContent}

                {/* Close button */}
                {closeButton}

                {/* Loading indicator */}
                {vm.model.loading && (
                    <Icon name="loader" size="xs" spin className="ark-tab-item__loader" />
                )}
            </button>
        );
    }
));

TabItem.displayName = 'TabItem';

export default TabItem;
