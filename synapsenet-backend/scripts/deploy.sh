#!/bin/bash

echo "🚀 Deploying SynapseNet Contracts to Linera Network..."

# Set environment variables for Linera
export LINERA_WALLET="/tmp/linera-net/wallet_0.json"
export LINERA_KEYSTORE="/tmp/linera-net/keystore_0.json"
export LINERA_STORAGE="rocksdb:/tmp/linera-net/client_0.db"

# Build all contracts
echo "📦 Building contracts..."

# Build price-feed contract
echo "Building price-feed contract..."
cd chains/price-feed/price-feed
cargo build --target wasm32-unknown-unknown --release
cd ../../..

# Build identity-score contract
echo "Building identity-score contract..."
cd chains/identity-score/identity-score
cargo build --target wasm32-unknown-unknown --release
cd ../../..

# Build dashboard contract
echo "Building dashboard contract..."
cd chains/dashboard/dashboard
cargo build --target wasm32-unknown-unknown --release
cd ../../..

# Deploy contracts to Linera network
echo "🚀 Deploying contracts..."

# Deploy price-feed
echo "Deploying price-feed contract..."
linera publish-and-create chains/price-feed/price-feed/target/wasm32-unknown-unknown/release/price_feed_contract.wasm

# Deploy identity-score
echo "Deploying identity-score contract..."
linera publish-and-create chains/identity-score/identity-score/target/wasm32-unknown-unknown/release/identity_score_contract.wasm

# Deploy dashboard
echo "Deploying dashboard contract..."
linera publish-and-create chains/dashboard/dashboard/target/wasm32-unknown-unknown/release/dashboard_contract.wasm

echo "✅ All contracts deployed successfully!"
echo "🌐 Linera GraphQL endpoint: http://localhost:8080/graphql"
echo "📊 Check your contracts in the Linera explorer"
