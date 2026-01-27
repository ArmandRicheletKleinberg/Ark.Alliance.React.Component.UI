#!/bin/bash
#
# Automated npm package publish script for Ark.Alliance.React.Component.UI
#
# Usage:
#   ./publish.sh patch      # Bump patch version (1.2.3 -> 1.2.4)
#   ./publish.sh minor      # Bump minor version (1.2.3 -> 1.3.0)
#   ./publish.sh major      # Bump major version (1.2.3 -> 2.0.0)
#   ./publish.sh 2.0.0      # Set specific version
#   ./publish.sh patch --dry-run  # Preview without making changes
#
# This script handles:
#   1. Version bump in package.json
#   2. README.md badge update
#   3. Library build
#   4. Git commit and tag
#   5. Push to origin
#   6. GitHub Release creation (triggers npm-publish workflow)
#
# Prerequisites: git, npm, gh (GitHub CLI)

set -e

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
LIBRARY_DIR="$REPO_ROOT/Ark.Alliance.React.Component.UI"
PACKAGE_JSON="$LIBRARY_DIR/package.json"
README_PATH="$REPO_ROOT/README.md"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

step() { echo -e "${CYAN}⚡ $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }

# ═══════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

get_current_version() {
    grep '"version"' "$PACKAGE_JSON" | sed -E 's/.*"version": "([^"]+)".*/\1/'
}

get_next_version() {
    local current="$1"
    local bump_type="$2"
    
    if [[ "$bump_type" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "$bump_type"
        return
    fi
    
    IFS='.' read -r major minor patch <<< "$current"
    
    case "$bump_type" in
        major) echo "$((major + 1)).0.0" ;;
        minor) echo "$major.$((minor + 1)).0" ;;
        patch) echo "$major.$minor.$((patch + 1))" ;;
        *) echo "$current" ;;
    esac
}

update_package_version() {
    local new_version="$1"
    sed -i.bak -E "s/\"version\": \"[^\"]+\"/\"version\": \"$new_version\"/" "$PACKAGE_JSON"
    rm -f "$PACKAGE_JSON.bak"
}

update_readme_badge() {
    local new_version="$1"
    sed -i.bak -E "s/version-[0-9]+\.[0-9]+\.[0-9]+-blue/version-$new_version-blue/" "$README_PATH"
    rm -f "$README_PATH.bak"
}

is_git_clean() {
    [ -z "$(git status --porcelain)" ]
}

has_gh_cli() {
    command -v gh &> /dev/null
}

# ═══════════════════════════════════════════════════════════════════════════
# ARGUMENT PARSING
# ═══════════════════════════════════════════════════════════════════════════

VERSION_TYPE=""
DRY_RUN=false

for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY_RUN=true ;;
        patch|minor|major) VERSION_TYPE="$arg" ;;
        [0-9]*.[0-9]*.[0-9]*) VERSION_TYPE="$arg" ;;
        -h|--help)
            echo "Usage: $0 <patch|minor|major|X.X.X> [--dry-run]"
            exit 0
            ;;
        *)
            error "Unknown argument: $arg"
            exit 1
            ;;
    esac
done

if [ -z "$VERSION_TYPE" ]; then
    error "Please specify version type: patch, minor, major, or X.X.X"
    echo "Usage: $0 <patch|minor|major|X.X.X> [--dry-run]"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════════════════
# MAIN SCRIPT
# ═══════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}  Ark.Alliance.React.Component.UI - Publish Script${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Verify we're in the right directory
if [ ! -f "$PACKAGE_JSON" ]; then
    error "package.json not found at $PACKAGE_JSON"
    error "Please run this script from the repository root or Scripts folder"
    exit 1
fi

# Verify GitHub CLI
if ! has_gh_cli; then
    warn "GitHub CLI (gh) is not installed. Releases will need to be created manually."
    echo "Install from: https://cli.github.com/"
fi

# Get versions
CURRENT_VERSION=$(get_current_version)
NEW_VERSION=$(get_next_version "$CURRENT_VERSION" "$VERSION_TYPE")

step "Current version: $CURRENT_VERSION"
step "New version: $NEW_VERSION"
echo ""

if [ "$DRY_RUN" = true ]; then
    warn "DRY RUN - No changes will be made"
    echo ""
    echo "Would perform:"
    echo "  1. Update package.json version to $NEW_VERSION"
    echo "  2. Update README.md version badge"
    echo "  3. Build library"
    echo "  4. Commit with message: 'chore(release): v$NEW_VERSION'"
    echo "  5. Create tag: v$NEW_VERSION"
    echo "  6. Push to origin"
    echo "  7. Create GitHub Release"
    exit 0
fi

# Check for uncommitted changes
if ! is_git_clean; then
    warn "You have uncommitted changes:"
    git status --short
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Update package.json
step "Updating package.json version..."
update_package_version "$NEW_VERSION"
success "package.json updated to $NEW_VERSION"

# Step 2: Update README badge
step "Updating README.md version badge..."
update_readme_badge "$NEW_VERSION"
success "README.md badge updated"

# Step 3: Build library
step "Building library..."
cd "$LIBRARY_DIR"
npm run build:lib
success "Library built successfully"
cd "$REPO_ROOT"

# Step 4: Commit changes
step "Committing changes..."
git add -A
git commit -m "chore(release): v$NEW_VERSION" -m "Bump version to $NEW_VERSION and update badges"
success "Changes committed"

# Step 5: Create tag
step "Creating tag v$NEW_VERSION..."
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
success "Tag created"

# Step 6: Push to origin
step "Pushing to origin..."
git push origin --follow-tags
success "Pushed to origin with tags"

# Step 7: Create GitHub Release
if has_gh_cli; then
    step "Creating GitHub Release..."
    
    RELEASE_NOTES="## What's Changed

### New in v$NEW_VERSION
- Version bump and badge updates

### Full Changelog
https://github.com/ArmandRicheletKleinberg/Ark.Alliance.React.Component.UI/compare/v$CURRENT_VERSION...v$NEW_VERSION"

    gh release create "v$NEW_VERSION" \
        --title "v$NEW_VERSION" \
        --notes "$RELEASE_NOTES" \
        --target "$(git rev-parse HEAD)"
    
    success "GitHub Release created"
    echo ""
    success "🚀 Release v$NEW_VERSION published!"
    echo -e "   ${NC}npm publish workflow will trigger automatically${NC}"
else
    warn "GitHub CLI not installed - please create release manually at:"
    echo "   https://github.com/ArmandRicheletKleinberg/Ark.Alliance.React.Component.UI/releases/new"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ Publish complete for v$NEW_VERSION${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
