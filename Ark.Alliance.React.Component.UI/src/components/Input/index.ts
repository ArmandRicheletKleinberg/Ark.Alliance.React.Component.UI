/**
 * @fileoverview Input Component Barrel Export
 * @module components/Input
 */

// ═══════════════════════════════════════════════════════════════════════════
// BASE INPUT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// BaseInput is the foundation primitive
export * from './BaseInput';
export { BaseInput } from './BaseInput'; // Named export
export { BaseInput as Input } from './BaseInput/BaseInput'; // Backward compatibility alias (direct from component file)

// InputBase primitive (new)
export * from './primitives/InputBase.model';
export { InputBase, type InputBaseProps } from './primitives/InputBase';

// ═══════════════════════════════════════════════════════════════════════════
// SPECIALIZED INPUT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export * from './NeonInput';
export * from './Select';
export * from './TextArea';
export * from './Slider';
export * from './NumericInput';
export * from './FileUpload';
export * from './TextEditor';
