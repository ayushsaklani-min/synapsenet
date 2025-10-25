# SynapseNet Functionality Test Script
# This script tests all components of SynapseNet

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "SynapseNet Functionality Test" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check Node.js
Write-Host "[1/7] Testing Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  Node.js: FAILED" -ForegroundColor Red
}

# Test 2: Check Rust
Write-Host "[2/7] Testing Rust..." -ForegroundColor Yellow
try {
    $rustVersion = rustc --version
    Write-Host "  Rust: $rustVersion" -ForegroundColor Green
} catch {
    Write-Host "  Rust: FAILED" -ForegroundColor Red
}

# Test 3: Check Backend Dependencies
Write-Host "[3/7] Testing Backend Dependencies..." -ForegroundColor Yellow
$backendPath = "synapsenet-backend/services"
if (Test-Path $backendPath) {
    Write-Host "  Backend directory: EXISTS" -ForegroundColor Green
    if (Test-Path "$backendPath/node_modules") {
        Write-Host "  node_modules: INSTALLED" -ForegroundColor Green
    } else {
        Write-Host "  node_modules: MISSING (run npm install)" -ForegroundColor Yellow
    }
    if (Test-Path "$backendPath/chainlink_listener.js") {
        Write-Host "  Chainlink listener: EXISTS" -ForegroundColor Green
    } else {
        Write-Host "  Chainlink listener: MISSING" -ForegroundColor Red
    }
} else {
    Write-Host "  Backend directory: NOT FOUND" -ForegroundColor Red
}

# Test 4: Check Frontend Dependencies
Write-Host "[4/7] Testing Frontend Dependencies..." -ForegroundColor Yellow
$frontendPath = "synapsenet-frontend"
if (Test-Path $frontendPath) {
    Write-Host "  Frontend directory: EXISTS" -ForegroundColor Green
    if (Test-Path "$frontendPath/node_modules") {
        Write-Host "  node_modules: INSTALLED" -ForegroundColor Green
    } else {
        Write-Host "  node_modules: MISSING (run npm install)" -ForegroundColor Yellow
    }
    if (Test-Path "$frontendPath/src/App.tsx") {
        Write-Host "  App.tsx: EXISTS" -ForegroundColor Green
    } else {
        Write-Host "  App.tsx: MISSING" -ForegroundColor Red
    }
} else {
    Write-Host "  Frontend directory: NOT FOUND" -ForegroundColor Red
}

# Test 5: Check WebSocket Port
Write-Host "[5/7] Testing WebSocket Port (8090)..." -ForegroundColor Yellow
$port8090 = Get-NetTCPConnection -LocalPort 8090 -ErrorAction SilentlyContinue
if ($port8090) {
    Write-Host "  Port 8090: IN USE (Service running)" -ForegroundColor Green
} else {
    Write-Host "  Port 8090: AVAILABLE (Service not running)" -ForegroundColor Yellow
}

# Test 6: Check Frontend Port
Write-Host "[6/7] Testing Frontend Port (5173)..." -ForegroundColor Yellow
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173) {
    Write-Host "  Port 5173: IN USE (Frontend running)" -ForegroundColor Green
} else {
    Write-Host "  Port 5173: AVAILABLE (Frontend not running)" -ForegroundColor Yellow
}

# Test 7: Check Running Processes
Write-Host "[7/7] Testing Running Processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "  Node.js processes: $($nodeProcesses.Count) running" -ForegroundColor Green
} else {
    Write-Host "  Node.js processes: NONE running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Services Status:" -ForegroundColor Yellow
if ($port8090) {
    Write-Host "  Chainlink Listener (Port 8090): RUNNING" -ForegroundColor Green
} else {
    Write-Host "  Chainlink Listener (Port 8090): STOPPED" -ForegroundColor Red
}

if ($port5173) {
    Write-Host "  Frontend (Port 5173): RUNNING" -ForegroundColor Green
} else {
    Write-Host "  Frontend (Port 5173): STOPPED" -ForegroundColor Red
}

Write-Host ""
Write-Host "Quick Start Commands:" -ForegroundColor Cyan
Write-Host "  Start all services: .\start_synapsenet.ps1" -ForegroundColor White
Write-Host "  Frontend only: cd synapsenet-frontend && npm run dev" -ForegroundColor White
Write-Host "  Backend only: cd synapsenet-backend/services && node chainlink_listener.js" -ForegroundColor White
Write-Host ""
