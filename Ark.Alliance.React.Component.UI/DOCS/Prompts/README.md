# Gemini 3 Pro - Component Creation Prompt System - README

> **Version:** 1.0.0
> **Last Updated:** 2026-01-26
> **Purpose:** Guide for using the systematic component creation prompt system with Gemini 3 Pro

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Configuration Variables](#configuration-variables)
4. [Usage Instructions](#usage-instructions)
5. [Phase-by-Phase Guide](#phase-by-phase-guide)
6. [Example Workflow](#example-workflow)
7. [Troubleshooting](#troubleshooting)
8. [Appendices](#appendices)

---

## Overview

### What is This?

This prompt system is a **comprehensive, phase-based methodology** for converting complex React applications into enterprise-grade MVVM-based component libraries. It is specifically designed for use with **Gemini 3 Pro High** and follows the architectural standards of **Ark.Alliance.React.Component.UI v1.5.0**.

### Who is This For?

- **AI Engineers**: Training Gemini 3 Pro to create production-ready components
- **Software Architects**: Converting legacy applications to modern patterns
- **Development Teams**: Establishing consistent component creation workflows
- **Solo Developers**: Following best practices for component library development

### What You'll Get

- ✅ **Systematic Approach**: 6-phase methodology from analysis to integration
- ✅ **MVVM Compliance**: Strict adherence to Model-View-ViewModel pattern
- ✅ **100% Test Coverage**: Comprehensive test generation
- ✅ **Enterprise Quality**: Production-ready, accessible, performant components
- ✅ **Complete Documentation**: JSDoc, README, usage examples

---

## Quick Start

### Prerequisites

1. **Ark.Alliance.React.Component.UI** library repository cloned
2. **Source application** to convert (e.g., ark.alliance.Architect.React.Mermed)
3. **Agents.md** architectural guidelines document
4. **Gemini 3 Pro** access with appropriate token limits
5. **Node.js 18+** and npm installed

### 5-Minute Setup

```bash
# 1. Clone and setup library
cd /path/to/Ark.Alliance.React.Component.UI
npm install
npm test

# 2. Verify source application
cd /path/to/source-application
npm install
npm run dev

# 3. Read prerequisite documents
cat Ark.Alliance.React.Component.UI/Agents.md
cat Ark.Alliance.React.Component.UI/DOCS/Prompts/Gemini3ProPromptNewComponents.md

# 4. Ready to start Phase 1!
```

---

## Configuration Variables

### Required Variables for All Phases

Before using any prompt, replace these placeholders:

#### **File Path Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `[SOURCE_APP_PATH]` | Path to source application | `C:\Users\...\ProjectToCreateComponentsExamples\ark.alliance.Architect.React.Mermed` |
| `[LIBRARY_PATH]` | Path to component library | `C:\Users\...\Ark.Alliance.React.Component.UI` |
| `[AGENTS_MD_PATH]` | Path to Agents.md | `C:\Users\...\Ark.Alliance.React.Component.UI\Agents.md` |

#### **Component Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `[COMPONENT_NAME]` | PascalCase component name | `ShapeRenderer`, `DiagramNode`, `MermaidDiagram` |
| `[ComponentName]` | Same as above (for consistency) | `ShapeRenderer` |
| `[component-name]` | kebab-case for CSS/files | `shape-renderer`, `diagram-node` |
| `[componentName]` | camelCase for variables | `shapeRenderer`, `diagramNode` |
| `[Category]` | Component category folder | `Diagram`, `Charts`, `Forms` |

#### **Metadata Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `[VERSION]` | Library version | `1.5.0` |
| `[REUSABILITY_SCORE]` | 1-10 score | `8` (for primitives), `3` (for business) |
| `[COMPLEXITY]` | Low, Medium, High | `Medium` |
| `[ESTIMATED_HOURS]` | Time estimate | `8 hours` |

### Optional Variables for Business Components

| Variable | Description | Example |
|----------|-------------|---------|
| `[BUSINESS_DOMAIN]` | Business domain | `DiagramEditing`, `DataVisualization` |
| `[SERVICE_DEPENDENCIES]` | External services | `GeminiService`, `MermaidService` |

---

## Usage Instructions

### Step-by-Step Process

#### **Step 1: Prepare Context**

Before sending any prompt to Gemini 3 Pro, prepare the following context files:

```
Context Files to Upload:
1. Agents.md (full architectural guidelines)
2. Source application files (App.tsx, types.ts, components/*.tsx)
3. Existing library base components (BaseComponentModel.ts, BaseViewModel.ts)
4. Example components from library (Button/, GenericPanel/)
```

#### **Step 2: Configure Variables**

Create a `variables.txt` file with your specific values:

```txt
SOURCE_APP_PATH=C:\Users\Criprtoswiss\source\repos\Ark.Alliance.React.Component.UI\ProjectToCreateComponentsExamples\ark.alliance.Architect.React.Mermed
LIBRARY_PATH=C:\Users\Criprtoswiss\source\repos\Ark.Alliance.React.Component.UI\Ark.Alliance.React.Component.UI
AGENTS_MD_PATH=C:\Users\Criprtoswiss\source\repos\Ark.Alliance.React.Component.UI\Agents.md
VERSION=1.5.0
```

#### **Step 3: Start with Phase 1**

Copy the **Phase 1 prompt** from `Gemini3ProPromptNewComponents.md`, replace variables, and send to Gemini 3 Pro:

```
# PHASE 1: ANALYSIS & ARCHITECTURE

## Context
I am analyzing the application at: C:\Users\...\ark.alliance.Architect.React.Mermed
Target library: Ark.Alliance.React.Component.UI v1.5.0

## Uploaded Files
- Agents.md (architectural guidelines)
- App.tsx (main application file)
- types.ts (data structures)
- components/Toolbar.tsx
- components/PropertiesPanel.tsx
- components/AIChat.tsx

## Instructions
[Continue with Phase 1 instructions from prompt document]
```

#### **Step 4: Review Output**

Gemini 3 Pro will provide:
- **Component Analysis Report**
- **Dependency Graph**
- **Architecture Decisions**
- **Implementation Order**

Save this output as `Phase1_Analysis_Report.md` for reference.

#### **Step 5: Proceed to Phase 2-6**

Continue with each phase sequentially, using outputs from previous phases as context for the next.

---

## Phase-by-Phase Guide

### Phase 1: Analysis & Architecture (2-4 hours)

**Goal**: Understand the source application and plan component decomposition.

**Input**:
- Source application files
- Agents.md
- Library base components

**Output**:
- Component inventory (primitives, base, business)
- Dependency graph
- Implementation order

**Variables Needed**:
- `[SOURCE_APP_PATH]`
- `[LIBRARY_PATH]`
- `[VERSION]`

**Success Metrics**:
- All components categorized
- Dependency graph is acyclic
- Clear implementation order

**Prompt Location**: `Gemini3ProPromptNewComponents.md` - Section "Phase 1"

---

### Phase 2: Base Component Identification (1-2 hours)

**Goal**: Decide which existing base components to extend vs create new.

**Input**:
- Phase 1 Analysis Report
- Existing library base components

**Output**:
- Extend vs Create decision matrix
- Required base component enhancements
- Primitive creation plan

**Variables Needed**:
- `[COMPONENT_NAME]` for each component
- `[Category]`

**Success Metrics**:
- Clear decisions for all components
- Enhancement strategies defined
- Priority order established

**Prompt Location**: `Gemini3ProPromptNewComponents.md` - Section "Phase 2"

---

### Phase 3: Primitive Component Creation (3-6 hours per primitive)

**Goal**: Create highly reusable primitive components.

**Input**:
- Phase 2 decisions
- Component specifications
- Base component patterns

**Output**:
- Complete MVVM files (Model, ViewModel, View, Styles, Index)
- Test file
- Usage examples

**Variables Needed**:
- `[COMPONENT_NAME]`
- `[Category]`
- `[component-name]` (CSS class prefix)
- `[REUSABILITY_SCORE]` (should be 8-10)

**Success Metrics**:
- Zero TypeScript errors
- All files follow MVVM pattern
- No business logic in primitive
- Comprehensive JSDoc

**Prompt Location**: `Gemini3ProPromptNewComponents.md` - Section "Phase 3"

**Repeat for Each Primitive**: Yes (iterate per component)

---

### Phase 4: Business Component Creation (4-8 hours per component)

**Goal**: Create domain-specific business components.

**Input**:
- Phase 3 primitives
- Business requirements
- Existing base components

**Output**:
- Complete MVVM files with business logic
- Test file with business logic tests
- Usage examples

**Variables Needed**:
- `[COMPONENT_NAME]`
- `[Category]`
- `[BUSINESS_DOMAIN]`
- `[SERVICE_DEPENDENCIES]`
- `[REUSABILITY_SCORE]` (should be 1-4)

**Success Metrics**:
- Business logic in ViewModel only
- Composes primitives correctly
- Validation integrated
- Services properly integrated

**Prompt Location**: `Gemini3ProPromptNewComponents.md` - Section "Phase 4"

**Repeat for Each Business Component**: Yes (iterate per component)

---

### Phase 5: Testing & Validation (2-4 hours per component)

**Goal**: Achieve 100% test coverage.

**Input**:
- Completed component files
- Test patterns from library

**Output**:
- Comprehensive test suite
- Coverage report
- Passing tests

**Variables Needed**:
- `[COMPONENT_NAME]`
- `[Category]`

**Success Metrics**:
- All tests passing
- 100% code coverage
- All test categories complete

**Prompt Location**: `Gemini3ProPromptNewComponents.md` - Section "Phase 5"

**Repeat for Each Component**: Yes

---

### Phase 6: Integration & Documentation (2-3 hours per component)

**Goal**: Integrate into library and document.

**Input**:
- Completed and tested components
- Library structure

**Output**:
- Library exports updated
- Showcase examples created
- README documentation
- Component working in showcase

**Variables Needed**:
- `[COMPONENT_NAME]`
- `[Category]`
- `[VERSION]`

**Success Metrics**:
- Component exported correctly
- Showcase examples working
- README complete
- Library builds successfully

**Prompt Location**: `Gemini3ProPromptNewComponents.md` - Section "Phase 6"

**Repeat for Each Component**: Yes

---

## Example Workflow

### Scenario: Converting ark.alliance.Architect.React.Mermed

This example demonstrates converting a complex diagram editor application into reusable components.

#### **Step 1: Setup Variables**

```txt
# variables.txt
SOURCE_APP_PATH=C:\Users\Criprtoswiss\source\repos\Ark.Alliance.React.Component.UI\ProjectToCreateComponentsExamples\ark.alliance.Architect.React.Mermed
LIBRARY_PATH=C:\Users\Criprtoswiss\source\repos\Ark.Alliance.React.Component.UI\Ark.Alliance.React.Component.UI
AGENTS_MD_PATH=C:\Users\Criprtoswiss\source\repos\Ark.Alliance.React.Component.UI\Agents.md
VERSION=1.5.0
```

#### **Step 2: Phase 1 - Analysis**

**Prompt** (with variables replaced):

```
# PHASE 1: ANALYSIS & ARCHITECTURE

## Context
I am analyzing the application at:
C:\Users\Criprtoswiss\source\repos\Ark.Alliance.React.Component.UI\ProjectToCreateComponentsExamples\ark.alliance.Architect.React.Mermed

Target library: Ark.Alliance.React.Component.UI v1.5.0

## Uploaded Files
[Upload App.tsx, types.ts, all component files]

## Instructions
[Full Phase 1 instructions from prompt]
```

**Output Example**:

```markdown
# Component Analysis Report

## Application Overview
- **Name**: Ark Alliance Mermaid Architect
- **Components Found**: 12
- **Complexity**: High
- **Estimated Effort**: 80 hours

## Component Inventory

### PRIMITIVE Components (Reusability Score: 8-10)
| Component Name | Purpose | Extends | Dependencies | Folder |
|----------------|---------|---------|--------------|--------|
| ShapeRenderer | Renders SVG diagram shapes | BaseComponentModel | None | components/Diagram/Primitives/ShapeRenderer |
| ConnectionLine | Draws Bezier connections between nodes | BaseComponentModel | None | components/Diagram/Primitives/ConnectionLine |
| Handle | Connection point indicator | BaseComponentModel | None | components/Diagram/Primitives/Handle |
| ResizeHandle | Corner resize control | BaseComponentModel | None | components/Diagram/Primitives/ResizeHandle |

### BASE Components (Reusability Score: 5-7)
| Component Name | Purpose | Extends | Dependencies | Folder |
|----------------|---------|---------|--------------|--------|
| DiagramNode | Container for diagram nodes with connectors | GenericPanel | ShapeRenderer, Handle, ResizeHandle | components/Diagram/DiagramNode |
| DiagramCanvas | Pan/zoom canvas with selection | BaseComponentModel | DiagramNode, ConnectionLine | components/Diagram/DiagramCanvas |

### BUSINESS Components (Reusability Score: 1-4)
| Component Name | Purpose | Extends | Dependencies | Folder |
|----------------|---------|---------|--------------|--------|
| MermaidDiagram | Full diagram editor | BaseComponentModel | DiagramCanvas, Toolbar, PropertiesPanel, AIChat | components/Diagram/MermaidDiagram |
| DiagramToolbar | Shape palette with drag-and-drop | SideBar | ShapeRenderer (preview) | components/Diagram/DiagramToolbar |
| DiagramPropertiesPanel | Node/edge property editor | GenericPanel | Form inputs | components/Diagram/DiagramPropertiesPanel |

## Recommended Implementation Order
1. Phase 3.1: Create ShapeRenderer primitive (6 hours)
2. Phase 3.2: Create ConnectionLine primitive (5 hours)
3. Phase 3.3: Create Handle primitive (2 hours)
4. Phase 3.4: Create ResizeHandle primitive (2 hours)
5. Phase 4.1: Create DiagramNode base component (8 hours)
6. Phase 4.2: Create DiagramCanvas base component (12 hours)
7. Phase 4.3: Create DiagramToolbar business component (6 hours)
8. Phase 4.4: Create DiagramPropertiesPanel business component (8 hours)
9. Phase 4.5: Create MermaidDiagram business component (12 hours)
```

#### **Step 3: Phase 3 - Create First Primitive (ShapeRenderer)**

**Updated Variables**:
```txt
COMPONENT_NAME=ShapeRenderer
Category=Diagram/Primitives
component-name=shape-renderer
componentName=shapeRenderer
REUSABILITY_SCORE=9
```

**Prompt**:
```
# PHASE 3: PRIMITIVE COMPONENT CREATION

## Context
Creating primitive component: ShapeRenderer
Category: Primitive (Reusability Score: 9)
Location: components/Diagram/Primitives/ShapeRenderer

## Instructions
[Full Phase 3 instructions from prompt]
```

**Output**: Complete component files (Model, ViewModel, View, Styles, Index)

#### **Step 4: Phase 5 - Test ShapeRenderer**

**Prompt**:
```
# PHASE 5: TESTING & VALIDATION

## Context
Creating tests for: ShapeRenderer
Test file location: Ark.Alliance.React.Component.UI.Tests/components/Diagram/Primitives/ShapeRenderer.test.tsx

## Instructions
[Full Phase 5 instructions from prompt]
```

**Output**: Test file with 100% coverage

#### **Step 5: Phase 6 - Integrate ShapeRenderer**

**Prompt**:
```
# PHASE 6: INTEGRATION & DOCUMENTATION

## Context
Integrating component: ShapeRenderer
Library version: 1.5.0

## Instructions
[Full Phase 6 instructions from prompt]
```

**Output**: Component integrated, documented, and showcased

#### **Step 6: Repeat for Other Primitives**

Continue with ConnectionLine, Handle, ResizeHandle following the same process.

#### **Step 7: Phase 4 - Create Base Components**

After all primitives are complete, create DiagramNode and DiagramCanvas.

#### **Step 8: Phase 4 - Create Business Components**

Finally, create DiagramToolbar, DiagramPropertiesPanel, and MermaidDiagram.

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Gemini 3 Pro Output is Incomplete

**Symptoms**:
- Code blocks cut off mid-sentence
- Missing sections in output

**Solutions**:
1. Break prompt into smaller chunks
2. Request specific sections: "Generate only the Model layer"
3. Use continuation prompt: "Continue from where you left off"

**Example Continuation Prompt**:
```
The previous response was cut off. Please continue generating the [ComponentName].viewmodel.ts file starting from the handleClick function.
```

---

#### Issue 2: TypeScript Errors in Generated Code

**Symptoms**:
- Type mismatches
- Missing imports
- Generic type errors

**Solutions**:
1. Provide more context: Upload base component files
2. Use iteration prompt (see Appendix B)
3. Specify exact import paths in variables

**Example Iteration Prompt**:
```
# ITERATIVE REFINEMENT

## Context
Refining component: ShapeRenderer
Issue: Type error on line 45 - Property 'shape' does not exist on type 'BaseModel'

## Current Implementation
[Paste problematic code]

## Required Changes
Add 'shape' property to ShapeRendererModelSchema with type ShapeType enum

## Instructions
Please update ShapeRenderer.model.ts to include the missing property with proper Zod schema and TypeScript type.
```

---

#### Issue 3: Tests Failing

**Symptoms**:
- Test assertions failing
- Mock functions not called
- Component not rendering

**Solutions**:
1. Verify test data matches model schema
2. Check async operation handling
3. Use debug output: Add console.log to generated tests

**Example Debug Addition**:
```typescript
it('should call onClick', async () => {
    const onClick = vi.fn();
    const { container } = render(<Component onClick={onClick} />);

    console.log('Container HTML:', container.innerHTML); // DEBUG

    const element = container.querySelector('.ark-component');
    await user.click(element!);

    console.log('onClick called:', onClick.mock.calls); // DEBUG
    expect(onClick).toHaveBeenCalled();
});
```

---

#### Issue 4: Component Not Showing in Showcase

**Symptoms**:
- Component builds but doesn't appear in showcase
- Console errors in showcase app

**Solutions**:
1. Verify export in `src/index.ts`
2. Check showcase registry entry
3. Verify example component syntax

**Checklist**:
```bash
# 1. Check library export
grep "ShapeRenderer" src/index.ts

# 2. Check showcase registry
grep "shape-renderer" src/showcase/componentRegistry.tsx

# 3. Rebuild library
npm run build

# 4. Restart showcase
npm run dev
```

---

#### Issue 5: CSS Not Applying

**Symptoms**:
- Component renders but has no styles
- Layout broken

**Solutions**:
1. Verify SCSS import in component
2. Check class name matches
3. Verify CSS variables defined

**Example Fix**:
```tsx
// Component.tsx - Check this import exists
import './Component.scss';

// Component.tsx - Check class name matches SCSS
className="ark-component" // Must match .ark-component in SCSS

// Component.scss - Check CSS variables
.ark-component {
    background: var(--ark-bg-primary, #ffffff); // ✅ Has fallback
    // NOT: background: var(--ark-bg-primary); // ❌ No fallback
}
```

---

#### Issue 6: Business Logic in Wrong Layer

**Symptoms**:
- View component has complex logic
- Model has functions

**Solutions**:
1. Move logic to ViewModel
2. Use iteration prompt to refactor

**Refactoring Example**:
```typescript
// ❌ WRONG: Logic in View
function Component() {
    const handleClick = () => {
        if (data.length > 0) {
            const filtered = data.filter(x => x.valid);
            const sorted = filtered.sort((a, b) => a.value - b.value);
            processData(sorted);
        }
    };
    return <button onClick={handleClick}>Process</button>;
}

// ✅ CORRECT: Logic in ViewModel
function useComponent() {
    const handleClick = useCallback(() => {
        const validData = base.model.data.filter(x => x.valid);
        const sortedData = validData.sort((a, b) => a.value - b.value);
        processBusinessData(sortedData);
    }, [base.model.data]);

    return { handleClick };
}

function Component() {
    const vm = useComponent();
    return <button onClick={vm.handleClick}>Process</button>;
}
```

---

### Performance Issues

#### Issue 7: Component Re-renders Too Often

**Symptoms**:
- Slow UI
- Console shows excessive renders

**Solutions**:
1. Use React DevTools Profiler
2. Check dependency arrays
3. Memoize props

**Example Fix**:
```typescript
// ❌ Creates new object every render
<Component config={{ option: true }} />

// ✅ Memoized config
const config = useMemo(() => ({ option: true }), []);
<Component config={config} />

// ❌ Inline function
<Component onClick={() => handleClick(id)} />

// ✅ Memoized handler
const handleButtonClick = useCallback(() => handleClick(id), [id]);
<Component onClick={handleButtonClick} />
```

---

## Appendices

### Appendix A: Complete Variable Reference

#### Path Variables (Windows)
```txt
SOURCE_APP_PATH=C:\Users\[Username]\source\repos\Ark.Alliance.React.Component.UI\ProjectToCreateComponentsExamples\ark.alliance.Architect.React.Mermed
LIBRARY_PATH=C:\Users\[Username]\source\repos\Ark.Alliance.React.Component.UI\Ark.Alliance.React.Component.UI
AGENTS_MD_PATH=C:\Users\[Username]\source\repos\Ark.Alliance.React.Component.UI\Agents.md
TESTS_PATH=C:\Users\[Username]\source\repos\Ark.Alliance.React.Component.UI\Ark.Alliance.React.Component.UI.Tests
```

#### Path Variables (macOS/Linux)
```txt
SOURCE_APP_PATH=/Users/[username]/projects/Ark.Alliance.React.Component.UI/ProjectToCreateComponentsExamples/ark.alliance.Architect.React.Mermed
LIBRARY_PATH=/Users/[username]/projects/Ark.Alliance.React.Component.UI/Ark.Alliance.React.Component.UI
AGENTS_MD_PATH=/Users/[username]/projects/Ark.Alliance.React.Component.UI/Agents.md
TESTS_PATH=/Users/[username]/projects/Ark.Alliance.React.Component.UI/Ark.Alliance.React.Component.UI.Tests
```

#### Component Naming Variables
```txt
# For component: ShapeRenderer in Diagram/Primitives folder
COMPONENT_NAME=ShapeRenderer
Category=Diagram/Primitives
component-name=shape-renderer
componentName=shapeRenderer
FOLDER_PATH=components/Diagram/Primitives/ShapeRenderer
TEST_PATH=components/Diagram/Primitives/ShapeRenderer.test.tsx
```

#### Metadata Variables
```txt
VERSION=1.5.0
LIBRARY_NAME=Ark.Alliance.React.Component.UI
LIBRARY_NPM_NAME=ark-alliance-react-ui
AUTHOR=Armand Richelet-Kleinberg
AUTHOR_EMAIL=contact@m2h.io
LICENSE=MIT
```

---

### Appendix B: Quick Reference Prompts

#### Prompt B1: Quick Fix for Type Errors

```
Fix TypeScript errors in [COMPONENT_NAME] component:

## Error Messages
[Paste TypeScript error messages]

## Current Code
[Paste problematic code section]

## Instructions
Please fix the TypeScript errors while maintaining MVVM pattern compliance and ensuring no regressions. Only modify the minimal code necessary to resolve the errors.
```

#### Prompt B2: Add Missing Tests

```
Add missing test cases for [COMPONENT_NAME]:

## Current Coverage
[Paste coverage report showing gaps]

## Missing Scenarios
- [List specific scenarios needing tests]

## Instructions
Generate additional test cases following the existing test patterns in [COMPONENT_NAME].test.tsx to achieve 100% coverage.
```

#### Prompt B3: Refactor Business Logic

```
Refactor [COMPONENT_NAME] to move business logic from View to ViewModel:

## Current Implementation
[Paste View component with business logic]

## Requirements
- Move all business logic to ViewModel
- Keep View as pure presentation
- Maintain all existing functionality
- Update tests accordingly
```

#### Prompt B4: Add Accessibility Features

```
Enhance [COMPONENT_NAME] accessibility:

## Current ARIA Attributes
[List existing accessibility features]

## Missing Requirements
- Keyboard navigation for [interaction]
- Screen reader announcements for [state change]
- Focus management for [scenario]

## Instructions
Add missing accessibility features while maintaining WCAG 2.1 AA compliance. Include aria-* attributes, keyboard handlers, and focus management.
```

#### Prompt B5: Optimize Performance

```
Optimize [COMPONENT_NAME] for performance:

## Performance Issues
[Describe re-render problems or slow operations]

## Current Implementation
[Paste relevant code sections]

## Instructions
Apply React performance optimizations:
- Add useMemo for expensive computations
- Add useCallback for event handlers
- Add memo wrapper if appropriate
- Optimize dependency arrays
```

---

### Appendix C: Component Complexity Guide

#### Complexity Levels

| Complexity | Lines of Code | Features | Example Components |
|------------|---------------|----------|-------------------|
| **Low** | 50-200 | Simple UI element, 1-3 props, no state | Badge, Divider, Icon |
| **Medium** | 200-500 | Multiple props, local state, events | Button, Input, Card |
| **High** | 500-1500 | Complex state, composition, business logic | DataGrid, Diagram, Editor |
| **Very High** | 1500+ | Multiple sub-components, services, advanced features | Dashboard, IDE, Platform |

#### Estimated Effort by Complexity

| Complexity | Primitive | Base | Business | Total (including tests) |
|------------|-----------|------|----------|------------------------|
| **Low** | 2-4 hours | 4-6 hours | 6-8 hours | + 2-4 hours testing |
| **Medium** | 4-6 hours | 6-10 hours | 10-16 hours | + 4-6 hours testing |
| **High** | 8-12 hours | 12-20 hours | 20-30 hours | + 8-12 hours testing |
| **Very High** | 16-24 hours | 24-40 hours | 40-60 hours | + 16-24 hours testing |

---

### Appendix D: Component Category Decision Tree

```
                         Start Here
                              |
                              v
                  Does component have business logic?
                              |
                    +---------+---------+
                    |                   |
                   Yes                 No
                    |                   |
                    v                   v
            BUSINESS Component    Is it highly reusable?
            (Score: 1-4)                |
                                 +------+------+
                                 |             |
                                Yes           No
                                 |             |
                                 v             v
                         PRIMITIVE         BASE
                         (Score: 8-10)     (Score: 5-7)


Decision Questions:

1. Business Logic?
   - Implements domain-specific rules?
   - Requires external services?
   - Validates business constraints?
   → YES = Business Component

2. Highly Reusable?
   - Can be used in any context?
   - No domain assumptions?
   - Pure presentation?
   → YES = Primitive Component

3. Neither?
   - Provides common patterns?
   - Extends existing components?
   - Domain-aware but generic?
   → BASE Component
```

---

### Appendix E: Testing Pattern Reference

#### Pattern E1: Schema Validation Test
```typescript
describe('MODEL-001: Schema Validation', () => {
    it('should parse valid model', () => {
        const result = Schema.parse({ /* valid data */ });
        expect(result.property).toBe(expectedValue);
    });

    it('should use defaults', () => {
        const result = Schema.parse({});
        expect(result.property).toBe(defaultValue);
    });

    it('should reject invalid', () => {
        expect(() => Schema.parse({ property: 'invalid' })).toThrow();
    });
});
```

#### Pattern E2: User Interaction Test
```typescript
describe('COMPONENT-002: Interaction', () => {
    it('should handle click', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();
        const { container } = render(<Component onClick={onClick} />);

        const element = container.querySelector('.ark-component');
        await user.click(element!);

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
```

#### Pattern E3: Accessibility Test
```typescript
describe('COMPONENT-004: Accessibility', () => {
    it('should have aria-label', () => {
        const { container } = render(
            <Component ariaLabel="Test" />
        );

        const element = container.querySelector('.ark-component');
        expect(element?.getAttribute('aria-label')).toBe('Test');
    });

    it('should be keyboard navigable', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();
        const { container } = render(
            <Component onClick={onClick} focusable />
        );

        const element = container.querySelector('.ark-component') as HTMLElement;
        element.focus();
        await user.keyboard('{Enter}');

        expect(onClick).toHaveBeenCalled();
    });
});
```

---

### Appendix F: Useful Commands Reference

#### Development Commands
```bash
# Library development
cd Ark.Alliance.React.Component.UI
npm run dev          # Start dev server (localhost:5090)
npm run build        # Build library
npm run lint         # Run ESLint
npm test             # Run tests

# Test specific component
cd Ark.Alliance.React.Component.UI.Tests
npm test -- ShapeRenderer.test.tsx
npm test -- --coverage

# Build and preview
npm run build
npm run preview
```

#### File Generation Commands
```bash
# Create component folder structure
mkdir -p src/components/Diagram/Primitives/ShapeRenderer
cd src/components/Diagram/Primitives/ShapeRenderer
touch ShapeRenderer.tsx
touch ShapeRenderer.model.ts
touch ShapeRenderer.viewmodel.ts
touch ShapeRenderer.scss
touch index.ts

# Create test file
mkdir -p ../../../../../../Ark.Alliance.React.Component.UI.Tests/components/Diagram/Primitives
touch ../../../../../../Ark.Alliance.React.Component.UI.Tests/components/Diagram/Primitives/ShapeRenderer.test.tsx
```

#### Git Commands for Component Development
```bash
# Create feature branch
git checkout -b feature/diagram-primitives-shaperenderer

# Commit component files
git add src/components/Diagram/Primitives/ShapeRenderer/
git commit -m "feat(diagram): add ShapeRenderer primitive component

- Implements MVVM pattern
- Supports SVG shape rendering (rectangle, circle, diamond, etc.)
- 100% test coverage
- Accessible with ARIA attributes

Co-Authored-By: Gemini 3 Pro <noreply@google.com>"

# Push and create PR
git push -u origin feature/diagram-primitives-shaperenderer
```

---

### Appendix G: Best Practices Checklist

#### Before Starting Any Phase
- [ ] Read Agents.md completely
- [ ] Understand MVVM pattern
- [ ] Review existing similar components
- [ ] Set up all path variables
- [ ] Verify library builds and tests pass

#### During Component Creation
- [ ] Follow MVVM strictly (no logic in View)
- [ ] Extend BaseComponentModel
- [ ] Use Zod for all schemas
- [ ] Add comprehensive JSDoc
- [ ] Include ARIA attributes
- [ ] Use CSS custom properties
- [ ] Support dark mode
- [ ] Respect prefers-reduced-motion
- [ ] Write tests alongside code
- [ ] Test keyboard navigation

#### Before Marking Complete
- [ ] Zero TypeScript errors
- [ ] All tests passing (100% coverage)
- [ ] ESLint passing
- [ ] Component in showcase working
- [ ] README documentation complete
- [ ] Usage examples working
- [ ] Accessibility tested
- [ ] Code reviewed (self or peer)

---

### Appendix H: Example Projects Reference

#### ark.alliance.Architect.React.Mermed

**Type**: Diagram editor application
**Complexity**: Very High
**Components to Extract**: 12 components (4 primitives, 2 base, 6 business)

**Key Features**:
- SVG shape rendering (40+ shape types)
- Bezier curve connections
- Drag-and-drop interface
- Properties panel with complex forms
- AI integration (Gemini)
- Mermaid code generation/parsing

**Recommended Decomposition**:

```
PRIMITIVES (Create first):
1. ShapeRenderer - Renders individual SVG shapes
2. ConnectionLine - Draws Bezier connections
3. Handle - Connection point indicator
4. ResizeHandle - Corner resize control

BASE (Create second):
5. DiagramNode - Container for shapes with connectors
6. DiagramCanvas - Pan/zoom canvas with selection

BUSINESS (Create last):
7. DiagramToolbar - Shape palette
8. DiagramPropertiesPanel - Property editor
9. AIChat - AI integration
10. MermaidDiagram - Complete editor
11. MermaidCodeView - Code viewer/editor
12. DiagramExporter - Export functionality
```

**Estimated Total Effort**: 80-120 hours

---

## Conclusion

### Success Criteria

You've successfully completed the component creation process when:

- ✅ **All phases completed** for each component
- ✅ **Zero errors** in TypeScript strict mode
- ✅ **100% test coverage** with all tests passing
- ✅ **WCAG 2.1 AA compliant** accessibility
- ✅ **Component in showcase** and working
- ✅ **Complete documentation** (JSDoc + README)
- ✅ **Library builds** successfully
- ✅ **Code reviewed** and approved

### Getting Help

- **Issues**: Open GitHub issue in Ark.Alliance.React.Component.UI repository
- **Questions**: Refer to Agents.md first, then troubleshooting section
- **Examples**: Study existing components in library (Button, GenericPanel, DataGrid)

### Next Steps

1. Start with **Phase 1: Analysis** for your source application
2. Follow phases sequentially
3. Create primitives before business components
4. Test thoroughly at each step
5. Document as you go
6. Iterate based on feedback

**Happy Component Building! 🚀**

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-26
**Maintained By**: Armand Richelet-Kleinberg
**For**: Ark.Alliance.React.Component.UI v1.5.0
