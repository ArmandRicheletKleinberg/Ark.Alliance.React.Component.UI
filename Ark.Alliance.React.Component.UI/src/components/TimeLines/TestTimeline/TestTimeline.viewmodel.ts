/**
 * @fileoverview TestTimeline Component ViewModel
 * @module components/TimeLines/TestTimeline
 * 
 * ViewModel for TestTimeline with step management and status tracking.
 */

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { TestTimelineModel, TestStep } from './TestTimeline.model';
import { defaultTestTimelineModel, TestTimelineModelSchema } from './TestTimeline.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseTestTimelineOptions extends Partial<TestTimelineModel> {
    /** Callback when step status changes */
    onStepChange?: (step: TestStep, index: number) => void;
    /** Callback when all steps complete */
    onComplete?: (passed: boolean, steps: TestStep[]) => void;
}

export interface UseTestTimelineResult extends BaseViewModelResult<TestTimelineModel> {
    /** All test steps */
    steps: TestStep[];
    /** CSS class string for container */
    timelineClasses: string;
    /** Currently active step index */
    activeStepIndex: number;
    /** Progress percentage (0-100) */
    progress: number;
    /** Count of passed steps */
    passedCount: number;
    /** Count of failed steps */
    failedCount: number;
    /** Whether all steps are complete */
    isComplete: boolean;
    /** Overall test result */
    overallStatus: 'pending' | 'running' | 'passed' | 'failed';
    /** Update a step's status */
    updateStep: (stepIndex: number, updates: Partial<TestStep>) => void;
    /** Run next pending step */
    runNextStep: () => void;
    /** Reset all steps to pending */
    reset: () => void;
    /** Container ref for auto-scroll */
    containerRef: React.RefObject<HTMLDivElement | null>;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TestTimeline ViewModel Hook
 * Manages test step state and provides utilities for step execution tracking.
 */
export function useTestTimeline(options: UseTestTimelineOptions = {}): UseTestTimelineResult {
    const { onStepChange, onComplete, ...modelOptions } = options;

    const containerRef = useRef<HTMLDivElement>(null);

    // Parse model options with JSON.stringify for proper dependency tracking
    const modelData = useMemo(() => {
        return TestTimelineModelSchema.parse({ ...defaultTestTimelineModel, ...modelOptions });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelOptions)]);

    const base = useBaseViewModel<TestTimelineModel>(modelData, {
        model: modelData,
        eventChannel: 'test-timeline',
    });

    // CSS classes
    const timelineClasses = useMemo(() => {
        const classes = [
            'ark-test-timeline',
            `ark-test-timeline--${base.model.orientation}`,
        ];
        if (base.model.showConnectors) classes.push('ark-test-timeline--connectors');
        if (base.model.compact) classes.push('ark-test-timeline--compact');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model]);

    // Active step index (first running or first pending)
    const activeStepIndex = useMemo(() => {
        const runningIdx = base.model.steps.findIndex(s => s.status === 'running');
        if (runningIdx >= 0) return runningIdx;
        return base.model.steps.findIndex(s => s.status === 'pending');
    }, [base.model.steps]);

    // Progress calculation
    const { progress, passedCount, failedCount, isComplete, overallStatus } = useMemo(() => {
        const total = base.model.steps.length;
        if (total === 0) {
            return { progress: 0, passedCount: 0, failedCount: 0, isComplete: false, overallStatus: 'pending' as const };
        }

        const passed = base.model.steps.filter(s => s.status === 'passed').length;
        const failed = base.model.steps.filter(s => s.status === 'failed').length;
        const running = base.model.steps.filter(s => s.status === 'running').length;
        const completed = passed + failed;

        let status: 'pending' | 'running' | 'passed' | 'failed';
        if (running > 0) {
            status = 'running';
        } else if (completed === total) {
            status = failed > 0 ? 'failed' : 'passed';
        } else if (completed > 0) {
            status = 'running';
        } else {
            status = 'pending';
        }

        return {
            progress: Math.round((completed / total) * 100),
            passedCount: passed,
            failedCount: failed,
            isComplete: completed === total,
            overallStatus: status,
        };
    }, [base.model.steps]);

    // Update step
    const updateStep = useCallback((stepIndex: number, updates: Partial<TestStep>) => {
        const steps = [...base.model.steps];
        if (stepIndex >= 0 && stepIndex < steps.length) {
            steps[stepIndex] = { ...steps[stepIndex], ...updates };
            base.updateModel({ steps });
            onStepChange?.(steps[stepIndex], stepIndex);
        }
    }, [base, onStepChange]);

    // Run next pending step
    const runNextStep = useCallback(() => {
        const nextIdx = base.model.steps.findIndex(s => s.status === 'pending');
        if (nextIdx >= 0) {
            updateStep(nextIdx, { status: 'running', timestamp: Date.now() });
        }
    }, [base.model.steps, updateStep]);

    // Reset all steps
    const reset = useCallback(() => {
        const resetSteps = base.model.steps.map(s => ({
            ...s,
            status: 'pending' as const,
            executionTimeMs: undefined,
            timestamp: undefined,
            assertions: s.assertions.map(a => ({ ...a, passed: false })),
        }));
        base.updateModel({ steps: resetSteps });
    }, [base]);

    // Auto-scroll to active step
    useEffect(() => {
        if (base.model.autoScroll && containerRef.current && activeStepIndex >= 0) {
            const stepElements = containerRef.current.querySelectorAll('.ark-test-timeline__step');
            const activeElement = stepElements[activeStepIndex];
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeStepIndex, base.model.autoScroll]);

    // Call onComplete when all steps finish
    useEffect(() => {
        if (isComplete && onComplete) {
            onComplete(failedCount === 0, base.model.steps);
        }
    }, [isComplete, failedCount, onComplete, base.model.steps]);

    return {
        ...base,
        steps: base.model.steps,
        timelineClasses,
        activeStepIndex,
        progress,
        passedCount,
        failedCount,
        isComplete,
        overallStatus,
        updateStep,
        runNextStep,
        reset,
        containerRef,
    };
}

export default useTestTimeline;
