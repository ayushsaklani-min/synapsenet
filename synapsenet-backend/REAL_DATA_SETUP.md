# SynapseNet Real Data Setup

This document explains how to run SynapseNet with real blockchain data from Chainlink oracles.

## 🚀 Quick Start

### Windows (PowerShell)
```powershell
cd synapsenet-backend
.\start_real_data.ps1
```

### Linux/macOS (Bash)
```bash
cd synapsenet-backend
chmod +x start_real_data.sh
./start_real_data.sh
```

## 📊 What's Different

### Real Data Sources
- **Chainlink Oracle**: ETH/USD price feed on Polygon Amoy testnet
- **Contract Address**: `0x9b8E6d8b2417116F4fF9bC4e9b9f91A8a7D2f8E5`
- **Network**: Polygon Amoy Testnet
- **Update Frequency**: Every 5 seconds

### Architecture
```
Chainlink Oracle (Polygon Amoy) 
    ↓ (Real ETH/USD prices)
Chainlink Listener Service (Node.js)
    ↓ (WebSocket)
Linera Backend (Rust)
    ↓ (Microchain events)
Frontend Dashboard (React)
```

## 🔧 Services

### 1. Chainlink Listener (`services/chainlink_listener.js`)
- Connects to Polygon Amoy RPC
- Fetches real ETH/USD prices from Chainlink oracle
- Broadcasts via WebSocket to frontend and backend
- Auto-reconnects on network issues

### 2. Linera Backend (`sdk/`)
- Receives real data via WebSocket
- Publishes to Linera microchain
- Handles event subscriptions

### 3. Frontend Dashboard (`synapsenet-frontend/`)
- Displays real-time ETH/USD prices
- Shows live blockchain events
- Professional UI with real data indicators

## 🌐 Endpoints

- **Frontend**: http://localhost:5173
- **WebSocket**: ws://localhost:8081
- **Chainlink Oracle**: Polygon Amoy Testnet

## 📈 Features

- ✅ Real ETH/USD prices from Chainlink
- ✅ Live blockchain event stream
- ✅ Sub-200ms latency tracking
- ✅ Auto-reconnection on failures
- ✅ Professional dashboard UI
- ✅ Zero mock data

## 🛠️ Manual Setup

If you prefer to start services manually:

1. **Start Chainlink Listener**:
   ```bash
   cd services
   npm install
   node chainlink_listener.js
   ```

2. **Start Linera Backend**:
   ```bash
   cd sdk
   cargo run --release
   ```

3. **Start Frontend**:
   ```bash
   cd ../../synapsenet-frontend
   npm install
   npm run dev
   ```

## 🔍 Monitoring

The dashboard shows:
- Live ETH/USD price chart
- Real-time event count
- Network latency
- Connection status
- Data source indicators

## 🚨 Troubleshooting

### No Data Appearing
1. Check if Chainlink listener is running
2. Verify Polygon Amoy RPC connection
3. Check WebSocket connection (ws://localhost:8081)

### High Latency
1. Check network connection
2. Verify RPC endpoint is responsive
3. Check for rate limiting

### Connection Issues
- Services auto-reconnect on failures
- Check firewall settings for port 8081
- Verify all dependencies are installed

## 📝 Notes

- All mock data has been removed
- Real blockchain data only
- Professional production-ready UI
- Fully automated setup
