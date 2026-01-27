# Gemini 3 Pro - Component Creation Prompt System

> **Version:** 1.0.0
> **Target:** Gemini 3 Pro High
> **Purpose:** Systematic conversion of complex React applications into MVVM-based component library architecture
> **Library:** Ark.Alliance.React.Component.UI v1.5.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Analysis & Architecture](#phase-1-analysis--architecture)
4. [Phase 2: Base Component Identification](#phase-2-base-component-identification)
5. [Phase 3: Primitive Component Creation](#phase-3-primitive-component-creation)
6. [Phase 4: Business Component Creation](#phase-4-business-component-creation)
7. [Phase 5: Testing & Validation](#phase-5-testing--validation)
8. [Phase 6: Integration & Documentation](#phase-6-integration--documentation)
9. [Iterative Refinement Process](#iterative-refinement-process)
10. [Quality Checklist](#quality-checklist)

---

## Overview

### Mission Statement

You are **Gemini 3 Pro**, an expert AI architect specializing in converting complex React applications into enterprise-grade, MVVM-based component libraries. Your mission is to systematically analyze, decompose, and reconstruct applications following the **Ark.Alliance.React.Component.UI** architectural standards.

### Core Principles

1. **Separation of Concerns**: Strict MVVM pattern (Model/ViewModel/View)
2. **Reusability First**: Create generic primitives before specialized components
3. **Composition Over Duplication**: Leverage existing base components
4. **Type Safety**: Zod schemas + TypeScript strict mode
5. **Testability**: 100% test coverage with Vitest
6. **Accessibility**: WCAG 2.1 AA compliance
7. **Performance**: memo, useCallback, useMemo optimization
8. **Documentation**: Comprehensive JSDoc with examples

### Input Specification

You will receive:
- **Source Application Path**: Path to existing React application
- **Library Path**: Path to Ark.Alliance.React.Component.UI library
- **Agents.md**: Architectural guidelines document
- **Target Components**: List of components to extract/create

### Output Specification

You will produce:
- **Analysis Report**: Component decomposition and architecture decisions
- **Component Files**: Model (.model.ts), ViewModel (.viewmodel.ts), View (.tsx), Styles (.scss)
- **Test Files**: Comprehensive test suites (.test.tsx)
- **Documentation**: Usage examples and integration guides
- **Migration Guide**: Step-by-step conversion instructions

---

## Prerequisites

### Required Knowledge

Before starting, ensure you have read and understood:

1. **Agents.md** - Complete architectural guidelines
2. **Existing Base Components**:
   - `BaseComponentModel` (src/core/base/BaseComponentModel.ts)
   - `BaseViewModel` (src/core/base/BaseViewModel.ts)
   - `FormInputModel` (src/core/base/FormInputModel.ts)
3. **Existing Primitives**:
   - Input components (Input, Select, TextArea, Slider, NumericInput)
   - Button components (Button, NeonButton)
   - Container components (Panel, GenericPanel, GlowCard)
   - Layout components (Header, Footer, SideBar)
4. **Testing Patterns** (Ark.Alliance.React.Component.UI.Tests/)
5. **Validation System** (src/Helpers/Validators/)

### Environment Setup

```bash
# Verify library structure
cd Ark.Alliance.React.Component.UI
npm install
npm test

# Verify source application
cd ../ProjectToCreateComponentsExamples/[source-app]
npm install
npm run dev
```

---

## Phase 1: Analysis & Architecture

### Objective
Analyze the source application and create a comprehensive decomposition plan.

### Prompt Template

```
# PHASE 1: ANALYSIS & ARCHITECTURE

## Context
I am analyzing the application at: [SOURCE_APP_PATH]
Target library: Ark.Alliance.React.Component.UI v1.5.0

## Instructions

### Step 1.1: Application Structure Analysis
Analyze the source application and provide:

1. **Component Inventory**:
   - List all components found in the source application
   - Identify component hierarchy and dependencies
   - Map components to their responsibilities

2. **Data Structure Analysis**:
   - Extract all TypeScript interfaces and types
   - Identify shared data models
   - Map data flows between components

3. **Business Logic Identification**:
   - Identify reusable business logic
   - Separate presentation logic from business logic
   - Map state management patterns

4. **Styling Patterns**:
   - Identify CSS/SCSS patterns
   - Map color schemes and design tokens
   - Identify reusable style mixins

### Step 1.2: Component Categorization
Categorize each component into:

**A. PRIMITIVE Components** (Generic, Reusable)
- Pure UI components with no business logic
- Highly configurable through props
- Can be used in multiple contexts
- Examples: ShapeRenderer, ConnectionLine, ToolbarItem

**B. BASE Components** (Foundational)
- Extend existing library base components
- Provide common patterns for domain
- Examples: DiagramNode, DiagramEdge, CanvasContainer

**C. BUSINESS Components** (Domain-Specific)
- Implement specific business requirements
- Compose primitives and base components
- Examples: MermaidDiagram, PropertiesPanel, AIChat

### Step 1.3: Dependency Mapping
Create a dependency graph:
```
BusinessComponent
  └─> BaseComponent (extends existing GenericPanel)
      └─> Primitive1 (new ShapeRenderer)
      └─> Primitive2 (uses existing Button)
      └─> Primitive3 (new ConnectionLine)
```

### Step 1.4: Architecture Decision Document
For each component to be created, document:

1. **Component Name**: Follows PascalCase naming
2. **Category**: Primitive, Base, or Business
3. **Purpose**: One-sentence description
4. **Base Class**: Which existing component it extends (if any)
5. **Dependencies**: Required primitives and utilities
6. **Model Properties**: List of Zod schema fields
7. **ViewModel Logic**: State management and handlers
8. **View Complexity**: Simple, Medium, or Complex
9. **Folder Location**: Target folder in library
10. **Reusability Score**: 1-10 (10 = highly reusable)

### Expected Output Format

Provide output as:

```markdown
# Component Analysis Report

## Application Overview
- **Name**: [Application Name]
- **Components Found**: [Count]
- **Complexity**: Low | Medium | High
- **Estimated Effort**: [Hours]

## Component Inventory

### PRIMITIVE Components (Reusability Score: 8-10)
| Component Name | Purpose | Extends | Dependencies | Folder |
|----------------|---------|---------|--------------|--------|
| ShapeRenderer | Renders SVG shapes | BaseComponentModel | None | components/Diagram/Primitives/ShapeRenderer |
| ConnectionLine | Draws lines between nodes | BaseComponentModel | None | components/Diagram/Primitives/ConnectionLine |

### BASE Components (Reusability Score: 5-7)
| Component Name | Purpose | Extends | Dependencies | Folder |
|----------------|---------|---------|--------------|--------|
| DiagramNode | Container for diagram nodes | GenericPanel | ShapeRenderer | components/Diagram/DiagramNode |

### BUSINESS Components (Reusability Score: 1-4)
| Component Name | Purpose | Extends | Dependencies | Folder |
|----------------|---------|---------|--------------|--------|
| MermaidDiagram | Full diagram editor | BaseComponentModel | DiagramNode, ConnectionLine, Toolbar | components/Diagram/MermaidDiagram |

## Dependency Graph
[ASCII diagram showing dependencies]

## Data Models
[List of interfaces to be converted to Zod schemas]

## Architecture Decisions
[Key decisions and rationale]

## Risks & Challenges
[Identified technical challenges]

## Recommended Implementation Order
1. Phase 2.1: Create ShapeRenderer primitive
2. Phase 2.2: Create ConnectionLine primitive
3. Phase 3.1: Create DiagramNode base component
4. Phase 4.1: Create MermaidDiagram business component
```
```

### Success Criteria

- ✅ All components identified and categorized
- ✅ Dependency graph is acyclic
- ✅ Reusability scores justify component hierarchy
- ✅ Folder locations follow library conventions
- ✅ No circular dependencies
- ✅ Clear implementation order defined

---

## Phase 2: Base Component Identification

### Objective
Identify which existing library base components can be extended or enhanced.

### Prompt Template

```
# PHASE 2: BASE COMPONENT IDENTIFICATION

## Context
Based on Phase 1 analysis, identify base component requirements.

## Instructions

### Step 2.1: Library Base Component Audit
For each component category from Phase 1, evaluate existing base components:

**Available Base Components**:
- `BaseComponentModel` - Universal base model
- `FormInputModel` - Form input base model
- `BaseViewModel` - Lifecycle and state management
- `GenericPanel` - Universal container with glassmorphism
- `GlowCard` - Status-based card component
- `Modal` - Dialog system with portal
- `Panel` - Container with header/footer slots
- `Header` - Top navigation
- `Footer` - Bottom controls
- `SideBar` - Side navigation
- `DataGrid` - Table component
- Input primitives (Input, Select, TextArea, Slider, NumericInput, FileUpload)
- Button primitives (Button, NeonButton)

### Step 2.2: Extension vs Creation Decision
For each component, decide:

**EXTEND if**:
- Component shares 60%+ of base component functionality
- Customization can be achieved through props and slots
- Styling can be achieved through CSS classes
- Business logic can be added without modifying base

**CREATE NEW if**:
- Component has unique rendering requirements
- Base component constraints are too restrictive
- Performance optimization requires custom implementation
- Component introduces new interaction patterns

### Step 2.3: Enhancement Identification
Identify base component enhancements needed:

1. **New Props**: What props need to be added to base models?
2. **New Slots**: What content slots are needed?
3. **New Variants**: What visual variants should be added?
4. **New Interactions**: What interaction patterns are new?

### Expected Output Format

```markdown
# Base Component Identification Report

## Existing Component Usage

### Can EXTEND Existing Components

| Target Component | Extends | Reason | New Props Needed |
|------------------|---------|--------|------------------|
| DiagramNode | GenericPanel | Container with header/footer, glassmorphism, grid overlay | shape: ShapeType, connectors: ConnectorConfig[] |
| Toolbar | SideBar | Vertical navigation with categories | categoryGroups: ToolCategory[] |
| PropertiesPanel | GenericPanel | Scrollable panel with form sections | sections: PanelSection[] |

### Must CREATE New Components

| Component | Reason | Complexity |
|-----------|--------|------------|
| ShapeRenderer | Unique SVG rendering logic, no suitable base | Medium |
| ConnectionLine | Custom line drawing with Bezier curves | Medium |
| CanvasContainer | Specialized pan/zoom/selection logic | High |

## Required Base Component Enhancements

### GenericPanel Enhancements
**Current Props**: title, subtitle, headerSlot, footerSlot, glassmorphism, gradient, gridOverlay
**New Props Needed**:
- `resizable: boolean` - Enable resize handles
- `minWidth/minHeight: number` - Size constraints
- `onResize: (width, height) => void` - Resize callback

**Implementation Strategy**: Add new properties to GenericPanelModelSchema, implement resize handles in GenericPanel.tsx

### SideBar Enhancements
**Current Props**: items, activeItem, orientation, collapsed
**New Props Needed**:
- `categoryGroups: CategoryGroup[]` - Nested grouping
- `draggableItems: boolean` - Enable drag-and-drop
- `itemTemplate: (item) => ReactNode` - Custom rendering

**Implementation Strategy**: Extend SideBarModelSchema, add drag handlers to SideBar.viewmodel.ts

## Primitive Creation Plan

### Priority 1: Critical Primitives
| Primitive | Purpose | Estimated Lines | Dependencies |
|-----------|---------|-----------------|--------------|
| ShapeRenderer | Render SVG shapes | 300 | BaseComponentModel, Zod |
| ConnectionLine | Draw connections | 250 | BaseComponentModel, Zod |

### Priority 2: Supporting Primitives
| Primitive | Purpose | Estimated Lines | Dependencies |
|-----------|---------|-----------------|--------------|
| Handle | Connection point | 100 | BaseComponentModel |
| ResizeHandle | Corner resize | 80 | BaseComponentModel |

## Risk Assessment
[Identify risks with extending vs creating new]
```
```

### Success Criteria

- ✅ Clear decision matrix for extend vs create
- ✅ All necessary enhancements documented
- ✅ Implementation strategy defined for enhancements
- ✅ Priority order established
- ✅ Estimated effort calculated

---

## Phase 3: Primitive Component Creation

### Objective
Create highly reusable primitive components with no business logic.

### Prompt Template

```
# PHASE 3: PRIMITIVE COMPONENT CREATION

## Context
Creating primitive component: [COMPONENT_NAME]
Category: Primitive (Reusability Score: [8-10])

## Instructions

### Step 3.1: Model Definition
Create [ComponentName].model.ts following MVVM pattern:

**Requirements**:
1. Extend `BaseModelSchema` using `extendSchema()`
2. Define Zod schema with all properties
3. Use Zod enums for constrained values
4. Include sensible defaults
5. Export TypeScript type via `z.infer<>`
6. Export default model instance
7. Export factory function
8. Add comprehensive JSDoc

**Template**:
```typescript
/**
 * @fileoverview [ComponentName] Model
 * @module components/[Category]/[ComponentName]/[ComponentName].model
 *
 * Primitive component for [purpose]. Highly reusable with no business logic.
 *
 * @example
 * ```typescript
 * const model = create[ComponentName]Model({
 *   prop1: 'value',
 *   prop2: 123,
 * });
 * ```
 */

import { z } from 'zod';
import { extendSchema } from '@/core/base/BaseComponentModel';

// Enums for type safety
export const [ComponentName]Variant = z.enum(['variant1', 'variant2', 'variant3']);
export const [ComponentName]Size = z.enum(['sm', 'md', 'lg']);

/**
 * [ComponentName] Model Schema
 *
 * Defines the data structure for [ComponentName] primitive.
 * Extends BaseModelSchema with component-specific properties.
 */
export const [ComponentName]ModelSchema = extendSchema({
    variant: [ComponentName]Variant.default('variant1'),
    size: [ComponentName]Size.default('md'),

    // Component-specific props
    prop1: z.string().default(''),
    prop2: z.number().min(0).default(0),
    prop3: z.boolean().default(false),

    // Optional complex props
    complexProp: z.object({
        nested: z.string(),
        value: z.number(),
    }).optional(),
});

/**
 * [ComponentName] Model Type
 */
export type [ComponentName]Model = z.infer<typeof [ComponentName]ModelSchema>;

/**
 * Default [ComponentName] model instance
 */
export const default[ComponentName]Model: [ComponentName]Model = [ComponentName]ModelSchema.parse({});

/**
 * Factory function for creating validated [ComponentName] models
 *
 * @param data - Partial model data
 * @returns Validated [ComponentName] model
 *
 * @example
 * ```typescript
 * const model = create[ComponentName]Model({
 *   variant: 'variant2',
 *   size: 'lg',
 *   prop1: 'custom value',
 * });
 * ```
 */
export function create[ComponentName]Model(
    data: Partial<[ComponentName]Model>
): [ComponentName]Model {
    return [ComponentName]ModelSchema.parse({ ...default[ComponentName]Model, ...data });
}
```

### Step 3.2: ViewModel Implementation
Create [ComponentName].viewmodel.ts:

**Requirements**:
1. Extend `useBaseViewModel`
2. Define Options interface
3. Define Result interface
4. Use `useMemo` for model parsing
5. Use `useCallback` for handlers
6. Use `useMemo` for computed properties
7. Handle async operations via `base.executeAsync()`
8. Add comprehensive JSDoc with @example

**Template**:
```typescript
/**
 * @fileoverview [ComponentName] ViewModel
 * @module components/[Category]/[ComponentName]/[ComponentName].viewmodel
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useBaseViewModel, BaseViewModelResult } from '@/core/base/BaseViewModel';
import {
    [ComponentName]Model,
    [ComponentName]ModelSchema,
    default[ComponentName]Model,
} from './[ComponentName].model';

/**
 * Options for use[ComponentName] hook
 */
export interface Use[ComponentName]Options extends Partial<[ComponentName]Model> {
    /** Handler for [event] */
    on[Event]?: (data: EventData) => void | Promise<void>;
}

/**
 * Return type of use[ComponentName] hook
 */
export interface Use[ComponentName]Result extends BaseViewModelResult<[ComponentName]Model> {
    /** Handler for [event] */
    handle[Event]: (args: Args) => void;

    /** Computed CSS classes */
    componentClasses: string;

    /** Whether component is in [state] */
    is[State]: boolean;
}

/**
 * [ComponentName] ViewModel Hook
 *
 * Manages state and logic for [ComponentName] primitive component.
 * Pure presentation logic with no business rules.
 *
 * @param options - Component configuration
 * @returns ViewModel result
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const vm = use[ComponentName]({
 *     variant: 'variant2',
 *     on[Event]: (data) => console.log(data),
 *   });
 *
 *   return (
 *     <div className={vm.componentClasses}>
 *       {vm.is[State] ? 'Active' : 'Inactive'}
 *     </div>
 *   );
 * }
 * ```
 */
export function use[ComponentName](
    options: Use[ComponentName]Options = {}
): Use[ComponentName]Result {
    // Parse and memoize model
    const modelOptions = useMemo(() => {
        const { on[Event], ...modelData } = options;
        return [ComponentName]ModelSchema.parse({
            ...default[ComponentName]Model,
            ...modelData
        });
    }, [JSON.stringify(options)]);

    // Initialize base ViewModel
    const base = useBaseViewModel<[ComponentName]Model>(modelOptions, {
        model: modelOptions,
        eventChannel: '[componentName]',
    });

    // Local state (if needed)
    const [localState, setLocalState] = useState<StateType>(initialValue);

    // Event handlers
    const handle[Event] = useCallback(
        async (args: Args) => {
            if (base.model.disabled || base.state.isLoading) return;

            // Emit event
            base.emit('[event]', { id: base.model.id, ...args });

            // Call external handler
            if (options.on[Event]) {
                const result = options.on[Event](args);
                if (result instanceof Promise) {
                    await base.executeAsync(() => result);
                }
            }

            // Update local state
            setLocalState(newState);
        },
        [base, options.on[Event], localState]
    );

    // Computed properties
    const is[State] = useMemo(() => {
        return /* condition */;
    }, [base.model.prop1, localState]);

    const componentClasses = useMemo(() => {
        const classes = [
            'ark-[component-name]',
            `ark-[component-name]--${base.model.variant}`,
            `ark-[component-name]--${base.model.size}`,
        ];

        if (base.model.disabled) classes.push('ark-[component-name]--disabled');
        if (base.state.isLoading) classes.push('ark-[component-name]--loading');
        if (is[State]) classes.push('ark-[component-name]--[state]');

        return classes.join(' ');
    }, [base.model, base.state.isLoading, is[State]]);

    // Side effects
    useEffect(() => {
        // Setup logic
        const cleanup = () => {
            // Cleanup logic
        };
        return cleanup;
    }, [dependencies]);

    return {
        ...base,
        handle[Event],
        componentClasses,
        is[State],
    };
}
```

### Step 3.3: View Implementation
Create [ComponentName].tsx:

**Requirements**:
1. Wrap in `memo()` and `forwardRef()`
2. Call ViewModel hook
3. Spread handlers from ViewModel
4. Set `displayName`
5. Include ARIA attributes
6. Include `data-testid`
7. Minimal rendering logic
8. Add JSDoc with usage example

**Template**:
```typescript
/**
 * @fileoverview [ComponentName] View
 * @module components/[Category]/[ComponentName]/[ComponentName]
 */

import React, { memo, forwardRef } from 'react';
import { use[ComponentName], Use[ComponentName]Options } from './[ComponentName].viewmodel';
import './[ComponentName].scss';

/**
 * [ComponentName] Props
 */
export interface [ComponentName]Props extends Use[ComponentName]Options {
    /** Component children */
    children?: React.ReactNode;
    /** Additional CSS class name */
    className?: string;
}

/**
 * [ComponentName] Primitive Component
 *
 * Highly reusable primitive for [purpose].
 * No business logic - pure presentation.
 *
 * @example
 * ```tsx
 * <[ComponentName]
 *   variant="variant2"
 *   size="lg"
 *   on[Event]={(data) => console.log(data)}
 * >
 *   Content
 * </[ComponentName]>
 * ```
 */
export const [ComponentName] = memo(
    forwardRef<HTMLDivElement, [ComponentName]Props>(function [ComponentName](
        { children, className, ...options },
        ref
    ) {
        const vm = use[ComponentName](options);

        return (
            <div
                ref={ref}
                className={`${vm.componentClasses} ${className || ''}`.trim()}
                role={vm.model.clickable ? 'button' : undefined}
                tabIndex={vm.model.focusable ? 0 : undefined}
                aria-disabled={base.model.disabled || base.state.isLoading}
                aria-busy={vm.state.isLoading}
                aria-label={vm.model.ariaLabel}
                data-testid={vm.model.testId || 'ark-[component-name]'}
                onClick={vm.handle[Event]}
            >
                {vm.state.isLoading ? (
                    <div className="ark-[component-name]__loading">
                        Loading...
                    </div>
                ) : (
                    <>
                        {/* Render component content */}
                        {children}
                    </>
                )}
            </div>
        );
    })
);

[ComponentName].displayName = '[ComponentName]';
```

### Step 3.4: Styling
Create [ComponentName].scss:

**Requirements**:
1. Use `ark-[component-name]` prefix
2. Use CSS custom properties for theming
3. Support dark mode via `[data-theme="dark"]`
4. Include `:focus-visible` styles
5. Respect `prefers-reduced-motion`
6. Use BEM naming for elements/modifiers

**Template**:
```scss
/**
 * [ComponentName] Styles
 * @module components/[Category]/[ComponentName]
 */

@use 'sass:map';
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

// Base component
.ark-[component-name] {
    // Layout
    display: flex;
    position: relative;

    // Colors using CSS custom properties
    color: var(--ark-text-primary, #111827);
    background: var(--ark-bg-primary, #ffffff);
    border: 1px solid var(--ark-border-default, #e5e7eb);

    // Spacing
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;

    // Typography
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;

    // Transitions
    transition: all 0.2s ease-in-out;

    // States
    &:hover:not(.ark-[component-name]--disabled) {
        background: var(--ark-bg-secondary, #f3f4f6);
        border-color: var(--ark-border-hover, #d1d5db);
    }

    &:focus-visible {
        outline: 2px solid var(--ark-primary, #3b82f6);
        outline-offset: 2px;
    }

    &.ark-[component-name]--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }

    &.ark-[component-name]--loading {
        opacity: 0.7;
        pointer-events: none;
    }
}

// Variants
$variants: (
    'variant1': (
        'bg': var(--ark-primary, #3b82f6),
        'text': var(--ark-text-on-primary, #ffffff),
        'border': var(--ark-primary-dark, #2563eb),
    ),
    'variant2': (
        'bg': var(--ark-secondary, #6b7280),
        'text': var(--ark-text-on-secondary, #ffffff),
        'border': var(--ark-secondary-dark, #4b5563),
    ),
);

@each $name, $config in $variants {
    .ark-[component-name]--#{$name} {
        background: map.get($config, 'bg');
        color: map.get($config, 'text');
        border-color: map.get($config, 'border');
    }
}

// Sizes
.ark-[component-name] {
    &--sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        min-height: 1.5rem;
    }

    &--md {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        min-height: 2.5rem;
    }

    &--lg {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        min-height: 3rem;
    }
}

// Elements
.ark-[component-name]__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ark-text-secondary, #6b7280);
}

// Dark mode
[data-theme="dark"],
.dark {
    .ark-[component-name] {
        color: var(--ark-text-primary, #f9fafb);
        background: var(--ark-bg-primary, #111827);
        border-color: var(--ark-border-default, #374151);

        &:hover:not(.ark-[component-name]--disabled) {
            background: var(--ark-bg-secondary, #1f2937);
            border-color: var(--ark-border-hover, #4b5563);
        }
    }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
    .ark-[component-name] {
        transition: none;
        animation: none;
    }
}
```

### Step 3.5: Index File
Create index.ts:

```typescript
/**
 * @fileoverview [ComponentName] Public Exports
 * @module components/[Category]/[ComponentName]
 */

export { [ComponentName] } from './[ComponentName]';
export type { [ComponentName]Props } from './[ComponentName]';

export { use[ComponentName] } from './[ComponentName].viewmodel';
export type {
    Use[ComponentName]Options,
    Use[ComponentName]Result
} from './[ComponentName].viewmodel';

export {
    [ComponentName]ModelSchema,
    default[ComponentName]Model,
    create[ComponentName]Model,
    [ComponentName]Variant,
    [ComponentName]Size,
} from './[ComponentName].model';
export type { [ComponentName]Model } from './[ComponentName].model';
```

### Success Criteria

- ✅ All files follow MVVM pattern strictly
- ✅ Model has Zod schema with defaults
- ✅ ViewModel extends useBaseViewModel
- ✅ View uses memo + forwardRef
- ✅ Styles use CSS custom properties
- ✅ Dark mode supported
- ✅ Accessibility attributes included
- ✅ Comprehensive JSDoc with examples
- ✅ No TypeScript errors (strict mode)
- ✅ No business logic in primitive
```

---

## Phase 4: Business Component Creation

### Objective
Create domain-specific business components by composing primitives and base components.

### Prompt Template

```
# PHASE 4: BUSINESS COMPONENT CREATION

## Context
Creating business component: [COMPONENT_NAME]
Category: Business (Reusability Score: [1-4])
Composes: [List of primitives and base components]

## Instructions

### Step 4.1: Business Requirements Analysis
Document business requirements:

1. **User Stories**:
   - As a [user type], I want to [action], so that [benefit]

2. **Business Rules**:
   - Rule 1: [Description]
   - Rule 2: [Description]

3. **Data Flow**:
   - Input: [Data sources]
   - Processing: [Business logic]
   - Output: [Results]

4. **Integration Points**:
   - APIs: [List]
   - Services: [List]
   - External libraries: [List]

### Step 4.2: Component Composition Strategy
Plan how primitives and base components will be composed:

**Example**:
```tsx
<MermaidDiagram>
  <DiagramCanvas>
    {nodes.map(node => (
      <DiagramNode key={node.id}>
        <ShapeRenderer shape={node.shape} />
        <Handle position="top" />
        <Handle position="right" />
        <Handle position="bottom" />
        <Handle position="left" />
      </DiagramNode>
    ))}

    {edges.map(edge => (
      <ConnectionLine
        key={edge.id}
        source={edge.source}
        target={edge.target}
      />
    ))}
  </DiagramCanvas>

  <Toolbar items={tools} />
  <PropertiesPanel selectedNode={selected} />
</MermaidDiagram>
```

### Step 4.3: Model Definition
Create business component model extending base/primitive models:

```typescript
/**
 * @fileoverview [ComponentName] Business Model
 * @module components/[Category]/[ComponentName]/[ComponentName].model
 *
 * Business component for [domain-specific purpose].
 * Implements [business rules].
 */

import { z } from 'zod';
import { extendSchema } from '@/core/base/BaseComponentModel';
import { PrimitiveModel } from '@/components/[Category]/Primitive';

// Business-specific enums
export const [BusinessEnum] = z.enum(['value1', 'value2']);

/**
 * [ComponentName] Business Model Schema
 */
export const [ComponentName]ModelSchema = extendSchema({
    // Compose primitive models
    primitiveConfig: PrimitiveModel.optional(),

    // Business-specific properties
    businessProp1: z.string().default(''),
    businessProp2: z.number().default(0),
    businessRule: [BusinessEnum].default('value1'),

    // Complex business data
    dataCollection: z.array(z.object({
        id: z.string(),
        value: z.unknown(),
    })).default([]),

    // Configuration
    config: z.object({
        enableFeature1: z.boolean().default(true),
        enableFeature2: z.boolean().default(false),
    }).default({}),
});

export type [ComponentName]Model = z.infer<typeof [ComponentName]ModelSchema>;
export const default[ComponentName]Model: [ComponentName]Model =
    [ComponentName]ModelSchema.parse({});

export function create[ComponentName]Model(
    data: Partial<[ComponentName]Model>
): [ComponentName]Model {
    return [ComponentName]ModelSchema.parse({
        ...default[ComponentName]Model,
        ...data
    });
}
```

### Step 4.4: Business ViewModel
Create ViewModel with business logic:

```typescript
/**
 * @fileoverview [ComponentName] Business ViewModel
 * @module components/[Category]/[ComponentName]/[ComponentName].viewmodel
 */

import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useBaseViewModel, BaseViewModelResult } from '@/core/base/BaseViewModel';
import { usePrimitive } from '@/components/[Category]/Primitive';
import { [ComponentName]Model, [ComponentName]ModelSchema } from './[ComponentName].model';

// Import business services
import { BusinessService } from '@/services/BusinessService';
import { ValidationService } from '@/Helpers/Validators';

export interface Use[ComponentName]Options extends Partial<[ComponentName]Model> {
    // Business callbacks
    onBusinessEvent?: (data: BusinessData) => void | Promise<void>;
    onValidationError?: (errors: ValidationError[]) => void;
    onDataChange?: (data: DataCollection) => void;
}

export interface Use[ComponentName]Result extends BaseViewModelResult<[ComponentName]Model> {
    // Primitive ViewModels
    primitiveVM: UsePrimitiveResult;

    // Business handlers
    handleBusinessAction: () => Promise<void>;
    validateBusinessRules: () => ValidationResult;
    processBusinessData: (data: RawData) => ProcessedData;

    // Business state
    isBusinessRuleValid: boolean;
    businessMetrics: BusinessMetrics;

    // Computed properties
    filteredData: DataItem[];
    aggregatedStats: AggregatedStats;
}

/**
 * [ComponentName] Business ViewModel
 *
 * Implements business logic for [domain].
 * Composes primitive ViewModels and adds business rules.
 */
export function use[ComponentName](
    options: Use[ComponentName]Options = {}
): Use[ComponentName]Result {
    // Parse model
    const modelOptions = useMemo(() => {
        const { onBusinessEvent, onValidationError, onDataChange, ...modelData } = options;
        return [ComponentName]ModelSchema.parse({ ...default[ComponentName]Model, ...modelData });
    }, [JSON.stringify(options)]);

    // Initialize base ViewModel
    const base = useBaseViewModel<[ComponentName]Model>(modelOptions, {
        model: modelOptions,
        eventChannel: '[componentName]',
    });

    // Compose primitive ViewModels
    const primitiveVM = usePrimitive({
        variant: base.model.primitiveConfig?.variant,
        size: base.model.primitiveConfig?.size,
    });

    // Business state
    const [businessState, setBusinessState] = useState<BusinessState>({
        isProcessing: false,
        lastProcessedAt: null,
        metrics: { count: 0, total: 0 },
    });

    // Services
    const businessService = useRef(new BusinessService());
    const validationService = useRef(new ValidationService());

    // Business logic: Validate business rules
    const validateBusinessRules = useCallback((): ValidationResult => {
        const errors: ValidationError[] = [];

        // Rule 1: Check data integrity
        if (base.model.dataCollection.length === 0) {
            errors.push({
                field: 'dataCollection',
                message: 'Data collection cannot be empty',
            });
        }

        // Rule 2: Validate configuration
        if (!base.model.config.enableFeature1 && !base.model.config.enableFeature2) {
            errors.push({
                field: 'config',
                message: 'At least one feature must be enabled',
            });
        }

        const isValid = errors.length === 0;

        if (!isValid && options.onValidationError) {
            options.onValidationError(errors);
        }

        return { isValid, errors };
    }, [base.model, options.onValidationError]);

    // Business logic: Process data
    const processBusinessData = useCallback((data: RawData): ProcessedData => {
        // Step 1: Validate input
        const validation = validationService.current.validate(data);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // Step 2: Transform data
        const transformed = businessService.current.transform(data);

        // Step 3: Apply business rules
        const processed = businessService.current.applyRules(
            transformed,
            base.model.businessRule
        );

        return processed;
    }, [base.model.businessRule]);

    // Business logic: Perform business action
    const handleBusinessAction = useCallback(async () => {
        // Validate before action
        const validation = validateBusinessRules();
        if (!validation.isValid) {
            return;
        }

        // Execute business logic with loading state
        await base.executeAsync(async () => {
            setBusinessState(prev => ({ ...prev, isProcessing: true }));

            try {
                // Process data
                const processed = processBusinessData(base.model.dataCollection);

                // Call external service
                const result = await businessService.current.execute(processed);

                // Update state
                setBusinessState(prev => ({
                    ...prev,
                    isProcessing: false,
                    lastProcessedAt: new Date(),
                    metrics: result.metrics,
                }));

                // Emit business event
                base.emit('businessAction', result);

                // Call external handler
                if (options.onBusinessEvent) {
                    await options.onBusinessEvent(result);
                }
            } catch (error) {
                setBusinessState(prev => ({ ...prev, isProcessing: false }));
                throw error;
            }
        });
    }, [base, options.onBusinessEvent, validateBusinessRules, processBusinessData]);

    // Computed: Business rule validation status
    const isBusinessRuleValid = useMemo(() => {
        return validateBusinessRules().isValid;
    }, [validateBusinessRules]);

    // Computed: Filtered data based on business rules
    const filteredData = useMemo(() => {
        return base.model.dataCollection.filter(item => {
            // Apply filtering logic based on business rules
            return businessService.current.matchesRule(item, base.model.businessRule);
        });
    }, [base.model.dataCollection, base.model.businessRule]);

    // Computed: Aggregated statistics
    const aggregatedStats = useMemo(() => {
        return {
            total: filteredData.length,
            sum: filteredData.reduce((acc, item) => acc + (item.value as number || 0), 0),
            average: filteredData.length > 0
                ? filteredData.reduce((acc, item) => acc + (item.value as number || 0), 0) / filteredData.length
                : 0,
        };
    }, [filteredData]);

    // Side effect: Watch data changes
    useEffect(() => {
        if (options.onDataChange) {
            options.onDataChange(base.model.dataCollection);
        }
    }, [base.model.dataCollection, options.onDataChange]);

    // Side effect: Auto-validate on model changes
    useEffect(() => {
        validateBusinessRules();
    }, [validateBusinessRules]);

    return {
        ...base,
        primitiveVM,
        handleBusinessAction,
        validateBusinessRules,
        processBusinessData,
        isBusinessRuleValid,
        businessMetrics: businessState.metrics,
        filteredData,
        aggregatedStats,
    };
}
```

### Step 4.5: Business View
Create View composing primitives:

```typescript
/**
 * @fileoverview [ComponentName] Business View
 * @module components/[Category]/[ComponentName]/[ComponentName]
 */

import React, { memo, forwardRef } from 'react';
import { use[ComponentName], Use[ComponentName]Options } from './[ComponentName].viewmodel';
import { Primitive } from '@/components/[Category]/Primitive';
import { BaseComponent } from '@/components/[Category]/BaseComponent';
import './[ComponentName].scss';

export interface [ComponentName]Props extends Use[ComponentName]Options {
    children?: React.ReactNode;
    className?: string;
}

/**
 * [ComponentName] Business Component
 *
 * Domain-specific component implementing [business logic].
 * Composes primitives: [list].
 *
 * @example
 * ```tsx
 * <[ComponentName]
 *   businessProp1="value"
 *   onBusinessEvent={(data) => console.log(data)}
 * >
 *   <CustomContent />
 * </[ComponentName]>
 * ```
 */
export const [ComponentName] = memo(
    forwardRef<HTMLDivElement, [ComponentName]Props>(function [ComponentName](
        { children, className, ...options },
        ref
    ) {
        const vm = use[ComponentName](options);

        return (
            <BaseComponent
                ref={ref}
                className={`ark-[component-name] ${className || ''}`.trim()}
                disabled={vm.model.disabled}
                loading={vm.state.isLoading}
                data-testid={vm.model.testId || 'ark-[component-name]'}
            >
                {/* Header section */}
                <div className="ark-[component-name]__header">
                    <h2>{vm.model.businessProp1}</h2>
                    <div className="ark-[component-name]__metrics">
                        <span>Total: {vm.aggregatedStats.total}</span>
                        <span>Average: {vm.aggregatedStats.average.toFixed(2)}</span>
                    </div>
                </div>

                {/* Main content using primitives */}
                <div className="ark-[component-name]__content">
                    {vm.filteredData.map(item => (
                        <Primitive
                            key={item.id}
                            {...vm.primitiveVM.model}
                            onClick={() => vm.primitiveVM.handleClick(item)}
                        >
                            {item.value}
                        </Primitive>
                    ))}
                </div>

                {/* Actions */}
                <div className="ark-[component-name]__actions">
                    <button
                        onClick={vm.handleBusinessAction}
                        disabled={!vm.isBusinessRuleValid || vm.state.isLoading}
                        className="ark-[component-name]__action-btn"
                    >
                        {vm.state.isLoading ? 'Processing...' : 'Execute Action'}
                    </button>
                </div>

                {/* Custom children */}
                {children}
            </BaseComponent>
        );
    })
);

[ComponentName].displayName = '[ComponentName]';
```

### Success Criteria

- ✅ Business logic isolated in ViewModel
- ✅ Composes primitives correctly
- ✅ Implements all business rules
- ✅ Validation integrated
- ✅ Error handling comprehensive
- ✅ Services properly integrated
- ✅ Computed properties optimized
- ✅ Side effects managed correctly
```

---

## Phase 5: Testing & Validation

### Objective
Create comprehensive test suite with 100% coverage.

### Prompt Template

```
# PHASE 5: TESTING & VALIDATION

## Context
Creating tests for: [COMPONENT_NAME]
Test file location: Ark.Alliance.React.Component.UI.Tests/components/[Category]/[ComponentName].test.tsx

## Instructions

### Step 5.1: Test File Structure
Create [ComponentName].test.tsx:

```typescript
/**
 * @fileoverview [ComponentName] Tests
 * @module tests/components/[Category]/[ComponentName]
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { [ComponentName] } from '@/components/[Category]/[ComponentName]';
import {
    [ComponentName]ModelSchema,
    default[ComponentName]Model,
    create[ComponentName]Model,
} from '@/components/[Category]/[ComponentName]/[ComponentName].model';

describe('[ComponentName]', () => {
    afterEach(() => {
        cleanup();
    });

    // MODEL TESTS
    describe('MODEL-001: Schema Validation', () => {
        it('should parse valid model with all properties', () => {
            const result = [ComponentName]ModelSchema.parse({
                variant: 'variant1',
                size: 'md',
                prop1: 'test',
                prop2: 123,
                prop3: true,
            });

            expect(result.variant).toBe('variant1');
            expect(result.size).toBe('md');
            expect(result.prop1).toBe('test');
            expect(result.prop2).toBe(123);
            expect(result.prop3).toBe(true);
        });

        it('should use defaults for missing properties', () => {
            const result = [ComponentName]ModelSchema.parse({});

            expect(result.variant).toBe('variant1');
            expect(result.size).toBe('md');
            expect(result.prop1).toBe('');
            expect(result.prop2).toBe(0);
            expect(result.prop3).toBe(false);
            expect(result.disabled).toBe(false);
            expect(result.loading).toBe(false);
        });

        it('should reject invalid variant', () => {
            expect(() =>
                [ComponentName]ModelSchema.parse({ variant: 'invalid' })
            ).toThrow();
        });

        it('should reject invalid prop2 (negative number)', () => {
            expect(() =>
                [ComponentName]ModelSchema.parse({ prop2: -1 })
            ).toThrow();
        });

        it('should validate complex prop structure', () => {
            const result = [ComponentName]ModelSchema.parse({
                complexProp: {
                    nested: 'value',
                    value: 42,
                },
            });

            expect(result.complexProp).toBeDefined();
            expect(result.complexProp?.nested).toBe('value');
            expect(result.complexProp?.value).toBe(42);
        });
    });

    describe('MODEL-002: Factory Function', () => {
        it('should create model with factory function', () => {
            const model = create[ComponentName]Model({
                variant: 'variant2',
                size: 'lg',
            });

            expect(model.variant).toBe('variant2');
            expect(model.size).toBe('lg');
        });

        it('should merge with default model', () => {
            const model = create[ComponentName]Model({ prop1: 'custom' });

            expect(model.prop1).toBe('custom');
            expect(model.variant).toBe('variant1'); // Default
        });
    });

    // COMPONENT RENDERING TESTS
    describe('COMPONENT-001: Basic Rendering', () => {
        it('should render with default props', () => {
            const { container } = render(
                React.createElement([ComponentName], {})
            );

            const element = container.querySelector('.ark-[component-name]');
            expect(element).toBeTruthy();
        });

        it('should apply variant class', () => {
            const { container } = render(
                React.createElement([ComponentName], { variant: 'variant2' })
            );

            const element = container.querySelector('.ark-[component-name]');
            expect(element?.className).toContain('ark-[component-name]--variant2');
        });

        it('should apply size class', () => {
            const { container } = render(
                React.createElement([ComponentName], { size: 'lg' })
            );

            const element = container.querySelector('.ark-[component-name]');
            expect(element?.className).toContain('ark-[component-name]--lg');
        });

        it('should render children', () => {
            const { container } = render(
                React.createElement([ComponentName], {}, 'Test Content')
            );

            expect(container.textContent).toContain('Test Content');
        });

        it('should apply custom className', () => {
            const { container } = render(
                React.createElement([ComponentName], { className: 'custom-class' })
            );

            const element = container.querySelector('.ark-[component-name]');
            expect(element?.className).toContain('custom-class');
        });
    });

    describe('COMPONENT-002: Interaction', () => {
        it('should call on[Event] when [action]', async () => {
            const on[Event] = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement([ComponentName], { on[Event] })
            );

            const element = container.querySelector('.ark-[component-name]');
            await user.click(element!);

            expect(on[Event]).toHaveBeenCalledTimes(1);
            expect(on[Event]).toHaveBeenCalledWith(
                expect.objectContaining({
                    /* expected data */
                })
            );
        });

        it('should not call on[Event] when disabled', async () => {
            const on[Event] = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement([ComponentName], { on[Event], disabled: true })
            );

            const element = container.querySelector('.ark-[component-name]');
            await user.click(element!);

            expect(on[Event]).not.toHaveBeenCalled();
        });

        it('should handle async on[Event]', async () => {
            const asyncHandler = vi.fn().mockResolvedValue('result');
            const user = userEvent.setup();

            const { container } = render(
                React.createElement([ComponentName], { on[Event]: asyncHandler })
            );

            const element = container.querySelector('.ark-[component-name]');
            await user.click(element!);

            await vi.waitFor(() => {
                expect(asyncHandler).toHaveBeenCalledTimes(1);
            });
        });

        it('should handle keyboard interaction', async () => {
            const on[Event] = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement([ComponentName], { on[Event], focusable: true })
            );

            const element = container.querySelector('.ark-[component-name]') as HTMLElement;
            element.focus();
            await user.keyboard('{Enter}');

            expect(on[Event]).toHaveBeenCalled();
        });
    });

    describe('COMPONENT-003: State Management', () => {
        it('should show loading state', () => {
            const { container } = render(
                React.createElement([ComponentName], { loading: true })
            );

            const element = container.querySelector('.ark-[component-name]');
            const loadingEl = container.querySelector('.ark-[component-name]__loading');

            expect(element?.className).toContain('ark-[component-name]--loading');
            expect(loadingEl).toBeTruthy();
        });

        it('should show disabled state', () => {
            const { container } = render(
                React.createElement([ComponentName], { disabled: true })
            );

            const element = container.querySelector('.ark-[component-name]');
            expect(element?.className).toContain('ark-[component-name]--disabled');
        });

        it('should update state on prop change', () => {
            const { container, rerender } = render(
                React.createElement([ComponentName], { prop1: 'initial' })
            );

            expect(container.textContent).toContain('initial');

            rerender(React.createElement([ComponentName], { prop1: 'updated' }));

            expect(container.textContent).toContain('updated');
        });
    });

    describe('COMPONENT-004: Accessibility', () => {
        it('should have aria-label when provided', () => {
            const { container } = render(
                React.createElement([ComponentName], { ariaLabel: 'Test Label' })
            );

            const element = container.querySelector('.ark-[component-name]');
            expect(element?.getAttribute('aria-label')).toBe('Test Label');
        });

        it('should set aria-disabled when disabled', () => {
            const { container } = render(
                React.createElement([ComponentName], { disabled: true })
            );

            const element = container.querySelector('.ark-[component-name]');
            expect(element?.getAttribute('aria-disabled')).toBe('true');
        });

        it('should set aria-busy when loading', () => {
            const { container } = render(
                React.createElement([ComponentName], { loading: true })
            );

            const element = container.querySelector('.ark-[component-name]');
            expect(element?.getAttribute('aria-busy')).toBe('true');
        });

        it('should have role when clickable', () => {
            const { container } = render(
                React.createElement([ComponentName], { clickable: true })
            );

            const element = container.querySelector('.ark-[component-name]');
            expect(element?.getAttribute('role')).toBe('button');
        });

        it('should have tabIndex when focusable', () => {
            const { container } = render(
                React.createElement([ComponentName], { focusable: true })
            );

            const element = container.querySelector('.ark-[component-name]');
            expect(element?.getAttribute('tabIndex')).toBe('0');
        });

        it('should have data-testid', () => {
            const { container } = render(
                React.createElement([ComponentName], { testId: 'custom-test-id' })
            );

            const element = container.querySelector('[data-testid="custom-test-id"]');
            expect(element).toBeTruthy();
        });
    });

    describe('COMPONENT-005: Edge Cases', () => {
        it('should handle null children', () => {
            const { container } = render(
                React.createElement([ComponentName], {}, null)
            );

            expect(container.querySelector('.ark-[component-name]')).toBeTruthy();
        });

        it('should handle undefined props', () => {
            const { container } = render(
                React.createElement([ComponentName], { prop1: undefined })
            );

            expect(container.querySelector('.ark-[component-name]')).toBeTruthy();
        });

        it('should handle rapid prop updates', () => {
            const { rerender } = render(
                React.createElement([ComponentName], { prop2: 0 })
            );

            for (let i = 1; i <= 10; i++) {
                rerender(React.createElement([ComponentName], { prop2: i }));
            }

            // Should not crash
            expect(true).toBe(true);
        });
    });

    // BUSINESS COMPONENT SPECIFIC TESTS
    describe('BUSINESS-001: Business Logic', () => {
        it('should validate business rules', () => {
            const { container } = render(
                React.createElement([ComponentName], {
                    businessProp1: 'valid',
                    dataCollection: [{ id: '1', value: 100 }],
                })
            );

            // Component should render without validation errors
            expect(container.querySelector('.ark-[component-name]')).toBeTruthy();
        });

        it('should handle validation errors', () => {
            const onValidationError = vi.fn();

            render(
                React.createElement([ComponentName], {
                    businessProp1: '',
                    dataCollection: [],
                    onValidationError,
                })
            );

            expect(onValidationError).toHaveBeenCalled();
            expect(onValidationError.mock.calls[0][0]).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: 'dataCollection',
                        message: expect.any(String),
                    }),
                ])
            );
        });

        it('should process business data correctly', async () => {
            const onBusinessEvent = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement([ComponentName], {
                    dataCollection: [
                        { id: '1', value: 100 },
                        { id: '2', value: 200 },
                    ],
                    onBusinessEvent,
                })
            );

            const actionBtn = container.querySelector('.ark-[component-name]__action-btn');
            await user.click(actionBtn!);

            await vi.waitFor(() => {
                expect(onBusinessEvent).toHaveBeenCalledWith(
                    expect.objectContaining({
                        metrics: expect.any(Object),
                    })
                );
            });
        });

        it('should filter data based on business rules', () => {
            const { container } = render(
                React.createElement([ComponentName], {
                    dataCollection: [
                        { id: '1', value: 100 },
                        { id: '2', value: 200 },
                        { id: '3', value: 50 },
                    ],
                    businessRule: 'value1',
                })
            );

            // Verify filtered results are displayed
            const items = container.querySelectorAll('.ark-primitive');
            expect(items.length).toBeGreaterThan(0);
        });

        it('should compute aggregated stats', () => {
            const { container } = render(
                React.createElement([ComponentName], {
                    dataCollection: [
                        { id: '1', value: 100 },
                        { id: '2', value: 200 },
                        { id: '3', value: 300 },
                    ],
                })
            );

            const metricsEl = container.querySelector('.ark-[component-name]__metrics');
            expect(metricsEl?.textContent).toContain('Total: 3');
            expect(metricsEl?.textContent).toContain('Average: 200');
        });
    });
});
```

### Step 5.2: Run Tests
```bash
cd Ark.Alliance.React.Component.UI.Tests
npm test -- [ComponentName].test.tsx
```

### Step 5.3: Coverage Report
```bash
npm test -- --coverage
```

### Expected Output
```
✓ MODEL-001: Schema Validation (5 tests)
✓ MODEL-002: Factory Function (2 tests)
✓ COMPONENT-001: Basic Rendering (5 tests)
✓ COMPONENT-002: Interaction (4 tests)
✓ COMPONENT-003: State Management (3 tests)
✓ COMPONENT-004: Accessibility (6 tests)
✓ COMPONENT-005: Edge Cases (3 tests)
✓ BUSINESS-001: Business Logic (5 tests)

Tests: 33 passed
Coverage: 100%
```

### Success Criteria

- ✅ All tests passing
- ✅ 100% code coverage
- ✅ Schema validation tests complete
- ✅ Rendering tests cover all variants
- ✅ Interaction tests cover all handlers
- ✅ Accessibility tests comprehensive
- ✅ Edge cases handled
- ✅ Business logic tests (if applicable)
```

---

## Phase 6: Integration & Documentation

### Objective
Integrate component into library and create comprehensive documentation.

### Prompt Template

```
# PHASE 6: INTEGRATION & DOCUMENTATION

## Context
Integrating component: [COMPONENT_NAME]
Library version: 1.5.0

## Instructions

### Step 6.1: Library Integration
Update library exports in `src/index.ts`:

```typescript
// components/[Category]/[ComponentName]
export { [ComponentName] } from './components/[Category]/[ComponentName]';
export type { [ComponentName]Props } from './components/[Category]/[ComponentName]';
export { use[ComponentName] } from './components/[Category]/[ComponentName]';
export type {
    Use[ComponentName]Options,
    Use[ComponentName]Result
} from './components/[Category]/[ComponentName]';
export {
    [ComponentName]ModelSchema,
    default[ComponentName]Model,
    create[ComponentName]Model,
    [ComponentName]Variant,
    [ComponentName]Size,
} from './components/[Category]/[ComponentName]';
export type { [ComponentName]Model } from './components/[Category]/[ComponentName]';
```

### Step 6.2: Create Usage Examples
Create examples in `src/showcase/examples/[ComponentName]Example.tsx`:

```typescript
/**
 * @fileoverview [ComponentName] Usage Examples
 * @module showcase/examples/[ComponentName]Example
 */

import React from 'react';
import { [ComponentName] } from '@/components/[Category]/[ComponentName]';

export const [ComponentName]Examples: React.FC = () => {
    return (
        <div className="example-container">
            <h2>[ComponentName] Examples</h2>

            {/* Example 1: Basic Usage */}
            <section className="example-section">
                <h3>Basic Usage</h3>
                <[ComponentName]
                    variant="variant1"
                    size="md"
                    prop1="Example"
                />
            </section>

            {/* Example 2: Variants */}
            <section className="example-section">
                <h3>Variants</h3>
                <div className="example-grid">
                    <[ComponentName] variant="variant1" prop1="Variant 1" />
                    <[ComponentName] variant="variant2" prop1="Variant 2" />
                    <[ComponentName] variant="variant3" prop1="Variant 3" />
                </div>
            </section>

            {/* Example 3: Sizes */}
            <section className="example-section">
                <h3>Sizes</h3>
                <div className="example-grid">
                    <[ComponentName] size="sm" prop1="Small" />
                    <[ComponentName] size="md" prop1="Medium" />
                    <[ComponentName] size="lg" prop1="Large" />
                </div>
            </section>

            {/* Example 4: States */}
            <section className="example-section">
                <h3>States</h3>
                <div className="example-grid">
                    <[ComponentName] prop1="Normal" />
                    <[ComponentName] disabled prop1="Disabled" />
                    <[ComponentName] loading prop1="Loading" />
                </div>
            </section>

            {/* Example 5: Interactive */}
            <section className="example-section">
                <h3>Interactive</h3>
                <[ComponentName]
                    prop1="Click Me"
                    on[Event]={(data) => {
                        console.log('[Event] triggered:', data);
                        alert(`Event: ${JSON.stringify(data)}`);
                    }}
                />
            </section>

            {/* Example 6: Composition (for business components) */}
            <section className="example-section">
                <h3>Complex Example</h3>
                <[ComponentName]
                    businessProp1="Complex Setup"
                    dataCollection={[
                        { id: '1', value: 100 },
                        { id: '2', value: 200 },
                        { id: '3', value: 300 },
                    ]}
                    onBusinessEvent={(data) => console.log('Business event:', data)}
                    onValidationError={(errors) => console.error('Validation:', errors)}
                >
                    <div>Custom Children Content</div>
                </[ComponentName]>
            </section>
        </div>
    );
};
```

### Step 6.3: Update Showcase Registry
Update `src/showcase/componentRegistry.tsx`:

```typescript
import { [ComponentName]Examples } from './examples/[ComponentName]Example';

export const componentRegistry: ComponentRegistryItem[] = [
    // ... existing components
    {
        id: '[component-name]',
        name: '[ComponentName]',
        category: '[Category]',
        description: '[Brief description]',
        exampleComponent: [ComponentName]Examples,
        tags: ['primitive', 'generic', 'reusable'], // or ['business', 'domain-specific']
        version: '1.5.0',
    },
];
```

### Step 6.4: Create Component README
Create `components/[Category]/[ComponentName]/README.md`:

```markdown
# [ComponentName]

> **Category**: [Category]
> **Type**: [Primitive | Base | Business]
> **Version**: 1.5.0
> **Reusability Score**: [1-10]

## Overview

[Brief description of component purpose and use cases]

## Installation

```bash
npm install ark-alliance-react-ui
```

## Basic Usage

```tsx
import { [ComponentName] } from 'ark-alliance-react-ui';

function MyApp() {
  return (
    <[ComponentName]
      variant="variant1"
      size="md"
      on[Event]={(data) => console.log(data)}
    >
      Content
    </[ComponentName]>
  );
}
```

## Props

### [ComponentName]Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'variant1' \| 'variant2' \| 'variant3'` | `'variant1'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `prop1` | `string` | `''` | [Description] |
| `prop2` | `number` | `0` | [Description] |
| `on[Event]` | `(data) => void \| Promise<void>` | `undefined` | [Event] handler |
| `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `boolean` | `false` | Shows loading state |

[Full props table with inherited props from BaseComponentModel]

## Examples

### Variants

```tsx
<[ComponentName] variant="variant1" />
<[ComponentName] variant="variant2" />
<[ComponentName] variant="variant3" />
```

### Sizes

```tsx
<[ComponentName] size="sm" />
<[ComponentName] size="md" />
<[ComponentName] size="lg" />
```

### Interactive

```tsx
<[ComponentName]
  on[Event]={async (data) => {
    await processData(data);
  }}
/>
```

## Advanced Usage

[Complex examples, composition patterns, etc.]

## Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Focus management
- ✅ ARIA attributes

## Styling

### CSS Classes

- `.ark-[component-name]` - Base class
- `.ark-[component-name]--{variant}` - Variant modifier
- `.ark-[component-name]--{size}` - Size modifier
- `.ark-[component-name]--disabled` - Disabled state
- `.ark-[component-name]--loading` - Loading state

### CSS Custom Properties

```css
--ark-[component-name]-bg: Background color
--ark-[component-name]-text: Text color
--ark-[component-name]-border: Border color
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  [ComponentName]Model,
  [ComponentName]Props,
  Use[ComponentName]Options,
  Use[ComponentName]Result,
} from 'ark-alliance-react-ui';
```

## Testing

Example test setup:

```typescript
import { render } from '@testing-library/react';
import { [ComponentName] } from 'ark-alliance-react-ui';

test('renders component', () => {
  const { container } = render(<[ComponentName] prop1="test" />);
  expect(container.querySelector('.ark-[component-name]')).toBeTruthy();
});
```

## License

MIT © Armand Richelet-Kleinberg
```

### Success Criteria

- ✅ Component exported in library index
- ✅ Showcase examples created
- ✅ Component registered in showcase
- ✅ README documentation complete
- ✅ All examples working
- ✅ Library builds successfully
```

---

## Iterative Refinement Process

### When to Iterate

Iterate on a component when:
1. **Tests Fail**: Fix issues and re-run tests
2. **Type Errors**: Resolve TypeScript strict mode errors
3. **Accessibility Issues**: Address WCAG compliance gaps
4. **Performance Problems**: Optimize re-renders
5. **Code Review Feedback**: Implement requested changes

### Iteration Prompt Template

```
# ITERATIVE REFINEMENT

## Context
Refining component: [COMPONENT_NAME]
Issue: [Description of problem]

## Current State
[Current implementation summary]

## Required Changes
[List of specific changes needed]

## Instructions

### Step 1: Analyze Issue
[Detailed analysis of the problem]

### Step 2: Implement Fix
[Specific code changes with diffs]

### Step 3: Validate Fix
[Test commands and expected results]

### Step 4: Document Changes
[Update documentation to reflect changes]

## Success Criteria
- ✅ Issue resolved
- ✅ Tests passing
- ✅ No regressions
- ✅ Documentation updated
```

---

## Quality Checklist

### Before Marking Component Complete

#### Model Layer
- [ ] Zod schema extends BaseModelSchema
- [ ] All properties have correct types
- [ ] Enums used for constrained values
- [ ] Default values are sensible
- [ ] Factory function provided
- [ ] TypeScript types exported
- [ ] JSDoc complete with examples
- [ ] No TypeScript errors

#### ViewModel Layer
- [ ] Extends useBaseViewModel
- [ ] Options interface defined
- [ ] Result interface defined
- [ ] useMemo for model parsing
- [ ] useCallback for handlers
- [ ] useMemo for computed properties
- [ ] executeAsync for async operations
- [ ] Event emission implemented
- [ ] JSDoc complete with examples
- [ ] No TypeScript errors

#### View Layer
- [ ] Wrapped in memo()
- [ ] Uses forwardRef()
- [ ] ViewModel hook called
- [ ] Handlers spread from VM
- [ ] displayName set
- [ ] ARIA attributes included
- [ ] data-testid attribute
- [ ] Minimal business logic
- [ ] JSDoc complete
- [ ] No TypeScript errors

#### Styling
- [ ] SCSS file created
- [ ] ark- prefix used
- [ ] CSS custom properties for colors
- [ ] Dark mode support
- [ ] focus-visible styles
- [ ] prefers-reduced-motion respected
- [ ] BEM naming convention
- [ ] Variants implemented
- [ ] Sizes implemented

#### Testing
- [ ] Test file created
- [ ] Schema validation tests
- [ ] Rendering tests
- [ ] Interaction tests
- [ ] Accessibility tests
- [ ] Edge case tests
- [ ] Business logic tests (if applicable)
- [ ] 100% code coverage
- [ ] All tests passing

#### Integration
- [ ] Exported in library index
- [ ] Showcase example created
- [ ] Component registered
- [ ] README documentation
- [ ] Usage examples working
- [ ] Library builds successfully

#### Code Quality
- [ ] Zero TypeScript errors
- [ ] ESLint passing
- [ ] No any types
- [ ] No @ts-ignore without explanation
- [ ] Proper error handling
- [ ] Performance optimized

#### Accessibility
- [ ] Keyboard navigation
- [ ] ARIA attributes
- [ ] Focus management
- [ ] Screen reader friendly
- [ ] WCAG 2.1 AA compliant

---

## Final Notes

### Best Practices Summary

1. **Always Read Agents.md First**: Understand architectural guidelines
2. **Start with Analysis**: Phase 1 is critical for success
3. **Primitives Before Business**: Build foundation first
4. **Test Early and Often**: Don't wait until the end
5. **Document as You Go**: Write docs alongside code
6. **Iterate Based on Feedback**: Be ready to refine
7. **Follow Patterns**: Use existing components as reference
8. **Ask for Clarification**: When requirements are unclear

### Common Pitfalls to Avoid

1. ❌ Skipping Phase 1 analysis
2. ❌ Creating business components before primitives
3. ❌ Putting business logic in View layer
4. ❌ Using any type instead of proper typing
5. ❌ Forgetting to extend BaseViewModel
6. ❌ Missing ARIA attributes
7. ❌ Skipping test coverage
8. ❌ Hardcoding colors instead of CSS variables

### Success Metrics

- **Code Quality**: Zero TypeScript errors, ESLint passing
- **Test Coverage**: 100% coverage, all tests passing
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: No unnecessary re-renders
- **Documentation**: Complete JSDoc and README
- **Reusability**: Primitives score 8-10, properly composed

---

**Ready to Begin? Start with Phase 1: Analysis & Architecture**
