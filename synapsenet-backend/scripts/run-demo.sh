#!/bin/bash

echo "🎮 Running SynapseNet Demo..."

# Build and run the SDK demo
cd sdk
cargo run

echo "✅ Demo completed!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔗 Backend: http://localhost:8080/graphql"
