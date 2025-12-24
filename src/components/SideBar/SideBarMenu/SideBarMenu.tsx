/**
 * @fileoverview SideBarMenu Component View
 * @module components/SideBar/SideBarMenu
 * 
 * Collapsible sidebar menu with hamburger toggle and category grouping.
 */

import { forwardRef, memo } from 'react';
import { useSideBarMenu, type UseSideBarMenuOptions } from './SideBarMenu.viewmodel';
import type { MenuItem, MenuCategory } from './SideBarMenu.model';
import './SideBarMenu.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SideBarMenuProps extends UseSideBarMenuOptions {
    /** Additional class name */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// HAMBURGER BUTTON
// ═══════════════════════════════════════════════════════════════════════════

interface HamburgerButtonProps {
    isOpen: boolean;
    onClick: () => void;
    isDark: boolean;
}

function HamburgerButton({ isOpen, onClick, isDark }: HamburgerButtonProps) {
    return (
        <button
            className={`ark-hamburger ${isOpen ? 'ark-hamburger--open' : ''} ${isDark ? 'ark-hamburger--dark' : ''}`}
            onClick={onClick}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
        >
            <span className="ark-hamburger__line" />
            <span className="ark-hamburger__line" />
            <span className="ark-hamburger__line" />
        </button>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MENU ITEM
// ═══════════════════════════════════════════════════════════════════════════

interface MenuItemViewProps {
    item: MenuItem;
    isActive: boolean;
    isCollapsed: boolean;
    onSelect: (key: string, item: MenuItem) => void;
    depth: number;
}

function MenuItemView({ item, isActive, isCollapsed, onSelect, depth }: MenuItemViewProps) {
    return (
        <button
            className={`ark-sidebar__item ${isActive ? 'ark-sidebar__item--active' : ''} ${item.disabled ? 'ark-sidebar__item--disabled' : ''}`}
            onClick={() => onSelect(item.key, item)}
            disabled={item.disabled}
            style={{ paddingLeft: isCollapsed ? 16 : 16 + depth * 16 }}
            title={isCollapsed ? item.label : undefined}
        >
            {item.icon && <span className="ark-sidebar__item-icon">{item.icon}</span>}
            {!isCollapsed && (
                <>
                    <span className="ark-sidebar__item-label">{item.label}</span>
                    {item.badge !== undefined && (
                        <span className="ark-sidebar__item-badge">{item.badge}</span>
                    )}
                </>
            )}
        </button>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SideBarMenu - Collapsible sidebar with hamburger toggle
 * 
 * Features:
 * - Hamburger button toggle
 * - Category grouping with expand/collapse
 * - Multiple visual variants (default, minimal, neon, glass)
 * - Dark/light theme support
 * - Active item highlighting
 * - Badge support
 * 
 * @example
 * ```tsx
 * const categories = [
 *   { name: 'Form', icon: '📝', items: [
 *     { key: 'input', label: 'Input', icon: '✏️' },
 *     { key: 'panel', label: 'Panel', icon: '📋' },
 *   ]},
 *   { name: 'Charts', icon: '📊', items: [...] },
 * ];
 * 
 * <SideBarMenu
 *   categories={categories}
 *   onSelect={(key) => setActiveComponent(key)}
 *   variant="neon"
 * />
 * ```
 */
export const SideBarMenu = memo(forwardRef<HTMLElement, SideBarMenuProps>(
    function SideBarMenu(props, ref) {
        const { className = '', ...options } = props;
        const vm = useSideBarMenu(options);

        return (
            <aside
                ref={ref}
                className={`ark-sidebar ${vm.variantClass} ${vm.isCollapsed ? 'ark-sidebar--collapsed' : ''} ${className}`}
                style={vm.sidebarStyles}
                data-testid={vm.model.testId}
            >
                {/* Header with hamburger */}
                <div className="ark-sidebar__header">
                    {vm.model.showHamburger && (
                        <HamburgerButton
                            isOpen={!vm.isCollapsed}
                            onClick={vm.toggleCollapse}
                            isDark={vm.model.isDark}
                        />
                    )}
                    {!vm.isCollapsed && vm.model.title && (
                        <h1 className="ark-sidebar__title">{vm.model.title}</h1>
                    )}
                </div>

                {/* Navigation */}
                <nav className="ark-sidebar__nav">
                    {vm.model.categories.map((category: MenuCategory) => (
                        <div key={category.name} className="ark-sidebar__category">
                            <button
                                className="ark-sidebar__category-btn"
                                onClick={() => vm.toggleCategory(category.name)}
                                title={vm.isCollapsed ? category.name : undefined}
                            >
                                <span className="ark-sidebar__category-icon">{category.icon}</span>
                                {!vm.isCollapsed && (
                                    <>
                                        <span className="ark-sidebar__category-name">{category.name}</span>
                                        <span className="ark-sidebar__category-arrow">
                                            {vm.expandedCategories[category.name] ? '▼' : '▶'}
                                        </span>
                                    </>
                                )}
                            </button>

                            {(vm.expandedCategories[category.name] || vm.isCollapsed) && (
                                <div className="ark-sidebar__items">
                                    {category.items.map((item: MenuItem) => (
                                        <MenuItemView
                                            key={item.key}
                                            item={item}
                                            isActive={vm.activeKey === item.key}
                                            isCollapsed={vm.isCollapsed}
                                            onSelect={vm.handleItemClick}
                                            depth={0}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>
        );
    }
));

SideBarMenu.displayName = 'SideBarMenu';

export default SideBarMenu;
