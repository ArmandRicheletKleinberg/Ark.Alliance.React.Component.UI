/**
 * @fileoverview ComponentPanel - Individual component showcase panel
 * @module showcase/components/ComponentPanel
 * 
 * Displays a single component with preview, controls, presets, and code output.
 */

import { useState, useCallback, memo } from 'react';
import type { ComponentInfo, StylePreset } from '../../types';
import './ComponentPanel.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ComponentPanel props
 */
export interface ComponentPanelProps {
    /** Component information */
    info: ComponentInfo;
    /** Dark mode flag */
    isDark: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ComponentPanel - Interactive component showcase
 * 
 * Features:
 * - Live component preview
 * - Property controls (inputs, selects, checkboxes)
 * - Style presets
 * - Code generation and copy
 * 
 * @example
 * ```tsx
 * <ComponentPanel 
 *     info={buttonComponentInfo}
 *     isDark={true}
 * />
 * ```
 */
export const ComponentPanel = memo(function ComponentPanel(props: ComponentPanelProps) {
    const { info, isDark } = props;

    const [propValues, setPropValues] = useState<Record<string, unknown>>({});
    const [copied, setCopied] = useState(false);
    const [activePreset, setActivePreset] = useState<string | null>(null);

    const Component = info.component;

    /**
     * Handle property value change
     */
    const handlePropChange = useCallback((name: string, value: unknown) => {
        setPropValues(prev => ({ ...prev, [name]: value }));
        setActivePreset(null);
    }, []);

    /**
     * Apply a style preset
     */
    const handlePresetApply = useCallback((preset: StylePreset) => {
        setPropValues(prev => ({ ...prev, ...preset.props }));
        setActivePreset(preset.name);
    }, []);

    /**
     * Copy generated code to clipboard
     */
    const handleCopy = useCallback(() => {
        const code = generateCode(info.name, propValues, info.defaultProps);
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [info.name, propValues, info.defaultProps]);

    /**
     * Generate JSX code from props
     */
    const generateCode = (name: string, props: Record<string, unknown>, defaults: Record<string, unknown>): string => {
        const propsStr = Object.entries(props)
            .filter(([k, v]) => v !== undefined && v !== defaults[k])
            .map(([k, v]) => typeof v === 'boolean'
                ? (v ? ` ${k}` : '')
                : typeof v === 'string'
                    ? ` ${k}="${v}"`
                    : ` ${k}={${JSON.stringify(v)}}`
            ).join('');
        return `<${name}${propsStr} />`;
    };

    return (
        <div className="component-panel">
            <div className="component-panel__header">
                <div className="component-panel__info">
                    <h3 className="component-panel__name">{info.name}</h3>
                    <p className="component-panel__desc">{info.description}</p>
                </div>
            </div>

            <div className="component-panel__content">
                {/* Preview */}
                <div className="component-panel__preview">
                    <span className="component-panel__preview-label">Preview</span>
                    <div className="component-panel__preview-area">
                        <Component {...info.defaultProps} {...propValues} isDark={isDark} />
                    </div>
                </div>

                {/* Controls */}
                <div className="component-panel__controls">
                    {/* Presets */}
                    {info.presets.length > 0 && (
                        <div className="component-panel__section">
                            <h4 className="component-panel__section-title">🎨 Style Presets</h4>
                            <div className="component-panel__presets">
                                {info.presets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        className={`component-panel__preset-btn ${activePreset === preset.name ? 'component-panel__preset-btn--active' : ''}`}
                                        onClick={() => handlePresetApply(preset)}
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Properties */}
                    <div className="component-panel__section">
                        <h4 className="component-panel__section-title">⚙️ Properties</h4>
                        <div className="component-panel__props">
                            {info.propDefs.map((prop) => (
                                <div key={prop.name} className="component-panel__prop">
                                    <label className="component-panel__prop-label">
                                        <span className="component-panel__prop-name">{prop.name}</span>
                                        <span className="component-panel__prop-type">{prop.type}</span>
                                    </label>
                                    <div className="component-panel__prop-input">
                                        {prop.type === 'boolean' ? (
                                            <input
                                                type="checkbox"
                                                checked={(propValues[prop.name] ?? prop.default) as boolean}
                                                onChange={(e) => handlePropChange(prop.name, e.target.checked)}
                                            />
                                        ) : prop.type === 'select' ? (
                                            <select
                                                value={(propValues[prop.name] ?? prop.default) as string}
                                                onChange={(e) => handlePropChange(prop.name, e.target.value)}
                                            >
                                                {prop.options?.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : prop.type === 'number' ? (
                                            <input
                                                type="number"
                                                value={(propValues[prop.name] ?? prop.default) as number}
                                                onChange={(e) => handlePropChange(prop.name, Number(e.target.value))}
                                            />
                                        ) : prop.type === 'color' ? (
                                            <input
                                                type="color"
                                                value={(propValues[prop.name] ?? prop.default) as string}
                                                onChange={(e) => handlePropChange(prop.name, e.target.value)}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={(propValues[prop.name] ?? prop.default) as string}
                                                onChange={(e) => handlePropChange(prop.name, e.target.value)}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Code */}
                    <div className="component-panel__section">
                        <div className="component-panel__code-header">
                            <h4 className="component-panel__section-title">📋 Code</h4>
                            <button
                                className={`component-panel__copy-btn ${copied ? 'component-panel__copy-btn--copied' : ''}`}
                                onClick={handleCopy}
                            >
                                {copied ? '✓ Copied!' : 'Copy'}
                            </button>
                        </div>
                        <pre className="component-panel__code">
                            <code>{generateCode(info.name, propValues, info.defaultProps)}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
});

ComponentPanel.displayName = 'ComponentPanel';
export default ComponentPanel;
