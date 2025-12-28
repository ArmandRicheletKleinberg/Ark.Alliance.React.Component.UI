/**
 * @fileoverview Chart3D Surface Ribbon Component
 * @module components/Chart3D/Scene
 * 
 * Renders a smooth ribbon surface connecting data points.
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import type { DataPoint, Chart3DModel } from '../Chart3D.model';
import { getHeightColor, MAX_HEIGHT } from '../Chart3D.constants';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface SurfaceRibbonProps {
    data: DataPoint[];
    config: Chart3DModel;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const SurfaceRibbon: React.FC<SurfaceRibbonProps> = ({ data, config }) => {
    const { showSurface, scaleY, lineThickness, shape } = config;

    // Group data by Z (series)
    const seriesData = useMemo(() => {
        if (!showSurface && shape !== 'Lines Only' && shape !== 'Surface') {
            return [];
        }

        const grouped: Map<number, DataPoint[]> = new Map();

        data.forEach(point => {
            const zRounded = Math.round(point.z * 10) / 10;
            if (!grouped.has(zRounded)) {
                grouped.set(zRounded, []);
            }
            grouped.get(zRounded)!.push(point);
        });

        // Sort each series by X
        grouped.forEach((points) => {
            points.sort((a, b) => a.x - b.x);
        });

        return Array.from(grouped.values());
    }, [data, showSurface, shape]);

    // Skip if no data or surface disabled
    if (seriesData.length === 0) return null;

    return (
        <group>
            {seriesData.map((series, seriesIndex) => {
                if (series.length < 2) return null;

                // Create line points
                const points: THREE.Vector3[] = series.map(
                    p => new THREE.Vector3(p.x, p.y * scaleY, p.z)
                );

                // Create color array for gradient
                const colors: THREE.Color[] = series.map(
                    p => new THREE.Color(getHeightColor(p.y, MAX_HEIGHT))
                );

                return (
                    <Line
                        key={`series-${seriesIndex}`}
                        points={points}
                        color="white"
                        vertexColors={colors}
                        lineWidth={lineThickness}
                        transparent
                        opacity={0.9}
                    />
                );
            })}
        </group>
    );
};

export default SurfaceRibbon;
