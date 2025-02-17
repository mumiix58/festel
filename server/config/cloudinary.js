import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dlilqh3pb',
  api_key: process.env.CLOUDINARY_API_KEY || '762563471959457',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'J49GcglEgkV9bFeOeXc459GRfzE'
});

export default cloudinary;