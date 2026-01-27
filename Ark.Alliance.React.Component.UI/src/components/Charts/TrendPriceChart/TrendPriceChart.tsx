/**
 * @fileoverview TrendPriceChart Component
 * @module components/Charts/TrendPriceChart
 * 
 * Real-time price chart with trend prediction overlays.
 * Displays price evolution, prediction badges, and forecast validation.
 */

import { forwardRef, memo, useId } from 'react';
import { useTrendPriceChart, type UseTrendPriceChartOptions } from './TrendPriceChart.viewmodel';
import type { TrendPrediction } from './TrendPriceChart.model';
import { TREND_DIRECTION_COLORS } from './TrendPriceChart.model';
import './TrendPriceChart.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TrendPriceChart component props
 */
export interface TrendPriceChartProps extends UseTrendPriceChartOptions {
    /** Additional CSS class */
    className?: string;
    /** Chart width in pixels */
    width?: number;
    /** Callback when prediction badge is clicked */
    onPredictionClick?: (prediction: TrendPrediction) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const CHART_PADDING = 40;
const DEFAULT_WIDTH = 600;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TrendPriceChart - Real-time price chart with trend prediction overlays
 * 
 * Features:
 * - Real-time price line rendering
 * - Trend prediction badges at calculation timestamps
 * - Forecast horizon shading
 * - Validation indicators (✓/✗)
 * - Grid lines and legend
 * - Streaming support
 * 
 * @example
 * ```tsx
 * <TrendPriceChart
 *     symbol="BTCUSDT"
 *     precision="1m"
 *     priceData={prices}
 *     predictions={predictions}
 *     onPredictionClick={(pred) => showDetails(pred)}
 *     showGrid
 *     showLegend
 * />
 * ```
 */
export const TrendPriceChart = memo(forwardRef<HTMLDivElement, TrendPriceChartProps>(
    function TrendPriceChart(props, ref) {
        const {
            className = '',
            width = DEFAULT_WIDTH,
            onPredictionClick,
            ...chartOptions
        } = props;

        const vm = useTrendPriceChart({ ...chartOptions, onPredictionClick });
        const gradientId = useId();
        const priceGradientId = useId();

        const svgHeight = vm.model.height;
        const chartWidth = width - CHART_PADDING * 2;
        const chartHeight = svgHeight - CHART_PADDING * 2;

        /**
         * Handle prediction badge click
         * @param prediction - The clicked prediction
         */
        const handlePredictionClick = (prediction: TrendPrediction) => {
            if (onPredictionClick) {
                onPredictionClick(prediction);
            }
        };

        /**
         * Handle keyboard navigation for prediction badges
         * @param event - Keyboard event
         * @param prediction - The prediction
         */
        const handleBadgeKeyDown = (event: React.KeyboardEvent, prediction: TrendPrediction) => {
            if (onPredictionClick && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                onPredictionClick(prediction);
            }
        };

        return (
            <div
                ref={ref}
                className={`${vm.chartClasses} ${className}`}
                data-testid={vm.model.testId}
            >
                {/* Title */}
                {vm.model.title && (
                    <div className="ark-trend-chart__title">{vm.model.title}</div>
                )}

                {/* Symbol Badge */}
                {vm.model.symbol && (
                    <div className="ark-trend-chart__symbol">
                        {vm.model.symbol}
                        <span className="ark-trend-chart__precision">{vm.model.precision}</span>
                    </div>
                )}

                <svg
                    className="ark-trend-chart__svg"
                    viewBox={`0 0 ${width} ${svgHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Definitions */}
                    <defs>
                        {/* Price line gradient */}
                        <linearGradient id={priceGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>

                        {/* Area fill gradient */}
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    {/* Grid */}
                    {vm.model.showGrid && (
                        <g className="ark-trend-chart__grid">
                            {/* Horizontal grid lines */}
                            {[0.25, 0.5, 0.75].map(ratio => (
                                <line
                                    key={`h-${ratio}`}
                                    x1={CHART_PADDING}
                                    y1={CHART_PADDING + chartHeight * ratio}
                                    x2={CHART_PADDING + chartWidth}
                                    y2={CHART_PADDING + chartHeight * ratio}
                                    className="ark-trend-chart__grid-line"
                                />
                            ))}
                            {/* Vertical grid lines */}
                            {[0.25, 0.5, 0.75].map(ratio => (
                                <line
                                    key={`v-${ratio}`}
                                    x1={CHART_PADDING + chartWidth * ratio}
                                    y1={CHART_PADDING}
                                    x2={CHART_PADDING + chartWidth * ratio}
                                    y2={CHART_PADDING + chartHeight}
                                    className="ark-trend-chart__grid-line"
                                />
                            ))}
                        </g>
                    )}

                    {/* Forecast horizon shading */}
                    {vm.horizonAreas.map(area => (
                        <rect
                            key={`horizon-${area.predictionId}`}
                            x={area.startX}
                            y={CHART_PADDING}
                            width={Math.max(0, area.endX - area.startX)}
                            height={chartHeight}
                            fill={area.color}
                            opacity={area.opacity}
                            className="ark-trend-chart__horizon"
                        />
                    ))}

                    {/* Price area fill */}
                    {vm.pricePath && vm.priceData.length > 1 && (
                        <path
                            className="ark-trend-chart__area"
                            d={`${vm.pricePath} L ${vm.toSvgPoint(vm.priceData[vm.priceData.length - 1].timestamp, vm.scale.minY).x} ${CHART_PADDING + chartHeight} L ${vm.toSvgPoint(vm.priceData[0].timestamp, vm.scale.minY).x} ${CHART_PADDING + chartHeight} Z`}
                            fill={`url(#${gradientId})`}
                        />
                    )}

                    {/* Price line */}
                    {vm.pricePath && (
                        <path
                            className="ark-trend-chart__price-line"
                            d={vm.pricePath}
                            stroke={`url(#${priceGradientId})`}
                            strokeWidth={2}
                            fill="none"
                        />
                    )}

                    {/* Validation lines (from prediction to validation) */}
                    {vm.predictions.filter(p => p.isValidated && p.priceAtValidation !== undefined).map(p => {
                        const startPoint = vm.toSvgPoint(p.timestamp, p.priceAtPrediction);
                        const endPoint = vm.toSvgPoint(p.timestamp + p.horizonMs, p.priceAtValidation!);
                        return (
                            <line
                                key={`val-line-${p.id}`}
                                x1={startPoint.x}
                                y1={startPoint.y}
                                x2={endPoint.x}
                                y2={endPoint.y}
                                className={`ark-trend-chart__validation-line ${p.isCorrect ? 'ark-trend-chart__validation-line--correct' : 'ark-trend-chart__validation-line--wrong'}`}
                            />
                        );
                    })}

                    {/* Prediction badges */}
                    {vm.predictionBadges.map(badge => {
                        const colors = TREND_DIRECTION_COLORS[badge.direction];
                        return (
                            <g
                                key={badge.id}
                                className={`ark-trend-chart__badge ark-trend-chart__badge--${badge.direction.toLowerCase()}`}
                                transform={`translate(${badge.x}, ${badge.y})`}
                                onClick={() => handlePredictionClick(badge.prediction)}
                                onKeyDown={(e) => handleBadgeKeyDown(e, badge.prediction)}
                                tabIndex={onPredictionClick ? 0 : undefined}
                                role={onPredictionClick ? 'button' : undefined}
                                aria-label={`${badge.direction} prediction${badge.isValidated ? (badge.isCorrect ? ' - Correct' : ' - Wrong') : ' - Pending'}`}
                                style={{ cursor: onPredictionClick ? 'pointer' : 'default' }}
                            >
                                {/* Badge glow */}
                                <circle
                                    r={12}
                                    fill={colors.glow}
                                    opacity={0.5}
                                    className="ark-trend-chart__badge-glow"
                                />
                                {/* Badge circle */}
                                <circle
                                    r={8}
                                    fill={colors.primary}
                                    className="ark-trend-chart__badge-circle"
                                />
                                {/* Direction indicator */}
                                {badge.direction === 'LONG' && (
                                    <path d="M0,-4 L3,2 L-3,2 Z" fill="white" />
                                )}
                                {badge.direction === 'SHORT' && (
                                    <path d="M0,4 L3,-2 L-3,-2 Z" fill="white" />
                                )}
                                {badge.direction === 'WAIT' && (
                                    <rect x={-2} y={-2} width={4} height={4} fill="white" />
                                )}

                                {/* Validation indicator */}
                                {badge.isValidated && (
                                    <text
                                        x={12}
                                        y={4}
                                        className={`ark-trend-chart__validation-text ${badge.isCorrect ? 'ark-trend-chart__validation-text--correct' : 'ark-trend-chart__validation-text--wrong'}`}
                                        fill={badge.isCorrect ? '#22c55e' : '#ef4444'}
                                        fontSize={12}
                                        fontWeight="bold"
                                    >
                                        {badge.isCorrect ? '✓' : '✗'}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Streaming indicator */}
                    {vm.model.isStreaming && (
                        <g className="ark-trend-chart__streaming-indicator">
                            <circle
                                cx={width - 20}
                                cy={20}
                                r={4}
                                fill="#22c55e"
                                className="ark-trend-chart__streaming-dot"
                            />
                        </g>
                    )}
                </svg>

                {/* Legend */}
                {vm.model.showLegend && (
                    <div className="ark-trend-chart__legend">
                        <div className="ark-trend-chart__legend-item">
                            <span className="ark-trend-chart__legend-dot ark-trend-chart__legend-dot--long" />
                            <span>LONG</span>
                        </div>
                        <div className="ark-trend-chart__legend-item">
                            <span className="ark-trend-chart__legend-dot ark-trend-chart__legend-dot--short" />
                            <span>SHORT</span>
                        </div>
                        <div className="ark-trend-chart__legend-item">
                            <span className="ark-trend-chart__legend-dot ark-trend-chart__legend-dot--wait" />
                            <span>WAIT</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }
));

TrendPriceChart.displayName = 'TrendPriceChart';
export default TrendPriceChart;
