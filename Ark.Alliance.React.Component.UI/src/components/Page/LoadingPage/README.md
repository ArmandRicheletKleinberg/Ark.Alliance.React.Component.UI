# LoadingPage

**Professional loading screen with animated logo and smooth progress**

A polished loading page component perfect for application initialization, route transitions, and async data loading.

---

## Features

✅ **Animated Logo** - Pulse and glow effects  
✅ **Smooth Progress** - Eased progress bar animation  
✅ **Message Rotation** - Cycle through multiple messages  
✅ **4 Spinner Types** - dots, ring, pulse, bars  
✅ **Responsive Design** - Mobile-optimized  
✅ **MVVM Architecture** - Clean separation of concerns  
✅ **Customizable** - Logo, colors, messages  

---

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logoUrl` | `string?` | - | Logo image URL |
| `appName` | `string?` | - | Application name |
| `message` | `string \| string[]` | `'Loading...'` | Message(s) to display |
| `progress` | `number?` | - | Progress value (0-100) |
| `showProgress` | `boolean` | `true` | Show progress bar |
| `animated` | `boolean` | `true` | Animate logo |
| `spinnerType` | `'dots' \| 'ring' \| 'pulse' \| 'bars'` | `'ring'` | Spinner style |
| `logoClassName` | `string?` | - | Custom logo CSS class |
| `messageInterval` | `number` | `3000` | Message rotation interval (ms) |
| `progressDuration` | `number` | `500` | Progress animation duration (ms) |
| `className` | `string?` | - | Additional CSS classes |

---

## Usage Examples

### Basic Usage

```tsx
import { LoadingPage } from 'ark-alliance-react-ui';

<LoadingPage
    logoUrl="/logo.png"
    appName="My Application"
    message="Loading resources..."
/>
```

### With Progress

```tsx
const [progress, setProgress] = useState(0);

useEffect(() => {
    // Simulate loading
    const interval = setInterval(() => {
        setProgress((p) => (p >= 100 ? 100 : p + 10));
    }, 500);

    return () => clearInterval(interval);
}, []);

<LoadingPage
    logoUrl="/logo.png"
    appName="My App"
    progress={progress}
    showProgress={true}
/>
```

### Message Rotation

```tsx
<LoadingPage
    logoUrl="/logo.png"
    message={[
        'Loading resources...',
        'Initializing modules...',
        'Connecting to server...',
        'Almost ready...',
    ]}
    messageInterval={2000}
    animated={true}
/>
```

### Spinner Only (No Logo)

```tsx
<LoadingPage
    appName="Processing"
    message="Please wait..."
    spinnerType="dots"
    showProgress={false}
/>
```

### Custom Spinner Types

```tsx
// Dots
<LoadingPage spinnerType="dots" message="Loading..." />

// Ring (default)
<LoadingPage spinnerType="ring" message="Loading..." />

// Pulse
<LoadingPage spinnerType="pulse" message="Processing..." />

// Bars
<LoadingPage spinnerType="bars" message="Initializing..." />
```

---

## Use Cases

### 1. Application Initialization

```tsx
function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const loadApp = async () => {
            setProgress(25);
            await loadConfig();
            
            setProgress(50);
            await authenticateUser();
            
            setProgress(75);
            await loadUserData();
            
            setProgress(100);
            setTimeout(() => setIsLoading(false), 500);
        };

        loadApp();
    }, []);

    if (isLoading) {
        return (
            <LoadingPage
                logoUrl="/assets/logo.png"
                appName="Dashboard"
                progress={progress}
                message={[
                    'Loading configuration...',
                    'Authenticating...',
                    'Loading user data...',
                    'Ready!',
                ]}
            />
        );
    }

    return <Dashboard />;
}
```

### 2. Route Transitions

```tsx
function Router() {
    const location = useLocation();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        setIsNavigating(true);
        const timer = setTimeout(() => setIsNavigating(false), 300);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (isNavigating) {
        return <LoadingPage spinnerType="ring" message="Navigating..." />;
    }

    return <Routes>{/* ... */}</Routes>;
}
```

### 3. Async Data Loading

```tsx
function DataPage() {
    const { data, isLoading } = useQuery('data', fetchData);

    if (isLoading) {
        return (
            <LoadingPage
                logoUrl="/icon.svg"
                message="Fetching data..."
spinner Type="pulse"
            />
        );
    }

    return <DataView data={data} />;
}
```

---

## Animations

### Logo Animation

The `animated` prop enables a smooth pulse and glow effect:
- Scale: 1 → 1.05 → 1
- Glow: Subtle → Bright → Subtle
- Duration: 2s loop

### Progress Bar

- Smooth easing with `easeOutQuad` function
- Shimmer effect overlay
- Configurable duration via `progressDuration` prop

### Spinners

All 4 spinner types have custom animations:
- **Dots**: Bounce animation with staggered timing
- **Ring**: 360° rotation
- **Pulse**: Scale and fade
- **Bars**: Height bounce with stagger

---

## Styling

### Default Theme

- Background: Dark gradient (#0a0f23 → #11172d)
- Primary: Purple gradient (#667eea → #764ba2)
- Glow effects with rgba colors

### Custom Styling

```tsx
<LoadingPage
    logoUrl="/logo.png"
    logoClassName="custom-logo"
    className="custom-loading-page"
/>
```

```css
.custom-loading-page {
    background: linear-gradient(180deg, #1a1a2e, #16213e);
}

.custom-logo {
    filter: drop-shadow(0 0 30px rgba(255, 0, 128, 0.8));
}
```

---

## Architecture

Follows MVVM pattern:

- **Model** ([LoadingPage.model.ts](file:///c:/Users/Criprtoswiss/source/repos/Ark.Alliance.React.Component.UI/Ark.Alliance.React.Component.UI/src/components/Page/LoadingPage/LoadingPage.model.ts)): Zod schema, types
- **ViewModel** ([LoadingPage.viewmodel.ts](file:///c:/Users/Criprtoswiss/source/repos/Ark.Alliance.React.Component.UI/Ark.Alliance.React.Component.UI/src/components/Page/LoadingPage/LoadingPage.viewmodel.ts)): `useLoadingPage` hook, message rotation, progress animation
- **View** ([LoadingPage.tsx](file:///c:/Users/Criprtoswiss/source/repos/Ark.Alliance.React.Component.UI/Ark.Alliance.React.Component.UI/src/components/Page/LoadingPage/LoadingPage.tsx)): React component, spinner types

---

## Performance

- **Memoized**: Component wrapped in `memo()`
- **Optimized**: Uses `requestAnimationFrame` for smooth progress
- **Lightweight**: No heavy dependencies
- **Responsive**: Adapts to viewport size

---

## Accessibility

✅ **Semantic HTML**: Proper heading hierarchy  
✅ **Alt Text**: Logo has descriptive alt attribute  
✅ **Test IDs**: Supports data-testid for testing  

---

## License

MIT

---

**M2H.IO (c) 2025 - Ark.Alliance Eco system - Armand Richelet-Kleinberg**
