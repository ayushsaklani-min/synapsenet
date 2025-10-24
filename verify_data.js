#!/usr/bin/env node

// SynapseNet Data Verification Script
// This script fetches the same data that your webapp uses and displays it

const { ethers } = require("ethers");

// Chainlink ETH/USD Price Feed on Polygon Amoy Testnet
const CHAINLINK_CONTRACT = "0x9b8e6d8b2417116f4ff9bc4e9b9f91a8a7d2f8e5";
const POLYGON_AMOY_RPC = "https://rpc-amoy.polygon.technology";
const SEPOLIA_RPC = "https://ethereum-sepolia.publicnode.com";

// Fallback Sepolia contract
const SEPOLIA_CONTRACT = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

// Chainlink AggregatorV3Interface ABI
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

async function verifyBlockchainData() {
  console.log("🔍 SynapseNet Data Verification");
  console.log("================================");
  console.log("");

  // Try Polygon Amoy first
  try {
    console.log("📊 Checking Polygon Amoy Testnet...");
    const provider = new ethers.JsonRpcProvider(POLYGON_AMOY_RPC);
    const contract = new ethers.Contract(CHAINLINK_CONTRACT, CHAINLINK_ABI, provider);
    
    const roundData = await contract.latestRoundData();
    const price = Number(roundData.answer) / 1e8;
    const lastUpdated = new Date(Number(roundData.updatedAt) * 1000);
    const roundId = roundData.roundId.toString();
    
    console.log("✅ Polygon Amoy Data:");
    console.log(`   💰 ETH/USD Price: $${price.toFixed(2)}`);
    console.log(`   🆔 Round ID: ${roundId}`);
    console.log(`   ⏰ Last Updated: ${lastUpdated.toISOString()}`);
    console.log(`   🔗 Contract: ${CHAINLINK_CONTRACT}`);
    console.log(`   🌐 Network: Polygon Amoy Testnet`);
    console.log("");
    
    return { price, source: "Polygon Amoy", contract: CHAINLINK_CONTRACT };
    
  } catch (error) {
    console.log("❌ Polygon Amoy unavailable:", error.message);
    console.log("");
    
    // Try Sepolia fallback
    try {
      console.log("📊 Checking Ethereum Sepolia Testnet (Fallback)...");
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
      const contract = new ethers.Contract(SEPOLIA_CONTRACT, CHAINLINK_ABI, provider);
      
      const roundData = await contract.latestRoundData();
      const price = Number(roundData.answer) / 1e8;
      const lastUpdated = new Date(Number(roundData.updatedAt) * 1000);
      const roundId = roundData.roundId.toString();
      
      console.log("✅ Sepolia Data:");
      console.log(`   💰 ETH/USD Price: $${price.toFixed(2)}`);
      console.log(`   🆔 Round ID: ${roundId}`);
      console.log(`   ⏰ Last Updated: ${lastUpdated.toISOString()}`);
      console.log(`   🔗 Contract: ${SEPOLIA_CONTRACT}`);
      console.log(`   🌐 Network: Ethereum Sepolia Testnet`);
      console.log("");
      
      return { price, source: "Ethereum Sepolia", contract: SEPOLIA_CONTRACT };
      
    } catch (fallbackError) {
      console.log("❌ Both networks unavailable:");
      console.log(`   Polygon Amoy: ${error.message}`);
      console.log(`   Sepolia: ${fallbackError.message}`);
      console.log("");
      console.log("⚠️  This means your webapp is likely using mock data");
      return null;
    }
  }
}

async function checkWebSocketConnection() {
  console.log("🔌 Checking WebSocket Connection...");
  console.log("   URL: ws://localhost:8090");
  console.log("   Status: Check if your backend is running");
  console.log("");
}

async function main() {
  console.log("🚀 Starting SynapseNet Data Verification");
  console.log("=====================================");
  console.log("");
  
  // Check blockchain data
  const blockchainData = await verifyBlockchainData();
  
  // Check WebSocket connection
  await checkWebSocketConnection();
  
  if (blockchainData) {
    console.log("📋 Verification Summary:");
    console.log("========================");
    console.log(`✅ Blockchain Data: $${blockchainData.price.toFixed(2)}`);
    console.log(`✅ Source: ${blockchainData.source}`);
    console.log(`✅ Contract: ${blockchainData.contract}`);
    console.log("");
    console.log("🔍 To verify your webapp shows the same data:");
    console.log("   1. Open your webapp at http://localhost:5173");
    console.log("   2. Check the ETH/USD price displayed");
    console.log("   3. Compare with the price above");
    console.log("   4. Prices should match (within a few seconds of update)");
    console.log("");
    console.log("🌐 Blockchain Explorer Links:");
    if (blockchainData.source === "Polygon Amoy") {
      console.log(`   https://amoy.polygonscan.com/address/${blockchainData.contract}`);
    } else {
      console.log(`   https://sepolia.etherscan.io/address/${blockchainData.contract}`);
    }
  } else {
    console.log("❌ No blockchain data available");
    console.log("   Your webapp is likely using mock data");
    console.log("   Make sure your backend services are running");
  }
  
  console.log("");
  console.log("🔧 Troubleshooting:");
  console.log("   - Ensure backend services are running");
  console.log("   - Check WebSocket connection at ws://localhost:8090");
  console.log("   - Verify network connectivity");
}

// Run the verification
main().catch(console.error);
