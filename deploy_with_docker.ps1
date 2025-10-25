# Deploy SynapseNet using Docker container with Linera

Write-Host ""
Write-Host "=== Deploying SynapseNet with Docker Linera ===" -ForegroundColor Cyan
Write-Host ""

# Stop old container
Write-Host "Cleaning up old container..." -ForegroundColor Yellow
docker stop 97e07f745539 2>$null
docker rm 97e07f745539 2>$null

# Get current directory (Windows path)
$currentDir = (Get-Location).Path
Write-Host "Project directory: $currentDir" -ForegroundColor Gray

# Start new container with project mounted
Write-Host ""
Write-Host "Starting Docker container with Linera..." -ForegroundColor Yellow
Write-Host "  Image: linera-final" -ForegroundColor Gray
Write-Host "  Linera version: v0.15.4" -ForegroundColor Gray
Write-Host ""

docker run -it --rm `
    --name synapsenet-linera `
    -v "${currentDir}:/project" `
    -w /project/synapsenet-backend `
    -p 8080:8080 `
    -p 8081:8081 `
    linera-final bash -c "
        echo '🚀 Linera Container Started'
        echo ''
        echo 'Linera version:'
        linera --version
        echo ''
        echo '📦 Initializing Linera wallet...'
        linera wallet init --with-new-chain
        echo ''
        echo '🌐 Starting Linera network...'
        linera net up &
        sleep 5
        echo ''
        echo '💰 Requesting test tokens...'
        linera request-faucet
        echo ''
        echo '💳 Checking balance...'
        linera balance
        echo ''
        echo '📦 Building contracts...'
        cd chains/price-feed/price-feed
        cargo build --target wasm32-unknown-unknown --release 2>&1 | head -20
        cd ../../identity-score/identity-score  
        cargo build --target wasm32-unknown-unknown --release 2>&1 | head -20
        cd ../../dashboard/dashboard
        cargo build --target wasm32-unknown-unknown --release 2>&1 | head -20
        cd ../../..
        echo ''
        echo '🚀 Deploying contracts...'
        echo 'This may take a few minutes...'
        echo ''
        linera publish-and-create chains/price-feed/price-feed/target/wasm32-unknown-unknown/release/price_feed_contract.wasm || echo 'Price-feed deployment issue'
        linera publish-and-create chains/identity-score/identity-score/target/wasm32-unknown-unknown/release/identity_score_contract.wasm || echo 'Identity-score deployment issue'
        linera publish-and-create chains/dashboard/dashboard/target/wasm32-unknown-unknown/release/dashboard_contract.wasm || echo 'Dashboard deployment issue'
        echo ''
        echo '✅ Deployment process completed!'
        echo ''
        echo 'Press Ctrl+C to exit or keep container running'
        echo 'Linera GraphQL: http://localhost:8080/graphql'
        tail -f /dev/null
    "

Write-Host ""
Write-Host "Container stopped" -ForegroundColor Yellow


