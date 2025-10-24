#!/bin/bash

# SynapseNet 2.0 - Complete Startup Script
# This script starts all services for real blockchain data

echo "🚀 Starting SynapseNet 2.0 with Real Blockchain Data"
echo "================================================="

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js version: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check if Rust is installed
if command -v rustc &> /dev/null; then
    RUST_VERSION=$(rustc --version)
    echo "✅ Rust version: $RUST_VERSION"
else
    echo "❌ Rust not found. Please install Rust 1.70+"
    exit 1
fi

echo ""
echo "🔧 Setting up backend services..."

# Start Chainlink Listener
echo "📡 Starting Chainlink Oracle Listener..."
cd synapsenet-backend/services
npm install
node chainlink_listener.js &
CHAINLINK_PID=$!

# Wait a moment for the listener to start
sleep 3

# Start Linera Backend
echo "⚡ Starting Linera Backend..."
cd ../sdk
cargo run --release &
LINERA_PID=$!

# Wait for backend to initialize
sleep 5

echo ""
echo "🎨 Setting up frontend..."

# Start Frontend
echo "🌐 Starting React Frontend..."
cd ../../synapsenet-frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo "================================================="
echo "🌐 Frontend: http://localhost:5173"
echo "📡 WebSocket: ws://localhost:8090"
echo "🔗 Chainlink Oracle: Polygon Amoy Testnet"
echo ""
echo "📊 Real ETH/USD prices will be displayed in the dashboard"
echo "⏳ Please wait for the services to fully initialize..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $CHAINLINK_PID $LINERA_PID $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep the script running
echo ""
echo "Press Ctrl+C to stop all services..."
wait
