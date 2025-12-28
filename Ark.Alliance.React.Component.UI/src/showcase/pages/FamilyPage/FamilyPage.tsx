/**
 * @fileoverview FamilyPage - Enhanced Component family showcase page
 * @module showcase/pages/FamilyPage
 * 
 * Displays all components in a family with tabbed navigation.
 * Replaces vertical scroll with compact dashboard view.
 */

import { memo, useState, useCallback, useEffect } from 'react';
import type { ComponentCategory, ComponentInfo } from '../../types';
import { Page } from '../../../components/Page';
import { ComponentPanel } from '../../components/ComponentPanel';
import './FamilyPage.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FamilyPage props
 */
export interface FamilyPageProps {
    /** Component category to display */
    category: ComponentCategory;
    /** Dark mode flag */
    isDark: boolean;
}

/**
 * View mode type
 */
type ViewMode = 'tabs' | 'grid' | 'gallery' | 'list';

// ═══════════════════════════════════════════════════════════════════════════
// TAB COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface TabButtonProps {
    name: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton = memo(function TabButton({ name, isActive, onClick }: TabButtonProps) {
    return (
        <button
            className={`family-page__tab ${isActive ? 'family-page__tab--active' : ''}`}
            onClick={onClick}
            type="button"
        >
            {name}
        </button>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// VIEW MODE TOGGLE
// ═══════════════════════════════════════════════════════════════════════════

interface ViewModeToggleProps {
    mode: ViewMode;
    onChange: (mode: ViewMode) => void;
}

const ViewModeToggle = memo(function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
    return (
        <div className="family-page__view-toggle">
            <button
                className={`family-page__view-btn ${mode === 'tabs' ? 'family-page__view-btn--active' : ''}`}
                onClick={() => onChange('tabs')}
                title="Focused View (One at a time)"
                type="button"
            >
                📑
            </button>
            <button
                className={`family-page__view-btn ${mode === 'gallery' ? 'family-page__view-btn--active' : ''}`}
                onClick={() => onChange('gallery')}
                title="Gallery View (All with controls)"
                type="button"
            >
                🖼️
            </button>
            <button
                className={`family-page__view-btn ${mode === 'grid' ? 'family-page__view-btn--active' : ''}`}
                onClick={() => onChange('grid')}
                title="Grid View (Compact)"
                type="button"
            >
                ⊞
            </button>
            <button
                className={`family-page__view-btn ${mode === 'list' ? 'family-page__view-btn--active' : ''}`}
                onClick={() => onChange('list')}
                title="List View (Classic)"
                type="button"
            >
                ☰
            </button>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FamilyPage - Displays components in a category with multiple view modes
 * 
 * Features:
 * - Tabbed view: One component at a time (focused)
 * - Grid view: All components in 2-column grid (overview)
 * - List view: Vertical stack (classic)
 * 
 * @example
 * ```tsx
 * <FamilyPage 
 *     category={buttonsCategory}
 *     isDark={true}
 * />
 * ```
 */
export const FamilyPage = memo(function FamilyPage(props: FamilyPageProps) {
    const { category, isDark } = props;

    // State
    const [viewMode, setViewMode] = useState<ViewMode>('tabs');
    const [activeTab, setActiveTab] = useState(0);

    // Handlers
    const handleTabChange = useCallback((index: number) => {
        setActiveTab(index);
    }, []);

    const handleViewModeChange = useCallback((mode: ViewMode) => {
        setViewMode(mode);
    }, []);

    // Reset activeTab when category changes (backup for key prop)
    useEffect(() => {
        setActiveTab(0);
    }, [category.name]);

    // Current component for tabs view
    const currentComponent: ComponentInfo | undefined = category.components[activeTab];

    // Render tab navigation
    const renderTabs = () => (
        <div className="family-page__tabs">
            {category.components.map((comp, index) => (
                <TabButton
                    key={comp.name}
                    name={comp.name}
                    isActive={index === activeTab}
                    onClick={() => handleTabChange(index)}
                />
            ))}
        </div>
    );

    // Render content based on view mode
    const renderContent = () => {
        switch (viewMode) {
            case 'tabs':
                return (
                    <div className="family-page__tab-content">
                        {renderTabs()}
                        {currentComponent && (
                            <ComponentPanel
                                key={currentComponent.name}
                                info={currentComponent}
                                isDark={isDark}
                            />
                        )}
                    </div>
                );

            case 'gallery':
                // Gallery: All components with full Master-Detail panels (controls visible)
                return (
                    <div className="family-page__gallery">
                        {category.components.map((comp) => (
                            <ComponentPanel
                                key={comp.name}
                                info={comp}
                                isDark={isDark}
                            />
                        ))}
                    </div>
                );

            case 'grid':
                return (
                    <div className="family-page__grid">
                        {category.components.map((comp) => (
                            <div key={comp.name} className="family-page__grid-item">
                                <ComponentPanel
                                    info={comp}
                                    isDark={isDark}
                                    compact
                                />
                            </div>
                        ))}
                    </div>
                );

            case 'list':
            default:
                return (
                    <div className="family-page__list">
                        {category.components.map((comp) => (
                            <ComponentPanel
                                key={comp.name}
                                info={comp}
                                isDark={isDark}
                            />
                        ))}
                    </div>
                );
        }
    };

    return (
        <Page
            title={category.name}
            subtitle={category.description}
            icon={category.icon}
            itemCount={category.components.length}
            itemLabel="components"
            isDark={isDark}
            padding="md"
            headerSlot={<ViewModeToggle mode={viewMode} onChange={handleViewModeChange} />}
        >
            {renderContent()}
        </Page>
    );
});

FamilyPage.displayName = 'FamilyPage';
export default FamilyPage;
