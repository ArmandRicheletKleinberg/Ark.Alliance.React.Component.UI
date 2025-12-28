/**
 * @fileoverview TextEditor Component Unit Tests
 * @module tests/components/Input/TextEditor
 * 
 * Tests for the TextEditor component with toolbar, formatting, and content editing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { TextEditor } from '@components/Input/TextEditor';
import { TextEditorModelSchema } from '@components/Input/TextEditor/TextEditor.model';

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

describe('TextEditor Component', () => {
    describe('Basic Rendering', () => {
        it('should render editor container', () => {
            const { container } = render(
                React.createElement(TextEditor, {
                    title: 'Test Document',
                })
            );

            const editor = container.querySelector('.ark-text-editor');
            expect(editor).not.toBeNull();
        });

        it('should render menu bar when showMenuBar is true', () => {
            const { container } = render(
                React.createElement(TextEditor, {
                    showMenuBar: true,
                })
            );

            const menuBar = container.querySelector('.ark-editor-menubar');
            expect(menuBar).not.toBeNull();
        });

        it('should render toolbar when showToolbar is true', () => {
            const { container } = render(
                React.createElement(TextEditor, {
                    showToolbar: true,
                })
            );

            const toolbar = container.querySelector('.ark-editor-toolbar');
            expect(toolbar).not.toBeNull();
        });

        it('should render status bar when showStatusBar is true', () => {
            const { container } = render(
                React.createElement(TextEditor, {
                    showStatusBar: true,
                })
            );

            const statusBar = container.querySelector('.ark-text-editor__statusbar');
            expect(statusBar).not.toBeNull();
        });

        it('should render content area', () => {
            const { container } = render(
                React.createElement(TextEditor, {
                    content: '<p>Test content</p>',
                })
            );

            const content = container.querySelector('.ark-text-editor__content');
            expect(content).not.toBeNull();
        });
    });

    describe('Visual Modes', () => {
        it('should apply neon visual mode class', () => {
            const { container } = render(
                React.createElement(TextEditor, {
                    visualMode: 'neon',
                })
            );

            const editor = container.querySelector('.ark-text-editor');
            expect(editor?.className).toContain('ark-text-editor--neon');
        });

        it('should apply light visual mode class', () => {
            const { container } = render(
                React.createElement(TextEditor, {
                    visualMode: 'light',
                })
            );

            const editor = container.querySelector('.ark-text-editor');
            expect(editor?.className).toContain('ark-text-editor--light');
        });
    });

    describe('Read-Only Mode', () => {
        it('should apply readonly class when readOnly is true', () => {
            const { container } = render(
                React.createElement(TextEditor, {
                    readOnly: true,
                })
            );

            const editor = container.querySelector('.ark-text-editor');
            expect(editor?.className).toContain('ark-text-editor--readonly');
        });

        it('should set contentEditable to false when readOnly', () => {
            const { container } = render(
                React.createElement(TextEditor, {
                    readOnly: true,
                })
            );

            const content = container.querySelector('.ark-text-editor__content');
            expect(content?.getAttribute('contenteditable')).toBe('false');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('TextEditorModelSchema', () => {
    it('should parse valid text editor model', () => {
        const result = TextEditorModelSchema.parse({
            content: '<p>Hello</p>',
            visualMode: 'neon',
        });

        expect(result.content).toBe('<p>Hello</p>');
        expect(result.visualMode).toBe('neon');
    });

    it('should use defaults for missing properties', () => {
        const result = TextEditorModelSchema.parse({});

        expect(result.content).toBe('');
        expect(result.showToolbar).toBe(true);
        expect(result.showMenuBar).toBe(true);
        expect(result.showStatusBar).toBe(true);
        expect(result.readOnly).toBe(false);
        expect(result.spellCheck).toBe(true);
    });

    it('should accept font configurations', () => {
        const result = TextEditorModelSchema.parse({
            fontFamilies: ['Arial', 'Georgia'],
            fontSizes: [12, 14, 16],
        });

        expect(result.fontFamilies).toContain('Arial');
        expect(result.fontSizes).toContain(14);
    });
});
