/**
 * @fileoverview Chart3D Control Panel Component
 * @module components/Chart3D/ControlPanel
 * 
 * Control panel for Chart3D using existing primitives.
 */

import { memo, useState } from 'react';
import type { Chart3DModel, ShapeType } from '../Chart3D.model';
import { SHAPE_ICONS } from '../Chart3D.constants';
import { Slider } from '../../Input/Slider';
import { FileUpload } from '../../Input/FileUpload';
import './ControlPanel.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ControlPanelProps {
    config: Chart3DModel;
    onConfigChange: <K extends keyof Chart3DModel>(key: K, value: Chart3DModel[K]) => void;
    onReset: () => void;
    onToggleStream: () => void;
}

const SHAPE_TYPES: ShapeType[] = ['Cuboid', 'Cylinder', 'Bubble', 'Candle', 'Lines Only', 'Surface'];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ControlPanel = memo<ControlPanelProps>(function ControlPanel({
    config,
    onConfigChange,
    onReset,
    onToggleStream
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`ark-control-panel ${isCollapsed ? 'ark-control-panel--collapsed' : ''}`}>
            {/* Header */}
            <div className="ark-control-panel__header">
                <h2 className="ark-control-panel__title">
                    ⚙️ Control Panel
                </h2>
                <div className="ark-control-panel__actions">
                    <button
                        type="button"
                        onClick={onToggleStream}
                        className={`ark-control-panel__btn ${config.isStreaming ? 'ark-control-panel__btn--stop' : 'ark-control-panel__btn--play'}`}
                        title={config.isStreaming ? 'Pause' : 'Play'}
                    >
                        {config.isStreaming ? '⏸' : '▶'}
                    </button>
                    <button
                        type="button"
                        onClick={onReset}
                        className="ark-control-panel__btn ark-control-panel__btn--reset"
                        title="Reset Data"
                    >
                        🔄
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="ark-control-panel__btn"
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {isCollapsed ? '▲' : '▼'}
                    </button>
                </div>
            </div>

            {/* Content */}
            {!isCollapsed && (
                <div className="ark-control-panel__content">
                    {/* Shape Selector */}
                    <div className="ark-control-panel__section">
                        <label className="ark-control-panel__label">Geometry</label>
                        <div className="ark-control-panel__shapes">
                            {SHAPE_TYPES.map((shape) => (
                                <button
                                    key={shape}
                                    type="button"
                                    onClick={() => onConfigChange('shape', shape)}
                                    className={`ark-control-panel__shape ${config.shape === shape ? 'ark-control-panel__shape--active' : ''}`}
                                >
                                    <span>{SHAPE_ICONS[shape]}</span>
                                    <span>{shape.replace(' Only', '')}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Data Structure */}
                    <div className="ark-control-panel__section">
                        <label className="ark-control-panel__label">Data Structure</label>
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
                    </div>

                    {/* Visuals */}
                    <div className="ark-control-panel__section">
                        <label className="ark-control-panel__label">Visuals</label>
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
                    </div>

                    {/* Background Image */}
                    <div className="ark-control-panel__section">
                        <label className="ark-control-panel__label">Background</label>
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
                    </div>

                    {/* Animation */}
                    <div className="ark-control-panel__section">
                        <label className="ark-control-panel__label">Animation</label>
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
                    </div>

                    {/* Toggles */}
                    <div className="ark-control-panel__toggles">
                        <label className="ark-control-panel__toggle">
                            <span>Show Grid</span>
                            <input
                                type="checkbox"
                                checked={config.showGrid}
                                onChange={(e) => onConfigChange('showGrid', e.target.checked)}
                            />
                        </label>
                        <label className="ark-control-panel__toggle">
                            <span>Show Surface</span>
                            <input
                                type="checkbox"
                                checked={config.showSurface}
                                onChange={(e) => onConfigChange('showSurface', e.target.checked)}
                            />
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
});

export default ControlPanel;
