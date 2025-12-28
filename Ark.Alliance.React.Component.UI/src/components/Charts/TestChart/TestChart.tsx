/**
 * @fileoverview TestChart Component
 * @module components/Charts/TestChart
 * 
 * SVG-based chart for visualizing test scenarios with price series,
 * step markers, and threshold lines.
 */

import { forwardRef, memo } from 'react';
import { useTestChart, type UseTestChartOptions } from './TestChart.viewmodel';
import './TestChart.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface TestChartProps extends UseTestChartOptions {
    /** Additional CSS class */
    className?: string;
    /** Chart width */
    width?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const CHART_PADDING = 40;
const DEFAULT_WIDTH = 600;

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TestChart Component
 * 
 * Displays a price chart with step markers and threshold lines for test visualization.
 * 
 * @example
 * ```tsx
 * <TestChart
 *     prices={[{ index: 0, price: 50000 }, { index: 1, price: 50100 }]}
 *     entryPrice={50000}
 *     thresholds={[{ label: 'Click', value: 50200, type: 'click' }]}
 *     markers={[{ stepIndex: 5, type: 'click', status: 'passed' }]}
 *     height={300}
 * />
 * ```
 */
export const TestChart = memo(forwardRef<HTMLDivElement, TestChartProps>(
    function TestChart(props, ref) {
        const { className = '', width = DEFAULT_WIDTH, ...chartOptions } = props;
        const vm = useTestChart(chartOptions);

        const svgHeight = vm.model.height;
        const chartWidth = width - CHART_PADDING * 2;
        const chartHeight = svgHeight - CHART_PADDING * 2;

        return (
            <div ref={ref} className={`${vm.chartClasses} ${className}`} data-testid={vm.model.testId}>
                {vm.model.title && (
                    <div className="ark-test-chart__title">{vm.model.title}</div>
                )}

                <svg
                    className="ark-test-chart__svg"
                    viewBox={`0 0 ${width} ${svgHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Grid */}
                    {vm.model.showGrid && (
                        <g className="ark-test-chart__grid">
                            {[0.25, 0.5, 0.75].map(ratio => (
                                <line
                                    key={`h-${ratio}`}
                                    x1={CHART_PADDING}
                                    y1={CHART_PADDING + chartHeight * ratio}
                                    x2={CHART_PADDING + chartWidth}
                                    y2={CHART_PADDING + chartHeight * ratio}
                                />
                            ))}
                            {[0.25, 0.5, 0.75].map(ratio => (
                                <line
                                    key={`v-${ratio}`}
                                    x1={CHART_PADDING + chartWidth * ratio}
                                    y1={CHART_PADDING}
                                    x2={CHART_PADDING + chartWidth * ratio}
                                    y2={CHART_PADDING + chartHeight}
                                />
                            ))}
                        </g>
                    )}

                    {/* Entry price line */}
                    {vm.model.entryPrice !== undefined && (
                        <g>
                            <line
                                className="ark-test-chart__entry-line"
                                x1={CHART_PADDING}
                                y1={vm.toSvgPoint(0, vm.model.entryPrice).y}
                                x2={CHART_PADDING + chartWidth}
                                y2={vm.toSvgPoint(0, vm.model.entryPrice).y}
                            />
                            <text
                                className="ark-test-chart__threshold-label"
                                x={CHART_PADDING + chartWidth + 5}
                                y={vm.toSvgPoint(0, vm.model.entryPrice).y + 4}
                            >
                                Entry
                            </text>
                        </g>
                    )}

                    {/* Threshold lines */}
                    {vm.thresholds.map((threshold, i) => {
                        const y = vm.toSvgPoint(0, threshold.value).y;
                        return (
                            <g key={i}>
                                <line
                                    className={`ark-test-chart__threshold ark-test-chart__threshold--${threshold.type}`}
                                    x1={CHART_PADDING}
                                    y1={y}
                                    x2={CHART_PADDING + chartWidth}
                                    y2={y}
                                    style={threshold.color ? { stroke: threshold.color } : undefined}
                                />
                                <text
                                    className="ark-test-chart__threshold-label"
                                    x={CHART_PADDING + 5}
                                    y={y - 5}
                                >
                                    {threshold.label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Price line */}
                    {vm.pricePath && (
                        <path
                            className="ark-test-chart__price-line"
                            d={vm.pricePath}
                        />
                    )}

                    {/* Step markers */}
                    {vm.markers.map((marker, i) => {
                        const price = vm.prices[marker.stepIndex]?.price;
                        if (price === undefined) return null;
                        const point = vm.toSvgPoint(marker.stepIndex, price);
                        return (
                            <g
                                key={i}
                                className={`ark-test-chart__marker ark-test-chart__marker--${marker.status} ark-test-chart__marker--${marker.type}`}
                                transform={`translate(${point.x}, ${point.y})`}
                                onClick={() => props.onMarkerClick?.(marker, i)}
                            >
                                <circle
                                    className="ark-test-chart__marker-dot"
                                    r={6}
                                />
                                {marker.label && (
                                    <text
                                        className="ark-test-chart__marker-label"
                                        y={-12}
                                    >
                                        {marker.label.length > 15 ? marker.label.slice(0, 15) + '…' : marker.label}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Current position indicator */}
                    {vm.model.currentIndex >= 0 && vm.model.currentIndex < vm.prices.length && (
                        <g>
                            {(() => {
                                const price = vm.prices[vm.model.currentIndex].price;
                                const point = vm.toSvgPoint(vm.model.currentIndex, price);
                                return (
                                    <>
                                        <line
                                            className="ark-test-chart__current-line"
                                            x1={point.x}
                                            y1={CHART_PADDING}
                                            x2={point.x}
                                            y2={CHART_PADDING + chartHeight}
                                        />
                                        <circle
                                            className="ark-test-chart__current-dot"
                                            cx={point.x}
                                            cy={point.y}
                                            r={5}
                                        />
                                    </>
                                );
                            })()}
                        </g>
                    )}
                </svg>

                {/* Legend */}
                {vm.model.showLegend && (
                    <div className="ark-test-chart__legend">
                        <div className="ark-test-chart__legend-item">
                            <span className="ark-test-chart__legend-dot ark-test-chart__legend-dot--click" />
                            <span>Click Threshold</span>
                        </div>
                        <div className="ark-test-chart__legend-item">
                            <span className="ark-test-chart__legend-dot ark-test-chart__legend-dot--inversion" />
                            <span>Inversion Threshold</span>
                        </div>
                        <div className="ark-test-chart__legend-item">
                            <span className="ark-test-chart__legend-dot ark-test-chart__legend-dot--entry" />
                            <span>Entry Price</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }
));

TestChart.displayName = 'TestChart';
export default TestChart;
