# How to Verify Blockchain Data Accuracy

## 🔍 Method 1: Check Chainlink Oracle Directly

### Polygon Amoy Testnet
1. **Visit PolygonScan**: https://amoy.polygonscan.com/address/0x9b8e6d8b2417116f4ff9bc4e9b9f91a8a7d2f8e5
2. **Click "Contract" tab**
3. **Click "Read Contract"**
4. **Find "latestRoundData" function**
5. **Click "Query" to get current price**
6. **Compare with your webapp**

### Ethereum Sepolia Testnet (Fallback)
1. **Visit Etherscan**: https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306
2. **Same steps as above**

## 🔍 Method 2: Use Chainlink Documentation

### Official Chainlink Feeds
- **Polygon Amoy**: https://docs.chain.link/data-feeds/price-feeds/addresses/?network=polygon-amoy
- **Ethereum Sepolia**: https://docs.chain.link/data-feeds/price-feeds/addresses/?network=ethereum-sepolia

## 🔍 Method 3: Programmatic Verification

### JavaScript/Node.js
```javascript
const { ethers } = require("ethers");

// Polygon Amoy
const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
const contract = new ethers.Contract(
  "0x9b8e6d8b2417116f4ff9bc4e9b9f91a8a7d2f8e5",
  [{
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
  }],
  provider
);

async function getCurrentPrice() {
  try {
    const roundData = await contract.latestRoundData();
    const price = Number(roundData.answer) / 1e8; // Chainlink uses 8 decimals
    console.log(`Current ETH/USD Price: $${price.toFixed(2)}`);
    console.log(`Last Updated: ${new Date(Number(roundData.updatedAt) * 1000)}`);
    return price;
  } catch (error) {
    console.error("Error fetching price:", error);
  }
}

getCurrentPrice();
```

## 🔍 Method 4: Browser Console Verification

### In your webapp's browser console:
```javascript
// Check WebSocket connection
console.log("WebSocket connection:", wsRef.current?.readyState);

// Check latest received data
console.log("Latest events:", events);

// Check current price
console.log("Current price:", currentPrice);
```

## 🔍 Method 5: Network Monitoring

### Check WebSocket Traffic
1. **Open Browser DevTools** (F12)
2. **Go to Network tab**
3. **Filter by WS (WebSocket)**
4. **Look for messages from ws://localhost:8090**
5. **Verify data matches blockchain**

## 🔍 Method 6: Log Analysis

### Check Backend Logs
```bash
# In your terminal running the Chainlink listener
# Look for logs like:
# 💰 ETH/USD: $3,247.52 (45ms latency)
# 📊 Monitoring ETH/USD on Polygon Amoy: 0x9b8e6d8b2417116f4ff9bc4e9b9f91a8a7d2f8e5
```

## 🔍 Method 7: Cross-Reference with Other Sources

### Compare with:
- **CoinGecko**: https://coingecko.com/en/coins/ethereum
- **CoinMarketCap**: https://coinmarketcap.com/currencies/ethereum/
- **Binance**: https://www.binance.com/en/trade/ETH_USDT

*Note: Testnet prices may differ slightly from mainnet due to different oracle update frequencies*

## 🔍 Method 8: Real-time Verification Script

### Create a verification script:
```bash
# Create verify_data.js
node verify_data.js
```

This will show you the exact price from the blockchain and compare it with your webapp.
