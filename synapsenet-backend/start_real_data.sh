#!/bin/bash

echo "🚀 Starting SynapseNet with Real Chainlink Data..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if cargo is installed
if ! command -v cargo &> /dev/null; then
    print_error "Cargo is not installed. Please install Rust first."
    exit 1
fi

print_status "Installing Chainlink listener dependencies..."
cd services
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install Node.js dependencies"
        exit 1
    fi
    print_success "Node.js dependencies installed"
else
    print_success "Node.js dependencies already installed"
fi

print_status "Building Rust backend..."
cd ../sdk
cargo build --release
if [ $? -ne 0 ]; then
    print_error "Failed to build Rust backend"
    exit 1
fi
print_success "Rust backend built successfully"

print_status "Starting Chainlink listener service..."
cd ../services
node chainlink_listener.js &
CHAINLINK_PID=$!
print_success "Chainlink listener started (PID: $CHAINLINK_PID)"

# Wait a moment for the WebSocket server to start
sleep 3

print_status "Starting Linera backend..."
cd ../sdk
cargo run --release &
LINERA_PID=$!
print_success "Linera backend started (PID: $LINERA_PID)"

# Wait a moment for the backend to start
sleep 3

print_status "Starting frontend development server..."
cd ../../synapsenet-frontend
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
fi

npm run dev &
FRONTEND_PID=$!
print_success "Frontend development server started (PID: $FRONTEND_PID)"

echo ""
echo "=================================================="
print_success "✅ SynapseNet is live with real Chainlink data!"
echo "=================================================="
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔗 Backend WebSocket: ws://localhost:8081"
echo "📊 Chainlink Oracle: Polygon Amoy Testnet"
echo "💰 Monitoring: ETH/USD Price Feed"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    print_status "Shutting down all services..."
    kill $CHAINLINK_PID 2>/dev/null
    kill $LINERA_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for any process to exit
wait
