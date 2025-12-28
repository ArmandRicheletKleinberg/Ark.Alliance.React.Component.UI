/**
 * @fileoverview Test Scenario Loader
 * @module fixtures/TestScenarioLoader
 * 
 * Loads test scenarios from per-component JSON files.
 * Following the pattern from Ark.Alliance.Trading.Bot.PositionService.Tests
 */

// Import per-component scenario files
import coreBaseScenarios from './data/scenarios/core-base-scenarios.json';
import coreFormInputScenarios from './data/scenarios/core-form-input-scenarios.json';
import inputScenarios from './data/scenarios/input-component-scenarios.json';
import panelScenarios from './data/scenarios/panel-component-scenarios.json';
import iconScenarios from './data/scenarios/icon-component-scenarios.json';
import cardScenarios from './data/scenarios/card-component-scenarios.json';
import pageScenarios from './data/scenarios/page-component-scenarios.json';
import buttonScenarios from './data/scenarios/button-component-scenarios.json';

import type { TestAction, ComponentCategory } from './TestRunner';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ComponentScenario {
    id: string;
    name: string;
    component?: string;
    category?: ComponentCategory;
    description: string;
    input?: Record<string, unknown>;
    preset?: string;
    actions?: TestAction[];
    tags?: string[];
    testCases?: Record<string, unknown>[];
    expectedResults: Record<string, unknown>;
}

export interface ScenarioFile {
    id: string;
    name: string;
    component: string;
    category: string;
    scenarios: ComponentScenario[];
    presetScenarios?: ComponentScenario[];
}

export interface TestConfig {
    componentLibraryPath: string;
    testEnvironment: string;
    defaultTimeout: number;
    debounceMs: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: TestConfig = {
    componentLibraryPath: '../Ark.Alliance.React.Component.UI/src',
    testEnvironment: 'jsdom',
    defaultTimeout: 5000,
    debounceMs: 50,
};

/**
 * Get test configuration
 */
export function getTestConfig(): TestConfig {
    return { ...DEFAULT_CONFIG };
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO LOADERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Load a core/base schema scenario by ID
 */
export function loadCoreScenario(id: string): ComponentScenario | null {
    const baseScenario = (coreBaseScenarios as ScenarioFile).scenarios.find(s => s.id === id);
    if (baseScenario) return baseScenario;

    const formScenario = (coreFormInputScenarios as ScenarioFile).scenarios.find(s => s.id === id);
    if (formScenario) return formScenario;

    // Check preset scenarios
    const presetScenario = (coreFormInputScenarios as ScenarioFile).presetScenarios?.find(s => s.id === id);
    return presetScenario || null;
}

/**
 * Load an input component scenario by ID
 */
export function loadInputScenario(id: string): ComponentScenario | null {
    return (inputScenarios as ScenarioFile).scenarios.find(s => s.id === id) || null;
}

/**
 * Load a panel component scenario by ID
 */
export function loadPanelScenario(id: string): ComponentScenario | null {
    return (panelScenarios as ScenarioFile).scenarios.find(s => s.id === id) || null;
}

/**
 * Load an icon component scenario by ID
 */
export function loadIconScenario(id: string): ComponentScenario | null {
    return (iconScenarios as ScenarioFile).scenarios.find(s => s.id === id) || null;
}

/**
 * Load a card component scenario by ID
 */
export function loadCardScenario(id: string): ComponentScenario | null {
    return (cardScenarios as ScenarioFile).scenarios.find(s => s.id === id) || null;
}

/**
 * Load a page/layout scenario by ID
 */
export function loadPageScenario(id: string): ComponentScenario | null {
    return (pageScenarios as ScenarioFile).scenarios.find(s => s.id === id) || null;
}

/**
 * Load any scenario by ID (searches all categories)
 */
export function loadScenario(id: string): ComponentScenario | null {
    // Try each loader in order
    return (
        loadCoreScenario(id) ||
        loadInputScenario(id) ||
        loadPanelScenario(id) ||
        loadIconScenario(id) ||
        loadCardScenario(id) ||
        loadPageScenario(id)
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY GETTERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all core/base schema scenarios
 */
export function getAllCoreScenarios(): ComponentScenario[] {
    return [
        ...(coreBaseScenarios as ScenarioFile).scenarios,
        ...(coreFormInputScenarios as ScenarioFile).scenarios,
        ...((coreFormInputScenarios as ScenarioFile).presetScenarios || []),
    ];
}

/**
 * Get all input component scenarios
 */
export function getAllInputScenarios(): ComponentScenario[] {
    return (inputScenarios as ScenarioFile).scenarios;
}

/**
 * Get all panel scenarios
 */
export function getAllPanelScenarios(): ComponentScenario[] {
    return (panelScenarios as ScenarioFile).scenarios;
}

/**
 * Get all icon scenarios
 */
export function getAllIconScenarios(): ComponentScenario[] {
    return (iconScenarios as ScenarioFile).scenarios;
}

/**
 * Get all card scenarios
 */
export function getAllCardScenarios(): ComponentScenario[] {
    return (cardScenarios as ScenarioFile).scenarios;
}

/**
 * Get all page/layout scenarios
 */
export function getAllPageScenarios(): ComponentScenario[] {
    return (pageScenarios as ScenarioFile).scenarios;
}

/**
 * Get all scenarios across all categories
 */
export function getAllScenarios(): ComponentScenario[] {
    return [
        ...getAllCoreScenarios(),
        ...getAllInputScenarios(),
        ...getAllPanelScenarios(),
        ...getAllIconScenarios(),
        ...getAllCardScenarios(),
        ...getAllPageScenarios(),
    ];
}

/**
 * Get scenarios by tag
 */
export function getScenariosByTag(tag: string): ComponentScenario[] {
    return getAllScenarios().filter(s => s.tags?.includes(tag));
}

/**
 * Get regression test scenarios
 */
export function getRegressionScenarios(): ComponentScenario[] {
    return getScenariosByTag('regression');
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO ID CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const SCENARIO_IDS = {
    // Core Base
    BASE_DEFAULTS: 'BASE-001',
    BASE_CUSTOM: 'BASE-002',
    BASE_METADATA: 'BASE-003',
    BASE_STYLE: 'BASE-004',

    // Core Form Input
    FORM_DEFAULTS: 'FORM-001',
    FORM_RESTRICTIONS: 'FORM-002',
    FORM_FULL: 'FORM-003',
    FORM_VALIDATION: 'FORM-004',

    // Restriction Presets
    RESTR_BLOCK_ALL: 'RESTR-001',
    RESTR_NUMERIC: 'RESTR-002',
    RESTR_ALPHANUMERIC: 'RESTR-003',
    RESTR_FINANCIAL: 'RESTR-004',

    // Input Component
    INPUT_CONTROLLED: 'INPUT-001',
    INPUT_ERROR: 'INPUT-002',
    INPUT_PASTE_BLOCK: 'INPUT-003',
    INPUT_SANITIZE: 'INPUT-004',
    INPUT_FOCUS_BLUR: 'INPUT-005',
    INPUT_VALUE_SYNC: 'INPUT-006',
    INPUT_DISABLED: 'INPUT-007',
    INPUT_SIZES: 'INPUT-008',

    // Panel Component
    PANEL_TOGGLE: 'PANEL-001',
    PANEL_STATIC: 'PANEL-002',
    PANEL_PROP_SYNC: 'PANEL-003',
    PANEL_VARIANTS: 'PANEL-004',
    PANEL_TITLE: 'PANEL-005',

    // Icon Component
    ICON_SOLID: 'ICON-001',
    ICON_BRANDS: 'ICON-002',
    ICON_INVALID: 'ICON-003',
    ICON_SPIN: 'ICON-004',
    ICON_SIZES: 'ICON-005',
    ICON_ROTATION: 'ICON-006',
    ICON_FLIP: 'ICON-007',
    ICON_CLICK: 'ICON-008',

    // Card Component
    CARD_CLICK: 'CARD-001',
    CARD_HOVER: 'CARD-002',
    CARD_STATUS: 'CARD-003',
    CARD_COMPACT: 'CARD-004',
    CARD_DISABLED: 'CARD-005',

    // Page Component
    PAGE_DARK: 'PAGE-001',
    PAGE_BREADCRUMBS: 'PAGE-002',
    PAGE_BACK: 'PAGE-003',
    PAGE_BREADCRUMB_CLICK: 'PAGE-004',
    PAGE_LIGHT: 'PAGE-005',
    PAGE_LAYOUTS: 'PAGE-006',
};

export default {
    loadScenario,
    loadCoreScenario,
    loadInputScenario,
    loadPanelScenario,
    loadIconScenario,
    loadCardScenario,
    loadPageScenario,
    getAllScenarios,
    getRegressionScenarios,
    getTestConfig,
    SCENARIO_IDS,
};
