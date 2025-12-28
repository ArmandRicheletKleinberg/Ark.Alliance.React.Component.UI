/**
 * @fileoverview FormInputModel Unit Tests
 * @module tests/core/base
 * 
 * Tests real FormInputModel schema with mock data from scenarios.
 */

import { describe, it, expect } from 'vitest';
import {
    FormInputModelSchema,
    InputRestrictionSchema,
    InputRestrictionPresets,
} from '@core/base/FormInputModel';
import { loadCoreScenario, SCENARIO_IDS } from '../../fixtures/TestScenarioLoader';

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO-DRIVEN TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('InputRestrictionSchema', () => {
    describe('RESTR-001: Block All Preset', () => {
        const scenario = loadCoreScenario(SCENARIO_IDS.RESTR_BLOCK_ALL);

        it('should match blockAll preset configuration', () => {
            expect(scenario).not.toBeNull();

            const preset = InputRestrictionPresets.blockAll;

            expect(preset.disableCopy).toBe(true);
            expect(preset.disableCut).toBe(true);
            expect(preset.disablePaste).toBe(true);
            expect(preset.disableDrop).toBe(true);
        });
    });

    describe('default values', () => {
        it('should have all restrictions disabled by default', () => {
            const result = InputRestrictionSchema.parse({});

            expect(result.disableCopy).toBe(false);
            expect(result.disableCut).toBe(false);
            expect(result.disablePaste).toBe(false);
            expect(result.disableDrop).toBe(false);
            expect(result.sanitizePaste).toBe(false);
            expect(result.showRestrictionIndicator).toBe(true);
        });
    });

    describe('restriction flags', () => {
        it('should accept disableCopy', () => {
            const result = InputRestrictionSchema.parse({ disableCopy: true });
            expect(result.disableCopy).toBe(true);
        });

        it('should accept disablePaste', () => {
            const result = InputRestrictionSchema.parse({ disablePaste: true });
            expect(result.disablePaste).toBe(true);
        });

        it('should accept custom restriction message', () => {
            const result = InputRestrictionSchema.parse({
                restrictionMessage: 'Custom message',
            });
            expect(result.restrictionMessage).toBe('Custom message');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// FORM INPUT MODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('FormInputModelSchema', () => {
    describe('FORM-001: Default State', () => {
        const scenario = loadCoreScenario(SCENARIO_IDS.FORM_DEFAULTS);

        it('should have correct defaults from scenario', () => {
            expect(scenario).not.toBeNull();

            const result = FormInputModelSchema.parse(scenario!.input || {});

            expect(result.required).toBe(false);
            expect(result.touched).toBe(false);
            expect(result.validationState).toBe('none');
            expect(result.readOnly).toBe(false);
        });
    });

    describe('FORM-002: With Restrictions', () => {
        const scenario = loadCoreScenario(SCENARIO_IDS.FORM_RESTRICTIONS);

        it('should parse input restrictions correctly', () => {
            expect(scenario).not.toBeNull();

            const result = FormInputModelSchema.parse(scenario!.input);

            expect(result.inputRestriction?.disablePaste).toBe(true);
            expect(result.inputRestriction?.restrictionMessage).toBe('No paste allowed');
        });
    });

    describe('form properties', () => {
        it('should accept label', () => {
            const result = FormInputModelSchema.parse({ label: 'Email' });
            expect(result.label).toBe('Email');
        });

        it('should accept helpText', () => {
            const result = FormInputModelSchema.parse({ helpText: 'Enter your email' });
            expect(result.helpText).toBe('Enter your email');
        });

        it('should accept errorMessage', () => {
            const result = FormInputModelSchema.parse({ errorMessage: 'Invalid email' });
            expect(result.errorMessage).toBe('Invalid email');
        });

        it('should accept name attribute', () => {
            const result = FormInputModelSchema.parse({ name: 'email' });
            expect(result.name).toBe('email');
        });
    });

    describe('validation state', () => {
        it('should accept valid state', () => {
            const result = FormInputModelSchema.parse({ validationState: 'valid' });
            expect(result.validationState).toBe('valid');
        });

        it('should accept invalid state', () => {
            const result = FormInputModelSchema.parse({ validationState: 'invalid' });
            expect(result.validationState).toBe('invalid');
        });

        it('should reject unknown validation state', () => {
            expect(() =>
                FormInputModelSchema.parse({ validationState: 'unknown' })
            ).toThrow();
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// PRESET TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('InputRestrictionPresets', () => {
    it('none should be undefined', () => {
        expect(InputRestrictionPresets.none).toBeUndefined();
    });

    it('blockAll should block all operations', () => {
        const preset = InputRestrictionPresets.blockAll;

        expect(preset.disableCopy).toBe(true);
        expect(preset.disableCut).toBe(true);
        expect(preset.disablePaste).toBe(true);
        expect(preset.disableDrop).toBe(true);
    });

    it('blockPaste should block paste and drop only', () => {
        const preset = InputRestrictionPresets.blockPaste;

        expect(preset.disableCopy).toBeFalsy();
        expect(preset.disablePaste).toBe(true);
        expect(preset.disableDrop).toBe(true);
    });

    it('numericOnly should sanitize to numbers', () => {
        const preset = InputRestrictionPresets.numericOnly;

        expect(preset.sanitizePaste).toBe(true);
        expect(preset.allowedPattern).toBe('[0-9]');
    });

    it('alphanumericOnly should sanitize to letters and numbers', () => {
        const preset = InputRestrictionPresets.alphanumericOnly;

        expect(preset.sanitizePaste).toBe(true);
        expect(preset.allowedPattern).toBe('[a-zA-Z0-9]');
    });

    it('financialField should have length limit', () => {
        const preset = InputRestrictionPresets.financialField;

        expect(preset.sanitizePaste).toBe(true);
        expect(preset.maxPasteLength).toBe(20);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('FormInputModelSchema integration', () => {
    it('should parse full form input model', () => {
        const input = {
            label: 'Username',
            name: 'username',
            required: true,
            helpText: 'Enter your username',
            validationState: 'valid',
            inputRestriction: {
                disablePaste: false,
                sanitizePaste: true,
                allowedPattern: '[a-zA-Z0-9_]',
            },
        };

        const result = FormInputModelSchema.parse(input);

        expect(result.label).toBe('Username');
        expect(result.required).toBe(true);
        expect(result.inputRestriction?.sanitizePaste).toBe(true);
    });
});
