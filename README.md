# Ark.Alliance.React.Component.UI

**Enterprise-Grade React Component Library with MVVM Architecture**

A comprehensive, institutional-quality UI component library built with React, TypeScript, and Zod validation. Designed for large-scale trading applications with premium neon aesthetics and complete MVVM separation.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [MVVM Architecture](#mvvm-architecture)
3. [Project Structure](#project-structure)
4. [Component Categories](#component-categories)
5. [Installation](#installation)
6. [Usage Examples](#usage-examples)
7. [Showcase Dashboard](#showcase-dashboard)
8. [Dependencies](#dependencies)
9. [Contributing](#contributing)
10. [Author](#author)

---

## Overview

Ark.Alliance.React.Component.UI is a professionally crafted component library featuring:

- **MVVM Pattern**: Clear separation of Model, ViewModel, and View
- **Zod Validation**: Runtime type safety with schema-based validation
- **Premium Aesthetics**: Neon, minimal, and glass visual modes
- **Enterprise Ready**: TypeScript strict mode, accessibility, responsive design
- **Showcase Dashboard**: Interactive component explorer at `localhost:5090`

---

## MVVM Architecture

### Pattern Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        VIEW (*.tsx)                         │
│  - React Component with forwardRef/memo                     │
│  - Renders UI based on ViewModel state                      │
│  - Dispatches user actions to ViewModel                     │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Uses Hook
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   VIEWMODEL (*.viewmodel.ts)                │
│  - Custom React Hook (useComponent)                         │
│  - State management (useState, useCallback)                 │
│  - Event handling and business logic                        │
│  - Returns { model, state, handlers }                       │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Extends
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      MODEL (*.model.ts)                     │
│  - Zod Schema definition                                    │
│  - TypeScript types inferred from schema                    │
│  - Default values and factory functions                     │
│  - Extends BaseModelSchema                                  │
└─────────────────────────────────────────────────────────────┘
```

### Base Classes

| Class | Purpose |
|-------|---------|
| `BaseModelSchema` | Common props: id, disabled, loading, className, testId, ariaLabel |
| `useBaseViewModel` | Lifecycle, state, events, async execution |
| `extendSchema()` | Utility to extend base with component-specific fields |

### Example MVVM Flow

```typescript
// 1. MODEL - Define schema and types
export const ButtonModelSchema = extendSchema({
    variant: z.enum(['primary', 'danger']).default('primary'),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
});
export type ButtonModel = z.infer<typeof ButtonModelSchema>;

// 2. VIEWMODEL - Create hook with state logic
export function useButton(options: UseButtonOptions): UseButtonResult {
    const base = useBaseViewModel<ButtonModel>(defaultModel, options);
    const buttonClasses = useMemo(() => buildClasses(base.model), [base.model]);
    return { ...base, buttonClasses };
}

// 3. VIEW - Render component
export const Button = memo(forwardRef((props, ref) => {
    const vm = useButton(props);
    return <button ref={ref} className={vm.buttonClasses}>{children}</button>;
}));
```

---

## Project Structure

```
Ark.Alliance.React.Component.UI/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root component (loads Showcase)
│   ├── index.ts                    # Library barrel export
│   ├── index.css                   # Global styles + Tailwind
│   │
│   ├── core/                       # Foundation
│   │   ├── base/                   # BaseModel, BaseViewModel
│   │   ├── events/                 # Event bus system
│   │   └── styles/                 # Color constants
│   │
│   ├── components/                 # Component library
│   │   ├── Buttons/                # NeonButton
│   │   ├── Toggles/                # NeonToggle
│   │   ├── Cards/                  # GlowCard
│   │   ├── Gauges/                 # Circular, Speedometer, Digital, etc.
│   │   ├── Input/                  # Input, Select, TextArea, Slider, NumericInput, FileUpload
│   │   ├── Chart3D/                # 3D visualization with Three.js
│   │   ├── Modal/                  # Modal dialog
│   │   ├── ProgressBar/            # Linear progress
│   │   ├── Header/                 # Enhanced header
│   │   ├── Footer/                 # Footer with paging
│   │   ├── Panel/                  # Container panel
│   │   ├── Grids/                  # DataGrid, TradingGridCard
│   │   ├── SideBar/                # SideBarMenu
│   │   ├── Label/                  # StatusBadge
│   │   ├── Documents/              # MarkdownRenderer
│   │   └── TimeLines/              # Timeline
│   │
│   └── showcase/                   # Interactive dashboard
│       ├── ShowcaseApp.tsx         # Main showcase component
│       ├── componentRegistry.tsx   # Component definitions
│       ├── showcase.css            # Dashboard styles
│       └── index.ts                # Exports
│
├── vite.config.ts                  # Vite config (port 5090)
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## Component Categories

### Core Components (21 Implemented)

| Category | Components | Description |
|----------|------------|-------------|
| **Buttons** | `NeonButton` | Premium button with glow effects and variants |
| **Toggles** | `NeonToggle` | Switch with neon styling and colors |
| **Cards** | `GlowCard` | Status-based card with hover effects |
| **Gauges** | `CircularGauge`, `SpeedometerGauge`, `DigitalGauge`, `BatteryGauge`, `SignalBarsGauge` | Data visualization gauges |
| **Input** | `Input`, `Select`, `TextArea`, `Slider`, `NumericInput`, `FileUpload` | Form inputs with validation |
| **Charts** | `Chart3D` | 3D visualization with Cuboid, Cylinder, Bubble, Candle shapes |
| **Modal** | `Modal` | Dialog with portal, backdrop, escape |
| **ProgressBar** | `ProgressBar` | Linear progress with animations |
| **Header** | `Header` | Visual modes, icons, search, backgrounds |
| **Footer** | `Footer` | Paging controls, slots |
| **Panel** | `Panel` | Container with header/footer slots |
| **Grids** | `DataGrid`, `TradingGridCard` | Data tables |
| **SideBar** | `SideBarMenu` | Navigation menu with categories |
| **Label** | `StatusBadge` | Status indicator with pulse |
| **Documents** | `MarkdownRenderer` | Render markdown content |
| **TimeLines** | `Timeline` | Event timeline display |

### Visual Modes (All Components)

| Mode | Description |
|------|-------------|
| `normal` | Standard appearance |
| `neon` | Glowing borders and gradients |
| `minimal` | Reduced visual weight |
| `glass` | Glassmorphism with backdrop blur |

---

## Installation

```bash
# Clone repository
git clone https://github.com/ArmandRicheletKleinberg/Ark.Alliance.Trading.Bot-React.git

# Navigate to library
cd Ark.Alliance.React.Component.UI

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Usage Examples

### NeonButton

```tsx
import { NeonButton } from '@ark/components';

<NeonButton 
    variant="primary"
    size="lg"
    onClick={() => console.log('Clicked!')}
>
    Click Me
</NeonButton>
```

### GlowCard

```tsx
import { GlowCard } from '@ark/components';

<GlowCard
    title="Trading Status"
    subtitle="Active positions"
    status="success"
    visualMode="neon"
>
    Card content here
</GlowCard>
```

### Header with Search

```tsx
import { Header } from '@ark/components';

<Header
    title="Dashboard"
    subtitle="Real-time data"
    icon="📊"
    visualMode="neon"
    showSearch
    onSearchChange={(value) => setFilter(value)}
    actions={<NeonButton>New</NeonButton>}
/>
```

### Footer with Paging

```tsx
import { Footer } from '@ark/components';

<Footer
    showPaging
    paging={{
        currentPage: 1,
        totalPages: 10,
        totalItems: 250,
        pageSize: 25,
    }}
    onPageChange={(page) => setPage(page)}
/>
```

### Select Dropdown

```tsx
import { Select } from '@ark/components';

<Select
    label="Choose option"
    options={[
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
    ]}
    value={selected}
    onChange={(value) => setSelected(value)}
    searchable
/>
```

### CircularGauge

```tsx
import { CircularGauge } from '@ark/components';

<CircularGauge
    value={75}
    max={100}
    label="Progress"
    showValue
    colorStart="#00d4ff"
    colorEnd="#7c3aed"
/>
```

---

## Showcase Dashboard

Interactive component explorer available at http://localhost:5090

```bash
npm run dev
```

Features:
- **Sidebar Navigation**: Browse all component families
- **Live Preview**: See components with real-time updates
- **Property Editor**: Modify props interactively
- **Style Presets**: Quick apply preset configurations
- **Code Export**: Copy usage code

---

## Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.0.0 | UI framework |
| `react-dom` | 19.0.0 | DOM rendering |
| `zod` | 3.x | Schema validation |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5.6.x | Type safety |
| `vite` | 5.x | Build tool |
| `@tailwindcss/vite` | 4.x | Tailwind CSS v4 |
| `eslint` | 9.x | Linting |

---

## Contributing

1. Follow MVVM pattern for all components
2. Use `extendSchema()` for models
3. Include JSDoc documentation
4. Add component to Showcase registry
5. Ensure zero TypeScript errors

---

## Author

**Armand Richelet-Kleinberg**

*Software Architect & Developer*

- GitHub: [@ArmandRicheletKleinberg](https://github.com/ArmandRicheletKleinberg)
- Project: Ark.Alliance

---

## License

Mit - All Rights Reserved

© 2024 - 2025 Armand Richelet-Kleinberg
