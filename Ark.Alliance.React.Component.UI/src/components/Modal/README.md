<p align="center">
  <img src="../../assets/Icon.png" alt="Ark Alliance Logo" width="120"/>
</p>

<h1 align="center">Ark.Alliance.React.Component.UI</h1>
<h2 align="center">Modal Component</h2>

<p align="center">
  <strong>Dialog overlay with animations, backdrop, and keyboard controls.</strong>
</p>

---

**Author:** Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5

---

## Overview

The Modal component provides dialog overlays with support for multiple sizes, animations, backdrop click handling, and keyboard controls.

## Features

- ✨ **4 Sizes** - xs, sm, md, lg, xl (using ModalSizeSchema)
- 🎨 **Variants** - default, glass, bordered, elevated
- 🎬 **Animations** - Smooth enter/exit transitions
- ⌨️ **Keyboard** - ESC to close, focus trapping
- 🖱️ **Backdrop** - Click-to-close with option to disable
- ♿ **Accessible** - ARIA roles, focus management
- 🏗️ **Proper Enums** - Uses ModalSizeSchema ⭐

---

## Usage Examples

### Basic Modal

```typescript
import { Modal } from '@/components/Modal';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to continue?</p>
</Modal>
```

### Glass Variant

```typescript
<Modal
  isOpen={isOpen}
 onClose={handleClose}
  title="Settings"
  variant="glass"
  size="lg"
  centered
/>
```

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Modal open state |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `subtitle` | `string` | - | Subtitle text |
| `size` | `ModalSize` | `'md'` | Size variant |
| `variant` | `Variant` | `'default'` | Visual variant |
| `showClose` | `boolean` | `true` | Show close button |
| `closeOnBackdrop` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on ESC key |
| `centered` | `boolean` | `true` | Vertically center |

### ModalSize (from core/enums)
`'xs' | 'sm' | 'md' | 'lg' | 'xl'`

---

## Dependencies

### Core Modules
- `core/base`: extendSchema
- `core/enums`: ⭐
  - `ModalSizeSchema`

---

## Recommended Improvements

### ✅ Enum Usage - EXEMPLARY

**Current State**: ⭐ **Perfect - Uses ModalSizeSchema!**

```typescript
// Modal.model.ts - ALREADY USING CORE ENUMS ✅
import { ModalSizeSchema } from '@core/enums';

size: ModalSizeSchema.default('md'),
```

---

### 🎨 Theme Integration

**Recommendation**: Add theme hook

```typescript
import { useTheme } from '@core/theme';

export function useModal(options) {
  const { resolvedMode } = useTheme();
  const isDark = options.isDark ?? (resolvedMode === 'dark');
}
```

---

<p align="center">
  <strong>M2H.IO © 2022 - 2026 • Ark.Alliance Ecosystem</strong>
</p>
