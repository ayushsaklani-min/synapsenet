

set -e

echo "🚀 SynapseNet Linera Deployment"
echo "================================"

# Check if Linera is installed
if ! command -v linera &> /dev/null; then
    echo "❌ Linera CLI not found. Please install Linera first."
    exit 1
fi

echo "✅ Linera CLI found: $(linera --version)"

# Set up environment
export LINERA_WALLET="${LINERA_WALLET:-$HOME/.config/linera/wallet.json}"
export LINERA_STORAGE="${LINERA_STORAGE:-rocksdb:$HOME/.config/linera/client.db}"

echo ""
echo "📁 Configuration:"
echo "   Wallet: $LINERA_WALLET"
echo "   Storage: $LINERA_STORAGE"

# Initialize local network if needed
if [ ! -f "$LINERA_WALLET" ]; then
    echo ""
    echo "🔧 Initializing Linera local network..."
    linera net up --testing-prng-seed 37
    echo "✅ Local network initialized"
fi

# Get default chain
DEFAULT_CHAIN=$(linera wallet show | grep "Default chain" | awk '{print $3}')
echo ""
echo "🔗 Default chain: $DEFAULT_CHAIN"

# Build and deploy Price Feed application
echo ""
echo "📦 Building Price Feed application..."
cd synapsenet-backend/chains/price-feed/price-feed
cargo build --release --target wasm32-unknown-unknown

echo "🚀 Publishing Price Feed application..."
PRICE_FEED_BYTECODE_ID=$(linera publish-bytecode \
    target/wasm32-unknown-unknown/release/price_feed_contract.wasm \
    target/wasm32-unknown-unknown/release/price_feed_service.wasm \
    | grep "Bytecode ID" | awk '{print $3}')

echo "📝 Creating Price Feed application..."
PRICE_FEED_APP_ID=$(linera create-application $PRICE_FEED_BYTECODE_ID \
    | grep "Application ID" | awk '{print $3}')

echo "✅ Price Feed deployed: $PRICE_FEED_APP_ID"

# Build and deploy Identity Score application
echo ""
echo "📦 Building Identity Score application..."
cd ../../../identity-score/identity-score
cargo build --release --target wasm32-unknown-unknown

echo "🚀 Publishing Identity Score application..."
IDENTITY_SCORE_BYTECODE_ID=$(linera publish-bytecode \
    target/wasm32-unknown-unknown/release/identity_score_contract.wasm \
    target/wasm32-unknown-unknown/release/identity_score_service.wasm \
    | grep "Bytecode ID" | awk '{print $3}')

echo "📝 Creating Identity Score application..."
IDENTITY_SCORE_APP_ID=$(linera create-application $IDENTITY_SCORE_BYTECODE_ID \
    | grep "Application ID" | awk '{print $3}')

echo "✅ Identity Score deployed: $IDENTITY_SCORE_APP_ID"

# Build and deploy Dashboard application
echo ""
echo "📦 Building Dashboard application..."
cd ../../../dashboard/dashboard
cargo build --release --target wasm32-unknown-unknown

echo "🚀 Publishing Dashboard application..."
DASHBOARD_BYTECODE_ID=$(linera publish-bytecode \
    target/wasm32-unknown-unknown/release/dashboard_contract.wasm \
    target/wasm32-unknown-unknown/release/dashboard_service.wasm \
    | grep "Bytecode ID" | awk '{print $3}')

echo "📝 Creating Dashboard application..."
DASHBOARD_APP_ID=$(linera create-application $DASHBOARD_BYTECODE_ID \
    | grep "Application ID" | awk '{print $3}')

echo "✅ Dashboard deployed: $DASHBOARD_APP_ID"

# Save application IDs to config file
cd ../../../../..
mkdir -p .linera
cat > .linera/app-ids.json << EOF
{
  "priceFeedAppId": "$PRICE_FEED_APP_ID",
  "identityScoreAppId": "$IDENTITY_SCORE_APP_ID",
  "dashboardAppId": "$DASHBOARD_APP_ID",
  "defaultChain": "$DEFAULT_CHAIN",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo ""
echo "✅ All applications deployed successfully!"
echo ""
echo "📋 Application IDs:"
echo "   Price Feed:      $PRICE_FEED_APP_ID"
echo "   Identity Score:  $IDENTITY_SCORE_APP_ID"
echo "   Dashboard:       $DASHBOARD_APP_ID"
echo ""
echo "💾 Configuration saved to: .linera/app-ids.json"
echo ""
echo "🔗 Next steps:"
echo "   1. Start Linera service: linera service --port 8080"
echo "   2. Configure Chainlink listener with these app IDs"
echo "   3. Start the frontend"
