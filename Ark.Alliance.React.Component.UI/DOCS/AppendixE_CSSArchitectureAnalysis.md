# UI Library Consolidation - Appendix E: CSS Architecture Analysis

**Companion Document to**: [Analysis_ConsolidateEnhancementImproveUILIBRARY.md](./Analysis_ConsolidateEnhancementImproveUILIBRARY.md)  
**Date**: 2026-01-26  
**Purpose**: CSS/SCSS architecture analysis, SCSS migration plan, responsive design, container queries, and best practices

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [CSS File Inventory](#2-css-file-inventory)
3. [Current Architecture Patterns](#3-current-architecture-patterns)
4. [Component CSS Deep Analysis](#4-component-css-deep-analysis)
5. [Issues and Consolidation Opportunities](#5-issues-and-consolidation-opportunities)
6. [SCSS Migration Plan](#6-scss-migration-plan)
7. [Responsive Design Strategy](#7-responsive-design-strategy)
8. [Container Queries Implementation](#8-container-queries-implementation)
9. [Fluid Typography System](#9-fluid-typography-system)
10. [Recommended SCSS Architecture](#10-recommended-scss-architecture)
11. [Implementation Roadmap](#11-implementation-roadmap)

---

## 1. Executive Summary

### Current State
| Metric | Value |
|--------|-------|
| Total CSS/SCSS files | **73** |
| Format distribution | 72 CSS, 1 SCSS |
| Total lines of CSS | **~6,500+** |
| Components with styling | **47** |

### Key Findings
- ✅ **Consistent naming**: `ark-` prefix + BEM methodology
- ✅ **Theme support**: Most components support dark/light themes
- ⚠️ **Format inconsistency**: Only Button uses SCSS, rest uses CSS
- ⚠️ **Hardcoded colors**: 150+ hardcoded hex values found
- ❌ **No container queries**: Components don't adapt to parent size
- ❌ **No fluid typography**: Fixed font sizes throughout
- ❌ **Duplicate patterns**: Same animations, utilities repeated in 20+ files

### Recommendation
**Migrate all CSS to SCSS** using the 7-1 pattern with:
- Centralized design tokens
- SCSS mixins for common patterns
- Container queries for embedded components
- Fluid typography with `clamp()`
- Mobile-first responsive design

---

## 2. CSS File Inventory

### Complete File List by Category

#### Core Primitives (High Priority for SCSS Migration)
| Component | File | Lines | Themes | Issues |
|-----------|------|-------|--------|--------|
| **Button** | Button.scss | 297 | ✅ | Gold standard - already SCSS |
| **NeonButton** | .css | 66 | ❌ | Minimal, should extend Button |
| **BaseInput** | .css | 97 | ✅ | Hardcoded focus colors |
| **Select** | .css | 228 | ✅ | Good size variants, neon/minimal modes |
| **Toggle** | - | - | - | No CSS file (inline styles?) |
| **Tooltip** | .css | ~80 | ✅ | Standard patterns |

#### Complex Components
| Component | File | Lines | Themes | Issues |
|-----------|------|-------|--------|--------|
| **Modal** | .css | 211 | ✅ | Good variants, needs container queries |
| **Toast** | .css | 425 | ✅ | Excellent, local CSS vars namespace |
| **Panel** | .css | 133 | ✅ | Good padding variants |
| **Header** | .css | 304 | ✅ | Responsive, :root variables |
| **DataGrid** | .css | 239 | ✅ | Complete, sticky headers |

#### Visualization Components
| Component | File | Lines | Themes | Issues |
|-----------|------|-------|--------|--------|
| **FinancialChart** | .css | 292 | ❌ | Dark only, many hardcoded colors |
| **CircularGauge** | .css | 96 | ✅ | Utilities in component CSS |
| **WindowPanel** | .css | 235 | ✅ | Excellent visual modes |

#### Desktop Components
| Component | File | Lines | Themes | Notes |
|-----------|------|-------|--------|-------|
| **DesktopIcon** | .css | ~60 | ✅ | Icon-specific |
| **DesktopPage** | .css | ~100 | ✅ | Layout |
| **StartMenu** | .css | ~150 | ✅ | Complex nested menus |
| **Taskbar** | .css | ~120 | ✅ | Fixed position |
| **WindowPanel** | .css | 235 | ✅ | Resize handles |

---

## 3. Current Architecture Patterns

### 3.1 Naming Convention (CONSISTENT ✅)

All components follow BEM with `ark-` prefix:

```css
/* Block */
.ark-{component}

/* Element */
.ark-{component}__{element}

/* Modifier - variant */
.ark-{component}--{variant}

/* Modifier - size */
.ark-{component}--{size}

/* Modifier - state */
.ark-{component}--{state}
```

### 3.2 Theme Switching (3 METHODS FOUND)

**Method 1: Component modifier (Most Common)**
```css
.ark-data-grid--dark { ... }
.ark-data-grid--light { ... }
```

**Method 2: data-theme attribute**
```css
[data-theme="dark"] .ark-panel { ... }
[data-theme="light"] .ark-panel { ... }
```

**Method 3: Container modifier**
```css
.ark-toast-container--light { ... }
```

> **Recommendation**: Standardize on `[data-theme]` for global theme + component `--dark/--light` for overrides

### 3.3 Size Variant Patterns

**Button.scss (SCSS - Best Practice)**
```scss
$btn-sizes: (
    'xs': ('padding': 0.25rem 0.5rem, 'font-size': 0.75rem),
    'sm': ('padding': 0.375rem 0.75rem, 'font-size': 0.875rem),
    'md': ('padding': 0.5rem 1rem, 'font-size': 0.875rem),
    'lg': ('padding': 0.625rem 1.25rem, 'font-size': 1rem),
    'xl': ('padding': 0.75rem 1.5rem, 'font-size': 1.125rem),
);

@each $size, $config in $btn-sizes {
    &--#{$size} {
        padding: map.get($config, 'padding');
        font-size: map.get($config, 'font-size');
    }
}
```

**Select.styles.css (CSS - Manual)**
```css
.ark-select--sm .ark-select__trigger {
    padding: 0.375rem 0.625rem;
    font-size: 0.8125rem;
}
.ark-select--lg .ark-select__trigger {
    padding: 0.875rem 1rem;
    font-size: 1rem;
}
```

---

## 4. Component CSS Deep Analysis

### 4.1 Button.scss (GOLD STANDARD)

**Strengths:**
- ✅ SCSS maps for size configuration
- ✅ `@each` loops for DRY code generation
- ✅ CSS custom properties with fallbacks
- ✅ Dark mode support
- ✅ `prefers-reduced-motion` accessibility
- ✅ `focus-visible` for keyboard navigation

**Code Quality: 9/10**

### 4.2 Toast.styles.css (EXCELLENT CSS)

**Strengths:**
- ✅ Component-scoped CSS custom properties (`--ark-toast-*`)
- ✅ 6-position animations (left/center/right × top/bottom)
- ✅ Light theme variant
- ✅ Reduced motion support
- ✅ Clear section organization

**Code Quality: 9/10**

### 4.3 WindowPanel.styles.css (EXCELLENT)

**Strengths:**
- ✅ 4 visual modes (neon, glass, minimal, normal)
- ✅ Resize handles for all 8 directions
- ✅ CSS custom properties for theming
- ✅ Focus state styling

**Code Quality: 8/10** (missing reduced-motion)

### 4.4 Select.styles.css (GOOD)

**Strengths:**
- ✅ Size variants (sm, md, lg)
- ✅ Visual variants (neon, minimal)
- ✅ Dropdown animation
- ✅ Keyboard navigation states

**Issues:**
- ❌ Hardcoded colors (`#00d4ff`, `#606080`)
- ❌ No reduced-motion support

**Code Quality: 7/10**

### 4.5 FinancialChart.styles.css (NEEDS WORK)

**Strengths:**
- ✅ Well-organized sections
- ✅ Complex streaming/connected states

**Issues:**
- ❌ Dark theme only (no light mode)
- ❌ 30+ hardcoded hex colors
- ❌ No responsive breakpoints
- ❌ Duplicate spinner animation

**Code Quality: 6/10**

---

## 5. Issues and Consolidation Opportunities

### 5.1 Hardcoded Colors (150+ instances)

**Most Common Hardcoded Colors:**
| Color | Usage | Should Be |
|-------|-------|-----------|
| `#00d4ff` | Primary/Accent | `var(--ark-primary)` |
| `#ef4444` | Error/Danger | `var(--ark-error)` |
| `#22c55e` | Success | `var(--ark-success)` |
| `#f59e0b` | Warning | `var(--ark-warning)` |
| `#6b7280` | Muted text | `var(--ark-text-muted)` |
| `#1f2937` | Dark background | `var(--ark-bg-secondary)` |

### 5.2 Duplicate Animations

| Animation | Files Using | Consolidation Target |
|-----------|-------------|---------------------|
| `spin` / `ark-spin` | Button, NeonButton, FinancialChart, Toast | `_animations.scss` |
| `fade-in/out` | Modal, Toast, Select | `_animations.scss` |
| `slide-up/down` | Modal, Select, Dropdown | `_animations.scss` |

### 5.3 Duplicate Utility Patterns

| Pattern | Components | Consolidation |
|---------|------------|---------------|
| Flex center | 25+ components | `@mixin flex-center` |
| Disabled state | 20+ components | `@mixin disabled-state` |
| Focus ring | 15+ components | `@mixin focus-ring` |
| Glass effect | 5 components | `@mixin glass-effect` |

### 5.4 Missing Responsive Features

| Feature | Current State | Should Have |
|---------|---------------|-------------|
| Container queries | ❌ None | For embedded/iframe usage |
| Fluid typography | ❌ None | `clamp()` for text scaling |
| Mobile breakpoints | Partial | Consistent across all components |
| Touch targets | Inconsistent | 44px minimum |

---

## 6. SCSS Migration Plan

### 6.1 7-1 Folder Structure

```
src/
├── core/
│   └── styles/
│       ├── main.scss                    # Entry point
│       │
│       ├── abstracts/                   # No CSS output
│       │   ├── _index.scss              # Forward all abstracts
│       │   ├── _variables.scss          # Design tokens as SCSS vars
│       │   ├── _functions.scss          # SCSS functions
│       │   ├── _mixins.scss             # Reusable mixins
│       │   └── _placeholders.scss       # Extendable patterns
│       │
│       ├── base/                        # Foundation
│       │   ├── _index.scss
│       │   ├── _reset.scss              # CSS reset/normalize
│       │   ├── _typography.scss         # Base typography
│       │   └── _animations.scss         # Shared @keyframes
│       │
│       ├── tokens/                      # Design tokens
│       │   ├── _index.scss
│       │   ├── _colors.scss             # Color palette
│       │   ├── _spacing.scss            # Spacing scale
│       │   ├── _typography.scss         # Font scales
│       │   ├── _shadows.scss            # Shadow definitions
│       │   └── _breakpoints.scss        # Responsive breakpoints
│       │
│       ├── utilities/                   # Utility classes
│       │   ├── _index.scss
│       │   ├── _layout.scss             # Flex, grid utilities
│       │   ├── _sizing.scss             # Width, height
│       │   └── _states.scss             # Disabled, loading
│       │
│       └── vendors/                     # Third-party
│           └── _normalize.scss
│
└── components/
    └── {Component}/
        └── {Component}.scss             # Component-specific
```

### 6.2 Core Mixins Library

```scss
// abstracts/_mixins.scss

@use 'sass:map';
@use '../tokens' as *;

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT MIXINS
// ═══════════════════════════════════════════════════════════════════════════

@mixin flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

@mixin flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE MIXINS
// ═══════════════════════════════════════════════════════════════════════════

@mixin disabled-state {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

@mixin focus-ring($color: var(--ark-primary)) {
    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba($color, 0.4);
    }
}

@mixin loading-state {
    position: relative;
    color: transparent !important;
    pointer-events: none;
}

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL EFFECT MIXINS
// ═══════════════════════════════════════════════════════════════════════════

@mixin glass-effect($blur: 12px, $opacity: 0.85) {
    background: rgba(15, 23, 42, $opacity);
    backdrop-filter: blur($blur);
    -webkit-backdrop-filter: blur($blur);
}

@mixin neon-glow($color: var(--ark-primary), $intensity: 0.3) {
    box-shadow: 
        0 0 10px rgba($color, $intensity),
        0 0 20px rgba($color, calc($intensity * 0.5));
}

// ═══════════════════════════════════════════════════════════════════════════
// SIZE VARIANT GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

@mixin generate-sizes($component, $sizes-map) {
    @each $size, $config in $sizes-map {
        &--#{$size} {
            @each $property, $value in $config {
                #{$property}: $value;
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE MIXINS
// ═══════════════════════════════════════════════════════════════════════════

@mixin respond-to($breakpoint) {
    @if $breakpoint == 'phone' {
        @media (max-width: 599px) { @content; }
    } @else if $breakpoint == 'tablet' {
        @media (min-width: 600px) and (max-width: 1023px) { @content; }
    } @else if $breakpoint == 'desktop' {
        @media (min-width: 1024px) { @content; }
    } @else if $breakpoint == 'large' {
        @media (min-width: 1440px) { @content; }
    }
}

@mixin mobile-first($breakpoint) {
    @if $breakpoint == 'sm' {
        @media (min-width: 640px) { @content; }
    } @else if $breakpoint == 'md' {
        @media (min-width: 768px) { @content; }
    } @else if $breakpoint == 'lg' {
        @media (min-width: 1024px) { @content; }
    } @else if $breakpoint == 'xl' {
        @media (min-width: 1280px) { @content; }
    } @else if $breakpoint == '2xl' {
        @media (min-width: 1536px) { @content; }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTAINER QUERY MIXIN
// ═══════════════════════════════════════════════════════════════════════════

@mixin container-query($name, $min-width: null, $max-width: null) {
    @if $min-width and $max-width {
        @container #{$name} (min-width: #{$min-width}) and (max-width: #{$max-width}) {
            @content;
        }
    } @else if $min-width {
        @container #{$name} (min-width: #{$min-width}) {
            @content;
        }
    } @else if $max-width {
        @container #{$name} (max-width: #{$max-width}) {
            @content;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════════════════

@mixin reduced-motion {
    @media (prefers-reduced-motion: reduce) {
        animation: none !important;
        transition: none !important;
    }
}

@mixin touch-target($min-size: 44px) {
    min-width: $min-size;
    min-height: $min-size;
}
```

---

## 7. Responsive Design Strategy

### 7.1 Breakpoint System

```scss
// tokens/_breakpoints.scss

$breakpoints: (
    'phone':   (max: 599px),
    'tablet':  (min: 600px, max: 1023px),
    'desktop': (min: 1024px),
    'large':   (min: 1440px),
    'ultra':   (min: 1920px),
);

// Mobile-first breakpoints
$bp-sm:  640px;
$bp-md:  768px;
$bp-lg:  1024px;
$bp-xl:  1280px;
$bp-2xl: 1536px;

// CSS custom properties export
:root {
    --ark-bp-sm: #{$bp-sm};
    --ark-bp-md: #{$bp-md};
    --ark-bp-lg: #{$bp-lg};
    --ark-bp-xl: #{$bp-xl};
    --ark-bp-2xl: #{$bp-2xl};
}
```

### 7.2 Device-Specific Considerations

| Device | Considerations | SCSS Implementation |
|--------|---------------|---------------------|
| **Phone** | Touch targets 44px+, single column, bottom nav | `@include respond-to('phone')` |
| **Tablet** | Hybrid touch/pointer, 2-3 columns | `@include respond-to('tablet')` |
| **Desktop** | Hover states, multi-column, keyboard nav | `@include respond-to('desktop')` |
| **Embedded iframe** | Container queries, no overflow | `container-type: inline-size` |
| **Host applications** | CSS isolation, scoped variables | `.ark-root` wrapper |

### 7.3 Host Application Isolation

```scss
// For embedding in host applications
.ark-root {
    // CSS variable scope
    --ark-primary: #00d4ff;
    --ark-bg-primary: #0f172a;
    
    // Reset inheritance from host
    all: initial;
    font-family: system-ui, sans-serif;
    color: var(--ark-text-primary);
    
    // Contain styles
    contain: layout style;
    
    // Import component styles
    @import 'components';
}
```

---

## 8. Container Queries Implementation

### 8.1 Why Container Queries?

Container queries allow components to adapt based on their **parent container size** rather than viewport. Critical for:
- Embedded in iframe widgets
- Dashboard grid layouts with variable cell sizes
- Host application integration
- Responsive sidebar/main content layouts

### 8.2 Implementation Pattern

```scss
// Component with container query support
.ark-panel {
    // Define as container
    container-type: inline-size;
    container-name: ark-panel;
    
    // Base styles (mobile-first)
    &__body {
        padding: var(--ark-spacing-sm);
    }
    
    // Container query: when panel is 400px+ wide
    @container ark-panel (min-width: 400px) {
        &__body {
            padding: var(--ark-spacing-md);
        }
    }
    
    // Container query: when panel is 600px+ wide
    @container ark-panel (min-width: 600px) {
        &__body {
            padding: var(--ark-spacing-lg);
        }
        
        &__header {
            flex-direction: row;
            gap: var(--ark-spacing-md);
        }
    }
}
```

### 8.3 Container Query Breakpoints

```scss
// tokens/_container-breakpoints.scss

$container-breakpoints: (
    'compact': 280px,   // Minimum widget size
    'small':   400px,   // Sidebar width
    'medium':  600px,   // Half desktop
    'large':   800px,   // Full sidebar
    'full':    1000px,  // Full width
);

// Mixin for container queries
@mixin container($container-name, $size) {
    $width: map.get($container-breakpoints, $size);
    @container #{$container-name} (min-width: #{$width}) {
        @content;
    }
}
```

### 8.4 Components Needing Container Queries

| Component | Container Name | Breakpoints Needed |
|-----------|---------------|-------------------|
| DataGrid | `ark-datagrid` | compact, small, medium, large |
| Panel | `ark-panel` | compact, small, medium |
| Modal | `ark-modal` | small, medium, full |
| Header | `ark-header` | compact, small, medium |
| Toast | `ark-toast` | compact, small |

---

## 9. Fluid Typography System

### 9.1 Fluid Typography with clamp()

```scss
// tokens/_typography.scss

// Fluid type scale using clamp()
// Formula: clamp(min, preferred, max)
// Preferred uses viewport width (vw) or container width (cqi)

:root {
    // Base fluid text sizes
    --ark-text-xs:   clamp(0.625rem, 0.5rem + 0.25vw, 0.75rem);
    --ark-text-sm:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
    --ark-text-base: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
    --ark-text-lg:   clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
    --ark-text-xl:   clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
    --ark-text-2xl:  clamp(1.25rem, 1rem + 1vw, 1.5rem);
    --ark-text-3xl:  clamp(1.5rem, 1.2rem + 1.5vw, 1.875rem);
    --ark-text-4xl:  clamp(1.875rem, 1.5rem + 2vw, 2.25rem);
    
    // Heading scale
    --ark-heading-1: clamp(2rem, 1.5rem + 2.5vw, 3rem);
    --ark-heading-2: clamp(1.5rem, 1.25rem + 1.5vw, 2.25rem);
    --ark-heading-3: clamp(1.25rem, 1rem + 1vw, 1.75rem);
    --ark-heading-4: clamp(1.125rem, 1rem + 0.5vw, 1.5rem);
    --ark-heading-5: clamp(1rem, 0.9rem + 0.25vw, 1.25rem);
    --ark-heading-6: clamp(0.875rem, 0.85rem + 0.125vw, 1rem);
    
    // Line heights
    --ark-leading-tight: 1.25;
    --ark-leading-normal: 1.5;
    --ark-leading-relaxed: 1.75;
}
```

### 9.2 Container-Based Fluid Typography

```scss
// For components that need container-relative typography
.ark-component {
    container-type: inline-size;
    
    &__title {
        // Uses container query units (cqi = 1% of container inline size)
        font-size: clamp(1rem, 0.8rem + 2cqi, 1.5rem);
    }
    
    &__body {
        font-size: clamp(0.75rem, 0.7rem + 1cqi, 1rem);
    }
}
```

### 9.3 Typography Mixins

```scss
// abstracts/_typography-mixins.scss

@mixin fluid-type($min, $preferred-vw, $max) {
    font-size: clamp(#{$min}, calc(#{$min} - 0.125rem + #{$preferred-vw}vw), #{$max});
}

@mixin heading($level) {
    font-size: var(--ark-heading-#{$level});
    font-weight: 600;
    line-height: var(--ark-leading-tight);
}

@mixin body-text($size: 'base') {
    font-size: var(--ark-text-#{$size});
    line-height: var(--ark-leading-normal);
}
```

---

## 10. Recommended SCSS Architecture

### 10.1 Main Entry Point

```scss
// core/styles/main.scss

// 1. Abstracts (no CSS output)
@use 'abstracts' as *;

// 2. Tokens
@use 'tokens';

// 3. Base styles
@use 'base';

// 4. Utilities
@use 'utilities';

// 5. Component imports are done per-component
// (Components import what they need from abstracts)
```

### 10.2 Component SCSS Template

```scss
// components/{Component}/{Component}.scss

@use '../../core/styles/abstracts' as *;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT VARIABLES
// ═══════════════════════════════════════════════════════════════════════════

$component-sizes: (
    'sm': (padding: 0.375rem 0.625rem, font-size: 0.8125rem),
    'md': (padding: 0.5rem 0.875rem, font-size: 0.875rem),
    'lg': (padding: 0.75rem 1rem, font-size: 1rem),
);

// ═══════════════════════════════════════════════════════════════════════════
// BASE STYLES
// ═══════════════════════════════════════════════════════════════════════════

.ark-component {
    // Container query support
    container-type: inline-size;
    container-name: ark-component;
    
    // Base layout
    display: flex;
    
    // ═══════════════════════════════════════════════════════════════════════
    // SIZE VARIANTS
    // ═══════════════════════════════════════════════════════════════════════
    
    @include generate-sizes('component', $component-sizes);
    
    // ═══════════════════════════════════════════════════════════════════════
    // VISUAL VARIANTS
    // ═══════════════════════════════════════════════════════════════════════
    
    &--default { /* base styles */ }
    &--neon { @include neon-glow; }
    &--glass { @include glass-effect; }
    &--minimal { /* minimal styles */ }
    
    // ═══════════════════════════════════════════════════════════════════════
    // THEME VARIANTS
    // ═══════════════════════════════════════════════════════════════════════
    
    &--dark {
        background: var(--ark-bg-dark);
        color: var(--ark-text-dark);
    }
    
    &--light {
        background: var(--ark-bg-light);
        color: var(--ark-text-light);
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // STATES
    // ═══════════════════════════════════════════════════════════════════════
    
    &--disabled { @include disabled-state; }
    &--loading { @include loading-state; }
    
    &:focus-visible { @include focus-ring; }
    
    // ═══════════════════════════════════════════════════════════════════════
    // CONTAINER QUERIES
    // ═══════════════════════════════════════════════════════════════════════
    
    @include container('ark-component', 'small') {
        // Styles for 400px+ container
    }
    
    @include container('ark-component', 'medium') {
        // Styles for 600px+ container
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // RESPONSIVE (VIEWPORT)
    // ═══════════════════════════════════════════════════════════════════════
    
    @include respond-to('phone') {
        @include touch-target;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // ACCESSIBILITY
    // ═══════════════════════════════════════════════════════════════════════
    
    @include reduced-motion;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHILD ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════

.ark-component__header { /* header styles */ }
.ark-component__body { /* body styles */ }
.ark-component__footer { /* footer styles */ }
```

---

## 11. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Create SCSS folder structure following 7-1 pattern
- [ ] Create `abstracts/_mixins.scss` with all shared mixins
- [ ] Create `tokens/` folder with design tokens
- [ ] Create `base/_animations.scss` with shared keyframes
- [ ] Setup build tooling for SCSS compilation

### Phase 2: Core Primitives (Week 2)
- [ ] Convert BaseInput.css → BaseInput.scss
- [ ] Convert Select.css → Select.scss (add container queries)
- [ ] Convert Toggle styles to SCSS
- [ ] Convert Tooltip.css → Tooltip.scss
- [ ] Update NeonButton to extend Button

### Phase 3: Complex Components (Week 3)
- [ ] Convert Modal.css → Modal.scss (add container queries)
- [ ] Convert Toast.css → Toast.scss
- [ ] Convert Panel.css → Panel.scss
- [ ] Convert Header.css → Header.scss (add container queries)
- [ ] Convert DataGrid.css → DataGrid.scss (add container queries)

### Phase 4: Specialized Components (Week 4)
- [ ] Convert FinancialChart.css → FinancialChart.scss
- [ ] Add light theme to FinancialChart
- [ ] Convert WindowPanel.css → WindowPanel.scss
- [ ] Convert Desktop components to SCSS
- [ ] Convert Gauge components to SCSS

### Phase 5: Responsive Enhancement (Week 5)
- [ ] Implement container queries on all components
- [ ] Implement fluid typography
- [ ] Add touch targets for mobile
- [ ] Test in iframe/embedded scenarios
- [ ] Test in host application integration

### Phase 6: Testing & Documentation (Week 6)
- [ ] Cross-browser testing
- [ ] Device testing (phone, tablet, desktop)
- [ ] Accessibility audit
- [ ] Performance audit
- [ ] Documentation update

---

## Summary: Key Recommendations

| Area | Current | Recommended |
|------|---------|-------------|
| **Format** | 72 CSS, 1 SCSS | All SCSS |
| **Structure** | Flat files | 7-1 pattern |
| **Colors** | 150+ hardcoded | CSS variables only |
| **Responsiveness** | Viewport only | Container queries + viewport |
| **Typography** | Fixed sizes | Fluid with clamp() |
| **Theme switching** | Mixed methods | `[data-theme]` + component modifiers |
| **Animations** | Duplicated | Shared `_animations.scss` |
| **Accessibility** | Partial | Full (reduced-motion, focus-visible) |

---

**Referenced by**: [Analysis_ConsolidateEnhancementImproveUILIBRARY.md](./Analysis_ConsolidateEnhancementImproveUILIBRARY.md)
