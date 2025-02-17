import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.js';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import settingsRoutes from './routes/settings.js';
import sliderRoutes from './routes/slider.js';
import legalRoutes from './routes/legal.js';
import equipmentRoutes from './routes/equipment.js';
import imageRoutes from './routes/image.js';
import analyticsRoutes from './routes/analytics.js';

// Load environment variables
dotenv.config();

const startServer = async () => {
  try {
    console.log('Starting server...');
    const app = express();

    // Connect to MongoDB
    await connectDB();

    // CORS configuration
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'https://cateringandmore.at',
      'https://festlmacher.netlify.app',
      'https://stackblitz.com',
      /\.stackblitz\.io$/,
      /\.netlify\.app$/,
      /\.vercel\.app$/
    ];

    app.use(cors({
      origin: function(origin, callback) {
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some(allowed => {
          if (allowed instanceof RegExp) {
            return allowed.test(origin);
          }
          return allowed === origin;
        });

        if (isAllowed) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Middleware
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(cookieParser());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/content', contentRoutes);
    app.use('/api/settings', settingsRoutes);
    app.use('/api/slider', sliderRoutes);
    app.use('/api/legal', legalRoutes);
    app.use('/api/equipment', equipmentRoutes);
    app.use('/api/images', imageRoutes);
    app.use('/api/analytics', analyticsRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
    });

    // Error handler
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();