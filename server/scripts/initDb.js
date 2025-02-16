import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import Content from '../models/Content.js';
import { initializeContent } from './initContent.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gey14853:Muhammed5858@festelmacher.egk1s.mongodb.net/festelmacher?retryWrites=true&w=majority';

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password in logs

    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 60000, // Increased timeout
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('Connected to MongoDB Atlas');

    // Create admin user if none exists
    const adminExists = await User.findOne({ email: 'admin@festlmacher.at' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Muhammed5858', 10);
      await User.create({
        email: 'admin@festlmacher.at',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        active: true
      });
      console.log('Admin user created');
    }

    // Create settings if none exist
    const settingsExist = await Settings.findOne();
    if (!settingsExist) {
      await Settings.create({
        company: {
          name: "FEST'LMACHER Gastronomie",
          address: {
            street: "Handelskai 265",
            city: "Wien",
            postalCode: "1020",
            country: "Österreich"
          },
          contact: {
            phone: "+43 (0)699 – 1600 2800",
            email: "catering@festlmacher.at"
          }
        },
        social: {
          facebook: "https://facebook.com/festlmacher",
          instagram: "https://instagram.com/festlmacher",
          linkedin: "https://linkedin.com/company/festlmacher"
        },
        seo: {
          title: "FEST'LMACHER Gastronomie | Ihr Catering Partner in Wien",
          description: "Professioneller Catering-Service in Wien für Ihre Veranstaltungen.",
          keywords: "catering wien, event catering, hochzeit catering",
          googleMapsApiKey: "AIzaSyB2ZeKAqtk19tpt7Mhe4xmnHCRxI38d00A",
          googlePlaceId: "ChIJXwGjpWoHbUcRr1J41d3z9E4"
        }
      });
      console.log('Settings created');
    }

    // Initialize content collections with retry mechanism
    let retries = 3;
    let success = false;

    while (retries > 0 && !success) {
      try {
        await initializeContent();
        success = true;
        console.log('Content collections initialized');
      } catch (error) {
        console.error(`Error initializing content (${retries} retries left):`, error);
        retries--;
        if (retries > 0) {
          console.log('Retrying content initialization...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    if (!success) {
      throw new Error('Failed to initialize content after multiple retries');
    }

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();