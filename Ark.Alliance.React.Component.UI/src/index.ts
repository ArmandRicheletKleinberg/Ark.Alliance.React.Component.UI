/**
 * @fileoverview Ark Alliance React Component UI Library
 * @module @ark-alliance/react-ui
 * 
 * A production-grade, MVVM-inspired React component library with 33 component
 * categories, accessibility-first design, and backend-agnostic architecture.
 * 
 * @example
 * ```tsx
 * import { Button, Card, DataGrid } from '@ark-alliance/react-ui';
 * import '@ark-alliance/react-ui/styles.css';
 * 
 * function App() {
 *   return (
 *     <Button variant="primary" onClick={() => alert('Hello!')}>
 *       Click Me
 *     </Button>
 *   );
 * }
 * ```
 * 
 * @see {@link https://github.com/ark-alliance/react-ui} - GitHub Repository
 * @see {@link https://ark-alliance.github.io/react-ui} - Documentation
 */

// ═══════════════════════════════════════════════════════════════════════════
// CORE INFRASTRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

export * from './core';

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export * from './components';

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS (Math utilities, etc.)
// ═══════════════════════════════════════════════════════════════════════════

export * from './Helpers';

// ═══════════════════════════════════════════════════════════════════════════
// VERSION
// ═══════════════════════════════════════════════════════════════════════════

export const VERSION = '1.0.0';
