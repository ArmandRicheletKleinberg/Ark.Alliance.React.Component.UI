/**
 * @fileoverview Chart3D Threshold Lines Component
 * @module components/Chart3D/Scene/ThresholdLines
 * 
 * Renders horizontal lines at threshold price levels with labels.
 * Used for displaying indicator levels such as take-profit, stop-loss, or custom thresholds.
 * 
 * @example
 * ```tsx
 * <ThresholdLines
 *     thresholds={[
 *         { label: 'Take Profit', price: 45000, color: '#22c55e' },
 *         { label: 'Stop Loss', price: 42000, color: '#ef4444' },
 *     ]}
 *     priceRange={{ min: 40000, max: 50000 }}
 * />
 * ```
 */

import React from 'react';
import { Line, Text } from '@react-three/drei';
import type { PriceThreshold, PriceRange } from '../Chart3D.model';
import { MAX_HEIGHT, GRID_SIZE_X, GRID_SIZE_Z } from '../Chart3D.constants';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Props for the ThresholdLines component.
 */
export interface ThresholdLinesProps {
    /** Array of threshold configurations */
    thresholds: PriceThreshold[];
    /** Price range for Y-axis normalization */
    priceRange: PriceRange;
    /** Z-offset from chart data (default: GRID_SIZE_Z + 2) */
    zOffset?: number;
    /** Default line color when threshold.color is not specified */
    defaultColor?: string;
    /** Font size for labels */
    fontSize?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Converts a price value to Y-coordinate in 3D space.
 * @param price - The price value to convert
 * @param priceRange - The min/max price range for normalization
 * @returns Normalized Y coordinate
 */
function priceToY(price: number, priceRange: PriceRange): number {
    const { min, max } = priceRange;
    const range = max - min || 1;
    const normalized = ((price - min) / range) * (MAX_HEIGHT - 2) + 1;
    return Math.max(0.5, Math.min(normalized, MAX_HEIGHT - 0.5));
}

/**
 * Formats a price value for display.
 * @param price - The price value to format
 * @returns Formatted price string
 */
function formatPrice(price: number): string {
    if (price >= 1000) {
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(4);
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ThresholdLines - Renders horizontal indicator lines at price levels.
 * 
 * Features:
 * - Dashed, solid, or dotted line styles
 * - Labels on left side with price on right
 * - Subtle glow effect behind lines
 * - Customizable colors per threshold
 * 
 * @param props - ThresholdLines properties
 * @returns JSX.Element or null if no thresholds
 */
export const ThresholdLines: React.FC<ThresholdLinesProps> = ({
    thresholds,
    priceRange,
    zOffset = GRID_SIZE_Z + 2,
    defaultColor = '#ffffff',
    fontSize = 0.35,
}) => {
    // Early return if no thresholds
    if (!thresholds || thresholds.length === 0) {
        return null;
    }

    return (
        <group>
            {thresholds.map((threshold, index) => {
                const y = priceToY(threshold.price, priceRange);
                const color = threshold.color || defaultColor;
                const id = threshold.id || `threshold-${index}`;

                // Line points: from left edge to right edge at threshold Y level
                const linePoints: [number, number, number][] = [
                    [0, y, zOffset],
                    [GRID_SIZE_X, y, zOffset],
                ];

                // Determine line dashing based on style
                const isDashed = threshold.lineStyle === 'dashed' || threshold.lineStyle === undefined;
                const isDotted = threshold.lineStyle === 'dotted';

                return (
                    <group key={id}>
                        {/* Threshold Line */}
                        <Line
                            points={linePoints}
                            color={color}
                            lineWidth={2}
                            dashed={isDashed || isDotted}
                            dashScale={isDotted ? 6 : 3}
                            dashSize={isDotted ? 0.1 : 0.3}
                            gapSize={isDotted ? 0.15 : 0.2}
                        />

                        {/* Label at left side */}
                        <Text
                            position={[-0.5, y, zOffset]}
                            fontSize={fontSize}
                            color={color}
                            anchorX="right"
                            anchorY="middle"
                            outlineWidth={0.02}
                            outlineColor="#000000"
                        >
                            {threshold.label}
                        </Text>

                        {/* Price at right side (if showPrice is true) */}
                        {threshold.showPrice !== false && (
                            <Text
                                position={[GRID_SIZE_X + 0.5, y, zOffset]}
                                fontSize={fontSize * 0.85}
                                color={color}
                                anchorX="left"
                                anchorY="middle"
                                outlineWidth={0.02}
                                outlineColor="#000000"
                            >
                                ${formatPrice(threshold.price)}
                            </Text>
                        )}

                        {/* Glowing effect plane behind line */}
                        <mesh position={[GRID_SIZE_X / 2, y, zOffset - 0.1]}>
                            <planeGeometry args={[GRID_SIZE_X, 0.1]} />
                            <meshBasicMaterial
                                color={color}
                                transparent
                                opacity={0.15}
                            />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
};

ThresholdLines.displayName = 'ThresholdLines';

export default ThresholdLines;
