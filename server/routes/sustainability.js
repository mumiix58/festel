import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Sustainability from '../models/Sustainability.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get sustainability content
router.get('/', async (req, res) => {
  try {
    const content = await Sustainability.findOne();
    res.json(content);
  } catch (error) {
    console.error('Sustainability content fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update sustainability content (protected route)
router.put('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const content = await Sustainability.findOneAndUpdate(
      {},
      { 
        ...req.body,
        lastModified: new Date()
      },
      { new: true, upsert: true }
    );
    res.json(content);
  } catch (error) {
    console.error('Sustainability content update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload certification image (protected route)
router.post('/certification-image', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'certifications',
      resource_type: 'auto'
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Certification image upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;