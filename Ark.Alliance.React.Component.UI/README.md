# Ark.Alliance.React.Component.UI

**Enterprise-Grade React Component Library with MVVM Architecture**

A comprehensive, institutional-quality UI component library built with React, TypeScript, and Zod validation. Designed for large-scale trading applications with premium neon aesthetics and complete MVVM separation.

[![npm version](https://img.shields.io/npm/v/ark-alliance-react-ui.svg)](https://www.npmjs.com/package/ark-alliance-react-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-19.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [MVVM Architecture](#mvvm-architecture)
3. [Project Structure](#project-structure)
4. [Component Categories](#component-categories)
5. [Installation](#installation)
6. [Usage Examples](#usage-examples)
7. [Testing](#testing)
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
- **Comprehensive Testing**: Vitest + React Testing Library

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

---

## Project Structure

```
Ark.Alliance.React.Component.UI/
├── src/
│   ├── index.ts                    # Library barrel export
│   ├── index.css                   # Global styles + Tailwind
│   │
│   ├── core/                       # Foundation
│   │   ├── base/                   # BaseModel, BaseViewModel
│   │   ├── enums/                  # Centralized enums (Color, Size, Status, Variant)
│   │   ├── events/                 # Event bus system
│   │   ├── services/               # Utility services
│   │   └── theme/                  # Theme configuration
│   │
│   ├── components/                 # Component library
│   │   ├── Buttons/                # Button, NeonButton
│   │   ├── Input/                  # NeonInput, NumericInput, Select, Slider, TextArea, FileUpload, TextEditor
│   │   ├── Gauges/                 # CircularGauge, SpeedometerGauge, DigitalGauge, BatteryGauge, SignalBarsGauge
│   │   ├── Charts/                 # FinancialChart, TrendPriceChart
│   │   ├── Grids/                  # DataGrid, ProjectGrid
│   │   ├── Panel/                  # Container panel
│   │   ├── Modal/                  # Modal dialog
│   │   ├── Label/                  # StatusBadge
│   │   ├── TimeLines/              # Timeline, TestTimeline
│   │   └── ...                     # Additional component families
│   │
│   ├── Helpers/                    # Utility functions
│   └── test/                       # Test setup
│
├── vite.config.ts                  # Vite config with library build
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies & scripts
└── README.md                       # This file
```

---

## Component Categories

### Core Components

| Category | Components | Description |
|----------|------------|-------------|
| **Buttons** | `Button`, `NeonButton` | Premium buttons with glow effects |
| **Input** | `NeonInput`, `NumericInput`, `Select`, `Slider`, `TextArea`, `FileUpload`, `TextEditor` | Form inputs with validation |
| **Gauges** | `CircularGauge`, `SpeedometerGauge`, `DigitalGauge`, `BatteryGauge`, `SignalBarsGauge` | Data visualization gauges |
| **Charts** | `FinancialChart`, `TrendPriceChart` | Financial data visualization |
| **Grids** | `DataGrid`, `ProjectGrid` | Data tables and grids |
| **Panel** | `Panel` | Container with header/footer slots |
| **Modal** | `Modal` | Dialog with portal, backdrop, escape |
| **Label** | `StatusBadge`, `RoleBadge`, `DepartmentBadge` | Status indicators, role badges, department tags |
| **TimeLines** | `Timeline` | Event timeline display |
| **TreeView** | `TreeView`, `OrgChart`, `OrgChartNode` | Tree structures and organizational charts |

### Visual Modes

| Mode | Description |
|------|-------------|
| `normal` | Standard appearance |
| `neon` | Glowing borders and gradients |
| `minimal` | Reduced visual weight |
| `glass` | Glassmorphism with backdrop blur |

---

## Installation

### From npm

```bash
npm install ark-alliance-react-ui
```

### Usage

```tsx
import { Button, NeonInput, CircularGauge } from 'ark-alliance-react-ui';
import 'ark-alliance-react-ui/styles';

function App() {
  return (
    <Button variant="primary" size="lg">
      Click Me
    </Button>
  );
}
```

### From Source

```bash
# Clone repository
git clone https://github.com/ArmandRicheletKleinberg/Ark.Alliance.React.Component.UI.git

# Navigate to library
cd Ark.Alliance.React.Component.UI/Ark.Alliance.React.Component.UI

# Install dependencies
npm install

# Build library
npm run build:lib
```

---

## Usage Examples

### NeonInput

```tsx
import { NeonInput } from 'ark-alliance-react-ui';

<NeonInput
  label="Username"
  placeholder="Enter username..."
  glowColor="cyan"
  size="md"
  validationFormat="email"
/>
```

### CircularGauge

```tsx
import { CircularGauge } from 'ark-alliance-react-ui';

<CircularGauge
  value={75}
  max={100}
  label="Progress"
  showValue
  colorStart="#00d4ff"
  colorEnd="#7c3aed"
/>
```

### FinancialChart

```tsx
import { FinancialChart } from 'ark-alliance-react-ui';

<FinancialChart
  candlestickData={data}
  fastMA={{ enabled: true, period: 7, color: '#22c55e' }}
  slowMA={{ enabled: true, period: 25, color: '#ef4444' }}
/>
```

### RoleBadge (v1.2.0)

```tsx
import { RoleBadge } from 'ark-alliance-react-ui';

// Simple usage
<RoleBadge role="admin" />

// With size and removable
<RoleBadge role="supervisor" size="lg" removable onRemove={() => handleRemove()} />
```

### OrgChart (v1.2.0)

```tsx
import { OrgChart } from 'ark-alliance-react-ui';

<OrgChart
  rootNodes={[{
    id: '1',
    name: 'CEO',
    position: 'Chief Executive Officer',
    children: [
      { id: '2', name: 'CTO', position: 'Chief Technology Officer' }
    ]
  }]}
  onNodeClick={(id) => navigate(`/team/${id}`)}
/>
```

---

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

The library uses **Vitest** with **React Testing Library** for component testing.

### Test Coverage (v1.2.0+)

| Component | Tests | Coverage |
|-----------|-------|----------|
| RoleBadge | 10 tests | Rendering, styling, remove functionality, accessibility |
| DepartmentBadge | 8 tests | Rendering, icons, known departments, styling |
| OrgChart | 8 tests | Empty state, rendering, interactions, accessibility |
| OrgChartNode | 8 tests | Rendering, avatars, clicks, keyboard navigation |

---

## Dependencies

### Peer Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.0.0 \|\| ^19.0.0 | UI framework |
| `react-dom` | ^18.0.0 \|\| ^19.0.0 | DOM rendering |
| `zod` | ^3.0.0 \|\| ^4.0.0 | Schema validation |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ~5.9.x | Type safety |
| `vite` | ^7.x | Build tool |
| `vitest` | latest | Testing |
| `@tailwindcss/vite` | ^4.x | Tailwind CSS v4 |

---

## Contributing

1. Follow MVVM pattern for all components
2. Use `extendSchema()` for models
3. Include TSDoc documentation
4. Write tests for new components
5. Ensure zero TypeScript errors

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

---

## Author

**Armand Richelet-Kleinberg**  
M2H.IO - Ark Alliance Ecosystem

- GitHub: [@ArmandRicheletKleinberg](https://github.com/ArmandRicheletKleinberg)
- Package: [ark-alliance-react-ui](https://www.npmjs.com/package/ark-alliance-react-ui)

**License**: MIT

---
