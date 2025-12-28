/**
 * @fileoverview Chart3D Data Service
 * @module components/Chart3D/services
 * 
 * Generates and streams mock data for Chart3D visualization.
 */

import type { DataPoint } from '../Chart3D.model';
import { MAX_HEIGHT, GRID_SIZE_Z } from '../Chart3D.constants';

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/** Calculate Z position based on series index */
function getZPosition(seriesIndex: number, totalSeries: number): number {
    if (totalSeries <= 1) return GRID_SIZE_Z / 2;
    const step = (GRID_SIZE_Z - 2) / (totalSeries - 1);
    return 1 + (seriesIndex * step);
}

/** Generate a unique ID */
function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate initial data set
 */
export function generateInitialData(xResolution: number, seriesCount: number): DataPoint[] {
    const data: DataPoint[] = [];
    const visualScaleX = 20 / Math.max(1, xResolution);

    for (let s = 0; s < seriesCount; s++) {
        const zPos = getZPosition(s, seriesCount);
        let prevVal = Math.random() * 5 + 2;

        for (let i = 0; i < xResolution; i++) {
            // Smooth random walk
            const change = (Math.random() - 0.5) * 4;
            let val = prevVal + change;
            val = Math.min(Math.max(val, 2), MAX_HEIGHT - 2);

            // Add sine wave for flow
            val += Math.sin(i * 0.3 + s) * 1.5;

            data.push({
                id: generateId(),
                x: i * visualScaleX,
                y: Math.max(0.5, val),
                z: zPos,
                open: val - Math.random() * 1.5,
                close: val + Math.random() * 1.5,
            });
            prevVal = val;
        }
    }

    return data;
}

/**
 * Update data stream - shift left and add new points
 */
export function updateDataStream(
    currentData: DataPoint[],
    xResolution: number,
    seriesCount: number
): DataPoint[] {
    const visualScaleX = 20 / Math.max(1, xResolution);

    // Shift existing data to the left
    const shiftedData = currentData
        .map(p => ({ ...p, x: p.x - visualScaleX }))
        .filter(p => p.x >= -visualScaleX);

    // Generate new points for the right edge
    const newPoints: DataPoint[] = [];
    const newX = (xResolution - 1) * visualScaleX;

    for (let s = 0; s < seriesCount; s++) {
        const zPos = getZPosition(s, seriesCount);

        // Find previous point for continuity
        const seriesPoints = shiftedData.filter(p => Math.abs(p.z - zPos) < 0.1);
        const lastPoint = seriesPoints[seriesPoints.length - 1];

        let baseVal = lastPoint ? lastPoint.y : 5;

        // Random walk
        const change = (Math.random() - 0.5) * 4;
        let val = baseVal + change;
        val = Math.min(Math.max(val, 2), MAX_HEIGHT - 2);

        newPoints.push({
            id: generateId(),
            x: newX,
            y: Math.max(0.5, val),
            z: zPos,
            open: val - Math.random() * 1.5,
            close: val + Math.random() * 1.5,
        });
    }

    return [...shiftedData, ...newPoints];
}
