<p align="center">
  <img src="../../assets/Icon.png" alt="Ark Alliance Logo" width="120"/>
</p>

<h1 align="center">Ark.Alliance.React.Component.UI</h1>
<h2 align="center">GenericPanel Component</h2>

<p align="center">
  <strong>Advanced panel with glass morphism, gradients, grids, and custom theming.</strong>
</p>

---

**Author:** Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5

---

## Overview

The GenericPanel is an enhanced panel component with advanced styling capabilities including glassmorphism, gradient backgrounds, grid overlays, glow effects, and multiple layout modes.

## Features

- ✨ **All Panel Features** - Extends base Panel functionality
- 🔮 **Glassmorphism** - Blur and translucency effects
- 🌈 **Gradients** - Custom gradient backgrounds
- 📊 **Grid Overlay** - Tech-style grid patterns
- ✨ **Glow Effects** - Ambient lighting
- 📐 **Layout Modes** - inline, sidebar-left, sidebar-right, fullscreen
- 🎨 **Full Customization** - Colors, shadows, opacity
- 🏗️ **Proper Enums** - Uses PanelVariantSchema + PaddingSchema ⭐⭐

---

## Usage Examples

###Glass Panel

```typescript
import { GenericPanel } from '@/components/GenericPanel';

<GenericPanel
  title="Dashboard"
  variant="glass"
  glassBlur={20}
  shadowIntensity={40}
>
  <DashboardContent />
</GenericPanel>
```

### Gradient with Grid

```typescript
<GenericPanel
  useGradient
  gradientStart="#667eea"
  gradientEnd="#764ba2"
  gradientDirection={135}
  showGrid
  gridColor="rgba(255,255,255,0.1)"
  gridSize={30}
>
  <TechContent />
</GenericPanel>
```

### Sidebar Layout

```typescript
<GenericPanel
  layout="sidebar-left"
  sidebarWidth={280}
  scrollable
  minHeight={600}
>
  <Navigation />
</GenericPanel>
```

---

## Properties

### Basic Properties (from Panel)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | - | Panel title |
| `variant` | `PanelVariant` | `'default'` | Visual variant |
| `collapsible` | `boolean` | `false` | Enable collapse |
| `padding` | `Padding` | `'md'` | Padding size |

### Advanced Styling

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `glassBlur` | `number` | `0` | Blur intensity (0-40px) |
| `shadowIntensity` | `number` | `20` | Shadow % (0-100) |
| `borderRadius` | `number` | `8` | Border radius (px) |
| `opacity` | `number` | `100` | Opacity % (0-100) |

### Gradient

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `useGradient` | `boolean` | `false` | Enable gradient |
| `gradientStart` | `string` | - | Start color |
| `gradientEnd` | `string` | - | End color |
| `gradientDirection` | `number` | `135` | Direction (degrees) |

### Effects

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showGrid` | `boolean` | `false` | Show grid overlay |
| `gridColor` | `string` | - | Grid color |
| `gridSize` | `number` | `20` | Grid cell size (px) |
| `showGlow` | `boolean` | `false` | Ambient glow |
| `glowColor` | `string` | - | Glow color |

### Layout

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `layout` | `PanelLayout` | `'inline'` | Layout mode |
| `sidebarWidth` | `number` | `320` | Sidebar width (px) |
| `scrollable` | `boolean` | `false` | Scrollable content |
| `minHeight` | `number` | - | Min height (px) |
| `maxHeight` | `number` | - | Max height (px) |

---

## Dependencies

### Core Modules
- `core/base`: extendSchema
- `core/enums`: ⭐⭐
  - `PanelVariantSchema`
  - `PaddingSchema`

---

## Recommended Improvements

### ✅ Enum Usage - EXEMPLARY

**Current State**: ⭐⭐ **Perfect - Uses Core Enums!**

```typescript
// GenericPanel.model.ts - ALREADY USING CORE ENUMS ✅
import { PanelVariantSchema, PaddingSchema } from '@core/enums';

variant: PanelVariantSchema.default('default'),
padding: PaddingSchema.default('md'),
```

**Note**: `PanelLayoutSchema` is component-specific (not in core) - acceptable for specialized layouts.

---

### 💾 CookieHelper Integration

**Opportunity**: Persist customizations

```typescript
// Remember panel styling preferences
const [glassBlur] = usePersistentState('ark-panel-glass-blur', 20);
const [layout] = usePersistentState('ark-panel-layout', 'inline');
```

---

<p align="center">
  <strong>M2H.IO © 2022 - 2026 • Ark.Alliance Ecosystem</strong>
</p>
