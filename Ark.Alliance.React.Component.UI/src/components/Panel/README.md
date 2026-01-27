<p align="center">
  <img src="../../assets/Icon.png" alt="Ark Alliance Logo" width="120"/>
</p>

<h1 align="center">Ark.Alliance.React.Component.UI</h1>
<h2 align="center">Panel Component</h2>

<p align="center">
  <strong>Container panel with collapsible sections and multiple variants.</strong>
</p>

---

**Author:** Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5

---

## Overview

The Panel component provides a versatile container with support for titles, collapsible sections, and multiple visual variants.

## Features

- ✨ **Variants** - default, bordered, elevated, glass (using PanelVariantSchema)
- 📐 **Padding** - xs, sm, md, lg, xl (using PaddingSchema) 
- 📁 **Collapsible** - Optional expand/collapse
- 🎨 **Theme Aware** - Dark/light mode
- 🏗️ **Proper Enums** - Uses PanelVariantSchema + PaddingSchema ⭐⭐

---

## Usage Examples

### Basic Panel

```typescript
import { Panel } from '@/components/Panel';

<Panel title="User Settings" variant="bordered">
  <SettingsForm />
</Panel>
```

### Collapsible Panel

```typescript
<Panel
  title="Advanced Options"
  collapsible
  collapsed={false}
  variant="glass"
  padding="lg"
>
  <AdvancedSettings />
</Panel>
```

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | - | Panel title |
| `variant` | `PanelVariant` | `'default'` | Visual variant |
| `collapsible` | `boolean` | `false` | Enable collapse |
| `collapsed` | `boolean` | `false` | Collapsed state |
| `padding` | `Padding` | `'md'` | Padding size |

### PanelVariant (from core/enums)
`'default' | 'bordered' | 'elevated' | 'glass' | 'flat'`

### Padding (from core/enums)
`'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`

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

**Current State**: ⭐⭐ **Perfect - Uses 2 Core Enums!**

```typescript
// Panel.model.ts - ALREADY USING CORE ENUMS ✅
import { PanelVariantSchema, PaddingSchema } from '@core/enums';

variant: PanelVariantSchema.default('default'),
padding: PaddingSchema.default('md'),
```

---

### 💾 CookieHelper Integration

**Opportunity**: Persist collapse states

```typescript
// Remember panel collapse state
const [collapsed, setCollapsed] = usePersistentState(
  `ark-panel-${panelId}-collapsed`,
  false
);
```

---

<p align="center">
  <strong>M2H.IO © 2022 - 2026 • Ark.Alliance Ecosystem</strong>
</p>
