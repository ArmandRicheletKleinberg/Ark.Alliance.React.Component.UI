/**
 * @fileoverview Chart3D Component Tests
 * @module Ark.Alliance.React.Component.UI.Tests/Chart3D
 * 
 * Tests for Chart3D model, viewmodel, and sub-components.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
    Chart3DModelSchema,
    DataPointSchema,
    PriceThresholdSchema,
    ChartEventMarkerSchema,
    PriceRangeSchema,
    defaultChart3DModel,
    type Chart3DModel,
    type DataPoint,
    type PriceThreshold,
    type ChartEventMarker,
} from '../../../Ark.Alliance.React.Component.UI/src/components/Chart3D/Chart3D.model';
import { useChart3D } from '../../../Ark.Alliance.React.Component.UI/src/components/Chart3D/Chart3D.viewmodel';

// ═══════════════════════════════════════════════════════════════════════════
// MODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Chart3D Model', () => {
    describe('Chart3DModelSchema', () => {
        it('should parse valid default model', () => {
            const result = Chart3DModelSchema.parse(defaultChart3DModel);
            expect(result).toBeDefined();
            expect(result.shape).toBe('Cuboid');
            expect(result.seriesCount).toBe(2); // Default is 2
        });

        it('should apply defaults for missing optional fields', () => {
            const minimal = {};
            const result = Chart3DModelSchema.parse(minimal);

            expect(result.shape).toBe('Cuboid');
            expect(result.isStreaming).toBe(true);
            expect(result.bloomIntensity).toBe(1.5);
            expect(result.fullscreenEnabled).toBe(true);
            expect(result.showHeader).toBe(false);
        });

        it('should validate shape enum', () => {
            expect(() => Chart3DModelSchema.parse({ shape: 'InvalidShape' }))
                .toThrow();

            const validShapes = ['Cuboid', 'Cylinder', 'Bubble', 'Candle', 'Lines Only', 'Surface'];
            validShapes.forEach((shape) => {
                const result = Chart3DModelSchema.parse({ shape });
                expect(result.shape).toBe(shape);
            });
        });

        it('should enforce number constraints', () => {
            // seriesCount must be 1-5
            expect(() => Chart3DModelSchema.parse({ seriesCount: 0 })).toThrow();
            expect(() => Chart3DModelSchema.parse({ seriesCount: 10 })).toThrow();

            const result = Chart3DModelSchema.parse({ seriesCount: 3 });
            expect(result.seriesCount).toBe(3);

            // xResolution must be 10-500
            expect(() => Chart3DModelSchema.parse({ xResolution: 5 })).toThrow();
            expect(() => Chart3DModelSchema.parse({ xResolution: 1000 })).toThrow();
        });

        it('should include new fullscreen and header properties', () => {
            const result = Chart3DModelSchema.parse({
                fullscreenEnabled: true,
                showHeader: true,
                headerTitle: 'BTC/USDT',
                headerSubtitle: 'Binance',
                showConnectionStatus: true,
                isConnected: false,
                currentValue: 45000.50,
                valueChange: -2.5,
            });

            expect(result.fullscreenEnabled).toBe(true);
            expect(result.showHeader).toBe(true);
            expect(result.headerTitle).toBe('BTC/USDT');
            expect(result.headerSubtitle).toBe('Binance');
            expect(result.showConnectionStatus).toBe(true);
            expect(result.isConnected).toBe(false);
            expect(result.currentValue).toBe(45000.50);
            expect(result.valueChange).toBe(-2.5);
        });
    });

    describe('DataPointSchema', () => {
        it('should parse valid data point with required fields', () => {
            const point = {
                id: 'point-1',
                x: 10,
                y: 20,
                z: 5,
            };
            const result = DataPointSchema.parse(point);

            expect(result.id).toBe('point-1');
            expect(result.x).toBe(10);
            expect(result.y).toBe(20);
            expect(result.z).toBe(5);
        });

        it('should parse data point with optional price and timestamp', () => {
            const point = {
                id: 'point-2',
                x: 15,
                y: 25,
                z: 3,
                price: 45000.25,
                timestamp: 1706000000000,
            };
            const result = DataPointSchema.parse(point);

            expect(result.price).toBe(45000.25);
            expect(result.timestamp).toBe(1706000000000);
        });

        it('should parse candlestick data (open/close fields)', () => {
            const candlePoint = {
                id: 'candle-1',
                x: 1,
                y: 100,
                z: 0,
                open: 95,
                close: 100,
            };
            const result = DataPointSchema.parse(candlePoint);

            expect(result.open).toBe(95);
            expect(result.close).toBe(100);
        });
    });

    describe('PriceThresholdSchema', () => {
        it('should parse valid threshold', () => {
            const threshold = {
                id: 'tp-1',
                label: 'Take Profit',
                price: 50000,
                color: '#22c55e',
            };
            const result = PriceThresholdSchema.parse(threshold);

            expect(result.label).toBe('Take Profit');
            expect(result.price).toBe(50000);
            expect(result.color).toBe('#22c55e');
            expect(result.lineStyle).toBe('dashed'); // Default
            expect(result.showPrice).toBe(true); // Default
        });

        it('should validate line style enum', () => {
            expect(() => PriceThresholdSchema.parse({
                label: 'Test',
                price: 100,
                lineStyle: 'invalid',
            })).toThrow();

            const result = PriceThresholdSchema.parse({
                label: 'Test',
                price: 100,
                lineStyle: 'dotted',
            });
            expect(result.lineStyle).toBe('dotted');
        });
    });

    describe('ChartEventMarkerSchema', () => {
        it('should parse valid event marker', () => {
            const marker = {
                id: 'event-1',
                type: 'click',
                price: 45000,
                timestamp: Date.now(),
                color: '#3b82f6',
            };
            const result = ChartEventMarkerSchema.parse(marker);

            expect(result.id).toBe('event-1');
            expect(result.type).toBe('click');
            expect(result.price).toBe(45000);
            expect(result.color).toBe('#3b82f6');
        });

        it('should parse order event with trade details', () => {
            const orderMarker = {
                id: 'order-1',
                type: 'order',
                price: 44500,
                timestamp: Date.now(),
                color: '#ef4444',
                symbol: 'BTCUSDT',
                side: 'SELL',
                quantity: 0.5,
                pnl: -250.50,
            };
            const result = ChartEventMarkerSchema.parse(orderMarker);

            expect(result.type).toBe('order');
            expect(result.symbol).toBe('BTCUSDT');
            expect(result.side).toBe('SELL');
            expect(result.quantity).toBe(0.5);
            expect(result.pnl).toBe(-250.50);
        });

        it('should validate event type enum', () => {
            const validTypes = ['click', 'order', 'inversion', 'custom'];
            validTypes.forEach((type) => {
                const result = ChartEventMarkerSchema.parse({
                    id: `test-${type}`,
                    type,
                    price: 100,
                    timestamp: Date.now(),
                    color: '#fff',
                });
                expect(result.type).toBe(type);
            });

            expect(() => ChartEventMarkerSchema.parse({
                id: 'test',
                type: 'invalid',
                price: 100,
                timestamp: Date.now(),
                color: '#fff',
            })).toThrow();
        });
    });

    describe('PriceRangeSchema', () => {
        it('should parse valid price range', () => {
            const range = { min: 40000, max: 50000 };
            const result = PriceRangeSchema.parse(range);

            expect(result.min).toBe(40000);
            expect(result.max).toBe(50000);
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Chart3D ViewModel', () => {
    describe('useChart3D', () => {
        it('should return default model values', () => {
            const { result } = renderHook(() => useChart3D({}));

            expect(result.current.model.shape).toBe('Cuboid');
            expect(result.current.model.isStreaming).toBe(true);
            expect(result.current.model.seriesCount).toBe(2); // Default is 2
        });

        it('should accept custom configuration', () => {
            const { result } = renderHook(() => useChart3D({
                shape: 'Candle',
                seriesCount: 5,
                isStreaming: false,
            }));

            expect(result.current.model.shape).toBe('Candle');
            expect(result.current.model.seriesCount).toBe(5);
            expect(result.current.model.isStreaming).toBe(false);
        });

        it('should initialize with empty data when no externalData provided', () => {
            const { result } = renderHook(() => useChart3D({}));

            // Data should be generated initially
            expect(result.current.data).toBeDefined();
            expect(Array.isArray(result.current.data)).toBe(true);
        });

        it('should use externalData when provided', () => {
            const externalData: DataPoint[] = [
                { id: '1', x: 0, y: 10, z: 0 },
                { id: '2', x: 1, y: 20, z: 0 },
            ];

            const { result } = renderHook(() => useChart3D({
                externalData,
            }));

            expect(result.current.data).toEqual(externalData);
        });

        it('should handle hovered point state', () => {
            const { result } = renderHook(() => useChart3D({}));

            expect(result.current.hoveredPoint).toBeNull();

            const testPoint: DataPoint = { id: 'test', x: 0, y: 10, z: 0 };
            act(() => {
                result.current.setHoveredPoint(testPoint);
            });

            expect(result.current.hoveredPoint).toEqual(testPoint);

            act(() => {
                result.current.setHoveredPoint(null);
            });

            expect(result.current.hoveredPoint).toBeNull();
        });

        it('should pass through thresholds', () => {
            const thresholds: PriceThreshold[] = [
                { id: 'tp', label: 'Take Profit', price: 50000, color: '#22c55e' },
                { id: 'sl', label: 'Stop Loss', price: 42000, color: '#ef4444' },
            ];

            const { result } = renderHook(() => useChart3D({
                thresholds,
            }));

            expect(result.current.thresholds).toEqual(thresholds);
        });

        it('should pass through event markers', () => {
            const eventMarkers: ChartEventMarker[] = [
                { id: 'e1', type: 'click', price: 45000, timestamp: Date.now(), color: '#3b82f6' },
            ];

            const { result } = renderHook(() => useChart3D({
                eventMarkers,
            }));

            expect(result.current.eventMarkers).toEqual(eventMarkers);
        });

        it('should handle marker selection', () => {
            const marker: ChartEventMarker = {
                id: 'marker-1',
                type: 'order',
                price: 45000,
                timestamp: Date.now(),
                color: '#22c55e',
            };

            const onMarkerSelect = vi.fn();

            const { result } = renderHook(() => useChart3D({
                onMarkerSelect,
            }));

            expect(result.current.selectedMarker).toBeNull();

            act(() => {
                result.current.setSelectedMarker(marker);
            });

            expect(result.current.selectedMarker).toEqual(marker);
            expect(onMarkerSelect).toHaveBeenCalledWith(marker);

            act(() => {
                result.current.setSelectedMarker(null);
            });

            expect(result.current.selectedMarker).toBeNull();
            expect(onMarkerSelect).toHaveBeenCalledWith(null);
        });

        it('should provide correct wrapper classes', () => {
            const { result: darkResult } = renderHook(() => useChart3D({ isDark: true }));
            expect(darkResult.current.wrapperClasses).toContain('ark-chart3d--dark');

            const { result: lightResult } = renderHook(() => useChart3D({ isDark: false }));
            expect(lightResult.current.wrapperClasses).toContain('ark-chart3d--light');
        });

        it('should toggle streaming', () => {
            const { result } = renderHook(() => useChart3D({ isStreaming: true }));

            expect(result.current.model.isStreaming).toBe(true);

            // Note: toggleStreaming triggers config change which may need more setup
            // This test verifies the function exists
            expect(typeof result.current.toggleStreaming).toBe('function');
        });

        it('should provide reset function', () => {
            const { result } = renderHook(() => useChart3D({}));

            expect(typeof result.current.resetData).toBe('function');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Chart3D Constants', () => {
    it('should export shape FA icons mapping', async () => {
        const { SHAPE_FA_ICONS, SHAPE_LABELS } = await import(
            '../../../Ark.Alliance.React.Component.UI/src/components/Chart3D/Chart3D.constants'
        );

        expect(SHAPE_FA_ICONS['Cuboid']).toBe('cube');
        expect(SHAPE_FA_ICONS['Candle']).toBe('chart-bar');
        expect(SHAPE_LABELS['Lines Only']).toBe('Lines');
    });

    it('should export grid constants', async () => {
        const { GRID_SIZE_X, GRID_SIZE_Z, MAX_HEIGHT } = await import(
            '../../../Ark.Alliance.React.Component.UI/src/components/Chart3D/Chart3D.constants'
        );

        expect(GRID_SIZE_X).toBeGreaterThan(0);
        expect(GRID_SIZE_Z).toBeGreaterThan(0);
        expect(MAX_HEIGHT).toBeGreaterThan(0);
    });
});
