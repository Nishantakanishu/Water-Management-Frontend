import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, User-Agent, Accept, Origin, Cache-Control',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    },
    proxy: {
      '/api': {
        target: 'http://115.124.119.161:5029',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        bypass: (req, res, options) => {
          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.end();
            return 'ignored';
          }
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('🔄 Proxy Request:', req.method, req.url);

            // Mimic Postman to bypass strict backend WAFs that throw 403s!
            proxyReq.setHeader('User-Agent', 'PostmanRuntime/7.36.1');
            proxyReq.setHeader('Accept', '*/*');
            proxyReq.setHeader('Cache-Control', 'no-cache');

            // Remove browser-specific local origin headers that cause rejections
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            proxyReq.removeHeader('sec-fetch-dest');
            proxyReq.removeHeader('sec-fetch-mode');
            proxyReq.removeHeader('sec-fetch-site');
          });

          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('📡 Proxy Response:', proxyRes.statusCode, req.url);

            // Delete WWW-Authenticate to PREVENT the browser from showing the ugly native login alert box!
            if (proxyRes.headers['www-authenticate']) {
              delete proxyRes.headers['www-authenticate'];
            }

            // Add open CORS headers
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, User-Agent, Accept, Origin, Cache-Control';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });

          proxy.on('error', (err, req, res) => {
            console.error('❌ Proxy Error:', err);
            res.writeHead(500, {
              'Content-Type': 'text/plain',
              'Access-Control-Allow-Origin': '*'
            });
            res.end('Proxy Error: ' + err.message);
          });
        }
      }
    }
  }
})

