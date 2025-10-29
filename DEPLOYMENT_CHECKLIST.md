# 🚀 SynapseNet Deployment Checklist

Use this checklist to ensure successful deployment of your Linera-integrated SynapseNet system.

---

## ✅ Pre-Deployment Checklist

### Prerequisites Installation

- [ ] **Rust 1.70+** installed
  ```bash
  rustc --version
  ```

- [ ] **wasm32-unknown-unknown** target added
  ```bash
  rustup target add wasm32-unknown-unknown
  ```

- [ ] **Linera CLI 0.15.4** installed
  ```bash
  linera --version
  ```

- [ ] **Node.js 18+** installed
  ```bash
  node --version
  ```

- [ ] **npm** installed
  ```bash
  npm --version
  ```

- [ ] **Docker** installed (optional)
  ```bash
  docker --version
  ```

### Project Setup

- [ ] Repository cloned
  ```bash
  git clone https://github.com/ayushsaklani-min/synapsenet.git
  cd synapsenet
  ```

- [ ] Backend dependencies installed
  ```bash
  cd synapsenet-backend/services
  npm install
  ```

- [ ] Frontend dependencies installed
  ```bash
  cd synapsenet-frontend
  npm install
  ```

- [ ] Scripts are executable
  ```bash
  chmod +x scripts/*.sh
  ```

### Network Connectivity

- [ ] Polygon Amoy RPC accessible
  ```bash
  curl -s https://rpc-amoy.polygon.technology
  ```

- [ ] Ethereum Sepolia RPC accessible
  ```bash
  curl -s https://ethereum-sepolia.publicnode.com
  ```

---

## 🔧 Deployment Steps

### Step 1: Verify Setup

- [ ] Run verification script
  ```bash
  ./scripts/verify-setup.sh
  ```

- [ ] All checks passed ✅
- [ ] No critical errors ❌

### Step 2: Deploy Linera Applications

- [ ] Run deployment script
  ```bash
  ./scripts/deploy-linera-apps.sh
  ```

- [ ] Price Feed application deployed ✅
- [ ] Identity Score application deployed ✅
- [ ] Dashboard application deployed ✅
- [ ] Configuration saved to `.linera/app-ids.json` ✅

**Expected Output:**
```
✅ All applications deployed successfully!

📋 Application IDs:
   Price Feed:      e476187f...
   Identity Score:  e476187f...
   Dashboard:       e476187f...
```

### Step 3: Start Services

- [ ] Run full stack startup script
  ```bash
  ./scripts/start-full-stack.sh
  ```

- [ ] Linera service started ✅
- [ ] Chainlink listener started ✅
- [ ] Frontend started ✅
- [ ] All services configured ✅

**Expected Output:**
```
✅ All services started successfully!

🌐 Access points:
   Frontend:        http://localhost:5173
   Linera GraphQL:  http://localhost:8080/graphql
   Chainlink API:   http://localhost:3001
   WebSocket:       ws://localhost:8090
```

---

## 🧪 Post-Deployment Verification

### Service Health Checks

- [ ] **Linera service** responding
  ```bash
  curl http://localhost:8080/
  ```
  Expected: HTTP 200 OK

- [ ] **Chainlink listener** healthy
  ```bash
  curl http://localhost:3001/health
  ```
  Expected: `{"status":"ok","chainlink":true,"linera":true}`

- [ ] **Frontend** accessible
  ```bash
  curl http://localhost:5173/
  ```
  Expected: HTTP 200 OK

### Functional Tests

- [ ] **GraphQL API** working
  ```bash
  curl -X POST http://localhost:8080/graphql \
    -H "Content-Type: application/json" \
    -d '{"query": "{ price(token: \"ETH\") { price } }"}'
  ```
  Expected: Price data returned

- [ ] **WebSocket** connected
  ```bash
  wscat -c ws://localhost:8090
  ```
  Expected: Connection established, messages received

- [ ] **Frontend dashboard** displaying data
  - Open http://localhost:5173
  - Expected: Live price charts, score updates, connection status "Connected"

### Data Flow Verification

- [ ] **Chainlink → Linera** working
  - Check Chainlink listener logs for "→ Linera" messages
  - Expected: Price updates sent to Linera every second

- [ ] **Linera → WebSocket** working
  - Monitor WebSocket messages in browser DevTools
  - Expected: Real-time price and score updates

- [ ] **WebSocket → Frontend** working
  - Observe live chart updates
  - Expected: Charts update every 1-3 seconds

### Performance Checks

- [ ] **Latency < 200ms**
  - Check Chainlink listener logs for latency values
  - Expected: Most updates < 200ms

- [ ] **Price updates** every 1 second
  - Monitor frontend or logs
  - Expected: Consistent 1-second intervals

- [ ] **Score updates** every 3 seconds
  - Monitor frontend or logs
  - Expected: Consistent 3-second intervals

---

## 📊 Monitoring Setup

### Log Monitoring

- [ ] **Linera logs** accessible
  ```bash
  tail -f ~/.config/linera/linera.log
  ```

- [ ] **Chainlink listener** logs visible
  - Check terminal output
  - Look for price and score updates

- [ ] **Frontend** console clean
  - Open browser DevTools
  - Check for errors in console

### Metrics Collection

- [ ] **Application IDs** recorded
  - Location: `.linera/app-ids.json`
  - Contains: priceFeedAppId, identityScoreAppId, dashboardAppId

- [ ] **Service endpoints** documented
  - Frontend: http://localhost:5173
  - Linera: http://localhost:8080
  - API: http://localhost:3001
  - WebSocket: ws://localhost:8090

---

## 🐛 Troubleshooting Checklist

### If Linera Service Fails

- [ ] Check if wallet exists
  ```bash
  ls -la ~/.config/linera/wallet.json
  ```

- [ ] Reinitialize if needed
  ```bash
  linera net up --testing-prng-seed 37
  ```

- [ ] Check port availability
  ```bash
  lsof -i :8080  # Linux/Mac
  netstat -ano | findstr :8080  # Windows
  ```

### If Chainlink Listener Fails

- [ ] Check Linera service is running
  ```bash
  curl http://localhost:8080/
  ```

- [ ] Verify environment variables
  ```bash
  echo $ENABLE_LINERA
  echo $LINERA_RPC
  ```

- [ ] Check application IDs configured
  ```bash
  cat .linera/app-ids.json
  ```

### If Frontend Fails

- [ ] Check dependencies installed
  ```bash
  cd synapsenet-frontend
  ls node_modules/
  ```

- [ ] Verify WebSocket connection
  - Open browser DevTools → Network → WS
  - Look for ws://localhost:8090 connection

- [ ] Check environment variables
  ```bash
  cat synapsenet-frontend/.env
  ```

### If Data Not Flowing

- [ ] Verify all services running
  ```bash
  ps aux | grep linera
  ps aux | grep node
  ps aux | grep vite
  ```

- [ ] Check application IDs match
  - Compare `.linera/app-ids.json` with Chainlink listener config

- [ ] Test GraphQL manually
  ```bash
  curl -X POST http://localhost:8080/graphql \
    -H "Content-Type: application/json" \
    -d '{"query": "{ allPrices { token price } }"}'
  ```

---

## 🔄 Restart Procedures

### Restart Single Service

**Linera:**
```bash
pkill linera
linera service --port 8080
```

**Chainlink Listener:**
```bash
pkill -f chainlink_listener
cd synapsenet-backend/services
export ENABLE_LINERA=true
node chainlink_listener_linera.js
```

**Frontend:**
```bash
pkill -f vite
cd synapsenet-frontend
npm run dev
```

### Restart All Services

```bash
# Stop all
pkill linera
pkill node
pkill vite

# Start all
./scripts/start-full-stack.sh
```

### Complete Reset

```bash
# Stop all services
pkill linera
pkill node
pkill vite

# Clean Linera data
rm -rf ~/.config/linera

# Redeploy
linera net up --testing-prng-seed 37
./scripts/deploy-linera-apps.sh
./scripts/start-full-stack.sh
```

---

## 📝 Configuration Checklist

### Environment Variables Set

- [ ] `POLYGON_AMOY_RPC` configured
- [ ] `SEPOLIA_RPC` configured
- [ ] `LINERA_RPC` configured
- [ ] `ENABLE_LINERA=true` set
- [ ] `PORT=3001` set
- [ ] `WS_PORT=8090` set

### Application IDs Configured

- [ ] `.linera/app-ids.json` exists
- [ ] Contains valid application IDs
- [ ] Chainlink listener configured with IDs
  ```bash
  curl -X POST http://localhost:3001/linera/config \
    -H "Content-Type: application/json" \
    -d @.linera/app-ids.json
  ```

### Ports Available

- [ ] Port 8080 (Linera) free
- [ ] Port 3001 (Chainlink API) free
- [ ] Port 8090 (WebSocket) free
- [ ] Port 5173 (Frontend) free

---

## ✅ Success Criteria

### All Green Checks

- [ ] ✅ All prerequisites installed
- [ ] ✅ All applications deployed
- [ ] ✅ All services running
- [ ] ✅ All health checks passing
- [ ] ✅ Data flowing end-to-end
- [ ] ✅ Frontend displaying live data
- [ ] ✅ Latency < 200ms
- [ ] ✅ No errors in logs

### Visual Confirmation

- [ ] Frontend shows "Connected" status
- [ ] Price chart updating every second
- [ ] Score updates every 3 seconds
- [ ] Statistics cards showing data
- [ ] Event feed scrolling with new events
- [ ] No error messages in UI

### Performance Confirmation

- [ ] Average latency < 200ms
- [ ] Price updates consistent
- [ ] Score updates consistent
- [ ] No dropped connections
- [ ] Smooth UI animations

---

## 🎉 Deployment Complete!

If all items are checked ✅, your SynapseNet Linera integration is successfully deployed and operational!

### Next Steps

1. **Explore the Dashboard**: http://localhost:5173
2. **Test GraphQL API**: http://localhost:8080/graphql
3. **Monitor Logs**: Watch for any errors or warnings
4. **Read Documentation**: Review `docs/linera_integration.md`
5. **Customize**: Modify applications to fit your needs

### Support

- Documentation: `docs/` directory
- Commands: `docs/COMMANDS.md`
- Troubleshooting: `docs/linera_integration.md#troubleshooting`

---

**Congratulations! 🎊 Your real-time decentralized data mesh is now live!**
