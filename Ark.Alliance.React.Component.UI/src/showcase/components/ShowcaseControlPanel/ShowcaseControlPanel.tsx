/**
 * @fileoverview ShowcaseControlPanel Component
 * @module showcase/components/ShowcaseControlPanel
 * 
 * Auto-generating control panel that renders appropriate controls
 * based on PropDefinition array. Composes ControlPanel base component.
 */

import { memo, useCallback, useMemo } from 'react';
import type { PropDefinition } from '../../types';
import { ControlPanel, ControlPanelSection, ControlPanelRow } from '../../../components/ControlPanel';
import {
    PropertySlider,
    PropertyToggle,
    PropertySelect,
    PropertyInput,
    PropertyColor,
    PropertyUpload,
} from '../controls';
import './ShowcaseControlPanel.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ShowcaseControlPanelProps {
    /** Component name for panel title */
    componentName: string;
    /** Property definitions to generate controls from */
    propDefs: PropDefinition[];
    /** Current property values */
    values: Record<string, unknown>;
    /** Change handler */
    onChange: (propName: string, value: unknown) => void;
    /** Whether panel is visible */
    visible?: boolean;
    /** Whether to group properties by type */
    grouped?: boolean;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY GROUPING
// ═══════════════════════════════════════════════════════════════════════════

interface PropGroup {
    title: string;
    icon: string;
    props: PropDefinition[];
}

/**
 * Group properties by type for organized display
 */
function groupProperties(propDefs: PropDefinition[]): PropGroup[] {
    const groups: Record<string, PropDefinition[]> = {};

    propDefs.forEach(prop => {
        const type = prop.type;
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(prop);
    });

    const groupMeta: Record<string, { title: string; icon: string; order: number }> = {
        boolean: { title: 'Toggles', icon: '🎚️', order: 1 },
        select: { title: 'Options', icon: '📋', order: 2 },
        number: { title: 'Values', icon: '🔢', order: 3 },
        color: { title: 'Colors', icon: '🎨', order: 4 },
        string: { title: 'Text', icon: '📝', order: 5 },
        file: { title: 'Files', icon: '📁', order: 6 },
    };

    return Object.entries(groups)
        .map(([type, props]) => ({
            title: groupMeta[type]?.title || type,
            icon: groupMeta[type]?.icon || '⚙️',
            props,
            order: groupMeta[type]?.order || 99,
        }))
        .sort((a, b) => a.order - b.order);
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTROL RENDERER
// ═══════════════════════════════════════════════════════════════════════════

interface PropertyControlRendererProps {
    prop: PropDefinition;
    value: unknown;
    onChange: (value: unknown) => void;
}

const PropertyControlRenderer = memo(function PropertyControlRenderer({
    prop,
    value,
    onChange,
}: PropertyControlRendererProps) {
    switch (prop.type) {
        case 'number':
            return (
                <PropertySlider
                    label={prop.name}
                    value={(value as number) ?? (prop.default as number) ?? 0}
                    min={0}
                    max={100}
                    step={1}
                    description={prop.description}
                    onChange={onChange}
                />
            );

        case 'boolean':
            return (
                <PropertyToggle
                    label={prop.name}
                    checked={(value as boolean) ?? (prop.default as boolean) ?? false}
                    description={prop.description}
                    onChange={onChange}
                />
            );

        case 'select':
            return (
                <PropertySelect
                    label={prop.name}
                    value={(value as string) ?? (prop.default as string) ?? ''}
                    options={prop.options || []}
                    description={prop.description}
                    onChange={onChange}
                />
            );

        case 'color':
            return (
                <PropertyColor
                    label={prop.name}
                    value={(value as string) ?? (prop.default as string) ?? '#000000'}
                    description={prop.description}
                    onChange={onChange}
                />
            );

        case 'string':
        default:
            // Check if this looks like a file/image property
            if (prop.name.toLowerCase().includes('image') ||
                prop.name.toLowerCase().includes('background') ||
                prop.name.toLowerCase().includes('upload')) {
                return (
                    <PropertyUpload
                        label={prop.name}
                        value={(value as string | null) ?? null}
                        description={prop.description}
                        onChange={onChange}
                    />
                );
            }
            return (
                <PropertyInput
                    label={prop.name}
                    value={(value as string) ?? (prop.default as string) ?? ''}
                    placeholder={`Enter ${prop.name}...`}
                    description={prop.description}
                    onChange={onChange}
                />
            );
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ShowcaseControlPanel - Auto-generating control panel from PropDefinition
 * 
 * Features:
 * - Auto-generates appropriate control for each PropDefinition type
 * - Groups properties by type for organization
 * - Composes ControlPanel base for consistent styling
 * - Real-time value binding
 * 
 * @example
 * ```tsx
 * <ShowcaseControlPanel
 *     componentName="GenericPanel"
 *     propDefs={propDefinitions}
 *     values={currentProps}
 *     onChange={(prop, val) => setProps(prev => ({ ...prev, [prop]: val }))}
 * />
 * ```
 */
export const ShowcaseControlPanel = memo(function ShowcaseControlPanel({
    componentName,
    propDefs,
    values,
    onChange,
    visible = true,
    grouped = true,
    className = '',
}: ShowcaseControlPanelProps) {
    // Group properties if enabled
    const propGroups = useMemo(() =>
        grouped ? groupProperties(propDefs) : null,
        [propDefs, grouped]);

    // Create change handler factory
    const createChangeHandler = useCallback((propName: string) =>
        (value: unknown) => {
            console.log('[ShowcaseControlPanel] createChangeHandler called:', propName, value);
            onChange(propName, value);
        },
        [onChange]);

    if (!visible) return null;

    return (
        <ControlPanel
            title="Properties"
            titleIcon="⚙️"
            collapsible={false}
            defaultCollapsed={false}
            className={`showcase-control-panel ${className}`}
        >
            {grouped && propGroups ? (
                // Grouped view
                propGroups.map(group => (
                    <ControlPanelSection
                        key={group.title}
                        title={group.title}
                        icon={group.icon}
                    >
                        {group.props.map(prop => (
                            <PropertyControlRenderer
                                key={prop.name}
                                prop={prop}
                                value={values[prop.name]}
                                onChange={createChangeHandler(prop.name)}
                            />
                        ))}
                    </ControlPanelSection>
                ))
            ) : (
                // Flat list view
                <ControlPanelSection title="Properties" icon="⚙️">
                    {propDefs.map(prop => (
                        <PropertyControlRenderer
                            key={prop.name}
                            prop={prop}
                            value={values[prop.name]}
                            onChange={createChangeHandler(prop.name)}
                        />
                    ))}
                </ControlPanelSection>
            )}
        </ControlPanel>
    );
});

ShowcaseControlPanel.displayName = 'ShowcaseControlPanel';
export default ShowcaseControlPanel;
