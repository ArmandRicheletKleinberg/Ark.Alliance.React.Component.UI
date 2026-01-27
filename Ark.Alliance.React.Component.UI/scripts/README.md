# Scripts

This directory contains utility scripts for the **Ark Alliance React Component UI** library.

## Component Manifest Generator

**Script:** `generate-component-manifest.ts`  
**Wrapper:** `generate-manifest.ps1`

### Purpose
Extracts metadata from all React components in `src/components` and generates a structured JSON file (`component-manifest.json`) in the project root. This JSON is used for documentation, automated testing, or other tooling needs.

It uses **ts-morph** to accurately parse:
- **JSDoc Descriptions** (from component headers)
- **Props** (including inherited props from interfaces)
- **MVVM Models** (Zod schemas defined in `*.model.ts`)
- **Types** (string, boolean, enums, etc.)

### Usage

#### Option 1: PowerShell (Recommended for Windows)
Run the automated wrapper script, which handles execution via `npx tsx`:
```powershell
.\generate-manifest.ps1
```

#### Option 2: NPM Script
You can also run it via the package `scripts`:
```bash
npm run generate:manifest
```

#### Option 3: Direct Execution
If you have `tsx` installed globally or want to run it via `npx` directly:
```bash
npx tsx generate-component-manifest.ts
```

### Output
The script generates `component-manifest.json` in the project root directory.
