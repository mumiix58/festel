import mongoose from 'mongoose';
import { initializeAdmin } from '../models/User.js';
import { initializeSettings } from '../models/Settings.js';
import { initializeContent } from '../scripts/initContent.js';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Configure mongoose options
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Initialize default data
    try {
      await Promise.all([
        initializeAdmin(),
        initializeSettings(),
        initializeContent()
      ]);
      console.log('Default data initialized successfully');
    } catch (initError) {
      console.warn('Warning: Error initializing default data:', initError);
      // Don't throw error to allow server to start even if initialization fails
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

  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Wait 5 seconds before exiting to allow logs to be written
    setTimeout(() => process.exit(1), 5000);
  }
};

export default connectDB;