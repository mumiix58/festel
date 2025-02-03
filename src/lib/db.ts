import mongoose from 'mongoose';
import { showToast } from './toast';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/festlmacher';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    showToast.error('Database connection error');
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    isConnected = false;
  });

  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });

  return mongoose.connection;
}

export async function getCollection(name: string) {
  await connectDB();
  return mongoose.connection.collection(name);
}

export async function closeDB() {
  if (isConnected) {
    try {
      await mongoose.connection.close();
      isConnected = false;
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      throw new Error('Failed to close database connection');
    }
  }
}