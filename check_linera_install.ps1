# Check Linera Installation Progress

Write-Host ""
Write-Host "=== Linera Installation Status ===" -ForegroundColor Cyan
Write-Host ""

# Check if Linera CLI is installed
Write-Host "1. Checking Linera CLI..." -ForegroundColor Yellow
try {
    $lineraVersion = & linera --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   SUCCESS: $lineraVersion" -ForegroundColor Green
        Write-Host ""
        Write-Host "Linera is ready to use!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "   cd synapsenet-backend"
        Write-Host "   linera wallet init"
        Write-Host "   linera net up"
        Write-Host ""
        exit 0
    }
} catch {
    Write-Host "   NOT YET INSTALLED (still downloading/compiling)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. Checking installation process..." -ForegroundColor Yellow

# Check for cargo processes
$cargoProcesses = Get-Process -Name "cargo","rustc" -ErrorAction SilentlyContinue
if ($cargoProcesses) {
    Write-Host "   ACTIVE: Found $($cargoProcesses.Count) compilation process(es)" -ForegroundColor Yellow
    $cargoProcesses | ForEach-Object {
        $cpuUsage = [math]::Round($_.CPU, 2)
        $memMB = [math]::Round($_.WS / 1MB, 0)
        Write-Host "      - $($_.ProcessName): CPU: $cpuUsage seconds, Memory: $memMB MB" -ForegroundColor Gray
    }
} else {
    Write-Host "   NO ACTIVE PROCESS - May have finished or stopped" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Checking Cargo directory..." -ForegroundColor Yellow

# Check cargo bin directory
$cargoBin = "$env:USERPROFILE\.cargo\bin"
if (Test-Path $cargoBin) {
    $lineraFiles = Get-ChildItem -Path $cargoBin -Filter "linera*" -ErrorAction SilentlyContinue
    if ($lineraFiles) {
        Write-Host "   FOUND Linera files in cargo bin:" -ForegroundColor Green
        $lineraFiles | ForEach-Object {
            $sizeMB = [math]::Round($_.Length / 1MB, 2)
            Write-Host "      - $($_.Name) - Size: $sizeMB MB" -ForegroundColor Gray
        }
    } else {
        Write-Host "   No Linera files yet (still compiling)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "4. Checking download cache size..." -ForegroundColor Yellow

# Check cargo registry size
$registryPath = "$env:USERPROFILE\.cargo\registry"
if (Test-Path $registryPath) {
    try {
        $totalSize = (Get-ChildItem -Path $registryPath -Recurse -ErrorAction SilentlyContinue | 
                     Measure-Object -Property Length -Sum).Sum
        $sizeMB = [math]::Round($totalSize / 1MB, 2)
        Write-Host "   Cargo cache size: $sizeMB MB" -ForegroundColor Cyan
    } catch {
        Write-Host "   Could not calculate cache size" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Status: INSTALLATION IN PROGRESS" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected time: 15-30 minutes total" -ForegroundColor Gray
Write-Host "Check again in 5-10 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "Your current system (Chainlink + Frontend) is working!" -ForegroundColor Green
Write-Host "Visit: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
