<p align="center">
  <img src="../../../assets/Icon.png" alt="Ark Alliance Logo" width="120"/>
</p>

<h1 align="center">Ark.Alliance.React.Component.UI</h1>
<h2 align="center">Carousel Component</h2>

<p align="center">
  <strong>Enhanced premium carousel with touch gestures, keyboard navigation, playback controls, and accessibility features.</strong>
</p>

---

**Author:** Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5

---


## Overview

The Carousel component is a flexible, accessible slideshow that supports both data-driven slides and children-based content. It includes autoplay, touch/swipe gestures, keyboard navigation, progress indicators, and comprehensive accessibility features.

## Features

- ✨ **Data-Driven Slides** - Rich slide objects with background images, CTAs, titles
- ✨ **Children Support** - Legacy mode for any React children
- 🎯 **Touch Gestures** - Swipe left/right to navigate
- ⌨️ **Keyboard Navigation** - Arrow keys, Space, Escape, Home/End
- ▶️ **Playback Controls** - Play/pause button with autoplay
- 📊 **Progress Bar** - Visual progress during autoplay
- 🦴 **Loading Skeleton** - Polished loading state
- ♿ **ARIA Compliant** - Live announcements, proper roles
- 🎨 **Theme Support** - Dark/light mode with CSS variables
- 📱 **Responsive** - Mobile-optimized with size variants

---

## Usage Examples

### Basic Usage (Children-Based)

```typescript
import { Carousel } from '@/components/Slides/Carousel';

<Carousel autoplay interval={5000}>
  <div>Slide 1 Content</div>
  <div>Slide 2 Content</div>
  <div>Slide 3 Content</div>
</Carousel>
```

### Data-Driven Mode (Recommended)

```typescript
import { Carousel, CarouselSlide } from '@/components/Slides/Carousel';

const slides: CarouselSlide[] = [
  {
    id: 'slide-1',
    title: 'Welcome to Our Platform',
    subtitle: 'Getting Started',
    description: 'Discover amazing features that will transform your workflow.',
    imageUrl: '/images/hero-1.jpg',
    ctaLink: '/get-started',
    ctaLabel: 'Get Started',
  },
  {
    id: 'slide-2',
    title: 'Advanced Analytics',
    subtitle: 'Insights',
    description: 'Gain deep insights into your data with powerful analytics.',
    imageUrl: '/images/hero-2.jpg',
    ctaLink: '/features/analytics',
    ctaLabel: 'Learn More',
  },
];

<Carousel 
  slides={slides}
  autoplay
  interval={6000}
  showProgress
  showPlayback
  enableGestures
  enableKeyboard
/>
```

### Custom Configuration

```typescript
<Carousel
  slides={slides}
  autoplay={false}
  loop
  showControls
  showIndicators
  showProgress={false}
  showPlayback={false}
  pauseOnInteraction
  enableGestures
  enableKeyboard
  swipeThreshold={75}
  effect="fade"
  size="lg"
  isDark
  className="custom-carousel"
  onChange={(index) => console.log('Slide changed:', index)}
/>
```

---

## Properties

### CarouselProps

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `slides` | `CarouselSlide[]` | `undefined` | Data-driven slides (recommended mode) |
| `children` | `ReactNode` | `undefined` | React children (legacy mode) |
| `autoplay` | `boolean` | `false` | Enable automatic slide progression |
| `interval` | `number` | `5000` | Autoplay interval in milliseconds |
| `loop` | `boolean` | `true` | Enable infinite looping |
| `showControls` | `boolean` | `true` | Show prev/next arrow buttons |
| `showIndicators` | `boolean` | `true` | Show bottom dot indicators |
| `showProgress` | `boolean` | `true` | Show progress bar during autoplay |
| `showPlayback` | `boolean` | `true` | Show play/pause button |
| `pauseOnHover` | `boolean` | `true` | Pause autoplay on hover |
| `pauseOnInteraction` | `boolean` | `true` | Pause on hover, focus, or touch |
| `enableGestures` | `boolean` | `true` | Enable touch swipe gestures |
| `enableKeyboard` | `boolean` | `true` | Enable keyboard navigation |
| `swipeThreshold` | `number` | `50` | Minimum swipe distance in pixels |
| `effect` | `'slide' \| 'fade'` | `'slide'` | Transition animation effect |
| `isLoading` | `boolean` | `false` | Show loading skeleton |
| `size` | `ComponentSize` | `'md'` | Component size variant |
| `isDark` | `boolean` | `true` | Dark mode styling |
| `className` | `string` | `''` | Additional CSS classes |
| `testId` | `string` | `undefined` | Test identifier |
| `onChange` | `(index: number) => void` | `undefined` | Callback when slide changes |

### CarouselSlide Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier |
| `title` | `string` | ✅ | Main slide title |
| `subtitle` | `string` | ❌ | Optional category/subtitle |
| `description` | `string` | ❌ | Slide description text |
| `imageUrl` | `string` | ❌ | Background image URL |
| `ctaLink` | `string` | ❌ | Call-to-action link |
| `ctaLabel` | `string` | ❌ | CTA button label |
| `ariaLabel` | `string` | ❌ | Custom ARIA label override |

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| `→` Arrow Right | Next slide |
| `←` Arrow Left | Previous slide |
| `Space` | Toggle play/pause |
| `Escape` | Pause autoplay |
| `Home` | Go to first slide |
| `End` | Go to last slide |

---

## Touch Gestures

- **Swipe Left** → Next slide
- **Swipe Right** → Previous slide
- **Tap & Hold** → Pause autoplay (if `pauseOnInteraction` enabled)

---

## Accessibility Features

### ARIA Support
- `role="region"` with `aria-label="Content carousel"`
- `role="group"` for each slide with descriptive labels
- `aria-roledescription="slide"` for slides
- `aria-roledescription="carousel"` for container
- `aria-selected` on indicator buttons
- `aria-hidden` on inactive slides
- `aria-live="polite"` announcements for slide changes

### Focus Management
- Keyboard-focusable container (`tabIndex={0}`)
- Focus-visible outline indicator
- Focus/blur events pause autoplay

### Reduced Motion
- Respects `prefers-reduced-motion` media query
- Disables all animations and transitions
- Maintains functionality without motion

### High Contrast Mode
- Increased border widths for controls
- Enhanced visual separation

---

## Size Variants

| Size | Min Height | Title Font Size | Use Case |
|------|------------|-----------------|----------|
| `sm` | 250px | 1.25rem - 2rem | Compact carousels, sidebars |
| `md` | 300px | 1.75rem - 3rem | Standard content areas |
| `lg` | 500px | 2.5rem - 4rem | Hero sections, feature showcases |
| `xl` | 600px | 3rem - 5rem | Full-screen presentations |

---

## Dependencies

### Internal Components
- `Icon` - For control icons (chevrons, play/pause)

### Core Modules
- `core/base` - `useBaseViewModel`, `extendSchema`
- `core/enums` - `ComponentSizeSchema`
- `core/styles` - SCSS mixins, tokens, variables

### External Libraries
- `zod` - Schema validation
- `react` - Component framework

---

## Theming

The Carousel uses CSS variables for theming:

```scss
// Override in your theme
.ark-carousel {
  --ark-bg-card: #your-bg-color;
  --ark-accent-400: #your-accent;
  --ark-accent-500: #your-primary;
  --ark-accent-600: #your-hover;
  --ark-text-primary: #your-text;
  --ark-text-secondary: #your-secondary-text;
}
```

### Light Mode
Automatically adapts when `isDark={false}` or `[data-theme="light"]` is set.

---

##Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

Touch gestures require modern touch event support.

---

## Performance Considerations

1. **Image Loading**: First slide uses `loading="eager"`, others use `loading="lazy"`
2. **Transitions**: Uses `will-change: transform` for GPU acceleration
3. **Reduced Motion**: Automatically disables animations when preferred
4. **Touch Optimization**: `touch-action: pan-y` prevents conflicts

---

## Migration from Old Carousel

### Breaking Changes
None - fully backward compatible with children-based mode.

### Recommended Migration
1. Keep existing `children` implementation working
2. Gradually migrate to `slides` prop for enhanced features
3. Enable new features (`showProgress`, `showPlayback`, `enableGestures`)

### Example Migration

**Before:**
```typescript
<Carousel autoplay>
  {items.map(item => <SlideCard key={item.id} {...item} />)}
</Carousel>
```

**After:**
```typescript
const slides = items.map(item => ({
  id: item.id,
  title: item.title,
  description: item.description,
  imageUrl: item.image,
  ctaLink: item.link,
  ctaLabel: 'Learn More',
}));

<Carousel slides={slides} autoplay showProgress showPlayback />
```

---

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Carousel } from './Carousel';

test('navigates to next slide on arrow click', () => {
  const slides = [
    { id: '1', title: 'Slide 1' },
    { id: '2', title: 'Slide 2' },
  ];

  render(<Carousel slides={slides} />);
  
  fireEvent.click(screen.getByLabelText('Next slide'));
  expect(screen.getByText('Slide 2')).toBeVisible();
});

test('pauses on keyboard space press', () => {
  const slides = [{ id: '1', title: 'Slide 1' }];
  
  render(<Carousel slides={slides} autoplay />);
  
  fireEvent.keyDown(screen.getByRole('region'), { key: ' ' });
  expect(screen.getByLabelText('Play slideshow')).toBeInTheDocument();
});
```

---

## Copyright & License

<p align="center">
  <strong>M2H.IO © 2022 - 2026 • Ark.Alliance Ecosystem</strong><br/>
  <sub>Armand Richelet-Kleinberg</sub>
</p>

<p align="center">
  Part of the <strong>Ark.Alliance.React.Component.UI</strong> library<br/>
  Enterprise-grade React components for the Ark Alliance Ecosystem
</p>
