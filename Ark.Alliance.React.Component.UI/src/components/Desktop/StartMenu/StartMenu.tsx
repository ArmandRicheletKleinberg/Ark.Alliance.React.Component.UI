/**
 * @fileoverview StartMenu Component
 * @module components/Desktop/StartMenu
 * 
 * A Windows-like start menu with search and app launcher.
 */

import React, { memo, forwardRef } from 'react';
import { useStartMenu, type UseStartMenuOptions } from './StartMenu.viewmodel';
import './StartMenu.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface StartMenuProps extends UseStartMenuOptions { }

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const PowerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
        <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * StartMenu - A Windows-like start menu
 * 
 * @example
 * ```tsx
 * <StartMenu
 *   isOpen={startOpen}
 *   apps={appList}
 *   onAppClick={(id) => openApp(id)}
 *   onClose={() => setStartOpen(false)}
 * />
 * ```
 */
export const StartMenu = memo(forwardRef<HTMLDivElement, StartMenuProps>(
    (props, ref) => {
        const vm = useStartMenu(props);

        if (!vm.model.isOpen) {
            return null;
        }

        return (
            <div
                ref={ref}
                className={vm.containerClasses}
                style={vm.containerStyle}
                data-testid={vm.model.testId}
                aria-label={vm.model.ariaLabel || 'Start Menu'}
                role="menu"
            >
                {/* Sidebar */}
                <div className="ark-start-menu__sidebar">
                    {vm.model.showUserProfile && (
                        <button
                            className="ark-start-menu__sidebar-button"
                            onClick={vm.handleUserProfileClick}
                            aria-label="User Profile"
                        >
                            <UserIcon />
                        </button>
                    )}
                    <button
                        className="ark-start-menu__sidebar-button"
                        onClick={vm.handleSettingsClick}
                        aria-label="Settings"
                    >
                        <SettingsIcon />
                    </button>
                    <div className="ark-start-menu__sidebar-spacer" />
                    {vm.model.showPowerOptions && (
                        <button
                            className="ark-start-menu__sidebar-button ark-start-menu__sidebar-button--power"
                            onClick={vm.handlePowerClick}
                            aria-label="Power"
                        >
                            <PowerIcon />
                        </button>
                    )}
                </div>

                {/* Main Content */}
                <div className="ark-start-menu__content">
                    {/* Search */}
                    {vm.model.showSearch && (
                        <div className="ark-start-menu__search">
                            <input
                                type="text"
                                placeholder="Search apps..."
                                className="ark-start-menu__search-input"
                                onChange={(e) => vm.handleSearchChange(e.target.value)}
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Pinned Section */}
                    {vm.pinnedApps.length > 0 && (
                        <div className="ark-start-menu__section">
                            <div className="ark-start-menu__section-title">Pinned</div>
                        </div>
                    )}

                    {/* Apps List */}
                    <div className="ark-start-menu__apps">
                        {vm.filteredApps.map((app) => (
                            <button
                                key={app.id}
                                className="ark-start-menu__app"
                                onClick={() => vm.handleAppClick(app.id)}
                                role="menuitem"
                            >
                                <div className="ark-start-menu__app-icon">
                                    {app.icon || '📁'}
                                </div>
                                <span className="ark-start-menu__app-title">{app.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
));

StartMenu.displayName = 'StartMenu';

export default StartMenu;
