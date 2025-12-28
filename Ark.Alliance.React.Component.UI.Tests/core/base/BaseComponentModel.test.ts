/**
 * @fileoverview BaseComponentModel Unit Tests
 * @module tests/core/base
 * 
 * Tests real BaseComponentModel schema with mock data from scenarios.
 */

import { describe, it, expect } from 'vitest';
import { BaseModelSchema } from '@core/base/BaseComponentModel';
import { loadCoreScenario, SCENARIO_IDS } from '../../fixtures/TestScenarioLoader';

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO-DRIVEN TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('BaseComponentModel', () => {
    describe('BASE-001: Default Values', () => {
        const scenario = loadCoreScenario(SCENARIO_IDS.BASE_DEFAULTS);

        it('should parse empty object with defaults', () => {
            expect(scenario).not.toBeNull();

            const result = BaseModelSchema.parse(scenario!.input || {});

            // id is optional, so may be undefined
            expect(result.disabled).toBe(false);
            expect(result.loading).toBe(false);
        });

        it('should accept explicit id', () => {
            const result = BaseModelSchema.parse({ id: 'my-id' });
            expect(result.id).toBe('my-id');
        });
    });

    describe('BASE-002: Custom Values', () => {
        const scenario = loadCoreScenario(SCENARIO_IDS.BASE_CUSTOM);

        it('should accept custom values from scenario', () => {
            expect(scenario).not.toBeNull();

            const result = BaseModelSchema.parse(scenario!.input);

            expect(result.id).toBe(scenario!.expectedResults.id);
            expect(result.disabled).toBe(scenario!.expectedResults.disabled);
            expect(result.className).toBe(scenario!.expectedResults.className);
            expect(result.ariaLabel).toBe(scenario!.expectedResults.ariaLabel);
        });
    });

    describe('property validation', () => {
        it('should accept valid testId', () => {
            const result = BaseModelSchema.parse({ testId: 'test-button' });
            expect(result.testId).toBe('test-button');
        });

        it('should accept custom style object', () => {
            const style = { color: 'red', fontSize: '16px' };
            const result = BaseModelSchema.parse({ style });
            expect(result.style).toEqual(style);
        });

        it('should accept metadata object', () => {
            const metadata = { customField: 'value' };
            const result = BaseModelSchema.parse({ metadata });
            expect(result.metadata).toEqual(metadata);
        });

        it('should default disabled to false', () => {
            const result = BaseModelSchema.parse({});
            expect(result.disabled).toBe(false);
        });

        it('should default loading to false', () => {
            const result = BaseModelSchema.parse({});
            expect(result.loading).toBe(false);
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION TESTS - Using Real Schema
// ═══════════════════════════════════════════════════════════════════════════

describe('BaseModelSchema integration', () => {
    it('should parse full model with all properties', () => {
        const input = {
            id: 'my-component',
            disabled: true,
            loading: true,
            className: 'custom-class',
            style: { padding: '10px' },
            testId: 'test-id',
            ariaLabel: 'Accessible label',
            metadata: { version: 1 },
        };

        const result = BaseModelSchema.parse(input);

        expect(result).toMatchObject(input);
    });

    it('should handle partial input gracefully', () => {
        const result = BaseModelSchema.parse({ className: 'only-class' });

        expect(result.className).toBe('only-class');
        expect(result.disabled).toBe(false);
        expect(result.loading).toBe(false);
    });
});
