import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Proxy timeout values in milliseconds
const PROXY_TIMEOUT = 60000; // 60 seconds
const PROXY_READ_TIMEOUT = 60000; // 60 seconds
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://festlmacher-api-nucz.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          // Set timeouts
          proxy.options.timeout = PROXY_TIMEOUT;
          proxy.options.proxyTimeout = PROXY_READ_TIMEOUT;

          // Add retry mechanism
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
            
            // Get retry count from request
            const retryCount = Number(req.headers['x-retry-count'] || 0);
            
            if (retryCount < RETRY_ATTEMPTS) {
              // Increment retry count
              req.headers['x-retry-count'] = String(retryCount + 1);
              
              // Retry request after delay
              setTimeout(() => {
                console.log(`Retrying request (${retryCount + 1}/${RETRY_ATTEMPTS})`);
                proxy.web(req, res);
              }, RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
            } else {
              // Max retries reached, send error response
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Gateway timeout',
                message: 'The request took too long to complete'
              }));
            }
          });

          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add request ID for debugging
            const requestId = Math.random().toString(36).substring(7);
            proxyReq.setHeader('X-Request-ID', requestId);
            console.log(`[${requestId}] Sending Request:`, req.method, req.url);

            // Add keep-alive headers
            proxyReq.setHeader('Connection', 'keep-alive');
            proxyReq.setHeader('Keep-Alive', 'timeout=60, max=1000');

            // Handle request body
            if (req.body) {
              const bodyData = JSON.stringify(req.body);
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
            }
          });

          proxy.on('proxyRes', (proxyRes, req, _res) => {
            const requestId = proxyRes.headers['x-request-id'];
            console.log(`[${requestId}] Received Response:`, proxyRes.statusCode, req.url);
          });
        }
      }
    },
    hmr: {
      timeout: 30000 // 30 seconds
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-hot-toast'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});