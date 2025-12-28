/**
 * @fileoverview Chart3D Axis System Component
 * @module components/Chart3D/Scene
 * 
 * Renders grid, axes, and labels for the 3D chart.
 */

import { useMemo, Suspense } from 'react';
import { Text, Grid, Image } from '@react-three/drei';
import * as THREE from 'three';
import { GRID_SIZE_X, GRID_SIZE_Z, THEME_COLORS, MAX_HEIGHT, FONT_URLS } from '../Chart3D.constants';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface AxisSystemProps {
    brightness?: number;
    fontFamily: string;
    fontSizeLabels: number;
    fontSizeValues: number;
    bgImageOpacity: number;
    bgImageUrl: string | null;
    bgImageScale: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const AxisSystem: React.FC<AxisSystemProps> = ({
    brightness = 0.5,
    fontFamily,
    fontSizeLabels,
    fontSizeValues,
    bgImageOpacity,
    bgImageUrl,
    bgImageScale = 1.0
}) => {
    // Calculate grid colors based on brightness
    const { cellColor, sectionColor } = useMemo(() => {
        const baseColor = new THREE.Color(THEME_COLORS.grid);
        const intense = Math.max(0.1, brightness);

        return {
            cellColor: baseColor.clone().multiplyScalar(intense),
            sectionColor: new THREE.Color(THEME_COLORS.secondary).multiplyScalar(intense * 0.8)
        };
    }, [brightness]);

    // Resolve font URL
    const fontUrl = FONT_URLS[fontFamily] || FONT_URLS['Inter'];

    return (
        <group position={[0, 0, 0]}>
            {/* Background Image on Y-Axis Grid */}
            {bgImageUrl && (
                <Suspense fallback={null}>
                    <group position={[GRID_SIZE_X / 2 - 0.5, MAX_HEIGHT / 2, -0.6]}>
                        <Image
                            url={bgImageUrl}
                            scale={[GRID_SIZE_X * bgImageScale, MAX_HEIGHT * bgImageScale]}
                            transparent
                            opacity={bgImageOpacity}
                            toneMapped={false}
                            color="#ffffff"
                        />
                    </group>
                </Suspense>
            )}

            {/* Floor Grid */}
            <Grid
                position={[GRID_SIZE_X / 2 - 0.5, 0, GRID_SIZE_Z / 2 - 0.5]}
                args={[GRID_SIZE_X, GRID_SIZE_Z]}
                cellColor={cellColor}
                sectionColor={sectionColor}
                sectionThickness={1}
                cellThickness={0.5}
                fadeDistance={50}
                infiniteGrid={false}
            />

            {/* Back Grid (XY Plane) */}
            <Grid
                position={[GRID_SIZE_X / 2 - 0.5, MAX_HEIGHT / 2, -0.5]}
                rotation={[Math.PI / 2, 0, 0]}
                args={[GRID_SIZE_X, MAX_HEIGHT]}
                cellColor={cellColor}
                sectionColor={cellColor}
                sectionThickness={0.5}
                fadeDistance={50}
            />

            {/* Side Grid (ZY Plane) */}
            <Grid
                position={[-0.5, MAX_HEIGHT / 2, GRID_SIZE_Z / 2 - 0.5]}
                rotation={[0, 0, Math.PI / 2]}
                args={[MAX_HEIGHT, GRID_SIZE_Z]}
                cellColor={cellColor}
                sectionColor={cellColor}
                sectionThickness={0.5}
                fadeDistance={50}
            />

            {/* Axis Labels */}
            <Text
                position={[-2, 1, GRID_SIZE_Z / 2]}
                color={THEME_COLORS.text}
                fontSize={fontSizeLabels}
                font={fontUrl}
                rotation={[0, Math.PI / 2, 0]}
            >
                Z (Series)
            </Text>

            <Text
                position={[GRID_SIZE_X / 2, 1, GRID_SIZE_Z + 2]}
                color={THEME_COLORS.text}
                fontSize={fontSizeLabels}
                font={fontUrl}
            >
                X (Time)
            </Text>

            <Text
                position={[-2, MAX_HEIGHT / 2, -1]}
                color={THEME_COLORS.text}
                fontSize={fontSizeLabels}
                font={fontUrl}
            >
                Y (Value)
            </Text>

            {/* Value Markers */}
            {[5, 10, 15].map((val) => (
                <Text
                    key={val}
                    position={[-1, val, -1]}
                    color={THEME_COLORS.text}
                    fontSize={fontSizeValues}
                    font={fontUrl}
                    fillOpacity={Math.max(0.3, brightness)}
                >
                    {val.toFixed(1)}
                </Text>
            ))}
        </group>
    );
};

export default AxisSystem;
