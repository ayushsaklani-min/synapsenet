# SynapseNet Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check

```bash
# Check Rust
rustc --version  # Should be 1.70+

# Check Linera
linera --version  # Should be 0.15.4

# Check Node.js
node --version  # Should be 18+
```

### Step 1: Deploy Linera Applications (2 minutes)

```bash
cd synapsenet
chmod +x scripts/deploy-linera-apps.sh
./scripts/deploy-linera-apps.sh
```

**Expected Output**:
```
✅ All applications deployed successfully!

📋 Application IDs:
   Price Feed:      e476187f...
   Identity Score:  e476187f...
   Dashboard:       e476187f...
```

### Step 2: Start All Services (1 minute)

```bash
chmod +x scripts/start-full-stack.sh
./scripts/start-full-stack.sh
```

**Expected Output**:
```
✅ All services started successfully!

🌐 Access points:
   Frontend:        http://localhost:5173
   Linera GraphQL:  http://localhost:8080/graphql
   Chainlink API:   http://localhost:3001
   WebSocket:       ws://localhost:8090
```

### Step 3: View Dashboard (30 seconds)

Open your browser to: **http://localhost:5173**

You should see:
- ✅ Real-time ETH/USD prices updating every second
- ✅ Live identity score updates
- ✅ Animated charts and statistics
- ✅ Connection status indicators

### Step 4: Verify Linera Integration (1 minute)

Test the GraphQL endpoint:

```bash
# Get current price
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ price(token: \"ETH\") { price timestamp } }"
  }'
```

**Expected Response**:
```json
{
  "data": {
    "price": {
      "price": 2500.50,
      "timestamp": 1698600000000000
    }
  }
}
```

## 🎯 What's Happening?

1. **Chainlink Oracle** fetches real ETH/USD prices from Polygon Amoy testnet
2. **Chainlink Listener** sends data to Linera microchains via GraphQL
3. **Linera Microchains** store and process the data with sub-100ms latency
4. **WebSocket Server** broadcasts updates to connected clients
5. **React Frontend** displays real-time visualizations

## 🔧 Common Commands

### Check Service Status

```bash
# Chainlink listener health
curl http://localhost:3001/health

# Linera service
curl http://localhost:8080/

# View logs
tail -f ~/.config/linera/linera.log
```

### Stop Services

Press `Ctrl+C` in the terminal running `start-full-stack.sh`

Or manually:
```bash
pkill linera
pkill node
pkill vite
```

### Restart Services

```bash
./scripts/start-full-stack.sh
```

### Redeploy Applications

```bash
./scripts/deploy-linera-apps.sh
./scripts/start-full-stack.sh
```

## 🐛 Troubleshooting

### "Linera CLI not found"

```bash
cargo install linera-service --version 0.15.4
```

### "Application IDs not found"

```bash
./scripts/deploy-linera-apps.sh
```

### "Port already in use"

```bash
# Kill existing processes
pkill linera
pkill node
pkill vite

# Try again
./scripts/start-full-stack.sh
```

### "WebSocket connection failed"

Check if services are running:
```bash
curl http://localhost:3001/health
curl http://localhost:8080/
```

## 📊 Performance Expectations

- **Price Updates**: Every 1 second
- **Score Updates**: Every 3 seconds
- **End-to-End Latency**: < 200ms
- **WebSocket Latency**: < 50ms
- **Linera Processing**: < 100ms

## 🎓 Next Steps

1. **Explore GraphQL API**: http://localhost:8080/graphql
2. **Read Full Documentation**: `docs/linera_integration.md`
3. **Customize Applications**: Edit files in `synapsenet-backend/chains/`
4. **Add Your Own Data Sources**: Modify `chainlink_listener_linera.js`

## 💡 Tips

- Use `RUST_LOG=debug` for detailed Linera logs
- Monitor WebSocket connections in browser DevTools
- Check `.linera/app-ids.json` for deployed application IDs
- Use GraphQL Playground at http://localhost:8080/graphql for testing

## 🆘 Need Help?

- Check `docs/linera_integration.md` for detailed documentation
- Review error logs in terminal output
- Ensure all prerequisites are installed correctly
- Verify network connectivity to Polygon Amoy testnet

---

**Congratulations! 🎉** You now have a fully functional real-time decentralized data mesh running with Linera microchains!
