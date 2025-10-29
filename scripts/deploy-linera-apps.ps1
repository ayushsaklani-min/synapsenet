# SynapseNet Linera Application Deployment Script (PowerShell)
# This script deploys all three Linera microchain applications

$ErrorActionPreference = "Stop"

Write-Host "🚀 SynapseNet Linera Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Linera is installed
try {
    $lineraVersion = linera --version 2>&1
    Write-Host "✅ Linera CLI found: $lineraVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Linera CLI not found. Please install Linera first." -ForegroundColor Red
    Write-Host "   Run: cargo install linera-service --version 0.15.4" -ForegroundColor Yellow
    exit 1
}

# Set up environment
$env:LINERA_WALLET = if ($env:LINERA_WALLET) { $env:LINERA_WALLET } else { "$env:USERPROFILE\.config\linera\wallet.json" }
$env:LINERA_STORAGE = if ($env:LINERA_STORAGE) { $env:LINERA_STORAGE } else { "rocksdb:$env:USERPROFILE\.config\linera\client.db" }

Write-Host ""
Write-Host "📁 Configuration:" -ForegroundColor Cyan
Write-Host "   Wallet: $env:LINERA_WALLET"
Write-Host "   Storage: $env:LINERA_STORAGE"

# Initialize local network if needed
if (-not (Test-Path $env:LINERA_WALLET)) {
    Write-Host ""
    Write-Host "🔧 Initializing Linera local network..." -ForegroundColor Yellow
    linera net up --testing-prng-seed 37
    Write-Host "✅ Local network initialized" -ForegroundColor Green
}

# Get default chain
$walletOutput = linera wallet show
$defaultChain = ($walletOutput | Select-String "Default chain" | ForEach-Object { $_.Line.Split()[2] })
Write-Host ""
Write-Host "🔗 Default chain: $defaultChain" -ForegroundColor Cyan

# Build and deploy Price Feed application
Write-Host ""
Write-Host "📦 Building Price Feed application..." -ForegroundColor Yellow
Set-Location synapsenet-backend\chains\price-feed\price-feed
cargo build --release --target wasm32-unknown-unknown

Write-Host "🚀 Publishing Price Feed application..." -ForegroundColor Yellow
$priceFeedOutput = linera publish-bytecode `
    target\wasm32-unknown-unknown\release\price_feed_contract.wasm `
    target\wasm32-unknown-unknown\release\price_feed_service.wasm

$priceFeedBytecodeId = ($priceFeedOutput | Select-String "Bytecode ID" | ForEach-Object { $_.Line.Split()[2] })

Write-Host "📝 Creating Price Feed application..." -ForegroundColor Yellow
$priceFeedAppOutput = linera create-application $priceFeedBytecodeId
$priceFeedAppId = ($priceFeedAppOutput | Select-String "Application ID" | ForEach-Object { $_.Line.Split()[2] })

Write-Host "✅ Price Feed deployed: $priceFeedAppId" -ForegroundColor Green

# Build and deploy Identity Score application
Write-Host ""
Write-Host "📦 Building Identity Score application..." -ForegroundColor Yellow
Set-Location ..\..\..\identity-score\identity-score
cargo build --release --target wasm32-unknown-unknown

Write-Host "🚀 Publishing Identity Score application..." -ForegroundColor Yellow
$identityScoreOutput = linera publish-bytecode `
    target\wasm32-unknown-unknown\release\identity_score_contract.wasm `
    target\wasm32-unknown-unknown\release\identity_score_service.wasm

$identityScoreBytecodeId = ($identityScoreOutput | Select-String "Bytecode ID" | ForEach-Object { $_.Line.Split()[2] })

Write-Host "📝 Creating Identity Score application..." -ForegroundColor Yellow
$identityScoreAppOutput = linera create-application $identityScoreBytecodeId
$identityScoreAppId = ($identityScoreAppOutput | Select-String "Application ID" | ForEach-Object { $_.Line.Split()[2] })

Write-Host "✅ Identity Score deployed: $identityScoreAppId" -ForegroundColor Green

# Build and deploy Dashboard application
Write-Host ""
Write-Host "📦 Building Dashboard application..." -ForegroundColor Yellow
Set-Location ..\..\..\dashboard\dashboard
cargo build --release --target wasm32-unknown-unknown

Write-Host "🚀 Publishing Dashboard application..." -ForegroundColor Yellow
$dashboardOutput = linera publish-bytecode `
    target\wasm32-unknown-unknown\release\dashboard_contract.wasm `
    target\wasm32-unknown-unknown\release\dashboard_service.wasm

$dashboardBytecodeId = ($dashboardOutput | Select-String "Bytecode ID" | ForEach-Object { $_.Line.Split()[2] })

Write-Host "📝 Creating Dashboard application..." -ForegroundColor Yellow
$dashboardAppOutput = linera create-application $dashboardBytecodeId
$dashboardAppId = ($dashboardAppOutput | Select-String "Application ID" | ForEach-Object { $_.Line.Split()[2] })

Write-Host "✅ Dashboard deployed: $dashboardAppId" -ForegroundColor Green

# Save application IDs to config file
Set-Location ..\..\..\..\..\..
New-Item -ItemType Directory -Force -Path .linera | Out-Null

$deployedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

$config = @{
    priceFeedAppId = $priceFeedAppId
    identityScoreAppId = $identityScoreAppId
    dashboardAppId = $dashboardAppId
    defaultChain = $defaultChain
    deployedAt = $deployedAt
} | ConvertTo-Json

$config | Out-File -FilePath .linera\app-ids.json -Encoding UTF8

Write-Host ""
Write-Host "✅ All applications deployed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Application IDs:" -ForegroundColor Cyan
Write-Host "   Price Feed:      $priceFeedAppId"
Write-Host "   Identity Score:  $identityScoreAppId"
Write-Host "   Dashboard:       $dashboardAppId"
Write-Host ""
Write-Host "💾 Configuration saved to: .linera\app-ids.json" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Start Linera service: linera service --port 8080"
Write-Host "   2. Configure Chainlink listener with these app IDs"
Write-Host "   3. Start the frontend"
