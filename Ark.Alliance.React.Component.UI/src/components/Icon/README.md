# Icon Component

**Module:** `@components/Icon`  
**Purpose:** Unified icon system supporting both internal SVG icons and Font Awesome icons.

---

## Overview

The Icon system provides three components:

1. **`UniversalIcon`** - Recommended unified component (auto-detects source)
2. **`Icon`** - Internal SVG icons from `IconRegistry`
3. **`FAIcon`** - Font Awesome icons

**Recommendation:** Use `UniversalIcon` for all new code - it automatically selects the correct icon source.

---

## Quick Start

```tsx
import { UniversalIcon } from '@components/Icon';

// Auto-detects: uses SVG if available, else Font Awesome
<UniversalIcon name="user" size="md" color="primary" />

// Force Font Awesome with specific style
<UniversalIcon name="github" source="font-awesome" iconStyle="brands" />

// Force internal SVG
<UniversalIcon name="close" source="svg" />
```

---

## Components

### UniversalIcon (Recommended)

Intelligently renders either internal SVG or Font Awesome icons based on availability.

**Props:**
```typescript
interface UniversalIconProps {
    /** Icon name (searches both registries) */
    name: string;
    
    /** Force specific source */
    source?: 'svg' | 'font-awesome' | 'auto'; // default: 'auto'
    
    /** Icon size */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    
    /** Icon color */
    color?: string;
    
    /** Rotation angle */
    rotate?: 0 | 90 | 180 | 270;
    
    /** Font Awesome style (when using FA) */
    iconStyle?: 'solid' | 'regular' | 'light' | 'duotone' | 'brands';
    
    /** Font Awesome animations */
    pulse?: boolean;
    beat?: boolean;
    fade?: boolean;
    bounce?: boolean;
    shake?: boolean;
    
    /** Accessibility */
    ariaLabel?: string;
    title?: string;
}
```

**Examples:**
```tsx
// Basic usage - auto-detects source
<UniversalIcon name="user" size="md" />

// With color and size
<UniversalIcon name="heart" size={24} color="#ef4444" />

// Font Awesome brands
<UniversalIcon 
    name="github" 
    source="font-awesome" 
    iconStyle="brands" 
    size="lg" 
/>

// Animated
<UniversalIcon name="spinner" pulse size="xl" />

// Rotated
<UniversalIcon name="arrow-up" rotate={90} />

// Accessible
<UniversalIcon 
    name="close" 
    ariaLabel="Close dialog"
    size="sm"
/>
```

---

### Icon (Internal SVG)

Direct access to internal SVG icons from `IconRegistry`.

```tsx
import { Icon } from '@components/Icon';

<Icon name="user" size="md" color="primary" />
```

**Registry includes:**
- UI icons (close, menu, search, etc.)
- Navigation icons (arrow-up, arrow-down, chevron-left, etc.)
- Common actions (edit, delete, save, etc.)

---

### FAIcon (Font Awesome)

Direct access to Font Awesome icons.

```tsx
import { FAIcon } from '@components/Icon';

<FAIcon 
    name="github" 
    iconStyle="brands" 
    size="lg" 
    pulse 
/>
```

**Supports:**
- 5 styles: solid, regular, light, duotone, brands
- Animations: pulse, beat, fade, bounce, shake
- Fixed width, borders, pull left/right

---

## UniversalRegistry

Search and list all available icons (SVG + Font Awesome).

```typescript
import { UniversalRegistry } from '@components/Icon';

// Search all icons
const results = UniversalRegistry.search('user');
// Returns: [
//   { source: 'svg', def: { name: 'user', ... } },
//   { source: 'font-awesome', def: { name: 'user', ... } }
// ]

// Get all SVG icons
const svgIcons = UniversalRegistry.getSVGIcons();

// Get all Font Awesome icons
const faIcons = UniversalRegistry.getFAIcons();

// Get Font Awesome by category
const communication = UniversalRegistry.getFAIconsByCategory('communication');

// Get Font Awesome by style
const brands = UniversalRegistry.getFAIconsByStyle('brands');
```

---

## Size Reference

| Size | Pixels | Use Case |
|------|--------|----------|
| `xs` | 12px | Inline text icons |
| `sm` | 16px | Buttons, badges |
| `md` | 20px | Default, general use |
| `lg` | 24px | Headers, emphasis |
| `xl` | 32px | Large displays, hero icons |
| `number` | Custom | Precise control (e.g., `size={18}`) |

---

## Icon Styles (Font Awesome)

| Style | Description | Example |
|-------|-------------|---------|
| `solid` | Filled icons | Most UI icons |
| `regular` | Outlined icons | Lighter alternative |
| `light` | Thin outlines | Minimal aesthetic |
| `duotone` | Two-tone colored | Premium feature |
| `brands` | Brand logos | GitHub, Twitter, etc. |

---

## Animations (Font Awesome)

```tsx
// Spinning animation
<UniversalIcon name="spinner" pulse />

// Beating animation (like a heart)
<UniversalIcon name="heart" beat />

// Fading in/out
<UniversalIcon name="bell" fade />

// Bouncing
<UniversalIcon name="arrow-down" bounce />

// Shaking (alert)
<UniversalIcon name="exclamation-triangle" shake />
```

---

## Custom SVG Icons

### Registering Custom Icons

```typescript
import { IconRegistry } from '@components/Icon';

// Register a new SVG icon
IconRegistry.register({
    name: 'my-custom-icon',
    viewBox: '0 0 24 24',
    path: 'M12 2L2 7...',
    tags: ['custom', 'special'],
    category: 'custom'
});

// Now use it
<UniversalIcon name="my-custom-icon" />
```

### SVG Icon Structure

```typescript
interface IconDefinition {
    name: string;
    viewBox: string;
    path: string | string[]; // Single or multiple paths
    tags?: string[];         // For searching
    category?: string;       // For grouping
}
```

---

## Accessibility

### Always provide labels for icon-only controls:

```tsx
// ❌ Bad - no context for screen readers
<button>
    <UniversalIcon name="close" />
</button>

// ✅ Good - explicit label
<button aria-label="Close dialog">
    <UniversalIcon name="close" ariaLabel="Close" />
</button>

// ✅ Good - visible text
<button>
    <UniversalIcon name="close" />
    <span>Close</span>
</button>
```

---

## Best Practices

1. **Use UniversalIcon** - Let the system choose the best source
2. **Provide aria-labels** - Essential for accessibility
3. **Use semantic sizes** - Prefer `size="md"` over `size={20}` for consistency
4. **Match icon style to UI** - Use consistent iconStyle across your app
5. **Test with screen readers** - Ensure aria-labels are meaningful

---

## Troubleshooting

### Icon not found

```tsx
// Check if icon exists
const results = UniversalRegistry.search('myicon');
console.log(results);

// Force FA if SVG unavailable
<UniversalIcon name="myicon" source="font-awesome" />
```

### Wrong icon rendering

```tsx
// Explicitly set source
<UniversalIcon name="user" source="svg" />        // Force SVG
<UniversalIcon name="user" source="font-awesome" /> // Force FA
```

### Size not working

```tsx
// Use number for exact pixels
<UniversalIcon name="close" size={18} />

// Or use string size keys
<UniversalIcon name="close" size="sm" />
```

---

## Migration Guide

### From separate Icon/FAIcon

**Before:**
```tsx
import { Icon, FAIcon } from '@components/Icon';

<Icon name="user" />
<FAIcon name="github" iconStyle="brands" />
```

**After:**
```tsx
import { UniversalIcon } from '@components/Icon';

<UniversalIcon name="user" />
<UniversalIcon name="github" iconStyle="brands" />
```

---

## Architecture

**Module Structure:**
```
src/components/Icon/
├── Base/Icon/          # Internal SVG component
├── FAIcon/             # Font Awesome component
├── icons/
│   ├── IconRegistry    # SVG icon catalog
│   └── FAIconCatalog   # Font Awesome catalog
├── UniversalIcon.tsx   # Unified component
├── UniversalRegistry.ts # Unified search
└── index.ts            # Exports
```

**Pattern:** MVVM with unified interface layer  
**Dependencies:** Font Awesome (peer)  
**Bundle Impact:** ~8KB (SVG registry) + Font Awesome

---

**M2H.IO (c) 2025 - Ark.Alliance Ecosystem**  
**Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5**
