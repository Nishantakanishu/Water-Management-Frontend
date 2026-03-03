const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// CORS configuration - allow all origins and methods
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both dev servers
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: true,
  optionsSuccessStatus: 204
}));

// Proxy middleware to forward to your backend
app.use('/api', createProxyMiddleware({
  target: 'http://115.124.119.161:5029',
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1': '/api/v1'  // Remove duplicate /v1
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Proxying request to backend:', proxyReq.method, proxyReq.url);
    
    // Handle preflight OPTIONS requests
    if (proxyReq.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': req.headers.origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400'
      });
      res.end();
      return;
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('📥 Backend response:', proxyRes.statusCode, req.url);
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Proxy server is running',
    target: 'http://115.124.119.161:5029'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`🎯 Forwarding requests to: http://115.124.119.161:5029`);
  console.log(`🌐 Your React app should connect to: http://localhost:${PORT}`);
  console.log(`✅ CORS fully configured for both dev servers`);
});
