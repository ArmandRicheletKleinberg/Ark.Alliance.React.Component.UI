/**
 * @fileoverview Taskbar Component Unit Tests
 * @module tests/components/Desktop/Taskbar
 * 
 * Tests for the Taskbar component with start button, window buttons, and clock.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { Taskbar } from '@components/Desktop/Taskbar';
import { TaskbarModelSchema } from '@components/Desktop/Taskbar/Taskbar.model';

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

describe('Taskbar Component', () => {
    describe('Basic Rendering', () => {
        it('should render start button', () => {
            const { container } = render(
                React.createElement(Taskbar, {
                    windows: [],
                })
            );

            const startBtn = container.querySelector('.ark-taskbar__start-button');
            expect(startBtn).not.toBeNull();
        });

        it('should render clock by default', () => {
            const { container } = render(
                React.createElement(Taskbar, {
                    windows: [],
                    showClock: true,
                })
            );

            const clock = container.querySelector('.ark-taskbar__clock');
            expect(clock).not.toBeNull();
        });

        it('should render window buttons for open windows', () => {
            const { container } = render(
                React.createElement(Taskbar, {
                    windows: [
                        { id: 'win1', title: 'Window 1', icon: '📝' },
                        { id: 'win2', title: 'Window 2', icon: '🌐' },
                    ],
                })
            );

            const windowButtons = container.querySelectorAll('.ark-taskbar__window-button');
            expect(windowButtons.length).toBe(2);
        });
    });

    describe('Start Button', () => {
        it('should call onStartClick when start button clicked', async () => {
            const onStartClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(Taskbar, {
                    windows: [],
                    onStartClick,
                })
            );

            const startBtn = container.querySelector('.ark-taskbar__start-button');
            await user.click(startBtn!);

            expect(onStartClick).toHaveBeenCalled();
        });

        it('should apply active class when startMenuOpen is true', () => {
            const { container } = render(
                React.createElement(Taskbar, {
                    windows: [],
                    startMenuOpen: true,
                })
            );

            const startBtn = container.querySelector('.ark-taskbar__start-button');
            expect(startBtn?.className).toContain('ark-taskbar__start-button--active');
        });
    });

    describe('Window Buttons', () => {
        it('should call onWindowClick with window id when window button clicked', async () => {
            const onWindowClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(Taskbar, {
                    windows: [{ id: 'win1', title: 'Window 1' }],
                    onWindowClick,
                })
            );

            const windowBtn = container.querySelector('.ark-taskbar__window-button');
            await user.click(windowBtn!);

            expect(onWindowClick).toHaveBeenCalledWith('win1');
        });

        it('should mark active window button', () => {
            const { container } = render(
                React.createElement(Taskbar, {
                    windows: [
                        { id: 'win1', title: 'Window 1' },
                        { id: 'win2', title: 'Window 2' },
                    ],
                    activeWindowId: 'win2',
                })
            );

            const windowButtons = container.querySelectorAll('.ark-taskbar__window-button');
            expect(windowButtons[1]?.className).toContain('ark-taskbar__window-button--active');
        });
    });

    describe('Position Variants', () => {
        it('should apply bottom position class', () => {
            const { container } = render(
                React.createElement(Taskbar, {
                    windows: [],
                    position: 'bottom',
                })
            );

            const taskbar = container.querySelector('.ark-taskbar');
            expect(taskbar?.className).toContain('ark-taskbar--bottom');
        });

        it('should apply top position class', () => {
            const { container } = render(
                React.createElement(Taskbar, {
                    windows: [],
                    position: 'top',
                })
            );

            const taskbar = container.querySelector('.ark-taskbar');
            expect(taskbar?.className).toContain('ark-taskbar--top');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('TaskbarModelSchema', () => {
    it('should parse valid taskbar model', () => {
        const result = TaskbarModelSchema.parse({
            position: 'bottom',
            height: 48,
        });

        expect(result.position).toBe('bottom');
        expect(result.height).toBe(48);
    });

    it('should use defaults for missing properties', () => {
        const result = TaskbarModelSchema.parse({});

        expect(result.position).toBe('bottom');
        expect(result.showClock).toBe(true);
        expect(result.showTray).toBe(true);
    });
});
