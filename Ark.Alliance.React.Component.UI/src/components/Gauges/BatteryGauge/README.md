<p align="center">
  <img src="../../../assets/Icon.png" alt="Ark Alliance Logo" width="120"/>
</p>

<h1 align="center">Ark.Alliance.React.Component.UI</h1>
<h2 align="center">BatteryGauge Component</h2>

<p align="center">
  <strong>Battery charge indicator with segmented display.</strong>
</p>

---

**Author:** Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5

---

## Overview

The BatteryGauge displays battery charge level with a segmented visual and automatic color-coding based on charge level.

## Features

- 🔋 **Battery Visual** - Segmented charge indicator
- 🎨 **Auto-Coloring** - Red (low), yellow (medium), green (full)
- 📐 **3 Sizes** - sm, md, lg
- 🏗️ **Uses Gauge Primitive** - Extends shared Gauge.model ⭐

---

## Usage

```typescript
import { BatteryGauge } from '@/components/Gauges';

<BatteryGauge
  value={75}
  label="Battery Level"
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
