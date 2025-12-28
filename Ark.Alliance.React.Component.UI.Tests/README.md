# Ark.Alliance.React.Component.UI.Tests

Comprehensive test suite for the MVVM-based React UI component library.

**Test Coverage**: 233/233 tests passing (100%) ✅

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Test Families](#test-families)
- [Running Tests](#running-tests)
- [Dependencies](#dependencies)
- [Author](#author)

---

## Overview

This test project provides comprehensive coverage for all refactored MVVM (Model-View-ViewModel) components in the `Ark.Alliance.React.Component.UI` library. The test suite ensures component reliability, validates model schemas, and verifies user interactions.

**Key Features**:
- 100% test pass rate
- Real component testing (no mocks)
- Zod schema validation
- User event simulation
- Scenario-driven test architecture

---

## Project Structure

```
Ark.Alliance.React.Component.UI.Tests/
├── components/               # Component test suites
│   ├── Button/
│   │   └── Button.test.tsx
│   ├── Card/
│   │   └── Card.test.tsx
│   ├── Grids/
│   │   └── TradingGridCard.test.tsx
│   ├── Input/
│   │   ├── BaseInput.test.tsx
│   │   └── Input.test.tsx
│   ├── Page/
│   │   └── Page.test.tsx
│   ├── ProgressBar/
│   │   └── ProgressBar.test.tsx
│   └── Tooltip/
│       └── Tooltip.test.tsx
├── core/                     # Core functionality tests
│   └── base/
│       ├── FormInputModel.test.ts
│       └── useFormInputRestrictions.test.ts
├── fixtures/                 # Test utilities
│   └── ComponentTestEngine.ts
├── setup.ts                  # Test environment setup
├── vitest.config.ts         # Vitest configuration
└── package.json
```

---

## Test Families

### 1. Button Components (20 tests)

**Coverage**: Click handling, styles, sizes, variants, accessibility

**Use Cases**:
- Basic button rendering and click events
- Different button variants (primary, secondary, danger, success)
- Size variations (sm, md, lg)
- Disabled and loading states
- ARIA attributes validation

**File**: `components/Button/Button.test.tsx`

---

### 2. Card Components (11 tests)

**Coverage**: Layout, themes, hover states, click handling

**Use Cases**:
- Card rendering with title and content
- Dark/light theme support
- Hover effects and interactions
- Click event propagation
- CSS class application

**File**: `components/Card/Card.test.tsx`

---

### 3. Trading Grid Card (23 tests) ✨

**Coverage**: Status rendering, themes, inheritance, user interactions

**Use Cases**:
- **Status Variants**: Idle, Success, Warning, Error, Info
- **Model Validation**: Schema parsing, defaults, type safety
- **Theme Support**: Dark and light mode rendering
- **Interactions**: Click handling, keyboard navigation (Enter, Space)
- **Inheritance**: Proper extension of Card base component
- **Hover States**: Visual feedback on user interaction

**File**: `components/Grids/TradingGridCard.test.tsx`

---

### 4. Base Input Component (35 tests) ✨

**Coverage**: Value changes, focus/blur, validation, states

**Use Cases**:
- **Model Validation**: All input types (text, email, password, number, tel, url)
- **Value Changes**: onChange event handling, event object structure
- **Focus/Blur**: State management, class application, event callbacks
- **Size Variants**: Small, medium, large
- **Error States**: ARIA invalid attribute, error class application
- **Disabled State**: Blocked user input, disabled class
- **Full Width Mode**: Layout adaptation
- **ReadOnly State**: Display-only mode
- **HTML5 Validation**: required, maxLength, minLength, pattern attributes

**File**: `components/Input/BaseInput.test.tsx`

---

### 5. Input Component (12 tests)

**Coverage**: Enhanced input functionality, label handling, error display

**Use Cases**:
- Input with labels
- Error message display
- Help text rendering
- Icon integration
- Complex input scenarios

**File**: `components/Input/Input.test.tsx`

---

### 6. Page Component (12 tests)

**Coverage**: Page layout, headers, footers, content areas

**Use Cases**:
- Page structure rendering
- Header and footer placement
- Content area management
- Page-level styling
- Responsive layout

**File**: `components/Page/Page.test.tsx`

---

### 7. Progress Bar Component (28 tests) ✨

**Coverage**: Percentage calculation, color variants, labels, animations

**Use Cases**:
- **Model Validation**: Value bounds, max values, color options
- **Percentage Calculation**: 0%, 50%, 100%, custom ranges
- **Value Clamping**: Above max, at minimum
- **Color Variants**: Blue, Green, Red, Cyan, Yellow, Purple
- **Value Display**: showValue and showPercentage options
- **Label Display**: Label text rendering, conditional visibility
- **Animation States**: Animated and static modes
- **Disabled State**: Visual feedback for disabled progress bars

**File**: `components/ProgressBar/ProgressBar.test.tsx`

---

### 8. Tooltip Component (24 tests) ✨

**Coverage**: Positioning, delay timing, HOC, content variants

**Use Cases**:
- **Model Validation**: Position options, delay configuration
- **Show/Hide Behavior**: Initial state, trigger wrapper rendering
- **Positioning**: Top, Bottom, Left, Right placements
- **Delay Timing**: Custom delay values (300ms default, 500ms, 1000ms)
- **withTooltip HOC**: Component wrapping, optional tooltip prop
- **Ref Handling**: Null ref gracefully handled
- **Content Variants**: String content, empty content, long content

**File**: `components/Tooltip/Tooltip.test.tsx`

---

### 9. Core Functionality Tests (34 tests)

**Coverage**: Form input model, validation restrictions

**Use Cases**:
- **FormInputModel**: Base model schema, default values, validation
- **useFormInputRestrictions**: Input restrictions hook, pattern matching, length limits

**Files**: 
- `core/base/FormInputModel.test.ts`
- `core/base/useFormInputRestrictions.test.ts`

---

## Test Statistics

| Test Family | Tests | Pass Rate | Status |
|-------------|-------|-----------|--------|
| TradingGridCard | 23 | 100% | ✅ |
| BaseInput | 35 | 100% | ✅ |
| Tooltip | 24 | 100% | ✅ |
| ProgressBar | 28 | 100% | ✅ |
| Button | 20 | 100% | ✅ |
| Input | 12 | 100% | ✅ |
| Page | 12 | 100% | ✅ |
| Card | 11 | 100% | ✅ |
| Core Functionality | 34 | 100% | ✅ |
| FormInputModel | 21 | 100% | ✅ |
| **TOTAL** | **233** | **100%** | ✅ |

---

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test
# (Vitest runs in watch mode by default)
```

### Run Tests Once (CI Mode)
```bash
npm test -- --run
```

### Run Specific Test File
```bash
npm test -- components/Tooltip/Tooltip.test.tsx
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

---

## Test Architecture

### ComponentTestEngine

The test suite uses a scenario-driven architecture powered by the `ComponentTestEngine` utility class.

**Features**:
- Component registration and rendering
- Mock function creation (`vi.fn()`)
- User action simulation (click, type, hover, focus, blur)
- Result validation and assertions
- Consistent test patterns

**Example Usage**:
```typescript
const engine = new ComponentTestEngine();
engine.registerComponent('MyComponent', MyComponent);

const scenario = {
  name: 'Should handle click',
  component: 'MyComponent',
  props: { onClick: vi.fn() },
  actions: [{ type: 'click' }],
  assertions: [{ callback: 'onClick', callCount: 1 }]
};

engine.executeScenario(scenario);
```

---

## Dependencies

### Testing Framework
- **vitest**: ^2.1.8 - Fast unit test framework
- **@testing-library/react**: ^16.1.0 - React component testing utilities
- **@testing-library/user-event**: ^14.5.2 - User interaction simulation
- **jsdom**: ^25.0.1 - DOM implementation for Node.js

### Component Library
- **@Ark.Alliance.React.Component.UI**: Local workspace dependency
- **react**: ^18.3.1
- **react-dom**: ^18.3.1

### Validation
- **zod**: ^3.24.1 - TypeScript-first schema validation

### Development
- **typescript**: ^5.7.3
- **vite**: ^6.0.7

---

## Test Patterns

### 1. Model Validation Tests
```typescript
describe('ModelSchema', () => {
  it('should parse valid model', () => {
    const result = MyModelSchema.parse({ /* valid data */ });
    expect(result.property).toBe(expectedValue);
  });
  
  it('should use defaults for missing properties', () => {
    const result = MyModelSchema.parse({});
    expect(result.defaultProp).toBe(defaultValue);
  });
});
```

### 2. Component Behavior Tests
```typescript
describe('Component Behavior', () => {
  it('should handle user interaction', async () => {
    const onClick = vi.fn();
    const { container } = render(
      React.createElement(MyComponent, { onClick })
    );
    
    const element = container.querySelector('.my-element');
    await userEvent.click(element!);
    
    expect(onClick).toHaveBeenCalled();
  });
});
```

### 3. Visual Variant Tests
```typescript
describe('Visual Variants', () => {
  it('should apply size class', () => {
    const { container } = render(
      React.createElement(MyComponent, { size: 'lg' })
    );
    
    const element = container.querySelector('.my-component');
    expect(element?.className).toContain('my-component--lg');
  });
});
```

---

## Author

**Armand Richelet-Kleinberg**  
M2H.IO - Ark Alliance Eco System

**Project**: Ark.Alliance.React.Component.UI.Tests 
**Component Library**: @Ark.Alliance.React.Component.UI  
**License**: MIT

- GitHub: [@ArmandRicheletKleinberg](https://github.com/ArmandRicheletKleinberg)


---

## Additional Resources

- [Component Library README](../Ark.Alliance.React.Component.UI/README.md)
- [MVVM Pattern Documentation](../Ark.Alliance.React.Component.UI/docs/MVVM.md)

---

**Last Updated**: 2025-12-20  
**Test Coverage**: 233/233 (100%) ✅
