/**
 * @fileoverview Chart3D Event Markers Component
 * @module components/Chart3D/Scene/EventMarkers
 * 
 * Renders 3D spherical bubbles at event price levels with animations.
 * Supports click, order, inversion, and custom event types.
 * 
 * @example
 * ```tsx
 * <EventMarkers
 *     markers={[
 *         { id: '1', type: 'click', price: 45000, timestamp: Date.now(), color: '#22c55e' },
 *         { id: '2', type: 'order', price: 44500, timestamp: Date.now(), color: '#ef4444', side: 'SELL' },
 *     ]}
 *     priceRange={{ min: 40000, max: 50000 }}
 *     onMarkerSelect={(marker) => console.log('Selected:', marker)}
 * />
 * ```
 */

import React, { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ChartEventMarker, PriceRange } from '../Chart3D.model';
import { MAX_HEIGHT, GRID_SIZE_X, GRID_SIZE_Z } from '../Chart3D.constants';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Props for the EventMarkers component.
 */
export interface EventMarkersProps {
    /** Array of event marker configurations */
    markers: ChartEventMarker[];
    /** Price range for Y-axis normalization */
    priceRange: PriceRange;
    /** Number of data points (used for X positioning) */
    dataLength?: number;
    /** Currently selected marker ID */
    selectedMarkerId?: string | null;
    /** Callback when a marker is selected */
    onMarkerSelect?: (marker: ChartEventMarker | null) => void;
    /** Z-offset from chart data (default: GRID_SIZE_Z + 3) */
    zOffset?: number;
    /** Base bubble size (default: 0.15) */
    bubbleSize?: number;
}

/**
 * Props for individual EventBubble component.
 */
interface EventBubbleProps {
    /** The marker data */
    marker: ChartEventMarker;
    /** 3D position [x, y, z] */
    position: [number, number, number];
    /** Whether this bubble is currently selected */
    isSelected: boolean;
    /** Click handler */
    onClick: () => void;
    /** Base bubble size */
    bubbleSize: number;
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
 * Calculates X position based on marker index.
 * @param index - Marker index
 * @param totalMarkers - Total number of markers
 * @returns X position in chart space
 */
function getXPosition(index: number, totalMarkers: number): number {
    const xRatio = Math.min(1, (index + 1) / Math.max(1, totalMarkers));
    return (GRID_SIZE_X * 0.9) * xRatio + GRID_SIZE_X * 0.05;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * EventBubble - Individual animated marker bubble.
 * Features subtle floating animation and glow effect.
 */
const EventBubble: React.FC<EventBubbleProps> = ({
    marker,
    position,
    isSelected,
    onClick,
    bubbleSize,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Subtle floating animation
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
        }
        if (glowRef.current) {
            glowRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
            // Pulsing glow effect - stronger when selected
            const baseScale = isSelected ? 1.3 : 1;
            const scale = baseScale + Math.sin(state.clock.elapsedTime * 3) * 0.1;
            glowRef.current.scale.setScalar(scale);
        }
    });

    const currentSize = isSelected ? bubbleSize * 1.33 : (isHovered ? bubbleSize * 1.2 : bubbleSize);

    /**
     * Handles pointer enter event.
     */
    const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
    };

    /**
     * Handles pointer leave event.
     */
    const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setIsHovered(false);
        document.body.style.cursor = 'auto';
    };

    /**
     * Handles click event.
     */
    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick();
    };

    return (
        <group position={position}>
            {/* Outer glow */}
            <Sphere ref={glowRef} args={[currentSize * 1.5, 16, 16]}>
                <meshBasicMaterial
                    color={marker.color}
                    transparent
                    opacity={isSelected ? 0.4 : 0.2}
                />
            </Sphere>

            {/* Main bubble - clickable */}
            <Sphere
                ref={meshRef}
                args={[currentSize, 32, 32]}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onClick={handleClick}
            >
                <meshStandardMaterial
                    color={marker.color}
                    emissive={marker.color}
                    emissiveIntensity={isSelected ? 0.8 : 0.5}
                    metalness={0.8}
                    roughness={0.2}
                />
            </Sphere>

            {/* Label - visible when selected or hovered */}
            {marker.label && (isSelected || isHovered) && (
                <Text
                    position={[0, currentSize + 0.3, 0]}
                    fontSize={0.2}
                    color={marker.color}
                    anchorX="center"
                    anchorY="bottom"
                    outlineWidth={0.01}
                    outlineColor="#000000"
                >
                    {marker.label}
                </Text>
            )}
        </group>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * EventMarkers - Renders 3D event bubbles on the chart.
 * 
 * Features:
 * - Animated floating bubbles with glow effects
 * - Click-to-select with callback
 * - Hover labels
 * - Customizable colors per marker
 * 
 * @param props - EventMarkers properties
 * @returns JSX.Element or null if no markers
 */
export const EventMarkers: React.FC<EventMarkersProps> = ({
    markers,
    priceRange,
    dataLength = 0,
    selectedMarkerId = null,
    onMarkerSelect,
    zOffset = GRID_SIZE_Z + 3,
    bubbleSize = 0.15,
}) => {
    // Early return if no markers
    if (!markers || markers.length === 0) {
        return null;
    }

    /**
     * Handles marker click - toggles selection.
     */
    const handleMarkerClick = (marker: ChartEventMarker) => {
        if (onMarkerSelect) {
            if (selectedMarkerId === marker.id) {
                onMarkerSelect(null);
            } else {
                onMarkerSelect(marker);
            }
        }
    };

    return (
        <group>
            {markers.map((marker, index) => {
                const y = priceToY(marker.price, priceRange);
                const x = getXPosition(index, markers.length);

                return (
                    <EventBubble
                        key={marker.id}
                        marker={marker}
                        position={[x, y, zOffset]}
                        isSelected={selectedMarkerId === marker.id}
                        onClick={() => handleMarkerClick(marker)}
                        bubbleSize={bubbleSize}
                    />
                );
            })}
        </group>
    );
};

EventMarkers.displayName = 'EventMarkers';

export default EventMarkers;
