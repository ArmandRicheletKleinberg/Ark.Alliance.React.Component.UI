/**
 * @fileoverview LoadingPage ViewModel
 * @module components/Page/LoadingPage
 * 
 * Business logic for loading page with message rotation and progress animation.
 * 
 * @author Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { LoadingPageModel } from './LoadingPage.model';
import {
    defaultLoadingPageModel,
    LoadingPageModelSchema,
} from './LoadingPage.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseLoadingPageOptions extends Partial<LoadingPageModel> {
    /** Message rotation interval in ms (default: 3000) */
    messageInterval?: number;
    /** Progress animation duration in ms */
    progressDuration?: number;
}

export interface UseLoadingPageResult extends BaseViewModelResult<LoadingPageModel> {
    /** Current message being displayed */
    currentMessage: string;
    /** Current progress value */
    currentProgress: number;
    /** Logo animation class */
    logoAnimationClass: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LoadingPage ViewModel Hook
 * 
 * @example
 * ```tsx
 * const vm = useLoadingPage({
 *   logoUrl: '/logo.png',
 *   message: ['Loading...', 'Please wait...', 'Almost there...'],
 *   progress: 75,
 *   animated: true
 * });
 * ```
 */
export function useLoadingPage(options: UseLoadingPageOptions): UseLoadingPageResult {
    const {
        messageInterval = 3000,
        progressDuration = 500,
        ...modelData
    } = options;

    // Parse model
    const modelOptions = useMemo(() => {
        return LoadingPageModelSchema.parse({ ...defaultLoadingPageModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Base ViewModel
    const base = useBaseViewModel<LoadingPageModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'loading-page',
    });

    // Local state
    const [messageIndex, setMessageIndex] = useState(0);
    const [currentProgress, setCurrentProgress] = useState(modelOptions.progress || 0);

    // ═══════════════════════════════════════════════════════════════════════
    // Message Rotation
    // ═══════════════════════════════════════════════════════════════════════

    const messages = useMemo(() => {
        if (!modelOptions.message) return ['Loading...'];
        return Array.isArray(modelOptions.message)
            ? modelOptions.message
            : [modelOptions.message];
    }, [modelOptions.message]);

    useEffect(() => {
        if (messages.length <= 1) return;

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, messageInterval);

        return () => clearInterval(interval);
    }, [messages.length, messageInterval]);

    const currentMessage = useMemo(() => {
        return messages[messageIndex] || 'Loading...';
    }, [messages, messageIndex]);

    // ═══════════════════════════════════════════════════════════════════════
    // Progress Animation
    // ═══════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (modelOptions.progress === undefined) return;

        const duration = progressDuration;
        const start = currentProgress;
        const end = modelOptions.progress;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuad = 1 - (1 - progress) * (1 - progress);
            const value = start + (end - start) * easeOutQuad;

            setCurrentProgress(value);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [modelOptions.progress, progressDuration, currentProgress]);

    // ═══════════════════════════════════════════════════════════════════════
    // Computed
    // ═══════════════════════════════════════════════════════════════════════

    const logoAnimationClass = useMemo(() => {
        if (!modelOptions.animated) return '';
        return 'loading-page__logo--animated';
    }, [modelOptions.animated]);

    // ═══════════════════════════════════════════════════════════════════════
    // Return
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        currentMessage,
        currentProgress,
        logoAnimationClass,
    };
}

export default useLoadingPage;
