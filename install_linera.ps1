# Install Linera CLI Tools

Write-Host ""
Write-Host "=== Installing Linera CLI ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will take 15-30 minutes..." -ForegroundColor Yellow
Write-Host ""

# Install from GitHub
Write-Host "Running: cargo install --git https://github.com/linera-io/linera-protocol linera-service --locked" -ForegroundColor Gray
Write-Host ""

cargo install --git https://github.com/linera-io/linera-protocol linera-service --locked

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Linera installed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifying installation..." -ForegroundColor Yellow
    linera --version
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   cd synapsenet-backend"
    Write-Host "   linera wallet init"
    Write-Host "   linera net up"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Installation encountered an issue." -ForegroundColor Red
    Write-Host "Exit code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host ""
    Write-Host "You can still use your system without Linera!" -ForegroundColor Yellow
    Write-Host "Visit: http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
}


