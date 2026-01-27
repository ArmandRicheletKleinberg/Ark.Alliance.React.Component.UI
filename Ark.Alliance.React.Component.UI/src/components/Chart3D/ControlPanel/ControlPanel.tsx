/**
 * @fileoverview Chart3D Control Panel Component
 * @module components/Chart3D/ControlPanel
 * 
 * Chart3D-specific control panel built using the base ControlPanel primitive.
 * Provides shape selection, visual settings, and animation controls.
 * 
 * @example
 * ```tsx
 * <Chart3DControlPanel
 *     config={chartConfig}
 *     onConfigChange={(key, value) => updateConfig(key, value)}
 *     onReset={() => resetData()}
 *     onToggleStream={() => toggleStreaming()}
 * />
 * ```
 */

import { memo } from 'react';
import type { Chart3DModel, ShapeType } from '../Chart3D.model';
import { SHAPE_FA_ICONS, SHAPE_LABELS } from '../Chart3D.constants';
import {
    ControlPanel as BaseControlPanel,
    ControlPanelSection,
    type HeaderAction,
} from '../../ControlPanel';
import { Slider } from '../../Input/Slider';
import { FileUpload } from '../../Input/FileUpload';
import { FAIcon } from '../../Icon';
import './ControlPanel.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Props for the Chart3DControlPanel component.
 */
export interface Chart3DControlPanelProps {
    /** Current chart configuration */
    config: Chart3DModel;
    /** Callback when a config property changes */
    onConfigChange: <K extends keyof Chart3DModel>(key: K, value: Chart3DModel[K]) => void;
    /** Callback to reset chart data */
    onReset: () => void;
    /** Callback to toggle streaming */
    onToggleStream: () => void;
}

/**
 * Available shape types.
 */
const SHAPE_TYPES: ShapeType[] = ['Cuboid', 'Cylinder', 'Bubble', 'Candle', 'Lines Only', 'Surface'];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chart3DControlPanel - Chart3D-specific settings panel
 * 
 * Uses the base ControlPanel primitive for consistent styling and behavior.
 * 
 * Features:
 * - Shape type selector with FAIcon icons
 * - Data structure controls (series count, resolution)
 * - Visual settings (bloom, opacity, metalness)
 * - Background image upload
 * - Animation speed controls
 * - Toggle switches for grid/surface
 * - Collapsible panel (inherited from base)
 * 
 * @param props - Chart3DControlPanel properties
 * @returns Memoized Chart3DControlPanel component
 */
export const Chart3DControlPanel = memo<Chart3DControlPanelProps>(function Chart3DControlPanel({
    config,
    onConfigChange,
    onReset,
    onToggleStream
}) {
    // Build header actions for the base ControlPanel
    const headerActions: HeaderAction[] = [
        {
            id: 'stream',
            label: config.isStreaming ? 'Pause' : 'Play',
            icon: <FAIcon name={config.isStreaming ? 'pause' : 'play'} size="sm" />,
            variant: config.isStreaming ? 'danger' : 'success',
            active: config.isStreaming,
        },
        {
            id: 'reset',
            label: 'Reset Data',
            icon: <FAIcon name="rotate" size="sm" />,
            variant: 'default',
        },
    ];

    // Handle action clicks
    const handleActionClick = (actionId: string) => {
        switch (actionId) {
            case 'stream':
                onToggleStream();
                break;
            case 'reset':
                onReset();
                break;
        }
    };

    return (
        <BaseControlPanel
            title="Control Panel"
            titleIcon={<FAIcon name="sliders" size="sm" color="#94a3b8" />}
            collapsible
            headerActions={headerActions}
            onActionClick={handleActionClick}
            position="floating"
            className="ark-chart3d-control-panel"
        >
            {/* Shape Selector */}
            <ControlPanelSection
                title="Geometry"
                icon={<FAIcon name="shapes" size="xs" color="#64748b" />}
            >
                <div className="ark-chart3d-control-panel__shapes">
                    {SHAPE_TYPES.map((shape) => (
                        <button
                            key={shape}
                            type="button"
                            onClick={() => onConfigChange('shape', shape)}
                            className={`ark-chart3d-control-panel__shape ${config.shape === shape ? 'ark-chart3d-control-panel__shape--active' : ''}`}
                            aria-pressed={config.shape === shape}
                        >
                            <FAIcon
                                name={SHAPE_FA_ICONS[shape]}
                                size="sm"
                                color={config.shape === shape ? '#ffffff' : '#94a3b8'}
                            />
                            <span>{SHAPE_LABELS[shape]}</span>
                        </button>
                    ))}
                </div>
            </ControlPanelSection>

            {/* Data Structure */}
            <ControlPanelSection
                title="Data Structure"
                icon={<FAIcon name="cubes" size="xs" color="#64748b" />}
            >
                <Slider
                    label="Z-Axis Series"
                    value={config.seriesCount}
                    min={1}
                    max={5}
                    step={1}
                    onChange={(v) => { onConfigChange('seriesCount', v); setTimeout(onReset, 10); }}
                    color="blue"
                    size="sm"
                />
                <Slider
                    label="X-Axis Points"
                    value={config.xResolution}
                    min={20}
                    max={200}
                    step={10}
                    onChange={(v) => { onConfigChange('xResolution', v); setTimeout(onReset, 10); }}
                    color="blue"
                    size="sm"
                />
            </ControlPanelSection>

            {/* Visuals */}
            <ControlPanelSection
                title="Visuals"
                icon={<FAIcon name="palette" size="xs" color="#64748b" />}
            >
                <Slider
                    label="Neon Glow"
                    value={config.bloomIntensity}
                    min={0}
                    max={4}
                    step={0.1}
                    decimals={1}
                    onChange={(v) => onConfigChange('bloomIntensity', v)}
                    color="purple"
                    size="sm"
                />
                <Slider
                    label="Grid Brightness"
                    value={config.gridBrightness}
                    min={0}
                    max={1}
                    step={0.05}
                    unit="%"
                    decimals={0}
                    onChange={(v) => onConfigChange('gridBrightness', v)}
                    size="sm"
                />
                <Slider
                    label="Shape Opacity"
                    value={config.shapeOpacity}
                    min={0.1}
                    max={1}
                    step={0.05}
                    unit="%"
                    decimals={0}
                    onChange={(v) => onConfigChange('shapeOpacity', v)}
                    size="sm"
                />
                <Slider
                    label="Metalness"
                    value={config.metalness}
                    min={0}
                    max={1}
                    step={0.1}
                    decimals={1}
                    onChange={(v) => onConfigChange('metalness', v)}
                    size="sm"
                />
            </ControlPanelSection>

            {/* Background Image */}
            <ControlPanelSection
                title="Background"
                icon={<FAIcon name="image" size="xs" color="#64748b" />}
            >
                <FileUpload
                    accept="image/*"
                    placeholder="Upload background image"
                    size="sm"
                    variant="neon"
                    fileUrl={config.bgImageUrl}
                    onFileChange={(_, url) => onConfigChange('bgImageUrl', url)}
                />
                {config.bgImageUrl && (
                    <>
                        <Slider
                            label="Image Opacity"
                            value={config.bgImageOpacity}
                            min={0}
                            max={1}
                            step={0.05}
                            decimals={2}
                            onChange={(v) => onConfigChange('bgImageOpacity', v)}
                            size="sm"
                        />
                        <Slider
                            label="Image Scale"
                            value={config.bgImageScale}
                            min={0.1}
                            max={3}
                            step={0.1}
                            decimals={1}
                            onChange={(v) => onConfigChange('bgImageScale', v)}
                            size="sm"
                        />
                    </>
                )}
            </ControlPanelSection>

            {/* Animation */}
            <ControlPanelSection
                title="Animation"
                icon={<FAIcon name="gauge-high" size="xs" color="#64748b" />}
            >
                <Slider
                    label="Speed"
                    value={config.speed}
                    min={100}
                    max={2000}
                    step={100}
                    unit="ms"
                    onChange={(v) => onConfigChange('speed', v)}
                    color="green"
                    size="sm"
                />
                <Slider
                    label="Y Scale"
                    value={config.scaleY}
                    min={0.5}
                    max={2}
                    step={0.1}
                    decimals={1}
                    onChange={(v) => onConfigChange('scaleY', v)}
                    size="sm"
                />
            </ControlPanelSection>

            {/* Toggles */}
            <ControlPanelSection
                title="Display"
                icon={<FAIcon name="eye" size="xs" color="#64748b" />}
            >
                <div className="ark-chart3d-control-panel__toggles">
                    <label className="ark-chart3d-control-panel__toggle">
                        <span>
                            <FAIcon name="border-all" size="xs" color="#64748b" />
                            Show Grid
                        </span>
                        <input
                            type="checkbox"
                            checked={config.showGrid}
                            onChange={(e) => onConfigChange('showGrid', e.target.checked)}
                        />
                    </label>
                    <label className="ark-chart3d-control-panel__toggle">
                        <span>
                            <FAIcon name="layer-group" size="xs" color="#64748b" />
                            Show Surface
                        </span>
                        <input
                            type="checkbox"
                            checked={config.showSurface}
                            onChange={(e) => onConfigChange('showSurface', e.target.checked)}
                        />
                    </label>
                </div>
            </ControlPanelSection>
        </BaseControlPanel>
    );
});

Chart3DControlPanel.displayName = 'Chart3DControlPanel';

// Keep backward compatibility with old name
export const ControlPanel = Chart3DControlPanel;

export default Chart3DControlPanel;
