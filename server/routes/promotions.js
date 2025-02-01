import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Promotion from '../models/Promotion.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get active promotions
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort('endDate');
    res.json(promotions);
  } catch (error) {
    console.error('Promotions fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create promotion (protected route)
router.post('/', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    let imageUrl;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'promotions',
        resource_type: 'auto'
      });
      imageUrl = result.secure_url;
    }

    const promotion = await Promotion.create({
      ...req.body,
      image: imageUrl
    });
    res.status(201).json(promotion);
  } catch (error) {
    console.error('Promotion creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update promotion (protected route)
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    let updates = { ...req.body };
    
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'promotions',
        resource_type: 'auto'
      });
      updates.image = result.secure_url;
    }

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    res.json(promotion);
  } catch (error) {
    console.error('Promotion update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete promotion (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Promotion deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;