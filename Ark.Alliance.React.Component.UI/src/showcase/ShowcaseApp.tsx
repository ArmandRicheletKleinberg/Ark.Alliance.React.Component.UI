/**
 * @fileoverview Component Showcase Dashboard - Refactored Edition
 * @module showcase
 * 
 * Main application entry point for the component library showcase.
 * Uses modular page architecture with shared base components.
 * 
 * Architecture:
 * - ShowcaseApp: Main layout with header and sidebar
 * - HomePage: Welcome page with MVVM overview
 * - FamilyPage: Component family display with BasePage wrapper
 * - ComponentPanel: Individual component showcase with controls
 */

import { useState, useCallback, memo } from 'react';
import type { ComponentCategory } from './types';
import { HomePage, FamilyPage } from './pages';
import { FAIcon } from '../components/Icon';
import './showcase.css';

// ═══════════════════════════════════════════════════════════════════════════
// ASSETS
// ═══════════════════════════════════════════════════════════════════════════

import logoImg from '../assets/LogoArkAlliance.png';
import bgImg from '../assets/Background.PNG';

// ═══════════════════════════════════════════════════════════════════════════
// ICON MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map category names to FontAwesome icons
 */
const categoryIconMap: Record<string, string> = {
    Buttons: 'circle-dot',
    Toggles: 'toggle-on',
    Cards: 'id-card',
    Gauges: 'gauge',
    Grids: 'table-cells',
    Inputs: 'keyboard',
    Progress: 'bars-progress',
    Layout: 'layer-group',
    Modals: 'window-maximize',
    Navigation: 'compass',
    Status: 'traffic-light',
    Charts: 'chart-line',
    Icons: 'icons',
};

// ═══════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Header props interface
 */
interface ShowcaseHeaderProps {
    /** Theme toggle callback */
    onThemeToggle: () => void;
    /** Current dark mode state */
    isDark: boolean;
}

/**
 * ShowcaseHeader - Application header with branding and theme toggle
 */
const ShowcaseHeader = memo(function ShowcaseHeader({ onThemeToggle, isDark }: ShowcaseHeaderProps) {
    return (
        <header className="showcase-header">
            <div className="showcase-header__left">
                <img
                    src={logoImg}
                    alt="Ark Alliance Logo"
                    className="showcase-header__logo-img"
                />
                <div className="showcase-header__branding">
                    <h1 className="showcase-header__title">Ark.Alliance React.Components Library</h1>
                    <span className="showcase-header__subtitle">© M2H.IO 2024 - 2025</span>
                </div>
            </div>
            <div className="showcase-header__right">
                <button
                    className="showcase-header__theme-btn"
                    onClick={onThemeToggle}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle theme"
                >
                    <FAIcon name={isDark ? 'sun' : 'moon'} size="lg" color={isDark ? '#fbbf24' : '#60a5fa'} />
                    <span className="showcase-header__theme-label">{isDark ? 'Light' : 'Dark'}</span>
                </button>
            </div>
        </header>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sidebar props interface
 */
interface SidebarProps {
    /** Component categories to display */
    categories: ComponentCategory[];
    /** Currently active category name */
    activeCategory: string | null;
    /** Category selection callback */
    onSelectCategory: (name: string) => void;
    /** Collapsed state */
    collapsed: boolean;
    /** Toggle collapse callback */
    onToggle: () => void;
}

/**
 * Sidebar - Navigation menu for component families
 */
const Sidebar = memo(function Sidebar({
    categories,
    activeCategory,
    onSelectCategory,
    collapsed,
    onToggle
}: SidebarProps) {
    return (
        <aside className={`showcase-sidebar ${collapsed ? 'showcase-sidebar--collapsed' : ''}`}>
            {/* Hamburger at top of sidebar */}
            <button
                className="showcase-sidebar__hamburger"
                onClick={onToggle}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label="Toggle sidebar"
            >
                <span className="showcase-sidebar__hamburger-line"></span>
                <span className="showcase-sidebar__hamburger-line"></span>
                <span className="showcase-sidebar__hamburger-line"></span>
            </button>

            <nav className="showcase-sidebar__nav">
                {/* Home link */}
                <button
                    className={`showcase-sidebar__menu-item ${activeCategory === null ? 'showcase-sidebar__menu-item--active' : ''}`}
                    onClick={() => onSelectCategory('')}
                    title={collapsed ? 'Home' : undefined}
                >
                    <span className="showcase-sidebar__menu-icon">
                        <FAIcon name="house" size="sm" />
                    </span>
                    {!collapsed && (
                        <span className="showcase-sidebar__menu-label">Home</span>
                    )}
                </button>

                {!collapsed && <div className="showcase-sidebar__section-title">Component Families</div>}

                {categories.map((category) => (
                    <button
                        key={category.name}
                        className={`showcase-sidebar__menu-item ${activeCategory === category.name ? 'showcase-sidebar__menu-item--active' : ''}`}
                        onClick={() => onSelectCategory(category.name)}
                        title={collapsed ? category.name : undefined}
                    >
                        <span className="showcase-sidebar__menu-icon">
                            <FAIcon name={categoryIconMap[category.name] || 'cube'} size="sm" />
                        </span>
                        {!collapsed && (
                            <>
                                <span className="showcase-sidebar__menu-label">{category.name}</span>
                                <span className="showcase-sidebar__menu-count">{category.components.length}</span>
                            </>
                        )}
                    </button>
                ))}
            </nav>

            {!collapsed && (
                <div className="showcase-sidebar__footer">
                    <div className="showcase-sidebar__stats">
                        <div className="showcase-sidebar__stat">
                            <span className="showcase-sidebar__stat-value">{categories.length}</span>
                            <span className="showcase-sidebar__stat-label">Families</span>
                        </div>
                        <div className="showcase-sidebar__stat">
                            <span className="showcase-sidebar__stat-value">
                                {categories.reduce((acc, c) => acc + c.components.length, 0)}
                            </span>
                            <span className="showcase-sidebar__stat-label">Components</span>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ShowcaseApp props interface
 */
export interface ShowcaseAppProps {
    /** Component categories to display */
    categories: ComponentCategory[];
}

/**
 * ShowcaseApp - Main showcase application
 * 
 * Features:
 * - Responsive sidebar navigation
 * - Dark/light theme toggle
 * - Page-based navigation (Home, Family pages)
 * - Background image support
 * 
 * @example
 * ```tsx
 * <ShowcaseApp categories={componentCategories} />
 * ```
 */
export const ShowcaseApp = memo(function ShowcaseApp({ categories }: ShowcaseAppProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const selectedCategory = activeCategory
        ? categories.find(c => c.name === activeCategory)
        : null;

    /**
     * Toggle theme between dark and light
     */
    const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

    /**
     * Toggle sidebar collapsed state
     */
    const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);

    /**
     * Handle category selection (empty string navigates to home)
     */
    const handleSelectCategory = useCallback((name: string) => {
        setActiveCategory(name || null);
    }, []);

    return (
        <div className={`showcase ${isDark ? 'showcase--dark' : 'showcase--light'}`}>
            {/* Background image with overlay */}
            <div
                className="showcase__background"
                style={{ backgroundImage: `url(${bgImg})` }}
            />

            {/* Header */}
            <ShowcaseHeader
                isDark={isDark}
                onThemeToggle={toggleTheme}
            />

            {/* Layout */}
            <div className="showcase__layout">
                <Sidebar
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelectCategory={handleSelectCategory}
                    collapsed={sidebarCollapsed}
                    onToggle={toggleSidebar}
                />
                <main className="showcase-main">
                    {selectedCategory ? (
                        <FamilyPage
                            key={selectedCategory.name}
                            category={selectedCategory}
                            isDark={isDark}
                        />
                    ) : (
                        <HomePage
                            categories={categories}
                            onSelectCategory={handleSelectCategory}
                        />
                    )}
                </main>
            </div>
        </div>
    );
});

ShowcaseApp.displayName = 'ShowcaseApp';

// Re-export types for convenience
export type { ComponentCategory, ComponentInfo, PropDefinition, StylePreset } from './types';

export default ShowcaseApp;
