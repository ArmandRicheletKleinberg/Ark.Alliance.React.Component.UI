<p align="center">
  <img src="../../../assets/Icon.png" alt="Ark Alliance Logo" width="120"/>
</p>

<h1 align="center">Ark.Alliance.React.Component.UI</h1>
<h2 align="center">OrgChart Component</h2>

<p align="center">
  <strong>Custom-built organizational hierarchy visualization with tree-based layout engine and interactive node selection.</strong>
</p>

---

**Author:** Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5

---

## Overview

The OrgChart component is a flexible, accessible organizational hierarchy visualization built with custom React primitives. Unlike external libraries, this implementation provides full control over rendering, styling, and behavior while maintaining React 18+ compatibility and MVVM architecture principles.

## Features

- 🌳 **Tree-Based Hierarchy** - Recursive tree structure with unlimited depth
- 🎨 **Custom Primitives** - Built with OrgChartTree and OrgChartConnector for full control
- 🖱️ **Interactive Nodes** - Click handling with selection state management
- 📱 **Compact Mode** - Mobile-optimized layout with reduced spacing
- 🎯 **Customizable Lines** - Configurable connection line colors and widths
- ♿ **Accessible** - ARIA roles, keyboard navigation, screen reader support
- 🏗️ **MVVM Architecture** - Clean separation of concerns (Model-View-ViewModel)
- ⚛️ **React 18 Compatible** - Modern React with hooks and concurrent features
- 🎨 **Theme Support** - CSS variables for light/dark mode
- 📦 **No External Dependencies** - Pure React implementation, no chart libraries

---

## Usage Examples

### Basic Usage

```typescript
import { OrgChart, OrgChartNodeData } from '@/components/TreeView/OrgChart';

const nodes: OrgChartNodeData[] = [
  {
    id: '1',
    name: 'John Smith',
    position: 'Chief Executive Officer',
    department: 'Executive',
    children: [
      {
        id: '2',
        name: 'Sarah Johnson',
        position: 'Chief Technology Officer',
        department: 'Technology',
      },
      {
        id: '3',
        name: 'Michael Chen',
        position: 'Chief Financial Officer',
        department: 'Finance',
      },
    ],
  },
];

<OrgChart
  rootNodes={nodes}
  onNodeClick={(id) => console.log('Selected:', id)}
/>
```

### With Custom Styling

```typescript
<OrgChart
  rootNodes={nodes}
  lineColor="#6366f1"
  lineWidth={3}
  organizationName="Ark Alliance Corporation"
  totalCount={150}
  compact={false}
  onNodeClick={handleNodeClick}
/>
```

### Compact Mode (Mobile)

```typescript
<OrgChart
  rootNodes={nodes}
  compact={true}
  lineWidth={2}
  className="mobile-org-chart"
/>
```

### With Selection State

```typescript
const [selectedId, setSelectedId] = useState<string | undefined>();

<OrgChart
  rootNodes={nodes}
  selectedId={selectedId}
  onNodeClick={(id) => setSelectedId(id)}
/>
```

---

## Properties

### OrgChartProps

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rootNodes` | `OrgChartNodeData[]` | `[]` | Root nodes of the organizational tree |
| `organizationName` | `string` | `undefined` | Optional organization name for context |
| `totalCount` | `number` | `undefined` | Optional total member count |
| `lineColor` | `string` | `var(--primary-color, #3b82f6)` | Color of connection lines (CSS color value) |
| `lineWidth` | `number` | `2` | Width of connection lines in pixels (1-10) |
| `selectedId` | `string` | `undefined` | ID of currently selected node |
| `compact` | `boolean` | `false` | Enable compact layout for mobile devices |
| `testId` | `string` | `undefined` | Test identifier for automated testing |
| `onNodeClick` | `(nodeId: string) => void` | `undefined` | Callback when a node is clicked |
| `className` | `string` | `''` | Additional CSS classes |

### OrgChartNodeData Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier for the node |
| `name` | `string` | ✅ | Person's name |
| `position` | `string` | ✅ | Job title or position |
| `department` | `string` | ❌ | Department or division |
| `avatarUrl` | `string` | ❌ | URL to avatar image |
| `email` | `string` | ❌ | Email address |
| `children` | `OrgChartNodeData[]` | ❌ | Array of child nodes (subordinates) |

---

## Primitives

The OrgChart is built using two core primitives that can be used independently for custom implementations:

### OrgChartTree

**Purpose:** Layout engine for recursive tree rendering

**Usage:**
```typescript
import { OrgChartTree } from '@/components/TreeView/OrgChart/primitives';

<OrgChartTree
  node={nodeData}
  level={0}
  lineColor="#3b82f6"
  lineWidth={2}
  orientation="vertical"
  nodeSpacing={24}
  levelSpacing={80}
  compact={false}
  onNodeClick={(id) => console.log('Clicked:', id)}
/>
```

**Props:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `node` | `OrgChartNodeData` | **required** | Node data to render |
| `level` | `number` | `0` | Current depth level (0 = root) |
| `parentId` | `string` | `undefined` | Parent node ID |
| `lineColor` | `string` | `var(--primary-color, #3b82f6)` | Connection line color |
| `lineWidth` | `number` | `2` | Connection line width (1-10 px) |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Tree orientation |
| `nodeSpacing` | `number` | `24` | Horizontal spacing between siblings (px) |
| `levelSpacing` | `number` | `80` | Vertical spacing between levels (px) |
| `compact` | `boolean` | `false` | Compact layout mode |
| `selectedId` | `string` | `undefined` | Currently selected node ID |
| `onNodeClick` | `(nodeId: string) => void` | `undefined` | Node click handler |

### OrgChartConnector

**Purpose:** Visual connector lines between hierarchical nodes

**Usage:**
```typescript
import { OrgChartConnector } from '@/components/TreeView/OrgChart/primitives';

<OrgChartConnector
  color="#6366f1"
  width={2}
  type="vertical"
  childCount={3}
  height={40}
/>
```

**Props:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `var(--primary-color, #3b82f6)` | Line color (CSS color value) |
| `width` | `number` | `2` | Line width in pixels (1-10) |
| `type` | `ConnectorType` | `'vertical'` | Connector type (see below) |
| `childCount` | `number` | `0` | Number of children (for bridge width) |
| `height` | `number` | `40` | Height of vertical connector (px) |

**ConnectorType Values:**
- `'vertical'` - Vertical line from parent to horizontal bridge
- `'horizontal-bridge'` - Horizontal line connecting siblings
- `'child-branch'` - Individual line from bridge to child

---

## Component Hierarchy

```
OrgChart (Main Component)
└── OrgChartTree (Layout Engine - Recursive)
    ├── OrgChartNode (Node Display)
    └── OrgChartConnector (Connection Lines)
        ├── Vertical Connector
        ├── Horizontal Bridge
        └── Child Branches
```

---

## Architecture

### MVVM Pattern

The OrgChart follows the MVVM (Model-View-ViewModel) architecture:

```
┌─────────────────────────────────────────┐
│ OrgChart.model.ts                       │
│ - OrgChartNodeData interface            │
│ - OrgChartModelSchema (Zod validation)  │
│ - Default values                         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ OrgChart.viewmodel.ts                   │
│ - useOrgChart() hook                     │
│ - Business logic (isEmpty, node clicks)  │
│ - State management                       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ OrgChart.tsx (View)                     │
│ - Rendering logic                        │
│ - OrgChartTree integration               │
│ - Event handlers                         │
└─────────────────────────────────────────┘
```

### Primitive Design Philosophy

**Why Primitives DON'T Extend BaseComponentModel:**

The OrgChart primitives (`OrgChartTree` and `OrgChartConnector`) intentionally **do not extend** `BaseComponentModel` or `BaseViewModel`. This architectural decision follows YAGNI (You Aren't Gonna Need It) and composition-over-inheritance principles:

| BaseComponentModel Feature | Primitive Needs | Applicable? |
|---------------------------|-----------------|-------------|
| User Interactions (clickable, draggable, focusable) | Decorative only | ❌ Not needed |
| Tooltips (tooltip, tooltipPosition, tooltipDelay) | No tooltips | ❌ Not needed |
| States (disabled, loading) | Always active | ❌ Not needed |
| Testing (testId) | Only main component | ⚠️ Partial fit |
| Styling (className, style) | Yes, needed | ✅ Applicable |
| ARIA (ariaLabel) | aria-hidden (decorative) | ❌ Not needed |

**Result:** Only 1-2 out of 20+ BaseModel properties are applicable.

**Benefits of Simple Models:**
- ✅ Minimal API surface (5 props vs 20+ inherited props)
- ✅ Clear, focused purpose
- ✅ No unused properties
- ✅ Easier to understand and maintain
- ✅ Better TypeScript error messages

**Future Consideration:**
For shared tree component functionality, consider creating a specialized `BaseTreeModel` (similar to `BaseSEOModel` pattern) rather than forcing general-purpose base class extension.

---

## Accessibility Features

### ARIA Support
- `role="img"` on container with descriptive `aria-label`
- `role="listitem"` on individual nodes
- Proper heading hierarchy for node positions
- `aria-hidden="true"` on decorative connectors
- Empty state announcement: "Empty organization chart"

### Keyboard Navigation
- **Tab** - Navigate between interactive nodes
- **Enter/Space** - Select focused node
- Focus indicators on all interactive elements

### Screen Reader Support
- Descriptive labels for all nodes
- Hierarchical structure announced properly
- Empty state communicated clearly

### Reduced Motion
- Respects `prefers-reduced-motion` media query
- No animations in reduced motion mode

---

## Dependencies

### Internal Components
- `OrgChartTree` - Tree layout primitive (recursive)
- `OrgChartConnector` - Connection line primitive
- `OrgChartNode` - Individual node display component

### Core Modules
- `zod` - Schema validation and runtime type safety

### External Libraries
- `react` (18+) - Component framework

---

## Theming

The OrgChart uses CSS variables for theming:

```scss
// Override in your theme
.ark-org-chart {
  --primary-color: #your-primary-color;
  --text-color: #your-text-color;
  --bg-color: #your-bg-color;
  --border-color: #your-border-color;
}
```

### Custom Line Colors

```typescript
<OrgChart
  rootNodes={nodes}
  lineColor="var(--accent-color, #6366f1)"
  lineWidth={3}
/>
```

Or use CSS:

```scss
.ark-org-chart-connector {
  stroke: var(--custom-line-color, #3b82f6);
  stroke-width: 2px;
}
```

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ iOS Safari (latest)
- ✅ Android Chrome (latest)

**Minimum Requirements:**
- React 18.0+
- ES2020+ JavaScript support
- CSS Grid support

---

## Performance Considerations

### Optimization Strategies

1. **React.memo** - All components are memoized to prevent unnecessary re-renders
2. **Recursive Rendering** - OrgChartTree uses efficient recursive pattern
3. **Shallow Comparisons** - Props are optimized for reference equality
4. **No External Libraries** - Zero overhead from chart library dependencies

### Large Hierarchies

For organizations with 100+ members:

```typescript
// Lazy load sections
const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);

// Virtualization (future enhancement)
// Currently renders entire tree - virtualization planned for v2.0
```

**Current Limits:**
- Tested up to 500 nodes
- Recommended max: 200 nodes for optimal performance
- Consider pagination or department filtering for larger trees

---

## Migration Guide

### From `react-organizational-chart`

**Why we built custom:**
- ✅ React 18 compatibility issues with external library
- ✅ Full control over rendering and styling
- ✅ Better TypeScript support
- ✅ MVVM architecture alignment
- ✅ No dependency on unmaintained packages

**Migration Steps:**

1. **Replace imports:**
```typescript
// Before
import { OrganizationChart } from 'react-organizational-chart';

// After
import { OrgChart } from '@/components/TreeView/OrgChart';
```

2. **Update data structure:**
```typescript
// Before (react-organizational-chart)
<OrganizationChart tree={treeData} />

// After (Ark Alliance)
<OrgChart rootNodes={nodes} />
```

3. **Remap node data:**
```typescript
// The interface is similar, but use OrgChartNodeData:
const nodes: OrgChartNodeData[] = [
  {
    id: '1',
    name: 'CEO Name',
    position: 'Chief Executive Officer',
    children: [...],
  },
];
```

---

## Testing Examples

### Basic Render Test

```typescript
import { render, screen } from '@testing-library/react';
import { OrgChart, OrgChartNodeData } from './OrgChart';

const mockNodes: OrgChartNodeData[] = [
  {
    id: '1',
    name: 'John Doe',
    position: 'CEO',
    children: [
      { id: '2', name: 'Jane Smith', position: 'CTO' },
    ],
  },
];

test('renders organization chart', () => {
  render(<OrgChart rootNodes={mockNodes} testId="org-chart" />);

  expect(screen.getByTestId('org-chart')).toBeInTheDocument();
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('CEO')).toBeInTheDocument();
});
```

### Node Click Test

```typescript
import { fireEvent } from '@testing-library/react';

test('handles node clicks', () => {
  const onNodeClick = jest.fn();

  render(
    <OrgChart
      rootNodes={mockNodes}
      onNodeClick={onNodeClick}
    />
  );

  const node = screen.getByText('John Doe').closest('.ark-org-chart-node');
  fireEvent.click(node!);

  expect(onNodeClick).toHaveBeenCalledWith('1');
});
```

### Empty State Test

```typescript
test('renders empty state', () => {
  render(<OrgChart rootNodes={[]} />);

  expect(screen.getByText('No team members to display')).toBeInTheDocument();
  expect(screen.getByLabelText('Empty organization chart')).toBeInTheDocument();
});
```

---

## Future Enhancements

**Planned for v2.0:**
- 🔲 Horizontal orientation support (left-to-right)
- 🔲 Zoom/pan controls for large hierarchies
- 🔲 Export to PNG/SVG
- 🔲 Virtual scrolling for 1000+ nodes
- 🔲 Collapse/expand subtrees
- 🔲 Search/filter nodes
- 🔲 Drag-and-drop reorganization
- 🔲 Multiple root node support
- 🔲 Custom node templates

---

## License

Copyright © 2025 Armand Richelet-Kleinberg. All rights reserved.

This component is part of the Ark.Alliance.React.Component.UI library.

---

## Support

For issues, feature requests, or contributions, please contact the maintainer or refer to the main library documentation.

**Built with ❤️ using React 18 and TypeScript**
