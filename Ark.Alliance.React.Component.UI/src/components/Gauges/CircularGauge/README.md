<p align="center">
  <img src="../../../assets/Icon.png" alt="Ark Alliance Logo" width="120"/>
</p>

<h1 align="center">Ark.Alliance.React.Component.UI</h1>
<h2 align="center">CircularGauge Component</h2>

<p align="center">
  <strong>Radial progress gauge with arc display.</strong>
</p>

---

**Author:** Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5

---

## Overview

The CircularGauge displays progress as a radial arc with configurable colors and automatic threshold-based styling.

## Features

- ⭕ **Radial Arc** - SVG-based circular progress
- 🎨 **Auto-Coloring** - Threshold-based colors
- 📐 **3 Sizes** - sm (80px), md (120px), lg (160px)
- 🏗️ **Uses Gauge Primitive** - Extends shared Gauge.model ⭐

---

## Usage

```typescript
import { CircularGauge } from '@/components/Gauges';

<CircularGauge
  value={65}
  max={100}
  label="CPU Usage"
  unit="%"
  autoColor
  warningThreshold={70}
  dangerThreshold={90}
  size="lg"
/>
```

---

## Properties

Inherits all properties from [Gauge primitive](../README.md):
- `value`, `min`, `max`
- `label`, `unit`
- `color`, `size` ⚠️ Custom enums
- `autoColor`, `warningThreshold`, `dangerThreshold`

---

<p align="center">
  <strong>M2H.IO © 2022 - 2026 • Ark.Alliance Ecosystem</strong>
</p>
