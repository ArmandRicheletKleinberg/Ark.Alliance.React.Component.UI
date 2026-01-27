/**
 * @fileoverview Status Enum Definitions
 * @module core/enums/Status
 * 
 * Centralized status enums for connection states, process states, etc.
 * 
 * @example
 * ```typescript
 * import { ConnectionStatusSchema, ConnectionStatus } from '@core/enums';
 * 
 * const indicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
 *     const color = status === 'connected' ? 'green' : 'red';
 * };
 * ```
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// STATUS SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Connection status options.
 * 
 * Used for WebSocket connections, API status, etc.
 * 
 * | Status | Description |
 * |--------|-------------|
 * | `connected` | Active connection |
 * | `disconnected` | No connection |
 * | `connecting` | Connection in progress |
 * | `error` | Connection error |
 */
export const ConnectionStatusSchema = z.enum([
    'connected',
    'disconnected',
    'connecting',
    'error',
]);

/**
 * Process/Task status options.
 * 
 * Used for timeline items, workflow steps, etc.
 * 
 * | Status | Description |
 * |--------|-------------|
 * | `pending` | Not started |
 * | `active` | In progress |
 * | `completed` | Successfully finished |
 * | `error` | Failed |
 */
export const ProcessStatusSchema = z.enum([
    'pending',
    'active',
    'completed',
    'error',
]);

/**
 * Test execution status options.
 * 
 * Extended status for test runners and CI/CD.
 */
export const TestStatusSchema = z.enum([
    'pending',
    'running',
    'passed',
    'failed',
    'skipped',
]);

/**
 * Badge semantic status options.
 * 
 * Used for status indicators, alerts, notifications.
 */
export const SemanticStatusSchema = z.enum([
    'info',
    'success',
    'warning',
    'error',
    'neutral',
]);

/**
 * Service/System status options.
 * 
 * Used for service health, daemons, background tasks.
 */
export const ServiceStatusSchema = z.enum([
    'running',
    'stopped',
    'paused',
    'idle',
    'maintenance',
]);

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/** Connection status type */
export type ConnectionStatus = z.infer<typeof ConnectionStatusSchema>;

/** Process status type */
export type ProcessStatus = z.infer<typeof ProcessStatusSchema>;

/** Test status type */
export type TestStatus = z.infer<typeof TestStatusSchema>;

/** Semantic status type */
export type SemanticStatus = z.infer<typeof SemanticStatusSchema>;

/** Service status type */
export type ServiceStatus = z.infer<typeof ServiceStatusSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Status color mapping for UI.
 */
export const STATUS_COLORS: Record<ConnectionStatus, string> = {
    connected: '#22c55e',    // Green
    disconnected: '#ef4444', // Red
    connecting: '#eab308',   // Yellow
    error: '#ef4444',        // Red
};

/**
 * Process status color mapping.
 */
export const PROCESS_STATUS_COLORS: Record<ProcessStatus, string> = {
    pending: '#64748b',   // Slate
    active: '#3b82f6',    // Blue
    completed: '#22c55e', // Green
    error: '#ef4444',     // Red
};
