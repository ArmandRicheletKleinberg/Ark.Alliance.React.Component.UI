# Ark.Alliance.React.Component.Ui.ShowCases

**Interactive Component Showcase for Ark.Alliance.React.Component.UI**

A dedicated showcase application demonstrating the full capabilities of the `ark-alliance-react-ui` component library. Built with Clean Architecture principles and React.

[![React](https://img.shields.io/badge/React-19.0-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF)](https://vitejs.dev/)

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Features](#features)
6. [Adding Components](#adding-components)
7. [Theme System](#theme-system)
8. [Author](#author)

---

## Overview

This showcase application provides:

- **Live Component Preview**: Interactive demonstration of all library components
- **Property Controls**: Real-time prop manipulation
- **Code Generation**: Export usage code in TypeScript, JavaScript, Go, Blazor
- **Theme Switching**: Normal, Neon, Minimal, and Glass visual modes
- **Responsive Design**: Desktop and mobile viewport simulation

---

## Architecture

The showcase follows **Clean Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  - Pages (HomePage, CataloguePage)                          │
│  - Components (Header, Sidebar, ComponentPanel)             │
│  - Context (ThemeContext)                                   │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                       │
│  - ConfigLoader (JSON configuration loading)                │
│  - ComponentResolver (Dynamic component resolution)         │
│  - Wrappers (Component adapters with demo data)            │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                            │
│  - Entities (Configuration interfaces)                      │
│  - ControlDefinition, ComponentPanelConfig                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
Ark.Alliance.React.Component.Ui.ShowCases/
├── src/
│   ├── App.tsx                     # Root component with routing
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Global styles + theme presets
│   │
│   ├── domain/                     # Domain Layer
│   │   └── entities.ts             # Configuration types
│   │
│   ├── infrastructure/             # Infrastructure Layer
│   │   ├── ConfigLoader.ts         # JSON config loading
│   │   ├── ComponentResolver.ts    # Component registration
│   │   ├── data/
│   │   │   ├── catalogue.json      # Category definitions
│   │   │   └── panels/             # Component showcase configs
│   │   └── wrappers/               # Component wrappers with demo data
│   │
│   ├── presentation/               # Presentation Layer
│   │   ├── components/
│   │   │   ├── Catalogue/          # ComponentPanel, PropControl
│   │   │   └── Layout/             # Header, Sidebar
│   │   ├── context/
│   │   │   └── ThemeContext.tsx    # Theme state management
│   │   ├── layouts/
│   │   │   └── AppLayout.tsx       # Main layout
│   │   └── pages/
│   │       ├── HomePage.tsx        # Landing page
│   │       └── CataloguePage.tsx   # Category browser
│   │
│   └── Helpers/                    # Utility functions
│
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Navigate to showcase directory
cd Ark.Alliance.React.Component.Ui.ShowCases

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

---

## Features

### Component Categories

| Category | Components |
|----------|------------|
| **Inputs** | NeonInput, NumericInput, Select, Slider, TextArea, FileUpload, TextEditor |
| **Buttons** | Button, NeonButton |
| **Gauges** | CircularGauge, SpeedometerGauge, DigitalGauge, BatteryGauge, SignalBarsGauge |
| **Charts** | FinancialChart, TrendPriceChart |
| **Grids** | DataGrid, ProjectGrid |
| **Containers** | Panel |
| **Feedback** | StatusBadge |

### Property Controls

Each component showcase includes interactive controls for:
- Text inputs
- Number inputs (with sliders)
- Boolean toggles
- Select dropdowns
- Color pickers

### Code Export

Generate usage code in multiple languages:
- TypeScript/TSX
- JavaScript/JSX
- Go (planned)
- Blazor (planned)

---

## Adding Components

### 1. Create Component Wrapper (if needed)

```typescript
// src/infrastructure/wrappers/MyComponentWrapper.tsx
import React from 'react';
import { MyComponent } from 'ark-alliance-react-ui';

export const MyComponentWrapper: React.FC<Props> = (props) => {
  return <MyComponent {...props} />;
};
```

### 2. Register in ComponentResolver

```typescript
// src/infrastructure/ComponentResolver.ts
import { MyComponentWrapper } from './wrappers/MyComponentWrapper';

const componentMap = {
  // ...existing
  'MyComponent': MyComponentWrapper,
};
```

### 3. Create Panel Configuration

```json
// src/infrastructure/data/panels/my-component.json
{
  "id": "my-component",
  "componentId": "MyComponent",
  "title": "My Component",
  "description": "Description here",
  "defaultProps": { ... },
  "controls": [ ... ]
}
```

### 4. Add to Catalogue

```json
// src/infrastructure/data/catalogue.json
{
  "categories": [
    {
      "name": "Category",
      "componentIds": ["my-component"]
    }
  ]
}
```

---

## Theme System

The showcase supports four visual themes:

| Theme | Description |
|-------|-------------|
| **Normal** | Light corporate mode |
| **Neon** | Cyberpunk dark mode (default) |
| **Minimal** | High-contrast monochrome |
| **Glass** | Frosted glassmorphism |

Themes are managed via `ThemeContext` and applied using CSS custom properties.

---

## Author

**Armand Richelet-Kleinberg**  
M2H.IO - Ark Alliance Ecosystem

- GitHub: [@ArmandRicheletKleinberg](https://github.com/ArmandRicheletKleinberg)

**License**: MIT

---
