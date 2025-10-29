# SynapseNet Command Reference

Quick reference for all SynapseNet commands.

## 🚀 Setup & Deployment

### Verify Prerequisites
```bash
./scripts/verify-setup.sh
```

### Deploy Linera Applications
```bash
# Linux/Mac
./scripts/deploy-linera-apps.sh

# Windows
.\scripts\deploy-linera-apps.ps1
```

### Start Full Stack
```bash
./scripts/start-full-stack.sh
```

### Docker Deployment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## 🔧 Service Management

### Linera Service
```bash
# Start Linera service
linera service --port 8080

# Start with debug logging
RUST_LOG=debug linera service --port 8080

# Initialize local network
linera net up --testing-prng-seed 37

# Show wallet info
linera wallet show

# Query chain state
linera query-balance
```

### Chainlink Listener
```bash
# Start with Linera integration
cd synapsenet-backend/services
export ENABLE_LINERA=true
export LINERA_RPC=http://localhost:8080
node chainlink_listener_linera.js

# Start with debug logging
DEBUG=* node chainlink_listener_linera.js

# Configure app IDs
curl -X POST http://localhost:3001/linera/config \
  -H "Content-Type: application/json" \
  -d @../../.linera/app-ids.json
```

### Frontend
```bash
# Development mode
cd synapsenet-frontend
npm run dev

# Production build
npm run build
npm run preview

# Lint code
npm run lint
```

## 📊 Testing & Monitoring

### Health Checks
```bash
# Chainlink listener
curl http://localhost:3001/health

# Linera service
curl http://localhost:8080/

# Frontend
curl http://localhost:5173/
```

### GraphQL Queries
```bash
# Get ETH price
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ price(token: \"ETH\") { price timestamp } }"}'

# Get all prices
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ allPrices { token price timestamp } }"}'

# Get user score
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ score(userId: \"user_0x1234\") { score successRate } }"}'

# Get aggregated data
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ aggregatedData { priceUpdates scoreUpdates lastPrice avgScore } }"}'
```

### WebSocket Testing
```bash
# Connect to WebSocket
wscat -c ws://localhost:8090

# Or using websocat
websocat ws://localhost:8090
```

## 🔨 Development

### Build Linera Applications
```bash
# Build all applications
cd synapsenet-backend/chains/price-feed/price-feed
cargo build --release --target wasm32-unknown-unknown

cd ../../identity-score/identity-score
cargo build --release --target wasm32-unknown-unknown

cd ../../dashboard/dashboard
cargo build --release --target wasm32-unknown-unknown
```

### Run Tests
```bash
# Test Linera applications
cd synapsenet-backend/chains/price-feed/price-feed
cargo test

# Test frontend
cd synapsenet-frontend
npm test
```

### Lint & Format
```bash
# Rust
cargo fmt
cargo clippy

# JavaScript/TypeScript
cd synapsenet-frontend
npm run lint
```

## 📦 Linera CLI Commands

### Application Management
```bash
# Publish bytecode
linera publish-bytecode contract.wasm service.wasm

# Create application
linera create-application <BYTECODE_ID>

# List applications
linera wallet show

# Query application state
linera query-application <APP_ID>
```

### Chain Management
```bash
# Create new chain
linera create-chain

# Transfer tokens
linera transfer <AMOUNT> <RECIPIENT>

# Query balance
linera query-balance
```

### Network Management
```bash
# Start local network
linera net up --testing-prng-seed 37

# Stop local network
linera net down

# Reset network
linera net down && linera net up --testing-prng-seed 37
```

## 🐛 Troubleshooting

### Reset Everything
```bash
# Stop all services
pkill linera
pkill node
pkill vite

# Clean Linera data
rm -rf ~/.config/linera

# Reinitialize
linera net up --testing-prng-seed 37
./scripts/deploy-linera-apps.sh
./scripts/start-full-stack.sh
```

### View Logs
```bash
# Linera logs
tail -f ~/.config/linera/linera.log

# Chainlink listener logs
cd synapsenet-backend/services
node chainlink_listener_linera.js 2>&1 | tee listener.log

# Docker logs
docker-compose logs -f linera-net
docker-compose logs -f chainlink-listener
docker-compose logs -f frontend
```

### Check Ports
```bash
# Linux/Mac
lsof -i :8080  # Linera
lsof -i :3001  # Chainlink API
lsof -i :8090  # WebSocket
lsof -i :5173  # Frontend

# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :3001
netstat -ano | findstr :8090
netstat -ano | findstr :5173
```

### Kill Processes
```bash
# Linux/Mac
pkill -f linera
pkill -f node
pkill -f vite

# Windows
taskkill /F /IM linera.exe
taskkill /F /IM node.exe
taskkill /F /IM vite.exe
```

## 🔐 Configuration

### Environment Variables
```bash
# Chainlink
export POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
export SEPOLIA_RPC=https://ethereum-sepolia.publicnode.com

# Linera
export LINERA_RPC=http://localhost:8080
export ENABLE_LINERA=true
export LINERA_WALLET=$HOME/.config/linera/wallet.json
export LINERA_STORAGE=rocksdb:$HOME/.config/linera/client.db

# Services
export PORT=3001
export WS_PORT=8090

# Logging
export RUST_LOG=info
export DEBUG=*
```

### Load from .env
```bash
# Create .env file
cp .env.example .env

# Load variables
export $(cat .env | xargs)

# Or use dotenv
npm install -g dotenv-cli
dotenv -- node chainlink_listener_linera.js
```

## 📈 Performance Tuning

### Increase Cache Timeout
```javascript
// In chainlink_listener_linera.js
this.cacheTimeout = 10000; // 10 seconds
```

### Adjust Update Intervals
```javascript
// Price updates
setInterval(fetchPrice, 2000); // 2 seconds

// Score updates
this.scoreUpdateInterval = 5000; // 5 seconds
```

### Optimize RPC Endpoints
```bash
# Use dedicated RPC providers
export POLYGON_AMOY_RPC=https://polygon-amoy.infura.io/v3/YOUR_KEY
export SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_KEY
```

## 🌐 URLs

### Local Development
- Frontend: http://localhost:5173
- Linera GraphQL: http://localhost:8080/graphql
- Chainlink API: http://localhost:3001
- WebSocket: ws://localhost:8090
- Health Check: http://localhost:3001/health

### Docker Deployment
- Frontend: http://localhost:5173
- Linera GraphQL: http://linera-net:8080/graphql (internal)
- Chainlink API: http://chainlink-listener:3001 (internal)

## 📚 Quick References

### GraphQL Playground
Open in browser: http://localhost:8080/graphql

### Application IDs
Stored in: `.linera/app-ids.json`

### Logs Location
- Linera: `~/.config/linera/linera.log`
- Chainlink: Console output
- Frontend: Browser console

### Configuration Files
- Docker: `docker-compose.yml`
- Environment: `.env`
- App IDs: `.linera/app-ids.json`
- Wallet: `~/.config/linera/wallet.json`

---

**Tip**: Bookmark this page for quick command reference!
