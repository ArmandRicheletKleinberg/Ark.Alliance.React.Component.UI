/**
 * @fileoverview BaseSEOModel Unit Tests
 * @module tests/core/base/SEO
 * 
 * Tests BaseSEOModel schema validation without breaking existing BaseModel functionality.
 */

import { describe, it, expect } from 'vitest';
import { BaseSEOModelSchema, defaultBaseSEOModel } from '../../../Ark.Alliance.React.Component.UI/src/core/base/SEO/BaseSEOModel';

describe('BaseSEOModel', () => {
    describe('BSEO-001: Schema Validation', () => {
        it('should parse valid BaseSEOModel', () => {
            const result = BaseSEOModelSchema.parse({
                baseUrl: 'https://example.com',
                generateSchema: true,
            });

            expect(result.baseUrl).toBe('https://example.com');
            expect(result.generateSchema).toBe(true);
        });

        it('should use default values', () => {
            const result = BaseSEOModelSchema.parse({});

            expect(result.generateSchema).toBe(true);
            expect(result.disabled).toBe(false);
            expect(result.loading).toBe(false);
        });

        it('should inherit BaseModelSchema properties', () => {
            const result = BaseSEOModelSchema.parse({
                id: 'test-id',
                className: 'test-class',
                testId: 'test-testid',
                ariaLabel: 'test-aria',
            });

            expect(result.id).toBe('test-id');
            expect(result.className).toBe('test-class');
            expect(result.testId).toBe('test-testid');
            expect(result.ariaLabel).toBe('test-aria');
        });
    });

    describe('BSEO-002: baseUrl Validation', () => {
        it('should accept valid URL', () => {
            const result = BaseSEOModelSchema.parse({
                baseUrl: 'https://example.com',
            });

            expect(result.baseUrl).toBe('https://example.com');
        });

        it('should accept baseUrl as optional', () => {
            const result = BaseSEOModelSchema.parse({});
            expect(result.baseUrl).toBeUndefined();
        });

        it('should reject invalid URL', () => {
            expect(() =>
                BaseSEOModelSchema.parse({ baseUrl: 'not-a-url' })
            ).toThrow();
        });

        it('should accept URL with path', () => {
            const result = BaseSEOModelSchema.parse({
                baseUrl: 'https://example.com/path',
            });

            expect(result.baseUrl).toBe('https://example.com/path');
        });
    });

    describe('BSEO-003: generateSchema Property', () => {
        it('should default to true', () => {
            const result = BaseSEOModelSchema.parse({});
            expect(result.generateSchema).toBe(true);
        });

        it('should accept false', () => {
            const result = BaseSEOModelSchema.parse({
                generateSchema: false,
            });

            expect(result.generateSchema).toBe(false);
        });

        it('should reject non-boolean', () => {
            expect(() =>
                BaseSEOModelSchema.parse({ generateSchema: 'true' })
            ).toThrow();
        });
    });

    describe('BSEO-004: defaultBaseSEOModel', () => {
        it('should provide correct defaults', () => {
            expect(defaultBaseSEOModel.generateSchema).toBe(true);
            expect(defaultBaseSEOModel.disabled).toBe(false);
            expect(defaultBaseSEOModel.loading).toBe(false);
        });
    });

    describe('BSEO-005: Non-Regression - BaseModelSchema Compatibility', () => {
        it('should not break existing BaseModel functionality', () => {
            const result = BaseSEOModelSchema.parse({
                disabled: true,
                loading: true,
                className: 'my-class',
            });

            expect(result.disabled).toBe(true);
            expect(result.loading).toBe(true);
            expect(result.className).toBe('my-class');
        });

        it('should handle all BaseModelSchema optional fields', () => {
            const result = BaseSEOModelSchema.parse({
                id: 'id-1',
                testId: 'test-1',
                ariaLabel: 'Label',
            });

            expect(result.id).toBe('id-1');
            expect(result.testId).toBe('test-1');
            expect(result.ariaLabel).toBe('Label');
        });

        it('should preserve variant and size defaults', () => {
            const result = BaseSEOModelSchema.parse({});
            expect(result.variant).toBe('default');
            expect(result.size).toBe('md');
        });
    });
});
