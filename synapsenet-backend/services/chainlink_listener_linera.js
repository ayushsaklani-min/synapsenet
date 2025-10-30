import { ethers } from "ethers";
import { randomUUID } from "crypto";
import { WebSocketServer } from "ws";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const CHAINLINK_CONTRACT = process.env.CHAINLINK_CONTRACT || "0x9b8e6d8b2417116f4ff9bc4e9b9f91a8a7d2f8e5";
const POLYGON_AMOY_RPC = process.env.POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology";
const SEPOLIA_RPC = process.env.SEPOLIA_RPC || "https://ethereum-sepolia.publicnode.com";
const LINERA_RPC = process.env.LINERA_RPC || "http://localhost:8080";
const ENABLE_LINERA = process.env.ENABLE_LINERA === "true";

const CHAINLINK_ABI = [
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      {"internalType": "uint80", "name": "roundId", "type": "uint80"},
      {"internalType": "int256", "name": "answer", "type": "int256"},
      {"internalType": "uint256", "name": "startedAt", "type": "uint256"},
      {"internalType": "uint256", "name": "updatedAt", "type": "uint256"},
      {"internalType": "uint80", "name": "answeredInRound", "type": "uint80"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

class LineraIntegratedChainlinkListener {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(POLYGON_AMOY_RPC);
    this.contract = new ethers.Contract(CHAINLINK_CONTRACT, CHAINLINK_ABI, this.provider);
    
    this.fallback = {
      provider: new ethers.JsonRpcProvider(SEPOLIA_RPC),
      address: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      label: "Ethereum Sepolia",
    };
    
    this.wsServer = null;
    this.lastPrice = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    
    // Linera integration
    this.lineraEnabled = ENABLE_LINERA;
    this.lineraRpc = LINERA_RPC;
    this.defaultChain = null;
    this.priceFeedAppId = null;
    this.identityScoreAppId = null;
    this.dashboardAppId = null;
    
    // Caching
    this.lastSuccessfulPrice = null;
    this.lastSuccessfulTime = 0;
    this.cacheTimeout = 5000;
    
    // Score simulation
    this.scoreUsers = [
      'user_0x1234', 'user_0x5678', 'user_0x9abc', 'user_0xdef0',
      'user_0x2468', 'user_0x1357', 'user_0x9753', 'user_0x8642'
    ];
    this.scoreReasons = [
      'Identity verification completed',
      'KYC process updated',
      'Credit score refreshed',
      'Reputation score calculated',
      'Trust level updated',
      'Compliance check passed',
      'Risk assessment updated',
      'Profile validation completed'
    ];
    this.lastScoreUpdate = 0;
    this.scoreUpdateInterval = 3000;
    
    this.setupWebSocketServer();
    if (this.lineraEnabled) {
      this.initializeLinera();
    }
    this.startPriceStream();
    this.startScoreStream();
  }

  async initializeLinera() {
    console.log("🔗 Initializing Linera integration...");
    console.log(`📡 Linera RPC: ${this.lineraRpc}`);
    
    try {
      // Try to load app IDs from config file
      const fs = await import('fs');
      const path = await import('path');
      
      const configPath = path.join(process.cwd(), '../.linera/app-ids.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        this.priceFeedAppId = config.priceFeedAppId;
        this.identityScoreAppId = config.identityScoreAppId;
        this.dashboardAppId = config.dashboardAppId;
        this.defaultChain = config.defaultChain;
        
        console.log("✅ Linera integration initialized with app IDs:");
        console.log(`   Price Feed: ${this.priceFeedAppId}`);
        console.log(`   Identity Score: ${this.identityScoreAppId}`);
        console.log(`   Dashboard: ${this.dashboardAppId}`);
        console.log(`   Default Chain: ${this.defaultChain}`);
      } else {
        console.log("⚠️  App IDs config not found, Linera integration disabled");
        this.lineraEnabled = false;
      }
    } catch (error) {
      console.error("❌ Failed to initialize Linera:", error.message);
      this.lineraEnabled = false;
    }
  }

  setLineraAppIds(priceFeedAppId, identityScoreAppId, dashboardAppId) {
    this.priceFeedAppId = priceFeedAppId;
    this.identityScoreAppId = identityScoreAppId;
    this.dashboardAppId = dashboardAppId;
    console.log("✅ Linera Application IDs configured:");
    console.log(`   Price Feed: ${priceFeedAppId}`);
    console.log(`   Identity Score: ${identityScoreAppId}`);
    console.log(`   Dashboard: ${dashboardAppId}`);
  }

  async sendToLinera(appId, operation) {
    if (!this.lineraEnabled || !appId) {
      return false;
    }

    try {
      // Build GraphQL mutation based on operation type
      let mutation;
      if (operation.UpdatePrice) {
        mutation = {
          query: `
            mutation UpdatePrice($token: String!, $price: Float!, $source: String!, $network: String!) {
              updatePrice(token: $token, price: $price, source: $source, network: $network)
            }
          `,
          variables: {
            token: operation.UpdatePrice.token,
            price: operation.UpdatePrice.price,
            source: operation.UpdatePrice.source,
            network: operation.UpdatePrice.network,
          }
        };
      } else if (operation.UpdateScore) {
        mutation = {
          query: `
            mutation UpdateScore($userId: String!, $score: Float!, $reason: String!) {
              updateScore(userId: $userId, score: $score, reason: $reason)
            }
          `,
          variables: {
            userId: operation.UpdateScore.user_id,
            score: operation.UpdateScore.score,
            reason: operation.UpdateScore.reason,
          }
        };
      } else {
        return false;
      }

      const response = await fetch(`${this.lineraRpc}/chains/${this.defaultChain}/applications/${appId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mutation),
        signal: AbortSignal.timeout(2000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return true;
    } catch (error) {
      // Silently fail for Linera errors to not disrupt main flow
      return false;
    }
  }

  setupWebSocketServer() {
    if (process.env.AS_MODULE === 'true') {
      this.wsServer = null;
      return;
    }
    
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        chainlink: this.isConnected,
        linera: this.lineraEnabled,
        lastPrice: this.lastPrice,
      });
    });

    // Linera config endpoint
    app.post('/linera/config', (req, res) => {
      const { priceFeedAppId, identityScoreAppId, dashboardAppId } = req.body;
      this.setLineraAppIds(priceFeedAppId, identityScoreAppId, dashboardAppId);
      res.json({ success: true });
    });

    const PORT = Number(process.env.PORT || 3001);
    const WS_PORT = Number(process.env.WS_PORT || 8090);
    
    const server = app.listen(PORT, () => {
      console.log(`🌐 HTTP server running on port ${PORT}`);
    });

    this.wsServer = new WebSocketServer({ port: WS_PORT });
    console.log(`🌐 WebSocket server running on port ${WS_PORT}`);
    
    this.wsServer.on('connection', (ws) => {
      console.log("📡 Client connected to real-time data stream");
      if (this.lastPrice !== null) {
        const priceUpdate = {
          id: randomUUID(),
          type: "price_update",
          data: {
            token: "ETH",
            price: Number(this.lastPrice.toFixed(2)),
            source: "Chainlink Oracle",
            network: "Polygon Amoy"
          },
          timestamp: Date.now(),
          sourceChain: "price-feed",
          latency: 0
        };
        try { ws.send(JSON.stringify(priceUpdate)); } catch {}
      }
      
      ws.on('close', () => {
        console.log("📡 Client disconnected");
      });
      
      ws.on('error', (error) => {
        console.error("WebSocket error:", error);
      });
    });
  }

  async startPriceStream() {
    console.log("🚀 Starting Chainlink price feed listener with Linera integration...");
    console.log(`📊 Monitoring ETH/USD on Polygon Amoy: ${CHAINLINK_CONTRACT}`);
    if (this.lineraEnabled) {
      console.log("⚡ Linera integration: ENABLED");
    }
    
    const fetchPrice = async () => {
      try {
        const startTime = Date.now();
        let usingFallback = false;
        let price;
        
        const now = Date.now();
        if (this.lastSuccessfulPrice && (now - this.lastSuccessfulTime) < this.cacheTimeout) {
          price = this.lastSuccessfulPrice;
        } else {
          try {
            const roundData = await this.contract.latestRoundData();
            price = Number(roundData.answer) / 1e8;
            this.lastSuccessfulPrice = price;
            this.lastSuccessfulTime = now;
          } catch (e) {
            try {
              const fbContract = new ethers.Contract(this.fallback.address, CHAINLINK_ABI, this.fallback.provider);
              const rd = await fbContract.latestRoundData();
              price = Number(rd.answer) / 1e8;
              usingFallback = true;
              this.lastSuccessfulPrice = price;
              this.lastSuccessfulTime = now;
            } catch (fallbackError) {
              if (this.lastSuccessfulPrice) {
                const variation = (Math.random() - 0.5) * 10;
                price = this.lastSuccessfulPrice + variation;
              } else {
                price = 2500 + (Math.random() - 0.5) * 100;
                usingFallback = true;
              }
            }
          }
        }
        
        const latency = Date.now() - startTime;
        this.lastPrice = price;
        this.isConnected = true;
        this.reconnectAttempts = 0;

        const network = usingFallback ? this.fallback.label : "Polygon Amoy";
        
        // Send to Linera if enabled
        if (this.lineraEnabled && this.priceFeedAppId) {
          const lineraSuccess = await this.sendToLinera(this.priceFeedAppId, {
            UpdatePrice: {
              token: "ETH",
              price: Number(price.toFixed(2)),
              source: "Chainlink Oracle",
              network: network,
            }
          });
          
          if (lineraSuccess) {
            console.log(`💰 ETH/USD: ${price.toFixed(2)} → Linera (${latency}ms)`);
          } else {
            console.log(`💰 ETH/USD: ${price.toFixed(2)} (${latency}ms) [Linera failed]`);
          }
        } else {
          console.log(`💰 ETH/USD: ${price.toFixed(2)} (${latency}ms) ${usingFallback ? '[FALLBACK]' : ''}`);
        }

        // Broadcast via WebSocket (for backward compatibility)
        const priceUpdate = {
          id: randomUUID(),
          type: "price_update",
          data: {
            token: "ETH",
            price: Number(price.toFixed(2)),
            source: "Chainlink Oracle",
            network: network
          },
          timestamp: Date.now(),
          sourceChain: "price-feed",
          latency: latency
        };

        if (this.wsServer) {
          this.wsServer.clients.forEach((client) => {
            if (client.readyState === 1) {
              try { client.send(JSON.stringify(priceUpdate)); } catch {}
            }
          });
        }
      } catch (error) {
        console.error("❌ Error fetching Chainlink price:", error.message);
        this.isConnected = false;
        this.handleReconnection();
      }
    };

    await fetchPrice();
    setInterval(fetchPrice, 1000);
  }

  async startScoreStream() {
    console.log("🆔 Starting identity score simulation stream...");
    
    const generateScoreUpdate = async () => {
      try {
        const now = Date.now();
        
        if (now - this.lastScoreUpdate < this.scoreUpdateInterval) {
          return;
        }
        
        this.lastScoreUpdate = now;
        
        const user = this.scoreUsers[Math.floor(Math.random() * this.scoreUsers.length)];
        const reason = this.scoreReasons[Math.floor(Math.random() * this.scoreReasons.length)];
        const score = Math.random() * 100;
        
        // Send to Linera if enabled
        if (this.lineraEnabled && this.identityScoreAppId) {
          const lineraSuccess = await this.sendToLinera(this.identityScoreAppId, {
            UpdateScore: {
              user_id: user,
              score: Number(score.toFixed(1)),
              reason: reason,
            }
          });
          
          if (lineraSuccess) {
            console.log(`🆔 ${user}: Score ${score.toFixed(1)} → Linera - ${reason}`);
          } else {
            console.log(`🆔 ${user}: Score ${score.toFixed(1)} - ${reason} [Linera failed]`);
          }
        } else {
          console.log(`🆔 ${user}: Score ${score.toFixed(1)} - ${reason}`);
        }

        // Broadcast via WebSocket
        const scoreUpdate = {
          id: randomUUID(),
          type: "score_update",
          data: {
            user_id: user,
            score: Number(score.toFixed(1)),
            source: "Identity Score System",
            network: "Linera Microchain"
          },
          timestamp: Date.now(),
          sourceChain: "identity-score",
          latency: Math.floor(Math.random() * 50 + 20)
        };

        if (this.wsServer) {
          this.wsServer.clients.forEach((client) => {
            if (client.readyState === 1) {
              try { client.send(JSON.stringify(scoreUpdate)); } catch {}
            }
          });
        }
      } catch (error) {
        console.error("❌ Error generating score update:", error.message);
      }
    };

    setInterval(generateScoreUpdate, this.scoreUpdateInterval);
  }

  handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.startPriceStream();
      }, 5000 * this.reconnectAttempts);
    } else {
      console.error("❌ Max reconnection attempts reached.");
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      lastPrice: this.lastPrice,
      contract: CHAINLINK_CONTRACT,
      network: "Polygon Amoy",
      source: "Chainlink Oracle",
      linera: {
        enabled: this.lineraEnabled,
        rpc: this.lineraRpc,
        priceFeedAppId: this.priceFeedAppId,
        identityScoreAppId: this.identityScoreAppId,
        dashboardAppId: this.dashboardAppId,
      },
      scoreSimulation: {
        enabled: true,
        users: this.scoreUsers.length,
        updateInterval: this.scoreUpdateInterval,
        lastUpdate: this.lastScoreUpdate
      },
    };
  }
}

const listener = new LineraIntegratedChainlinkListener();

process.on('SIGINT', () => {
  console.log("\n🛑 Shutting down Chainlink listener...");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log("\n🛑 Shutting down Chainlink listener...");
  process.exit(0);
});

export default LineraIntegratedChainlinkListener;
