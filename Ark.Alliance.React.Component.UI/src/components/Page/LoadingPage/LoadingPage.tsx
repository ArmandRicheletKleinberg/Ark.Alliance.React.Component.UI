/**
 * @fileoverview LoadingPage View Component
 * @module components/Page/LoadingPage
 * 
 * Professional loading page with animated logo and smooth progress.
 * 
 * @author Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5
 */

import { memo, forwardRef } from 'react';
import { useLoadingPage, type UseLoadingPageOptions } from './LoadingPage.viewmodel';
import './LoadingPage.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface LoadingPageProps extends UseLoadingPageOptions {
    /** Additional CSS classes */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SPINNER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Spinners = {
    dots: () => (
        <div className="loading-page__spinner loading-page__spinner--dots">
            <span />
            <span />
            <span />
        </div>
    ),
    ring: () => (
        <div className="loading-page__spinner loading-page__spinner--ring" />
    ),
    pulse: () => (
        <div className="loading-page__spinner loading-page__spinner--pulse" />
    ),
    bars: () => (
        <div className="loading-page__spinner loading-page__spinner--bars">
            <span />
            <span />
            <span />
            <span />
        </div>
    ),
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LoadingPage Component
 * 
 * Professional loading screen with:
 * - Animated logo with pulse/glow effect
 * - Smooth progress bar animation
 * - Message rotation
 * - Multiple spinner types
 * - Responsive design
 * 
 * @example
 * ```tsx
 * <LoadingPage
 *   logoUrl="/logo.png"
 *   appName="My Application"
 *   message={['Loading...', 'Please wait...', 'Almost ready...']}
 *   progress={75}
 *   showProgress={true}
 *   animated={true}
 * />
 * ```
 */
export const LoadingPage = memo(
    forwardRef<HTMLDivElement, LoadingPageProps>(function LoadingPage(props, ref) {
        const { className, ...options } = props;
        const vm = useLoadingPage(options);

        const SpinnerComponent = Spinners[vm.model.spinnerType];

        return (
            <div
                ref={ref}
                className={`loading-page ${className || ''}`.trim()}
                data-testid={vm.model.testId}
            >
                <div className="loading-page__content">
                    {/* Logo */}
                    {vm.model.logoUrl && (
                        <div className="loading-page__logo-container">
                            <img
                                src={vm.model.logoUrl}
                                alt={vm.model.appName || 'Loading'}
                                className={`loading-page__logo ${vm.logoAnimationClass} ${vm.model.logoClassName || ''}`.trim()}
                            />
                        </div>
                    )}

                    {/* App Name */}
                    {vm.model.appName && (
                        <h1 className="loading-page__title">{vm.model.appName}</h1>
                    )}

                    {/* Spinner */}
                    {!vm.model.logoUrl && <SpinnerComponent />}

                    {/* Message */}
                    <p className="loading-page__message" key={vm.currentMessage}>
                        {vm.currentMessage}
                    </p>

                    {/* Progress Bar */}
                    {vm.model.showProgress && vm.model.progress !== undefined && (
                        <div className="loading-page__progress-container">
                            <div className="loading-page__progress-bar">
                                <div
                                    className="loading-page__progress-fill"
                                    style={{ width: `${vm.currentProgress}%` }}
                                />
                            </div>
                            <span className="loading-page__progress-text">
                                {Math.round(vm.currentProgress)}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    })
);

LoadingPage.displayName = 'LoadingPage';

export default LoadingPage;
