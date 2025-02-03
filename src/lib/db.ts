import mongoose from 'mongoose';
import { showToast } from './toast';

// Get MongoDB URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  if (isConnected) {
    return mongoose;
  }

  // If a connection attempt is already in progress, return that promise
  if (connectionPromise) {
    return connectionPromise;
  }

  try {
    console.log('Connecting to MongoDB...');
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Configure mongoose
    mongoose.set('strictQuery', false);
    
    // Create new connection promise
    connectionPromise = mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    });

    await connectionPromise;
    isConnected = true;
    console.log('Successfully connected to MongoDB');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
      connectionPromise = null;
      showToast.error('Database connection error');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
      connectionPromise = null;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      isConnected = true;
    });

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

    return mongoose;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    connectionPromise = null;
    showToast.error('Failed to connect to database');
    throw error;
  }
}

export async function getCollection(name: string) {
  const db = await connectDB();
  return db.connection.collection(name);
}

export async function closeDB() {
  if (isConnected) {
    try {
      await mongoose.connection.close();
      isConnected = false;
      connectionPromise = null;
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      throw new Error('Failed to close database connection');
    }
  }
}