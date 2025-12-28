/**
 * @fileoverview ComponentPanel - Master-Detail Component Showcase
 * @module showcase/components/ComponentPanel
 * 
 * Displays a component in Master-Detail view:
 * - LEFT: Control Panel (single source of truth)
 * - CENTER: Live Component Preview
 * - BOTTOM: Code/Syntax View
 */

import { useState, useCallback, memo, useMemo, useEffect } from 'react';
import type { ComponentInfo } from '../../types';
import { ShowcaseControlPanel } from '../ShowcaseControlPanel';
import { ComponentErrorBoundary } from '../ComponentErrorBoundary';
import '../ComponentErrorBoundary/ComponentErrorBoundary.styles.css';
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
    /** Compact mode for grid view */
    compact?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CODE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate JSX code from props
 */
function generateCode(name: string, props: Record<string, unknown>, defaults: Record<string, unknown>): string {
    const propsStr = Object.entries(props)
        .filter(([k, v]) => v !== undefined && v !== defaults[k])
        .map(([k, v]) => {
            if (typeof v === 'boolean') return v ? ` ${k}` : '';
            if (typeof v === 'string') return ` ${k}="${v}"`;
            return ` ${k}={${JSON.stringify(v)}}`;
        })
        .join('');
    return `<${name}${propsStr} />`;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ComponentPanel - Master-Detail component showcase
 * 
 * Layout:
 * - LEFT SIDEBAR: Control panel with all properties
 * - CENTER: Live component preview (wrapped in Error Boundary)
 * - BOTTOM: Code syntax view
 * 
 * State Flow:
 * Controls → propValues → Live Preview + Code Generation
 */
export const ComponentPanel = memo(function ComponentPanel(props: ComponentPanelProps) {
    const { info, isDark, compact = false } = props;

    // Single source of truth for all property values
    const [propValues, setPropValues] = useState<Record<string, unknown>>({});
    const [copied, setCopied] = useState(false);
    const [errorKey, setErrorKey] = useState(0); // Key to reset error boundary

    // Reset propValues when component changes to prevent stale state
    useEffect(() => {
        setPropValues({});
        setErrorKey(k => k + 1);
    }, [info.name]);

    const Component = info.component;

    /**
     * Handle property value change - triggers live re-render
     */
    const handlePropChange = useCallback((name: string, value: unknown) => {
        console.log('[ComponentPanel] handlePropChange called:', name, value);
        setPropValues(prev => {
            const next = { ...prev, [name]: value };
            console.log('[ComponentPanel] propValues updated:', next);
            return next;
        });
    }, []);

    /**
     * Handle modal/dialog close - sets isOpen to false
     * This provides a working onClose for Modal-like components
     */
    const handleClose = useCallback(() => {
        setPropValues(prev => ({ ...prev, isOpen: false }));
    }, []);

    // Merged props for preview and code generation
    // Includes special handlers for interactive components
    const mergedProps = useMemo(() => ({
        ...info.defaultProps,
        ...propValues,
        // Override onClose with working handler for Modal-like components
        onClose: handleClose,
    }), [info.defaultProps, propValues, handleClose]);

    /**
     * Reset error boundary and optionally props
     */
    const handleErrorReset = useCallback(() => {
        setErrorKey(k => k + 1);
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

    // Compact mode for grid view
    if (compact) {
        return (
            <div className="component-panel component-panel--compact">
                <div className="component-panel__header">
                    <h3 className="component-panel__name">{info.name}</h3>
                </div>
                <div className="component-panel__preview-compact">
                    <ComponentErrorBoundary
                        key={errorKey}
                        componentName={info.name}
                        onReset={handleErrorReset}
                    >
                        <Component {...mergedProps} isDark={isDark} />
                    </ComponentErrorBoundary>
                </div>
            </div>
        );
    }

    return (
        <div className="component-panel component-panel--master-detail">
            {/* Header */}
            <div className="component-panel__header">
                <div className="component-panel__info">
                    <h2 className="component-panel__name">{info.name}</h2>
                    <p className="component-panel__desc">{info.description}</p>
                </div>
            </div>

            {/* Master-Detail Layout: Preview Left, Controls Right */}
            <div className="component-panel__body">
                {/* LEFT: Preview + Code */}
                <main className="component-panel__main">
                    {/* Live Preview */}
                    <div className="component-panel__preview">
                        <div className="component-panel__preview-header">
                            <span className="component-panel__preview-label">Live Preview</span>
                        </div>
                        <div className="component-panel__preview-area">
                            <ComponentErrorBoundary
                                key={errorKey}
                                componentName={info.name}
                                onReset={handleErrorReset}
                            >
                                <Component {...mergedProps} isDark={isDark} />
                            </ComponentErrorBoundary>
                        </div>
                    </div>

                    {/* Code Section */}
                    <div className="component-panel__code-section">
                        <div className="component-panel__code-header">
                            <button
                                type="button"
                                className={`component-panel__copy-btn ${copied ? 'component-panel__copy-btn--copied' : ''}`}
                                onClick={handleCopy}
                            >
                                {copied ? '✓ Copied!' : '📋 Copy'}
                            </button>
                            <span className="component-panel__code-label">Code</span>
                        </div>
                        <pre className="component-panel__code">
                            <code>{generateCode(info.name, propValues, info.defaultProps)}</code>
                        </pre>
                    </div>
                </main>

                {/* RIGHT: Control Panel */}
                <aside className="component-panel__sidebar">
                    <ShowcaseControlPanel
                        componentName={info.name}
                        propDefs={info.propDefs}
                        values={mergedProps}
                        onChange={handlePropChange}
                        grouped
                    />
                </aside>
            </div>
        </div>
    );
});

ComponentPanel.displayName = 'ComponentPanel';
export default ComponentPanel;
