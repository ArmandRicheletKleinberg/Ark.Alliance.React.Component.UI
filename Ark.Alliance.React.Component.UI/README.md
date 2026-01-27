# Ark.Alliance.React.Component.UI

**Enterprise-Grade React Component Library with MVVM Architecture**

A comprehensive, institutional-quality UI component library built with React, TypeScript, and Zod validation. Designed for large-scale trading applications with premium neon aesthetics and complete MVVM separation.

[![npm version](https://img.shields.io/npm/v/ark-alliance-react-ui.svg)](https://www.npmjs.com/package/ark-alliance-react-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-19.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)
![SEO](https://img.shields.io/badge/SEO-Ready-00d4ff?logo=google)

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [MVVM Architecture](#mvvm-architecture)
3. [Project Structure](#project-structure)
4. [Complete Component Catalog](#complete-component-catalog)
5. [Core Systems](#core-systems)
6. [SEO Components](#seo-components-v130)
7. [Installation](#installation)
8. [Usage Examples](#usage-examples)
9. [Testing](#testing)
10. [Dependencies](#dependencies)
11. [Contributing](#contributing)
12. [Author](#author)

---

## Overview

Ark.Alliance.React.Component.UI is a professionally crafted component library featuring:

- **MVVM Pattern**: Clear separation of Model, ViewModel, and View
- **Zod Validation**: Runtime type safety with schema-based validation
- **Premium Aesthetics**: Neon, minimal, and glass visual modes
- **Enterprise Ready**: TypeScript strict mode, accessibility, responsive design
- **Comprehensive Testing**: Vitest + React Testing Library
- **47 Component Folders**: Organized in logical categories
- **104 Model Schemas**: Fully validated with Zod

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
│   │   ├── enums/                  # 8 Centralized enum categories
│   │   ├── events/                 # Event bus system
│   │   ├── services/               # Utility services (DataProvider)
│   │   ├── constants/              # Color constants
│   │   └── theme/                  # Theme configuration
│   │
│   ├── components/ (47 folders)    # Component library
│   ├── Helpers/                    # Utility functions & validators
│   └── test/                       # Test setup
│
├── DOCS/                           # Documentation
│   └── Analysis_ConsolidateEnhancementImproveUILIBRARY.md  # Audit document
│
├── vite.config.ts                  # Vite config with library build
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies & scripts
└── README.md                       # This file
```

---

## Complete Component Catalog

This library contains **47 component folders** organized in logical categories. Each component follows MVVM architecture with Model, ViewModel, and View files.

### Primitive Components

| Folder | Components | Description | Documentation |
|--------|------------|-------------|---------------|
| **Icon** | `FAIcon` | FontAwesome icon wrapper with size/color variants | - |
| **Label** | `Badge`, `StatusBadge`, `RoleBadge`, `DepartmentBadge`, `TechBadge` | Status indicators, role badges, department tags, technology badges | - |
| **Tooltip** | `Tooltip` | Configurable tooltip with positioning | - |

### Interactive Controls

| Folder | Components | Description | Documentation |
|--------|------------|-------------|---------------|
| **Buttons** | `Button`, `NeonButton` | Standard and neon-styled buttons with multiple variants | - |
| **Input** | `BaseInput`, `NeonInput`, `NumericInput`, `Select`, `Slider`, `TextArea`, `FileUpload`, `TextEditor` | Comprehensive form input suite with validation | - |
| **Toggles** | `Toggle` | Toggle switch component | - |
| **Slides** | `Carousel` | Image/content carousel | - |
| **DatePicker** | - | Date selection component | - |
| **Calendars** | - | Calendar display components | - |

### Layout & Containers

| Folder | Components | Description | Documentation |
|--------|------------|-------------|---------------|
| **Page** | `Page` | Full page container with meta tags | - |
| **Header** | `Header` | Page header component | - |
| **Footer** | `Footer` | Page footer component | - |
| **Panel** | `Panel` | Container panel with header/footer slots | - |
| **GenericPanel** | `GenericPanel` | Flexible panel container | - |
| **ControlPanel** | `ControlPanel` | Control panel with collapsible sections | - |
| **SideBar** | `SideBarMenu` | Sidebar navigation menu | - |
| **Modal** | `Modal` | Dialog with portal, backdrop, escape | - |

### Navigation

| Folder | Components | Description | Documentation |
|--------|------------|-------------|---------------|
| **Menu** | - | Navigation menu components | - |
| **TabControl** | `TabControl`, `TabItem` | Tabbed interface | - |
| **TreeView** | `TreeView`, `TreeNode`, `OrgChart`, `OrgChartNode` | Tree structures and organizational charts | - |
| **SEO** | `Breadcrumb`, `StructuredDataScript` | SEO breadcrumbs with Schema.org JSON-LD | [SEO/README.md](src/components/SEO/README.md) |

### Data Display

| Folder | Components | Description | Documentation |
|--------|------------|-------------|---------------|
| **Grids** | `DataGrid`, `ProjectGrid`, `TradingGridCard` | Data tables with sorting, filtering, editing | [DataGrid/README.md](src/components/Grids/DataGrid/README.md) |
| **TimeLines** | `Timeline`, `TestTimeline` | Event timeline display | - |
| **ProgressBar** | `ProgressBar` | Progress indicators | - |
| **Gauges** | `CircularGauge`, `SpeedometerGauge`, `DigitalGauge`, `BatteryGauge`, `SignalBarsGauge` | Data visualization gauges | - |
| **Documents** | `HTMLViewer`, `MarkdownRenderer` | Document rendering components | - |
| **Viewers** | - | Content viewers | - |

### Data Visualization

| Folder | Components | Description | Documentation |
|--------|------------|-------------|---------------|
| **Charts** | `FinancialChart`, `TrendPriceChart`, `TestChart`, Primitives: `CandlestickRenderer` | Financial data visualization with technical indicators | - |
| **Chart3D** | `Chart3D` | 3D chart visualization | - |
| **Diagram** | - | Diagram components | - |
| **FlowChart** | - | Flow chart components | - |

### Domain-Specific Components

| Folder | Components | Description | Documentation |
|--------|------------|-------------|---------------|
| **Finance** | `Trading/PositionsGrid`, `Trading/OrdersGrid`, `Trading/TradeHistoryGrid`, `Trading/TradingGridCard` | Financial trading grids for positions, orders, and trade history | [Trading/README.md](src/components/Finance/Trading/README.md) |
| **Logistic** | - | Logistics management components | - |
| **Medical** | - | Medical/healthcare components | - |
| **Ia** (AI) | - | AI-related components | - |
| **SocialMedia** | - | Social media integration components | - |
| **Basket** | - | Shopping basket components | - |
| **Catalogue** | - | Product catalog components | - |
| **PaymentsForm** | - | Payment form components | - |
| **Login** | - | Authentication components | - |

### Media Components

| Folder | Components | Description | Documentation |
|--------|------------|-------------|---------------|
| **Music** | - | Music player components | - |
| **Video** | - | Video player components | - |
| **Sound** | - | Sound/audio components | - |
| **Chat** | - | Chat/messaging components | - |

### Desktop OS Components

| Folder | Components | Description | Documentation |
|--------|------------|-------------|---------------|
| **Desktop** | `DesktopPage`, `DesktopIcon`, `WindowPanel`, `Taskbar`, `StartMenu` | Complete desktop OS simulation | - |

---

## Core Systems

### Enums (8 Categories)

Located in `src/core/enums/`:

| File | Exports | Purpose |
|------|---------|---------|
| **Size.ts** | `ComponentSizeSchema`, `BasicSizeSchema`, `ModalSizeSchema`, `ProgressSizeSchema`, `ExtendedSizeSchema` | Sizing variants (xs, sm, md, lg, xl, 2xl, 3xl) |
| **Variant.ts** | `ComponentVariantSchema`, `BasicVariantSchema`, `InputVariantSchema`, `PanelVariantSchema`, `ButtonVariantSchema`, `TabVariantSchema` | Visual style variants (primary, secondary, success, danger, warning, info, dark, light) |
| **Position.ts** | `PositionSchema`, `ExtendedPositionSchema`, `HorizontalPositionSchema`, `VerticalPositionSchema`, `ToolbarPositionSchema`, `OrientationSchema`, `AlignmentSchema` | Positioning (top, bottom, left, right, center) |
| **Status.ts** | `ConnectionStatusSchema`, `ProcessStatusSchema`, `TestStatusSchema`, `SemanticStatusSchema` | Status indicators (idle, success, warning, error, info, pending, running) |
| **Color.ts** | `ThemeColorSchema`, `ExtendedColorSchema`, `THEME_COLOR_VALUES`, `THEME_COLOR_RGB` | Theme colors with RGB values |
| **Typography.ts** | `FontWeightSchema`, `BasicFontWeightSchema`, `TextTransformSchema`, `TextAlignmentSchema` | Typography settings |
| **Styles.ts** | `LineStyleSchema`, `PaddingSchema`, `ResizeModeSchema`, `BackgroundTypeSchema`, `AnimationTypeSchema`, `LayoutModeSchema` | Style configurations |
| **InputFormat.ts** | `InputFormatSchema`, `InputValidationConfigSchema` | Input validation formats (email, phone, url, number, text) |

### Constants

Located in `src/core/constants/`:

| File | Exports | Purpose |
|------|---------|---------|
| **ColorConstants.ts** | Color hex values and RGB tuples | Centralized color definitions |

### Services

Located in `src/core/services/`:

| File | Exports | Purpose |
|------|---------|---------|
| **useDataProvider.ts** | `useDataProvider` hook | Data provider service for components |

### Helpers

Located in `src/Helpers/`:

| Folder | Purpose |
|--------|---------|
| **seo/** | Schema.org JSON-LD generators (Organization, Website, Person, Article, FAQ, Breadcrumb) |
| **Validators/** | Input validation utilities and types |

---

## SEO Components (v1.3.0)

### Overview

Version 1.3.0 introduces SEO (Search Engine Optimization) and AEO (Answer Engine Optimization) components designed for maximum visibility across traditional search engines and AI-powered answer engines.

### Components

| Component | Description |
|-----------|-------------|
| **Breadcrumb** | Navigation trail with automatic Schema.org BreadcrumbList JSON-LD generation |
| **StructuredDataScript** | Flexible JSON-LD schema injection component |

### SEO Helpers

Located in `Helpers/seo`:

- `generateBreadcrumbListSchema()` - BreadcrumbList for navigation
- `generateOrganizationSchema()` - Company/organization data
- `generateWebSiteSchema()` - Site-wide metadata
- `generatePersonSchema()` - Author/team member profiles
- `generateArticleSchema()` - Blog posts and articles
- `generateFAQPageSchema()` - FAQ sections

### AI Crawler Support

✅ **GPTBot** (OpenAI) - ChatGPT training  
✅ **ClaudeBot** (Anthropic) - Claude AI training  
✅ **Google-Extended** - Gemini training  
✅ **PerplexityBot** - Perplexity AI  
✅ **Googlebot/Bingbot** - Traditional search

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
pnpm install

# Build library
pnpm build
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
pnpm test

# Run tests with coverage
pnpm test -- --coverage
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
