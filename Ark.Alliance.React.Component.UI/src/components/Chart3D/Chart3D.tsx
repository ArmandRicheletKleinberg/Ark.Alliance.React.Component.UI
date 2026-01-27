/**
 * @fileoverview Chart3D Main Component
 * @module components/Chart3D
 * 
 * A 3D data visualization component with streaming, multiple shape types,
 * interactive controls, and optional trading features.
 * 
 * @example Basic Usage
 * ```tsx
 * <Chart3D 
 *   height={600}
 *   shape="Cuboid"
 *   seriesCount={3}
 *   isStreaming={true}
 * />
 * ```
 * 
 * @example With Trading Features
 * ```tsx
 * <Chart3D
 *   height={600}
 *   shape="Candle"
 *   externalData={priceData}
 *   priceRange={{ min: 40000, max: 50000 }}
 *   thresholds={[
 *     { label: 'Take Profit', price: 48000, color: '#22c55e' },
 *     { label: 'Stop Loss', price: 42000, color: '#ef4444' },
 *   ]}
 *   eventMarkers={tradeEvents}
 *   showHeader
 *   headerTitle="BTC/USDT"
 *   fullscreenEnabled
 * />
 * ```
 */

import { forwardRef, memo, lazy, Suspense, useCallback, useState } from 'react';
import { useChart3D, type UseChart3DOptions } from './Chart3D.viewmodel';
import { ControlPanel } from './ControlPanel';
import { FullscreenContainer } from '../Panel';
import './Chart3D.scss';

// Lazy load Scene3D for code splitting
const Scene3D = lazy(() => import('./Scene/Scene3D'));

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Props for the Chart3D component.
 */
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
 * Features:
 * - Multiple shape types (Cuboid, Cylinder, Bubble, Candle, Lines, Surface)
 * - Real-time data streaming with configurable speed
 * - Optional price threshold lines
 * - Optional event markers (3D bubbles)
 * - Fullscreen support via FullscreenContainer
 * - Interactive control panel
 * - Dark/light theme support
 * 
 * @param props - Chart3D properties
 * @returns Memoized Chart3D component
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
        const [isFullscreen, setIsFullscreen] = useState(false);

        /**
         * Handles fullscreen state change.
         */
        const handleFullscreenChange = useCallback((fs: boolean) => {
            setIsFullscreen(fs);
        }, []);

        // Determine if fullscreen is enabled
        const fullscreenEnabled = vm.model.fullscreenEnabled ?? true;

        return (
            <FullscreenContainer
                ref={ref}
                showToggle={fullscreenEnabled}
                togglePosition="top-right"
                className={`${vm.wrapperClasses} ${className}`}
                fullscreenClassName="ark-chart3d--fullscreen"
                onFullscreenChange={handleFullscreenChange}
                testId={vm.model.testId}
            >
                {/* Optional Header Overlay */}
                {vm.model.showHeader && (
                    <div className="ark-chart3d__header">
                        <div className="ark-chart3d__header-left">
                            {vm.model.showConnectionStatus && (
                                <span
                                    className={`ark-chart3d__status ${vm.model.isConnected ? 'ark-chart3d__status--connected' : 'ark-chart3d__status--disconnected'}`}
                                    title={vm.model.isConnected ? 'Connected' : 'Disconnected'}
                                />
                            )}
                            {vm.model.headerTitle && (
                                <h2 className="ark-chart3d__header-title">{vm.model.headerTitle}</h2>
                            )}
                            {vm.model.headerSubtitle && (
                                <span className="ark-chart3d__header-subtitle">{vm.model.headerSubtitle}</span>
                            )}
                        </div>
                        {vm.model.currentValue !== undefined && (
                            <div className="ark-chart3d__header-right">
                                <span className="ark-chart3d__current-value">
                                    ${vm.model.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                </span>
                                {vm.model.valueChange !== undefined && (
                                    <span className={`ark-chart3d__value-change ${vm.model.valueChange >= 0 ? 'ark-chart3d__value-change--positive' : 'ark-chart3d__value-change--negative'}`}>
                                        {vm.model.valueChange >= 0 ? '+' : ''}{vm.model.valueChange.toFixed(2)}%
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 3D Scene Container */}
                <div
                    className="ark-chart3d__scene-container"
                    style={{ height: typeof height === 'number' ? `${height}px` : height }}
                >
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
                            thresholds={vm.thresholds}
                            eventMarkers={vm.eventMarkers}
                            priceRange={vm.priceRange}
                            selectedMarker={vm.selectedMarker}
                            onMarkerSelect={vm.setSelectedMarker}
                        />
                    </Suspense>
                </div>

                {/* Control Panel */}
                {showControls && (
                    <ControlPanel
                        config={vm.model}
                        onConfigChange={vm.updateConfig}
                        onReset={vm.resetData}
                        onToggleStream={vm.toggleStreaming}
                    />
                )}

                {/* Selected Marker Detail Overlay */}
                {vm.selectedMarker && (
                    <div className="ark-chart3d__marker-detail">
                        <div className="ark-chart3d__marker-detail-header">
                            <span
                                className="ark-chart3d__marker-indicator"
                                style={{ backgroundColor: vm.selectedMarker.color }}
                            />
                            <h3>
                                {vm.selectedMarker.type === 'click' && 'Click Event'}
                                {vm.selectedMarker.type === 'order' && 'Order Event'}
                                {vm.selectedMarker.type === 'inversion' && 'Inversion Event'}
                                {vm.selectedMarker.type === 'custom' && (vm.selectedMarker.label || 'Event')}
                            </h3>
                            <button
                                type="button"
                                className="ark-chart3d__marker-close"
                                onClick={() => vm.setSelectedMarker(null)}
                                aria-label="Close marker details"
                            >
                                ×
                            </button>
                        </div>
                        <div className="ark-chart3d__marker-detail-body">
                            {vm.selectedMarker.symbol && (
                                <div className="ark-chart3d__marker-row">
                                    <span>Symbol:</span>
                                    <span className="ark-chart3d__marker-value">{vm.selectedMarker.symbol}</span>
                                </div>
                            )}
                            <div className="ark-chart3d__marker-row">
                                <span>Price:</span>
                                <span className="ark-chart3d__marker-price">${vm.selectedMarker.price.toFixed(4)}</span>
                            </div>
                            {vm.selectedMarker.pnl !== undefined && (
                                <div className="ark-chart3d__marker-row">
                                    <span>PnL:</span>
                                    <span className={vm.selectedMarker.pnl >= 0 ? 'ark-chart3d__marker-positive' : 'ark-chart3d__marker-negative'}>
                                        {vm.selectedMarker.pnl >= 0 ? '+' : ''}{vm.selectedMarker.pnl.toFixed(4)}
                                    </span>
                                </div>
                            )}
                            {vm.selectedMarker.side && (
                                <div className="ark-chart3d__marker-row">
                                    <span>Side:</span>
                                    <span className={vm.selectedMarker.side === 'BUY' ? 'ark-chart3d__marker-positive' : 'ark-chart3d__marker-negative'}>
                                        {vm.selectedMarker.side}
                                    </span>
                                </div>
                            )}
                            {vm.selectedMarker.quantity !== undefined && (
                                <div className="ark-chart3d__marker-row">
                                    <span>Quantity:</span>
                                    <span>{vm.selectedMarker.quantity.toFixed(4)}</span>
                                </div>
                            )}
                            <div className="ark-chart3d__marker-row ark-chart3d__marker-time">
                                <span>Time:</span>
                                <span>{new Date(vm.selectedMarker.timestamp).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </FullscreenContainer>
        );
    }
));

Chart3D.displayName = 'Chart3D';

export default Chart3D;
