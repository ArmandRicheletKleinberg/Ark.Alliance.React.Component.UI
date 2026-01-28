# SideBarMenu

**Enhanced collapsible sidebar menu with mobile overlay and badge support**

A professional sidebar navigation component with responsive mobile behavior, category grouping, and modern UI variants.

---

## Features

✅ **Collapsible Behavior** - Smooth expand/collapse animation  
✅ **Mobile Overlay** - Full-screen overlay on mobile devices  
✅ **Icon-Only Mode** - Collapsed state shows icons with tooltips  
✅ **Badge Support** - Display notification counts on menu items  
✅ **Category Grouping** - Organize items into expandable categories  
✅ **Multiple Variants** - default, neon, glass, minimal  
✅ **Dark/Light Themes** - Automatic theme support  
✅ **Responsive** - Mobile-first design (<768px breakpoint)  
✅ **Keyboard Accessible** - Full ARIA support  

---

## API Reference

### `SideBarMenuProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `categories` | `MenuCategory[]` | **Required** | Menu categories and items |
| `title` | `string?` | - | Sidebar title/logo text |
| `variant` | `ComponentVariant` | `'default'` | Visual variant |
| `position` | `'left' \| 'right'` | `'left'` | Sidebar position |
| `collapsed` | `boolean` | `false` | Initial collapsed state |
| `expandedWidth` | `number` | `280` | Width when expanded (px) |
| `collapsedWidth` | `number` | `60` | Width when collapsed (px) |
| `showHamburger` | `boolean` | `true` | Show hamburger toggle button |
| `collapsible` | `boolean` | `true` | Enable collapse functionality |
| `mobileOverlay` | `boolean` | `true` | Use overlay mode on mobile |
| `showBadges` | `boolean` | `true` | Display badges on items |
| `isDark` | `boolean` | `true` | Dark theme mode |
| `activeKey` | `string?` | - | Currently active item key |
| `onSelect` | `(key: string, item: MenuItem) => void` | - | Item selection handler |
| `onCollapseChange` | `(collapsed: boolean) => void` | - | Collapse state change handler |
| `className` | `string?` | - | Additional CSS classes |

### `MenuCategory` Type

```typescript
interface MenuCategory {
    name: string;        // Category name
    icon: string;        // Category icon (emoji or FontAwesome)
    items: MenuItem[];   // Menu items in this category
}
```

### `MenuItem` Type

```typescript
interface MenuItem {
    key: string;              // Unique identifier
    label: string;            // Display label
    icon?: string;            // Item icon (emoji or FontAwesome)
    children?: MenuItem[];    // Nested items (not yet implemented)
    disabled?: boolean;       // Disabled state
    badge?: number | string;  // Badge count or text
}
```

---

## Usage Examples

### Basic Sidebar

```tsx
import { SideBarMenu } from 'ark-alliance-react-ui';

const categories = [
    {
        name: 'Components',
        icon: '🧩',
        items: [
            { key: 'button', label: 'Button', icon: '🔘' },
            { key: 'input', label: 'Input', icon: '✏️' },
            { key: 'panel', label: 'Panel', icon: '📋' },
        ],
    },
    {
        name: 'Charts',
        icon: '📊',
        items: [
            { key: 'line', label: 'Line Chart', icon: '📈' },
            { key: 'pie', label: 'Pie Chart', icon: '🥧' },
        ],
    },
];

function App() {
    const [activeKey, setActiveKey] = useState('button');

    return (
        <SideBarMenu
            categories={categories}
            activeKey={activeKey}
            onSelect={(key) => setActiveKey(key)}
            title="My App"
        />
    );
}
```

### With Badges

```tsx
const categoriesWithBadges = [
    {
        name: 'Notifications',
        icon: '🔔',
        items: [
            { key: 'inbox', label: 'Inbox', icon: '📥', badge: 12 },
            { key: 'alerts', label: 'Alerts', icon: '⚠️', badge: 3 },
            { key: 'updates', label: 'Updates', icon: '🔄', badge: 'NEW' },
        ],
    },
];

<SideBarMenu
    categories={categoriesWithBadges}
    onSelect={handleSelect}
    variant="neon"
    showBadges={true}
/>
```

### Mobile-Optimized

```tsx
<SideBarMenu
    categories={categories}
    mobileOverlay={true}      // Semi-transparent backdrop on mobile
    collapsible={true}        // Allow expand/collapse
    collapsed={isMobile}      // Start collapsed on mobile
    onSelect={(key) => {
        setActiveKey(key);
        // Sidebar auto-collapses on mobile after selection
    }}
/>
```

### Custom Styling

```tsx
<SideBarMenu
    categories={categories}
    variant="glass"           // Glassmorphism effect
    isDark={true}             // Dark theme
    expandedWidth={320}       // Wider sidebar
    collapsedWidth={70}       // Wider icon-only mode
    position="right"          // Right-side sidebar
/>
```

---

## Collapsible Behavior

The sidebar can be collapsed to icon-only mode:

- **Desktop**: Click hamburger button to toggle
- **Mobile**: Overlay mode - sidebar slides in/out
- **Icon-Only**: Shows icon + tooltip on hover
- **Auto-Collapse**: On mobile, automatically collapses after item selection

```tsx
const [collapsed, setCollapsed] = useState(false);

<SideBarMenu
    categories={categories}
    collapsed={collapsed}
    onCollapseChange={setCollapsed}
    collapsible={true}
/>
```

---

## Mobile Overlay Mode

On mobile devices (<768px), the sidebar can use overlay mode:

1. **Collapsed**: Sidebar is hidden off-screen
2. **Expanded**: Sidebar slides in with semi-transparent backdrop
3. **Click Item**: Sidebar auto-collapses
4. **Click Backdrop**: Sidebar collapses

```tsx
<SideBarMenu
    categories={categories}
    mobileOverlay={true}
    onSelect={(key) => {
        navigate(key);
        // Automatically closes on mobile
    }}
/>
```

---

## Variants

### Default
Classic sidebar with gradient background and subtle glow.

### Neon
Vibrant neon accents with glowing effects.

### Glass
Glassmorphism with backdrop blur.

### Minimal
Transparent background, borderless.

```tsx
<SideBarMenu categories={categories} variant="neon" />
```

---

## Badge Support

Badges can display:
- **Numbers**: Notification counts
- **Text**: "NEW", "BETA", custom labels

```typescript
const items = [
    { key: 'messages', label: 'Messages', badge: 42 },
    { key: 'features', label: 'Features', badge: 'BETA' },
];
```

Badges can be globally disabled:

```tsx
<SideBarMenu categories={categories} showBadges={false} />
```

---

## Accessibility

✅ **ARIA Labels**: Hamburger button has `aria-label` and `aria-expanded`  
✅ **Keyboard Navigation**: Tab through items, Enter to select  
✅ **Tooltips**: Icon-only mode shows tooltips on hover  
✅ **Screen Readers**: Proper semantic HTML structure  
✅ **Focus Indicators**: Visible focus states  

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Tab** | Navigate between items |
| **Enter** | Select item / Toggle category |
| **Space** | Toggle hamburger button |

---

## Responsive Behavior

### Desktop (≥768px)
- Fixed position sidebar
- Smooth width transitions
- No overlay backdrop

### Mobile (<768px)
- Off-canvas sidebar
- Full-screen overlay when expanded
- Auto-collapse on item selection
- Touch-friendly tap targets

---

## Events

The component emits events via the base ViewModel:

```typescript
// Emitted events:
'collapse:toggle'  // { collapsed: boolean }
'item:select'      // { key: string, item: MenuItem }
```

Listen to events:

```tsx
const vm = useSideBarMenu(options);

useEffect(() => {
    const unsubscribe = vm.on('item:select', (data) => {
        console.log('Selected:', data.key);
    });

    return unsubscribe;
}, [vm]);
```

---

## Architecture

Follows MVVM pattern:

- **Model** ([SideBarMenu.model.ts](file:///c:/Users/Criprtoswiss/source/repos/Ark.Alliance.React.Component.UI/Ark.Alliance.React.Component.UI/src/components/SideBar/SideBarMenu/SideBarMenu.model.ts)): Zod schemas, types
- **ViewModel** ([SideBarMenu.viewmodel.ts](file:///c:/Users/Criprtoswiss/source/repos/Ark.Alliance.React.Component.UI/Ark.Alliance.React.Component.UI/src/components/SideBar/SideBarMenu/SideBarMenu.viewmodel.ts)): `useSideBarMenu` hook, state management
- **View** ([SideBarMenu.tsx](file:///c:/Users/Criprtoswiss/source/repos/Ark.Alliance.React.Component.UI/Ark.Alliance.React.Component.UI/src/components/SideBar/SideBarMenu/SideBarMenu.tsx)): React component, UI rendering

---

## License

MIT

---

**M2H.IO (c) 2025 - Ark.Alliance Eco system - Armand Richelet-Kleinberg**
