/**
 * @fileoverview Enhanced Header Component View
 * @module components/Header
 */

import { forwardRef, memo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useHeader, type UseHeaderOptions } from './Header.viewmodel';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { Button } from '../Buttons/Button';
import './Header.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface HeaderProps extends UseHeaderOptions {
    /** Action buttons/content on the right */
    actions?: ReactNode;
    /** Additional content before title */
    prefix?: ReactNode;
    /** Additional content after title group */
    suffix?: ReactNode;
    /** Status indicator element (e.g. connection status) */
    statusIndicator?: ReactNode;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Breadcrumbs = memo(function Breadcrumbs({ items }: { items: NonNullable<UseHeaderOptions['breadcrumbs']> }) {
    if (!items || items.length === 0) return null;

    return (
        <nav className="ark-header__breadcrumbs" aria-label="Breadcrumb">
            {items.map((item, index) => (
                <div key={item.key} className="ark-breadcrumb-item-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {index > 0 && <span className="ark-breadcrumb-separator">/</span>}
                    <a
                        href={item.href || '#'}
                        className={`ark-breadcrumb-item ${item.active ? 'ark-breadcrumb-item--active' : ''}`}
                        aria-current={item.active ? 'page' : undefined}
                        onClick={e => (!item.href || item.active) && e.preventDefault()}
                    >
                        {item.icon && <Icon name={item.icon} size="sm" />}
                        {item.label}
                    </a>
                </div>
            ))}
        </nav>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Header = memo(forwardRef<HTMLElement, HeaderProps>(
    function Header(props, ref) {
        const { actions, prefix, suffix, statusIndicator, className = '', ...headerOptions } = props;
        const vm = useHeader(headerOptions);

        const showLeftIcon = vm.model.icon && vm.model.iconPosition === 'left';
        const showRightIcon = vm.model.icon && vm.model.iconPosition === 'right';

        // Mobile Drawer Content
        const drawerContent = (
            <>
                <div
                    className={`ark-header__drawer-backdrop ${vm.isMobileDrawerOpen ? 'ark-header__drawer-backdrop--open' : ''}`}
                    onClick={vm.closeMobileDrawer}
                />
                <div className={`ark-header__drawer ${vm.isMobileDrawerOpen ? 'ark-header__drawer--open' : ''}`}>
                    <div className="ark-header__drawer-header">
                        <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>Menu</span>
                        <Button
                            iconLeft="x"
                            variant="ghost"
                            size="sm"
                            onClick={vm.closeMobileDrawer}
                        />
                    </div>
                    <div className="ark-header__drawer-content">
                        {/* Drawer content (navigation, etc) would be passed here or configured via model */}
                        {/* For now, replicating actions and search for mobile access */}
                        {vm.model.showSearch && (
                            <div style={{ marginBottom: '1rem' }}>
                                <Input
                                    value={vm.searchValue}
                                    onChange={vm.handleSearchChange}
                                    placeholder={vm.model.searchPlaceholder}
                                    type="text"
                                    variant="filled"
                                    iconLeft="search"
                                    fullWidth
                                />
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {/* In a real app, this would be navigation links. 
                                Since 'actions' is ReactNode, we can't easily clone it into a vertical list properly without assumptions.
                                We'll render a placeholder or explicit mobile content if added to model.
                            */}
                        </div>
                    </div>
                </div>
            </>
        );

        return (
            <header
                ref={ref}
                className={`${vm.headerClasses} ${className}`}
                style={vm.backgroundStyles}
                data-testid={vm.model.testId}
            >
                {/* Background overlay */}
                {vm.model.background?.overlay && (
                    <div
                        className="ark-header__overlay"
                        style={{
                            backgroundColor: vm.model.background.overlayColor,
                            opacity: (vm.model.background.overlayOpacity ?? 50) / 100,
                        }}
                    />
                )}

                {/* Content container */}
                <div className="ark-header__content">
                    {/* Mobile Toggle */}
                    {vm.model.mobile?.enabled && (
                        <button
                            className="ark-header__mobile-toggle"
                            onClick={vm.toggleMobileDrawer}
                            aria-label="Open menu"
                        >
                            <Icon name="menu" size="md" />
                        </button>
                    )}

                    {/* Left section */}
                    <div className="ark-header__left">
                        {prefix}

                        {/* Main Icon */}
                        {showLeftIcon && (
                            <div className="ark-header__icon">
                                <Icon name={vm.model.icon!} size={vm.model.iconSize} />
                            </div>
                        )}

                        <div className="ark-header__title-group">
                            {/* Breadcrumbs (replace title if present, or sit above it?) 
                                V2 design typically puts breadcrumbs above title or replaces it. 
                                Implementation Plan says "add breadcrumb integration".
                                Let's render breadcrumbs IF present.
                            */}
                            {vm.model.breadcrumbs && vm.model.breadcrumbs.length > 0 ? (
                                <Breadcrumbs items={vm.model.breadcrumbs} />
                            ) : null}

                            {/* Title */}
                            {vm.model.title && (
                                <h2 className="ark-header__title" style={vm.titleStyles}>
                                    {vm.model.title}
                                </h2>
                            )}

                            {vm.model.subtitle && (
                                <p className="ark-header__subtitle" style={vm.subtitleStyles}>
                                    {vm.model.subtitle}
                                </p>
                            )}
                            {vm.model.description && (
                                <p className="ark-header__description">
                                    {vm.model.description}
                                </p>
                            )}
                        </div>

                        {showRightIcon && (
                            <div className="ark-header__icon">
                                <Icon name={vm.model.icon!} size={vm.model.iconSize} />
                            </div>
                        )}
                        {suffix}
                    </div>

                    {/* Right section */}
                    <div className="ark-header__right">
                        {/* Search */}
                        {vm.model.showSearch && (
                            <div className="ark-header__search-container">
                                <Input
                                    value={vm.searchValue}
                                    onChange={vm.handleSearchChange}
                                    placeholder={vm.model.searchPlaceholder}
                                    type="text"
                                    variant="filled" // Use filled or outline based on header variant? 'filled' usually looks good in headers
                                    size="sm"
                                    iconLeft="search"
                                    className="ark-header__search-input-component"
                                />
                            </div>
                        )}

                        {/* Status Indicator Slot */}
                        {statusIndicator && (
                            <div className="ark-header__status">
                                {statusIndicator}
                            </div>
                        )}

                        {actions && <div className="ark-header__actions">{actions}</div>}
                    </div>
                </div>

                {/* Mobile Drawer Portal */}
                {vm.model.mobile?.enabled && createPortal(drawerContent, document.body)}
            </header>
        );
    }
));

Header.displayName = 'Header';

export default Header;
