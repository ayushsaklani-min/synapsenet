# Quick test to verify SynapseNet is working

Write-Host "Testing SynapseNet Services..." -ForegroundColor Cyan
Write-Host ""

# Test WebSocket Port
Write-Host "1. Checking Chainlink Listener (Port 8090)..." -ForegroundColor Yellow
$wsPort = netstat -ano | findstr ":8090" | findstr "LISTENING"
if ($wsPort) {
    Write-Host "   ✅ WebSocket Server is running" -ForegroundColor Green
} else {
    Write-Host "   ❌ WebSocket Server is NOT running" -ForegroundColor Red
}

# Test Frontend Port
Write-Host "2. Checking Frontend Dashboard (Port 5173)..." -ForegroundColor Yellow
$frontendPort = netstat -ano | findstr ":5173" | findstr "LISTENING"
if ($frontendPort) {
    Write-Host "   ✅ Frontend is running" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend is NOT running" -ForegroundColor Red
}

# Check Node Processes
Write-Host "3. Checking Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   ✅ Found $($nodeProcesses.Count) Node.js processes" -ForegroundColor Green
} else {
    Write-Host "   ❌ No Node.js processes found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access your dashboard at: http://localhost:5173" -ForegroundColor White
Write-Host "WebSocket endpoint: ws://localhost:8090" -ForegroundColor White

