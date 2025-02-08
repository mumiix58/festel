import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initializeAdmin } from '../models/User.js';
import { initializeSettings } from '../models/Settings.js';
import { initializeContent } from '../scripts/initContent.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gey14853:Muhammed5858@festelmacher.egk1s.mongodb.net/festelmacher?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password in logs

    // Configure mongoose options
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Initialize default data
    try {
      console.log('Initializing default data...');
      await Promise.all([
        initializeAdmin(),
        initializeSettings(),
        initializeContent()
      ]);
      console.log('Default data initialized successfully');
    } catch (initError) {
      console.error('Error initializing default data:', initError);
      throw initError;
    }

    // Set up connection error handler
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    // Handle reconnection
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    return conn;

  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;