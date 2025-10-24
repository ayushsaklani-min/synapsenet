# SynapseNet 2.0 - Complete Startup Script
# This script starts all services for real blockchain data

Write-Host "🚀 Starting SynapseNet 2.0 with Real Blockchain Data" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check if Rust is installed
try {
    $rustVersion = rustc --version
    Write-Host "✅ Rust version: $rustVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Rust not found. Please install Rust 1.70+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Setting up backend services..." -ForegroundColor Yellow

# Start Chainlink Listener
Write-Host "📡 Starting Chainlink Oracle Listener..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd synapsenet-backend/services; npm install; node chainlink_listener.js" -WindowStyle Normal

# Wait a moment for the listener to start
Start-Sleep -Seconds 3

# Start Linera Backend
Write-Host "⚡ Starting Linera Backend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd synapsenet-backend/sdk; cargo run --release" -WindowStyle Normal

# Wait for backend to initialize
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎨 Setting up frontend..." -ForegroundColor Yellow

# Start Frontend
Write-Host "🌐 Starting React Frontend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd synapsenet-frontend; npm install; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "📡 WebSocket: ws://localhost:8090" -ForegroundColor White
Write-Host "🔗 Chainlink Oracle: Polygon Amoy Testnet" -ForegroundColor White
Write-Host ""
Write-Host "📊 Real ETH/USD prices will be displayed in the dashboard" -ForegroundColor Green
Write-Host "⏳ Please wait for the services to fully initialize..." -ForegroundColor Yellow

# Keep the script running
Write-Host ""
Write-Host "Press any key to stop all services..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "🛑 Stopping all services..." -ForegroundColor Red
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*cargo*"} | Stop-Process -Force
Write-Host "✅ All services stopped" -ForegroundColor Green
