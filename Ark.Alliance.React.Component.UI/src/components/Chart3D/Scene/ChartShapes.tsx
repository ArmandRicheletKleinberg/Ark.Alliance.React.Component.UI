/**
 * @fileoverview Chart3D Shape Renderer
 * @module components/Chart3D/Scene
 * 
 * Renders different shape types for data visualization.
 */

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox, Cylinder, Sphere } from '@react-three/drei';
import type { DataPoint, Chart3DModel } from '../Chart3D.model';
import { getHeightColor, MAX_HEIGHT } from '../Chart3D.constants';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ChartShapesProps {
    data: DataPoint[];
    config: Chart3DModel;
    onHover: (point: DataPoint | null) => void;
    hoveredPointId: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ChartShapes: React.FC<ChartShapesProps> = ({
    data,
    config,
    onHover,
    hoveredPointId
}) => {
    const meshRef = useRef<THREE.Group>(null);
    const { shape, scaleY, shapeOpacity, metalness, roughness, xResolution } = config;

    // Calculate dynamic width based on resolution
    const shapeWidth = useMemo(() => {
        const slotWidth = 20 / Math.max(1, xResolution);
        return Math.min(0.8, slotWidth * 0.7);
    }, [xResolution]);

    return (
        <group ref={meshRef}>
            {data.map((point) => {
                const height = point.y * scaleY;
                const color = getHeightColor(point.y, MAX_HEIGHT);
                const position: [number, number, number] = [point.x, height / 2, point.z];
                const isHovered = hoveredPointId === point.id;

                const finalColor = isHovered ? '#ffffff' : color;
                const finalEmissiveIntensity = isHovered ? 2.0 : 0.6;

                const commonProps = {
                    onPointerOver: (e: any) => {
                        e.stopPropagation();
                        onHover(point);
                    },
                    onPointerOut: () => {
                        onHover(null);
                    }
                };

                // Invisible hit spheres for Lines/Surface modes
                if (shape === 'Lines Only' || shape === 'Surface') {
                    return (
                        <Sphere
                            key={point.id}
                            position={[point.x, point.y * scaleY, point.z]}
                            args={[Math.max(0.2, shapeWidth), 8, 8]}
                            visible={false}
                            {...commonProps}
                        >
                            <meshBasicMaterial transparent opacity={0} />
                        </Sphere>
                    );
                }

                // Neon material props
                const neonMaterialProps = {
                    color: finalColor,
                    emissive: isHovered ? finalColor : color,
                    emissiveIntensity: finalEmissiveIntensity,
                    transparent: true,
                    opacity: shapeOpacity,
                    roughness: roughness,
                    metalness: metalness,
                    envMapIntensity: 1.5,
                };

                // Cuboid shape
                if (shape === 'Cuboid') {
                    return (
                        <RoundedBox
                            key={point.id}
                            position={position}
                            args={[shapeWidth, height, shapeWidth]}
                            radius={shapeWidth * 0.1}
                            smoothness={4}
                            {...commonProps}
                        >
                            <meshStandardMaterial {...neonMaterialProps} />
                        </RoundedBox>
                    );
                }

                // Cylinder shape
                if (shape === 'Cylinder') {
                    return (
                        <Cylinder
                            key={point.id}
                            position={position}
                            args={[shapeWidth / 2, shapeWidth / 2, height, 16]}
                            {...commonProps}
                        >
                            <meshStandardMaterial {...neonMaterialProps} />
                        </Cylinder>
                    );
                }

                // Bubble shape
                if (shape === 'Bubble') {
                    const bubblePos: [number, number, number] = [point.x, point.y * scaleY, point.z];
                    const size = Math.max(0.3, (point.y / MAX_HEIGHT) * 1.5);
                    return (
                        <Sphere
                            key={point.id}
                            position={bubblePos}
                            args={[size, 32, 32]}
                            {...commonProps}
                        >
                            <meshPhysicalMaterial
                                color={finalColor}
                                emissive={isHovered ? finalColor : color}
                                emissiveIntensity={isHovered ? 1.5 : 0.5}
                                transmission={0.6 * shapeOpacity}
                                transparent={true}
                                opacity={shapeOpacity}
                                thickness={1}
                                roughness={0}
                                metalness={0.2}
                                clearcoat={1}
                                clearcoatRoughness={0}
                                ior={1.5}
                                toneMapped={false}
                            />
                        </Sphere>
                    );
                }

                // Candle shape
                if (shape === 'Candle') {
                    const open = point.open || point.y * 0.8;
                    const close = point.close || point.y;
                    const candleHeight = Math.abs(close - open) * scaleY;
                    const wickHeight = height;
                    const centerY = ((open + close) / 2) * scaleY;
                    const isBullish = close >= open;

                    const baseCandleColor = isBullish ? '#00ff41' : '#ff0055';
                    const candleColor = isHovered ? '#ffffff' : baseCandleColor;

                    return (
                        <group key={point.id} position={[point.x, 0, point.z]} {...commonProps}>
                            {/* Wick */}
                            <mesh position={[0, wickHeight / 2, 0]}>
                                <boxGeometry args={[shapeWidth * 0.1, wickHeight, shapeWidth * 0.1]} />
                                <meshStandardMaterial
                                    color={candleColor}
                                    emissive={candleColor}
                                    emissiveIntensity={1}
                                    transparent={true}
                                    opacity={shapeOpacity}
                                />
                            </mesh>
                            {/* Body */}
                            <mesh position={[0, centerY, 0]}>
                                <boxGeometry args={[shapeWidth, Math.max(0.1, candleHeight), shapeWidth]} />
                                <meshStandardMaterial
                                    color={candleColor}
                                    emissive={candleColor}
                                    emissiveIntensity={isHovered ? 1.5 : 0.8}
                                    metalness={metalness}
                                    roughness={roughness}
                                    transparent={true}
                                    opacity={shapeOpacity}
                                    envMapIntensity={1.5}
                                />
                            </mesh>
                        </group>
                    );
                }

                return null;
            })}
        </group>
    );
};

export default ChartShapes;
