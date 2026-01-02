/**
 * @fileoverview Component Registry for Showcase
 * @module showcase
 * 
 * Registers all components with their props and presets.
 */

import type { ComponentCategory, PropDefinition, StylePreset } from './ShowcaseApp';

// Import components
import { NeonButton } from '../components/Buttons';
import { NeonToggle } from '../components/Toggles';
import { GlowCard } from '../components/Cards';
import { CircularGauge, SpeedometerGauge, DigitalGauge, BatteryGauge, SignalBarsGauge } from '../components/Gauges';
import { TradingGridCard } from '../components/Grids';
import { Input, Select, TextArea, Slider, NumericInput, FileUpload } from '../components/Input';
import { ProgressBar } from '../components/ProgressBar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Modal } from '../components/Modal';
import { SideBarMenu } from '../components/SideBar';
import { StatusBadge } from '../components/Label';
import { Chart3D } from '../components/Chart3D';
import { GenericPanel } from '../components/GenericPanel';
import { FAIcon } from '../components/Icon';
import { TabControl } from '../components/TabControl';
import { TreeView } from '../components/TreeView';
import { Carousel } from '../components/Slides';
import { Timeline } from '../components/TimeLines';

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON PRESETS
// ═══════════════════════════════════════════════════════════════════════════

const neonButtonPresets: StylePreset[] = [
    { name: 'Primary', props: { variant: 'primary', children: 'Primary Button' } },
    { name: 'Success', props: { variant: 'success', children: 'Success' } },
    { name: 'Danger', props: { variant: 'danger', children: 'Delete' } },
    { name: 'Warning', props: { variant: 'warning', children: 'Warning' } },
    { name: 'Ghost', props: { variant: 'ghost', children: 'Ghost' } },
    { name: 'Full Width', props: { variant: 'primary', fullWidth: true, children: 'Full Width' } },
    { name: 'Small', props: { variant: 'primary', size: 'sm', children: 'Small' } },
    { name: 'Large', props: { variant: 'success', size: 'lg', children: 'Large' } },
];

const neonButtonProps: PropDefinition[] = [
    { name: 'children', type: 'string', default: 'Button', description: 'Button text' },
    { name: 'variant', type: 'select', default: 'primary', options: ['primary', 'success', 'danger', 'warning', 'ghost'] },
    { name: 'size', type: 'select', default: 'md', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { name: 'fullWidth', type: 'boolean', default: false },
    { name: 'disabled', type: 'boolean', default: false },
    { name: 'isDark', type: 'boolean', default: true },
];

// ═══════════════════════════════════════════════════════════════════════════
// TOGGLE PRESETS
// ═══════════════════════════════════════════════════════════════════════════

const neonTogglePresets: StylePreset[] = [
    { name: 'Default', props: { checked: false, label: 'Enable Feature' } },
    { name: 'Checked', props: { checked: true, label: 'Active' } },
    { name: 'Cyan', props: { checked: true, onColor: '#00ffff', label: 'Cyan' } },
    { name: 'Green', props: { checked: true, onColor: '#10b981', label: 'Success' } },
    { name: 'Purple', props: { checked: true, onColor: '#8b5cf6', label: 'Premium' } },
    { name: 'Compact', props: { checked: true, size: 'sm', label: 'Compact' } },
];

const neonToggleProps: PropDefinition[] = [
    { name: 'checked', type: 'boolean', default: false },
    { name: 'label', type: 'string', default: 'Toggle' },
    { name: 'onColor', type: 'select', default: '#10b981', options: ['#10b981', '#00ffff', '#8b5cf6', '#ef4444', '#f59e0b'], description: 'Color when ON' },
    { name: 'offColor', type: 'select', default: '#4b5563', options: ['#4b5563', '#6b7280', '#9ca3af'], description: 'Color when OFF' },
    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg'] },
    { name: 'disabled', type: 'boolean', default: false },
    { name: 'isDark', type: 'boolean', default: true },
];

// ═══════════════════════════════════════════════════════════════════════════
// CARD PRESETS
// ═══════════════════════════════════════════════════════════════════════════

const glowCardPresets: StylePreset[] = [
    { name: 'Idle', props: { status: 'idle', title: 'System Status' } },
    { name: 'Success', props: { status: 'success', title: 'All Systems Operational' } },
    { name: 'Warning', props: { status: 'warning', title: '3 Pending Alerts' } },
    { name: 'Error', props: { status: 'error', title: 'Critical Error' } },
    { name: 'Compact', props: { status: 'success', title: 'Compact Card', compact: true } },
];

const glowCardProps: PropDefinition[] = [
    { name: 'title', type: 'string', default: 'Card Title' },
    { name: 'subtitle', type: 'string', default: '' },
    { name: 'status', type: 'select', default: 'idle', options: ['idle', 'success', 'warning', 'error', 'info'] },
    { name: 'compact', type: 'boolean', default: false },
    { name: 'isDark', type: 'boolean', default: true },
];

// ═══════════════════════════════════════════════════════════════════════════
// GAUGE PRESETS
// ═══════════════════════════════════════════════════════════════════════════

const circularGaugePresets: StylePreset[] = [
    { name: 'CPU Usage', props: { value: 67, max: 100, label: 'CPU', color: 'blue' } },
    { name: 'Memory High', props: { value: 85, max: 100, label: 'Memory', color: 'yellow', autoColor: true } },
    { name: 'Critical', props: { value: 95, max: 100, label: 'Disk', autoColor: true } },
    { name: 'Success', props: { value: 42, max: 100, label: 'Load', color: 'green' } },
    { name: 'Small', props: { value: 50, max: 100, label: 'Temp', size: 'sm' } },
    { name: 'Large', props: { value: 75, max: 100, label: 'Network', size: 'lg', color: 'cyan' } },
];

const gaugeProps: PropDefinition[] = [
    { name: 'value', type: 'number', default: 50 },
    { name: 'min', type: 'number', default: 0 },
    { name: 'max', type: 'number', default: 100 },
    { name: 'label', type: 'string', default: 'Gauge' },
    { name: 'unit', type: 'string', default: '' },
    { name: 'color', type: 'select', default: 'blue', options: ['blue', 'green', 'red', 'cyan', 'yellow', 'purple'] },
    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg'] },
    { name: 'showPercentage', type: 'boolean', default: false },
    { name: 'autoColor', type: 'boolean', default: false },
];

const digitalGaugePresets: StylePreset[] = [
    { name: 'Temperature', props: { value: 23.5, label: 'Temp', unit: '°C', decimals: 1 } },
    { name: 'Speed', props: { value: 128, max: 200, label: 'Speed', unit: 'km/h' } },
    { name: 'Percentage', props: { value: 75, label: 'Progress', showPercentage: true } },
];

const batteryGaugePresets: StylePreset[] = [
    { name: 'Full', props: { value: 100, label: 'Battery' } },
    { name: 'Medium', props: { value: 60, label: 'Battery' } },
    { name: 'Low', props: { value: 20, label: 'Battery' } },
    { name: 'Critical', props: { value: 5, label: 'Battery' } },
];

const signalBarsPresets: StylePreset[] = [
    { name: 'Excellent', props: { value: 100, label: 'Signal' } },
    { name: 'Good', props: { value: 75, label: 'Signal' } },
    { name: 'Fair', props: { value: 50, label: 'Signal' } },
    { name: 'Weak', props: { value: 25, label: 'Signal' } },
];

// ═══════════════════════════════════════════════════════════════════════════
// GRID PRESETS
// ═══════════════════════════════════════════════════════════════════════════

const tradingGridCardPresets: StylePreset[] = [
    { name: 'Idle', props: { status: 'idle', title: 'Orders' } },
    { name: 'Success', props: { status: 'success', title: 'Open Positions', subtitle: '3 active' } },
    { name: 'Warning', props: { status: 'warning', title: 'Pending', subtitle: '2 awaiting' } },
    { name: 'Error', props: { status: 'error', title: 'Failed Orders' } },
];

const tradingGridCardProps: PropDefinition[] = [
    { name: 'title', type: 'string', default: 'Grid Card' },
    { name: 'subtitle', type: 'string', default: '' },
    { name: 'status', type: 'select', default: 'idle', options: ['idle', 'success', 'warning', 'error'] },
    { name: 'isDark', type: 'boolean', default: true },
];

// ═══════════════════════════════════════════════════════════════════════════
// GENERIC PANEL PRESETS
// ═══════════════════════════════════════════════════════════════════════════

const genericPanelPresets: StylePreset[] = [
    { name: 'Default', props: { title: 'Panel', children: 'Panel content' } },
    { name: 'Glassmorphism', props: { title: 'Glass Panel', glassBlur: 12, variant: 'glass' } },
    { name: 'Gradient', props: { title: 'Gradient Panel', useGradient: true, gradientStart: '#1e3a5f', gradientEnd: '#0f172a' } },
    { name: 'With Grid', props: { title: 'Tech Panel', showGrid: true, gridSize: 20 } },
    { name: 'Glow Effect', props: { title: 'Glow Panel', showGlow: true, glowColor: 'rgba(59, 130, 246, 0.3)' } },
    { name: 'Sidebar', props: { title: 'Sidebar', layout: 'sidebar-left', sidebarWidth: 300 } },
    { name: 'Empty State', props: { title: 'Empty', showEmptyState: true, emptyMessage: 'No data available', emptyIcon: '📭' } },
    {
        name: 'Full Featured', props: {
            title: 'Dashboard',
            glassBlur: 8,
            useGradient: true,
            gradientStart: '#1e3a5f',
            gradientEnd: '#0f172a',
            showGrid: true,
            showGlow: true,
            glowColor: 'rgba(34, 197, 94, 0.3)',
            accentColor: '#22c55e',
            borderRadius: 16
        }
    },
];

const genericPanelProps: PropDefinition[] = [
    { name: 'title', type: 'string', default: 'Panel', description: 'Panel title' },
    { name: 'variant', type: 'select', default: 'default', options: ['default', 'glass', 'bordered', 'elevated'] },
    { name: 'collapsible', type: 'boolean', default: false },
    { name: 'collapsed', type: 'boolean', default: false },
    { name: 'glassBlur', type: 'number', default: 0, description: 'Glass blur intensity (0-40px)' },
    { name: 'opacity', type: 'number', default: 100, description: 'Panel opacity (0-100%)' },
    { name: 'borderRadius', type: 'number', default: 8, description: 'Border radius (0-50px)' },
    { name: 'shadowIntensity', type: 'number', default: 20, description: 'Shadow strength (0-100)' },
    { name: 'useGradient', type: 'boolean', default: false },
    { name: 'gradientStart', type: 'color', default: '#1e3a5f' },
    { name: 'gradientEnd', type: 'color', default: '#0f172a' },
    { name: 'accentColor', type: 'color', default: '#3b82f6' },
    { name: 'showGrid', type: 'boolean', default: false },
    { name: 'gridSize', type: 'number', default: 20 },
    { name: 'showGlow', type: 'boolean', default: false },
    { name: 'glowColor', type: 'string', default: 'rgba(59, 130, 246, 0.3)' },
    { name: 'showEmptyState', type: 'boolean', default: false },
    { name: 'emptyMessage', type: 'string', default: 'No content available' },
    { name: 'layout', type: 'select', default: 'inline', options: ['inline', 'sidebar-left', 'sidebar-right', 'fullscreen'] },
    { name: 'sidebarWidth', type: 'number', default: 320 },
    { name: 'scrollable', type: 'boolean', default: false },
];

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

export const componentCategories: ComponentCategory[] = [
    {
        name: 'Buttons',
        icon: '🔘',
        description: 'Interactive buttons with neon glow effects and multiple variants for actions and CTAs',
        components: [
            {
                name: 'NeonButton',
                description: 'Premium button with neon glow effect and multiple variants',
                component: NeonButton,
                defaultProps: { children: 'Button' },
                propDefs: neonButtonProps,
                presets: neonButtonPresets,
            },
        ],
    },
    {
        name: 'Toggles',
        icon: '🎚️',
        description: 'Switch controls with smooth animations and customizable colors',
        components: [
            {
                name: 'NeonToggle',
                description: 'Toggle switch with neon glow and multiple color options',
                component: NeonToggle,
                defaultProps: { label: 'Toggle' },
                propDefs: neonToggleProps,
                presets: neonTogglePresets,
            },
        ],
    },
    {
        name: 'Cards',
        icon: '📋',
        description: 'Container components with status-based styling and hover effects',
        components: [
            {
                name: 'GlowCard',
                description: 'Card with status-based glow effect and hover animations',
                component: GlowCard,
                defaultProps: { title: 'Card Title', children: 'Card content goes here' },
                propDefs: glowCardProps,
                presets: glowCardPresets,
            },
        ],
    },
    {
        name: 'Panels',
        icon: '🪟',
        description: 'Universal panels with glassmorphism, gradients, grid overlays, and dynamic theming',
        components: [
            {
                name: 'GenericPanel',
                description: 'Universal panel with glassmorphism, gradients, grid overlay, glow effects, and dynamic theming',
                component: GenericPanel,
                defaultProps: { title: 'Panel', children: 'Panel content goes here' },
                propDefs: genericPanelProps,
                presets: genericPanelPresets,
            },
        ],
    },
    {
        name: 'Gauges',
        icon: '📊',
        description: 'Data visualization gauges for metrics, progress, and status indicators',
        components: [
            {
                name: 'CircularGauge',
                description: 'Circular progress gauge with gradient and glow effects',
                component: CircularGauge,
                defaultProps: { value: 50, max: 100, label: 'Gauge' },
                propDefs: gaugeProps,
                presets: circularGaugePresets,
            },
            {
                name: 'SpeedometerGauge',
                description: 'Speedometer-style gauge with needle indicator',
                component: SpeedometerGauge,
                defaultProps: { value: 50, max: 100, label: 'Speed' },
                propDefs: gaugeProps,
                presets: circularGaugePresets,
            },
            {
                name: 'DigitalGauge',
                description: 'Digital numeric display with trend indicator',
                component: DigitalGauge,
                defaultProps: { value: 50, label: 'Value' },
                propDefs: gaugeProps,
                presets: digitalGaugePresets,
            },
            {
                name: 'BatteryGauge',
                description: 'Battery-style segmented gauge',
                component: BatteryGauge,
                defaultProps: { value: 75, label: 'Battery' },
                propDefs: gaugeProps,
                presets: batteryGaugePresets,
            },
            {
                name: 'SignalBarsGauge',
                description: 'Signal strength bars indicator',
                component: SignalBarsGauge,
                defaultProps: { value: 80, label: 'Signal' },
                propDefs: gaugeProps,
                presets: signalBarsPresets,
            },
        ],
    },
    {
        name: 'Grids',
        icon: '📑',
        description: 'Data grid components for tables and list displays',
        components: [
            {
                name: 'TradingGridCard',
                description: 'Glow card wrapper for data grids with status styling',
                component: TradingGridCard,
                defaultProps: { title: 'Grid', children: 'Grid content' },
                propDefs: tradingGridCardProps,
                presets: tradingGridCardPresets,
            },
        ],
    },
    {
        name: 'Inputs',
        icon: '✏️',
        description: 'Form inputs with validation, variants, and search functionality',
        components: [
            {
                name: 'Input',
                description: 'Text input with label, validation, and variants',
                component: Input,
                defaultProps: { label: 'Input Label', placeholder: 'Enter text...' },
                propDefs: [
                    { name: 'label', type: 'string', default: 'Label' },
                    { name: 'placeholder', type: 'string', default: 'Enter...' },
                    { name: 'variant', type: 'select', default: 'default', options: ['default', 'neon', 'minimal'] },
                    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg'] },
                    { name: 'error', type: 'string', default: '' },
                    { name: 'disabled', type: 'boolean', default: false },
                ],
                presets: [
                    { name: 'Default', props: { label: 'Username', placeholder: 'Enter username' } },
                    { name: 'Neon', props: { label: 'Email', variant: 'neon', placeholder: 'email@example.com' } },
                    { name: 'Error', props: { label: 'Password', error: 'Password is required' } },
                ],
            },
            {
                name: 'Select',
                description: 'Dropdown with search, keyboard nav, and icons',
                component: Select,
                defaultProps: {
                    label: 'Select Option',
                    options: [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }, { value: 'c', label: 'Option C' }]
                },
                propDefs: [
                    { name: 'label', type: 'string', default: 'Select' },
                    { name: 'placeholder', type: 'string', default: 'Select...' },
                    { name: 'searchable', type: 'boolean', default: false },
                    { name: 'variant', type: 'select', default: 'default', options: ['default', 'neon', 'minimal'] },
                    { name: 'disabled', type: 'boolean', default: false },
                ],
                presets: [
                    { name: 'Default', props: { label: 'Choose', options: [{ value: 'a', label: 'Option A' }] } },
                    { name: 'Searchable', props: { label: 'Search', searchable: true, options: [{ value: 'a', label: 'Apple' }, { value: 'b', label: 'Banana' }] } },
                ],
            },
            {
                name: 'TextArea',
                description: 'Multi-line text input with resize, character count',
                component: TextArea,
                defaultProps: { label: 'Description', placeholder: 'Enter description...', rows: 4 },
                propDefs: [
                    { name: 'label', type: 'string', default: 'Label' },
                    { name: 'placeholder', type: 'string', default: 'Enter text...' },
                    { name: 'rows', type: 'number', default: 4 },
                    { name: 'maxLength', type: 'number', default: 500 },
                    { name: 'resize', type: 'select', default: 'vertical', options: ['none', 'vertical', 'horizontal', 'both'] },
                    { name: 'variant', type: 'select', default: 'default', options: ['default', 'neon', 'minimal'] },
                    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg'] },
                    { name: 'disabled', type: 'boolean', default: false },
                ],
                presets: [
                    { name: 'Default', props: { label: 'Comments', placeholder: 'Enter comments...', rows: 4 } },
                    { name: 'Neon', props: { label: 'Notes', variant: 'neon', rows: 3 } },
                    { name: 'With Limit', props: { label: 'Bio', maxLength: 200, placeholder: 'About yourself...' } },
                ],
            },
            {
                name: 'Slider',
                description: 'Range input with neon glow styling',
                component: Slider,
                defaultProps: { label: 'Volume', value: 50, min: 0, max: 100 },
                propDefs: [
                    { name: 'label', type: 'string', default: 'Label' },
                    { name: 'value', type: 'number', default: 50 },
                    { name: 'min', type: 'number', default: 0 },
                    { name: 'max', type: 'number', default: 100 },
                    { name: 'step', type: 'number', default: 1 },
                    { name: 'unit', type: 'string', default: '' },
                    { name: 'showValue', type: 'boolean', default: true },
                    { name: 'color', type: 'select', default: 'cyan', options: ['cyan', 'blue', 'green', 'purple', 'red', 'yellow'] },
                    { name: 'variant', type: 'select', default: 'default', options: ['default', 'neon', 'minimal'] },
                    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg'] },
                ],
                presets: [
                    { name: 'Default', props: { label: 'Volume', value: 75, unit: '%' } },
                    { name: 'Neon Blue', props: { label: 'Brightness', value: 50, color: 'blue', variant: 'neon' } },
                    { name: 'Speed Control', props: { label: 'Speed', value: 500, min: 100, max: 2000, step: 100, unit: 'ms' } },
                ],
            },
            {
                name: 'NumericInput',
                description: 'Number input with stepper controls',
                component: NumericInput,
                defaultProps: { label: 'Quantity', value: 10, min: 0, max: 100 },
                propDefs: [
                    { name: 'label', type: 'string', default: 'Label' },
                    { name: 'value', type: 'number', default: 0 },
                    { name: 'min', type: 'number', default: 0 },
                    { name: 'max', type: 'number', default: 100 },
                    { name: 'step', type: 'number', default: 1 },
                    { name: 'unit', type: 'string', default: '' },
                    { name: 'showStepper', type: 'boolean', default: true },
                    { name: 'variant', type: 'select', default: 'default', options: ['default', 'neon', 'minimal'] },
                    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg'] },
                ],
                presets: [
                    { name: 'Default', props: { label: 'Quantity', value: 5 } },
                    { name: 'With Unit', props: { label: 'Opacity', value: 0.8, min: 0, max: 1, step: 0.1, unit: '' } },
                    { name: 'Neon', props: { label: 'Count', value: 10, variant: 'neon' } },
                ],
            },
            {
                name: 'FileUpload',
                description: 'Drag-and-drop file upload with preview',
                component: FileUpload,
                defaultProps: { label: 'Upload Image', accept: 'image/*' },
                propDefs: [
                    { name: 'label', type: 'string', default: 'Label' },
                    { name: 'accept', type: 'string', default: '*' },
                    { name: 'placeholder', type: 'string', default: 'Drop file here or click to upload' },
                    { name: 'showPreview', type: 'boolean', default: true },
                    { name: 'variant', type: 'select', default: 'default', options: ['default', 'neon', 'minimal'] },
                    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg'] },
                ],
                presets: [
                    { name: 'Image Upload', props: { label: 'Profile Picture', accept: 'image/*' } },
                    { name: 'Neon', props: { label: 'Background', variant: 'neon', accept: 'image/*' } },
                    { name: 'Any File', props: { label: 'Attachment', accept: '*' } },
                ],
            },
        ],
    },
    {
        name: 'Progress',
        icon: '📊',
        description: 'Progress indicators with multiple styles and animations',
        components: [
            {
                name: 'ProgressBar',
                description: 'Linear progress bar with colors, variants, and animations',
                component: ProgressBar,
                defaultProps: { value: 60, max: 100, label: 'Loading' },
                propDefs: [
                    { name: 'value', type: 'number', default: 50 },
                    { name: 'max', type: 'number', default: 100 },
                    { name: 'label', type: 'string', default: '' },
                    { name: 'showPercentage', type: 'boolean', default: false },
                    { name: 'color', type: 'select', default: 'cyan', options: ['cyan', 'blue', 'green', 'red', 'purple', 'yellow'] },
                    { name: 'variant', type: 'select', default: 'default', options: ['default', 'neon', 'gradient', 'striped'] },
                    { name: 'animated', type: 'boolean', default: false },
                    { name: 'indeterminate', type: 'boolean', default: false },
                ],
                presets: [
                    { name: 'Default', props: { value: 50, label: 'Progress' } },
                    { name: 'Neon', props: { value: 75, variant: 'neon', showPercentage: true } },
                    { name: 'Striped', props: { value: 60, variant: 'striped', animated: true } },
                    { name: 'Indeterminate', props: { indeterminate: true, label: 'Loading...' } },
                ],
            },
        ],
    },
    {
        name: 'Layout',
        icon: '📐',
        description: 'Header and Footer components for page and panel layouts',
        components: [
            {
                name: 'Header',
                description: 'Enhanced header with visual modes, icons, search, and backgrounds',
                component: Header,
                defaultProps: { title: 'Header Title', subtitle: 'Subtitle text' },
                propDefs: [
                    { name: 'title', type: 'string', default: 'Title' },
                    { name: 'subtitle', type: 'string', default: '' },
                    { name: 'icon', type: 'string', default: '' },
                    { name: 'visualMode', type: 'select', default: 'normal', options: ['normal', 'neon', 'minimal', 'glass'] },
                    { name: 'variant', type: 'select', default: 'panel', options: ['panel', 'page', 'section', 'card', 'grid'] },
                    { name: 'showSearch', type: 'boolean', default: false },
                    { name: 'isDark', type: 'boolean', default: true },
                ],
                presets: [
                    { name: 'Panel', props: { title: 'Panel Header', variant: 'panel' } },
                    { name: 'Neon', props: { title: 'Neon Header', visualMode: 'neon', icon: '✨' } },
                    { name: 'With Search', props: { title: 'Data Grid', showSearch: true, variant: 'grid' } },
                    { name: 'Glass', props: { title: 'Glass Header', visualMode: 'glass', icon: '🔮' } },
                ],
            },
            {
                name: 'Footer',
                description: 'Footer with paging controls and Grid integration',
                component: Footer,
                defaultProps: { text: 'Footer content' },
                propDefs: [
                    { name: 'text', type: 'string', default: '' },
                    { name: 'showPaging', type: 'boolean', default: false },
                    { name: 'visualMode', type: 'select', default: 'normal', options: ['normal', 'neon', 'minimal', 'glass'] },
                    { name: 'variant', type: 'select', default: 'panel', options: ['panel', 'page', 'grid'] },
                    { name: 'isDark', type: 'boolean', default: true },
                ],
                presets: [
                    { name: 'Text', props: { text: '© 2024 Ark Alliance' } },
                    { name: 'Paging', props: { showPaging: true, paging: { currentPage: 1, totalPages: 5, totalItems: 50 } } },
                    { name: 'Neon', props: { text: 'Neon Footer', visualMode: 'neon' } },
                ],
            },
        ],
    },
    {
        name: 'Modals',
        icon: '🪟',
        description: 'Modal dialogs for confirmations, forms, and content overlays',
        components: [
            {
                name: 'Modal',
                description: 'Dialog overlay with backdrop, sizes, and close handling',
                component: Modal,
                defaultProps: { title: 'Modal Title', isOpen: true, onClose: () => { }, children: 'Modal content goes here.' },
                propDefs: [
                    { name: 'title', type: 'string', default: 'Title' },
                    { name: 'subtitle', type: 'string', default: '' },
                    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg', 'xl', 'full'] },
                    { name: 'centered', type: 'boolean', default: true },
                    { name: 'showClose', type: 'boolean', default: true },
                    { name: 'closeOnBackdrop', type: 'boolean', default: true },
                    { name: 'closeOnEscape', type: 'boolean', default: true },
                    { name: 'isDark', type: 'boolean', default: true },
                ],
                presets: [
                    { name: 'Default', props: { title: 'Confirm Action', children: 'Are you sure?' } },
                    { name: 'Large', props: { title: 'Edit Profile', size: 'lg' } },
                    { name: 'Full Screen', props: { title: 'Settings', size: 'full' } },
                ],
            },
        ],
    },
    {
        name: 'Navigation',
        icon: '🧭',
        description: 'Sidebar navigation with collapsible categories and menu items',
        components: [
            {
                name: 'SideBarMenu',
                description: 'Collapsible sidebar with hamburger toggle and category grouping',
                component: SideBarMenu,
                defaultProps: {
                    title: 'Navigation',
                    categories: [
                        { name: 'Dashboard', icon: '📊', items: [{ key: 'overview', label: 'Overview', icon: '📈' }] },
                        { name: 'Settings', icon: '⚙️', items: [{ key: 'profile', label: 'Profile', icon: '👤' }] },
                    ]
                },
                propDefs: [
                    { name: 'title', type: 'string', default: 'Menu' },
                    { name: 'variant', type: 'select', default: 'default', options: ['default', 'neon', 'minimal'] },
                    { name: 'showHamburger', type: 'boolean', default: true },
                    { name: 'defaultCollapsed', type: 'boolean', default: false },
                    { name: 'isDark', type: 'boolean', default: true },
                ],
                presets: [
                    { name: 'Default', props: { title: 'Menu', categories: [{ name: 'Main', icon: '📁', items: [{ key: 'home', label: 'Home' }] }] } },
                    { name: 'Neon', props: { title: 'Neon Nav', variant: 'neon' } },
                    { name: 'Collapsed', props: { title: 'Compact', defaultCollapsed: true } },
                ],
            },
        ],
    },
    {
        name: 'Status',
        icon: '🚦',
        description: 'Status indicators and badges for system states',
        components: [
            {
                name: 'StatusBadge',
                description: 'Status indicator with pulse animation for running states',
                component: StatusBadge,
                defaultProps: { status: 'running', label: 'Running' },
                propDefs: [
                    { name: 'status', type: 'select', default: 'running', options: ['running', 'stopped', 'error', 'pending', 'paused', 'idle'] },
                    { name: 'label', type: 'string', default: '' },
                    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg'] },
                    { name: 'showPulse', type: 'boolean', default: true },
                    { name: 'isDark', type: 'boolean', default: true },
                ],
                presets: [
                    { name: 'Running', props: { status: 'running', label: 'Running' } },
                    { name: 'Stopped', props: { status: 'stopped', label: 'Stopped' } },
                    { name: 'Error', props: { status: 'error', label: 'Error' } },
                    { name: 'Pending', props: { status: 'pending', label: 'Pending' } },
                    { name: 'Paused', props: { status: 'paused', label: 'Paused' } },
                ],
            },
        ],
    },
    {
        name: 'Charts',
        icon: '📈',
        description: '3D data visualization with streaming and multiple shape types',
        components: [
            {
                name: 'Chart3D',
                description: 'Interactive 3D chart with cuboids, cylinders, bubbles, and candles',
                component: Chart3D,
                defaultProps: { height: 500, shape: 'Cuboid', seriesCount: 2, isStreaming: true },
                propDefs: [
                    { name: 'height', type: 'number', default: 500 },
                    { name: 'shape', type: 'select', default: 'Cuboid', options: ['Cuboid', 'Cylinder', 'Bubble', 'Candle', 'Lines Only', 'Surface'] },
                    { name: 'seriesCount', type: 'number', default: 2 },
                    { name: 'xResolution', type: 'number', default: 100 },
                    { name: 'isStreaming', type: 'boolean', default: true },
                    { name: 'speed', type: 'number', default: 500 },
                    { name: 'bloomIntensity', type: 'number', default: 1.5 },
                    { name: 'showGrid', type: 'boolean', default: true },
                    { name: 'showSurface', type: 'boolean', default: true },
                    { name: 'showControls', type: 'boolean', default: true },
                ],
                presets: [
                    { name: 'Cuboid Bars', props: { shape: 'Cuboid', seriesCount: 2 } },
                    { name: 'Bubbles', props: { shape: 'Bubble', seriesCount: 3, bloomIntensity: 2 } },
                    { name: 'Candlestick', props: { shape: 'Candle', seriesCount: 1 } },
                    { name: 'Line Chart', props: { shape: 'Lines Only', seriesCount: 4, showSurface: true } },
                    { name: 'Surface', props: { shape: 'Surface', seriesCount: 5 } },
                ],
            },
        ],
    },
    {
        name: 'Icons',
        icon: '🎭',
        description: 'FontAwesome icons with size, color, and animation options',
        components: [
            {
                name: 'FAIcon',
                description: 'FontAwesome 6 icon with solid, regular, and brand styles',
                component: FAIcon,
                defaultProps: { name: 'check', size: 'lg' },
                propDefs: [
                    { name: 'name', type: 'string', default: 'check', description: 'Icon name (e.g., user, heart, star)' },
                    { name: 'iconStyle', type: 'select', default: 'solid', options: ['solid', 'regular', 'brands'] },
                    { name: 'size', type: 'select', default: 'lg', options: ['xs', 'sm', '1x', 'lg', 'xl', '2xl', '2x', '3x', '4x', '5x'] },
                    { name: 'color', type: 'string', default: '#00d4ff', description: 'CSS color value' },
                    { name: 'rotation', type: 'select', default: '0', options: ['0', '90', '180', '270'] },
                    { name: 'flip', type: 'select', default: 'none', options: ['none', 'horizontal', 'vertical', 'both'] },
                    { name: 'spin', type: 'boolean', default: false },
                    { name: 'pulse', type: 'boolean', default: false },
                    { name: 'beat', type: 'boolean', default: false },
                    { name: 'fade', type: 'boolean', default: false },
                    { name: 'bounce', type: 'boolean', default: false },
                    { name: 'shake', type: 'boolean', default: false },
                    { name: 'fixedWidth', type: 'boolean', default: false },
                    { name: 'border', type: 'boolean', default: false },
                ],
                presets: [
                    { name: 'Check', props: { name: 'check', color: '#10b981', size: '2x' } },
                    { name: 'User', props: { name: 'user', color: '#3b82f6', size: '2x' } },
                    { name: 'Heart', props: { name: 'heart', iconStyle: 'regular', color: '#ef4444', size: '2x' } },
                    { name: 'Star', props: { name: 'star', color: '#fbbf24', size: '2x' } },
                    { name: 'Spinner', props: { name: 'spinner', spin: true, color: '#00d4ff', size: '2x' } },
                    { name: 'Bell Shake', props: { name: 'bell', shake: true, color: '#f59e0b', size: '2x' } },
                    { name: 'Loading', props: { name: 'circle-notch', spin: true, color: '#8b5cf6', size: '2x' } },
                    { name: 'GitHub', props: { name: 'github', iconStyle: 'brands', color: '#f3f4f6', size: '2x' } },
                    { name: 'Warning', props: { name: 'triangle-exclamation', color: '#f59e0b', size: '2x' } },
                    { name: 'Arrow Right', props: { name: 'arrow-right', color: '#00d4ff', size: '2x', bounce: true } },
                ],
            },
        ],
    },
    {
        name: 'Tabs',
        icon: '📑',
        description: 'Tab navigation with keyboard support and multiple variants',
        components: [
            {
                name: 'TabControl',
                description: 'Tab navigation with Icon and Label primitives, keyboard nav, closeable tabs',
                component: TabControl,
                defaultProps: {
                    items: [
                        { tabKey: 'tab1', label: 'Dashboard', icon: 'chart-line' },
                        { tabKey: 'tab2', label: 'Settings', icon: 'cog' },
                        { tabKey: 'tab3', label: 'Profile', icon: 'user' },
                    ],
                    activeKey: 'tab1'
                },
                propDefs: [
                    { name: 'activeKey', type: 'string', default: '', description: 'Active tab key' },
                    { name: 'variant', type: 'select', default: 'underlined', options: ['underlined', 'pills', 'boxed'] },
                    { name: 'orientation', type: 'select', default: 'horizontal', options: ['horizontal', 'vertical'] },
                    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg'] },
                ],
                presets: [
                    { name: 'Default', props: { items: [{ tabKey: 't1', label: 'Tab 1' }, { tabKey: 't2', label: 'Tab 2' }], activeKey: 't1' } },
                    { name: 'Pills', props: { variant: 'pills', items: [{ tabKey: 't1', label: 'Home' }] } },
                    { name: 'Vertical', props: { orientation: 'vertical', items: [{ tabKey: 't1', label: 'Menu' }] } },
                ],
            },
        ],
    },
    {
        name: 'Trees',
        icon: '🌳',
        description: 'Hierarchical tree navigation with expand/collapse and selection',
        components: [
            {
                name: 'TreeView',
                description: 'Recursive tree structure with Icon primitives, context-based state, keyboard nav',
                component: TreeView,
                defaultProps: {
                    items: [
                        {
                            key: 'root', label: 'Root', children: [
                                { key: 'child1', label: 'Child 1' },
                                { key: 'child2', label: 'Child 2', children: [{ key: 'grandchild', label: 'Grandchild' }] },
                            ]
                        },
                    ]
                },
                propDefs: [
                    { name: 'selectionMode', type: 'select', default: 'single', options: ['none', 'single', 'multiple'] },
                    { name: 'showLines', type: 'boolean', default: false },
                    { name: 'size', type: 'select', default: 'md', options: ['sm', 'md', 'lg'] },
                ],
                presets: [
                    { name: 'Default', props: { items: [{ key: 'n1', label: 'Node 1', children: [{ key: 'n1a', label: 'Node 1a' }] }] } },
                    { name: 'Multi-Select', props: { selectionMode: 'multiple' } },
                ],
            },
        ],
    },
    {
        name: 'Slides',
        icon: '🎠',
        description: 'Carousel and slideshow components with autoplay and navigation',
        components: [
            {
                name: 'Carousel',
                description: 'Slide carousel with autoplay, loop, navigation arrows and indicators',
                component: Carousel,
                defaultProps: { autoplay: false, showControls: true, showIndicators: true },
                propDefs: [
                    { name: 'autoplay', type: 'boolean', default: false },
                    { name: 'interval', type: 'number', default: 5000 },
                    { name: 'loop', type: 'boolean', default: true },
                    { name: 'showControls', type: 'boolean', default: true },
                    { name: 'showIndicators', type: 'boolean', default: true },
                    { name: 'effect', type: 'select', default: 'slide', options: ['slide', 'fade'] },
                ],
                presets: [
                    { name: 'Default', props: { showControls: true } },
                    { name: 'Autoplay', props: { autoplay: true, interval: 3000 } },
                    { name: 'Fade Effect', props: { effect: 'fade' } },
                ],
            },
        ],
    },
    {
        name: 'Timelines',
        icon: '📅',
        description: 'Event timeline with filtering, categories, and admin controls',
        components: [
            {
                name: 'Timeline',
                description: 'Event timeline with category filtering, text search, admin edit mode',
                component: Timeline,
                defaultProps: {
                    items: [
                        { id: '1', title: 'Event 1', date: '2024-01-01', status: 'completed', category: 'Work' },
                        { id: '2', title: 'Event 2', date: '2024-02-15', status: 'active', category: 'Personal' },
                    ]
                },
                propDefs: [
                    { name: 'orientation', type: 'select', default: 'vertical', options: ['vertical', 'horizontal'] },
                    { name: 'showConnectors', type: 'boolean', default: true },
                    { name: 'adminMode', type: 'boolean', default: false },
                    { name: 'filter', type: 'string', default: '' },
                    { name: 'selectedCategory', type: 'string', default: '' },
                ],
                presets: [
                    { name: 'Default', props: { items: [{ id: '1', title: 'Start', status: 'completed' }] } },
                    { name: 'Admin Mode', props: { adminMode: true } },
                    { name: 'Horizontal', props: { orientation: 'horizontal' } },
                ],
            },
        ],
    },
];

export default componentCategories;

