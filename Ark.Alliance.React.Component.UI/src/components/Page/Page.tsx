/**
 * @fileoverview Page Component
 * @module components/Page
 * 
 * A standardized page layout component providing consistent
 * header, content area, and optional navigation elements.
 * 
 * MVVM Pattern:
 * - Model: Page.model.ts (Zod schema, types)
 * - ViewModel: Page.viewmodel.ts (usePage hook)
 * - View: Page.tsx (this file)
 */

import { forwardRef, memo, type ReactNode } from 'react';
import { usePage, type UsePageOptions } from './Page.viewmodel';
import './Page.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Page component props
 */
export interface PageProps extends UsePageOptions {
    /** Page content */
    children: ReactNode;
    /** Header action buttons/elements */
    headerActions?: ReactNode;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Page - Standardized page layout component
 * 
 * Provides a consistent page structure with:
 * - Optional header with icon, title, subtitle
 * - Item count badge
 * - Breadcrumb navigation
 * - Back button
 * - Header actions slot
 * - Content area with padding options
 * 
 * @example
 * ```tsx
 * <Page 
 *     title="Dashboard"
 *     subtitle="System overview"
 *     icon="📊"
 *     itemCount={5}
 *     itemLabel="widgets"
 *     headerActions={<Button>Add Widget</Button>}
 * >
 *     <DashboardContent />
 * </Page>
 * ```
 * 
 * @example
 * ```tsx
 * <Page
 *     title="Settings"
 *     showBackButton
 *     onBack={() => navigate(-1)}
 *     breadcrumbs={[
 *         { label: 'Home', path: '/' },
 *         { label: 'Settings' }
 *     ]}
 * >
 *     <SettingsForm />
 * </Page>
 * ```
 */
export const Page = memo(forwardRef<HTMLDivElement, PageProps>(
    function Page(props, ref) {
        const {
            children,
            headerActions,
            className = '',
            ...pageOptions
        } = props;

        const vm = usePage(pageOptions);

        return (
            <div
                ref={ref}
                className={`${vm.pageClasses} ${className}`}
                data-testid={vm.model.testId}
            >
                {/* Breadcrumbs */}
                {vm.hasBreadcrumbs && (
                    <nav className="ark-page__breadcrumbs" aria-label="Breadcrumb">
                        {vm.model.breadcrumbs!.map((crumb, index) => (
                            <span key={crumb.label} className="ark-page__breadcrumb-item">
                                {index > 0 && <span className="ark-page__breadcrumb-separator">/</span>}
                                {crumb.path ? (
                                    <button
                                        className="ark-page__breadcrumb-link"
                                        onClick={() => vm.handleBreadcrumbClick(crumb.path!)}
                                    >
                                        {crumb.icon && <span className="ark-page__breadcrumb-icon">{crumb.icon}</span>}
                                        {crumb.label}
                                    </button>
                                ) : (
                                    <span className="ark-page__breadcrumb-current">
                                        {crumb.icon && <span className="ark-page__breadcrumb-icon">{crumb.icon}</span>}
                                        {crumb.label}
                                    </span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}

                {/* Header */}
                {vm.model.showHeader && (
                    <header className={vm.headerClasses}>
                        <div className="ark-page__header-left">
                            {vm.model.showBackButton && (
                                <button
                                    className="ark-page__back-btn"
                                    onClick={vm.handleBack}
                                    aria-label="Go back"
                                >
                                    ←
                                </button>
                            )}
                            {vm.hasIcon && (
                                <div className="ark-page__icon">{vm.model.icon}</div>
                            )}
                            <div className="ark-page__titles">
                                <h1 className="ark-page__title">{vm.model.title}</h1>
                                {vm.model.subtitle && (
                                    <p className="ark-page__subtitle">{vm.model.subtitle}</p>
                                )}
                                {vm.itemCountLabel && (
                                    <span className="ark-page__item-count">{vm.itemCountLabel}</span>
                                )}
                            </div>
                        </div>
                        {headerActions && (
                            <div className="ark-page__header-actions">
                                {headerActions}
                            </div>
                        )}
                    </header>
                )}

                {/* Content */}
                <main className={vm.contentClasses}>
                    {children}
                </main>
            </div>
        );
    }
));

Page.displayName = 'Page';
export default Page;
