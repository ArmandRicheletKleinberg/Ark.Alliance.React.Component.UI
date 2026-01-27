/**
 * @fileoverview TestTimeline Component
 * @module components/TimeLines/TestTimeline
 * 
 * Visual component for displaying test step execution progress.
 * Supports pending, running, passed, failed, and skipped states.
 */

import { forwardRef, memo } from 'react';
import { useTestTimeline, type UseTestTimelineOptions } from './TestTimeline.viewmodel';
import type { TestStep } from './TestTimeline.model';
import './TestTimeline.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface TestTimelineProps extends UseTestTimelineOptions {
    /** Additional CSS class */
    className?: string;
    /** Show progress bar at top */
    showProgress?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Status icon based on step status
 */
function StatusIcon({ status }: { status: TestStep['status'] }) {
    switch (status) {
        case 'passed': return <span className="ark-test-timeline__icon">✓</span>;
        case 'failed': return <span className="ark-test-timeline__icon">✕</span>;
        case 'running': return <span className="ark-test-timeline__icon">●</span>;
        case 'skipped': return <span className="ark-test-timeline__icon">○</span>;
        default: return null;
    }
}

/**
 * Duration badge
 */
function DurationBadge({ ms }: { ms?: number }) {
    if (ms === undefined) return null;
    const formatted = ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
    return <span className="ark-test-timeline__duration">{formatted}</span>;
}

/**
 * Progress bar component
 */
function ProgressBar({
    progress,
    passedCount,
    failedCount,
    total,
    hasFailed,
}: {
    progress: number;
    passedCount: number;
    failedCount: number;
    total: number;
    hasFailed: boolean;
}) {
    return (
        <div className="ark-test-timeline__progress">
            <div className="ark-test-timeline__progress-bar">
                <div
                    className={`ark-test-timeline__progress-fill ${hasFailed ? 'ark-test-timeline__progress-fill--failed' : ''}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="ark-test-timeline__progress-stats">
                <span>{passedCount} passed</span>
                <span>{failedCount} failed</span>
                <span>{total} total</span>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TestTimeline Component
 * 
 * Displays a vertical or horizontal timeline of test steps with status indicators.
 * 
 * @example
 * ```tsx
 * <TestTimeline
 *     steps={[
 *         { id: 'step-1', title: 'Initialize', status: 'passed' },
 *         { id: 'step-2', title: 'Execute', status: 'running' },
 *         { id: 'step-3', title: 'Verify', status: 'pending' },
 *     ]}
 *     showProgress
 *     onStepChange={(step, idx) => console.log(`Step ${idx} changed`)}
 * />
 * ```
 */
export const TestTimeline = memo(forwardRef<HTMLDivElement, TestTimelineProps>(
    function TestTimeline(props, _ref) {
        const { className = '', showProgress = true, ...timelineOptions } = props;
        const vm = useTestTimeline(timelineOptions);

        return (
            <div
                ref={vm.containerRef}
                className={`${vm.timelineClasses} ${className}`}
                data-testid={vm.model.testId}
            >
                {showProgress && vm.steps.length > 0 && (
                    <ProgressBar
                        progress={vm.progress}
                        passedCount={vm.passedCount}
                        failedCount={vm.failedCount}
                        total={vm.steps.length}
                        hasFailed={vm.failedCount > 0}
                    />
                )}

                {vm.steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`ark-test-timeline__step ark-test-timeline__step--${step.status}`}
                        data-step-index={index}
                    >
                        <div className="ark-test-timeline__marker">
                            {step.icon ? (
                                <span className="ark-test-timeline__icon">{step.icon}</span>
                            ) : step.status !== 'pending' ? (
                                <StatusIcon status={step.status} />
                            ) : (
                                <span className="ark-test-timeline__dot" />
                            )}
                        </div>

                        <div className="ark-test-timeline__content">
                            <div className="ark-test-timeline__header">
                                <h4 className="ark-test-timeline__title">
                                    {step.title}
                                </h4>
                                {vm.model.showDuration && (
                                    <DurationBadge ms={step.executionTimeMs} />
                                )}
                            </div>

                            {step.description && (
                                <p className="ark-test-timeline__description">
                                    {step.description}
                                </p>
                            )}

                            {vm.model.showAssertions && step.assertions.length > 0 && (
                                <div className="ark-test-timeline__assertions">
                                    {step.assertions.map((assertion, aIdx) => (
                                        <div
                                            key={aIdx}
                                            className={`ark-test-timeline__assertion ark-test-timeline__assertion--${assertion.passed ? 'passed' : 'failed'}`}
                                        >
                                            <span className="ark-test-timeline__assertion-icon">
                                                {assertion.passed ? '✓' : '✕'}
                                            </span>
                                            <span className="ark-test-timeline__assertion-text">
                                                {assertion.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {vm.model.showConnectors && index < vm.steps.length - 1 && (
                            <div className="ark-test-timeline__connector" />
                        )}
                    </div>
                ))}
            </div>
        );
    }
));

TestTimeline.displayName = 'TestTimeline';
export default TestTimeline;
