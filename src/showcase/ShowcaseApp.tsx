/**
 * @fileoverview Component Showcase Dashboard - Polished Edition
 * @module showcase
 * 
 * Interactive dashboard with page-per-family layout, header, and control panels.
 */

import { useState, useCallback } from 'react';
import './showcase.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ComponentCategory {
    name: string;
    icon: string;
    description: string;
    components: ComponentInfo[];
}

export interface ComponentInfo {
    name: string;
    description: string;
    component: React.ComponentType<any>;
    defaultProps: Record<string, any>;
    propDefs: PropDefinition[];
    presets: StylePreset[];
}

export interface PropDefinition {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'select' | 'color';
    default: any;
    options?: string[];
    description?: string;
}

export interface StylePreset {
    name: string;
    props: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════
// ASSETS
// ═══════════════════════════════════════════════════════════════════════════

import logoImg from '../assets/LogoArkAlliance.png';
import bgImg from '../assets/Background.PNG';

// ═══════════════════════════════════════════════════════════════════════════
// HEADER (using library Header component pattern)
// ═══════════════════════════════════════════════════════════════════════════

interface ShowcaseHeaderProps {
    onThemeToggle: () => void;
    isDark: boolean;
}

export function ShowcaseHeader({ onThemeToggle, isDark }: ShowcaseHeaderProps) {
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
                    <span className="showcase-header__theme-icon">{isDark ? '☀️' : '🌙'}</span>
                    <span className="showcase-header__theme-label">{isDark ? 'Light' : 'Dark'}</span>
                </button>
            </div>
        </header>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR MENU
// ═══════════════════════════════════════════════════════════════════════════

interface SidebarProps {
    categories: ComponentCategory[];
    activeCategory: string | null;
    onSelectCategory: (name: string) => void;
    collapsed: boolean;
    onToggle: () => void;
}

function Sidebar({ categories, activeCategory, onSelectCategory, collapsed, onToggle }: SidebarProps) {
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
                {!collapsed && <div className="showcase-sidebar__section-title">Component Families</div>}
                {categories.map((category) => (
                    <button
                        key={category.name}
                        className={`showcase-sidebar__menu-item ${activeCategory === category.name ? 'showcase-sidebar__menu-item--active' : ''}`}
                        onClick={() => onSelectCategory(category.name)}
                        title={collapsed ? category.name : undefined}
                    >
                        <span className="showcase-sidebar__menu-icon">{category.icon}</span>
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
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT PANEL
// ═══════════════════════════════════════════════════════════════════════════

interface ComponentPanelProps {
    info: ComponentInfo;
    isDark: boolean;
}

function ComponentPanel({ info, isDark }: ComponentPanelProps) {
    const [propValues, setPropValues] = useState<Record<string, any>>({});
    const [copied, setCopied] = useState(false);
    const [activePreset, setActivePreset] = useState<string | null>(null);

    const Component = info.component;

    const handlePropChange = useCallback((name: string, value: any) => {
        setPropValues(prev => ({ ...prev, [name]: value }));
        setActivePreset(null);
    }, []);

    const handlePresetApply = useCallback((preset: StylePreset) => {
        setPropValues(prev => ({ ...prev, ...preset.props }));
        setActivePreset(preset.name);
    }, []);

    const handleCopy = useCallback(() => {
        const code = generateCode(info.name, propValues, info.defaultProps);
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [info.name, propValues, info.defaultProps]);

    const generateCode = (name: string, props: Record<string, any>, defaults: Record<string, any>) => {
        const propsStr = Object.entries(props)
            .filter(([k, v]) => v !== undefined && v !== defaults[k])
            .map(([k, v]) => typeof v === 'boolean'
                ? (v ? ` ${k}` : '')
                : typeof v === 'string'
                    ? ` ${k}="${v}"`
                    : ` ${k}={${JSON.stringify(v)}}`
            ).join('');
        return `<${name}${propsStr} />`;
    };

    return (
        <div className="component-panel">
            <div className="component-panel__header">
                <div className="component-panel__info">
                    <h3 className="component-panel__name">{info.name}</h3>
                    <p className="component-panel__desc">{info.description}</p>
                </div>
            </div>

            <div className="component-panel__content">
                {/* Preview */}
                <div className="component-panel__preview">
                    <span className="component-panel__preview-label">Preview</span>
                    <div className="component-panel__preview-area">
                        <Component {...info.defaultProps} {...propValues} isDark={isDark} />
                    </div>
                </div>

                {/* Controls */}
                <div className="component-panel__controls">
                    {/* Presets */}
                    {info.presets.length > 0 && (
                        <div className="component-panel__section">
                            <h4 className="component-panel__section-title">🎨 Style Presets</h4>
                            <div className="component-panel__presets">
                                {info.presets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        className={`component-panel__preset-btn ${activePreset === preset.name ? 'component-panel__preset-btn--active' : ''}`}
                                        onClick={() => handlePresetApply(preset)}
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Properties */}
                    <div className="component-panel__section">
                        <h4 className="component-panel__section-title">⚙️ Properties</h4>
                        <div className="component-panel__props">
                            {info.propDefs.map((prop) => (
                                <div key={prop.name} className="component-panel__prop">
                                    <label className="component-panel__prop-label">
                                        <span className="component-panel__prop-name">{prop.name}</span>
                                        <span className="component-panel__prop-type">{prop.type}</span>
                                    </label>
                                    <div className="component-panel__prop-input">
                                        {prop.type === 'boolean' ? (
                                            <input
                                                type="checkbox"
                                                checked={propValues[prop.name] ?? prop.default}
                                                onChange={(e) => handlePropChange(prop.name, e.target.checked)}
                                            />
                                        ) : prop.type === 'select' ? (
                                            <select
                                                value={propValues[prop.name] ?? prop.default}
                                                onChange={(e) => handlePropChange(prop.name, e.target.value)}
                                            >
                                                {prop.options?.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : prop.type === 'number' ? (
                                            <input
                                                type="number"
                                                value={propValues[prop.name] ?? prop.default}
                                                onChange={(e) => handlePropChange(prop.name, Number(e.target.value))}
                                            />
                                        ) : prop.type === 'color' ? (
                                            <input
                                                type="color"
                                                value={propValues[prop.name] ?? prop.default}
                                                onChange={(e) => handlePropChange(prop.name, e.target.value)}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={propValues[prop.name] ?? prop.default}
                                                onChange={(e) => handlePropChange(prop.name, e.target.value)}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Code */}
                    <div className="component-panel__section">
                        <div className="component-panel__code-header">
                            <h4 className="component-panel__section-title">📋 Code</h4>
                            <button
                                className={`component-panel__copy-btn ${copied ? 'component-panel__copy-btn--copied' : ''}`}
                                onClick={handleCopy}
                            >
                                {copied ? '✓ Copied!' : 'Copy'}
                            </button>
                        </div>
                        <pre className="component-panel__code">
                            <code>{generateCode(info.name, propValues, info.defaultProps)}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// FAMILY PAGE
// ═══════════════════════════════════════════════════════════════════════════

interface FamilyPageProps {
    category: ComponentCategory;
    isDark: boolean;
}

function FamilyPage({ category, isDark }: FamilyPageProps) {
    return (
        <div className="family-page">
            <div className="family-page__header">
                <div className="family-page__icon">{category.icon}</div>
                <div className="family-page__info">
                    <h2 className="family-page__title">{category.name}</h2>
                    <p className="family-page__desc">{category.description}</p>
                    <div className="family-page__meta">
                        <span className="family-page__count">{category.components.length} components</span>
                    </div>
                </div>
            </div>
            <div className="family-page__components">
                {category.components.map((comp) => (
                    <ComponentPanel key={comp.name} info={comp} isDark={isDark} />
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// WELCOME PAGE
// ═══════════════════════════════════════════════════════════════════════════

interface WelcomePageProps {
    categories: ComponentCategory[];
    onSelectCategory: (name: string) => void;
}

function WelcomePage({ categories, onSelectCategory }: WelcomePageProps) {
    const totalComponents = categories.reduce((acc, c) => acc + c.components.length, 0);

    return (
        <div className="welcome-page">
            <div className="welcome-page__hero">
                <div className="welcome-page__icon">🧩</div>
                <h1 className="welcome-page__title">Ark Component Library</h1>
                <p className="welcome-page__subtitle">
                    A comprehensive collection of MVVM-compliant React components
                </p>
                <div className="welcome-page__stats">
                    <div className="welcome-page__stat">
                        <span className="welcome-page__stat-value">{categories.length}</span>
                        <span className="welcome-page__stat-label">Families</span>
                    </div>
                    <div className="welcome-page__stat">
                        <span className="welcome-page__stat-value">{totalComponents}</span>
                        <span className="welcome-page__stat-label">Components</span>
                    </div>
                    <div className="welcome-page__stat">
                        <span className="welcome-page__stat-value">4</span>
                        <span className="welcome-page__stat-label">Variants</span>
                    </div>
                </div>
            </div>

            {/* MVVM Architecture Section */}
            <div className="welcome-page__mvvm">
                <h2 className="welcome-page__section-title">🏛️ MVVM Architecture</h2>
                <p className="welcome-page__mvvm-desc">
                    All components follow the Model-View-ViewModel pattern for maximum separation of concerns, testability, and maintainability.
                </p>
                <div className="welcome-page__mvvm-diagram">
                    <div className="welcome-page__mvvm-layer welcome-page__mvvm-layer--view">
                        <div className="welcome-page__mvvm-layer-title">📱 View (*.tsx)</div>
                        <div className="welcome-page__mvvm-layer-desc">
                            React components with forwardRef/memo. Renders UI and delegates logic to ViewModel.
                        </div>
                    </div>
                    <div className="welcome-page__mvvm-arrow">▼ uses hook</div>
                    <div className="welcome-page__mvvm-layer welcome-page__mvvm-layer--viewmodel">
                        <div className="welcome-page__mvvm-layer-title">⚙️ ViewModel (*.viewmodel.ts)</div>
                        <div className="welcome-page__mvvm-layer-desc">
                            Custom React hooks with state, handlers, and computed values. Returns {"{ model, handlers, classes }"}.
                        </div>
                    </div>
                    <div className="welcome-page__mvvm-arrow">▼ extends/parses</div>
                    <div className="welcome-page__mvvm-layer welcome-page__mvvm-layer--model">
                        <div className="welcome-page__mvvm-layer-title">📋 Model (*.model.ts)</div>
                        <div className="welcome-page__mvvm-layer-desc">
                            Zod schemas with type inference. Extends BaseModelSchema for common props.
                        </div>
                    </div>
                </div>
                <div className="welcome-page__mvvm-benefits">
                    <span className="welcome-page__mvvm-benefit">✅ Type-safe props</span>
                    <span className="welcome-page__mvvm-benefit">✅ Runtime validation</span>
                    <span className="welcome-page__mvvm-benefit">✅ Testable logic</span>
                    <span className="welcome-page__mvvm-benefit">✅ Reusable hooks</span>
                </div>
            </div>

            <div className="welcome-page__families">
                <h2 className="welcome-page__section-title">Component Families</h2>
                <div className="welcome-page__grid">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            className="welcome-page__card"
                            onClick={() => onSelectCategory(category.name)}
                        >
                            <div className="welcome-page__card-icon">{category.icon}</div>
                            <h3 className="welcome-page__card-title">{category.name}</h3>
                            <p className="welcome-page__card-desc">{category.description}</p>
                            <span className="welcome-page__card-count">
                                {category.components.length} components
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

interface ShowcaseAppProps {
    categories: ComponentCategory[];
}

export function ShowcaseApp({ categories }: ShowcaseAppProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const selectedCategory = activeCategory
        ? categories.find(c => c.name === activeCategory)
        : null;

    const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);
    const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);

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
                    onSelectCategory={setActiveCategory}
                    collapsed={sidebarCollapsed}
                    onToggle={toggleSidebar}
                />
                <main className="showcase-main">
                    {selectedCategory ? (
                        <FamilyPage category={selectedCategory} isDark={isDark} />
                    ) : (
                        <WelcomePage
                            categories={categories}
                            onSelectCategory={setActiveCategory}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

export default ShowcaseApp;
