/**
 * @fileoverview FullscreenContainer Component
 * @module components/Panel/FullscreenContainer
 * 
 * Reusable wrapper component for fullscreen toggle functionality.
 * Uses the Fullscreen API with proper cleanup and keyboard support.
 */

import { forwardRef, memo, useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import './FullscreenContainer.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FullscreenContainer component props
 */
export interface FullscreenContainerProps {
    /** Content to render inside the container */
    children: ReactNode;
    /** Whether to show the fullscreen toggle button */
    showToggle?: boolean;
    /** Position of the toggle button */
    togglePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    /** Callback when fullscreen state changes */
    onFullscreenChange?: (isFullscreen: boolean) => void;
    /** External control of fullscreen state */
    isFullscreen?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Fullscreen container class when in fullscreen mode */
    fullscreenClassName?: string;
    /** Test ID for automated testing */
    testId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FullscreenContainer - Wrapper for fullscreen functionality
 * 
 * Features:
 * - Fullscreen API integration
 * - Toggle button with configurable position
 * - ESC key support for exit
 * - Callback on state change
 * - External state control
 * 
 * @example
 * ```tsx
 * <FullscreenContainer
 *     showToggle
 *     togglePosition="top-right"
 *     onFullscreenChange={(fs) => console.log('Fullscreen:', fs)}
 * >
 *     <MyChart />
 * </FullscreenContainer>
 * ```
 */
export const FullscreenContainer = memo(forwardRef<HTMLDivElement, FullscreenContainerProps>(
    function FullscreenContainer(props, ref) {
        const {
            children,
            showToggle = true,
            togglePosition = 'top-right',
            onFullscreenChange,
            isFullscreen: externalFullscreen,
            className = '',
            fullscreenClassName = '',
            testId,
        } = props;

        const containerRef = useRef<HTMLDivElement>(null);
        const [internalFullscreen, setInternalFullscreen] = useState(false);

        // Use external state if provided, otherwise internal
        const isFullscreen = externalFullscreen ?? internalFullscreen;

        /**
         * Toggle fullscreen mode
         */
        const toggleFullscreen = useCallback(async () => {
            const container = containerRef.current;
            if (!container) return;

            try {
                if (!document.fullscreenElement) {
                    await container.requestFullscreen();
                } else {
                    await document.exitFullscreen();
                }
            } catch (error) {
                console.error('[FullscreenContainer] Fullscreen toggle failed:', error);
            }
        }, []);

        /**
         * Handle fullscreen change events
         */
        useEffect(() => {
            const handleFullscreenChange = () => {
                const isFs = !!document.fullscreenElement;
                setInternalFullscreen(isFs);
                if (onFullscreenChange) {
                    onFullscreenChange(isFs);
                }
            };

            document.addEventListener('fullscreenchange', handleFullscreenChange);
            return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
        }, [onFullscreenChange]);

        /**
         * Sync with external fullscreen state
         */
        useEffect(() => {
            if (externalFullscreen !== undefined && externalFullscreen !== internalFullscreen) {
                toggleFullscreen();
            }
        }, [externalFullscreen]);

        const containerClasses = [
            'ark-fullscreen-container',
            className,
            isFullscreen ? 'ark-fullscreen-container--fullscreen' : '',
            isFullscreen ? fullscreenClassName : '',
        ].filter(Boolean).join(' ');

        const toggleClasses = [
            'ark-fullscreen-container__toggle',
            `ark-fullscreen-container__toggle--${togglePosition}`,
        ].join(' ');

        return (
            <div
                ref={(node) => {
                    // Handle both refs
                    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                className={containerClasses}
                data-testid={testId}
            >
                {children}

                {showToggle && (
                    <button
                        type="button"
                        className={toggleClasses}
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
                    >
                        {isFullscreen ? (
                            // Minimize icon
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                                <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                                <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                                <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                            </svg>
                        ) : (
                            // Maximize icon
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        );
    }
));

FullscreenContainer.displayName = 'FullscreenContainer';
export default FullscreenContainer;
