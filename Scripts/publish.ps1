<#
.SYNOPSIS
    Automated npm package publish script for Ark.Alliance.React.Component.UI
    
.DESCRIPTION
    This script handles the complete publish workflow:
    1. Bumps the version in package.json
    2. Updates the README.md version badge
    3. Builds the library
    4. Commits changes with conventional commit message
    5. Creates a git tag
    6. Pushes to origin
    7. Creates a GitHub Release (which triggers npm-publish workflow)
    
.PARAMETER Version
    The version bump type: 'patch', 'minor', 'major', or a specific version like '1.2.3'
    
.PARAMETER DryRun
    If specified, shows what would happen without making changes
    
.EXAMPLE
    ./publish.ps1 -Version patch
    ./publish.ps1 -Version minor
    ./publish.ps1 -Version 2.0.0
    ./publish.ps1 -Version patch -DryRun
    
.NOTES
    Author: Armand Richelet-Kleinberg
    Requires: git, npm, gh (GitHub CLI)
#>

param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^(patch|minor|major|\d+\.\d+\.\d+)$')]
    [string]$Version,
    
    [switch]$DryRun
)

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$LibraryDir = Join-Path $RepoRoot "Ark.Alliance.React.Component.UI"
$PackageJsonPath = Join-Path $LibraryDir "package.json"
$ReadmePath = Join-Path $RepoRoot "README.md"

# Colors for output
function Write-Step { param($msg) Write-Host "⚡ $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

# ═══════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

function Get-CurrentVersion {
    $packageJson = Get-Content $PackageJsonPath -Raw | ConvertFrom-Json
    return $packageJson.version
}

function Get-NextVersion {
    param([string]$Current, [string]$BumpType)
    
    if ($BumpType -match '^\d+\.\d+\.\d+$') {
        return $BumpType
    }
    
    $parts = $Current.Split('.')
    $major = [int]$parts[0]
    $minor = [int]$parts[1]
    $patch = [int]$parts[2]
    
    switch ($BumpType) {
        'major' { $major++; $minor = 0; $patch = 0 }
        'minor' { $minor++; $patch = 0 }
        'patch' { $patch++ }
    }
    
    return "$major.$minor.$patch"
}

function Update-PackageVersion {
    param([string]$NewVersion)
    
    $packageJson = Get-Content $PackageJsonPath -Raw | ConvertFrom-Json
    $packageJson.version = $NewVersion
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $PackageJsonPath -NoNewline
}

function Update-ReadmeBadge {
    param([string]$NewVersion)
    
    $content = Get-Content $ReadmePath -Raw
    # Update version badge: version-X.X.X-blue
    $content = $content -replace 'version-\d+\.\d+\.\d+-blue', "version-$NewVersion-blue"
    Set-Content $ReadmePath -Value $content -NoNewline
}

function Test-GitClean {
    $status = git status --porcelain
    return [string]::IsNullOrWhiteSpace($status)
}

function Test-GhCliInstalled {
    try {
        $null = gh --version
        return $true
    }
    catch {
        return $false
    }
}

# ═══════════════════════════════════════════════════════════════════════════
# MAIN SCRIPT
# ═══════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  Ark.Alliance.React.Component.UI - Publish Script" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

# Verify we're in the right directory
if (-not (Test-Path $PackageJsonPath)) {
    Write-Err "package.json not found at $PackageJsonPath"
    Write-Err "Please run this script from the repository root or Scripts folder"
    exit 1
}

# Verify GitHub CLI is installed
if (-not (Test-GhCliInstalled)) {
    Write-Warning "GitHub CLI (gh) is not installed. Releases will need to be created manually."
    Write-Host "Install from: https://cli.github.com/"
}

# Get versions
$currentVersion = Get-CurrentVersion
$newVersion = Get-NextVersion -Current $currentVersion -BumpType $Version

Write-Step "Current version: $currentVersion"
Write-Step "New version: $newVersion"
Write-Host ""

if ($DryRun) {
    Write-Warning "DRY RUN - No changes will be made"
    Write-Host ""
    Write-Host "Would perform:"
    Write-Host "  1. Update package.json version to $newVersion"
    Write-Host "  2. Update README.md version badge"
    Write-Host "  3. Build library"
    Write-Host "  4. Commit with message: 'chore(release): v$newVersion'"
    Write-Host "  5. Create tag: v$newVersion"
    Write-Host "  6. Push to origin"
    Write-Host "  7. Create GitHub Release"
    exit 0
}

# Check for uncommitted changes
if (-not (Test-GitClean)) {
    Write-Warning "You have uncommitted changes. Please commit or stash them first."
    git status --short
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne 'y') {
        exit 1
    }
}

# Step 1: Update package.json
Write-Step "Updating package.json version..."
Update-PackageVersion -NewVersion $newVersion
Write-Success "package.json updated to $newVersion"

# Step 2: Update README badge
Write-Step "Updating README.md version badge..."
Update-ReadmeBadge -NewVersion $newVersion
Write-Success "README.md badge updated"

# Step 3: Build library
Write-Step "Building library..."
Push-Location $LibraryDir
try {
    npm run build:lib
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    Write-Success "Library built successfully"
}
finally {
    Pop-Location
}

# Step 4: Commit changes
Write-Step "Committing changes..."
git add -A
git commit -m "chore(release): v$newVersion" -m "Bump version to $newVersion and update badges"
Write-Success "Changes committed"

# Step 5: Create tag
Write-Step "Creating tag v$newVersion..."
git tag -a "v$newVersion" -m "Release v$newVersion"
Write-Success "Tag created"

# Step 6: Push to origin
Write-Step "Pushing to origin..."
git push origin --follow-tags
Write-Success "Pushed to origin with tags"

# Step 7: Create GitHub Release
if (Test-GhCliInstalled) {
    Write-Step "Creating GitHub Release..."
    
    $releaseNotes = @"
## What's Changed

### New in v$newVersion
- Version bump and badge updates

### Full Changelog
https://github.com/ArmandRicheletKleinberg/Ark.Alliance.React.Component.UI/compare/v$currentVersion...v$newVersion
"@

    gh release create "v$newVersion" `
        --title "v$newVersion" `
        --notes $releaseNotes `
        --target (git rev-parse HEAD)
    
    Write-Success "GitHub Release created"
    Write-Host ""
    Write-Success "🚀 Release v$newVersion published!"
    Write-Host "   npm publish workflow will trigger automatically" -ForegroundColor Gray
}
else {
    Write-Warning "GitHub CLI not installed - please create release manually at:"
    Write-Host "   https://github.com/ArmandRicheletKleinberg/Ark.Alliance.React.Component.UI/releases/new"
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ Publish complete for v$newVersion" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
