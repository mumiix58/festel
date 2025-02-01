import express from 'express';
import Settings from '../models/Settings.js';
import Activity from '../models/Activity.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

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

    res.json(settings);
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings (protected route)
router.put('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    );

    // Record activity
    await Activity.create({
      type: 'settings_update',
      description: 'Settings updated',
      userId: req.user._id
    });

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;