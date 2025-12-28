/**
 * @fileoverview Form Input Restrictions Hook
 * @module core/base/useFormInputRestrictions
 * 
 * React hook that provides clipboard event handlers for form input restrictions.
 * Returns event handlers and props to be spread on input elements.
 * 
 * @remarks
 * This hook implements the restriction logic defined in FormInputModel.
 * It handles copy, cut, paste, and drop events with optional sanitization.
 */

import { useCallback, useMemo, useState } from 'react';
import type { InputRestriction } from './FormInputModel';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result of the useFormInputRestrictions hook
 */
export interface UseFormInputRestrictionsResult {
    /**
     * Handler for copy events
     */
    onCopy: (event: React.ClipboardEvent) => void;

    /**
     * Handler for cut events
     */
    onCut: (event: React.ClipboardEvent) => void;

    /**
     * Handler for paste events
     */
    onPaste: (event: React.ClipboardEvent) => void;

    /**
     * Handler for drop events
     */
    onDrop: (event: React.DragEvent) => void;

    /**
     * Handler for dragover events (needed to prevent drop)
     */
    onDragOver: (event: React.DragEvent) => void;

    /**
     * Whether any restrictions are currently active
     */
    hasRestrictions: boolean;

    /**
     * Current restriction message (if action was recently blocked)
     */
    restrictionMessage: string | null;

    /**
     * Clear the restriction message
     */
    clearMessage: () => void;

    /**
     * Props object to spread on input elements
     */
    restrictionProps: {
        onCopy: (event: React.ClipboardEvent) => void;
        onCut: (event: React.ClipboardEvent) => void;
        onPaste: (event: React.ClipboardEvent) => void;
        onDrop: (event: React.DragEvent) => void;
        onDragOver: (event: React.DragEvent) => void;
        'data-restrictions-active'?: boolean;
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sanitize text based on allowed pattern
 * @param text - Text to sanitize
 * @param pattern - Regex pattern of allowed characters
 * @returns Sanitized text
 */
function sanitizeText(text: string, pattern: string): string {
    try {
        const regex = new RegExp(pattern, 'g');
        const matches = text.match(regex);
        return matches ? matches.join('') : '';
    } catch {
        // Invalid regex pattern, return original text
        console.warn(`Invalid regex pattern for sanitization: ${pattern}`);
        return text;
    }
}

/**
 * Truncate text to max length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
function truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) : text;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for form input clipboard restrictions
 * 
 * Provides event handlers that enforce copy/cut/paste/drop restrictions
 * as defined in the inputRestriction configuration.
 * 
 * @param restriction - Input restriction configuration (optional)
 * @param onSanitizedPaste - Callback when sanitized paste is performed
 * @returns Restriction handlers and state
 * 
 * @example
 * ```tsx
 * const { restrictionProps, restrictionMessage } = useFormInputRestrictions(
 *     model.inputRestriction,
 *     (sanitizedValue) => setInputValue(prev => prev + sanitizedValue)
 * );
 * 
 * return (
 *     <>
 *         <input {...restrictionProps} value={value} onChange={handleChange} />
 *         {restrictionMessage && <span className="warning">{restrictionMessage}</span>}
 *     </>
 * );
 * ```
 */
export function useFormInputRestrictions(
    restriction: InputRestriction | undefined,
    onSanitizedPaste?: (sanitizedValue: string, originalValue: string) => void
): UseFormInputRestrictionsResult {
    const [restrictionMessage, setRestrictionMessage] = useState<string | null>(null);

    /**
     * Check if any restrictions are active
     */
    const hasRestrictions = useMemo(() => {
        if (!restriction) return false;
        return (
            restriction.disableCopy ||
            restriction.disableCut ||
            restriction.disablePaste ||
            restriction.disableDrop ||
            restriction.sanitizePaste
        );
    }, [restriction]);

    /**
     * Show restriction message with auto-clear
     */
    const showMessage = useCallback((message: string | undefined) => {
        if (message) {
            setRestrictionMessage(message);
            // Auto-clear after 3 seconds
            setTimeout(() => setRestrictionMessage(null), 3000);
        }
    }, []);

    /**
     * Clear restriction message
     */
    const clearMessage = useCallback(() => {
        setRestrictionMessage(null);
    }, []);

    /**
     * Handle copy event
     */
    const onCopy = useCallback((event: React.ClipboardEvent) => {
        if (restriction?.disableCopy) {
            event.preventDefault();
            showMessage(restriction.restrictionMessage);
        }
    }, [restriction, showMessage]);

    /**
     * Handle cut event
     */
    const onCut = useCallback((event: React.ClipboardEvent) => {
        if (restriction?.disableCut) {
            event.preventDefault();
            showMessage(restriction.restrictionMessage);
        }
    }, [restriction, showMessage]);

    /**
     * Handle paste event
     */
    const onPaste = useCallback((event: React.ClipboardEvent) => {
        if (!restriction) return;

        // Completely block paste
        if (restriction.disablePaste && !restriction.sanitizePaste) {
            event.preventDefault();
            showMessage(restriction.restrictionMessage);
            return;
        }

        // Sanitize paste
        if (restriction.sanitizePaste) {
            event.preventDefault();

            const clipboardData = event.clipboardData;
            let pastedText = clipboardData.getData('text/plain');
            const originalText = pastedText;

            // Apply pattern sanitization
            if (restriction.allowedPattern) {
                pastedText = sanitizeText(pastedText, restriction.allowedPattern);
            }

            // Apply length limit
            if (restriction.maxPasteLength !== undefined) {
                pastedText = truncateText(pastedText, restriction.maxPasteLength);
            }

            // Notify consumer of sanitized paste
            if (onSanitizedPaste && pastedText) {
                onSanitizedPaste(pastedText, originalText);
            }

            // Show message if content was modified
            if (pastedText !== originalText && restriction.restrictionMessage) {
                showMessage(restriction.restrictionMessage);
            }
        }
    }, [restriction, onSanitizedPaste, showMessage]);

    /**
     * Handle drop event
     */
    const onDrop = useCallback((event: React.DragEvent) => {
        if (restriction?.disableDrop) {
            event.preventDefault();
            showMessage(restriction.restrictionMessage);
        }
    }, [restriction, showMessage]);

    /**
     * Handle dragover event (needed to properly block drop)
     */
    const onDragOver = useCallback((event: React.DragEvent) => {
        if (restriction?.disableDrop) {
            event.preventDefault();
        }
    }, [restriction]);

    /**
     * Bundled props for easy spreading on input elements
     */
    const restrictionProps = useMemo(() => ({
        onCopy,
        onCut,
        onPaste,
        onDrop,
        onDragOver,
        ...(hasRestrictions && restriction?.showRestrictionIndicator !== false
            ? { 'data-restrictions-active': true }
            : {}),
    }), [onCopy, onCut, onPaste, onDrop, onDragOver, hasRestrictions, restriction?.showRestrictionIndicator]);

    return {
        onCopy,
        onCut,
        onPaste,
        onDrop,
        onDragOver,
        hasRestrictions,
        restrictionMessage,
        clearMessage,
        restrictionProps,
    };
}

export default useFormInputRestrictions;
