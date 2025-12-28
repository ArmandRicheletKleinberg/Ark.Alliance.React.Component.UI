/**
 * @fileoverview FinancialChart with ControlPanel Integration Example
 * @module examples/FinancialChartWithControls
 * 
 * Demonstrates how to integrate the new ControlPanel primitive with FinancialChart.
 * This is a usage example, not a production component.
 */

import { useState, useMemo } from 'react';
import { BinanceDataProvider } from '../../core/services/providers';
import { useDataProvider, type ConnectionStatus } from '../../core/services/useDataProvider';
import { FinancialChart } from '../Charts/FinancialChart/FinancialChart';
import {
    ControlPanel,
    ControlPanelSection,
    ControlPanelRow,
    type HeaderAction,
} from '../ControlPanel';
import type { ChartType, FinancialThreshold } from '../Charts/FinancialChart/FinancialChart.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ChartSettings {
    symbol: string;
    interval: string;
    chartType: ChartType;
    borderRadius: number;
    boxShadowIntensity: number;
    useLogScale: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
const INTERVALS = ['1s', '1m', '5m', '15m', '1h'] as const;

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Example: FinancialChart with ControlPanel
 * 
 * Shows integration pattern for using the ControlPanel primitive
 * with FinancialChart component, replacing the inline FinancialChartControls.
 * 
 * Benefits of using ControlPanel primitive:
 * 1. DRY - Reusable across Chart3D, FinancialChart, and future components
 * 2. Consistent UX - Same header, sections, rows pattern everywhere
 * 3. Less CSS duplication - Shared styles in ControlPanel.styles.css
 * 4. Easier maintenance - Fix once, apply everywhere
 */
export function FinancialChartWithControlsExample() {
    // Data provider
    const provider = useMemo(() => new BinanceDataProvider(), []);

    // Chart settings state
    const [settings, setSettings] = useState<ChartSettings>({
        symbol: 'BTCUSDT',
        interval: '1m',
        chartType: 'candlestick',
        borderRadius: 12,
        boxShadowIntensity: 10,
        useLogScale: false,
    });

    // Threshold lines
    const [thresholds, setThresholds] = useState<FinancialThreshold[]>([]);

    // Data provider hook
    const { data, status, connect, disconnect } = useDataProvider({
        provider,
        streamConfig: {
            endpoint: '',
            symbol: settings.symbol,
            interval: settings.interval,
        },
        autoConnect: true,
        fetchHistory: true,
    });

    // Update setting helper
    const updateSetting = <K extends keyof ChartSettings>(key: K, value: ChartSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    // Header actions for ControlPanel
    const headerActions: HeaderAction[] = [
        {
            id: 'stream',
            label: status === 'connected' ? 'Disconnect' : 'Connect',
            icon: status === 'connected' ? '⏸' : '▶',
            active: status === 'connected',
            variant: status === 'connected' ? 'success' : 'default',
        },
        {
            id: 'fullscreen',
            label: 'Fullscreen',
            icon: '⛶',
            variant: 'default',
        },
    ];

    // Handle header action clicks
    const handleAction = (actionId: string) => {
        switch (actionId) {
            case 'stream':
                if (status === 'connected') {
                    disconnect();
                } else {
                    connect();
                }
                break;
            case 'fullscreen':
                // Toggle fullscreen logic
                break;
        }
    };

    // Map connection status
    const connectionStatus = status === 'connected' ? 'connected'
        : status === 'connecting' ? 'connecting'
            : 'disconnected';

    return (
        <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
            {/* Chart */}
            <div style={{ flex: 1 }}>
                <FinancialChart
                    symbol={settings.symbol}
                    interval={settings.interval}
                    chartType={settings.chartType}
                    candlestickData={data}
                    headerTitle={`${settings.symbol} • ${settings.interval}`}
                    borderRadius={settings.borderRadius}
                    boxShadowIntensity={settings.boxShadowIntensity}
                    useLogScale={settings.useLogScale}
                    isConnected={status === 'connected'}
                    thresholdLines={thresholds}
                    showGrid
                    showLegend
                />
            </div>

            {/* Control Panel - Using new primitive */}
            <ControlPanel
                title="Chart Settings"
                titleIcon="⚙️"
                collapsible
                position="right"
                width={280}
                headerActions={headerActions}
                onActionClick={handleAction}
                connectionStatus={connectionStatus}
            >
                {/* Symbol & Interval Section */}
                <ControlPanelSection title="Symbol & Timeframe">
                    <ControlPanelRow label="Symbol">
                        <select
                            value={settings.symbol}
                            onChange={(e) => updateSetting('symbol', e.target.value)}
                            style={{ width: '100%', padding: '4px', background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '4px' }}
                        >
                            {SYMBOLS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </ControlPanelRow>

                    <ControlPanelRow label="Interval">
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {INTERVALS.map(i => (
                                <button
                                    key={i}
                                    onClick={() => updateSetting('interval', i)}
                                    style={{
                                        padding: '4px 8px',
                                        background: settings.interval === i ? '#6366f1' : '#0f172a',
                                        border: '1px solid #334155',
                                        borderRadius: '4px',
                                        color: settings.interval === i ? 'white' : '#94a3b8',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </ControlPanelRow>
                </ControlPanelSection>

                {/* Chart Type Section */}
                <ControlPanelSection title="Chart Type">
                    <ControlPanelRow label="Type">
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {(['candlestick', 'line', 'area'] as ChartType[]).map(type => (
                                <button
                                    key={type}
                                    onClick={() => updateSetting('chartType', type)}
                                    style={{
                                        padding: '4px 8px',
                                        background: settings.chartType === type ? '#6366f1' : '#0f172a',
                                        border: '1px solid #334155',
                                        borderRadius: '4px',
                                        color: settings.chartType === type ? 'white' : '#94a3b8',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </ControlPanelRow>

                    <ControlPanelRow label="Log Scale">
                        <button
                            onClick={() => updateSetting('useLogScale', !settings.useLogScale)}
                            style={{
                                padding: '4px 12px',
                                background: settings.useLogScale ? '#22c55e' : '#0f172a',
                                border: '1px solid #334155',
                                borderRadius: '4px',
                                color: settings.useLogScale ? 'white' : '#94a3b8',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                            }}
                        >
                            {settings.useLogScale ? 'ON' : 'OFF'}
                        </button>
                    </ControlPanelRow>
                </ControlPanelSection>

                {/* Appearance Section */}
                <ControlPanelSection title="Appearance">
                    <ControlPanelRow label="Radius" value={`${settings.borderRadius}px`}>
                        <input
                            type="range"
                            min={0}
                            max={24}
                            step={4}
                            value={settings.borderRadius}
                            onChange={(e) => updateSetting('borderRadius', parseInt(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </ControlPanelRow>

                    <ControlPanelRow label="Shadow" value={`${settings.boxShadowIntensity}`}>
                        <input
                            type="range"
                            min={0}
                            max={40}
                            step={5}
                            value={settings.boxShadowIntensity}
                            onChange={(e) => updateSetting('boxShadowIntensity', parseInt(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </ControlPanelRow>
                </ControlPanelSection>
            </ControlPanel>
        </div>
    );
}

export default FinancialChartWithControlsExample;
