/**
 * @fileoverview useFormInputRestrictions Hook Tests
 * @module tests/core/base
 * 
 * Tests for clipboard restriction hook behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormInputRestrictions } from '@core/base/useFormInputRestrictions';
import type { InputRestriction } from '@core/base/FormInputModel';

// ═══════════════════════════════════════════════════════════════════════════
// MOCK HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function createClipboardEvent(type: 'copy' | 'cut' | 'paste', data?: string) {
    const event = {
        preventDefault: vi.fn(),
        clipboardData: {
            getData: vi.fn().mockReturnValue(data || ''),
        },
    } as unknown as React.ClipboardEvent;

    return event;
}

function createDragEvent(type: 'drop' | 'dragover') {
    return {
        preventDefault: vi.fn(),
    } as unknown as React.DragEvent;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('useFormInputRestrictions', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('when no restriction is provided', () => {
        it('should return hasRestrictions as false', () => {
            const { result } = renderHook(() => useFormInputRestrictions(undefined));

            expect(result.current.hasRestrictions).toBe(false);
        });

        it('should not prevent any events', () => {
            const { result } = renderHook(() => useFormInputRestrictions(undefined));

            const copyEvent = createClipboardEvent('copy');
            const pasteEvent = createClipboardEvent('paste');
            const dropEvent = createDragEvent('drop');

            act(() => {
                result.current.onCopy(copyEvent);
                result.current.onPaste(pasteEvent);
                result.current.onDrop(dropEvent);
            });

            expect(copyEvent.preventDefault).not.toHaveBeenCalled();
            expect(pasteEvent.preventDefault).not.toHaveBeenCalled();
            expect(dropEvent.preventDefault).not.toHaveBeenCalled();
        });
    });

    describe('when copy is disabled', () => {
        const restriction: InputRestriction = {
            disableCopy: true,
            disableCut: false,
            disablePaste: false,
            disableDrop: false,
            sanitizePaste: false,
            showRestrictionIndicator: true,
            restrictionMessage: 'Copy disabled',
        };

        it('should prevent copy event', () => {
            const { result } = renderHook(() => useFormInputRestrictions(restriction));

            const event = createClipboardEvent('copy');

            act(() => {
                result.current.onCopy(event);
            });

            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should show restriction message', () => {
            const { result } = renderHook(() => useFormInputRestrictions(restriction));

            const event = createClipboardEvent('copy');

            act(() => {
                result.current.onCopy(event);
            });

            expect(result.current.restrictionMessage).toBe('Copy disabled');
        });

        it('should auto-clear message after timeout', () => {
            const { result } = renderHook(() => useFormInputRestrictions(restriction));

            act(() => {
                result.current.onCopy(createClipboardEvent('copy'));
            });

            expect(result.current.restrictionMessage).toBe('Copy disabled');

            act(() => {
                vi.advanceTimersByTime(3000);
            });

            expect(result.current.restrictionMessage).toBeNull();
        });
    });

    describe('when paste is disabled', () => {
        const restriction: InputRestriction = {
            disableCopy: false,
            disableCut: false,
            disablePaste: true,
            disableDrop: false,
            sanitizePaste: false,
            showRestrictionIndicator: true,
            restrictionMessage: 'Paste disabled',
        };

        it('should prevent paste event', () => {
            const { result } = renderHook(() => useFormInputRestrictions(restriction));

            const event = createClipboardEvent('paste', 'pasted text');

            act(() => {
                result.current.onPaste(event);
            });

            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe('when sanitizePaste is enabled', () => {
        const restriction: InputRestriction = {
            disableCopy: false,
            disableCut: false,
            disablePaste: false,
            disableDrop: false,
            sanitizePaste: true,
            allowedPattern: '[0-9]',
            showRestrictionIndicator: true,
        };

        it('should call onSanitizedPaste with filtered content', () => {
            const onSanitizedPaste = vi.fn();
            const { result } = renderHook(() =>
                useFormInputRestrictions(restriction, onSanitizedPaste)
            );

            const event = createClipboardEvent('paste', 'abc123def456');

            act(() => {
                result.current.onPaste(event);
            });

            expect(event.preventDefault).toHaveBeenCalled();
            expect(onSanitizedPaste).toHaveBeenCalledWith('123456', 'abc123def456');
        });

        it('should respect maxPasteLength', () => {
            const restrictionWithLength: InputRestriction = {
                ...restriction,
                maxPasteLength: 4,
            };

            const onSanitizedPaste = vi.fn();
            const { result } = renderHook(() =>
                useFormInputRestrictions(restrictionWithLength, onSanitizedPaste)
            );

            const event = createClipboardEvent('paste', '1234567890');

            act(() => {
                result.current.onPaste(event);
            });

            expect(onSanitizedPaste).toHaveBeenCalledWith('1234', '1234567890');
        });
    });

    describe('when drop is disabled', () => {
        const restriction: InputRestriction = {
            disableCopy: false,
            disableCut: false,
            disablePaste: false,
            disableDrop: true,
            sanitizePaste: false,
            showRestrictionIndicator: true,
        };

        it('should prevent drop event', () => {
            const { result } = renderHook(() => useFormInputRestrictions(restriction));

            const event = createDragEvent('drop');

            act(() => {
                result.current.onDrop(event);
            });

            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should prevent dragover event', () => {
            const { result } = renderHook(() => useFormInputRestrictions(restriction));

            const event = createDragEvent('dragover');

            act(() => {
                result.current.onDragOver(event);
            });

            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe('restrictionProps', () => {
        it('should include data attribute when restrictions active', () => {
            const restriction: InputRestriction = {
                disableCopy: true,
                disableCut: false,
                disablePaste: false,
                disableDrop: false,
                sanitizePaste: false,
                showRestrictionIndicator: true,
            };

            const { result } = renderHook(() => useFormInputRestrictions(restriction));

            expect(result.current.restrictionProps['data-restrictions-active']).toBe(true);
        });

        it('should not include data attribute when indicator disabled', () => {
            const restriction: InputRestriction = {
                disableCopy: true,
                disableCut: false,
                disablePaste: false,
                disableDrop: false,
                sanitizePaste: false,
                showRestrictionIndicator: false,
            };

            const { result } = renderHook(() => useFormInputRestrictions(restriction));

            expect(result.current.restrictionProps['data-restrictions-active']).toBeUndefined();
        });
    });

    describe('clearMessage', () => {
        it('should clear restriction message immediately', () => {
            const restriction: InputRestriction = {
                disableCopy: true,
                disableCut: false,
                disablePaste: false,
                disableDrop: false,
                sanitizePaste: false,
                showRestrictionIndicator: true,
                restrictionMessage: 'Test message',
            };

            const { result } = renderHook(() => useFormInputRestrictions(restriction));

            act(() => {
                result.current.onCopy(createClipboardEvent('copy'));
            });

            expect(result.current.restrictionMessage).toBe('Test message');

            act(() => {
                result.current.clearMessage();
            });

            expect(result.current.restrictionMessage).toBeNull();
        });
    });
});
