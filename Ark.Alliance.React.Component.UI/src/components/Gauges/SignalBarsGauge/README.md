<p align="center">
  <img src="../../../assets/Icon.png" alt="Ark Alliance Logo" width="120"/>
</p>

<h1 align="center">Ark.Alliance.React.Component.UI</h1>
<h2 align="center">SignalBarsGauge Component</h2>

<p align="center">
  <strong>Signal strength indicator with bar display.</strong>
</p>

---

**Author:** Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5

---

## Overview

The SignalBarsGauge displays signal strength as vertical bars with automatic color-coding based on signal level.

## Features

- 📶 **Signal Bars** - Vertical bar indicators
- 🎨 **Auto-Coloring** - Signal-based colors
- 📐 **3 Sizes** - sm, md, lg
- 🏗️ **Uses Gauge Primitive** - Extends shared Gauge.model ⭐

---

## Usage

```typescript
import { SignalBarsGauge } from '@/components/Gauges';

<SignalBarsGauge
  value={4}
  max={5}
  label="Network Signal"
  autoColor
  size="md"
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
