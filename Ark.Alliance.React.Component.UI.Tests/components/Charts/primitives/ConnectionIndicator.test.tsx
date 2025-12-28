/**
 * @fileoverview ConnectionIndicator Component Unit Tests
 * @module tests/components/Charts/primitives/ConnectionIndicator
 * 
 * Tests for ConnectionIndicator component rendering and states.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';

import { ConnectionIndicator } from '@components/Charts/primitives/ConnectionIndicator';

// ═══════════════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════════════

beforeEach(() => {
    // Reset
});

afterEach(() => {
    cleanup();
});

// ═══════════════════════════════════════════════════════════════════════════
// RENDERING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ConnectionIndicator', () => {
    describe('Status Rendering', () => {
        it('should render connected status', () => {
            const { container } = render(
                React.createElement(ConnectionIndicator, {
                    status: 'connected',
                })
            );

            const dot = container.querySelector('.ark-connection-indicator__dot');
            expect(dot?.className).toContain('ark-connection-indicator__dot');
        });

        it('should render disconnected status', () => {
            const { container } = render(
                React.createElement(ConnectionIndicator, {
                    status: 'disconnected',
                })
            );

            const indicator = container.querySelector('.ark-connection-indicator');
            expect(indicator?.className).toContain('ark-connection-indicator--disconnected');
        });

        it('should render connecting status', () => {
            const { container } = render(
                React.createElement(ConnectionIndicator, {
                    status: 'connecting',
                })
            );

            const indicator = container.querySelector('.ark-connection-indicator');
            expect(indicator?.className).toContain('ark-connection-indicator--connecting');
        });

        it('should render error status', () => {
            const { container } = render(
                React.createElement(ConnectionIndicator, {
                    status: 'error',
                })
            );

            const indicator = container.querySelector('.ark-connection-indicator');
            expect(indicator?.className).toContain('ark-connection-indicator--error');
        });
    });

    describe('Label Rendering', () => {
        it('should show label when showLabel is true', () => {
            render(
                React.createElement(ConnectionIndicator, {
                    status: 'connected',
                    showLabel: true,
                })
            );

            // Label is "LIVE" for connected status
            expect(screen.getByText('LIVE')).not.toBeNull();
        });

        it('should hide label when showLabel is false', () => {
            render(
                React.createElement(ConnectionIndicator, {
                    status: 'connected',
                    showLabel: false,
                })
            );

            expect(screen.queryByText('LIVE')).toBeNull();
        });

        it('should show correct label for disconnected status', () => {
            render(
                React.createElement(ConnectionIndicator, {
                    status: 'disconnected',
                    showLabel: true,
                })
            );

            expect(screen.getByText('DISCONNECTED')).not.toBeNull();
        });

        it('should show correct label for connecting status', () => {
            render(
                React.createElement(ConnectionIndicator, {
                    status: 'connecting',
                    showLabel: true,
                })
            );

            expect(screen.getByText('CONNECTING')).not.toBeNull();
        });

        it('should show correct label for error status', () => {
            render(
                React.createElement(ConnectionIndicator, {
                    status: 'error',
                    showLabel: true,
                })
            );

            expect(screen.getByText('ERROR')).not.toBeNull();
        });
    });

    describe('Size Variants', () => {
        it('should apply sm size class', () => {
            const { container } = render(
                React.createElement(ConnectionIndicator, {
                    status: 'connected',
                    size: 'sm',
                })
            );

            const indicator = container.querySelector('.ark-connection-indicator');
            expect(indicator?.className).toContain('ark-connection-indicator--sm');
        });

        it('should apply md size class', () => {
            const { container } = render(
                React.createElement(ConnectionIndicator, {
                    status: 'connected',
                    size: 'md',
                })
            );

            const indicator = container.querySelector('.ark-connection-indicator');
            expect(indicator?.className).toContain('ark-connection-indicator--md');
        });

        it('should apply lg size class', () => {
            const { container } = render(
                React.createElement(ConnectionIndicator, {
                    status: 'connected',
                    size: 'lg',
                })
            );

            const indicator = container.querySelector('.ark-connection-indicator');
            expect(indicator?.className).toContain('ark-connection-indicator--lg');
        });
    });

    describe('Custom ClassName', () => {
        it('should apply custom className', () => {
            const { container } = render(
                React.createElement(ConnectionIndicator, {
                    status: 'connected',
                    className: 'custom-class',
                })
            );

            const indicator = container.querySelector('.ark-connection-indicator');
            expect(indicator?.className).toContain('custom-class');
        });
    });
});

