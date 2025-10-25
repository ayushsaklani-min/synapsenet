# Quick Latency Fix Script
# This script replaces the current Chainlink listener with an optimized version

Write-Host "🔧 Fixing High Latency Issues..." -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

# Backup original file
Write-Host "📦 Creating backup of original listener..." -ForegroundColor Blue
Copy-Item "synapsenet-backend/services/chainlink_listener.js" "synapsenet-backend/services/chainlink_listener_backup.js"

# Replace with optimized version
Write-Host "⚡ Installing optimized listener..." -ForegroundColor Blue
Copy-Item "synapsenet-backend/services/chainlink_listener_optimized.js" "synapsenet-backend/services/chainlink_listener.js"

Write-Host ""
Write-Host "✅ Latency optimizations applied!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Optimizations included:" -ForegroundColor Cyan
Write-Host "  • Faster RPC endpoints" -ForegroundColor White
Write-Host "  • Connection pooling" -ForegroundColor White
Write-Host "  • Response caching" -ForegroundColor White
Write-Host "  • Reduced API calls" -ForegroundColor White
Write-Host "  • Faster update frequency (2s vs 5s)" -ForegroundColor White
Write-Host ""
Write-Host "📊 Expected improvements:" -ForegroundColor Yellow
Write-Host "  • Latency: 2000-5000ms → 200-500ms" -ForegroundColor White
Write-Host "  • Updates: Every 5s → Every 2s" -ForegroundColor White
Write-Host "  • Reliability: Better caching" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Restart your services to apply changes:" -ForegroundColor Red
Write-Host "  .\start_synapsenet.ps1" -ForegroundColor White
Write-Host ""
Write-Host "For even better performance, add your Infura/Alchemy keys:" -ForegroundColor Cyan
Write-Host "  Edit: synapsenet-backend/services/chainlink_listener.js" -ForegroundColor White
Write-Host "  Uncomment and add your RPC keys" -ForegroundColor White
