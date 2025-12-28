/**
 * @fileoverview Base Component Page - Shared presentation wrapper
 * @module showcase/pages
 * 
 * Provides consistent styling and layout for component showcase pages.
 * All family pages should extend this base for uniform presentation.
 */

import { memo, type ReactNode } from 'react';
import './BasePage.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base page props interface
 */
export interface BasePageProps {
    /** Page title */
    title: string;
    /** Page icon (emoji or ReactNode) */
    icon?: ReactNode;
    /** Optional subtitle/description */
    description?: string;
    /** Number of items (components) in this page */
    itemCount?: number;
    /** Page content */
    children: ReactNode;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BasePage - Shared component page wrapper
 * 
 * Provides:
 * - Consistent header with icon, title, description
 * - Item count badge
 * - Content wrapper for child components
 * 
 * @example
 * ```tsx
 * <BasePage 
 *     title="Buttons"
 *     icon="🔘"
 *     description="Interactive button components"
 *     itemCount={5}
 * >
 *     <ButtonShowcase />
 * </BasePage>
 * ```
 */
export const BasePage = memo(function BasePage(props: BasePageProps) {
    const { title, icon, description, itemCount, children, className = '' } = props;

    return (
        <div className={`showcase-base-page ${className}`}>
            <header className="showcase-base-page__header">
                {icon && (
                    <div className="showcase-base-page__icon">{icon}</div>
                )}
                <div className="showcase-base-page__info">
                    <h2 className="showcase-base-page__title">{title}</h2>
                    {description && (
                        <p className="showcase-base-page__description">{description}</p>
                    )}
                    {itemCount !== undefined && (
                        <div className="showcase-base-page__meta">
                            <span className="showcase-base-page__count">{itemCount} components</span>
                        </div>
                    )}
                </div>
            </header>
            <main className="showcase-base-page__content">
                {children}
            </main>
        </div>
    );
});

BasePage.displayName = 'BasePage';
export default BasePage;
