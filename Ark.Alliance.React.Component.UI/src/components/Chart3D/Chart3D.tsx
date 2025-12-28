/**
 * @fileoverview Chart3D Main Component
 * @module components/Chart3D
 * 
 * A 3D data visualization component with streaming, multiple shape types,
 * and interactive controls.
 */

import { forwardRef, memo, lazy, Suspense } from 'react';
import { useChart3D, type UseChart3DOptions } from './Chart3D.viewmodel';
import { ControlPanel } from './ControlPanel';
import './Chart3D.styles.css';

// Lazy load Scene3D for code splitting
const Scene3D = lazy(() => import('./Scene/Scene3D'));

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Chart3DProps extends UseChart3DOptions {
    /** Additional CSS class */
    className?: string;
    /** Show control panel */
    showControls?: boolean;
    /** Chart height */
    height?: string | number;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chart3D - 3D Data Visualization Component
 * 
 * @example
 * ```tsx
 * <Chart3D 
 *   height={600}
 *   shape="Cuboid"
 *   seriesCount={3}
 *   isStreaming={true}
 * />
 * ```
 */
export const Chart3D = memo(forwardRef<HTMLDivElement, Chart3DProps>(
    function Chart3D(props, ref) {
        const {
            className = '',
            showControls = true,
            height = 500,
            ...options
        } = props;

        const vm = useChart3D(options);

        return (
            <div
                ref={ref}
                className={`${vm.wrapperClasses} ${className}`}
                style={{ height: typeof height === 'number' ? `${height}px` : height }}
                data-testid={vm.model.testId}
            >
                {/* 3D Scene */}
                <Suspense fallback={
                    <div className="ark-chart3d__loading">
                        <div className="ark-chart3d__spinner" />
                        <span>Loading 3D Scene...</span>
                    </div>
                }>
                    <Scene3D
                        data={vm.data}
                        config={vm.model}
                        onHoverPoint={vm.setHoveredPoint}
                        hoveredPoint={vm.hoveredPoint}
                    />
                </Suspense>

                {/* Control Panel */}
                {showControls && (
                    <ControlPanel
                        config={vm.model}
                        onConfigChange={vm.updateConfig}
                        onReset={vm.resetData}
                        onToggleStream={vm.toggleStreaming}
                    />
                )}
            </div>
        );
    }
));

Chart3D.displayName = 'Chart3D';

export default Chart3D;
