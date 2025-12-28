/**
 * @fileoverview HomePage - Showcase welcome page
 * @module showcase/pages/HomePage
 * 
 * Landing page for the component library showcase with
 * overview stats, MVVM explanation, and family navigation.
 */

import { memo } from 'react';
import type { ComponentCategory } from '../../types';
import './HomePage.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * HomePage props
 */
export interface HomePageProps {
    /** Available component categories */
    categories: ComponentCategory[];
    /** Category selection callback */
    onSelectCategory: (name: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * HomePage - Welcome page with library overview
 * 
 * Features:
 * - Hero section with library stats
 * - MVVM architecture diagram and explanation
 * - Category cards with navigation
 * 
 * @example
 * ```tsx
 * <HomePage 
 *     categories={componentCategories}
 *     onSelectCategory={(name) => navigate(name)}
 * />
 * ```
 */
export const HomePage = memo(function HomePage(props: HomePageProps) {
    const { categories, onSelectCategory } = props;
    const totalComponents = categories.reduce((acc, c) => acc + c.components.length, 0);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="home-page__hero">
                <div className="home-page__icon">🧩</div>
                <h1 className="home-page__title">Ark Component Library</h1>
                <p className="home-page__subtitle">
                    A comprehensive collection of MVVM-compliant React components
                </p>
                <div className="home-page__stats">
                    <div className="home-page__stat">
                        <span className="home-page__stat-value">{categories.length}</span>
                        <span className="home-page__stat-label">Families</span>
                    </div>
                    <div className="home-page__stat">
                        <span className="home-page__stat-value">{totalComponents}</span>
                        <span className="home-page__stat-label">Components</span>
                    </div>
                    <div className="home-page__stat">
                        <span className="home-page__stat-value">4</span>
                        <span className="home-page__stat-label">Variants</span>
                    </div>
                </div>
            </section>

            {/* MVVM Architecture Section */}
            <section className="home-page__mvvm">
                <h2 className="home-page__section-title">🏛️ MVVM Architecture</h2>
                <p className="home-page__mvvm-desc">
                    All components follow the Model-View-ViewModel pattern for maximum separation of concerns, testability, and maintainability.
                </p>
                <div className="home-page__mvvm-diagram">
                    <div className="home-page__mvvm-layer home-page__mvvm-layer--view">
                        <div className="home-page__mvvm-layer-title">📱 View (*.tsx)</div>
                        <div className="home-page__mvvm-layer-desc">
                            React components with forwardRef/memo. Renders UI and delegates logic to ViewModel.
                        </div>
                    </div>
                    <div className="home-page__mvvm-arrow">▼ uses hook</div>
                    <div className="home-page__mvvm-layer home-page__mvvm-layer--viewmodel">
                        <div className="home-page__mvvm-layer-title">⚙️ ViewModel (*.viewmodel.ts)</div>
                        <div className="home-page__mvvm-layer-desc">
                            Custom React hooks with state, handlers, and computed values. Returns {"{ model, handlers, classes }"}.
                        </div>
                    </div>
                    <div className="home-page__mvvm-arrow">▼ extends/parses</div>
                    <div className="home-page__mvvm-layer home-page__mvvm-layer--model">
                        <div className="home-page__mvvm-layer-title">📋 Model (*.model.ts)</div>
                        <div className="home-page__mvvm-layer-desc">
                            Zod schemas with type inference. Extends BaseModelSchema for common props.
                        </div>
                    </div>
                </div>
                <div className="home-page__mvvm-benefits">
                    <span className="home-page__mvvm-benefit">✅ Type-safe props</span>
                    <span className="home-page__mvvm-benefit">✅ Runtime validation</span>
                    <span className="home-page__mvvm-benefit">✅ Testable logic</span>
                    <span className="home-page__mvvm-benefit">✅ Reusable hooks</span>
                </div>
            </section>

            {/* Component Families Section */}
            <section className="home-page__families">
                <h2 className="home-page__section-title">Component Families</h2>
                <div className="home-page__grid">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            className="home-page__card"
                            onClick={() => onSelectCategory(category.name)}
                        >
                            <div className="home-page__card-icon">{category.icon}</div>
                            <h3 className="home-page__card-title">{category.name}</h3>
                            <p className="home-page__card-desc">{category.description}</p>
                            <span className="home-page__card-count">
                                {category.components.length} components
                            </span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
});

HomePage.displayName = 'HomePage';
export default HomePage;
