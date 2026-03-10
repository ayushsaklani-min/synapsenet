# SynapseNet — Real‑time Data Mesh on Linera

<div align="center">

<img src="docs/banner.png" alt="SynapseNet" width="720"/>

**Live Chainlink Price Feed • Identity Scores • Linera Microchains**

[![Linera](https://img.shields.io/badge/Linera-v0.15.4-blue)](https://linera.dev)
[![Rust](https://img.shields.io/badge/Rust-1.86.0-orange)](https://www.rust-lang.org/)
[![Status](https://img.shields.io/badge/Status-Live-success)](.)

</div>

---



SynapseNet is a high‑performance, real‑time data mesh that bridges Chainlink oracle data into Linera microchains and streams it to a modern React dashboard. It showcases:

- Live ETH/USD price feed ingestion (Polygon Amoy, Chainlink)
- Three Linera microchains: `price-feed`, `identity-score`, `dashboard`
- Cross‑chain messaging and persistent on‑chain state
- WebSocket broadcasting and GraphQL mutations

Live demo: `https://synapsenet.vercel.app/`

Backend (listener): `https://synapsenet-backend-45hz.onrender.com/`

---

## 🧭 Architecture

```
Chainlink Oracle → Node Listener (Express + WS) → Linera Microchains
   │                                                    │
   └──────────── WebSocket to UI (1s updates) ─────────┘

Microchains:
1) price-feed      — stores validated price data
2) identity-score  — tracks transactions and calculates dynamic reputation
3) dashboard       — aggregates cross‑chain data for UI
```

Key contracts/services (abridged for reference):
- `synapsenet-backend/chains/price-feed/price-feed/src/contract.rs` — price storage and updates
- `synapsenet-backend/chains/identity-score/identity-score/src/contract.rs` — success‑rate scoring
- `synapsenet-backend/chains/dashboard/dashboard/src/contract.rs` — aggregation and averages
- `synapsenet-backend/services/chainlink_listener_linera.js` — Chainlink → Linera bridge and WS

---

## ⚙️ Quick Start

### Prerequisites
- Rust 1.86.0 with target `wasm32-unknown-unknown`
- Linera CLI v0.15.4
- Node.js 18+
- Docker (optional)

### One‑command demo (local)
```bash
git clone https://github.com/ayushsaklani-min/synapsenet.git
cd synapsenet

# Backend listener (HTTP + WS)
cd synapsenet-backend/services && npm ci && npm run start &

# Frontend dashboard
cd ../../synapsenet-frontend && npm ci && npm run dev
```

Dashboard: `http://localhost:5173`

Listener health: `http://localhost:3001/health`

WebSocket: `ws://localhost:8090`

---

## 🔗 Linera Integration

- SDK: `linera-sdk = 0.15.4`
- Operations are submitted via GraphQL mutations from the listener:
  - `updatePrice(token, price, source, network)`
  - `updateScore(userId, score, reason)`
- Default chain and app IDs are read from `.linera/app-ids.json` if present.

Example request (listener → Linera):
```json
{
  "query": "mutation UpdatePrice($token: String!, $price: Float!, $source: String!, $network: String!) { updatePrice(token: $token, price: $price, source: $source, network: $network) }",
  "variables": { "token": "ETH", "price": 3751.67, "source": "Chainlink Oracle", "network": "Polygon Amoy" }
}
```

---

## 🖥️ Frontend

- React + Vite + Tailwind
- Components: `PriceChart`, `ScoresChart`, `EventFeed`, `StatusBar`, `StatsGrid`
- Real‑time updates via WS; status indicators for connection/latency

---

## 📦 Docker

```bash
docker-compose up -d
docker-compose logs -f
```

Services: listener (HTTP/WS), optional reverse proxy, frontend (if configured).

---

## 🔧 Configuration

Copy `.env.example` → `.env` and set:

- `ENABLE_LINERA=true|false`
- `LINERA_RPC=http://localhost:8080`
- `POLYGON_AMOY_RPC=...`
- `PORT=3001`, `WS_PORT=8090`

Optional: `.linera/app-ids.json`
```json
{
  "priceFeedAppId": "<app-id>",
  "identityScoreAppId": "<app-id>",
  "dashboardAppId": "<app-id>",
  "defaultChain": "<chain-id>"
}
```

---

## 🧪 Smoke Tests

```bash
# Listener health
curl http://localhost:3001/health

# GraphQL (example)
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { queryType { name } } }"}'
```

---

## 📊 Performance (target)

- Price polling: 1s interval
- End‑to‑end latency (Oracle → UI): < 200ms typical on local
- Score updates: ~3s interval

---

## 🛡️ Notes & Next Steps

- Re‑enable contract event emits for richer analytics (currently commented in contracts)
- Add e2e assertion script to verify a price update reaches the UI
- First‑run UI panel to input/save Linera app IDs

Roadmap:
- Multi‑oracle aggregation
- Historical storage & charts
- Advanced scoring algorithms

---

## 📁 Project Structure

```
synapsenet/
├─ synapsenet-backend/
│  ├─ chains/
│  │  ├─ price-feed/price-feed/src/{contract.rs,state.rs,...}
│  │  ├─ identity-score/identity-score/src/{contract.rs,state.rs,...}
│  │  └─ dashboard/dashboard/src/{contract.rs,state.rs,...}
│  └─ services/chainlink_listener_linera.js
├─ synapsenet-frontend/
└─ scripts/
```

---



---

## 🙏 Acknowledgments

Linera Protocol, Chainlink, Polygon Amoy, and the broader OSS community.

---

Built with ❤️ using Linera, Chainlink, and React.


