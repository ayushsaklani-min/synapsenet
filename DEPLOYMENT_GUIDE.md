# 🚀 SynapseNet 2.0 - Production Deployment Guide

## 📋 Overview

This guide will help you deploy SynapseNet 2.0 to production for the Linera Buildathon submission.

## 🌐 Deployment Architecture

```
Frontend (Vercel) → Backend (Render) → Chainlink Oracle (Polygon Amoy)
     ↓                    ↓                    ↓
  React App          WebSocket API         Real ETH/USD Data
  Port: 5173         Port: 8090           Live Price Feed
```

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 1.2 Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `ayushsaklani-min/synapsenet`
3. Configure the service:
   - **Name**: `synapsenet-backend`
   - **Root Directory**: `synapsenet-backend/services`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

### 1.3 Environment Variables
Add these environment variables in Render dashboard:
```
NODE_ENV=production
PORT=10000
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
CHAINLINK_CONTRACT=0x9b8e6d8b2417116f4ff9bc4e9b9f91a8a7d2f8e5
SEPOLIA_RPC=https://ethereum-sepolia.publicnode.com
```

### 1.4 Get Backend URL
After deployment, note your backend URL:
- Example: `https://synapsenet-backend.onrender.com`
- WebSocket: `wss://synapsenet-backend.onrender.com`

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Deploy Frontend
1. Click "New Project"
2. Import your repository: `ayushsaklani-min/synapsenet`
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `synapsenet-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Environment Variables
Add these environment variables in Vercel dashboard:
```
VITE_WS_URL=wss://synapsenet-backend.onrender.com
VITE_API_URL=https://synapsenet-backend.onrender.com
VITE_CHAINLINK_CONTRACT=0x9b8e6d8b2417116f4ff9bc4e9b9f91a8a7d2f8e5
VITE_POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
```

### 2.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL:
   - Example: `https://synapsenet-2-0.vercel.app`

## 🔧 Step 3: Update Configuration

### 3.1 Update Backend URL
After getting your Render backend URL, update the frontend environment variables in Vercel with the actual URL.

### 3.2 Test the Deployment
1. Open your Vercel frontend URL
2. Check if real-time data is streaming
3. Verify WebSocket connection is working
4. Test on different devices/browsers

## 📊 Step 4: Buildathon Submission

### 4.1 Prepare Demo
- **Live URL**: Your Vercel frontend URL
- **GitHub Repository**: https://github.com/ayushsaklani-min/synapsenet
- **Backend API**: Your Render backend URL

### 4.2 Demo Script
1. **Show Live Dashboard**: Open the Vercel URL
2. **Explain Architecture**: 
   - Real Chainlink Oracle integration
   - Linera microchain design
   - WebSocket real-time streaming
3. **Highlight Features**:
   - Sub-200ms latency
   - Professional UI/UX
   - Real blockchain data
   - Production-ready code

### 4.3 Technical Details for Judges
- **Tech Stack**: React, TypeScript, Node.js, WebSocket, Chainlink
- **Blockchain**: Polygon Amoy testnet, Ethereum Sepolia fallback
- **Performance**: Cached responses, connection pooling
- **Architecture**: Microservices, real-time data mesh

## 🎯 Expected Results

After deployment, you should have:
- ✅ **Live frontend** showing real ETH/USD prices
- ✅ **Real-time data streaming** from Chainlink
- ✅ **Professional UI** with animations
- ✅ **Production-ready performance**
- ✅ **Scalable architecture**

## 🚨 Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify environment variables
- Test WebSocket connection manually

### Frontend Issues
- Check Vercel build logs
- Verify environment variables
- Test in different browsers

### Connection Issues
- Ensure WebSocket URL is correct
- Check CORS settings
- Verify network connectivity

## 🏆 Buildathon Readiness

Your deployed SynapseNet 2.0 will demonstrate:
- **Real blockchain integration** (Chainlink Oracle)
- **Professional development skills** (Full-stack React/Node.js)
- **Production deployment** (Vercel + Render)
- **Real-time performance** (WebSocket streaming)
- **Innovative architecture** (Microchain design)

## 📞 Support

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Test locally first: `npm run dev`
3. Verify environment variables
4. Check network connectivity

---

**Ready to win the Linera Buildathon! 🚀**
