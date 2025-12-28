/**
 * @fileoverview FinancialChartControls Component
 * @module components/Charts/FinancialChart
 * 
 * Control panel for FinancialChart settings including symbol selection,
 * interval, styling, and threshold management.
 */

import { memo, useState, useCallback, type ChangeEvent } from 'react';
import type { FinancialThreshold, ChartType } from './FinancialChart.model';
import './FinancialChartControls.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Available intervals
 */
export const AVAILABLE_INTERVALS = ['1s', '1m', '5m', '15m', '1h', '4h', '1d'] as const;
export type Interval = typeof AVAILABLE_INTERVALS[number];

/**
 * Style settings configuration
 */
export interface ChartStyleSettings {
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    boxShadowIntensity: number;
    backgroundImage: string | null;
    bgImageOpacity: number;
    bgImageZoom: number;
    useLogScale: boolean;
    chartType: ChartType;
}

/**
 * FinancialChartControls component props
 */
export interface FinancialChartControlsProps {
    /** Current symbol */
    symbol: string;
    /** Available symbols */
    symbols?: string[];
    /** Current interval */
    interval: Interval;
    /** Current style settings */
    styleSettings: ChartStyleSettings;
    /** Current threshold lines */
    thresholdLines: FinancialThreshold[];
    /** Whether chart is connected */
    isConnected: boolean;
    /** Callback when symbol changes */
    onSymbolChange: (symbol: string) => void;
    /** Callback when interval changes */
    onIntervalChange: (interval: Interval) => void;
    /** Callback when style settings change */
    onStyleChange: (settings: Partial<ChartStyleSettings>) => void;
    /** Callback to add threshold */
    onAddThreshold: (threshold: FinancialThreshold) => void;
    /** Callback to remove threshold */
    onRemoveThreshold: (id: string) => void;
    /** Callback to toggle fullscreen */
    onToggleFullscreen?: () => void;
    /** Whether chart is in fullscreen */
    isFullscreen?: boolean;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT'];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FinancialChartControls - Settings panel for FinancialChart
 * 
 * Features:
 * - Symbol selector dropdown
 * - Interval toggle buttons
 * - Chart type selector
 * - Styling controls (border, shadow, background)
 * - Threshold line management
 * - Fullscreen toggle
 * 
 * @example
 * ```tsx
 * <FinancialChartControls
 *     symbol="BTCUSDT"
 *     interval="1m"
 *     styleSettings={settings}
 *     thresholdLines={thresholds}
 *     onSymbolChange={(s) => setSymbol(s)}
 *     onIntervalChange={(i) => setInterval(i)}
 *     onStyleChange={(s) => setSettings(prev => ({ ...prev, ...s }))}
 *     onAddThreshold={addThreshold}
 *     onRemoveThreshold={removeThreshold}
 * />
 * ```
 */
export const FinancialChartControls = memo(function FinancialChartControls(props: FinancialChartControlsProps) {
    const {
        symbol,
        symbols = DEFAULT_SYMBOLS,
        interval,
        styleSettings,
        thresholdLines,
        isConnected,
        onSymbolChange,
        onIntervalChange,
        onStyleChange,
        onAddThreshold,
        onRemoveThreshold,
        onToggleFullscreen,
        isFullscreen = false,
        className = '',
    } = props;

    // Local state for new threshold input
    const [newThresholdPrice, setNewThresholdPrice] = useState('');
    const [newThresholdLabel, setNewThresholdLabel] = useState('');
    const [newThresholdColor, setNewThresholdColor] = useState('#f87171');

    /**
     * Handle image file upload
     */
    const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            onStyleChange({ backgroundImage: reader.result as string });
        };
        reader.readAsDataURL(file);
    }, [onStyleChange]);

    /**
     * Handle adding new threshold
     */
    const handleAddThreshold = useCallback(() => {
        const price = parseFloat(newThresholdPrice);
        if (isNaN(price)) return;

        const threshold: FinancialThreshold = {
            id: `threshold-${Date.now()}`,
            price,
            label: newThresholdLabel || `${price.toFixed(2)}`,
            color: newThresholdColor,
            style: 'dashed',
        };

        onAddThreshold(threshold);
        setNewThresholdPrice('');
        setNewThresholdLabel('');
    }, [newThresholdPrice, newThresholdLabel, newThresholdColor, onAddThreshold]);

    return (
        <div className={`ark-financial-chart-controls ${className}`}>
            {/* Symbol & Interval Section */}
            <div className="ark-financial-chart-controls__section">
                <h3 className="ark-financial-chart-controls__section-title">Symbol & Timeframe</h3>

                <div className="ark-financial-chart-controls__row">
                    <label className="ark-financial-chart-controls__label">Symbol</label>
                    <select
                        className="ark-financial-chart-controls__select"
                        value={symbol}
                        onChange={(e) => onSymbolChange(e.target.value)}
                    >
                        {symbols.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="ark-financial-chart-controls__row">
                    <label className="ark-financial-chart-controls__label">Interval</label>
                    <div className="ark-financial-chart-controls__button-group">
                        {AVAILABLE_INTERVALS.map(i => (
                            <button
                                key={i}
                                type="button"
                                className={`ark-financial-chart-controls__interval-btn ${interval === i ? 'ark-financial-chart-controls__interval-btn--active' : ''}`}
                                onClick={() => onIntervalChange(i)}
                            >
                                {i}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart Type Section */}
            <div className="ark-financial-chart-controls__section">
                <h3 className="ark-financial-chart-controls__section-title">Chart Type</h3>

                <div className="ark-financial-chart-controls__row">
                    <div className="ark-financial-chart-controls__button-group">
                        {(['candlestick', 'line', 'area'] as ChartType[]).map(type => (
                            <button
                                key={type}
                                type="button"
                                className={`ark-financial-chart-controls__type-btn ${styleSettings.chartType === type ? 'ark-financial-chart-controls__type-btn--active' : ''}`}
                                onClick={() => onStyleChange({ chartType: type })}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="ark-financial-chart-controls__row">
                    <label className="ark-financial-chart-controls__label">Log Scale</label>
                    <button
                        type="button"
                        className={`ark-financial-chart-controls__toggle ${styleSettings.useLogScale ? 'ark-financial-chart-controls__toggle--active' : ''}`}
                        onClick={() => onStyleChange({ useLogScale: !styleSettings.useLogScale })}
                    >
                        {styleSettings.useLogScale ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* Styling Section */}
            <div className="ark-financial-chart-controls__section">
                <h3 className="ark-financial-chart-controls__section-title">Appearance</h3>

                <div className="ark-financial-chart-controls__row">
                    <label className="ark-financial-chart-controls__label">Border Width</label>
                    <input
                        type="range"
                        className="ark-financial-chart-controls__slider"
                        min={0}
                        max={5}
                        step={1}
                        value={styleSettings.borderWidth}
                        onChange={(e) => onStyleChange({ borderWidth: parseInt(e.target.value) })}
                    />
                    <span className="ark-financial-chart-controls__value">{styleSettings.borderWidth}px</span>
                </div>

                <div className="ark-financial-chart-controls__row">
                    <label className="ark-financial-chart-controls__label">Border Radius</label>
                    <input
                        type="range"
                        className="ark-financial-chart-controls__slider"
                        min={0}
                        max={24}
                        step={4}
                        value={styleSettings.borderRadius}
                        onChange={(e) => onStyleChange({ borderRadius: parseInt(e.target.value) })}
                    />
                    <span className="ark-financial-chart-controls__value">{styleSettings.borderRadius}px</span>
                </div>

                <div className="ark-financial-chart-controls__row">
                    <label className="ark-financial-chart-controls__label">Shadow</label>
                    <input
                        type="range"
                        className="ark-financial-chart-controls__slider"
                        min={0}
                        max={40}
                        step={5}
                        value={styleSettings.boxShadowIntensity}
                        onChange={(e) => onStyleChange({ boxShadowIntensity: parseInt(e.target.value) })}
                    />
                    <span className="ark-financial-chart-controls__value">{styleSettings.boxShadowIntensity}</span>
                </div>

                <div className="ark-financial-chart-controls__row">
                    <label className="ark-financial-chart-controls__label">Background Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="ark-financial-chart-controls__file-input"
                        onChange={handleImageUpload}
                    />
                    {styleSettings.backgroundImage && (
                        <button
                            type="button"
                            className="ark-financial-chart-controls__clear-btn"
                            onClick={() => onStyleChange({ backgroundImage: null })}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {styleSettings.backgroundImage && (
                    <>
                        <div className="ark-financial-chart-controls__row">
                            <label className="ark-financial-chart-controls__label">BG Opacity</label>
                            <input
                                type="range"
                                className="ark-financial-chart-controls__slider"
                                min={0}
                                max={100}
                                step={5}
                                value={styleSettings.bgImageOpacity}
                                onChange={(e) => onStyleChange({ bgImageOpacity: parseInt(e.target.value) })}
                            />
                            <span className="ark-financial-chart-controls__value">{styleSettings.bgImageOpacity}%</span>
                        </div>

                        <div className="ark-financial-chart-controls__row">
                            <label className="ark-financial-chart-controls__label">BG Zoom</label>
                            <input
                                type="range"
                                className="ark-financial-chart-controls__slider"
                                min={50}
                                max={200}
                                step={10}
                                value={styleSettings.bgImageZoom * 100}
                                onChange={(e) => onStyleChange({ bgImageZoom: parseInt(e.target.value) / 100 })}
                            />
                            <span className="ark-financial-chart-controls__value">{Math.round(styleSettings.bgImageZoom * 100)}%</span>
                        </div>
                    </>
                )}
            </div>

            {/* Threshold Lines Section */}
            <div className="ark-financial-chart-controls__section">
                <h3 className="ark-financial-chart-controls__section-title">Threshold Lines</h3>

                <div className="ark-financial-chart-controls__threshold-form">
                    <input
                        type="number"
                        placeholder="Price"
                        className="ark-financial-chart-controls__input"
                        value={newThresholdPrice}
                        onChange={(e) => setNewThresholdPrice(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Label"
                        className="ark-financial-chart-controls__input"
                        value={newThresholdLabel}
                        onChange={(e) => setNewThresholdLabel(e.target.value)}
                    />
                    <input
                        type="color"
                        className="ark-financial-chart-controls__color-input"
                        value={newThresholdColor}
                        onChange={(e) => setNewThresholdColor(e.target.value)}
                    />
                    <button
                        type="button"
                        className="ark-financial-chart-controls__add-btn"
                        onClick={handleAddThreshold}
                    >
                        Add
                    </button>
                </div>

                <ul className="ark-financial-chart-controls__threshold-list">
                    {thresholdLines.map(threshold => (
                        <li key={threshold.id} className="ark-financial-chart-controls__threshold-item">
                            <span
                                className="ark-financial-chart-controls__threshold-color"
                                style={{ backgroundColor: threshold.color }}
                            />
                            <span className="ark-financial-chart-controls__threshold-label">{threshold.label}</span>
                            <span className="ark-financial-chart-controls__threshold-price">
                                {threshold.price.toFixed(2)}
                            </span>
                            <button
                                type="button"
                                className="ark-financial-chart-controls__remove-btn"
                                onClick={() => onRemoveThreshold(threshold.id)}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Actions Section */}
            {onToggleFullscreen && (
                <div className="ark-financial-chart-controls__section">
                    <button
                        type="button"
                        className="ark-financial-chart-controls__fullscreen-btn"
                        onClick={onToggleFullscreen}
                    >
                        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>
                </div>
            )}

            {/* Connection Status */}
            <div className="ark-financial-chart-controls__status">
                <span
                    className={`ark-financial-chart-controls__status-dot ${isConnected ? 'ark-financial-chart-controls__status-dot--connected' : ''}`}
                />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
        </div>
    );
});

FinancialChartControls.displayName = 'FinancialChartControls';
export default FinancialChartControls;
