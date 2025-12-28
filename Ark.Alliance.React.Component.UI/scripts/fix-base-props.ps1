# PowerShell script to add missing base props to UI library default models

$baseProps = @"
    focusable: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: false,
    mouseMoveEnabled: false,
    mouseEnterEnabled: false,
    mouseLeaveEnabled: false,
    mouseDownEnabled: false,
"@

$files = @(
    "src\components\Chart3D\Chart3D.model.ts",
    "src\components\Footer\Footer.model.ts",
    "src\components\Gauges\Gauge.model.ts",
    "src\components\Header\Header.model.ts",
    "src\components\Icon\FAIcon\FAIcon.model.ts",
    "src\components\Icon\Icon.model.ts",
    "src\components\Input\FileUpload\FileUpload.model.ts",
    "src\components\Input\NumericInput\NumericInput.model.ts",
    "src\components\Input\Select\Select.model.ts",
    "src\components\Input\Slider\Slider.model.ts",
    "src\components\Input\TextArea\TextArea.model.ts",
    "src\components\Label\Label.model.ts",
    "src\components\Modal\Modal.model.ts",
    "src\components\SideBar\SideBarMenu\SideBarMenu.model.ts"
)

foreach ($file in $files) {
    $fullPath = "c:\Repos\Ark.Alliance.Trading.Bot-React\Ark.Alliance.React.Component.UI\$file"
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # Find the default export block
        if ($content -match '(export const default\w+:\s*[^=]+=\s*\{[^}]*disabled:\s*false,\s*loading:\s*false,)') {
            # Add base props after loading: false,
            $content = $content -replace '(disabled:\s*false,\s*loading:\s*false,)', "`$1`r`n$baseProps"
            Set-Content $fullPath -Value $content -NoNewline
            Write-Host "Fixed: $file"
        }
        else {
            Write-Host "Skipped (pattern not found): $file"
        }
    }
    else {
        Write-Host "Not found: $file"
    }
}

Write-Host "Completed fixing UI library models"
