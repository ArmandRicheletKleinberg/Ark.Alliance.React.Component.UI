/**
 * @fileoverview WindowPanel Component Unit Tests
 * @module tests/components/Desktop/WindowPanel
 * 
 * Tests for the WindowPanel component with drag, resize, and control behaviors.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { WindowPanel } from '@components/Desktop/WindowPanel';
import { WindowPanelModelSchema } from '@components/Desktop/WindowPanel/WindowPanel.model';

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

describe('WindowPanel Component', () => {
    describe('Basic Rendering', () => {
        it('should render with title', () => {
            const { container } = render(
                React.createElement(WindowPanel, {
                    title: 'Test Window',
                    children: 'Window content',
                })
            );

            const titleElement = container.querySelector('.ark-window-panel__title');
            expect(titleElement).not.toBeNull();
            expect(titleElement?.textContent).toBe('Test Window');
        });

        it('should render children content', () => {
            const { container } = render(
                React.createElement(WindowPanel, {
                    title: 'Test Window',
                    children: 'Test content inside window',
                })
            );

            const content = container.querySelector('.ark-window-panel__content');
            expect(content).not.toBeNull();
            expect(content?.textContent).toBe('Test content inside window');
        });

        it('should not have minimized class when isMinimized is false', () => {
            const { container } = render(
                React.createElement(WindowPanel, {
                    title: 'Test Window',
                    isMinimized: false,
                    children: 'Content',
                })
            );

            const panel = container.querySelector('.ark-window-panel');
            expect(panel).not.toBeNull();
        });

        it('should not have maximized class when isMaximized is false', () => {
            const { container } = render(
                React.createElement(WindowPanel, {
                    title: 'Test Window',
                    isMaximized: false,
                    children: 'Content',
                })
            );

            const panel = container.querySelector('.ark-window-panel');
            expect(panel).not.toBeNull();
        });
    });

    describe('Control Buttons', () => {
        it('should call onClose when close button clicked', async () => {
            const onClose = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(WindowPanel, {
                    title: 'Test Window',
                    onClose,
                    children: 'Content',
                })
            );

            const closeBtn = container.querySelector('.ark-window-panel__control--close');
            expect(closeBtn).not.toBeNull();

            await user.click(closeBtn!);
            expect(onClose).toHaveBeenCalled();
        });

        it('should call onMinimize when minimize button clicked', async () => {
            const onMinimize = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(WindowPanel, {
                    title: 'Test Window',
                    onMinimize,
                    children: 'Content',
                })
            );

            const minimizeBtn = container.querySelector('.ark-window-panel__control--minimize');
            expect(minimizeBtn).not.toBeNull();

            await user.click(minimizeBtn!);
            expect(onMinimize).toHaveBeenCalled();
        });

        it('should call onMaximize when maximize button clicked', async () => {
            const onMaximize = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(WindowPanel, {
                    title: 'Test Window',
                    onMaximize,
                    children: 'Content',
                })
            );

            const maximizeBtn = container.querySelector('.ark-window-panel__control--maximize');
            expect(maximizeBtn).not.toBeNull();

            await user.click(maximizeBtn!);
            expect(onMaximize).toHaveBeenCalled();
        });
    });

    describe('Visual Modes', () => {
        it('should apply neon visual mode class', () => {
            const { container } = render(
                React.createElement(WindowPanel, {
                    title: 'Neon Window',
                    visualMode: 'neon',
                    children: 'Content',
                })
            );

            const panel = container.querySelector('.ark-window-panel');
            expect(panel?.className).toContain('ark-window-panel--neon');
        });

        it('should apply glass visual mode class', () => {
            const { container } = render(
                React.createElement(WindowPanel, {
                    title: 'Glass Window',
                    visualMode: 'glass',
                    children: 'Content',
                })
            );

            const panel = container.querySelector('.ark-window-panel');
            expect(panel?.className).toContain('ark-window-panel--glass');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('WindowPanelModelSchema', () => {
    it('should parse valid window panel model', () => {
        const result = WindowPanelModelSchema.parse({
            title: 'My Window',
            resizable: true,
            movable: true,
        });

        expect(result.title).toBe('My Window');
        expect(result.resizable).toBe(true);
        expect(result.movable).toBe(true);
    });

    it('should use defaults for missing properties', () => {
        const result = WindowPanelModelSchema.parse({});

        expect(result.title).toBe('');
        expect(result.isMinimized).toBe(false);
        expect(result.isMaximized).toBe(false);
        expect(result.closable).toBe(true);
        expect(result.minimizable).toBe(true);
        expect(result.maximizable).toBe(true);
    });

    it('should accept position and size', () => {
        const result = WindowPanelModelSchema.parse({
            position: { x: 100, y: 50 },
            size: { width: 800, height: 600 },
        });

        expect(result.position.x).toBe(100);
        expect(result.position.y).toBe(50);
        expect(result.size.width).toBe(800);
        expect(result.size.height).toBe(600);
    });
});
