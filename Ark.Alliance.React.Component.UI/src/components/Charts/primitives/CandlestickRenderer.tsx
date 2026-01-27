/**
 * @fileoverview CandlestickRenderer Component
 * @module components/Charts/primitives/CandlestickRenderer
 * 
 * SVG-based candlestick chart rendering primitive.
 * Renders OHLCV candlesticks with configurable colors and optional volume bars.
 */

import { forwardRef, memo } from 'react';
import { useCandlestickRenderer, type UseCandlestickRendererOptions } from './CandlestickRenderer.viewmodel';
import type { CandlestickDataPoint } from './CandlestickRenderer.model';
import './CandlestickRenderer.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CandlestickRenderer component props
 */
export interface CandlestickRendererProps extends UseCandlestickRendererOptions {
    /** Additional CSS class */
    className?: string;
    /** Callback when candle is clicked */
    onCandleClick?: (candle: CandlestickDataPoint, index: number) => void;
    /** Callback when candle is hovered */
    onCandleHover?: (candle: CandlestickDataPoint | null, index: number) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CandlestickRenderer - SVG-based candlestick chart primitive
 * 
 * Features:
 * - Bullish (green) and bearish (red) candle coloring
 * - Wick/shadow lines for high/low
 * - Optional volume bars
 * - Doji detection
 * - Click and hover callbacks
 * 
 * @example
 * ```tsx
 * <CandlestickRenderer
 *     data={ohlcvData}
 *     candleWidth={6}
 *     showVolume
 *     onCandleClick={(candle) => console.log(candle)}
 * />
 * ```
 */
export const CandlestickRenderer = memo(forwardRef<SVGSVGElement, CandlestickRendererProps>(
    function CandlestickRenderer(props, ref) {
        const {
            className = '',
            onCandleClick,
            onCandleHover,
            ...rendererOptions
        } = props;

        const vm = useCandlestickRenderer(rendererOptions);

        /**
         * Handle candle click
         */
        const handleCandleClick = (candle: CandlestickDataPoint, index: number) => {
            if (onCandleClick) {
                onCandleClick(candle, index);
            }
        };

        /**
         * Handle candle mouse enter
         */
        const handleCandleMouseEnter = (candle: CandlestickDataPoint, index: number) => {
            if (onCandleHover) {
                onCandleHover(candle, index);
            }
        };

        /**
         * Handle candle mouse leave
         */
        const handleCandleMouseLeave = () => {
            if (onCandleHover) {
                onCandleHover(null, -1);
            }
        };

        return (
            <svg
                ref={ref}
                className={`${vm.containerClasses} ${className}`}
                viewBox={`0 0 ${vm.model.width} ${vm.model.height}`}
                preserveAspectRatio="xMidYMid meet"
                data-testid={vm.model.testId}
            >
                {/* Volume bars (rendered first, behind candles) */}
                {vm.model.showVolume && (
                    <g className="ark-candlestick-renderer__volume-layer">
                        {vm.candles.map((candle) => (
                            candle.volumeHeight !== undefined && (
                                <rect
                                    key={`vol-${candle.index}`}
                                    className="ark-candlestick-renderer__volume-bar"
                                    x={candle.x - vm.model.candleWidth / 2}
                                    y={vm.model.height - vm.model.padding - candle.volumeHeight}
                                    width={vm.model.candleWidth}
                                    height={candle.volumeHeight}
                                    fill={candle.color}
                                    opacity={0.3}
                                />
                            )
                        ))}
                    </g>
                )}

                {/* Candlesticks */}
                <g className="ark-candlestick-renderer__candle-layer">
                    {vm.candles.map((candle) => (
                        <g
                            key={`candle-${candle.index}`}
                            className={`ark-candlestick-renderer__candle ${candle.isBullish ? 'ark-candlestick-renderer__candle--bullish' : 'ark-candlestick-renderer__candle--bearish'} ${candle.isDoji ? 'ark-candlestick-renderer__candle--doji' : ''}`}
                            onClick={() => handleCandleClick(candle.data, candle.index)}
                            onMouseEnter={() => handleCandleMouseEnter(candle.data, candle.index)}
                            onMouseLeave={handleCandleMouseLeave}
                            style={{ cursor: onCandleClick ? 'pointer' : 'default' }}
                        >
                            {/* Wick (high to low) */}
                            {vm.model.showWicks && (
                                <line
                                    className="ark-candlestick-renderer__wick"
                                    x1={candle.x}
                                    y1={candle.wickTop}
                                    x2={candle.x}
                                    y2={candle.wickBottom}
                                    stroke={vm.model.colors.wick}
                                    strokeWidth={vm.model.wickWidth}
                                />
                            )}

                            {/* Candle body */}
                            {candle.isDoji ? (
                                // Doji: horizontal line
                                <line
                                    className="ark-candlestick-renderer__body ark-candlestick-renderer__body--doji"
                                    x1={candle.x - vm.model.candleWidth / 2}
                                    y1={candle.bodyTop}
                                    x2={candle.x + vm.model.candleWidth / 2}
                                    y2={candle.bodyTop}
                                    stroke={candle.color}
                                    strokeWidth={2}
                                />
                            ) : (
                                // Regular candle: rectangle
                                <rect
                                    className="ark-candlestick-renderer__body"
                                    x={candle.x - vm.model.candleWidth / 2}
                                    y={candle.bodyTop}
                                    width={vm.model.candleWidth}
                                    height={Math.max(1, candle.bodyBottom - candle.bodyTop)}
                                    fill={candle.color}
                                />
                            )}
                        </g>
                    ))}
                </g>
            </svg>
        );
    }
));

CandlestickRenderer.displayName = 'CandlestickRenderer';
export default CandlestickRenderer;
