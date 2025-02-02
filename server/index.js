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

// Load environment variables
dotenv.config();

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

    // CORS configuration
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'https://cateringandmore.at',
      'https://festlmacher.netlify.app'
    ];

    app.use(cors({
      origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/content', contentRoutes);
    app.use('/api/settings', settingsRoutes);

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