/**
 * @fileoverview FamilyPage - Component family showcase page
 * @module showcase/pages/FamilyPage
 * 
 * Displays all components in a family using the library Page component.
 */

import { memo } from 'react';
import type { ComponentCategory } from '../../types';
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

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FamilyPage - Displays components in a category
 * 
 * Uses the library Page component for consistent layout and MVVM compliance.
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

    return (
        <Page
            title={category.name}
            subtitle={category.description}
            icon={category.icon}
            itemCount={category.components.length}
            itemLabel="components"
            isDark={isDark}
            padding="md"
        >
            <div className="family-page__components">
                {category.components.map((comp) => (
                    <ComponentPanel
                        key={comp.name}
                        info={comp}
                        isDark={isDark}
                    />
                ))}
            </div>
        </Page>
    );
});

FamilyPage.displayName = 'FamilyPage';
export default FamilyPage;
