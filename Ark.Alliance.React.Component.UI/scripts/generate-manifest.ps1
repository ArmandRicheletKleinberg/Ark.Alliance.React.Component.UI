
# Wrapper script to run the TypeScript component manifest generator
Write-Host "Starting Component Manifest Generation..." -ForegroundColor Cyan

$scriptPath = Join-Path $PSScriptRoot "generate-component-manifest.ts"

if (!(Test-Path $scriptPath)) {
    Write-Error "Could not find generation script at $scriptPath"
    exit 1
}

# Run with tsx (TypeScript Execute)
# Assuming npx is available
Write-Host "Executing TypeScript extraction logic..." -ForegroundColor Gray
npx tsx $scriptPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully generated component-manifest.json" -ForegroundColor Green
} else {
    Write-Error "Failed to generate manifest. Exit code: $LASTEXITCODE"
}
