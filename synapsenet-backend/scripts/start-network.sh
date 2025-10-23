#!/bin/bash

echo "🌐 Starting Linera Network for SynapseNet..."

# Start Linera network
linera net up

echo "✅ Linera network started!"
echo "🔗 GraphQL endpoint: http://localhost:8080/graphql"
echo "📊 Network status: READY"
echo ""
echo "Next steps:"
echo "1. Run ./scripts/deploy.sh to deploy contracts"
echo "2. Run ./scripts/run-demo.sh to test the system"
