/**
 * @fileoverview TestTimeline Component Model
 * @module components/TimeLines/TestTimeline
 * 
 * Model for test step timeline visualization with validation status tracking.
 * Extends base Timeline model with test-specific properties.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Test step assertion schema
 */
export const TestAssertionSchema = z.object({
    /** Description of what is being asserted */
    description: z.string(),
    /** Whether the assertion passed */
    passed: z.boolean(),
    /** Expected value */
    expected: z.any().optional(),
    /** Actual value */
    actual: z.any().optional(),
});

/**
 * Test step schema - represents a single step in test execution
 */
export const TestStepSchema = z.object({
    /** Unique step identifier */
    id: z.string(),
    /** Step index (0-based) */
    stepIndex: z.number().default(0),
    /** Step description/title */
    title: z.string(),
    /** Detailed description */
    description: z.string().optional(),
    /** Step execution status */
    status: z.enum(['pending', 'running', 'passed', 'failed', 'skipped']).default('pending'),
    /** Assertions for this step */
    assertions: z.array(TestAssertionSchema).default([]),
    /** Execution time in milliseconds */
    executionTimeMs: z.number().optional(),
    /** Price at this step (for chart integration) */
    price: z.number().optional(),
    /** PnL at this step */
    pnl: z.number().optional(),
    /** Icon (emoji or component) */
    icon: z.string().optional(),
    /** Timestamp */
    timestamp: z.number().optional(),
});

/**
 * TestTimeline model schema
 */
export const TestTimelineModelSchema = extendSchema({
    /** Test steps */
    steps: z.array(TestStepSchema).default([]),

    /** Layout orientation */
    orientation: z.enum(['vertical', 'horizontal']).default('vertical'),

    /** Show connector lines */
    showConnectors: z.boolean().default(true),

    /** Show duration badges */
    showDuration: z.boolean().default(true),

    /** Show assertions inline */
    showAssertions: z.boolean().default(false),

    /** Auto-scroll to active step */
    autoScroll: z.boolean().default(true),

    /** Compact mode (less spacing) */
    compact: z.boolean().default(false),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type TestAssertion = z.infer<typeof TestAssertionSchema>;
export type TestStep = z.infer<typeof TestStepSchema>;
export type TestTimelineModel = z.infer<typeof TestTimelineModelSchema>;

export const defaultTestTimelineModel: TestTimelineModel = TestTimelineModelSchema.parse({});

/**
 * Factory function to create TestTimeline model with validation
 * @param data - Partial model data
 * @returns Validated TestTimelineModel
 */
export function createTestTimelineModel(data: Partial<TestTimelineModel> = {}): TestTimelineModel {
    return TestTimelineModelSchema.parse(data);
}


