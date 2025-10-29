# SynapseNet 2.0

**Real-Time Decentralized Data Mesh with Linera Microchains**

SynapseNet is a high-performance blockchain data streaming platform that integrates Chainlink oracles with Linera microchains to deliver real-time price feeds and identity scoring with sub-200ms latency.

![SynapseNet Architecture](docs/architecture.png)

## 🌟 Features

- ⚡ **Sub-200ms Latency**: Real-time data streaming from blockchain to browser
- 🔗 **Chainlink Integration**: Live ETH/USD price feeds from Polygon Amoy testnet
- 🔄 **Linera Microchains**: Distributed event coordination and state management
- 📊 **Real-Time Dashboard**: Beautiful React UI with live charts and animations
- 🎯 **Identity Scoring**: Dynamic reputation system based on transaction success
- 🔐 **Decentralized**: No central point of failure
- 📈 **Scalable**: Microchain architecture for horizontal scaling

## 🏗️ Architecture

```
Chainlink Oracle → Chainlink Listener → Linera Microchains → WebSocket → React Dashboard
```

### Components

1. **Price Feed Microchain**: Stores and validates oracle price data
2. **Identity Score Microchain**: Tracks user reputation and transaction history
3. **Dashboard Microchain**: Aggregates data from other chains
4. **Chainlink Listener**: Bridges oracle data to Linera
5. **React Frontend**: Real-time visualization dashboard

## 🚀 Quick Start

### Prerequisites

- Rust 1.70+ with `wasm32-unknown-unknown` target
- Linera CLI 0.15.4
- Node.js 18+
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/ayushsaklani-min/synapsenet.git
cd synapsenet

# Deploy Linera applications
chmod +x scripts/deploy-linera-apps.sh
./scripts/deploy-linera-apps.sh

# Start all services
chmod +x scripts/start-full-stack.sh
./scripts/start-full-stack.sh
```

### Access

- **Dashboard**: http://localhost:5173
- **GraphQL API**: http://localhost:8080/graphql
- **REST API**: http://localhost:3001
- **WebSocket**: ws://localhost:8090

## 📖 Documentation

- [Quick Start Guide](docs/QUICKSTART.md) - Get running in 5 minutes
- [Linera Integration](docs/linera_integration.md) - Complete technical documentation
- [API Reference](docs/linera_integration.md#graphql-api) - GraphQL queries and mutations

## 🎯 Use Cases

- **DeFi Dashboards**: Real-time price monitoring for trading platforms
- **Oracle Aggregation**: Combine multiple oracle sources with validation
- **Identity Systems**: Decentralized reputation and credit scoring
- **Event Streaming**: High-throughput blockchain event processing
- **Microchain Coordination**: Demonstrate Linera's multi-chain capabilities

## 🔧 Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `ENABLE_LINERA=true` - Enable Linera integration
- `LINERA_RPC=http://localhost:8080` - Linera service endpoint
- `POLYGON_AMOY_RPC` - Chainlink oracle RPC endpoint

## 📊 Performance

- **Price Updates**: 1 second intervals
- **Score Updates**: 3 second intervals
- **Chainlink → Linera**: < 100ms
- **Linera → Frontend**: < 50ms
- **Total Latency**: < 200ms

## 🧪 Testing

### Test Linera Applications

```bash
cd synapsenet-backend/chains/price-feed/price-feed
cargo test
```

### Test GraphQL API

```bash
# Get current price
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ price(token: \"ETH\") { price timestamp } }"}'
```

### Monitor WebSocket

```bash
wscat -c ws://localhost:8090
```

## 🐳 Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🛠️ Development

### Project Structure

```
synapsenet/
├── synapsenet-backend/
│   ├── chains/
│   │   ├── price-feed/       # Price oracle microchain
│   │   ├── identity-score/   # Reputation microchain
│   │   └── dashboard/        # Aggregator microchain
│   ├── services/
│   │   └── chainlink_listener_linera.js
│   └── sdk/                  # Rust SDK
├── synapsenet-frontend/      # React dashboard
├── scripts/                  # Deployment scripts
└── docs/                     # Documentation
```

### Building Applications

```bash
# Build all Linera applications
cd synapsenet-backend/chains/price-feed/price-feed
cargo build --release --target wasm32-unknown-unknown

# Build frontend
cd synapsenet-frontend
npm run build
```

### Adding New Microchains

1. Create new directory in `synapsenet-backend/chains/`
2. Define ABI in `lib.rs`
3. Implement contract in `contract.rs`
4. Implement service in `service.rs`
5. Deploy with `linera publish-bytecode` and `linera create-application`

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

[Add your license here]

## 🙏 Acknowledgments

- **Linera Protocol**: For the microchain infrastructure
- **Chainlink**: For decentralized oracle networks
- **Polygon**: For the Amoy testnet

## 📧 Contact

- GitHub: [@ayushsaklani-min](https://github.com/ayushsaklani-min)
- Project: [SynapseNet](https://github.com/ayushsaklani-min/synapsenet)

## 🗺️ Roadmap

- [ ] Multi-oracle support (Chainlink, Band Protocol, API3)
- [ ] Historical data storage and querying
- [ ] Advanced identity scoring algorithms
- [ ] Cross-chain price arbitrage detection
- [ ] Mobile app for dashboard
- [ ] Mainnet deployment
- [ ] Governance token integration

## ⚠️ Disclaimer

This is experimental software. Use at your own risk. Not audited for production use.

---

**Built with ❤️ using Linera, Chainlink, and React**
