# Agents.md - Ark.Alliance.React.Component.UI

> **Version:** 1.5.0
> **Last Updated:** 2026-01-26
> **Purpose:** Comprehensive architectural guidelines, technologies, code quality expectations, and development standards for AI agents and developers working on this enterprise-grade React component library.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technologies & Stack](#technologies--stack)
3. [MVVM Pattern Implementation](#mvvm-pattern-implementation)
4. [Core Infrastructure](#core-infrastructure)
5. [Component Development Standards](#component-development-standards)
6. [Code Quality Expectations](#code-quality-expectations)
7. [Code Documentation Standards](#code-documentation-standards)
8. [Design Patterns](#design-patterns)
9. [Testing Standards](#testing-standards)
10. [Styling Conventions](#styling-conventions)
11. [Validation & Type Safety](#validation--type-safety)
12. [Accessibility Requirements](#accessibility-requirements)
13. [Performance Optimization](#performance-optimization)
14. [Negative Prompts (Anti-Patterns)](#negative-prompts-anti-patterns)
15. [File Naming & Organization](#file-naming--organization)
16. [Git & Version Control](#git--version-control)
17. [Component Checklist](#component-checklist)

---

## Architecture Overview

### Primary Architecture
This library implements **Model-View-ViewModel (MVVM)** pattern with strict separation of concerns:

- **Model Layer** (*.model.ts): Zod schemas, TypeScript types, factory functions
- **ViewModel Layer** (*.viewmodel.ts): React hooks, state management, business logic
- **View Layer** (*.tsx): React components, UI rendering, minimal logic

### Design Philosophy
- **Type-Safe First**: Zero runtime type errors through Zod + TypeScript strict mode
- **Composition Over Inheritance**: Extend schemas and compose hooks
- **Declarative Validation**: Schema-based validation at model layer
- **Predictable State Management**: React hooks with clear data flow
- **Enterprise-Ready**: Production-grade error handling, accessibility, testing
- **Domain-Driven**: Components organized by business domain (Finance, Healthcare, Logistics, etc.)

### Key Principles
1. **Single Responsibility**: Each layer has one clear purpose
2. **Immutability**: State updates through pure functions
3. **Predictability**: Deterministic behavior, no hidden side effects
4. **Testability**: Each layer independently testable
5. **Extensibility**: Easy to add features without breaking existing code
6. **Performance**: Memoization, lazy loading, code splitting

---

## Technologies & Stack

### Core Technologies

| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| **React** | 19.2.0 | UI framework | Use hooks, functional components only |
| **TypeScript** | 5.9.3 | Type safety | Strict mode enabled, no `any` allowed |
| **Zod** | 4.2.1 | Runtime validation | All models must have Zod schemas |
| **Vite** | 7.2.4 | Build tool | ESM-first, fast HMR, library mode |
| **Tailwind CSS** | 4.1.18 | Utility CSS | v4 with Vite plugin, CSS variables |
| **Vitest** | 4.0.16 | Testing framework | Fast, Jest-compatible API |
| **ESLint** | 9.39.1 | Linting | Strict rules, React hooks plugin |

### Additional Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| `@fortawesome/react-fontawesome` | 3.1.1 | Icon system |
| `@react-three/fiber` | 9.4.2 | 3D rendering (Three.js) |
| `@react-three/drei` | 10.7.7 | Three.js helpers |
| `react-markdown` | 10.1.0 | Markdown rendering |
| `mermaid` | 11.12.2 | Diagram rendering |

### TypeScript Configuration

**Compiler Options** (tsconfig.app.json):
```json
{
  "target": "ES2022",
  "lib": ["ES2022", "DOM", "DOM.Iterable"],
  "module": "ESNext",
  "jsx": "react-jsx",
  "strict": true,
  "moduleResolution": "bundler",
  "noFallthroughCasesInSwitch": true
}
```

**Requirements**:
- ✅ `strict: true` - All strict checks enabled
- ✅ `noImplicitAny` - No implicit any types
- ✅ `strictNullChecks` - Null/undefined must be explicit
- ❌ No `any` type usage except in rare utility functions with justification

---

## MVVM Pattern Implementation

### Pattern Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    VIEW LAYER (*.tsx)                       │
│  • React Component (memo + forwardRef)                      │
│  • Renders UI based on ViewModel state                      │
│  • Spreads handlers from ViewModel                          │
│  • Minimal logic (only rendering decisions)                 │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ Consumes Hook
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 VIEWMODEL LAYER (*.viewmodel.ts)            │
│  • Custom React Hook (useComponentName)                     │
│  • State management (useState, useMemo, useCallback)        │
│  • Event handlers and business logic                        │
│  • Returns typed interface with handlers & computed values  │
│  • Extends useBaseViewModel for lifecycle                   │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ Uses Schema
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   MODEL LAYER (*.model.ts)                  │
│  • Zod Schema definition (extends BaseModelSchema)          │
│  • TypeScript types inferred via z.infer<>                  │
│  • Default values and factory functions                     │
│  • No business logic (pure data structure)                  │
└─────────────────────────────────────────────────────────────┘
```

### Model Layer Template

```typescript
/**
 * @fileoverview ComponentName Model
 * @module components/Category/ComponentName/ComponentName.model
 */

import { z } from 'zod';
import { extendSchema } from '@/core/base/BaseComponentModel';

// Enums for type safety
export const ComponentVariant = z.enum(['primary', 'secondary', 'tertiary']);
export const ComponentSize = z.enum(['sm', 'md', 'lg']);

/**
 * ComponentName Model Schema
 * Extends BaseModelSchema with component-specific properties
 */
export const ComponentNameModelSchema = extendSchema({
    variant: ComponentVariant.default('primary'),
    size: ComponentSize.default('md'),
    label: z.string().optional(),
    value: z.string().default(''),
    customProp: z.number().min(0).default(0),
    // ... additional properties
});

/**
 * ComponentName Model Type (inferred from schema)
 */
export type ComponentNameModel = z.infer<typeof ComponentNameModelSchema>;

/**
 * Default model instance
 */
export const defaultComponentNameModel: ComponentNameModel = ComponentNameModelSchema.parse({});

/**
 * Factory function for creating ComponentName models
 *
 * @param data - Partial model data
 * @returns Validated ComponentName model
 *
 * @example
 * ```typescript
 * const model = createComponentNameModel({
 *   variant: 'primary',
 *   size: 'lg',
 * });
 * ```
 */
export function createComponentNameModel(data: Partial<ComponentNameModel>): ComponentNameModel {
    return ComponentNameModelSchema.parse({ ...defaultComponentNameModel, ...data });
}
```

### ViewModel Layer Template

```typescript
/**
 * @fileoverview ComponentName ViewModel
 * @module components/Category/ComponentName/ComponentName.viewmodel
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useBaseViewModel, BaseViewModelResult } from '@/core/base/BaseViewModel';
import {
    ComponentNameModel,
    ComponentNameModelSchema,
    defaultComponentNameModel,
} from './ComponentName.model';

/**
 * Options for useComponentName hook
 * Extends Partial<ComponentNameModel> with event handlers
 */
export interface UseComponentNameOptions extends Partial<ComponentNameModel> {
    /** Called when component value changes */
    onChange?: (value: string) => void;
    /** Called when component is clicked */
    onClick?: (event: React.MouseEvent) => void | Promise<void>;
}

/**
 * Return type of useComponentName hook
 * Extends BaseViewModelResult with component-specific properties
 */
export interface UseComponentNameResult extends BaseViewModelResult<ComponentNameModel> {
    /** Click handler with loading state support */
    handleClick: (event: React.MouseEvent) => void;
    /** Computed CSS classes */
    componentClasses: string;
    /** Whether component is interactive */
    isInteractive: boolean;
}

/**
 * ComponentName ViewModel Hook
 *
 * Manages component state, handles user interactions, and provides
 * computed properties for rendering.
 *
 * @param options - Component configuration and event handlers
 * @returns ViewModel result with state, handlers, and computed values
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const vm = useComponentName({
 *     variant: 'primary',
 *     size: 'lg',
 *     onClick: async () => {
 *       await performAction();
 *     },
 *   });
 *
 *   return (
 *     <div
 *       className={vm.componentClasses}
 *       onClick={vm.handleClick}
 *     >
 *       {vm.state.isLoading ? 'Loading...' : 'Click Me'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useComponentName(
    options: UseComponentNameOptions = {}
): UseComponentNameResult {
    // Parse and memoize model options
    const modelOptions = useMemo(() => {
        const { onChange, onClick, ...modelData } = options;
        return ComponentNameModelSchema.parse({ ...defaultComponentNameModel, ...modelData });
    }, [JSON.stringify(options)]);

    // Initialize base ViewModel
    const base = useBaseViewModel<ComponentNameModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'componentName',
    });

    // Local state
    const [localValue, setLocalValue] = useState(base.model.value);

    // Event handlers
    const handleClick = useCallback(
        async (event: React.MouseEvent) => {
            if (base.model.disabled || base.state.isLoading) {
                event.preventDefault();
                return;
            }

            base.emit('click', { id: base.model.id, value: localValue });

            if (options.onClick) {
                const result = options.onClick(event);
                if (result instanceof Promise) {
                    await base.executeAsync(() => result);
                }
            }
        },
        [base, localValue, options.onClick]
    );

    // Computed properties
    const isInteractive = useMemo(() => {
        return !base.model.disabled && !base.state.isLoading;
    }, [base.model.disabled, base.state.isLoading]);

    const componentClasses = useMemo(() => {
        const classes = [
            'ark-component-name',
            `ark-component-name--${base.model.variant}`,
            `ark-component-name--${base.model.size}`,
        ];

        if (base.model.disabled) classes.push('ark-component-name--disabled');
        if (base.state.isLoading) classes.push('ark-component-name--loading');

        return classes.join(' ');
    }, [base.model.variant, base.model.size, base.model.disabled, base.state.isLoading]);

    // Side effects
    useEffect(() => {
        if (base.model.value !== localValue) {
            setLocalValue(base.model.value);
        }
    }, [base.model.value]);

    return {
        ...base,
        handleClick,
        componentClasses,
        isInteractive,
    };
}
```

### View Layer Template

```typescript
/**
 * @fileoverview ComponentName View
 * @module components/Category/ComponentName/ComponentName
 */

import React, { memo, forwardRef } from 'react';
import { useComponentName, UseComponentNameOptions } from './ComponentName.viewmodel';
import './ComponentName.scss';

/**
 * ComponentName Props
 * Extends ViewModel options with React-specific props
 */
export interface ComponentNameProps extends UseComponentNameOptions {
    /** Component children */
    children?: React.ReactNode;
    /** CSS class name */
    className?: string;
}

/**
 * ComponentName Component
 *
 * A professional, accessible component following MVVM architecture.
 *
 * @example
 * ```tsx
 * <ComponentName
 *   variant="primary"
 *   size="lg"
 *   onClick={handleClick}
 * >
 *   Click Me
 * </ComponentName>
 * ```
 */
export const ComponentName = memo(
    forwardRef<HTMLDivElement, ComponentNameProps>(function ComponentName(
        { children, className, ...options },
        ref
    ) {
        const vm = useComponentName(options);

        return (
            <div
                ref={ref}
                className={`${vm.componentClasses} ${className || ''}`.trim()}
                onClick={vm.handleClick}
                role={vm.model.clickable ? 'button' : undefined}
                tabIndex={vm.model.focusable ? 0 : undefined}
                aria-disabled={!vm.isInteractive}
                aria-busy={vm.state.isLoading}
                aria-label={vm.model.ariaLabel}
                data-testid={vm.model.testId}
            >
                {vm.state.isLoading ? (
                    <span className="ark-component-name__loading">Loading...</span>
                ) : (
                    children
                )}
            </div>
        );
    })
);

ComponentName.displayName = 'ComponentName';
```

---

## Core Infrastructure

### BaseComponentModel

**Location**: `src/core/base/BaseComponentModel.ts`

**Key Features**:
- Provides universal component properties (id, disabled, loading, className, etc.)
- Interaction properties (clickable, draggable, focusable)
- Tooltip support built-in
- Accessibility properties (ariaLabel, testId)
- Metadata for custom data storage

**Usage**:
```typescript
import { extendSchema } from '@/core/base/BaseComponentModel';

const MyComponentSchema = extendSchema({
    customProp: z.string(),
    // Automatically inherits: id, disabled, loading, className, testId, etc.
});
```

### BaseViewModel

**Location**: `src/core/base/BaseViewModel.ts`

**Key Features**:
- Lifecycle phase tracking (mounting, mounted, updating, unmounting, unmounted)
- Event bus integration with `emit()` and `subscribe()`
- Async execution with `executeAsync()` - automatic loading/error handling
- Model updates with `updateModel()`
- Mount safety checks to prevent state leaks

**Usage**:
```typescript
import { useBaseViewModel } from '@/core/base/BaseViewModel';

const base = useBaseViewModel<MyModel>(modelOptions, {
    model: modelOptions,
    eventChannel: 'myComponent',
});

// Access lifecycle state
console.log(base.state.phase); // 'mounted'

// Emit events
base.emit('customEvent', { data: 'value' });

// Execute async operations
await base.executeAsync(async () => {
    // base.state.isLoading automatically set to true
    await apiCall();
    // Automatically set to false after completion
});
```

### FormInputModel

**Location**: `src/core/base/FormInputModel.ts`

**Key Features**:
- Extends BaseModelSchema with form-specific properties
- Input restrictions (disableCopy, disablePaste, allowedPattern, etc.)
- Validation state tracking (valid, invalid, pending, none)
- Label, help text, error message support
- Preset restrictions for common use cases (numericOnly, blockPaste, etc.)

**Usage**:
```typescript
import { FormInputModelSchema, InputRestrictionPresets } from '@/core/base/FormInputModel';

const MyInputSchema = FormInputModelSchema.extend({
    placeholder: z.string().optional(),
});

// Use presets
const model = MyInputSchema.parse({
    inputRestriction: InputRestrictionPresets.numericOnly,
});
```

---

## Component Development Standards

### File Organization

Each component MUST have the following structure:

```
ComponentName/
├── ComponentName.tsx              # View layer (React component)
├── ComponentName.viewmodel.ts     # ViewModel layer (hook)
├── ComponentName.model.ts         # Model layer (schema + types)
├── ComponentName.scss             # Styles (optional, prefer global styles)
├── ComponentName.test.tsx         # Tests (in Tests project)
└── index.ts                       # Public exports
```

### index.ts Pattern

```typescript
/**
 * @fileoverview ComponentName Public Exports
 * @module components/Category/ComponentName
 */

export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';

export { useComponentName } from './ComponentName.viewmodel';
export type { UseComponentNameOptions, UseComponentNameResult } from './ComponentName.viewmodel';

export {
    ComponentNameModelSchema,
    defaultComponentNameModel,
    createComponentNameModel,
    ComponentVariant,
    ComponentSize,
} from './ComponentName.model';
export type { ComponentNameModel } from './ComponentName.model';
```

### Component Responsibilities

#### Model Layer MUST:
- ✅ Define Zod schema extending BaseModelSchema
- ✅ Export TypeScript type via `z.infer<>`
- ✅ Provide default model instance
- ✅ Provide factory function for creating models
- ✅ Include JSDoc for all exports
- ❌ Contain NO business logic
- ❌ Contain NO React hooks or state

#### ViewModel Layer MUST:
- ✅ Extend useBaseViewModel
- ✅ Define Options interface (extends Partial<Model>)
- ✅ Define Result interface (extends BaseViewModelResult)
- ✅ Use useMemo for model parsing
- ✅ Use useCallback for event handlers
- ✅ Use useMemo for computed properties
- ✅ Handle async operations via base.executeAsync()
- ✅ Include comprehensive JSDoc with @example
- ❌ Contain NO JSX or rendering logic
- ❌ Directly manipulate DOM

#### View Layer MUST:
- ✅ Use memo() for performance optimization
- ✅ Use forwardRef() for ref support
- ✅ Call ViewModel hook
- ✅ Spread ViewModel handlers
- ✅ Set displayName for debugging
- ✅ Include aria-* attributes for accessibility
- ✅ Include data-testid for testing
- ❌ Contain complex business logic
- ❌ Directly manage state (use ViewModel)

---

## Code Quality Expectations

### TypeScript Requirements

#### Strict Type Safety
- ✅ All code MUST pass TypeScript strict mode compilation with ZERO errors
- ✅ Use `z.infer<>` for type inference from Zod schemas
- ✅ Explicit return types for all exported functions
- ✅ Explicit types for function parameters
- ❌ NO usage of `any` type (use `unknown` and type guards instead)
- ❌ NO type assertions (`as`) without justification
- ❌ NO `@ts-ignore` or `@ts-expect-error` without explanation

#### Example - Good:
```typescript
export function useButton(options: UseButtonOptions = {}): UseButtonResult {
    // Explicit parameter and return types
}

export type ButtonModel = z.infer<typeof ButtonModelSchema>;
// Type inferred from schema
```

#### Example - Bad:
```typescript
// ❌ No return type
export function useButton(options) {
    return { /* ... */ };
}

// ❌ Using any
const data: any = getData();

// ❌ Type assertion without justification
const element = document.querySelector('.btn') as HTMLButtonElement;
```

### React Requirements

#### Hooks Rules
- ✅ Follow React hooks rules (top-level only, not in conditionals)
- ✅ Use useMemo for expensive computations
- ✅ Use useCallback for event handlers passed as props
- ✅ Use useEffect for side effects with proper cleanup
- ✅ Declare all dependencies in dependency arrays
- ❌ NO stale closures (missing dependencies)
- ❌ NO unnecessary dependencies causing re-renders

#### Performance
- ✅ Wrap components in memo() when props are stable
- ✅ Use useCallback for handlers to prevent child re-renders
- ✅ Use useMemo for computed values
- ✅ Lazy load heavy components/modules
- ❌ NO inline function definitions in render
- ❌ NO object/array literals in JSX props

#### Example - Good:
```typescript
const handleClick = useCallback((event: React.MouseEvent) => {
    // Handler logic
}, [dependencies]);

const computedValue = useMemo(() => {
    return expensiveComputation(data);
}, [data]);

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    // Component logic
}));
```

#### Example - Bad:
```typescript
// ❌ Inline function - creates new reference every render
<button onClick={() => handleAction()} />

// ❌ Object literal in props - creates new object every render
<Component style={{ margin: 10 }} />

// ❌ Missing memo wrapper
export const ExpensiveComponent = (props) => {
    // Complex rendering logic
};
```

### Code Organization

#### Imports
- ✅ Group imports: React → Third-party → Internal → Relative
- ✅ Use absolute imports with `@/` alias
- ✅ One export per line
- ❌ NO wildcard imports (`import *`) unless necessary

```typescript
// Good
import React, { memo, forwardRef, useCallback } from 'react';
import { z } from 'zod';

import { useBaseViewModel } from '@/core/base/BaseViewModel';
import { extendSchema } from '@/core/base/BaseComponentModel';

import { ButtonModel, ButtonModelSchema } from './Button.model';
import './Button.scss';
```

#### Variable Naming
- ✅ PascalCase for: Components, Types, Interfaces, Enums, Zod schemas
- ✅ camelCase for: variables, functions, hooks, properties
- ✅ SCREAMING_SNAKE_CASE for: constants
- ✅ Descriptive names (no single letters except loop indices)
- ❌ NO abbreviations unless widely understood (btn → button)

```typescript
// Good
const ButtonModelSchema = z.object({ /* ... */ });
export type ButtonModel = z.infer<typeof ButtonModelSchema>;
export const MAX_RETRY_ATTEMPTS = 3;

function useButton(options: UseButtonOptions): UseButtonResult {
    const handleClick = useCallback(() => { /* ... */ }, []);
}

// Bad
const BtnSchema = z.object({ /* ... */ }); // ❌ Abbreviation
const MAX_RETRY = 3; // ❌ Inconsistent naming
function useBtnLogic(opts) { /* ... */ } // ❌ Abbreviations
```

---

## Code Documentation Standards

### JSDoc Requirements

**ALL exported items MUST have JSDoc comments** including:
- File overview with @fileoverview and @module
- Functions/hooks with @param, @returns, @example
- Interfaces/types with description
- Complex logic with inline comments

### Templates

#### File Header
```typescript
/**
 * @fileoverview Brief description of file purpose
 * @module path/to/module
 *
 * Optional longer description explaining the module's role,
 * key concepts, or usage guidelines.
 */
```

#### Function/Hook
```typescript
/**
 * Brief one-line description of function purpose.
 *
 * Optional longer description explaining behavior, edge cases,
 * or important details.
 *
 * @param paramName - Description of parameter
 * @param optionalParam - Description (optional)
 * @returns Description of return value
 *
 * @example
 * ```typescript
 * const result = myFunction('value', 123);
 * console.log(result);
 * ```
 *
 * @throws {Error} Description of when errors are thrown
 */
export function myFunction(
    paramName: string,
    optionalParam?: number
): ReturnType {
    // Implementation
}
```

#### Interface/Type
```typescript
/**
 * Description of interface purpose.
 *
 * @example
 * ```typescript
 * const config: MyInterface = {
 *   property: 'value',
 * };
 * ```
 */
export interface MyInterface {
    /** Description of property */
    property: string;

    /** Description of optional property */
    optionalProperty?: number;
}
```

#### Complex Logic
```typescript
// Calculate compound interest using formula: A = P(1 + r/n)^(nt)
// where P = principal, r = rate, n = compounds per year, t = years
const futureValue = principal * Math.pow(1 + rate / compoundsPerYear, compoundsPerYear * years);
```

---

## Design Patterns

### Composition Pattern

**Prefer composition over inheritance** using Zod's `.extend()`:

```typescript
// Base schema
const BaseSchema = z.object({
    id: z.string(),
    disabled: z.boolean(),
});

// Compose new schemas
const ButtonSchema = BaseSchema.extend({
    variant: z.enum(['primary', 'secondary']),
});

const InputSchema = BaseSchema.extend({
    value: z.string(),
    placeholder: z.string().optional(),
});
```

### Hook Composition Pattern

```typescript
// Base hook
function useBaseViewModel<T>(model: T) {
    // Common logic
    return { model, state, emit, subscribe };
}

// Composed hook
function useButton(options: UseButtonOptions) {
    const base = useBaseViewModel(options);

    // Add button-specific logic
    const handleClick = useCallback(() => { /* ... */ }, [base]);

    return { ...base, handleClick };
}
```

### Factory Pattern

```typescript
/**
 * Factory for creating validated models
 */
export function createButtonModel(data: Partial<ButtonModel>): ButtonModel {
    return ButtonModelSchema.parse({ ...defaultButtonModel, ...data });
}

// Usage
const button1 = createButtonModel({ variant: 'primary' });
const button2 = createButtonModel({ size: 'lg', disabled: true });
```

### Observer Pattern (Event Bus)

```typescript
// In ViewModel
const base = useBaseViewModel(model, {
    eventChannel: 'button',
});

// Emit events
base.emit('click', { id: model.id, timestamp: Date.now() });

// Subscribe to events (in parent or separate component)
useEffect(() => {
    const unsubscribe = base.subscribe('click', (data) => {
        console.log('Button clicked:', data);
    });

    return unsubscribe; // Cleanup
}, []);
```

### Render Props Pattern (withTooltip HOC)

```typescript
export function withTooltip<P extends object>(
    Component: React.ComponentType<P>
): React.ComponentType<P & TooltipProps> {
    return function WithTooltip(props: P & TooltipProps) {
        return (
            <TooltipWrapper {...props}>
                <Component {...props} />
            </TooltipWrapper>
        );
    };
}

// Usage
const ButtonWithTooltip = withTooltip(Button);
```

---

## Testing Standards

### Test File Organization

**Location**: `Ark.Alliance.React.Component.UI.Tests/components/[Category]/[Component].test.tsx`

```typescript
/**
 * @fileoverview ComponentName Tests
 * @module tests/components/Category/ComponentName
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ComponentName } from '@/components/Category/ComponentName';
import { ComponentNameModelSchema } from '@/components/Category/ComponentName/ComponentName.model';

describe('ComponentName', () => {
    afterEach(() => {
        cleanup();
    });

    describe('MODEL-001: Schema Validation', () => {
        it('should parse valid model', () => {
            const result = ComponentNameModelSchema.parse({
                variant: 'primary',
                size: 'md',
            });

            expect(result.variant).toBe('primary');
            expect(result.size).toBe('md');
        });

        it('should use defaults for missing properties', () => {
            const result = ComponentNameModelSchema.parse({});

            expect(result.variant).toBe('primary');
            expect(result.disabled).toBe(false);
        });

        it('should reject invalid values', () => {
            expect(() =>
                ComponentNameModelSchema.parse({ variant: 'invalid' })
            ).toThrow();
        });
    });

    describe('COMPONENT-001: Rendering', () => {
        it('should render with default props', () => {
            const { container } = render(
                React.createElement(ComponentName, {})
            );

            const element = container.querySelector('.ark-component-name');
            expect(element).toBeTruthy();
        });

        it('should apply variant class', () => {
            const { container } = render(
                React.createElement(ComponentName, { variant: 'secondary' })
            );

            const element = container.querySelector('.ark-component-name');
            expect(element?.className).toContain('ark-component-name--secondary');
        });
    });

    describe('COMPONENT-002: Interactions', () => {
        it('should call onClick when clicked', async () => {
            const onClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(ComponentName, { onClick })
            );

            const element = container.querySelector('.ark-component-name');
            await user.click(element!);

            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('should not call onClick when disabled', async () => {
            const onClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(ComponentName, { onClick, disabled: true })
            );

            const element = container.querySelector('.ark-component-name');
            await user.click(element!);

            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('COMPONENT-003: Accessibility', () => {
        it('should have aria-label when provided', () => {
            const { container } = render(
                React.createElement(ComponentName, { ariaLabel: 'Test Label' })
            );

            const element = container.querySelector('.ark-component-name');
            expect(element?.getAttribute('aria-label')).toBe('Test Label');
        });

        it('should set aria-disabled when disabled', () => {
            const { container } = render(
                React.createElement(ComponentName, { disabled: true })
            );

            const element = container.querySelector('.ark-component-name');
            expect(element?.getAttribute('aria-disabled')).toBe('true');
        });
    });
});
```

### Test Coverage Requirements

- ✅ Schema validation tests (parse valid, defaults, reject invalid)
- ✅ Rendering tests (default props, variants, sizes, states)
- ✅ Interaction tests (click, focus, blur, keyboard, touch)
- ✅ Accessibility tests (aria attributes, keyboard navigation)
- ✅ State management tests (loading, error, disabled)
- ✅ Edge cases (null/undefined values, boundary conditions)
- ✅ Target: 100% code coverage

### Test Naming Convention

Use format: `[CATEGORY]-[NUMBER]: [Description]`

Examples:
- `MODEL-001: Schema Validation`
- `COMPONENT-001: Rendering`
- `COMPONENT-002: User Interactions`
- `COMPONENT-003: Accessibility`
- `VIEWMODEL-001: State Management`

---

## Styling Conventions

### SCSS Architecture

**File Structure**:
```scss
/**
 * ComponentName Styles
 * @module components/Category/ComponentName
 */

@use 'sass:map';
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

// Component base class
.ark-component-name {
    // Base styles using CSS custom properties
    color: var(--ark-text-primary, #111827);
    background: var(--ark-bg-primary, #ffffff);

    // Use Tailwind utilities where possible
    @apply rounded-md transition-colors duration-200;

    // States
    &:hover:not(:disabled) {
        background: var(--ark-bg-secondary, #f3f4f6);
    }

    &:focus-visible {
        outline: 2px solid var(--ark-primary, #3b82f6);
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

// Variants using maps
$variants: (
    'primary': (
        'bg': var(--ark-primary, #3b82f6),
        'text': var(--ark-text-on-primary, #ffffff),
    ),
    'secondary': (
        'bg': var(--ark-secondary, #6b7280),
        'text': var(--ark-text-on-secondary, #ffffff),
    ),
);

@each $name, $config in $variants {
    .ark-component-name--#{$name} {
        background: map.get($config, 'bg');
        color: map.get($config, 'text');
    }
}

// Sizes
.ark-component-name {
    &--sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }

    &--md {
        padding: 0.5rem 1rem;
        font-size: 1rem;
    }

    &--lg {
        padding: 0.75rem 1.5rem;
        font-size: 1.125rem;
    }
}

// Dark mode
[data-theme="dark"],
.dark {
    .ark-component-name {
        color: var(--ark-text-primary, #f9fafb);
        background: var(--ark-bg-primary, #111827);
    }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
    .ark-component-name {
        transition: none;
        animation: none;
    }
}
```

### CSS Custom Properties

**Use CSS variables for theming**:
```scss
// Define in :root or component
:root {
    --ark-primary: #3b82f6;
    --ark-primary-hover: #2563eb;
    --ark-text-primary: #111827;
    --ark-bg-primary: #ffffff;
}

[data-theme="dark"] {
    --ark-text-primary: #f9fafb;
    --ark-bg-primary: #111827;
}
```

### BEM Naming Convention

```scss
// Block
.ark-component-name { }

// Element
.ark-component-name__header { }
.ark-component-name__body { }
.ark-component-name__footer { }

// Modifier
.ark-component-name--primary { }
.ark-component-name--disabled { }

// State
.ark-component-name.is-active { }
.ark-component-name.is-loading { }
```

### Styling Requirements

- ✅ Use `ark-` prefix for all classes
- ✅ Use CSS custom properties for colors
- ✅ Support dark mode via `[data-theme="dark"]`
- ✅ Include `:focus-visible` styles for keyboard navigation
- ✅ Respect `prefers-reduced-motion`
- ✅ Use Tailwind utilities where appropriate
- ❌ NO hardcoded colors (use CSS variables)
- ❌ NO inline styles in JSX (use className)
- ❌ NO !important (fix specificity instead)

---

## Validation & Type Safety

### Zod Schema Patterns

#### Basic Schema
```typescript
export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100),
    email: z.string().email(),
    age: z.number().int().min(18).max(120),
    role: z.enum(['admin', 'user', 'guest']).default('user'),
});
```

#### Schema Composition
```typescript
// Extend existing schema
export const AdminUserSchema = UserSchema.extend({
    permissions: z.array(z.string()),
    level: z.number().min(1).max(10),
});

// Pick subset of fields
export const UserCredentialsSchema = UserSchema.pick({
    email: true,
    password: true,
});

// Omit fields
export const PublicUserSchema = UserSchema.omit({
    password: true,
});
```

#### Refinement (Custom Validation)
```typescript
export const PasswordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
        (val) => /[A-Z]/.test(val),
        'Password must contain at least one uppercase letter'
    )
    .refine(
        (val) => /[0-9]/.test(val),
        'Password must contain at least one number'
    );
```

### Validation Utilities

**Location**: `src/Helpers/Validators/`

#### Using Master Validator
```typescript
import { validateInput, InputType, ValidationConfig } from '@/Helpers/Validators';

const config: ValidationConfig = {
    minLength: 3,
    maxLength: 50,
};

const result = validateInput(userInput, InputType.Text, config);

if (!result.isValid) {
    console.error(result.errorMessage);
} else {
    const normalizedValue = result.normalizedValue;
}
```

#### Domain-Specific Validators
```typescript
import { validateIban } from '@/Helpers/Validators/Finance/iban';
import { validateGln } from '@/Helpers/Validators/Logistics/gln';
import { validateEmail } from '@/Helpers/Validators/Common/email';

// Finance
const ibanResult = validateIban('DE89370400440532013000');

// Logistics
const glnResult = validateGln('4012345678906');

// Common
const emailResult = validateEmail('user@example.com');
```

### Type Guards

```typescript
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function isButtonModel(value: unknown): value is ButtonModel {
    return ButtonModelSchema.safeParse(value).success;
}

// Usage
if (isString(input)) {
    // TypeScript knows input is string
    console.log(input.toUpperCase());
}
```

---

## Accessibility Requirements

### ARIA Attributes

**All interactive components MUST include**:
```tsx
<button
    role="button"
    aria-label={ariaLabel || 'Default label'}
    aria-disabled={disabled}
    aria-busy={isLoading}
    aria-pressed={isPressed}
    aria-expanded={isExpanded}
    tabIndex={focusable ? 0 : -1}
>
```

### Keyboard Navigation

**Support standard keyboard interactions**:
- `Enter` / `Space` - Activate button/link
- `Escape` - Close modal/dropdown
- `Tab` / `Shift+Tab` - Navigate between focusable elements
- `Arrow keys` - Navigate lists/menus/carousels
- `Home` / `End` - Jump to start/end of list

```typescript
const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
        case 'Enter':
        case ' ':
            event.preventDefault();
            handleActivate();
            break;
        case 'Escape':
            event.preventDefault();
            handleClose();
            break;
        case 'ArrowDown':
            event.preventDefault();
            handleNext();
            break;
        case 'ArrowUp':
            event.preventDefault();
            handlePrevious();
            break;
    }
}, [handleActivate, handleClose, handleNext, handlePrevious]);
```

### Focus Management

```typescript
// Focus trap for modals
useEffect(() => {
    if (isOpen) {
        const previouslyFocused = document.activeElement as HTMLElement;
        modalRef.current?.focus();

        return () => {
            previouslyFocused?.focus();
        };
    }
}, [isOpen]);
```

### Screen Reader Support

- ✅ Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- ✅ Provide descriptive aria-label for icon-only buttons
- ✅ Use aria-live regions for dynamic content updates
- ✅ Include visually hidden text for context
- ❌ NO generic divs for interactive elements

```tsx
// Good
<button aria-label="Close modal">
    <CloseIcon aria-hidden="true" />
</button>

// Bad
<div onClick={handleClose}>
    <CloseIcon />
</div>
```

---

## Performance Optimization

### React Optimization Techniques

#### 1. Memoization
```typescript
// memo for components
export const ExpensiveComponent = memo((props: Props) => {
    // Only re-renders if props change
});

// useMemo for computed values
const sortedData = useMemo(() => {
    return data.sort((a, b) => a.value - b.value);
}, [data]);

// useCallback for stable function references
const handleClick = useCallback(() => {
    doSomething(id);
}, [id]);
```

#### 2. Lazy Loading
```typescript
// Code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <HeavyComponent />
        </Suspense>
    );
}
```

#### 3. Virtualization (For Long Lists)
```typescript
// Use react-window or react-virtual for long lists
import { FixedSizeList } from 'react-window';

function LongList({ items }) {
    return (
        <FixedSizeList
            height={600}
            itemCount={items.length}
            itemSize={50}
            width="100%"
        >
            {({ index, style }) => (
                <div style={style}>{items[index]}</div>
            )}
        </FixedSizeList>
    );
}
```

### Bundle Size Optimization

- ✅ Use tree-shakeable exports
- ✅ Import only what you need: `import { Button } from '@/components/Buttons'`
- ✅ Lazy load heavy dependencies (Three.js, mermaid)
- ❌ NO default exports (prefer named exports)
- ❌ NO barrel imports from large libraries

```typescript
// Good
import { Button } from '@/components/Buttons/Button';
import { formatDate } from '@/utils/date';

// Bad
import * as Components from '@/components'; // Imports everything
import moment from 'moment'; // Heavy library
```

### Rendering Performance

- ✅ Avoid inline function definitions in JSX
- ✅ Use key prop correctly in lists
- ✅ Debounce/throttle expensive operations
- ❌ NO unnecessary state updates
- ❌ NO object/array literals in dependency arrays

```typescript
// Good
const handleChange = useCallback((value: string) => {
    // Debounce expensive validation
    const timeoutId = setTimeout(() => {
        validateInput(value);
    }, 300);

    return () => clearTimeout(timeoutId);
}, [validateInput]);

// Bad
const handleChange = (value: string) => {
    // Runs on every keystroke
    validateInput(value);
};
```

---

## Negative Prompts (Anti-Patterns)

### ❌ DO NOT DO - TypeScript Anti-Patterns

```typescript
// ❌ Using any type
const data: any = fetchData();

// ✅ Use unknown and type guards
const data: unknown = fetchData();
if (isValidData(data)) {
    // Now data is typed
}

// ❌ Type assertion without validation
const element = document.querySelector('.btn') as HTMLButtonElement;

// ✅ Check before casting
const element = document.querySelector('.btn');
if (element instanceof HTMLButtonElement) {
    // Safe to use
}

// ❌ Optional chaining abuse
const value = user?.profile?.settings?.theme?.primaryColor;

// ✅ Validate structure first
if (user?.profile?.settings?.theme) {
    const { primaryColor } = user.profile.settings.theme;
}

// ❌ Non-null assertion without check
const userName = user!.name;

// ✅ Check for null/undefined
const userName = user?.name ?? 'Anonymous';
```

### ❌ DO NOT DO - React Anti-Patterns

```typescript
// ❌ Inline function definitions
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Use useCallback
const handleButtonClick = useCallback(() => handleClick(id), [id]);
<button onClick={handleButtonClick}>Click</button>

// ❌ Object/array literals in JSX
<Component style={{ margin: 10 }} items={[1, 2, 3]} />

// ✅ Define outside render or useMemo
const style = useMemo(() => ({ margin: 10 }), []);
const items = useMemo(() => [1, 2, 3], []);
<Component style={style} items={items} />

// ❌ Missing cleanup in useEffect
useEffect(() => {
    const interval = setInterval(updateData, 1000);
}, []);

// ✅ Return cleanup function
useEffect(() => {
    const interval = setInterval(updateData, 1000);
    return () => clearInterval(interval);
}, [updateData]);

// ❌ State derived from props without sync
function Component({ initialValue }) {
    const [value, setValue] = useState(initialValue);
    // Value won't update if initialValue changes!
}

// ✅ Use key or useEffect to sync
function Component({ initialValue }) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
}
```

### ❌ DO NOT DO - MVVM Anti-Patterns

```typescript
// ❌ Business logic in View
function Button({ onClick }) {
    const handleClick = (event) => {
        if (someCondition) {
            // Complex logic here
            validateData();
            transformData();
            sendToServer();
        }
        onClick(event);
    };

    return <button onClick={handleClick}>Click</button>;
}

// ✅ Business logic in ViewModel
function useButton(options) {
    const handleClick = useCallback(async (event) => {
        if (someCondition) {
            validateData();
            transformData();
            await sendToServer();
        }
        options.onClick?.(event);
    }, [options.onClick]);

    return { handleClick };
}

// ❌ React hooks in Model
export const ButtonModel = {
    value: '',
    useState() { // ❌ Hooks belong in ViewModel
        return useState(this.value);
    }
};

// ✅ Pure data in Model
export const ButtonModelSchema = z.object({
    value: z.string().default(''),
});
```

### ❌ DO NOT DO - Performance Anti-Patterns

```typescript
// ❌ Expensive computation in render
function Component({ data }) {
    const sortedData = data.sort((a, b) => a.value - b.value);
    // Runs on every render!
}

// ✅ Use useMemo
function Component({ data }) {
    const sortedData = useMemo(
        () => data.sort((a, b) => a.value - b.value),
        [data]
    );
}

// ❌ Creating new objects in dependency array
useEffect(() => {
    fetchData(config);
}, [{ url: '/api', method: 'GET' }]); // New object every render!

// ✅ Use stable references
const config = useMemo(() => ({ url: '/api', method: 'GET' }), []);
useEffect(() => {
    fetchData(config);
}, [config]);

// ❌ Not using memo for expensive components
function ExpensiveList({ items }) {
    return items.map(item => <ExpensiveItem key={item.id} item={item} />);
}

// ✅ Wrap in memo
const ExpensiveList = memo(({ items }) => {
    return items.map(item => <ExpensiveItem key={item.id} item={item} />);
});
```

### ❌ DO NOT DO - Validation Anti-Patterns

```typescript
// ❌ Manual validation without schema
function validateUser(user) {
    if (!user.email) return false;
    if (!user.email.includes('@')) return false;
    if (user.age < 18) return false;
    return true;
}

// ✅ Use Zod schema
const UserSchema = z.object({
    email: z.string().email(),
    age: z.number().min(18),
});

const result = UserSchema.safeParse(user);
if (!result.success) {
    console.error(result.error.errors);
}

// ❌ Throwing errors without context
if (!isValid) {
    throw new Error('Invalid'); // What's invalid?
}

// ✅ Provide context
if (!result.success) {
    throw new Error(`Validation failed: ${result.error.message}`);
}
```

### ❌ DO NOT DO - Styling Anti-Patterns

```typescript
// ❌ Inline styles
<div style={{ backgroundColor: '#3b82f6', padding: '10px' }}>

// ✅ Use CSS classes
<div className="ark-component">

// ❌ Hardcoded colors
.button {
    background: #3b82f6;
}

// ✅ CSS custom properties
.button {
    background: var(--ark-primary, #3b82f6);
}

// ❌ !important overuse
.button {
    color: red !important;
}

// ✅ Fix specificity
.ark-button.ark-button--primary {
    color: red;
}
```

---

## File Naming & Organization

### Naming Conventions

| File Type | Convention | Example |
|-----------|------------|---------|
| Component | PascalCase.tsx | `Button.tsx`, `DataGrid.tsx` |
| ViewModel | PascalCase.viewmodel.ts | `Button.viewmodel.ts` |
| Model | PascalCase.model.ts | `Button.model.ts` |
| Styles | PascalCase.scss | `Button.scss` |
| Tests | PascalCase.test.tsx | `Button.test.tsx` |
| Utilities | camelCase.ts | `formatDate.ts`, `validateEmail.ts` |
| Types | PascalCase.types.ts | `Common.types.ts` |
| Constants | SCREAMING_SNAKE_CASE.ts | `API_ENDPOINTS.ts` |

### Directory Structure

```
src/
├── components/                    # Component library
│   ├── Buttons/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.viewmodel.ts
│   │   │   ├── Button.model.ts
│   │   │   ├── Button.scss
│   │   │   └── index.ts
│   │   ├── NeonButton/
│   │   └── index.ts
│   ├── Input/
│   ├── Grids/
│   └── ...
│
├── core/                          # Core infrastructure
│   ├── base/
│   │   ├── BaseComponentModel.ts
│   │   ├── BaseViewModel.ts
│   │   └── FormInputModel.ts
│   ├── constants/
│   ├── events/
│   └── validation/
│
├── Helpers/                       # Utility functions
│   ├── Validators/
│   │   ├── Common/
│   │   ├── Finance/
│   │   └── Logistics/
│   ├── Math/
│   ├── Storage/
│   └── seo/
│
├── Enums/                         # Enums and constants
│   ├── Size.ts
│   ├── Variant.ts
│   └── Status.ts
│
├── styles/                        # Global styles
│   ├── variables.scss
│   ├── mixins.scss
│   └── themes.scss
│
├── index.ts                       # Library exports
└── index.css                      # Global CSS
```

---

## Git & Version Control

### Branch Strategy

- **`master`** / **`main`**: Production-ready code, protected
- **`develop`**: Integration branch for next release, protected
- **`feature/*`**: Feature branches (PR into `develop`)
- **`fix/*`**: Bug fix branches (PR into `develop` or `master` for hotfixes)

### Commit Message Format

Follow **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feature/fix)
- `test`: Adding/updating tests
- `chore`: Build process, dependencies, tooling

**Examples**:
```
feat(button): add neon variant with glow effect

Added new neon variant to Button component with customizable
glow color and intensity. Includes dark mode support.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

```
fix(input): prevent paste sanitization on numeric fields

Fixed bug where numeric inputs were stripping valid decimal
separators during paste operations. Added test coverage.

Closes #123
```

### Pull Request Requirements

- ✅ All tests passing (100% coverage maintained)
- ✅ Zero TypeScript errors
- ✅ ESLint passing with no warnings
- ✅ Components added to Showcase registry
- ✅ JSDoc documentation complete
- ✅ CHANGELOG.md updated
- ✅ Approved by repository owner

---

## Component Checklist

Before submitting a new component, ensure ALL items are checked:

### Model Layer
- [ ] Zod schema defined extending `BaseModelSchema`
- [ ] TypeScript type inferred via `z.infer<>`
- [ ] Default model instance exported
- [ ] Factory function `createComponentModel()` provided
- [ ] JSDoc for all exports
- [ ] No business logic in model

### ViewModel Layer
- [ ] Custom hook `useComponent()` defined
- [ ] Extends `useBaseViewModel`
- [ ] Options interface extends `Partial<Model>`
- [ ] Result interface extends `BaseViewModelResult`
- [ ] Event handlers use `useCallback`
- [ ] Computed properties use `useMemo`
- [ ] Async operations use `base.executeAsync()`
- [ ] JSDoc with `@example` block
- [ ] No JSX or rendering logic

### View Layer
- [ ] Component wrapped in `memo()`
- [ ] Uses `forwardRef()` for ref support
- [ ] Calls ViewModel hook
- [ ] Spreads ViewModel handlers
- [ ] `displayName` set
- [ ] `aria-*` attributes included
- [ ] `data-testid` attribute included
- [ ] Minimal business logic
- [ ] JSDoc with usage example

### Styling
- [ ] SCSS file created (or uses global styles)
- [ ] Uses `ark-` prefix for classes
- [ ] CSS custom properties for colors
- [ ] Dark mode support via `[data-theme="dark"]`
- [ ] `:focus-visible` styles included
- [ ] `prefers-reduced-motion` respected
- [ ] BEM naming convention followed

### Testing
- [ ] Test file created in Tests project
- [ ] Schema validation tests
- [ ] Rendering tests
- [ ] Interaction tests
- [ ] Accessibility tests
- [ ] Edge case tests
- [ ] 100% code coverage

### Documentation
- [ ] JSDoc for all exported items
- [ ] File headers with `@fileoverview`
- [ ] Usage examples in JSDoc
- [ ] Component added to Showcase registry
- [ ] README.md updated (if major feature)

### Code Quality
- [ ] Zero TypeScript errors
- [ ] ESLint passing
- [ ] No `any` types
- [ ] No `@ts-ignore` without explanation
- [ ] Proper error handling
- [ ] Performance optimizations applied

### Accessibility
- [ ] Keyboard navigation supported
- [ ] ARIA attributes included
- [ ] Focus management implemented
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG 2.1 AA

### Git & Version Control
- [ ] Feature branch from `develop`
- [ ] Conventional commit messages
- [ ] PR description complete
- [ ] CHANGELOG.md updated
- [ ] Version bumped (if applicable)

---

## Summary

This document defines the architectural standards, technologies, code quality expectations, and development practices for the **Ark.Alliance.React.Component.UI** library. All contributors and AI agents must adhere to these guidelines to maintain consistency, quality, and enterprise-grade standards.

**Key Takeaways**:
1. **Strict MVVM**: Model (Zod schema), ViewModel (hook), View (component)
2. **Type Safety**: TypeScript strict mode + Zod validation = zero runtime type errors
3. **Performance**: memo, useCallback, useMemo, lazy loading
4. **Accessibility**: ARIA, keyboard navigation, screen reader support
5. **Testing**: 100% coverage with Vitest + React Testing Library
6. **Documentation**: Comprehensive JSDoc with examples
7. **Consistency**: Follow patterns established in existing components

**Questions?** Refer to existing components (Button, BaseInput, Carousel) as reference implementations.

---

**Version:** 1.5.0
**Maintained By:** Armand Richelet-Kleinberg
**Last Updated:** 2026-01-26
