# SynapseNet Backend

Real-time cross-app data mesh built on Linera Protocol.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Price Feed    │    │ Identity Score  │    │   Dashboard     │
│   Microchain    │    │   Microchain    │    │   Microchain    │
│                 │    │                 │    │                 │
│ • ETH prices    │    │ • User scores   │    │ • Event stream  │
│ • Real-time     │    │ • Reputation    │    │ • Live data     │
│ • Cross-chain   │    │ • Cross-chain   │    │ • Cross-chain   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  SynapseNet SDK │
                    │                 │
                    │ • Publish/Sub   │
                    │ • Event routing │
                    │ • Cross-chain   │
                    └─────────────────┘
```

## Structure

```
synapsenet-backend/
├── chains/
│   ├── price-feed/          # Price data microchain
│   ├── identity-score/      # Identity scoring microchain
│   └── dashboard/           # Dashboard aggregation microchain
├── sdk/                     # SynapseNet SDK
├── scripts/                 # Deployment scripts
└── docs/                    # Documentation
```

## Quick Start

1. **Start Linera Network:**
   ```bash
   linera net up
   ```

2. **Deploy Contracts:**
   ```bash
   ./scripts/deploy.sh
   ```

3. **Run SDK Demo:**
   ```bash
   cd sdk && cargo run
   ```

## Features

- ✅ **Real-time data sharing** across microchains
- ✅ **Cross-chain subscriptions** with pub/sub
- ✅ **Rust smart contracts** on Linera
- ✅ **TypeScript SDK** for easy integration
- ✅ **GraphQL APIs** for data queries
- ✅ **Event streaming** with sub-200ms latency

## Technology Stack

- **Blockchain**: Linera Protocol v0.15.4
- **Smart Contracts**: Rust + Linera SDK
- **SDK**: Rust + TypeScript
- **APIs**: GraphQL
- **Networking**: gRPC + WebSocket
