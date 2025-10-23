# SynapseNet Real Data Startup Script
# This script starts all services with real Chainlink data

Write-Host "🚀 Starting SynapseNet with Real Chainlink Data..." -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Success "Node.js found: $nodeVersion"
} catch {
    Write-Error "Node.js is not installed. Please install Node.js first."
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Success "npm found: $npmVersion"
} catch {
    Write-Error "npm is not installed. Please install npm first."
    exit 1
}

# Check if cargo is installed
try {
    $cargoVersion = cargo --version
    Write-Success "Cargo found: $cargoVersion"
} catch {
    Write-Error "Cargo is not installed. Please install Rust first."
    exit 1
}

Write-Status "Installing Chainlink listener dependencies..."
Set-Location services
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install Node.js dependencies"
        exit 1
    }
    Write-Success "Node.js dependencies installed"
} else {
    Write-Success "Node.js dependencies already installed"
}

Write-Status "Building Rust backend..."
Set-Location ../sdk
# Avoid OneDrive file lock issues by using a temp target dir
$env:CARGO_TARGET_DIR = Join-Path $env:TEMP 'synapsenet-sdk-target'
if (-not (Test-Path $env:CARGO_TARGET_DIR)) { New-Item -ItemType Directory -Force -Path $env:CARGO_TARGET_DIR | Out-Null }
cargo build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to build Rust backend"
    exit 1
}
Write-Success "Rust backend built successfully"

Write-Status "Starting Chainlink listener service..."
Set-Location ../services
Start-Process -FilePath "node" -ArgumentList "chainlink_listener.js" -WindowStyle Hidden
Write-Success "Chainlink listener started"

# Wait a moment for the WebSocket server to start
Start-Sleep -Seconds 3

Write-Status "Starting Linera backend..."
Set-Location ../sdk
Start-Process -FilePath "cargo" -ArgumentList "run", "--release" -WindowStyle Hidden
Write-Success "Linera backend started"

# Wait a moment for the backend to start
Start-Sleep -Seconds 3

Write-Status "Starting frontend development server..."
Set-Location ../../synapsenet-frontend
if (-not (Test-Path "node_modules")) {
    Write-Status "Installing frontend dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install frontend dependencies"
        exit 1
    }
}

Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden
Write-Success "Frontend development server started"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Success "✅ SynapseNet is live with real Chainlink data!"
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔗 Backend WebSocket: ws://localhost:8081" -ForegroundColor Cyan
Write-Host "📊 Chainlink Oracle: Polygon Amoy Testnet" -ForegroundColor Cyan
Write-Host "💰 Monitoring: ETH/USD Price Feed" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Keep the script running
Write-Host "All services are running. Press any key to stop..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
