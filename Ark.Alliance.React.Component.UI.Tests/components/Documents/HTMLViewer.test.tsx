/**
 * @fileoverview HTMLViewer Component Unit Tests
 * @module tests/components/Documents/HTMLViewer
 * 
 * Tests for the HTMLViewer component with zoom, print, and content rendering.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { HTMLViewer } from '@components/Documents/HTMLViewer';
import { HTMLViewerModelSchema } from '@components/Documents/HTMLViewer/HTMLViewer.model';

// ═══════════════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════════════

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    cleanup();
});

// ═══════════════════════════════════════════════════════════════════════════
// RENDER TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('HTMLViewer Component', () => {
    describe('Basic Rendering', () => {
        it('should render viewer container', () => {
            const { container } = render(
                React.createElement(HTMLViewer, {
                    content: '<p>Test content</p>',
                })
            );

            const viewer = container.querySelector('.ark-html-viewer');
            expect(viewer).not.toBeNull();
        });

        it('should render toolbar when showToolbar is true', () => {
            const { container } = render(
                React.createElement(HTMLViewer, {
                    content: '<p>Test</p>',
                    showToolbar: true,
                })
            );

            const toolbar = container.querySelector('.ark-html-viewer__toolbar');
            expect(toolbar).not.toBeNull();
        });

        it('should render content area with HTML', () => {
            const { container } = render(
                React.createElement(HTMLViewer, {
                    content: '<p>Hello World</p>',
                })
            );

            const content = container.querySelector('.ark-html-viewer__content');
            expect(content).not.toBeNull();
            expect(content?.innerHTML).toContain('Hello World');
        });

        it('should display title in toolbar', () => {
            const { container } = render(
                React.createElement(HTMLViewer, {
                    content: '<p>Test</p>',
                    title: 'My Document',
                    showToolbar: true,
                })
            );

            const title = container.querySelector('.ark-html-viewer__title');
            expect(title).not.toBeNull();
            expect(title?.textContent).toBe('My Document');
        });
    });

    describe('Zoom Controls', () => {
        it('should render zoom controls when showZoom is true', () => {
            const { container } = render(
                React.createElement(HTMLViewer, {
                    content: '<p>Test</p>',
                    showZoom: true,
                    showToolbar: true,
                })
            );

            const zoomControls = container.querySelector('.ark-html-viewer__zoom-controls');
            expect(zoomControls).not.toBeNull();
        });

        it('should display current zoom percentage', () => {
            const { container } = render(
                React.createElement(HTMLViewer, {
                    content: '<p>Test</p>',
                    showZoom: true,
                    showToolbar: true,
                    zoom: 150,
                })
            );

            const zoomValue = container.querySelector('.ark-html-viewer__zoom-value');
            expect(zoomValue?.textContent).toContain('150');
        });
    });

    describe('Visual Modes', () => {
        it('should apply neon visual mode class', () => {
            const { container } = render(
                React.createElement(HTMLViewer, {
                    content: '<p>Test</p>',
                    visualMode: 'neon',
                })
            );

            const viewer = container.querySelector('.ark-html-viewer');
            expect(viewer?.className).toContain('ark-html-viewer--neon');
        });

        it('should apply light visual mode class', () => {
            const { container } = render(
                React.createElement(HTMLViewer, {
                    content: '<p>Test</p>',
                    visualMode: 'light',
                })
            );

            const viewer = container.querySelector('.ark-html-viewer');
            expect(viewer?.className).toContain('ark-html-viewer--light');
        });
    });

    describe('Print Button', () => {
        it('should render print button when showPrint is true', () => {
            const { container } = render(
                React.createElement(HTMLViewer, {
                    content: '<p>Test</p>',
                    showPrint: true,
                    showToolbar: true,
                })
            );

            const printBtn = container.querySelector('.ark-html-viewer__toolbar-right .ark-html-viewer__btn');
            expect(printBtn).not.toBeNull();
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('HTMLViewerModelSchema', () => {
    it('should parse valid HTML viewer model', () => {
        const result = HTMLViewerModelSchema.parse({
            content: '<h1>Hello</h1>',
            zoom: 100,
        });

        expect(result.content).toBe('<h1>Hello</h1>');
        expect(result.zoom).toBe(100);
    });

    it('should use defaults for missing properties', () => {
        const result = HTMLViewerModelSchema.parse({});

        expect(result.content).toBe('');
        expect(result.zoom).toBe(100);
        expect(result.showToolbar).toBe(true);
        expect(result.showZoom).toBe(true);
        expect(result.showPrint).toBe(true);
        expect(result.showFullscreen).toBe(true);
    });

    it('should accept zoom range', () => {
        const result = HTMLViewerModelSchema.parse({
            minZoom: 50,
            maxZoom: 200,
            zoomStep: 10,
        });

        expect(result.minZoom).toBe(50);
        expect(result.maxZoom).toBe(200);
        expect(result.zoomStep).toBe(10);
    });

    it('should reject invalid zoom values', () => {
        expect(() => {
            HTMLViewerModelSchema.parse({ zoom: 10 }); // Below 25
        }).toThrow();

        expect(() => {
            HTMLViewerModelSchema.parse({ zoom: 500 }); // Above 400
        }).toThrow();
    });
});
