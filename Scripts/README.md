# Publish Scripts

Automated scripts for publishing the `ark-alliance-react-ui` npm package with proper version management and GitHub Release integration.

## Prerequisites

- **Node.js** 20+ with npm
- **Git** configured with push access
- **GitHub CLI** (`gh`) - [Install here](https://cli.github.com/)

## Usage

### Windows (PowerShell)

```powershell
# Bump patch version (1.2.3 -> 1.2.4)
.\Scripts\publish.ps1 -Version patch

# Bump minor version (1.2.3 -> 1.3.0)
.\Scripts\publish.ps1 -Version minor

# Bump major version (1.2.3 -> 2.0.0)
.\Scripts\publish.ps1 -Version major

# Set specific version
.\Scripts\publish.ps1 -Version 2.0.0

# Dry run (preview without changes)
.\Scripts\publish.ps1 -Version patch -DryRun
```

### Unix/Linux/macOS (Bash)

```bash
# Make executable (first time only)
chmod +x Scripts/publish.sh

# Bump patch version
./Scripts/publish.sh patch

# Bump minor version
./Scripts/publish.sh minor

# Dry run
./Scripts/publish.sh patch --dry-run
```

## What the Scripts Do

1. **Version Bump**: Updates `package.json` version
2. **Badge Update**: Updates README.md version badge
3. **Build**: Runs `npm run build:lib`
4. **Commit**: Creates conventional commit `chore(release): vX.X.X`
5. **Tag**: Creates annotated git tag `vX.X.X`
6. **Push**: Pushes to origin with tags
7. **GitHub Release**: Creates release via `gh` CLI

## Automation Flow

```
publish.ps1/sh
     │
     ▼
Creates GitHub Release
     │
     ▼
Triggers `.github/workflows/npm-publish.yml`
     │
     ▼
Publishes to npm registry
```

## Notes

- The npm publish happens automatically via GitHub Actions when a release is created
- Ensure `NPM_TOKEN` secret is configured in repository settings
- GitHub Releases will appear in the repository sidebar
