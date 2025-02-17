import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Settings from '../models/Settings.js';
import Activity from '../models/Activity.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({
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
          keywords: "catering wien, event catering, hochzeit catering"
        }
      });
    }

    // Transform the response to match the expected format
    const response = {
      ...settings.toObject(),
      logo: settings.logo?.url || null // Only send the URL
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings (protected route)
router.put('/', authenticateToken, isAdmin, upload.single('logo'), async (req, res) => {
  try {
    let updates = req.body;

    // If there's a new logo file
    if (req.file) {
      // Get current settings to check for existing logo
      const currentSettings = await Settings.findOne();
      
      // Delete old logo from Cloudinary if it exists
      if (currentSettings?.logo?.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(currentSettings.logo.cloudinaryPublicId);
        } catch (error) {
          console.error('Error deleting old logo:', error);
        }
      }

      // Upload new logo to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'logos',
        resource_type: 'image'
      });

      // Update logo information
      updates.logo = {
        url: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id
      };
    }

    // Update settings in database
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true }
    );

    // Record activity
    await Activity.create({
      type: 'settings_update',
      description: 'Settings updated',
      userId: req.user._id
    });

    // Transform response to match expected format
    const response = {
      ...settings.toObject(),
      logo: settings.logo?.url || null // Only send the URL
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;