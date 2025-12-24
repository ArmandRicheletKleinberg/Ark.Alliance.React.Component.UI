/**
 * @fileoverview Enhanced Header Component View
 * @module components/Header
 */

import { forwardRef, memo, type ReactNode } from 'react';
import { useHeader, type UseHeaderOptions } from './Header.viewmodel';
import './Header.styles.css';

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
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface HeaderIconProps {
    icon: string;
    size: number;
    position: 'left' | 'right';
}

const HeaderIcon = memo(function HeaderIcon({ icon, size, position }: HeaderIconProps) {
    const isEmoji = /\p{Emoji}/u.test(icon);
    const isUrl = icon.startsWith('http') || icon.startsWith('/');

    return (
        <div
            className={`ark-header__icon ark-header__icon--${position}`}
            style={{ width: size, height: size, fontSize: size * 0.8 }}
        >
            {isUrl ? (
                <img src={icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : isEmoji ? (
                <span>{icon}</span>
            ) : (
                <span className="ark-header__icon-text">{icon}</span>
            )}
        </div>
    );
});

interface HeaderSearchProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

const HeaderSearch = memo(function HeaderSearch({ value, onChange, placeholder }: HeaderSearchProps) {
    return (
        <div className="ark-header__search">
            <span className="ark-header__search-icon">🔍</span>
            <input
                type="text"
                className="ark-header__search-input"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                aria-label="Search"
            />
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Header = memo(forwardRef<HTMLElement, HeaderProps>(
    function Header(props, ref) {
        const { actions, prefix, suffix, className = '', ...headerOptions } = props;
        const vm = useHeader(headerOptions);

        const showLeftIcon = vm.model.icon && vm.model.iconPosition === 'left';
        const showRightIcon = vm.model.icon && vm.model.iconPosition === 'right';

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
                            opacity: vm.model.background.overlayOpacity / 100,
                        }}
                    />
                )}

                {/* Content container */}
                <div className="ark-header__content">
                    {/* Left section */}
                    <div className="ark-header__left">
                        {prefix}
                        {showLeftIcon && (
                            <HeaderIcon
                                icon={vm.model.icon!}
                                size={vm.iconSizePx}
                                position="left"
                            />
                        )}
                        <div className="ark-header__title-group">
                            <h2 className="ark-header__title" style={vm.titleStyles}>
                                {vm.model.title}
                            </h2>
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
                            <HeaderIcon
                                icon={vm.model.icon!}
                                size={vm.iconSizePx}
                                position="right"
                            />
                        )}
                        {suffix}
                    </div>

                    {/* Right section */}
                    <div className="ark-header__right">
                        {vm.model.showSearch && (
                            <HeaderSearch
                                value={vm.searchValue}
                                onChange={vm.handleSearchChange}
                                placeholder={vm.model.searchPlaceholder}
                            />
                        )}
                        {actions && <div className="ark-header__actions">{actions}</div>}
                    </div>
                </div>
            </header>
        );
    }
));

Header.displayName = 'Header';

export default Header;
