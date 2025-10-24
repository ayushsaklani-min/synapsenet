# SynapseNet 2.0

A real-time blockchain data mesh platform that aggregates and streams live data from multiple blockchain networks using Linera microchains and Chainlink oracles.

## 🚀 Features

- **Real-time ETH/USD prices** from Chainlink oracles
- **Live blockchain event streaming** with sub-200ms latency
- **Professional dashboard** with interactive charts
- **Linera microchain integration** for scalable data processing
- **Auto-reconnection** and fault tolerance
- **Modern React frontend** with TypeScript

## 🏗️ Architecture

```
Chainlink Oracle (Polygon Amoy) 
    ↓ (Real ETH/USD prices)
Chainlink Listener Service (Node.js)
    ↓ (WebSocket)
Linera Backend (Rust)
    ↓ (Microchain events)
Frontend Dashboard (React)
```

## 🛠️ Tech Stack

### Backend
- **Rust** - Linera microchain implementation
- **Node.js** - Chainlink Oracle integration
- **WebSocket** - Real-time data streaming
- **Chainlink** - Price feed oracles

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive data visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushsaklani-min/snyapsnet.git
   cd snyapsnet
   ```

2. **Start the backend services**
   ```bash
   cd synapsenet-backend
   # Windows
   .\start_real_data.ps1
   
   # Linux/macOS
   chmod +x start_real_data.sh
   ./start_real_data.sh
   ```

3. **Start the frontend**
   ```bash
   cd synapsenet-frontend
   npm install
   npm run dev
   ```

4. **Access the dashboard**
   - Frontend: http://localhost:5173
   - WebSocket: ws://localhost:8090

## 📊 Data Sources

- **Chainlink Oracle**: ETH/USD price feed on Polygon Amoy testnet
- **Contract Address**: `0x9b8E6d8b2417116F4fF9bC4e9b9f91A8a7D2f8E5`
- **Update Frequency**: Every 5 seconds
- **Fallback**: Ethereum Sepolia testnet

## 🎯 Components

### Frontend (`synapsenet-frontend/`)
- **Dashboard**: Real-time price charts and statistics
- **Event Feed**: Live blockchain event stream
- **Status Bar**: Connection status and latency monitoring
- **Responsive Design**: Works on desktop and mobile

### Backend (`synapsenet-backend/`)
- **Linera SDK**: Rust-based blockchain integration
- **Chainlink Listener**: Node.js service for oracle data
- **Microchains**: Dashboard, price-feed, and identity-score chains
- **WebSocket Server**: Real-time data broadcasting

## 🔧 Development

### Backend Development
```bash
cd synapsenet-backend/sdk
cargo run --release
```

### Frontend Development
```bash
cd synapsenet-frontend
npm run dev
```

### Chainlink Listener
```bash
cd synapsenet-backend/services
npm install
node chainlink_listener.js
```

## 📈 Monitoring

The dashboard provides real-time monitoring of:
- ETH/USD price movements
- Network latency (sub-200ms)
- Connection status
- Event throughput
- Data source indicators

## 🛡️ Security

- **Testnet Only**: Uses Polygon Amoy and Sepolia testnets
- **No Mainnet**: Safe for development and testing
- **Environment Variables**: Secure configuration management
- **Auto-reconnection**: Fault-tolerant data streaming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **GitHub Repository**: https://github.com/ayushsaklani-min/snyapsnet
- **Linera Documentation**: https://linera.io
- **Chainlink Documentation**: https://docs.chain.link

## 📞 Support

For questions and support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Linera and Chainlink**
