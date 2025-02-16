import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import { errorHandler } from './middleware/error.js';
import connectDB from './config/db.js';
import { initializeContent } from './scripts/initContent.js';
import { initializeLegalContent } from './models/Legal.js';
import { initializeEquipment } from './models/Equipment.js';

// Import routes
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import settingsRoutes from './routes/settings.js';
import sliderRoutes from './routes/slider.js';
import legalRoutes from './routes/legal.js';
import equipmentRoutes from './routes/equipment.js';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const startServer = async () => {
  try {
    console.log('Starting server...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('Frontend URL:', process.env.FRONTEND_URL);

    const app = express();

    // Connect to MongoDB first
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connection established');

    // Initialize default content
    console.log('Initializing default content...');
    await Promise.all([
      initializeContent(),
      initializeLegalContent(),
      initializeEquipment()
    ]);
    console.log('Default content initialized');

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
        if (!origin) {
          return callback(null, true);
        }

        const isAllowed = allowedOrigins.some(allowed => {
          if (allowed instanceof RegExp) {
            return allowed.test(origin);
          }
          return allowed === origin;
        });

        if (isAllowed) {
          callback(null, true);
        } else {
          console.warn('CORS blocked request from:', origin);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control']
    }));

    // Middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    // Debug middleware
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      next();
    });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/content', contentRoutes);
    app.use('/api/settings', settingsRoutes);
    app.use('/api/slider', sliderRoutes);
    app.use('/api/legal', legalRoutes);
    app.use('/api/equipment', equipmentRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok',
        environment: process.env.NODE_ENV,
        database: 'connected',
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