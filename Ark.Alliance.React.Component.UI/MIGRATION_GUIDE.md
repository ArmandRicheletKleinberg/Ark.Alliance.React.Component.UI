# Migration Guide

**Version:** 1.5.0  
**Last Updated:** 2026-01-27

---

## Overview

This guide covers breaking changes and major improvements for migrating existing code to use the latest features of Ark.Alliance.React.Component.UI.

---

## Table of Contents

1. [Enum Consolidation](#enum-consolidation)
2. [SCSS Migration](#scss-migration)
3. [Formatter Integration](#formatter-integration)
4. [Fluid Typography](#fluid-typography)
5. [Accessibility Improvements](#accessibility-improvements)
6. [Container Queries](#container-queries)
7. [Icon System Unification](#icon-system-unification)

---

## Enum Consolidation

**Phase:** 3.1  
**Impact:** Medium  
**Breaking:** No (backwards compatible)

### What Changed

All components now use centralized enums from `@core/enums` instead of component-specific enums.

### Before

```typescript
// Button.model.ts (OLD)
export const ButtonVariant = z.enum(['primary', 'secondary', 'outline']);
export const ButtonSize = z.enum(['sm', 'md', 'lg']);

// Card.model.ts (OLD)  
export const CardVariant = z.enum(['default', 'glass', 'neon']);
```

### After

```typescript
// All components (NEW)
import { ButtonVariantSchema, ComponentSizeSchema, ComponentVariantSchema } from '@core/enums';

// Button uses ButtonVariantSchema + ComponentSizeSchema
// Card uses ComponentVariantSchema  
// All sizes use ComponentSizeSchema (xs, sm, md, lg, xl)
```

### Migration Steps

1. **Remove custom enum imports** from component files
2. **Import from `@core/enums`** instead
3. **Use centralized schemas** for validation
4. **No runtime changes needed** - schemas are backwards compatible

### Benefits

- ✅ Single source of truth
- ✅ Consistent sizing across all components
- ✅ Easier to add new variants globally
- ✅ Better TypeScript autocomplete

---

## SCSS Migration

**Phase:** 2.3-3.3, 4.1-4.2  
**Impact:** Low  
**Breaking:** No

### What Changed

All components migrated from inline styles to SCSS with CSS custom properties.

### Components Migrated

**Phase 2.3:**
- Select, Toggle, Tooltip, Badge

**Phase 3:**
- Button hierarchy, Modal, Panel, Header, DataGrid

**Phase 4:**
- FinancialChart, all Gauges, Desktop components (WindowPanel, Taskbar, StartMenu)

### Before

```typescript
// Component using inline styles (OLD)
<div style={{ 
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: '1rem'
}}>
```

### After

```scss
// Component.scss (NEW)
.component {
    background-color: var(--component-bg);
    padding: var(--spacing-md);
    
    [data-theme="dark"] & {
        background-color: var(--component-bg-dark);
    }
}
```

### Migration Steps

1. **No code changes required** - Components automatically use SCSS
2. **Custom themes:** Override CSS variables instead of inline styles
3. **Dark mode:** Controlled via `[data-theme="dark"]` attribute

### Theme Customization

```scss
:root {
    /* Override component variables */
    --component-bg: #your-color;
    --component-text: #your-text;
}

[data-theme="dark"] {
    --component-bg: #your-dark-color;
}
```

---

## Formatter Integration

**Phase:** 4.3  
**Impact:** Medium  
**Breaking:** No

### What Changed

New centralized formatting utilities in `@core/formatters` for consistent number, currency, date, and string formatting.

### DataGrid Column Formatters

**Before:**
```typescript
// Manual formatting (OLD)
<DataGridCell>
    {`$${value.toFixed(2)}`}
</DataGridCell>
```

**After:**
```typescript
import { formatCurrency } from '@core/formatters';

const orderFields: FieldModel[] = [
    {
        fieldKey: 'price',
        displayName: 'Price',
        dataType: 'number',
        formatter: (value) => formatCurrency(value as number, { currency: 'USD' }),
    },
];
```

### Available Formatters

| Formatter | Purpose | Example |
|-----------|---------|---------|
| `formatNumber` | Locale-specific numbers | `1,234.56` |
| `formatCurrency` | Multi-currency | `$1,234.56`, `€1.234,56` |
| `formatDate` | Date/time/relative | `Jan 27, 2026`, `2 hours ago` |
| `formatBytes` | File sizes | `1.5 MB` |
| `formatPercentage` | Percentages | `12.34%` |

### React Hook

```typescript
import { useFormatter } from '@core/formatters';

function Component() {
    const { currency, date, number } = useFormatter({
        locale: 'en-US',
        currency: 'USD'
    });

    return (
        <div>
            <p>Price: {currency(product.price)}</p>
            <p>Created: {date(product.createdAt, { dateStyle: 'medium' })}</p>
        </div>
    );
}
```

### Migration Steps

1. **Replace manual formatting** with `@core/formatters` functions
2. **Add `formatter` property** to DataGrid field definitions
3. **Use `useFormatter()` hook** in React components for consistent locale

### Benefits

- ✅ Locale-aware formatting
- ✅ Consistent across all components
- ✅ Multi-currency support
- ✅ Relative time formatting
- ✅ Type-safe with TypeScript

---

## Fluid Typography

**Phase:** 5.1  
**Impact:** Low  
**Breaking:** No

### What Changed

Header, Panel, and Carousel now use `clamp()` for responsive typography that scales smoothly from mobile to desktop.

### Before

```scss
/* Fixed font sizes (OLD) */
.header__title {
    font-size: 1.5rem; /* Always 24px */
}
```

### After

```scss
/* Fluid typography (NEW) */
.header__title {
    font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
    /* Scales from 16px (mobile) to 24px (desktop) */
}
```

### Components Updated

- **Header:** title, subtitle, description
- **Panel:** header text
- **Carousel:** titles (already had clamp)

### Migration Steps

**No action required** - Typography scales automatically. To override:

```scss
.custom-header__title {
    font-size: 2rem; /* Fixed size override */
}
```

### Benefits

- ✅ Better mobile readability
- ✅ Smooth scaling across viewports
- ✅ No media query breakpoints needed
- ✅ Improved responsive design

---

## Accessibility Improvements

**Phase:** 5.3  
**Impact:** Medium  
**Breaking:** No

### Touch Targets (WCAG 2.1 AA)

All buttons now enforce **44x44px minimum** touch target size.

**Before:**
```scss
/* Small buttons (OLD) */
.button--sm {
    min-height: 32px; /* ❌ Below WCAG minimum */
}
```

**After:**
```scss
/* All buttons (NEW) */
.ark-btn {
    min-width: 44px;  /* ✅ WCAG 2.1 AA */
    min-height: 44px; /* ✅ WCAG 2.1 AA */
}
```

### Size Recommendations

| Context | Recommended Size | Reason |
|---------|-----------------|--------|
| Touch interfaces (mobile, tablets) | `lg` or `xl` | Best usability |
| Desktop only (data tables, toolbars) | `sm` or `md` | Space efficiency |
| Hybrid apps (responsive) | `lg` | Safe default |

### Reduced Motion

All components respect `prefers-reduced-motion`:

```scss
@media (prefers-reduced-motion: reduce) {
    .component {
        transition: none;
        animation: none;
    }
}
```

**Affected components:** Button, Toast, Carousel, RoleBadge, MarkdownRenderer, and more.

### Migration Steps

1. **Touch apps:** Update primary buttons from `size="md"` to `size="lg"`
2. **Desktop-only:** No changes needed
3. **Test:** Verify touch targets meet 44px minimum

---

## Container Queries

**Phase:** 5.2  
**Impact:** Low  
**Breaking:** No

### What Changed

Modal and DataGrid now use CSS container queries for responsive behavior based on container size, not viewport size.

### Before

```scss
/* Viewport-based (OLD) */
@media (max-width: 768px) {
    .modal {
        width: 100%;
    }
}
```

### After

```scss
/* Container-based (NEW) */
.modal {
    container-type: inline-size;
}

@container (max-width: 768px) {
    .modal__content {
        padding: 1rem;
    }
}
```

### Benefits

- ✅ Responsive to parent container, not viewport
- ✅ Works in sidebars, panels, embedded contexts
- ✅ Better component encapsulation

### Migration Steps

**No action required** - Container queries work automatically. Components adapt to their container size.

---

## Icon System Unification

**Phase:** 2.2  
**Impact:** Low  
**Breaking:** No

### What Changed

New `UniversalIcon` component automatically detects whether to use internal SVG or Font Awesome icons.

### Before

```typescript
// Separate components (OLD)
import { Icon, FAIcon } from '@components/Icon';

<Icon name="user" />
<FAIcon name="github" iconStyle="brands" />
```

### After

```typescript
// Unified component (NEW)
import { UniversalIcon } from '@components/Icon';

<UniversalIcon name="user" />
<UniversalIcon name="github" iconStyle="brands" />
```

### Auto-Detection

`UniversalIcon` searches both registries:
1. Internal SVG icons first
2. Falls back to Font Awesome if not found

### Force Specific Source

```typescript
// Force internal SVG
<UniversalIcon name="close" source="svg" />

// Force Font Awesome
<UniversalIcon name="github" source="font-awesome" iconStyle="brands" />
```

### Migration Steps

1. **Replace `Icon`/`FAIcon` imports** with `UniversalIcon`
2. **Remove `source` checks** - handled automatically
3. **Keep Font Awesome props** - still supported (`iconStyle`, `pulse`, etc.)

### Benefits

- ✅ Single component for all icons
- ✅ Automatic source detection
- ✅ Backward compatible
- ✅ Cleaner code

---

## Breaking Changes Summary

### None!

All changes are **backward compatible**. Existing code continues to work without modifications.

### Recommended Updates

1. ✅ Update Button sizes for touch interfaces (`lg` or `xl`)
2. ✅ Adopt `UniversalIcon` for new code
3. ✅ Use `@core/formatters` for new formatting needs
4. ✅ Leverage centralized enums for new components

---

## Version History

### v1.5.0 (2026-01-27)
- ✅ Formatter Core Module (Phase 4.3)
- ✅ Fluid Typography (Phase 5.1)
- ✅ Touch Target Accessibility (Phase 5.3)
- ✅ Icon System README

### v1.4.0 (2026-01)
- ✅ Enum Consolidation (Phase 3.1)
- ✅ SCSS Migration (Phases 2.3-4.2)
- ✅ Container Queries (Phase 5.2)
- ✅ UniversalIcon (Phase 2.2)

---

## Support

For questions or issues:
- Check component READMEs in `src/components/[Component]/README.md`
- Review formatters documentation: `src/core/formatters/README.md`
- Consult Icon guide: `src/components/Icon/README.md`

---

**M2H.IO (c) 2025 - Ark.Alliance Ecosystem**  
**Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5**
