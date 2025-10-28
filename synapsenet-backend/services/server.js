// Set environment variable to indicate we're using as module BEFORE importing
process.env.AS_MODULE = 'true';

import OptimizedChainlinkListener from './chainlink_listener.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8090;

// Initialize the optimized listener with score events
const listener = new OptimizedChainlinkListener();

// Set up WebSocket server and pass it to the listener
const server = app.listen(PORT, () => {
  console.log(`🌐 SynapseNet Backend HTTP server running on port ${PORT}`);
  console.log(`📊 Status endpoint: http://localhost:${PORT}/status`);
});

const wsServer = new WebSocketServer({ server });
listener.wsServer = wsServer;

// Set up WebSocket connection handling
wsServer.on('connection', (ws) => {
  console.log("📡 Client connected to real-time data stream");
  // Immediately send the last known price to new clients
  if (listener.lastPrice !== null) {
    const priceUpdate = {
      id: randomUUID(),
      type: "price_update",
      data: {
        token: "ETH",
        price: Number(listener.lastPrice.toFixed(2)),
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

// Routes
app.get('/', (req, res) => {
  res.send('SynapseNet Backend is running!');
});

app.get('/status', (req, res) => {
  res.json(listener.getStatus());
});


// Graceful shutdown
process.on('SIGINT', () => {
  console.log("\n🛑 Shutting down SynapseNet backend...");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log("\n🛑 Shutting down SynapseNet backend...");
  process.exit(0);
});
