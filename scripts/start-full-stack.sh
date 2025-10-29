#!/bin/bash

# SynapseNet Full Stack Startup Script
# Starts Linera service, Chainlink listener, and frontend

set -e

echo "🚀 Starting SynapseNet Full Stack"
echo "=================================="

# Check if app IDs exist
if [ ! -f ".linera/app-ids.json" ]; then
    echo "❌ Application IDs not found. Please run deploy-linera-apps.sh first."
    exit 1
fi

# Load application IDs
PRICE_FEED_APP_ID=$(cat .linera/app-ids.json | grep priceFeedAppId | cut -d'"' -f4)
IDENTITY_SCORE_APP_ID=$(cat .linera/app-ids.json | grep identityScoreAppId | cut -d'"' -f4)
DASHBOARD_APP_ID=$(cat .linera/app-ids.json | grep dashboardAppId | cut -d'"' -f4)

echo "📋 Loaded Application IDs:"
echo "   Price Feed:      $PRICE_FEED_APP_ID"
echo "   Identity Score:  $IDENTITY_SCORE_APP_ID"
echo "   Dashboard:       $DASHBOARD_APP_ID"
echo ""

# Start Linera service
echo "🔗 Starting Linera service..."
linera service --port 8080 &
LINERA_PID=$!
echo "✅ Linera service started (PID: $LINERA_PID)"

# Wait for Linera to be ready
echo "⏳ Waiting for Linera service to be ready..."
sleep 5

# Check if Linera is responding
if curl -s http://localhost:8080/ > /dev/null; then
    echo "✅ Linera service is ready"
else
    echo "❌ Linera service failed to start"
    kill $LINERA_PID 2>/dev/null
    exit 1
fi

# Start Chainlink listener with Linera integration
echo ""
echo "📡 Starting Chainlink listener with Linera integration..."
cd synapsenet-backend/services
npm install
export ENABLE_LINERA=true
export LINERA_RPC=http://localhost:8080
node chainlink_listener_linera.js &
CHAINLINK_PID=$!
echo "✅ Chainlink listener started (PID: $CHAINLINK_PID)"

# Wait for Chainlink listener to be ready
sleep 3

# Configure Chainlink listener with app IDs
echo ""
echo "⚙️  Configuring Chainlink listener with Linera app IDs..."
curl -X POST http://localhost:3001/linera/config \
    -H "Content-Type: application/json" \
    -d "{
        \"priceFeedAppId\": \"$PRICE_FEED_APP_ID\",
        \"identityScoreAppId\": \"$IDENTITY_SCORE_APP_ID\",
        \"dashboardAppId\": \"$DASHBOARD_APP_ID\"
    }"
echo ""
echo "✅ Chainlink listener configured"

# Start frontend
echo ""
echo "🎨 Starting frontend..."
cd ../../synapsenet-frontend
npm install
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "✅ All services started successfully!"
echo ""
echo "🌐 Access points:"
echo "   Frontend:        http://localhost:5173"
echo "   Linera GraphQL:  http://localhost:8080/graphql"
echo "   Chainlink API:   http://localhost:3001"
echo "   WebSocket:       ws://localhost:8090"
echo ""
echo "📊 Data flow:"
echo "   Chainlink Oracle → Linera Microchains → WebSocket → Frontend"
echo ""
echo "Press Ctrl+C to stop all services..."

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $LINERA_PID $CHAINLINK_PID $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait
