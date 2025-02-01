import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Settings from '../models/Settings.js';

dotenv.config();

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@festlmacher.at' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin2024!', 10);
      await User.create({
        email: 'admin@festlmacher.at',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      });
      console.log('Admin user created');
    }

    // Create settings
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
          googleMapsApiKey: "AIzaSyB2ZeKAqtk19tpt7Mhe4xmnHCRxI38d00A",
          googlePlaceId: "ChIJXwGjpWoHbUcRr1J41d3z9E4"
        }
      });
      console.log('Settings created');
    }

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();