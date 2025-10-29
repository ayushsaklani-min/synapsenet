#!/bin/bash

# SynapseNet Setup Verification Script
# Checks if all prerequisites are installed and configured correctly

echo "🔍 SynapseNet Setup Verification"
echo "================================="
echo ""

ERRORS=0
WARNINGS=0

# Check Rust
echo "📦 Checking Rust..."
if command -v rustc &> /dev/null; then
    RUST_VERSION=$(rustc --version | awk '{print $2}')
    echo "   ✅ Rust installed: $RUST_VERSION"
    
    # Check wasm32 target
    if rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
        echo "   ✅ wasm32-unknown-unknown target installed"
    else
        echo "   ❌ wasm32-unknown-unknown target not installed"
        echo "      Run: rustup target add wasm32-unknown-unknown"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "   ❌ Rust not found"
    echo "      Install from: https://rustup.rs/"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check Linera
echo "🔗 Checking Linera..."
if command -v linera &> /dev/null; then
    LINERA_VERSION=$(linera --version 2>&1 | head -n 1)
    echo "   ✅ Linera installed: $LINERA_VERSION"
    
    # Check if wallet exists
    if [ -f "$HOME/.config/linera/wallet.json" ]; then
        echo "   ✅ Linera wallet found"
    else
        echo "   ⚠️  Linera wallet not initialized"
        echo "      Will be created during deployment"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "   ❌ Linera not found"
    echo "      Run: cargo install linera-service --version 0.15.4"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js installed: $NODE_VERSION"
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        echo "   ✅ npm installed: $NPM_VERSION"
    else
        echo "   ❌ npm not found"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "   ❌ Node.js not found"
    echo "      Install from: https://nodejs.org/"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check Docker (optional)
echo "🐳 Checking Docker (optional)..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | tr -d ',')
    echo "   ✅ Docker installed: $DOCKER_VERSION"
    
    # Check if Docker is running
    if docker ps &> /dev/null; then
        echo "   ✅ Docker daemon is running"
    else
        echo "   ⚠️  Docker daemon not running"
        echo "      Start Docker Desktop or run: sudo systemctl start docker"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "   ⚠️  Docker not found (optional for containerized deployment)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check network connectivity
echo "🌐 Checking network connectivity..."
if curl -s --max-time 5 https://rpc-amoy.polygon.technology &> /dev/null; then
    echo "   ✅ Polygon Amoy RPC accessible"
else
    echo "   ⚠️  Cannot reach Polygon Amoy RPC"
    echo "      Check your internet connection"
    WARNINGS=$((WARNINGS + 1))
fi

if curl -s --max-time 5 https://ethereum-sepolia.publicnode.com &> /dev/null; then
    echo "   ✅ Ethereum Sepolia RPC accessible"
else
    echo "   ⚠️  Cannot reach Ethereum Sepolia RPC"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check project structure
echo "📁 Checking project structure..."
REQUIRED_DIRS=(
    "synapsenet-backend/chains/price-feed"
    "synapsenet-backend/chains/identity-score"
    "synapsenet-backend/chains/dashboard"
    "synapsenet-backend/services"
    "synapsenet-frontend"
    "scripts"
    "docs"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "   ✅ $dir"
    else
        echo "   ❌ $dir not found"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if [ -d "synapsenet-backend/services/node_modules" ]; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ⚠️  Backend dependencies not installed"
    echo "      Run: cd synapsenet-backend/services && npm install"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "synapsenet-frontend/node_modules" ]; then
    echo "   ✅ Frontend dependencies installed"
else
    echo "   ⚠️  Frontend dependencies not installed"
    echo "      Run: cd synapsenet-frontend && npm install"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Summary
echo "================================="
echo "📊 Verification Summary"
echo "================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed! You're ready to deploy SynapseNet."
    echo ""
    echo "Next steps:"
    echo "   1. ./scripts/deploy-linera-apps.sh"
    echo "   2. ./scripts/start-full-stack.sh"
    echo "   3. Open http://localhost:5173"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  Setup complete with $WARNINGS warning(s)"
    echo "   You can proceed, but some features may not work optimally."
    echo ""
    echo "Next steps:"
    echo "   1. ./scripts/deploy-linera-apps.sh"
    echo "   2. ./scripts/start-full-stack.sh"
    exit 0
else
    echo "❌ Setup incomplete: $ERRORS error(s), $WARNINGS warning(s)"
    echo "   Please fix the errors above before proceeding."
    exit 1
fi
