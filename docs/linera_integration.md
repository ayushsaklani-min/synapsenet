# SynapseNet Linera Integration Documentation

## Overview

SynapseNet is a real-time decentralized data mesh that integrates Chainlink oracles with Linera microchains to provide sub-200ms latency for blockchain data streaming to web dashboards.

## Architecture

```
┌─────────────────┐
│ Chainlink Oracle│
│  (Polygon Amoy) │
└────────┬────────┘
         │ ETH/USD Price Feed
         ▼
┌─────────────────────────┐
│ Chainlink Listener      │
│ (Node.js Service)       │
│ - Fetches oracle data   │
│ - Sends to Linera       │
│ - WebSocket broadcast   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Linera Microchains              │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │  Price Feed  │  │ Identity Score  │ │
│  │  Microchain  │  │   Microchain    │ │
│  └──────┬───────┘  └────────┬────────┘ │
│         │                   │          │
│         └───────┬───────────┘          │
│                 ▼                       │
│         ┌──────────────┐               │
│         │  Dashboard   │               │
│         │  Aggregator  │               │
│         └──────┬───────┘               │
└────────────────┼───────────────────────┘
                 │
                 ▼
         ┌──────────────┐
         │  WebSocket   │
         │   Server     │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ React Frontend│
         │  Dashboard    │
         └───────────────┘
```

## Components

### 1. Linera Microchain Applications

#### Price Feed Application
- **Purpose**: Receives and stores ETH/USD price data from Chainlink
- **Location**: `synapsenet-backend/chains/price-feed/`
- **Operations**:
  - `UpdatePrice`: Stores new price data with timestamp
- **Events**:
  - `PriceUpdated`: Emitted when price is updated
- **GraphQL Queries**:
  - `price(token: String)`: Get price for specific token
  - `allPrices()`: Get all stored prices
  - `lastUpdate()`: Get timestamp of last update

#### Identity Score Application
- **Purpose**: Tracks user reputation and transaction success rates
- **Location**: `synapsenet-backend/chains/identity-score/`
- **Operations**:
  - `UpdateScore`: Manually update user score
  - `RecordTransaction`: Record transaction and auto-calculate score
- **Events**:
  - `ScoreUpdated`: Emitted when score changes
  - `TransactionRecorded`: Emitted when transaction is recorded
- **GraphQL Queries**:
  - `score(userId: String)`: Get score for specific user
  - `allScores()`: Get all user scores
  - `transactionCount(userId: String)`: Get transaction count
  - `successRate(userId: String)`: Get success rate percentage

#### Dashboard Application
- **Purpose**: Aggregates data from other microchains for frontend consumption
- **Location**: `synapsenet-backend/chains/dashboard/`
- **Messages**:
  - `PriceUpdate`: Receives price updates
  - `ScoreUpdate`: Receives score updates
- **Events**:
  - `DataAggregated`: Emitted with combined statistics
- **GraphQL Queries**:
  - `aggregatedData()`: Get all aggregated statistics
  - `priceUpdateCount()`: Get total price updates
  - `scoreUpdateCount()`: Get total score updates

### 2. Chainlink Listener Service

Enhanced Node.js service that bridges Chainlink oracles with Linera microchains.

**Location**: `synapsenet-backend/services/chainlink_listener_linera.js`

**Features**:
- Fetches real-time ETH/USD prices from Chainlink on Polygon Amoy
- Sends price data to Linera Price Feed microchain
- Generates simulated identity scores and sends to Linera
- Broadcasts data via WebSocket for backward compatibility
- Automatic fallback to Ethereum Sepolia if primary feed fails
- Connection pooling and caching for optimal performance

**Environment Variables**:
```bash
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
SEPOLIA_RPC=https://ethereum-sepolia.publicnode.com
LINERA_RPC=http://localhost:8080
ENABLE_LINERA=true
PORT=3001
WS_PORT=8090
```

**API Endpoints**:
- `GET /health`: Health check with status information
- `POST /linera/config`: Configure Linera application IDs

### 3. Frontend Integration

The React frontend can consume data from either:
1. **WebSocket** (backward compatible): Direct real-time updates
2. **Linera GraphQL** (recommended): Query microchain state

**Environment Variables**:
```bash
VITE_WS_URL=ws://localhost:8090
VITE_LINERA_GRAPHQL=http://localhost:8080/graphql
```

## Installation & Setup

### Prerequisites

1. **Rust & Cargo** (1.70+)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup target add wasm32-unknown-unknown
   ```

2. **Linera CLI** (0.15.4)
   ```bash
   cargo install linera-service --version 0.15.4
   ```

3. **Node.js** (18+)
   ```bash
   # Install from https://nodejs.org/
   ```

4. **Docker** (optional, for containerized deployment)
   ```bash
   # Install from https://docker.com/
   ```

### Quick Start

#### Option 1: Manual Setup

1. **Deploy Linera Applications**
   ```bash
   cd synapsenet
   chmod +x scripts/deploy-linera-apps.sh
   ./scripts/deploy-linera-apps.sh
   ```

2. **Start Full Stack**
   ```bash
   chmod +x scripts/start-full-stack.sh
   ./scripts/start-full-stack.sh
   ```

3. **Access Dashboard**
   - Open http://localhost:5173 in your browser
   - View real-time Chainlink data flowing through Linera microchains

#### Option 2: Docker Compose

1. **Start All Services**
   ```bash
   docker-compose up -d
   ```

2. **Check Status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

3. **Stop Services**
   ```bash
   docker-compose down
   ```

## Configuration

### Linera Application IDs

After deployment, application IDs are saved to `.linera/app-ids.json`:

```json
{
  "priceFeedAppId": "e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000000000000e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65030000000000000000000000",
  "identityScoreAppId": "e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65020000000000000000000000e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65040000000000000000000000",
  "dashboardAppId": "e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65030000000000000000000000e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65050000000000000000000000",
  "defaultChain": "e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65",
  "deployedAt": "2025-10-29T18:00:00Z"
}
```

### Chainlink Listener Configuration

Configure the listener with Linera app IDs:

```bash
curl -X POST http://localhost:3001/linera/config \
  -H "Content-Type: application/json" \
  -d '{
    "priceFeedAppId": "YOUR_PRICE_FEED_APP_ID",
    "identityScoreAppId": "YOUR_IDENTITY_SCORE_APP_ID",
    "dashboardAppId": "YOUR_DASHBOARD_APP_ID"
  }'
```

## GraphQL API

### Price Feed Queries

```graphql
# Get specific token price
query {
  price(token: "ETH") {
    token
    price
    timestamp
    source
    network
  }
}

# Get all prices
query {
  allPrices {
    token
    price
    timestamp
    source
    network
  }
}

# Get last update timestamp
query {
  lastUpdate
  updateCount
}
```

### Identity Score Queries

```graphql
# Get user score
query {
  score(userId: "user_0x1234") {
    userId
    score
    timestamp
    reason
    transactionCount
    successRate
  }
}

# Get all scores
query {
  allScores {
    userId
    score
    successRate
  }
}

# Get transaction stats
query {
  transactionCount(userId: "user_0x1234")
  successRate(userId: "user_0x1234")
}
```

### Dashboard Queries

```graphql
# Get aggregated data
query {
  aggregatedData {
    priceUpdates
    scoreUpdates
    lastPrice
    avgScore
    timestamp
  }
}
```

### Mutations

```graphql
# Update price (via Chainlink listener)
mutation {
  executeOperation(operation: {
    UpdatePrice: {
      token: "ETH"
      price: 2500.50
      source: "Chainlink Oracle"
      network: "Polygon Amoy"
    }
  })
}

# Update score
mutation {
  executeOperation(operation: {
    UpdateScore: {
      userId: "user_0x1234"
      score: 85.5
      reason: "KYC verification completed"
    }
  })
}

# Record transaction
mutation {
  executeOperation(operation: {
    RecordTransaction: {
      userId: "user_0x1234"
      transactionType: "transfer"
      success: true
    }
  })
}
```

## Performance Metrics

### Target Latency

- **Chainlink → Linera**: < 100ms
- **Linera → WebSocket**: < 50ms
- **WebSocket → Frontend**: < 50ms
- **Total End-to-End**: < 200ms

### Monitoring

Check service health:

```bash
# Chainlink listener health
curl http://localhost:3001/health

# Linera service health
curl http://localhost:8080/

# WebSocket connection
wscat -c ws://localhost:8090
```

## Troubleshooting

### Linera Service Won't Start

**Problem**: `wallet_0.json` file is missing or corrupted

**Solution**:
```bash
# Reinitialize Linera network
rm -rf ~/.config/linera
linera net up --testing-prng-seed 37
```

### Chainlink Listener Can't Connect to Linera

**Problem**: Linera RPC not responding

**Solution**:
```bash
# Check if Linera service is running
curl http://localhost:8080/

# Restart Linera service
pkill linera
linera service --port 8080
```

### Applications Not Receiving Data

**Problem**: Application IDs not configured

**Solution**:
```bash
# Reconfigure with correct app IDs
curl -X POST http://localhost:3001/linera/config \
  -H "Content-Type: application/json" \
  -d @.linera/app-ids.json
```

### High Latency

**Problem**: Network or RPC issues

**Solution**:
- Use faster RPC endpoints (Infura, Alchemy)
- Increase cache timeout in chainlink_listener_linera.js
- Check network connectivity

## Development

### Building Linera Applications

```bash
cd synapsenet-backend/chains/price-feed/price-feed
cargo build --release --target wasm32-unknown-unknown
```

### Testing Locally

```bash
# Start local Linera network
linera net up --testing-prng-seed 37

# Deploy applications
./scripts/deploy-linera-apps.sh

# Run tests
cd synapsenet-backend/chains/price-feed/price-feed
cargo test
```

### Debugging

Enable debug logging:

```bash
export RUST_LOG=debug
export DEBUG=*
```

## Production Deployment

### Security Considerations

1. **Use HTTPS/WSS** for all connections
2. **Set up authentication** for Linera RPC endpoints
3. **Rate limiting** on API endpoints
4. **Monitor** for unusual activity
5. **Backup** Linera wallet and storage regularly

### Scaling

- **Horizontal scaling**: Run multiple Chainlink listener instances
- **Load balancing**: Use nginx or HAProxy for WebSocket connections
- **Database**: Add persistent storage for historical data
- **CDN**: Serve frontend through CDN for global distribution

### Monitoring

Set up monitoring with:
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **AlertManager**: Alerting

## Support

For issues or questions:
- GitHub Issues: https://github.com/ayushsaklani-min/synapsenet/issues
- Documentation: This file
- Linera Docs: https://linera.dev/

## License

[Add your license information here]

## Contributors

[Add contributor information here]
