# ShowCases Layer Enhancement - Implementation Plan

**Project**: Ark Alliance React Component UI  
**Version**: 1.4.0  
**Date**: 2026-01-26  
**Prepared for**: Gemini 3 Pro High Model - Antigravity IDE

---

## Executive Summary

This document provides a comprehensive audit and implementation plan for enhancing the ShowCases layer (`Ark.Alliance.React.Component.Ui.ShowCases`) to provide complete demonstration and documentation capabilities for all **47 component categories** in the UI library.

### Current State Analysis

**Library Components**: 47 categories, 90+ individual components  
**Current ShowCases Coverage**: 22 components (~24% coverage)  
**Architecture**: MVVM pattern with Model/ViewModel/Component separation  
**Technology Stack**: React 19.2, TypeScript 5.9, Tailwind CSS 4.1, Vite 7.2

### Gap Analysis

**Missing Showcases**: 68+ components (76% uncovered)
- 0/8 Desktop components
- 0/5 Trading/Finance components  
- 0/7 Input variants (FileUpload, TextEditor, Select, etc.)
- 0/4 Label variants (TechBadge, RoleBadge, DepartmentBadge, Badge)
- 0/3 Chart3D components
- And many more...

---

## Phase 1: Architecture Enhancement

### 1.1 Enhanced Data Model

**File**: `src/domain/entities.ts`

Add extended configuration capabilities:

```typescript
export interface EnhancedControlDefinition extends ControlDefinition {
    // Advanced control types
    conditional?: {
        dependsOn: string;
        showWhen: any;
    };
    validation?: {
        required?: boolean;
        pattern?: RegExp;
        min?: number;
        max?: number;
    };
    // Code generation hints
    codeTemplate?: string;
}

export interface ComponentDocumentation {
    overview: string;
    features: string[];
    useCases: string[];
    apiReference: {
        props: PropDefinition[];
        methods?: MethodDefinition[];
        events?: EventDefinition[];
    };
    examples: CodeExample[];
}

export interface EnhancedComponentPanelConfig extends ComponentPanelConfig {
    documentation?: ComponentDocumentation;
    mockDataGenerators?: Record<string, () => any>;
    variants?: VariantConfig[];
    relatedComponents?: string[];
}
```

### 1.2 Mock Data Generation System

**File**: `src/infrastructure/mockData/generators.ts` (NEW)

Create data generators for realistic demos:

```typescript
export const mockDataGenerators = {
    // Financial data
    generateCandlestickData: (count: number, options: GeneratorOptions) => {...},
    generateOrdersData: (count: number) => {...},
    generatePositionsData: (count: number) => {...},
    
    // Grid data
    generateProjectData: (count: number) => {...},
    generateTableRows: (count: number, schema: Schema) => {...},
    
    // Timeline data
    generateTimelineEvents: (count: number) => {...},
    
    // Tree/Org data
    generateOrgChartData: (depth: number, breadth: number) => {...},
    generateTreeNodes: (depth: number) => {...},
    
    // User/Profile data
    generateUsers: (count: number) => {...},
    
    // Tech/Department data
    generateTechStack: () => {...},
    generateDepartments: () => {...},
};
```

### 1.3 Component Resolver Enhancement

**File**: `src/infrastructure/ComponentResolver.ts`

Extend to support all 90+ components with dynamic imports.

---

## Phase 2: Component Coverage - Detailed Catalog

### 2.1 Buttons (2/2 ✓ Complete)

- [x] Button (Standard)
- [x] NeonButton

### 2.2 Input Components (2/8 - 25% coverage)

**Existing**:
- [x] NeonInput
- [x] NumericInput

**Missing - High Priority**:
- [ ] BaseInput
- [ ] Select
- [ ] Slider
- [ ] TextArea
- [ ] FileUpload
- [ ] TextEditor (Rich text editor with toolbar)

**Panel Config Template** (`input-select.json`):
```json
{
    "id": "input-select",
    "componentId": "Select",
    "title": "Select Dropdown",
    "description": "Dropdown selection with search and multi-select support",
    "defaultProps": {
        "label": "Choose Framework",
        "placeholder": "Select an option...",
        "options": [
            {"value": "react", "label": "React"},
            {"value": "vue", "label": "Vue"},
            {"value": "angular", "label": "Angular"}
        ],
        "searchable": true,
        "clearable": true
    },
    "controls": [
        {"propName": "searchable", "type": "boolean", "label": "Searchable", "group": "behavior"},
        {"propName": "clearable", "type": "boolean", "label": "Clearable", "group": "behavior"},
        {"propName": "disabled", "type": "boolean", "label": "Disabled", "group": "behavior"},
        {"propName": "size", "type": "select", "label": "Size", "options": ["sm", "md", "lg"], "group": "style"}
    ]
}
```

### 2.3 Gauges (5/5 ✓ Complete)

- [x] CircularGauge
- [x] SpeedometerGauge  
- [x] DigitalGauge
- [x] SignalBarsGauge
- [x] BatteryGauge

### 2.4 Charts (3/6 - 50% coverage)

**Existing**:
- [x] FinancialChart
- [x] TrendPriceChart
- [x] TestChart

**Missing**:
- [ ] Chart3D (3D visualization with WebGL)
- [ ] Chart3D/ControlPanel
- [ ] Chart3D/Scene3D

**Panel Config** (`chart-3d.json`):
```json
{
    "id": "chart-3d",
    "componentId": "Chart3D",
    "title": "3D Chart Visualization",
    "description": "Interactive 3D data visualization with WebGL rendering",
    "layout": {"minWidth": "full"},
    "defaultProps": {
        "width": 1200,
        "height": 600,
        "dataPoints": 1000,
        "rotationSpeed": 0.5,
        "showAxis": true,
        "showGrid": true,
        "cameraDistance": 10
    },
    "controls": [
        {"propName": "rotationSpeed", "type": "slider", "min": 0, "max": 2, "step": 0.1},
        {"propName": "cameraDistance", "type": "slider", "min": 5, "max": 50},
        {"propName": "showAxis", "type": "boolean"},
        {"propName": "showGrid", "type": "boolean"}
    ]
}
```

### 2.5 Grids (2/2 ✓ Complete)

- [x] DataGrid
- [x] ProjectGrid

### 2.6 Finance/Trading Components (0/4 - Critical Gap)

**All Missing**:
- [ ] OrdersGrid - Display trading orders
- [ ] PositionsGrid - Show open positions
- [ ] TradeHistoryGrid - Historical trades
- [ ] TradingGridCard - Consolidated trading view

**Mock Data Required**:
```typescript
// src/infrastructure/mockData/tradingData.ts
export const mockOrders = [
    {
        id: "ORD-001",
        symbol: "BTCUSDT",
        side: "BUY",
        type: "LIMIT",
        price: 45000,
        quantity: 0.5,
        filled: 0.2,
        status: "PARTIALLY_FILLED",
        timestamp: Date.now()
    },
    // ... 20-30 realistic orders
];
```

### 2.7 Label Components (1/5 - 20% coverage)

**Existing**:
- [x] Badge (StatusBadge)

**Missing**:
- [ ] Label (Base)
- [ ] TechBadge (Technology stack badges with icons)
- [ ] RoleBadge (User role indicators)
- [ ] DepartmentBadge (Department labels)

### 2.8 Desktop OS Components (0/6 - Major Gap)

**All Missing - Full Desktop Experience**:
- [ ] DesktopPage (Main container)
- [ ] DesktopIcon (App icons)
- [ ] WindowPanel (Draggable windows)
- [ ] Taskbar (Bottom bar)
- [ ] StartMenu (Application launcher)

**Showcase Priority**: HIGH - Unique feature of the library

### 2.9 Layout Components (1/5)

**Existing**:  
- [x] Panel (Basic)

**Missing**:
- [ ] Header
- [ ] Footer
- [ ] Page
- [ ] GenericPanel
- [ ] ControlPanel

### 2.10 Navigation & UI (0/8)

**All Missing**:
- [ ] SideBarMenu
- [ ] Modal
- [ ] TabControl
- [ ] Toast (Notification system)
- [ ] Tooltip
- [ ] Carousel
- [ ] ProgressBar

### 2.11 Data Display (1/3)

**Existing**:
- [x] Timeline (Vertical)

**Missing**:
- [ ] TestTimeline
- [ ] TreeView
- [ ] OrgChart (Organizational chart)

### 2.12 Documents & Viewers (0/2)

- [ ] HTMLViewer
- [ ] MarkdownRenderer

### 2.13 Toggles & Controls (0/2)

- [ ] Toggle (Switch)
- [ ] NeonToggle

### 2.14 SEO Components (0/2)

- [ ] Breadcrumb
- [ ] StructuredDataScript

### 2.15 Icon Components (0/3)

- [ ] Icon (Base)
- [ ] FAIcon (FontAwesome)
- [ ] UniversalIcon

### 2.16 Login & Auth (0/1)

- [ ] LoginPanel

### 2.17 Cards (0/1)

- [ ] GlowCard

---

## Phase 3: Implementation Roadmap

### Sprint 1: Foundation (Week 1)

**Deliverables**:
1. Enhanced domain entities with documentation support
2. Mock data generation system
3. Updated ComponentResolver for all components
4. 10 new panel configurations

**Components to Add**:
- FileUpload
- Select
- Slider
- TextArea
- TextEditor
- Header
- Footer
- Modal
- Tooltip
- Toast

### Sprint 2: Advanced Components (Week 2)

**Deliverables**:
1. Desktop OS showcase suite
2. Finance/Trading components
3. Chart3D integration
4. 15 panel configurations

**Components**:
- All Desktop components (6)
- All Trading components (4)
- Chart3D suite (3)
- Label variants (4)

### Sprint 3: Secondary Components (Week 3)

**Deliverables**:
1. Navigation components
2. Data visualization
3. Remaining controls
4. 15 panel configurations

**Components**:
- SideBarMenu, TabControl, Carousel
- TreeView, OrgChart
- HTMLViewer, MarkdownRenderer
- Toggles, ProgressBar
- Breadcrumb, SEO components

### Sprint 4: Polish & Documentation (Week 4)

**Deliverables**:
1. Complete documentation for all components
2. Code generation for all languages (TS, JS, Go, Blazor)
3. Usage examples and best practices
4. Interactive tutorials

---

## Phase 4: Technical Specifications

### 4.1 Panel Configuration Schema

Every component needs a JSON config in `src/infrastructure/data/panels/`:

```typescript
interface StandardPanelConfig {
    id: string;                    // kebab-case unique ID
    componentId: string;           // PascalCase component name
    title: string;                 // Display name
    description: string;           // One-line description
    
    layout: {
        width?: string;            // "100%", "auto", "600px"
        height?: string;           // "auto", "500px"
        minWidth?: string;         // "full" = full width showcase
    };
    
    defaultProps: Record<string, any>;  // Realistic demo values
    
    controls: Array<{
        propName: string;          // Maps to component prop
        type: ControlType;         // "text" | "number" | "boolean" | "select" | "slider" | "color" | "icon"
        label: string;             // Display label
        group?: string;            // "content" | "style" | "behavior" | "data"
        options?: string[];        // For select
        min?: number;              // For slider/number
        max?: number;              // For slider/number
        step?: number;             // For slider
    }>;
}
```

### 4.2 Mock Data Standards

**Principles**:
1. **Realistic**: Use real-world data patterns
2. **Varied**: Include edge cases (empty, large, special chars)
3. **Consistent**: Same seed = same data
4. **Rich**: Full objects, not minimal stubs

**Example - User Data**:
```typescript
export const mockUsers = [
    {
        id: "USR-001",
        name: "Sarah Chen",
        email: "sarah.chen@arkalliance.io",
        role: "Senior Frontend Developer",
        department: "Engineering",
        avatar: "https://i.pravatar.cc/150?img=1",
        status: "online",
        joinDate: "2024-03-15",
        techStack: ["React", "TypeScript", "Node.js"],
        projects: 12,
        commits: 1543
    },
    // ... 50-100 varied users
];
```

### 4.3 Component-Specific Requirements

#### Desktop Components
- **Mock Data**: 20 app icons, 5 window states, realistic taskbar items
- **Interactions**: Drag, resize, minimize, maximize, close
- **State Management**: Window positions, z-index, active window

#### Finance Components
- **Mock Data**: Real crypto symbols (BTC, ETH), realistic prices, timestamps
- **Data Volume**: 100-500 orders, 50-100 positions, 1000+ trades
- **Real-time Simulation**: Price updates, order fills, P&L changes

#### Chart3D
- **Performance**: Handle 1000-10000 data points
- **Interactivity**: Camera rotation, zoom, pan
- **Customization**: Colors, axis labels, grid density

---

## Phase 5: Code Generation Enhancement

### 5.1 Multi-Language Support

Enhance `src/Helpers/codeGenerator.ts` to generate examples in:

1. **TypeScript** (default)
2. **JavaScript**
3. **Go** (using go-react bindings)
4. **Blazor** (C# components)

**Example Output** (Select component):

**TypeScript**:
```tsx
import { Select } from 'ark-alliance-react-ui';

function MyComponent() {
    const [value, setValue] = useState('');
    
    return (
        <Select
            label="Choose Framework"
            value={value}
            onChange={setValue}
            options={[
                {value: 'react', label: 'React'},
                {value: 'vue', label: 'Vue'}
            ]}
            searchable
            clearable
        />
    );
}
```

**Blazor**:
```csharp
@using ArkAlliance.React.UI

<Select 
    Label="Choose Framework"
    Value="@selectedValue"
    OnChange="@HandleChange"
    Options="@frameworkOptions"
    Searchable="true"
    Clearable="true" />

@code {
    private string selectedValue = "";
    private List<SelectOption> frameworkOptions = new() {
        new("react", "React"),
        new("vue", "Vue")
    };
    
    private void HandleChange(string value) {
        selectedValue = value;
    }
}
```

---

## Appendix A: Component Property Matrix

### Input Components

| Component | Props Count | Key Props | Mock Data Needed |
|-----------|-------------|-----------|------------------|
| BaseInput | 20+ | value, onChange, type, validation | Text samples |
| NeonInput | 15+ | glowColor, value, theme | Color variants |
| Select | 25+ | options, multi, searchable, async | Option lists (100+) |
| Slider | 18+ | min, max, step, marks, range | Numeric ranges |
| TextArea | 20+ | rows, maxLength, autoResize | Long text samples |
| FileUpload | 22+ | accept, multiple, maxSize, preview | File metadata |
| TextEditor | 30+ | toolbar, plugins, value | Rich content |
| NumericInput | 20+ | min, max, step, prefix, suffix | Numbers |

### Chart Components

| Component | Props Count | Key Props | Mock Data Needed |
|-----------|-------------|-----------|------------------|
| FinancialChart | 40+ | candlestickData, indicators, theme | OHLCV data (500+ points) |
| TrendPriceChart | 30+ | data, trend, predictions | Price series |
| TestChart | 25+ | data, type, config | Generic series |
| Chart3D | 35+ | dataPoints, camera, lighting | 3D coordinates (1000+) |

### Desktop Components

| Component | Props Count | Key Props | Mock Data Needed |
|-----------|-------------|-----------|------------------|
| DesktopPage | 15+ | wallpaper, icons, windows | Desktop state |
| WindowPanel | 25+ | title, position, size, draggable | Window configs |
| DesktopIcon | 12+ | icon, label, onClick | App metadata |
| Taskbar | 20+ | apps, notifications, time | Taskbar items |
| StartMenu | 30+ | apps, recent, search | App categories |

---

## Appendix B: Catalogue Enhancement

### Current Categories (9)

1. Inputs (7 component IDs)
2. Buttons (2 component IDs)
3. Data Display (2 IDs)
4. Containers (2 IDs)
5. Feedback (1 ID)
6. Gauges (5 IDs)
7. Grids (2 IDs)
8. Charts (3 IDs)
9. TestFamily (0 IDs - placeholder)

### Recommended New Categories

**Add to `catalogue.json`**:

```json
{
    "categories": [
        {
            "name": "Desktop OS",
            "icon": "desktop",
            "description": "Complete desktop operating system simulation",
            "componentIds": ["desktop-page", "desktop-icon", "window-panel", "taskbar", "start-menu"]
        },
        {
            "name": "Finance & Trading",
            "icon": "chart-line",
            "description": "Financial and trading components",
            "componentIds": ["orders-grid", "positions-grid", "trade-history", "trading-card"]
        },
        {
            "name": "3D Visualization",
            "icon": "cube",
            "description": "WebGL-powered 3D charts and visualizations",
            "componentIds": ["chart-3d", "scene-3d", "control-panel-3d"]
        },
        {
            "name": "Navigation",
            "icon": "bars",
            "description": "Menus, tabs, and navigation components",
            "componentIds": ["sidebar-menu", "tab-control", "breadcrumb", "carousel"]
        },
        {
            "name": "Overlays",
            "icon": "layer-group",
            "description": "Modals, tooltips, and overlay UI",
            "componentIds": ["modal", "tooltip", "toast"]
        },
        {
            "name": "Documents",
            "icon": "file-lines",
            "description": "Document viewers and renderers",
            "componentIds": ["html-viewer", "markdown-renderer"]
        },
        {
            "name": "Trees & Hierarchies",
            "icon": "sitemap",
            "description": "Tree views and organizational charts",
            "componentIds": ["tree-view", "org-chart"]
        },
        {
            "name": "Labels & Badges",
            "icon": "tag",
            "description": "Status indicators and labels",
            "componentIds": ["badge", "tech-badge", "role-badge", "department-badge"]
        }
    ]
}
```

---

## Appendix C: Quality Standards

### Component Showcase Requirements

Every component showcase MUST include:

1. **✅ Live Preview**: Interactive component with real-time updates
2. **✅ Property Controls**: All major props exposed and modifiable
3. **✅ Code Examples**: TS/JS/Go/Blazor code generation
4. **✅ Mock Data**: Realistic, production-like data
5. **✅ Variants**: At least 3 different configurations
6. **✅ Responsive**: Works on desktop and mobile viewports
7. **✅ Dark/Light**: Supports both themes
8. **✅ Documentation**: Props table, usage notes, best practices

### Mock Data Quality Checklist

- [ ] Realistic values (no "Lorem Ipsum" or "Test 1, Test 2")
- [ ] Edge cases included (empty, very long, special characters)
- [ ] Sufficient volume (min 20 items for grids/lists)
- [ ] Consistent formatting (dates, numbers, currencies)
- [ ] Real-world scenarios (actual crypto symbols, real company names)

---

## Appendix D: File Structure After Implementation

```
Ark.Alliance.React.Component.Ui.ShowCases/
├── src/
│   ├── domain/
│   │   ├── entities.ts (Enhanced with documentation types)
│   │   └── validation.ts (NEW - Zod schemas)
│   ├── infrastructure/
│   │   ├── ComponentResolver.ts (Updated - all 90+ components)
│   │   ├── ConfigLoader.ts
│   │   ├── mockData/ (NEW)
│   │   │   ├── generators.ts
│   │   │   ├── tradingData.ts
│   │   │   ├── userData.ts
│   │   │   ├── projectData.ts
│   │   │   ├── chartData.ts
│   │   │   └── desktopData.ts
│   │   ├── data/
│   │   │   ├── catalogue.json (Updated - 16 categories)
│   │   │   └── panels/ (90+ JSON files)
│   │   │       ├── [existing 22 files]
│   │   │       ├── input-select.json (NEW)
│   │   │       ├── desktop-page.json (NEW)
│   │   │       ├── orders-grid.json (NEW)
│   │   │       ├── chart-3d.json (NEW)
│   │   │       └── [65+ more...]
│   │   └── wrappers/ (Component-specific wrappers)
│   │       ├── [existing 8 files]
│   │       ├── Chart3DWrapper.tsx (NEW)
│   │       ├── DesktopPageWrapper.tsx (NEW)
│   │       └── [60+ more...]
│   ├── presentation/
│   │   ├── components/
│   │   │   └── Catalogue/
│   │   │       ├── ComponentPanel.tsx (Enhanced)
│   │   │       ├── PropControl.tsx (Enhanced)
│   │   │       └── DocumentationPanel.tsx (NEW)
│   │   └── pages/
│   │       ├── CataloguePage.tsx
│   │       └── ComponentDetailsPage.tsx (NEW)
│   └── Helpers/
│       ├── codeGenerator.ts (Enhanced - multi-language)
│       └── mockDataUtils.ts (NEW)
└── DOCS/ (NEW)
    └── ComponentGuides/ (Per-component usage guides)
```

---

## Success Metrics

### Coverage Targets

- **Phase 1 Complete**: 50% component coverage (45/90 components)
- **Phase 2 Complete**: 75% component coverage (68/90 components)
- **Phase 3 Complete**: 100% component coverage (90/90 components)

### Quality Metrics

- All showcases have ≥ 5 interactive controls
- All showcases have realistic mock data (no placeholders)
- All showcases render correctly in dark/light modes
- All showcases generate valid code in 4 languages
- Zero console errors in any showcase

### User Experience

- Average time to understand a component: < 2 minutes
- Ability to copy working code: 100% of showcases
- Mobile responsiveness: All showcases
- Load time per showcase: < 500ms

---

## Conclusion

This implementation plan provides a complete roadmap to transform the ShowCases layer from 24% coverage to 100% coverage, with:

- **90+ component showcases** with interactive demos
- **Realistic mock data** for all complex components
- **Multi-language code generation** (TS, JS, Go, Blazor)
- **Comprehensive documentation** for each component
- **Enhanced architecture** supporting future growth

**Estimated Effort**: 4 weeks (1 developer)  
**Priority**: HIGH - Essential for developer adoption and library documentation

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-26  
**Author**: AI Software Architect (Antigravity IDE)  
**Review Status**: Pending User Approval

---

## Appendix E: Technical Audit - Property Controls & Code Generation

### E.1 PropControl Component Analysis

**File**: `src/presentation/components/Catalogue/PropControl.tsx`

#### Current Implementation Status

The PropControl component handles 6 control types:

| Control Type | Implementation | Status |
|--------------|----------------|--------|
| `boolean` | Toggle switch with click handler | ✅ Working |
| `select` | Dropdown with options mapping | ✅ Working |
| `text` | Text input with change handler | ✅ Working |
| `color` | Color picker + hex input | ✅ Working |
| `slider` | Range input with min/max/step | ✅ Working |
| `icon` | Hardcoded icon dropdown (16 icons) | ⚠️ Limited |

#### Critical Issues Identified

**Issue E.1.1: Missing Control Types**

The `ControlType` in `domain/entities.ts` defines: `'text' | 'number' | 'boolean' | 'select' | 'color' | 'slider' | 'icon'`

However, PropControl.tsx is **missing** handler for:
- `number` type (should be distinct from slider for integer inputs)

**Issue E.1.2: Panel Config Property Name Inconsistency**

Some panel configs use `propName` while others use `name`:

```
✅ Correct (btn-standard.json): "propName": "children"
❌ Incorrect (input-neon.json): "name": "label"
❌ Incorrect (chart-financial.json): "name": "headerTitle"
```

**Affected Files**:
- `input-neon.json` - Uses `name` instead of `propName`
- `input-select.json` - Uses `name` instead of `propName`
- `chart-financial.json` - Uses `name` instead of `propName`
- `input-numeric.json` - Uses `name` instead of `propName`
- `input-slider.json` - Uses `name` instead of `propName`
- `input-textarea.json` - Uses `name` instead of `propName`
- `input-file.json` - Uses `name` instead of `propName`
- `input-editor.json` - Uses `name` instead of `propName`

**Issue E.1.3: Missing `divider` Control Type**

`chart-financial.json` uses `"type": "divider"` for visual grouping, but PropControl returns `null` for unrecognized types (silent failure).

**Fix Required**: Add divider support:
```typescript
case 'divider':
    return (
        <div className="flex items-center space-x-2 text-ark-text-muted pt-4 pb-2">
            <div className="h-px flex-1 bg-ark-border/50"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{definition.name}</span>
            <div className="h-px flex-1 bg-ark-border/50"></div>
        </div>
    );
```

**Issue E.1.4: Limited Icon Selection**

PropControl hardcodes 16 icons. Component library supports 100+ FontAwesome icons.

**Current (Line 126)**:
```typescript
const iconOptions = ['check', 'plus', 'minus', 'xmark', 'user', 'house', 'gear', 'bell', ...];
```

**Recommended**: Dynamic icon loading or expanded list:
```typescript
const iconOptions = [
    // Navigation
    'house', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'chevron-left', 'chevron-right',
    // Actions  
    'check', 'xmark', 'plus', 'minus', 'pen', 'trash', 'download', 'upload', 'share', 'copy',
    // UI
    'gear', 'bell', 'user', 'magnifying-glass', 'bars', 'ellipsis-vertical',
    // Status
    'circle-check', 'circle-xmark', 'triangle-exclamation', 'circle-info',
    // Media
    'play', 'pause', 'stop', 'volume-high', 'volume-low', 'volume-xmark',
    // Finance
    'chart-line', 'chart-bar', 'wallet', 'credit-card', 'dollar-sign',
    // Files
    'file', 'folder', 'image', 'file-pdf', 'file-code',
    // Communication
    'envelope', 'comment', 'phone', 'video',
    // Misc
    'bolt', 'star', 'heart', 'bookmark', 'clock', 'calendar', 'lock', 'unlock'
];
```

---

### E.2 Code Generator Analysis

**File**: `src/Helpers/codeGenerator.ts`

#### Current Implementation

```typescript
export const generateCode = (
    componentName: string,
    props: Record<string, any>,
    language: 'ts' | 'js' | 'go' | 'blazor'
): string => {...}
```

#### Issues Identified

**Issue E.2.1: No Import Statement Generation**

Generated code shows only JSX without import:
```tsx
// Current output:
<Button variant="primary" size="md" />

// Should be:
import { Button } from 'ark-alliance-react-ui';

<Button variant="primary" size="md" />
```

**Issue E.2.2: No State/Hook Generation**

For controlled components, generated code lacks useState:
```tsx
// Current output:
<NeonInput value="test" />

// Should be:
import { NeonInput } from 'ark-alliance-react-ui';
import { useState } from 'react';

function Example() {
    const [value, setValue] = useState('test');
    return <NeonInput value={value} onChange={setValue} />;
}
```

**Issue E.2.3: Complex Props Not Handled**

The `formatValue` function doesn't properly handle:
- Nested objects (MovingAverageConfig)
- Arrays of objects (options, thresholdLines)
- Function props (onClick, onChange)

**Current (Line 28)**:
```typescript
if (typeof value === 'object') return `{${JSON.stringify(value)}}`;
```

**Problem**: Generates invalid JSX for complex objects.

**Issue E.2.4: Children Prop Handling**

Button's `children` prop is treated as regular prop:
```tsx
// Current output:
<Button children="Click Me" />

// Should be:
<Button>Click Me</Button>
```

**Issue E.2.5: Go Template Incorrect**

Go/Templ syntax is mock and doesn't match actual go-templ patterns:
```go
// Current output:
Button(children: "Click", variant: "primary")

// Should match templ syntax:
@components.Button(templ.Attributes{"variant": "primary"}) {
    Click Me
}
```

**Issue E.2.6: Blazor Casing Incorrect**

Blazor uses PascalCase for all props, current implementation capitalizes first letter only:
```csharp
// Current output (Line 57):
Children="Click Me"

// Some props need different handling:
OnClick="@HandleClick"  // Event handlers need @ prefix
```

---

### E.3 Panel Configuration vs Component Model Audit

#### E.3.1 Button Component

**Panel**: `btn-standard.json`  
**Model**: `Button.model.ts`

| Model Property | Panel Control | Status | Issue |
|---------------|---------------|--------|-------|
| variant | ✅ select | ✅ Correct | Options missing: `link`, `neon` |
| size | ✅ select | ⚠️ Partial | Missing: `xs`, `xl` |
| type | ❌ Missing | ❌ Gap | Should expose submit/reset |
| fullWidth | ❌ Missing | ❌ Gap | Useful for layouts |
| iconLeft | ✅ icon | ✅ Correct | — |
| iconRight | ❌ Missing | ❌ Gap | Model supports it |
| iconCenter | ❌ Missing | ❌ Gap | For icon-only buttons |
| iconOnly | ❌ Missing | ❌ Gap | Important variant |
| pill | ❌ Missing | ❌ Gap | Visual variant |
| disabled | ✅ boolean | ✅ Correct | — |
| loading | ✅ boolean | ✅ Correct | — |

**Missing Controls to Add**:
```json
{"propName": "iconRight", "type": "icon", "label": "Right Icon", "group": "content"},
{"propName": "fullWidth", "type": "boolean", "label": "Full Width", "group": "style"},
{"propName": "pill", "type": "boolean", "label": "Pill Shape", "group": "style"},
{"propName": "iconOnly", "type": "boolean", "label": "Icon Only", "group": "style"}
```

#### E.3.2 Circular Gauge Component

**Panel**: `gauge-circular.json`  
**Model**: `Gauge.model.ts`

| Model Property | Panel Control | Status | Issue |
|---------------|---------------|--------|-------|
| value | ✅ slider | ✅ Correct | — |
| min | ❌ Missing | ❌ Gap | Fixed at 0 |
| max | ❌ Missing | ❌ Gap | Fixed at 100 |
| label | ✅ text | ✅ Correct | — |
| unit | ✅ text | ✅ Correct | — |
| subLabel | ❌ Missing | ❌ Gap | Model supports it |
| color | ✅ select | ✅ Correct | — |
| size | ✅ select | ⚠️ Partial | Missing: `xl` option |
| decimals | ✅ slider | ✅ Correct | — |
| autoColor | ✅ boolean | ✅ Correct | — |
| showPercentage | ❌ Missing | ❌ Gap | Useful option |
| warningThreshold | ❌ Missing | ❌ Gap | For autoColor |
| dangerThreshold | ❌ Missing | ❌ Gap | For autoColor |

**Missing Controls to Add**:
```json
{"propName": "min", "type": "slider", "label": "Min Value", "min": 0, "max": 100, "group": "data"},
{"propName": "max", "type": "slider", "label": "Max Value", "min": 0, "max": 1000, "group": "data"},
{"propName": "subLabel", "type": "text", "label": "Sub Label", "group": "content"},
{"propName": "showPercentage", "type": "boolean", "label": "Show %", "group": "behavior"},
{"propName": "warningThreshold", "type": "slider", "label": "Warning %", "min": 0, "max": 100, "group": "behavior"},
{"propName": "dangerThreshold", "type": "slider", "label": "Danger %", "min": 0, "max": 100, "group": "behavior"}
```

#### E.3.3 Financial Chart Component

**Panel**: `chart-financial.json`  
**Model**: `FinancialChart.model.ts`  
**Wrapper**: `FinancialChartWrapper.tsx`

| Model Property | Panel Control | Status | Issue |
|---------------|---------------|--------|-------|
| headerTitle | ✅ text | ⚠️ Uses `name` not `propName` | — |
| chartType | ✅ select | ⚠️ Uses `name` | — |
| interval | ✅ select | ⚠️ Uses `name` | — |
| useLogScale | ✅ boolean | ⚠️ Uses `name` | — |
| fastMA.enabled | ✅ boolean | ✅ Flattened correctly | — |
| fastMA.period | ✅ slider | ✅ Flattened correctly | — |
| fastMA.color | ✅ color | ✅ Flattened correctly | — |
| slowMA.enabled | ✅ boolean | ✅ Correct | — |
| slowMA.period | ✅ slider | ✅ Correct | — |
| slowMA.color | ✅ color | ✅ Correct | — |
| borderWidth | ✅ slider | ✅ Correct | — |
| borderRadius | ✅ slider | ✅ Correct | — |
| boxShadowIntensity | ✅ slider | ✅ Correct | — |
| borderColor | ✅ color | ✅ Correct | — |
| thresholdLines | ❌ Missing | ❌ Gap | Complex array type |
| maxCandles | ❌ Missing | ❌ Gap | Buffer size |
| showGrid | ❌ Missing | ❌ Gap | Model inherited |
| showLegend | ❌ Missing | ❌ Gap | Model inherited |

**Wrapper Analysis**: FinancialChartWrapper correctly flattens nested MA configs:
```typescript
// Correct pattern:
fastMA_enabled -> { enabled: fastMA_enabled, ... }
```

#### E.3.4 Select Component

**Panel**: `input-select.json`  
**Model**: `Select.model.ts`  
**Wrapper**: `SelectWrapper.tsx`

| Model Property | Panel Control | Status | Issue |
|---------------|---------------|--------|-------|
| label | ✅ text | ⚠️ Uses `name` | — |
| placeholder | ✅ text | ⚠️ Uses `name` | — |
| helperText | ✅ text | ⚠️ Uses `name` | — |
| options | ❌ Wrapper handles | ✅ Via optionSet | — |
| searchable | ✅ boolean | ⚠️ Uses `name` | — |
| size | ✅ select | ⚠️ Uses `name` | — |
| variant | ❌ Missing | ❌ Gap | default/outline/ghost |
| required | ❌ Missing | ❌ Gap | Form validation |
| disabled | ❌ Missing | ❌ Gap | State |
| error | ❌ Missing | ❌ Gap | Error message |
| isDark | ❌ Missing | ❌ Gap | Theme |

**Wrapper Analysis**: SelectWrapper provides `optionSet` abstraction:
```typescript
// Correct pattern - abstracts options:
optionSet: 'crypto' | 'fiat' | 'actions' | 'timeframes'
```

#### E.3.5 DataGrid Component

**Panel**: `data-grid.json`  
**Model**: `DataGrid.model.ts`  
**Wrapper**: `DataGridWrapper.tsx`

| Wrapper Property | Panel Control | Status | Issue |
|-----------------|---------------|--------|-------|
| title | ✅ text | ✅ Correct | — |
| subtitle | ✅ text | ✅ Correct | — |
| pageSize | ✅ slider | ✅ Correct | — |
| rowCount | ✅ slider | ✅ Correct | — |
| selectionEnabled | ✅ boolean | ✅ Correct | — |
| multiSelection | ✅ boolean | ✅ Correct | — |
| isDark | ✅ boolean | ✅ Correct | — |

**Wrapper Analysis**: DataGridWrapper correctly generates mock data based on rowCount and constructs GridModel internally.

---

### E.4 Property Change Impact Verification

#### E.4.1 Boolean Props Flow

**Test Path**: Panel Control → ComponentPanel → Wrapper → Component

1. ✅ PropControl toggle dispatches `onChange(!value)`
2. ✅ ComponentPanel `handlePropChange` updates state via `setProps`
3. ✅ Component re-renders with spread `{...props}`

**Verified Working**: disabled, loading, autoColor, searchable

#### E.4.2 Slider Props Flow

**Test Path**: Slider input → parseFloat → State → Component

1. ✅ PropControl slider dispatches `onChange(parseFloat(value))`
2. ✅ Handles min/max/step correctly from definition
3. ⚠️ Issue: If slider value comes as string from JSON, some components may fail

**Fix Applied in FinancialChartWrapper (Line 47-49)**:
```typescript
const points = Number(dataPoints) || 50;
const start = Number(startPrice) || 100;
const vol = Number(volatility) || 2;
```

**Recommendation**: All wrappers should coerce numeric props.

#### E.4.3 Select Props Flow

**Test Path**: Select dropdown → String value → State → Component

1. ✅ PropControl select dispatches string value
2. ✅ Options rendered from `definition.options`
3. ⚠️ Issue: No support for object options (value + label pairs)

**Current Limitation**: Select control only supports string[] options, not SelectOption[].

#### E.4.4 Color Props Flow

**Test Path**: Color picker → Hex string → State → Component

1. ✅ Native color picker returns hex
2. ✅ Text input allows manual hex entry
3. ✅ Both sync correctly

---

### E.5 Code Generation Correctness by Language

#### E.5.1 TypeScript Generation

**Input**:
```json
{
    "componentName": "Button",
    "props": {
        "children": "Click Me",
        "variant": "primary",
        "disabled": false,
        "loading": true
    }
}
```

**Current Output**:
```tsx
<Button children="Click Me" variant="primary" loading />
```

**Issues**:
1. ❌ `children` should be element content
2. ❌ `disabled: false` correctly filtered
3. ✅ `loading: true` becomes `loading`

**Expected Output**:
```tsx
import { Button } from 'ark-alliance-react-ui';

<Button variant="primary" loading>
    Click Me
</Button>
```

#### E.5.2 JavaScript Generation

**Current**: Identical to TypeScript (Lines 13-15)
```typescript
case 'ts':
case 'js':
    return generateReactCode(componentName, props);
```

**Issue**: No differentiation. JS should omit type annotations if any were present.

#### E.5.3 Go/Templ Generation

**Current Output**:
```go
Button(children: "Click Me", variant: "primary", loading: true)
```

**Issues**:
1. ❌ Not valid Go/Templ syntax
2. ❌ No template structure

**Expected (templ syntax)**:
```go
@components.Button(templ.Attributes{
    "variant": "primary",
    "loading": true,
}) {
    Click Me
}
```

#### E.5.4 Blazor Generation

**Current Output**:
```razor
<Button Children="Click Me" Variant="primary" Loading={true} />
```

**Issues**:
1. ⚠️ Children should be element content in Blazor too
2. ⚠️ Boolean props in Blazor: `Loading` not `Loading={true}`
3. ✅ PascalCase conversion works

**Expected Output**:
```razor
<Button Variant="primary" Loading>
    Click Me
</Button>
```

---

### E.6 Summary of Required Fixes

#### Priority 1: Critical (Breaking Issues)

| Issue ID | Description | File | Fix Complexity |
|----------|-------------|------|----------------|
| E.1.2 | Property naming inconsistency (`name` vs `propName`) | 8 panel JSON files | Low |
| E.2.1 | Missing import statements in code generation | codeGenerator.ts | Medium |
| E.2.4 | Children prop not rendered as content | codeGenerator.ts | Low |

#### Priority 2: High (Functionality Gaps)

| Issue ID | Description | File | Fix Complexity |
|----------|-------------|------|----------------|
| E.1.1 | Missing `number` control type | PropControl.tsx | Low |
| E.1.3 | Missing `divider` control type | PropControl.tsx | Low |
| E.2.2 | No state/hook generation | codeGenerator.ts | Medium |
| E.2.3 | Complex props not formatted correctly | codeGenerator.ts | High |

#### Priority 3: Medium (Enhancement)

| Issue ID | Description | File | Fix Complexity |
|----------|-------------|------|----------------|
| E.1.4 | Limited icon selection | PropControl.tsx | Low |
| E.3.* | Missing property controls in panels | Various panel JSON | Low each |
| E.2.5 | Go/Templ generation incorrect | codeGenerator.ts | Medium |
| E.2.6 | Blazor generation issues | codeGenerator.ts | Medium |

---

### E.7 Panel Config Property Name Fix

The following files require `name` → `propName` replacement:

```bash
# Files requiring update:
src/infrastructure/data/panels/input-neon.json
src/infrastructure/data/panels/input-select.json
src/infrastructure/data/panels/input-numeric.json
src/infrastructure/data/panels/input-slider.json
src/infrastructure/data/panels/input-textarea.json
src/infrastructure/data/panels/input-file.json
src/infrastructure/data/panels/input-editor.json
src/infrastructure/data/panels/chart-financial.json
src/infrastructure/data/panels/chart-trend.json
src/infrastructure/data/panels/chart-test.json
```

**Pattern**: Replace `"name":` with `"propName":` in control definitions.

---

### E.8 Enhanced Code Generator Implementation

**Recommended `codeGenerator.ts` Enhancement**:

```typescript
export const generateCode = (
    componentName: string,
    props: Record<string, any>,
    language: 'ts' | 'js' | 'go' | 'blazor'
): string => {
    // Extract children for content rendering
    const { children, ...restProps } = props;
    
    switch (language) {
        case 'ts':
            return generateTypeScriptCode(componentName, children, restProps);
        case 'js':
            return generateJavaScriptCode(componentName, children, restProps);
        case 'go':
            return generateGoTemplCode(componentName, children, restProps);
        case 'blazor':
            return generateBlazorCode(componentName, children, restProps);
        default:
            return '';
    }
};

const generateTypeScriptCode = (name: string, children: any, props: Record<string, any>): string => {
    const importLine = `import { ${name} } from 'ark-alliance-react-ui';`;
    
    const propStrings = Object.entries(props)
        .filter(([_, value]) => value !== undefined && value !== null && value !== false && value !== '')
        .map(([key, value]) => formatProp(key, value));
    
    const propsStr = propStrings.length > 0 ? ` ${propStrings.join(' ')}` : '';
    
    if (children) {
        return `${importLine}\n\n<${name}${propsStr}>\n    ${children}\n</${name}>`;
    }
    return `${importLine}\n\n<${name}${propsStr} />`;
};

const formatProp = (key: string, value: any): string => {
    if (value === true) return key;
    if (typeof value === 'string') return `${key}="${value}"`;
    if (typeof value === 'number') return `${key}={${value}}`;
    if (Array.isArray(value)) return `${key}={${JSON.stringify(value, null, 2)}}`;
    if (typeof value === 'object') return `${key}={${JSON.stringify(value)}}`;
    return `${key}={${value}}`;
};
```

---

**Appendix E Version**: 1.0  
**Audit Date**: 2026-01-26  
**Auditor**: AI Software Architect (Antigravity IDE)

---

## Appendix F: Complete Panel Configurations for Missing Components

This appendix provides ready-to-implement panel JSON configurations for all components currently missing from the ShowCases layer. Each configuration is derived directly from the component's model file to ensure 100% property alignment.

---

### F.1 Navigation Components

#### F.1.1 SideBarMenu Panel

**File**: `src/infrastructure/data/panels/sidebar-menu.json`

```json
{
    "id": "sidebar-menu",
    "componentId": "SideBarMenu",
    "title": "Sidebar Menu",
    "description": "Collapsible navigation sidebar with categories, icons, and badges.",
    "layout": { "width": "auto", "height": "600px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "title": "Navigation",
        "variant": "default",
        "position": "left",
        "collapsed": false,
        "expandedWidth": 280,
        "collapsedWidth": 60,
        "showHamburger": true,
        "isDark": true,
        "categorySet": "default"
    },
    "controls": [
        { "propName": "title", "type": "text", "label": "Menu Title", "group": "content" },
        { "propName": "variant", "type": "select", "label": "Variant", "options": ["default", "glass", "bordered", "elevated"], "group": "style" },
        { "propName": "position", "type": "select", "label": "Position", "options": ["left", "right"], "group": "style" },
        { "propName": "collapsed", "type": "boolean", "label": "Collapsed", "group": "behavior" },
        { "propName": "expandedWidth", "type": "slider", "label": "Expanded Width", "min": 200, "max": 400, "step": 20, "group": "style" },
        { "propName": "collapsedWidth", "type": "slider", "label": "Collapsed Width", "min": 40, "max": 100, "step": 10, "group": "style" },
        { "propName": "showHamburger", "type": "boolean", "label": "Show Toggle", "group": "behavior" },
        { "propName": "isDark", "type": "boolean", "label": "Dark Mode", "group": "style" }
    ]
}
```

#### F.1.2 TabControl Panel

**File**: `src/infrastructure/data/panels/tab-control.json`

```json
{
    "id": "tab-control",
    "componentId": "TabControl",
    "title": "Tab Control",
    "description": "Tabbed navigation with multiple variants and orientations.",
    "layout": { "width": "100%", "height": "400px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "variant": "default",
        "orientation": "horizontal",
        "alignment": "start",
        "size": "md",
        "fill": false,
        "scrollable": false,
        "closeable": false,
        "iconsOnly": false,
        "tabSet": "dashboard"
    },
    "controls": [
        { "propName": "variant", "type": "select", "label": "Variant", "options": ["default", "pills", "underline", "boxed"], "group": "style" },
        { "propName": "orientation", "type": "select", "label": "Orientation", "options": ["horizontal", "vertical"], "group": "style" },
        { "propName": "alignment", "type": "select", "label": "Alignment", "options": ["start", "center", "end"], "group": "style" },
        { "propName": "size", "type": "select", "label": "Size", "options": ["xs", "sm", "md", "lg", "xl"], "group": "style" },
        { "propName": "fill", "type": "boolean", "label": "Fill Width", "group": "style" },
        { "propName": "scrollable", "type": "boolean", "label": "Scrollable", "group": "behavior" },
        { "propName": "closeable", "type": "boolean", "label": "Closeable Tabs", "group": "behavior" },
        { "propName": "iconsOnly", "type": "boolean", "label": "Icons Only", "group": "style" }
    ]
}
```

#### F.1.3 Carousel Panel

**File**: `src/infrastructure/data/panels/carousel.json`

```json
{
    "id": "carousel",
    "componentId": "Carousel",
    "title": "Carousel",
    "description": "Image/content slider with autoplay, gestures, and keyboard navigation.",
    "layout": { "width": "100%", "minWidth": "full" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "autoplay": true,
        "interval": 5000,
        "loop": true,
        "showControls": true,
        "showIndicators": true,
        "showProgress": true,
        "showPlayback": true,
        "pauseOnHover": true,
        "enableGestures": true,
        "enableKeyboard": true,
        "effect": "slide",
        "slideSet": "hero"
    },
    "controls": [
        { "propName": "autoplay", "type": "boolean", "label": "Autoplay", "group": "behavior" },
        { "propName": "interval", "type": "slider", "label": "Interval (ms)", "min": 1000, "max": 10000, "step": 500, "group": "behavior" },
        { "propName": "loop", "type": "boolean", "label": "Loop", "group": "behavior" },
        { "propName": "showControls", "type": "boolean", "label": "Show Arrows", "group": "style" },
        { "propName": "showIndicators", "type": "boolean", "label": "Show Dots", "group": "style" },
        { "propName": "showProgress", "type": "boolean", "label": "Show Progress", "group": "style" },
        { "propName": "showPlayback", "type": "boolean", "label": "Show Play/Pause", "group": "style" },
        { "propName": "pauseOnHover", "type": "boolean", "label": "Pause on Hover", "group": "behavior" },
        { "propName": "enableGestures", "type": "boolean", "label": "Touch Gestures", "group": "behavior" },
        { "propName": "effect", "type": "select", "label": "Effect", "options": ["slide", "fade"], "group": "style" }
    ]
}
```

---

### F.2 Overlay Components

#### F.2.1 Modal Panel

**File**: `src/infrastructure/data/panels/modal.json`

```json
{
    "id": "modal",
    "componentId": "Modal",
    "title": "Modal Dialog",
    "description": "Overlay dialog with backdrop, animations, and multiple variants.",
    "layout": { "width": "100%", "height": "500px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "isOpen": true,
        "title": "Confirm Action",
        "subtitle": "Please review the details below",
        "size": "md",
        "showClose": true,
        "closeOnBackdrop": true,
        "closeOnEscape": true,
        "centered": true,
        "variant": "default"
    },
    "controls": [
        { "propName": "isOpen", "type": "boolean", "label": "Open", "group": "behavior" },
        { "propName": "title", "type": "text", "label": "Title", "group": "content" },
        { "propName": "subtitle", "type": "text", "label": "Subtitle", "group": "content" },
        { "propName": "size", "type": "select", "label": "Size", "options": ["sm", "md", "lg", "xl", "full"], "group": "style" },
        { "propName": "variant", "type": "select", "label": "Variant", "options": ["default", "glass", "bordered", "elevated"], "group": "style" },
        { "propName": "showClose", "type": "boolean", "label": "Show Close", "group": "behavior" },
        { "propName": "closeOnBackdrop", "type": "boolean", "label": "Close on Backdrop", "group": "behavior" },
        { "propName": "closeOnEscape", "type": "boolean", "label": "Close on ESC", "group": "behavior" },
        { "propName": "centered", "type": "boolean", "label": "Centered", "group": "style" }
    ]
}
```

#### F.2.2 Toast Panel

**File**: `src/infrastructure/data/panels/toast.json`

```json
{
    "id": "toast",
    "componentId": "Toast",
    "title": "Toast Notifications",
    "description": "Non-blocking notification system with positions and stacking.",
    "layout": { "width": "100%", "height": "400px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "position": "top-right",
        "maxToasts": 5,
        "stacked": true,
        "gap": 12,
        "animationDuration": 300,
        "pauseOnHover": true,
        "demoToastType": "success",
        "demoToastMessage": "Operation completed successfully!"
    },
    "controls": [
        { "propName": "position", "type": "select", "label": "Position", "options": ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"], "group": "style" },
        { "propName": "maxToasts", "type": "slider", "label": "Max Toasts", "min": 1, "max": 10, "step": 1, "group": "behavior" },
        { "propName": "stacked", "type": "boolean", "label": "Stacked", "group": "behavior" },
        { "propName": "gap", "type": "slider", "label": "Gap (px)", "min": 4, "max": 24, "step": 2, "group": "style" },
        { "propName": "pauseOnHover", "type": "boolean", "label": "Pause on Hover", "group": "behavior" },
        { "propName": "demoToastType", "type": "select", "label": "Demo Type", "options": ["success", "error", "warning", "info"], "group": "demo" },
        { "propName": "demoToastMessage", "type": "text", "label": "Demo Message", "group": "demo" }
    ]
}
```

#### F.2.3 Tooltip Panel

**File**: `src/infrastructure/data/panels/tooltip.json`

```json
{
    "id": "tooltip",
    "componentId": "Tooltip",
    "title": "Tooltip",
    "description": "Contextual hover information with multiple positions.",
    "layout": { "width": "auto", "height": "200px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "content": "This is helpful information",
        "position": "top",
        "delay": 300,
        "triggerText": "Hover over me"
    },
    "controls": [
        { "propName": "content", "type": "text", "label": "Content", "group": "content" },
        { "propName": "position", "type": "select", "label": "Position", "options": ["top", "bottom", "left", "right"], "group": "style" },
        { "propName": "delay", "type": "slider", "label": "Delay (ms)", "min": 0, "max": 1000, "step": 50, "group": "behavior" },
        { "propName": "triggerText", "type": "text", "label": "Trigger Text", "group": "content" }
    ]
}
```

---

### F.3 Feedback Components

#### F.3.1 ProgressBar Panel

**File**: `src/infrastructure/data/panels/progress-bar.json`

```json
{
    "id": "progress-bar",
    "componentId": "ProgressBar",
    "title": "Progress Bar",
    "description": "Visual progress indicator with variants and animations.",
    "layout": { "width": "100%", "height": "auto" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "value": 65,
        "max": 100,
        "label": "Loading...",
        "showValue": false,
        "showPercentage": true,
        "size": "md",
        "variant": "neon",
        "color": "cyan",
        "animated": true,
        "indeterminate": false
    },
    "controls": [
        { "propName": "value", "type": "slider", "label": "Value", "min": 0, "max": 100, "step": 1, "group": "data" },
        { "propName": "max", "type": "slider", "label": "Max", "min": 1, "max": 1000, "step": 10, "group": "data" },
        { "propName": "label", "type": "text", "label": "Label", "group": "content" },
        { "propName": "showValue", "type": "boolean", "label": "Show Value", "group": "style" },
        { "propName": "showPercentage", "type": "boolean", "label": "Show %", "group": "style" },
        { "propName": "size", "type": "select", "label": "Size", "options": ["xs", "sm", "md", "lg", "xl"], "group": "style" },
        { "propName": "variant", "type": "select", "label": "Variant", "options": ["default", "neon", "gradient", "striped"], "group": "style" },
        { "propName": "color", "type": "select", "label": "Color", "options": ["cyan", "blue", "green", "red", "yellow", "purple"], "group": "style" },
        { "propName": "animated", "type": "boolean", "label": "Animated", "group": "behavior" },
        { "propName": "indeterminate", "type": "boolean", "label": "Indeterminate", "group": "behavior" }
    ]
}
```

---

### F.4 Control Components

#### F.4.1 Toggle Panel

**File**: `src/infrastructure/data/panels/toggle.json`

```json
{
    "id": "toggle",
    "componentId": "Toggle",
    "title": "Toggle Switch",
    "description": "On/off switch with customizable colors and labels.",
    "layout": { "width": "auto", "height": "auto" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "checked": true,
        "onColor": "#10b981",
        "offColor": "#4b5563",
        "size": "md",
        "label": "Enable Feature",
        "labelPosition": "right",
        "onLabel": "ON",
        "offLabel": "OFF",
        "disabled": false
    },
    "controls": [
        { "propName": "checked", "type": "boolean", "label": "Checked", "group": "behavior" },
        { "propName": "onColor", "type": "color", "label": "On Color", "group": "style" },
        { "propName": "offColor", "type": "color", "label": "Off Color", "group": "style" },
        { "propName": "size", "type": "select", "label": "Size", "options": ["sm", "md", "lg"], "group": "style" },
        { "propName": "label", "type": "text", "label": "Label", "group": "content" },
        { "propName": "labelPosition", "type": "select", "label": "Label Position", "options": ["left", "right"], "group": "style" },
        { "propName": "onLabel", "type": "text", "label": "On Label", "group": "content" },
        { "propName": "offLabel", "type": "text", "label": "Off Label", "group": "content" },
        { "propName": "disabled", "type": "boolean", "label": "Disabled", "group": "behavior" }
    ]
}
```

---

### F.5 Data Visualization

#### F.5.1 TreeView Panel

**File**: `src/infrastructure/data/panels/tree-view.json`

```json
{
    "id": "tree-view",
    "componentId": "TreeView",
    "title": "Tree View",
    "description": "Hierarchical tree structure with selection and expansion.",
    "layout": { "width": "100%", "height": "500px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "selectionMode": "single",
        "size": "md",
        "showLines": true,
        "autoExpandParent": true,
        "isDark": true,
        "dataSet": "fileSystem"
    },
    "controls": [
        { "propName": "selectionMode", "type": "select", "label": "Selection", "options": ["none", "single", "multiple"], "group": "behavior" },
        { "propName": "size", "type": "select", "label": "Size", "options": ["xs", "sm", "md", "lg", "xl"], "group": "style" },
        { "propName": "showLines", "type": "boolean", "label": "Show Lines", "group": "style" },
        { "propName": "autoExpandParent", "type": "boolean", "label": "Auto Expand", "group": "behavior" },
        { "propName": "isDark", "type": "boolean", "label": "Dark Mode", "group": "style" },
        { "propName": "dataSet", "type": "select", "label": "Data Set", "options": ["fileSystem", "organization", "categories"], "group": "data" }
    ]
}
```

---

### F.6 Label Components

#### F.6.1 TechBadge Panel

**File**: `src/infrastructure/data/panels/tech-badge.json`

```json
{
    "id": "tech-badge",
    "componentId": "TechBadge",
    "title": "Technology Badge",
    "description": "Technology/framework indicator with icon and brand colors.",
    "layout": { "width": "auto", "height": "auto" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "techKey": "react",
        "size": "md",
        "showIcon": true,
        "active": false
    },
    "controls": [
        { "propName": "techKey", "type": "select", "label": "Technology", "options": ["react", "typescript", "javascript", "nodejs", "python", "go", "rust", "docker", "kubernetes", "aws", "azure", "graphql", "postgresql", "mongodb", "redis", "tailwind", "vite"], "group": "content" },
        { "propName": "size", "type": "select", "label": "Size", "options": ["sm", "md", "lg"], "group": "style" },
        { "propName": "showIcon", "type": "boolean", "label": "Show Icon", "group": "style" },
        { "propName": "active", "type": "boolean", "label": "Active", "group": "behavior" }
    ]
}
```

---

### F.7 Required Wrapper Components

For complex components, wrappers are needed to provide mock data. Below are the wrapper specifications:

#### F.7.1 SideBarMenuWrapper

**File**: `src/infrastructure/wrappers/SideBarMenuWrapper.tsx`

```typescript
import React from 'react';
import { SideBarMenu, SideBarMenuModel, MenuCategory } from 'ark-alliance-react-ui';

interface SideBarMenuWrapperProps extends Omit<SideBarMenuModel, 'categories'> {
    categorySet: 'default' | 'trading' | 'admin';
}

const categoryData: Record<string, MenuCategory[]> = {
    default: [
        { name: 'Dashboard', icon: '🏠', items: [
            { key: 'home', label: 'Home', icon: 'house' },
            { key: 'analytics', label: 'Analytics', icon: 'chart-line', badge: 3 }
        ]},
        { name: 'Components', icon: '🧩', items: [
            { key: 'buttons', label: 'Buttons', icon: 'play' },
            { key: 'inputs', label: 'Inputs', icon: 'keyboard' },
            { key: 'charts', label: 'Charts', icon: 'chart-bar' }
        ]}
    ],
    trading: [...], // Trading-specific menu
    admin: [...],   // Admin-specific menu
};

export const SideBarMenuWrapper: React.FC<SideBarMenuWrapperProps> = ({
    categorySet = 'default',
    ...props
}) => {
    return <SideBarMenu categories={categoryData[categorySet]} {...props} />;
};
```

#### F.7.2 CarouselWrapper

**File**: `src/infrastructure/wrappers/CarouselWrapper.tsx`

```typescript
import React from 'react';
import { Carousel, CarouselModel, CarouselSlide } from 'ark-alliance-react-ui';

interface CarouselWrapperProps extends Omit<CarouselModel, 'children'> {
    slideSet: 'hero' | 'products' | 'testimonials';
}

const slideData: Record<string, CarouselSlide[]> = {
    hero: [
        { id: '1', title: 'Welcome to Ark Alliance', subtitle: 'Next-Gen UI', description: 'Build stunning applications', imageUrl: 'https://picsum.photos/1200/600?random=1' },
        { id: '2', title: 'React Components', subtitle: 'MVVM Architecture', description: 'Enterprise-grade components', imageUrl: 'https://picsum.photos/1200/600?random=2' },
        { id: '3', title: 'TypeScript First', subtitle: 'Full Type Safety', description: 'Zero runtime errors', imageUrl: 'https://picsum.photos/1200/600?random=3' }
    ],
    products: [...],
    testimonials: [...]
};

export const CarouselWrapper: React.FC<CarouselWrapperProps> = ({
    slideSet = 'hero',
    ...props
}) => {
    return <Carousel slides={slideData[slideSet]} {...props} />;
};
```

---

### F.8 Updated Catalogue Configuration

**File**: `src/infrastructure/data/catalogue.json`

Add these new categories to the existing catalogue:

```json
{
    "categories": [
        // ... existing categories ...
        
        {
            "name": "Navigation",
            "icon": "compass",
            "description": "Menus, tabs, and navigation components.",
            "componentIds": [
                "sidebar-menu",
                "tab-control",
                "carousel"
            ]
        },
        {
            "name": "Overlays",
            "icon": "window-restore",
            "description": "Modals, toasts, and tooltips.",
            "componentIds": [
                "modal",
                "toast",
                "tooltip"
            ]
        },
        {
            "name": "Controls",
            "icon": "toggle-on",
            "description": "Toggle switches and interactive controls.",
            "componentIds": [
                "toggle"
            ]
        },
        {
            "name": "Progress",
            "icon": "spinner",
            "description": "Loading and progress indicators.",
            "componentIds": [
                "progress-bar"
            ]
        },
        {
            "name": "Trees",
            "icon": "sitemap",
            "description": "Hierarchical data visualization.",
            "componentIds": [
                "tree-view"
            ]
        },
        {
            "name": "Labels",
            "icon": "tag",
            "description": "Badges and status indicators.",
            "componentIds": [
                "badge-status",
                "tech-badge"
            ]
        }
    ]
}
```

---

### F.9 ComponentResolver Updates

**File**: `src/infrastructure/ComponentResolver.ts`

Add these imports and mappings:

```typescript
// New imports
import { Modal, Toast, Tooltip, ProgressBar, Toggle, TreeView, TechBadge } from 'ark-alliance-react-ui';
import { SideBarMenuWrapper } from './wrappers/SideBarMenuWrapper';
import { TabControlWrapper } from './wrappers/TabControlWrapper';
import { CarouselWrapper } from './wrappers/CarouselWrapper';
import { ToastWrapper } from './wrappers/ToastWrapper';
import { TreeViewWrapper } from './wrappers/TreeViewWrapper';

// Add to componentMap
const componentMap: Record<string, ComponentType<any>> = {
    // ... existing mappings ...
    
    // Navigation
    'SideBarMenu': SideBarMenuWrapper,
    'TabControl': TabControlWrapper,
    'Carousel': CarouselWrapper,
    
    // Overlays
    'Modal': Modal,
    'Toast': ToastWrapper,
    'Tooltip': Tooltip,
    
    // Controls
    'Toggle': Toggle,
    
    // Progress
    'ProgressBar': ProgressBar,
    
    // Trees
    'TreeView': TreeViewWrapper,
    
    // Labels
    'TechBadge': TechBadge,
};
```

---

### F.10 PropControl Enhancement

**File**: `src/presentation/components/Catalogue/PropControl.tsx`

Add the missing `number` and `divider` control types:

```typescript
// Add to the switch statement:

case 'number':
    return (
        <div className="flex flex-col space-y-1.5 group">
            <label className="text-[10px] font-bold text-ark-text-muted uppercase tracking-wider group-hover:text-ark-primary transition-colors">
                {definition.name}
            </label>
            <input
                type="number"
                min={definition.min}
                max={definition.max}
                step={definition.step || 1}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                className="block w-full rounded-lg border border-ark-border bg-ark-bg-tertiary/30 py-2 px-3 text-xs text-ark-text-primary focus:border-ark-primary focus:ring-1 focus:ring-ark-primary outline-none transition-all"
            />
        </div>
    );

case 'divider':
    return (
        <div className="flex items-center space-x-2 text-ark-text-muted pt-4 pb-2">
            <div className="h-px flex-1 bg-ark-border/50"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{definition.name}</span>
            <div className="h-px flex-1 bg-ark-border/50"></div>
        </div>
    );
```

---

### F.11 Panel Config Property Name Fixes

The following files need `"name"` changed to `"propName"` in their controls array:

#### Fix Script (PowerShell)

```powershell
# Files to fix
$files = @(
    "input-neon.json",
    "input-select.json",
    "input-numeric.json",
    "input-slider.json",
    "input-textarea.json",
    "input-file.json",
    "input-editor.json",
    "chart-financial.json",
    "chart-trend.json",
    "chart-test.json"
)

$basePath = "src/infrastructure/data/panels"

foreach ($file in $files) {
    $filePath = Join-Path $basePath $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        # Replace "name": with "propName": only in controls context
        $content = $content -replace '"name":\s*"(\w+)"', '"propName": "$1"'
        Set-Content $filePath $content -NoNewline
        Write-Host "Fixed: $file"
    }
}
```

---

### F.12 Implementation Checklist

#### Phase 1: Core Fixes (Priority Critical)

- [ ] Fix `propName` vs `name` in 10 panel JSON files
- [ ] Add `number` control type to PropControl.tsx
- [ ] Add `divider` control type to PropControl.tsx
- [ ] Update codeGenerator.ts with children handling
- [ ] Update codeGenerator.ts with import statements

#### Phase 2: New Panel Configs (Priority High)

- [ ] Create `sidebar-menu.json`
- [ ] Create `tab-control.json`
- [ ] Create `carousel.json`
- [ ] Create `modal.json`
- [ ] Create `toast.json`
- [ ] Create `tooltip.json`
- [ ] Create `progress-bar.json`
- [ ] Create `toggle.json`
- [ ] Create `tree-view.json`
- [ ] Create `tech-badge.json`

#### Phase 3: Wrapper Components (Priority High)

- [ ] Create SideBarMenuWrapper.tsx
- [ ] Create TabControlWrapper.tsx
- [ ] Create CarouselWrapper.tsx
- [ ] Create ToastWrapper.tsx
- [ ] Create TreeViewWrapper.tsx
- [ ] Create ModalWrapper.tsx (for demo content)

#### Phase 4: Catalogue Update (Priority Medium)

- [ ] Add Navigation category
- [ ] Add Overlays category
- [ ] Add Controls category
- [ ] Add Progress category
- [ ] Add Trees category
- [ ] Update Labels category

#### Phase 5: ComponentResolver (Priority Medium)

- [ ] Import all new wrappers
- [ ] Add all new component mappings
- [ ] Test all component resolutions

---

### F.13 Verification Plan

After implementation, verify each showcase:

1. **Visual Correctness**
   - Component renders without errors
   - All styles apply correctly
   - Dark/light theme works

2. **Property Controls**
   - All controls appear in Properties panel
   - Boolean toggles work
   - Sliders update values
   - Select dropdowns show options
   - Color pickers function

3. **Real-time Updates**
   - Property changes reflect immediately
   - No lag or flicker
   - State persists during interaction

4. **Code Generation**
   - TypeScript output is valid
   - JavaScript output is valid
   - Go/Templ output is correct syntax
   - Blazor output is correct syntax
   - Import statements included
   - Children rendered as content

5. **Mock Data**
   - Realistic data displayed
   - Sufficient variety
   - No placeholder text

---

**Appendix F Version**: 1.0  
**Created**: 2026-01-26  
**Author**: AI Software Architect (Antigravity IDE)

---

## Appendix G: Desktop, Panel, and Finance/Trading Components

This appendix adds panel configurations for the complete Desktop OS simulation, advanced panel components, and comprehensive Finance/Trading grid components.

---

### G.1 Desktop OS Components (5 Components)

The Desktop suite provides a complete operating system simulation experience.

#### G.1.1 DesktopPage Panel

**File**: `src/infrastructure/data/panels/desktop-page.json`

```json
{
    "id": "desktop-page",
    "componentId": "DesktopPage",
    "title": "Desktop Page",
    "description": "Complete desktop OS simulation with icons, windows, and taskbar.",
    "layout": { "width": "100%", "minWidth": "full", "height": "800px" },
    "preview": { "background": "none", "fullscreen": true },
    "defaultProps": {
        "wallpaper": "gradient",
        "visualMode": "neon",
        "showTaskbar": true,
        "showStartMenu": false,
        "showIcons": true,
        "gridColumns": 10,
        "gridRows": 6,
        "iconSet": "default"
    },
    "controls": [
        { "propName": "wallpaper", "type": "select", "label": "Wallpaper", "options": ["gradient", "dark", "light", "image"], "group": "style" },
        { "propName": "visualMode", "type": "select", "label": "Visual Mode", "options": ["normal", "neon", "minimal", "glass"], "group": "style" },
        { "propName": "showTaskbar", "type": "boolean", "label": "Show Taskbar", "group": "behavior" },
        { "propName": "showIcons", "type": "boolean", "label": "Show Desktop Icons", "group": "behavior" },
        { "propName": "gridColumns", "type": "slider", "label": "Grid Columns", "min": 4, "max": 20, "step": 1, "group": "layout" },
        { "propName": "gridRows", "type": "slider", "label": "Grid Rows", "min": 2, "max": 12, "step": 1, "group": "layout" },
        { "propName": "iconSet", "type": "select", "label": "Icon Set", "options": ["default", "trading", "dev", "productivity"], "group": "content" }
    ]
}
```

#### G.1.2 WindowPanel Panel

**File**: `src/infrastructure/data/panels/window-panel.json`

```json
{
    "id": "window-panel",
    "componentId": "WindowPanel",
    "title": "Window Panel",
    "description": "Draggable, resizable window with title bar, controls, and content.",
    "layout": { "width": "100%", "height": "500px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "title": "My Application",
        "isOpen": true,
        "isMinimized": false,
        "isMaximized": false,
        "width": 600,
        "height": 400,
        "x": 100,
        "y": 50,
        "resizable": true,
        "draggable": true,
        "showClose": true,
        "showMinimize": true,
        "showMaximize": true,
        "visualMode": "neon"
    },
    "controls": [
        { "propName": "title", "type": "text", "label": "Title", "group": "content" },
        { "propName": "isMaximized", "type": "boolean", "label": "Maximized", "group": "behavior" },
        { "propName": "isMinimized", "type": "boolean", "label": "Minimized", "group": "behavior" },
        { "propName": "width", "type": "slider", "label": "Width", "min": 200, "max": 1200, "step": 50, "group": "layout" },
        { "propName": "height", "type": "slider", "label": "Height", "min": 150, "max": 800, "step": 50, "group": "layout" },
        { "propName": "resizable", "type": "boolean", "label": "Resizable", "group": "behavior" },
        { "propName": "draggable", "type": "boolean", "label": "Draggable", "group": "behavior" },
        { "propName": "showClose", "type": "boolean", "label": "Show Close", "group": "style" },
        { "propName": "showMinimize", "type": "boolean", "label": "Show Minimize", "group": "style" },
        { "propName": "showMaximize", "type": "boolean", "label": "Show Maximize", "group": "style" },
        { "propName": "visualMode", "type": "select", "label": "Visual Mode", "options": ["normal", "neon", "minimal", "glass"], "group": "style" }
    ]
}
```

#### G.1.3 DesktopIcon Panel

**File**: `src/infrastructure/data/panels/desktop-icon.json`

```json
{
    "id": "desktop-icon",
    "componentId": "DesktopIcon",
    "title": "Desktop Icon",
    "description": "Application icon for desktop with label and click action.",
    "layout": { "width": "auto", "height": "auto" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "label": "My App",
        "icon": "📊",
        "selected": false,
        "size": "md"
    },
    "controls": [
        { "propName": "label", "type": "text", "label": "Label", "group": "content" },
        { "propName": "icon", "type": "text", "label": "Icon (emoji)", "group": "content" },
        { "propName": "selected", "type": "boolean", "label": "Selected", "group": "behavior" },
        { "propName": "size", "type": "select", "label": "Size", "options": ["sm", "md", "lg"], "group": "style" }
    ]
}
```

#### G.1.4 Taskbar Panel

**File**: `src/infrastructure/data/panels/taskbar.json`

```json
{
    "id": "taskbar",
    "componentId": "Taskbar",
    "title": "Taskbar",
    "description": "Desktop taskbar with start button, running apps, and system tray.",
    "layout": { "width": "100%", "height": "auto" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "position": "bottom",
        "showClock": true,
        "showSystemTray": true,
        "showStartButton": true,
        "visualMode": "neon",
        "appSet": "default"
    },
    "controls": [
        { "propName": "position", "type": "select", "label": "Position", "options": ["bottom", "top"], "group": "style" },
        { "propName": "showClock", "type": "boolean", "label": "Show Clock", "group": "behavior" },
        { "propName": "showSystemTray", "type": "boolean", "label": "Show System Tray", "group": "behavior" },
        { "propName": "showStartButton", "type": "boolean", "label": "Show Start Button", "group": "behavior" },
        { "propName": "visualMode", "type": "select", "label": "Visual Mode", "options": ["normal", "neon", "minimal", "glass"], "group": "style" },
        { "propName": "appSet", "type": "select", "label": "Running Apps", "options": ["default", "trading", "productivity"], "group": "content" }
    ]
}
```

#### G.1.5 StartMenu Panel

**File**: `src/infrastructure/data/panels/start-menu.json`

```json
{
    "id": "start-menu",
    "componentId": "StartMenu",
    "title": "Start Menu",
    "description": "Application launcher with search, categories, and recent items.",
    "layout": { "width": "auto", "height": "500px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "isOpen": true,
        "showSearch": true,
        "showRecent": true,
        "showPinned": true,
        "showAllApps": true,
        "visualMode": "glass",
        "appSet": "default"
    },
    "controls": [
        { "propName": "isOpen", "type": "boolean", "label": "Open", "group": "behavior" },
        { "propName": "showSearch", "type": "boolean", "label": "Show Search", "group": "behavior" },
        { "propName": "showRecent", "type": "boolean", "label": "Show Recent", "group": "behavior" },
        { "propName": "showPinned", "type": "boolean", "label": "Show Pinned", "group": "behavior" },
        { "propName": "showAllApps", "type": "boolean", "label": "Show All Apps", "group": "behavior" },
        { "propName": "visualMode", "type": "select", "label": "Visual Mode", "options": ["normal", "neon", "minimal", "glass"], "group": "style" },
        { "propName": "appSet", "type": "select", "label": "App Set", "options": ["default", "trading", "dev", "productivity"], "group": "content" }
    ]
}
```

---

### G.2 Panel Components

#### G.2.1 GenericPanel Panel

**File**: `src/infrastructure/data/panels/generic-panel.json`

```json
{
    "id": "generic-panel",
    "componentId": "GenericPanel",
    "title": "Generic Panel",
    "description": "Universal panel with glassmorphism, gradients, overlays, and layouts.",
    "layout": { "width": "100%", "height": "400px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "title": "Advanced Panel",
        "variant": "glass",
        "padding": "md",
        "collapsible": true,
        "collapsed": false,
        "glassBlur": 12,
        "shadowIntensity": 30,
        "borderRadius": 16,
        "opacity": 90,
        "useGradient": true,
        "gradientStart": "#0f172a",
        "gradientEnd": "#1e293b",
        "gradientDirection": 135,
        "showGrid": true,
        "gridSize": 20,
        "showGlow": true,
        "glowColor": "#06b6d4",
        "layout": "inline",
        "scrollable": false
    },
    "controls": [
        { "propName": "title", "type": "text", "label": "Title", "group": "content" },
        { "propName": "variant", "type": "select", "label": "Variant", "options": ["default", "glass", "bordered", "elevated"], "group": "style" },
        { "propName": "padding", "type": "select", "label": "Padding", "options": ["none", "xs", "sm", "md", "lg", "xl"], "group": "style" },
        { "type": "divider", "name": "Collapsible" },
        { "propName": "collapsible", "type": "boolean", "label": "Collapsible", "group": "behavior" },
        { "propName": "collapsed", "type": "boolean", "label": "Collapsed", "group": "behavior" },
        { "type": "divider", "name": "Glass Effect" },
        { "propName": "glassBlur", "type": "slider", "label": "Blur", "min": 0, "max": 40, "step": 2, "group": "style" },
        { "propName": "shadowIntensity", "type": "slider", "label": "Shadow", "min": 0, "max": 100, "step": 5, "group": "style" },
        { "propName": "borderRadius", "type": "slider", "label": "Radius", "min": 0, "max": 50, "step": 2, "group": "style" },
        { "propName": "opacity", "type": "slider", "label": "Opacity", "min": 0, "max": 100, "step": 5, "group": "style" },
        { "type": "divider", "name": "Gradient" },
        { "propName": "useGradient", "type": "boolean", "label": "Use Gradient", "group": "style" },
        { "propName": "gradientStart", "type": "color", "label": "Gradient Start", "group": "style" },
        { "propName": "gradientEnd", "type": "color", "label": "Gradient End", "group": "style" },
        { "propName": "gradientDirection", "type": "slider", "label": "Direction", "min": 0, "max": 360, "step": 15, "group": "style" },
        { "type": "divider", "name": "Overlays" },
        { "propName": "showGrid", "type": "boolean", "label": "Show Grid", "group": "style" },
        { "propName": "gridSize", "type": "slider", "label": "Grid Size", "min": 10, "max": 50, "step": 5, "group": "style" },
        { "propName": "showGlow", "type": "boolean", "label": "Show Glow", "group": "style" },
        { "propName": "glowColor", "type": "color", "label": "Glow Color", "group": "style" },
        { "type": "divider", "name": "Layout" },
        { "propName": "layout", "type": "select", "label": "Layout", "options": ["inline", "sidebar-left", "sidebar-right", "fullscreen"], "group": "layout" },
        { "propName": "scrollable", "type": "boolean", "label": "Scrollable", "group": "behavior" }
    ]
}
```

#### G.2.2 ControlPanel Panel

**File**: `src/infrastructure/data/panels/control-panel.json`

```json
{
    "id": "control-panel",
    "componentId": "ControlPanel",
    "title": "Control Panel",
    "description": "Side panel for controls with collapsible sections and header actions.",
    "layout": { "width": "100%", "height": "500px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "title": "Control Panel",
        "titleIcon": "⚙️",
        "visible": true,
        "collapsible": true,
        "defaultCollapsed": false,
        "position": "right",
        "width": 280,
        "isLoading": false,
        "connectionStatus": "connected"
    },
    "controls": [
        { "propName": "title", "type": "text", "label": "Title", "group": "content" },
        { "propName": "titleIcon", "type": "text", "label": "Icon (emoji)", "group": "content" },
        { "propName": "visible", "type": "boolean", "label": "Visible", "group": "behavior" },
        { "propName": "collapsible", "type": "boolean", "label": "Collapsible", "group": "behavior" },
        { "propName": "defaultCollapsed", "type": "boolean", "label": "Start Collapsed", "group": "behavior" },
        { "propName": "position", "type": "select", "label": "Position", "options": ["right", "left", "top", "bottom", "floating"], "group": "layout" },
        { "propName": "width", "type": "slider", "label": "Width", "min": 150, "max": 600, "step": 20, "group": "layout" },
        { "propName": "isLoading", "type": "boolean", "label": "Loading", "group": "behavior" },
        { "propName": "connectionStatus", "type": "select", "label": "Connection", "options": ["connected", "disconnected", "connecting", "error"], "group": "demo" }
    ]
}
```

---

### G.3 Finance/Trading Components (4 Components)

Complete trading grid components with realistic financial data.

#### G.3.1 OrdersGrid Panel

**File**: `src/infrastructure/data/panels/orders-grid.json`

```json
{
    "id": "orders-grid",
    "componentId": "OrdersGrid",
    "title": "Orders Grid",
    "description": "Open orders display with modify/cancel actions and real-time updates.",
    "layout": { "width": "100%", "minWidth": "full", "height": "500px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "title": "Open Orders",
        "isDark": true,
        "showTypeFilter": true,
        "showSymbolFilter": true,
        "showStatusFilter": false,
        "enableSelection": false,
        "enableBatchCancel": true,
        "compact": false,
        "orderCount": 15,
        "instrumentType": "CRYPTO_PERP"
    },
    "controls": [
        { "propName": "title", "type": "text", "label": "Title", "group": "content" },
        { "propName": "showTypeFilter", "type": "boolean", "label": "Type Filter", "group": "behavior" },
        { "propName": "showSymbolFilter", "type": "boolean", "label": "Symbol Filter", "group": "behavior" },
        { "propName": "showStatusFilter", "type": "boolean", "label": "Status Filter", "group": "behavior" },
        { "propName": "enableSelection", "type": "boolean", "label": "Selection", "group": "behavior" },
        { "propName": "enableBatchCancel", "type": "boolean", "label": "Batch Cancel", "group": "behavior" },
        { "propName": "compact", "type": "boolean", "label": "Compact Mode", "group": "style" },
        { "propName": "orderCount", "type": "slider", "label": "Demo Orders", "min": 5, "max": 50, "step": 5, "group": "demo" },
        { "propName": "instrumentType", "type": "select", "label": "Instrument", "options": ["CRYPTO_SPOT", "CRYPTO_PERP", "CRYPTO_FUTURES", "OPTIONS", "STOCK"], "group": "demo" }
    ]
}
```

#### G.3.2 PositionsGrid Panel

**File**: `src/infrastructure/data/panels/positions-grid.json`

```json
{
    "id": "positions-grid",
    "componentId": "PositionsGrid",
    "title": "Positions Grid",
    "description": "Open positions with P&L, leverage, margin, and close actions.",
    "layout": { "width": "100%", "minWidth": "full", "height": "500px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "title": "Positions",
        "isDark": true,
        "showInstrumentFilter": false,
        "showSymbolFilter": true,
        "enableSelection": false,
        "showTotalPnl": true,
        "compact": false,
        "positionCount": 8,
        "instrumentType": "CRYPTO_PERP"
    },
    "controls": [
        { "propName": "title", "type": "text", "label": "Title", "group": "content" },
        { "propName": "showInstrumentFilter", "type": "boolean", "label": "Instrument Filter", "group": "behavior" },
        { "propName": "showSymbolFilter", "type": "boolean", "label": "Symbol Filter", "group": "behavior" },
        { "propName": "enableSelection", "type": "boolean", "label": "Selection", "group": "behavior" },
        { "propName": "showTotalPnl", "type": "boolean", "label": "Show Total P&L", "group": "behavior" },
        { "propName": "compact", "type": "boolean", "label": "Compact Mode", "group": "style" },
        { "propName": "positionCount", "type": "slider", "label": "Demo Positions", "min": 1, "max": 20, "step": 1, "group": "demo" },
        { "propName": "instrumentType", "type": "select", "label": "Instrument", "options": ["CRYPTO_SPOT", "CRYPTO_PERP", "CRYPTO_FUTURES", "OPTIONS", "STOCK"], "group": "demo" }
    ]
}
```

#### G.3.3 TradeHistoryGrid Panel

**File**: `src/infrastructure/data/panels/trade-history-grid.json`

```json
{
    "id": "trade-history-grid",
    "componentId": "TradeHistoryGrid",
    "title": "Trade History Grid",
    "description": "Historical trades with realized P&L, fees, and export functionality.",
    "layout": { "width": "100%", "minWidth": "full", "height": "500px" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "title": "Trade History",
        "isDark": true,
        "showDateFilter": true,
        "showSymbolFilter": true,
        "showSideFilter": true,
        "enableExport": true,
        "compact": false,
        "tradeCount": 30,
        "instrumentType": "CRYPTO_PERP"
    },
    "controls": [
        { "propName": "title", "type": "text", "label": "Title", "group": "content" },
        { "propName": "showDateFilter", "type": "boolean", "label": "Date Filter", "group": "behavior" },
        { "propName": "showSymbolFilter", "type": "boolean", "label": "Symbol Filter", "group": "behavior" },
        { "propName": "showSideFilter", "type": "boolean", "label": "Side Filter", "group": "behavior" },
        { "propName": "enableExport", "type": "boolean", "label": "Export", "group": "behavior" },
        { "propName": "compact", "type": "boolean", "label": "Compact Mode", "group": "style" },
        { "propName": "tradeCount", "type": "slider", "label": "Demo Trades", "min": 10, "max": 100, "step": 10, "group": "demo" },
        { "propName": "instrumentType", "type": "select", "label": "Instrument", "options": ["CRYPTO_SPOT", "CRYPTO_PERP", "CRYPTO_FUTURES", "OPTIONS", "STOCK"], "group": "demo" }
    ]
}
```

#### G.3.4 TradingGridCard Panel

**File**: `src/infrastructure/data/panels/trading-grid-card.json`

```json
{
    "id": "trading-grid-card",
    "componentId": "TradingGridCard",
    "title": "Trading Grid Card",
    "description": "Container card for trading grids with header, status, and styling.",
    "layout": { "width": "100%", "height": "auto" },
    "preview": { "background": "dark" },
    "defaultProps": {
        "title": "Trading Dashboard",
        "status": "idle",
        "compact": false,
        "showHeader": true,
        "isDark": true
    },
    "controls": [
        { "propName": "title", "type": "text", "label": "Title", "group": "content" },
        { "propName": "status", "type": "select", "label": "Status", "options": ["idle", "loading", "success", "error", "warning"], "group": "behavior" },
        { "propName": "compact", "type": "boolean", "label": "Compact", "group": "style" },
        { "propName": "showHeader", "type": "boolean", "label": "Show Header", "group": "style" },
        { "propName": "isDark", "type": "boolean", "label": "Dark Mode", "group": "style" }
    ]
}
```

---

### G.4 Required Wrapper Components for Trading

#### G.4.1 OrdersGridWrapper

**File**: `src/infrastructure/wrappers/OrdersGridWrapper.tsx`

```typescript
import React from 'react';
import { OrdersGrid, OrdersGridModel, FinancialOrder, InstrumentType } from 'ark-alliance-react-ui';

interface OrdersGridWrapperProps extends Omit<OrdersGridModel, 'orders'> {
    orderCount: number;
    instrumentType: InstrumentType;
}

// Mock order generator
function generateMockOrders(count: number, instrumentType: InstrumentType): FinancialOrder[] {
    const symbols = instrumentType === 'CRYPTO_PERP' 
        ? ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT']
        : ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    
    return Array.from({ length: count }, (_, i) => ({
        orderId: `ORD-${Date.now()}-${i}`,
        symbol: symbols[i % symbols.length],
        instrumentType,
        side: Math.random() > 0.5 ? 'BUY' : 'SELL',
        type: ['LIMIT', 'STOP', 'STOP_LIMIT'][Math.floor(Math.random() * 3)] as any,
        status: ['NEW', 'OPEN', 'PARTIALLY_FILLED'][Math.floor(Math.random() * 3)] as any,
        quantity: Math.round(Math.random() * 10 * 1000) / 1000,
        executedQty: Math.random() * 5,
        price: Math.round(Math.random() * 50000 * 100) / 100,
        createdAt: Date.now() - Math.random() * 86400000,
    }));
}

export const OrdersGridWrapper: React.FC<OrdersGridWrapperProps> = ({
    orderCount = 15,
    instrumentType = 'CRYPTO_PERP',
    ...props
}) => {
    const orders = React.useMemo(
        () => generateMockOrders(orderCount, instrumentType),
        [orderCount, instrumentType]
    );
    return <OrdersGrid orders={orders} {...props} />;
};
```

#### G.4.2 PositionsGridWrapper

**File**: `src/infrastructure/wrappers/PositionsGridWrapper.tsx`

```typescript
import React from 'react';
import { PositionsGrid, PositionsGridModel, FinancialPosition, InstrumentType } from 'ark-alliance-react-ui';

interface PositionsGridWrapperProps extends Omit<PositionsGridModel, 'positions'> {
    positionCount: number;
    instrumentType: InstrumentType;
}

function generateMockPositions(count: number, instrumentType: InstrumentType): FinancialPosition[] {
    const symbols = instrumentType === 'CRYPTO_PERP'
        ? ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT']
        : ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];
    
    return Array.from({ length: count }, (_, i) => {
        const side = Math.random() > 0.5 ? 'LONG' : 'SHORT';
        const entryPrice = 40000 + Math.random() * 10000;
        const markPrice = entryPrice * (1 + (Math.random() - 0.5) * 0.1);
        const quantity = Math.round(Math.random() * 10 * 1000) / 1000;
        const unrealizedPnl = (markPrice - entryPrice) * quantity * (side === 'LONG' ? 1 : -1);
        
        return {
            symbol: symbols[i % symbols.length],
            instrumentType,
            side,
            positionSide: 'BOTH',
            quantity,
            positionAmt: side === 'LONG' ? quantity : -quantity,
            entryPrice,
            markPrice,
            unrealizedPnl,
            unrealizedPnlPercent: (unrealizedPnl / (entryPrice * quantity)) * 100,
            leverage: [5, 10, 20, 25][Math.floor(Math.random() * 4)],
            marginType: Math.random() > 0.5 ? 'CROSS' : 'ISOLATED',
            liquidationPrice: side === 'LONG' ? entryPrice * 0.7 : entryPrice * 1.3,
        };
    });
}

export const PositionsGridWrapper: React.FC<PositionsGridWrapperProps> = ({
    positionCount = 8,
    instrumentType = 'CRYPTO_PERP',
    ...props
}) => {
    const positions = React.useMemo(
        () => generateMockPositions(positionCount, instrumentType),
        [positionCount, instrumentType]
    );
    return <PositionsGrid positions={positions} {...props} />;
};
```

---

### G.5 Updated Catalogue Configuration

Add these new categories to `catalogue.json`:

```json
{
    "categories": [
        // ... existing categories ...
        
        {
            "name": "Desktop OS",
            "icon": "desktop",
            "description": "Complete desktop operating system simulation.",
            "componentIds": [
                "desktop-page",
                "window-panel",
                "desktop-icon",
                "taskbar",
                "start-menu"
            ]
        },
        {
            "name": "Advanced Panels",
            "icon": "window-maximize",
            "description": "Feature-rich panel and container components.",
            "componentIds": [
                "generic-panel",
                "control-panel"
            ]
        },
        {
            "name": "Finance & Trading",
            "icon": "chart-line",
            "description": "Professional trading grid components.",
            "componentIds": [
                "orders-grid",
                "positions-grid",
                "trade-history-grid",
                "trading-grid-card"
            ]
        }
    ]
}
```

---

### G.6 ComponentResolver Updates

Add to `ComponentResolver.ts`:

```typescript
// Desktop components
import { DesktopPageWrapper } from './wrappers/DesktopPageWrapper';
import { WindowPanel, DesktopIcon, Taskbar, StartMenu } from 'ark-alliance-react-ui';
import { TaskbarWrapper } from './wrappers/TaskbarWrapper';
import { StartMenuWrapper } from './wrappers/StartMenuWrapper';

// Panel components
import { GenericPanel, ControlPanel } from 'ark-alliance-react-ui';

// Trading components
import { OrdersGridWrapper } from './wrappers/OrdersGridWrapper';
import { PositionsGridWrapper } from './wrappers/PositionsGridWrapper';
import { TradeHistoryGridWrapper } from './wrappers/TradeHistoryGridWrapper';
import { TradingGridCard } from 'ark-alliance-react-ui';

// Add to componentMap
const componentMap: Record<string, ComponentType<any>> = {
    // ... existing mappings ...
    
    // Desktop
    'DesktopPage': DesktopPageWrapper,
    'WindowPanel': WindowPanel,
    'DesktopIcon': DesktopIcon,
    'Taskbar': TaskbarWrapper,
    'StartMenu': StartMenuWrapper,
    
    // Panels
    'GenericPanel': GenericPanel,
    'ControlPanel': ControlPanel,
    
    // Trading
    'OrdersGrid': OrdersGridWrapper,
    'PositionsGrid': PositionsGridWrapper,
    'TradeHistoryGrid': TradeHistoryGridWrapper,
    'TradingGridCard': TradingGridCard,
};
```

---

### G.7 Mock Data Requirements Summary

| Component | Mock Data Required | Volume |
|-----------|-------------------|--------|
| DesktopPage | App configs, icon configs, window states | 15-20 apps |
| WindowPanel | Demo content, window state | 1 window |
| Taskbar | Running apps, system tray items | 5-8 apps |
| StartMenu | App categories, pinned apps, recent | 30+ apps |
| OrdersGrid | FinancialOrder objects | 15-50 orders |
| PositionsGrid | FinancialPosition objects | 5-20 positions |
| TradeHistoryGrid | FinancialTrade objects | 30-100 trades |
| GenericPanel | Demo content (text/components) | Static |
| ControlPanel | Section configs, header actions | Static |

---

### G.8 Implementation Checklist Update

Add to Phase 2 (New Panel Configs):

- [ ] Create `desktop-page.json`
- [ ] Create `window-panel.json`
- [ ] Create `desktop-icon.json`
- [ ] Create `taskbar.json`
- [ ] Create `start-menu.json`
- [ ] Create `generic-panel.json`
- [ ] Create `control-panel.json`
- [ ] Create `orders-grid.json`
- [ ] Create `positions-grid.json`
- [ ] Create `trade-history-grid.json`
- [ ] Create `trading-grid-card.json`

Add to Phase 3 (Wrapper Components):

- [ ] Create DesktopPageWrapper.tsx
- [ ] Create TaskbarWrapper.tsx
- [ ] Create StartMenuWrapper.tsx
- [ ] Create OrdersGridWrapper.tsx
- [ ] Create PositionsGridWrapper.tsx
- [ ] Create TradeHistoryGridWrapper.tsx

---

**Appendix G Version**: 1.0  
**Created**: 2026-01-26  
**Author**: AI Software Architect (Antigravity IDE)
