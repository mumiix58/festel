import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.log('proxy error', err);
            if (!res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({ error: 'Proxy error' }));
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Keep connection alive
            proxyReq.setHeader('Connection', 'keep-alive');
            proxyReq.setHeader('Keep-Alive', 'timeout=120');
            
            // Add request ID for tracking
            const requestId = Math.random().toString(36).substring(7);
            proxyReq.setHeader('X-Request-ID', requestId);
            
            console.log(`[${requestId}] Sending Request:`, req.method, req.url);
          });
          
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            const requestId = proxyRes.req.getHeader('X-Request-ID');
            console.log(`[${requestId}] Received Response:`, proxyRes.statusCode, req.url);
          });
        }
      }
    },
    hmr: {
      timeout: 120000 // 2 minutes
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