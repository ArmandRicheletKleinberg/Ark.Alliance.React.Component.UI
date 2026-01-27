/**
 * @fileoverview FinancialChart Component
 * @module components/Charts/FinancialChart
 * 
 * Complete financial price chart with candlesticks, line/area modes,
 * moving averages, trend signals, and threshold lines.
 */

import { forwardRef, memo, useId } from 'react';
import { useFinancialChart, type UseFinancialChartOptions } from './FinancialChart.viewmodel';
import { CandlestickRenderer } from '../primitives/CandlestickRenderer';
import { ConnectionIndicator, type ConnectionStatus } from '../primitives/ConnectionIndicator';
import type { TrendPrediction } from '../TrendPriceChart/TrendPriceChart.model';
import { TREND_DIRECTION_COLORS } from '../TrendPriceChart/TrendPriceChart.model';
import { FINANCIAL_CHART_COLORS } from './FinancialChart.model';
import './FinancialChart.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FinancialChart component props
 */
export interface FinancialChartProps extends UseFinancialChartOptions {
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
 * FinancialChart - Complete financial price visualization component
 * 
 * Features:
 * - Candlestick, line, or area chart modes
 * - Moving average overlays (SMA/EMA)
 * - Trend signal detection and badges
 * - Custom threshold reference lines
 * - Connection status indicator
 * - Customizable styling
 * 
 * @example
 * ```tsx
 * <FinancialChart
 *     symbol="BTCUSDT"
 *     interval="1m"
 *     chartType="candlestick"
 *     candlestickData={data}
 *     headerTitle="Bitcoin Futures"
 *     showGrid
 *     showLegend
 * />
 * ```
 */
export const FinancialChart = memo(forwardRef<HTMLDivElement, FinancialChartProps>(
    function FinancialChart(props, ref) {
        const {
            className = '',
            width = DEFAULT_WIDTH,
            onPredictionClick,
            ...chartOptions
        } = props;

        const vm = useFinancialChart({ ...chartOptions, onPredictionClick });
        const gradientId = useId();
        const priceGradientId = useId();

        const svgHeight = vm.model.height;
        const chartWidth = width - CHART_PADDING * 2;
        const chartHeight = svgHeight - CHART_PADDING * 2;

        // Compute box shadow style
        const boxShadow = `0 0 ${vm.model.boxShadowIntensity}px ${vm.model.boxShadowIntensity / 5}px rgba(0,0,0,0.5)`;

        // Connection status
        const connectionStatus: ConnectionStatus = vm.model.isConnected ? 'connected' : 'disconnected';

        /**
         * Handle prediction badge click
         */
        const handlePredictionClick = (prediction: TrendPrediction) => {
            if (onPredictionClick) {
                onPredictionClick(prediction);
            }
        };

        /**
         * Format time for X-axis
         */
        const formatTime = (time: number): string => {
            const date = new Date(time);
            if (vm.model.interval === '1s') {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (
            <div
                ref={ref}
                className={`${vm.chartClasses} ${className}`}
                data-testid={vm.model.testId}
                style={{
                    border: `${vm.model.borderWidth}px solid ${vm.model.borderColor}`,
                    borderRadius: `${vm.model.borderRadius}px`,
                    boxShadow,
                    overflow: 'hidden',
                }}
            >
                {/* Background Image Layer */}
                {vm.model.backgroundImage && (
                    <div
                        className="ark-financial-chart__bg-image"
                        style={{
                            backgroundImage: `url(${vm.model.backgroundImage})`,
                            opacity: vm.model.bgImageOpacity / 100,
                            transform: `scale(${vm.model.bgImageZoom})`,
                        }}
                    />
                )}

                {/* Header */}
                <div className="ark-financial-chart__header">
                    <div className="ark-financial-chart__header-left">
                        {vm.model.headerTitle && (
                            <h1 className="ark-financial-chart__title">{vm.model.headerTitle}</h1>
                        )}
                        {vm.model.symbol && (
                            <span className="ark-financial-chart__symbol-badge">
                                {vm.model.symbol.toUpperCase()} • {vm.model.interval}
                            </span>
                        )}
                        {vm.currentPrice !== null && (
                            <span className="ark-financial-chart__current-price">
                                {vm.currentPrice.toFixed(2)}
                            </span>
                        )}
                        {vm.priceChangePercent !== null && (
                            <span className={`ark-financial-chart__price-change ${vm.priceChangePercent >= 0 ? 'ark-financial-chart__price-change--positive' : 'ark-financial-chart__price-change--negative'}`}>
                                {vm.priceChangePercent >= 0 ? '+' : ''}{vm.priceChangePercent.toFixed(2)}%
                            </span>
                        )}
                        {vm.model.useLogScale && (
                            <span className="ark-financial-chart__log-badge">LOG</span>
                        )}
                    </div>
                    <div className="ark-financial-chart__header-right">
                        <ConnectionIndicator status={connectionStatus} size="sm" />
                    </div>
                </div>

                {/* Loading Overlay */}
                {vm.model.isLoadingHistory && (
                    <div className="ark-financial-chart__loading">
                        <div className="ark-financial-chart__loading-spinner" />
                        <span>Loading History...</span>
                    </div>
                )}

                {/* Chart Area */}
                <div className="ark-financial-chart__chart-container">
                    {vm.model.chartType === 'candlestick' ? (
                        <CandlestickRenderer
                            data={vm.candlestickData}
                            width={width}
                            height={svgHeight}
                            padding={CHART_PADDING}
                            showWicks
                            showVolume={vm.model.showVolume}
                        />
                    ) : (
                        <svg
                            className="ark-financial-chart__svg"
                            viewBox={`0 0 ${width} ${svgHeight}`}
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {/* Definitions */}
                            <defs>
                                <linearGradient id={priceGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor={FINANCIAL_CHART_COLORS.priceLine} />
                                    <stop offset="100%" stopColor="#60a5fa" />
                                </linearGradient>
                                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor={FINANCIAL_CHART_COLORS.areaFillStart} />
                                    <stop offset="100%" stopColor={FINANCIAL_CHART_COLORS.areaFillEnd} />
                                </linearGradient>
                            </defs>

                            {/* Grid */}
                            {vm.model.showGrid && (
                                <g className="ark-financial-chart__grid">
                                    {[0.25, 0.5, 0.75].map(ratio => (
                                        <line
                                            key={`h-${ratio}`}
                                            x1={CHART_PADDING}
                                            y1={CHART_PADDING + chartHeight * ratio}
                                            x2={CHART_PADDING + chartWidth}
                                            y2={CHART_PADDING + chartHeight * ratio}
                                            stroke={FINANCIAL_CHART_COLORS.grid}
                                            strokeDasharray="3 3"
                                        />
                                    ))}
                                    {[0.25, 0.5, 0.75].map(ratio => (
                                        <line
                                            key={`v-${ratio}`}
                                            x1={CHART_PADDING + chartWidth * ratio}
                                            y1={CHART_PADDING}
                                            x2={CHART_PADDING + chartWidth * ratio}
                                            y2={CHART_PADDING + chartHeight}
                                            stroke={FINANCIAL_CHART_COLORS.grid}
                                            strokeDasharray="3 3"
                                        />
                                    ))}
                                </g>
                            )}

                            {/* Area Fill (if area mode) */}
                            {vm.model.chartType === 'area' && vm.areaPath && (
                                <path
                                    className="ark-financial-chart__area"
                                    d={vm.areaPath}
                                    fill={`url(#${gradientId})`}
                                />
                            )}

                            {/* Price Line */}
                            {vm.pricePath && (
                                <path
                                    className="ark-financial-chart__price-line"
                                    d={vm.pricePath}
                                    stroke={`url(#${priceGradientId})`}
                                    strokeWidth={2}
                                    fill="none"
                                />
                            )}

                            {/* Fast MA */}
                            {vm.model.fastMA.enabled && vm.fastMAPath && (
                                <path
                                    className="ark-financial-chart__ma-line ark-financial-chart__ma-line--fast"
                                    d={vm.fastMAPath}
                                    stroke={vm.model.fastMA.color}
                                    strokeWidth={1.5}
                                    fill="none"
                                    strokeDasharray="4 2"
                                />
                            )}

                            {/* Slow MA */}
                            {vm.model.slowMA.enabled && vm.slowMAPath && (
                                <path
                                    className="ark-financial-chart__ma-line ark-financial-chart__ma-line--slow"
                                    d={vm.slowMAPath}
                                    stroke={vm.model.slowMA.color}
                                    strokeWidth={1.5}
                                    fill="none"
                                    strokeDasharray="4 2"
                                />
                            )}

                            {/* Threshold Lines */}
                            {vm.thresholdLines.map(threshold => {
                                const y = vm.toSvgPoint(0, threshold.price).y;
                                const dashArray = threshold.style === 'solid' ? '' : threshold.style === 'dashed' ? '5 5' : '1 3';
                                return (
                                    <g key={threshold.id} className="ark-financial-chart__threshold">
                                        <line
                                            x1={CHART_PADDING}
                                            y1={y}
                                            x2={CHART_PADDING + chartWidth}
                                            y2={y}
                                            stroke={threshold.color}
                                            strokeDasharray={dashArray}
                                        />
                                        <text
                                            x={CHART_PADDING + 5}
                                            y={y - 5}
                                            fill={threshold.color}
                                            fontSize={10}
                                        >
                                            {threshold.label}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Current Price Line */}
                            {vm.currentPrice !== null && (
                                <line
                                    className="ark-financial-chart__current-price-line"
                                    x1={CHART_PADDING}
                                    y1={vm.toSvgPoint(0, vm.currentPrice).y}
                                    x2={CHART_PADDING + chartWidth}
                                    y2={vm.toSvgPoint(0, vm.currentPrice).y}
                                    stroke={FINANCIAL_CHART_COLORS.currentPrice}
                                    strokeDasharray="3 3"
                                    strokeOpacity={0.5}
                                />
                            )}

                            {/* Prediction Badges */}
                            {vm.predictions.map(prediction => {
                                const { x, y } = vm.toSvgPoint(prediction.timestamp, prediction.priceAtPrediction);
                                const colors = TREND_DIRECTION_COLORS[prediction.direction];
                                return (
                                    <g
                                        key={prediction.id}
                                        className={`ark-financial-chart__badge ark-financial-chart__badge--${prediction.direction.toLowerCase()}`}
                                        transform={`translate(${x}, ${y})`}
                                        onClick={() => handlePredictionClick(prediction)}
                                        style={{ cursor: onPredictionClick ? 'pointer' : 'default' }}
                                    >
                                        <circle r={10} fill={colors.glow} opacity={0.5} />
                                        <circle r={6} fill={colors.primary} />
                                        {prediction.direction === 'LONG' && (
                                            <path d="M0,-3 L2.5,2 L-2.5,2 Z" fill="white" />
                                        )}
                                        {prediction.direction === 'SHORT' && (
                                            <path d="M0,3 L2.5,-2 L-2.5,-2 Z" fill="white" />
                                        )}
                                        {prediction.direction === 'WAIT' && (
                                            <rect x={-1.5} y={-1.5} width={3} height={3} fill="white" />
                                        )}
                                        {prediction.isValidated && (
                                            <text
                                                x={10}
                                                y={3}
                                                fill={prediction.isCorrect ? '#22c55e' : '#ef4444'}
                                                fontSize={10}
                                                fontWeight="bold"
                                            >
                                                {prediction.isCorrect ? '✓' : '✗'}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                    )}
                </div>

                {/* Legend */}
                {vm.model.showLegend && (
                    <div className="ark-financial-chart__legend">
                        {vm.model.fastMA.enabled && (
                            <div className="ark-financial-chart__legend-item">
                                <span className="ark-financial-chart__legend-line" style={{ backgroundColor: vm.model.fastMA.color }} />
                                <span>{vm.model.fastMA.type}{vm.model.fastMA.period}</span>
                            </div>
                        )}
                        {vm.model.slowMA.enabled && (
                            <div className="ark-financial-chart__legend-item">
                                <span className="ark-financial-chart__legend-line" style={{ backgroundColor: vm.model.slowMA.color }} />
                                <span>{vm.model.slowMA.type}{vm.model.slowMA.period}</span>
                            </div>
                        )}
                        <div className="ark-financial-chart__legend-item">
                            <span className="ark-financial-chart__legend-dot ark-financial-chart__legend-dot--long" />
                            <span>LONG</span>
                        </div>
                        <div className="ark-financial-chart__legend-item">
                            <span className="ark-financial-chart__legend-dot ark-financial-chart__legend-dot--short" />
                            <span>SHORT</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }
));

FinancialChart.displayName = 'FinancialChart';
export default FinancialChart;
