/**
 * @fileoverview DesktopIcon Component Unit Tests
 * @module tests/components/Desktop/DesktopIcon
 * 
 * Tests for the DesktopIcon component with click, double-click, and icon rendering.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { DesktopIcon } from '@components/Desktop/DesktopIcon';
import { DesktopIconModelSchema } from '@components/Desktop/DesktopIcon/DesktopIcon.model';

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

describe('DesktopIcon Component', () => {
    describe('Basic Rendering', () => {
        it('should render with label', () => {
            const { container } = render(
                React.createElement(DesktopIcon, {
                    label: 'My Folder',
                    icon: '📁',
                    appId: 'test-app',
                })
            );

            const labelElement = container.querySelector('.ark-desktop-icon__label');
            expect(labelElement).not.toBeNull();
            expect(labelElement?.textContent).toBe('My Folder');
        });

        it('should render emoji icon', () => {
            const { container } = render(
                React.createElement(DesktopIcon, {
                    label: 'Folder',
                    icon: '📁',
                    appId: 'test-app',
                })
            );

            const iconWrapper = container.querySelector('.ark-desktop-icon__icon-wrapper');
            expect(iconWrapper).not.toBeNull();
            expect(iconWrapper?.textContent).toContain('📁');
        });

        it('should apply selected class when selected is true', () => {
            const { container } = render(
                React.createElement(DesktopIcon, {
                    label: 'Selected Icon',
                    icon: '📁',
                    appId: 'test-app',
                    selected: true,
                })
            );

            const icon = container.querySelector('.ark-desktop-icon');
            expect(icon?.className).toContain('ark-desktop-icon--selected');
        });
    });

    describe('Click Handlers', () => {
        it('should call onClick when clicked', async () => {
            const onClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(DesktopIcon, {
                    label: 'Clickable Icon',
                    icon: '📁',
                    appId: 'test-app',
                    onClick,
                })
            );

            const icon = container.querySelector('.ark-desktop-icon');
            await user.click(icon!);

            expect(onClick).toHaveBeenCalled();
        });

        it('should call onDoubleClick when double-clicked', async () => {
            const onDoubleClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(DesktopIcon, {
                    label: 'Double-Click Icon',
                    icon: '📁',
                    appId: 'test-app',
                    onDoubleClick,
                })
            );

            const icon = container.querySelector('.ark-desktop-icon');
            await user.dblClick(icon!);

            expect(onDoubleClick).toHaveBeenCalled();
        });
    });

    describe('Size Variants', () => {
        it('should apply small size class', () => {
            const { container } = render(
                React.createElement(DesktopIcon, {
                    label: 'Small Icon',
                    icon: '📁',
                    appId: 'test-app',
                    size: 'sm',
                })
            );

            const icon = container.querySelector('.ark-desktop-icon');
            expect(icon?.className).toContain('ark-desktop-icon--sm');
        });

        it('should apply large size class', () => {
            const { container } = render(
                React.createElement(DesktopIcon, {
                    label: 'Large Icon',
                    icon: '📁',
                    appId: 'test-app',
                    size: 'lg',
                })
            );

            const icon = container.querySelector('.ark-desktop-icon');
            expect(icon?.className).toContain('ark-desktop-icon--lg');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('DesktopIconModelSchema', () => {
    it('should parse valid desktop icon model', () => {
        const result = DesktopIconModelSchema.parse({
            label: 'My Icon',
            icon: '📁',
            appId: 'my-app',
        });

        expect(result.label).toBe('My Icon');
        expect(result.icon).toBe('📁');
        expect(result.appId).toBe('my-app');
    });

    it('should use defaults for missing properties', () => {
        const result = DesktopIconModelSchema.parse({
            label: 'Icon',
            icon: '📁',
            appId: 'test',
        });

        expect(result.size).toBe('md');
        expect(result.selected).toBe(false);
    });

    it('should detect icon type from fa: prefix', () => {
        const result = DesktopIconModelSchema.parse({
            label: 'FA Icon',
            icon: 'fa:folder',
            appId: 'test',
        });

        expect(result.icon).toBe('fa:folder');
    });
});
