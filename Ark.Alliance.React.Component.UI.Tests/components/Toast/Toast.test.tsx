/**
 * @fileoverview Toast Component Unit Tests
 * @module tests/components/Toast
 * 
 * Tests Toast notification component, model, and viewmodel.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real components
import { ToastContainer, ToastNotification, GlobalToastContainer, ToastProvider } from '@components/Toast';
import { ToastModelSchema, ToastItemSchema, createToastItem, ToastType, ToastPosition } from '@components/Toast';
import { useToast, useToastContext } from '@components/Toast';
import { renderHook } from '@testing-library/react';

// ═══════════════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════════════

beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
    cleanup();
    vi.useRealTimers();
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ToastModelSchema', () => {
    it('should parse valid toast model with defaults', () => {
        const result = ToastModelSchema.parse({});

        expect(result.position).toBe('top-right');
        expect(result.maxToasts).toBe(5);
        expect(result.stacked).toBe(true);
        expect(result.gap).toBe(12);
        expect(result.animationDuration).toBe(300);
        expect(result.pauseOnHover).toBe(true);
    });

    it('should accept custom position', () => {
        const result = ToastModelSchema.parse({
            position: 'bottom-left',
        });

        expect(result.position).toBe('bottom-left');
    });

    it('should accept custom maxToasts', () => {
        const result = ToastModelSchema.parse({
            maxToasts: 10,
        });

        expect(result.maxToasts).toBe(10);
    });
});

describe('ToastItemSchema', () => {
    it('should parse valid toast item', () => {
        const result = ToastItemSchema.parse({
            id: 'test-1',
            message: 'Hello World',
            type: 'success',
        });

        expect(result.id).toBe('test-1');
        expect(result.message).toBe('Hello World');
        expect(result.type).toBe('success');
        expect(result.duration).toBe(4000);
        expect(result.dismissible).toBe(true);
    });

    it('should accept all toast types', () => {
        const types = ['success', 'error', 'warning', 'info'];

        types.forEach(type => {
            const result = ToastItemSchema.parse({
                id: `toast-${type}`,
                message: `${type} message`,
                type,
            });
            expect(result.type).toBe(type);
        });
    });

    it('should reject invalid toast type', () => {
        expect(() =>
            ToastItemSchema.parse({
                id: 'test',
                message: 'Test',
                type: 'invalid',
            })
        ).toThrow();
    });
});

describe('createToastItem', () => {
    it('should create toast with auto-generated id', () => {
        const toast = createToastItem({
            message: 'Test message',
            type: 'info',
        });

        expect(toast.id).toBeDefined();
        expect(toast.id).toContain('toast-');
        expect(toast.message).toBe('Test message');
        expect(toast.createdAt).toBeDefined();
    });
});

describe('ToastPosition enum', () => {
    it('should have all position options', () => {
        const positions = ToastPosition.options;

        expect(positions).toContain('top-left');
        expect(positions).toContain('top-center');
        expect(positions).toContain('top-right');
        expect(positions).toContain('bottom-left');
        expect(positions).toContain('bottom-center');
        expect(positions).toContain('bottom-right');
    });
});

describe('ToastType enum', () => {
    it('should have all type options', () => {
        const types = ToastType.options;

        expect(types).toContain('success');
        expect(types).toContain('error');
        expect(types).toContain('warning');
        expect(types).toContain('info');
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('useToast hook', () => {
    it('should initialize with empty toasts', () => {
        const { result } = renderHook(() => useToast());

        expect(result.current.toasts).toEqual([]);
        expect(result.current.isPaused).toBe(false);
    });

    it('should add toast via showToast', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Test message', 'success');
        });

        expect(result.current.toasts.length).toBe(1);
        expect(result.current.toasts[0].message).toBe('Test message');
        expect(result.current.toasts[0].type).toBe('success');
    });

    it('should remove toast via removeToast', () => {
        const { result } = renderHook(() => useToast());

        let toastId: string;
        act(() => {
            toastId = result.current.showToast('Test', 'info');
        });

        expect(result.current.toasts.length).toBe(1);

        act(() => {
            result.current.removeToast(toastId);
        });

        expect(result.current.toasts.length).toBe(0);
    });

    it('should clear all toasts via clearAll', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Toast 1', 'info');
            result.current.showToast('Toast 2', 'success');
            result.current.showToast('Toast 3', 'warning');
        });

        expect(result.current.toasts.length).toBe(3);

        act(() => {
            result.current.clearAll();
        });

        expect(result.current.toasts.length).toBe(0);
    });

    it('should limit toasts to maxToasts', () => {
        const { result } = renderHook(() => useToast({ maxToasts: 2 }));

        act(() => {
            result.current.showToast('Toast 1', 'info');
            result.current.showToast('Toast 2', 'info');
            result.current.showToast('Toast 3', 'info');
        });

        expect(result.current.toasts.length).toBe(2);
    });

    it('should provide correct containerClasses based on position', () => {
        const { result } = renderHook(() => useToast({ position: 'bottom-left' }));

        expect(result.current.containerClasses).toContain('ark-toast-container');
        expect(result.current.containerClasses).toContain('ark-toast-container--bottom-left');
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ToastNotification Component', () => {
    const mockToast = {
        id: 'test-toast',
        message: 'Test notification',
        type: 'success' as const,
        duration: 4000,
        dismissible: true,
    };

    it('should render toast message', () => {
        render(
            React.createElement(ToastNotification, {
                toast: mockToast,
                onRemove: vi.fn(),
            })
        );

        expect(screen.getByText('Test notification')).toBeInTheDocument();
    });

    it('should have correct role for accessibility', () => {
        render(
            React.createElement(ToastNotification, {
                toast: mockToast,
                onRemove: vi.fn(),
            })
        );

        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should call onRemove when close button clicked', async () => {
        const onRemove = vi.fn();
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        render(
            React.createElement(ToastNotification, {
                toast: mockToast,
                onRemove,
            })
        );

        const closeButton = screen.getByLabelText('Close notification');
        await user.click(closeButton);

        expect(onRemove).toHaveBeenCalledWith('test-toast');
    });

    it('should apply correct type class', () => {
        const { container } = render(
            React.createElement(ToastNotification, {
                toast: { ...mockToast, type: 'error' },
                onRemove: vi.fn(),
            })
        );

        const toast = container.querySelector('.ark-toast');
        expect(toast?.className).toContain('ark-toast--error');
    });
});

describe('ToastContainer Component', () => {
    it('should not render when no toasts', () => {
        const { container } = render(
            React.createElement(ToastContainer, {
                toasts: [],
                removeToast: vi.fn(),
                containerClasses: 'ark-toast-container ark-toast-container--top-right',
            })
        );

        expect(container.querySelector('.ark-toast-container')).toBeNull();
    });

    it('should render all toasts', () => {
        const toasts = [
            { id: '1', message: 'Toast 1', type: 'info' as const, duration: 4000, dismissible: true },
            { id: '2', message: 'Toast 2', type: 'success' as const, duration: 4000, dismissible: true },
        ];

        render(
            React.createElement(ToastContainer, {
                toasts,
                removeToast: vi.fn(),
                containerClasses: 'ark-toast-container ark-toast-container--top-right',
            })
        );

        expect(screen.getByText('Toast 1')).toBeInTheDocument();
        expect(screen.getByText('Toast 2')).toBeInTheDocument();
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ToastProvider and useToastContext', () => {
    it('should provide toast context to children', () => {
        const TestComponent = () => {
            const toast = useToastContext();
            return React.createElement('div', { 'data-testid': 'test' },
                `Toasts: ${toast.toasts.length}`
            );
        };

        render(
            React.createElement(ToastProvider, {},
                React.createElement(TestComponent)
            )
        );

        expect(screen.getByTestId('test')).toHaveTextContent('Toasts: 0');
    });

    it('should throw error when used outside provider', () => {
        const TestComponent = () => {
            useToastContext();
            return null;
        };

        expect(() => render(React.createElement(TestComponent))).toThrow(
            'useToastContext must be used within a ToastProvider'
        );
    });
});
