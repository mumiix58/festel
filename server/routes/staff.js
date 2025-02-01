import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Staff from '../models/Staff.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get public staff members
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find({
      isActive: true,
      showOnWebsite: true
    }).sort('order');
    res.json(staff);
  } catch (error) {
    console.error('Staff fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all staff (protected route)
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const staff = await Staff.find().sort('order');
    res.json(staff);
  } catch (error) {
    console.error('Staff fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create staff member (protected route)
router.post('/', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    let imageUrl;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'staff',
        resource_type: 'auto'
      });
      imageUrl = result.secure_url;
    }

    const staff = await Staff.create({
      ...req.body,
      image: imageUrl
    });
    res.status(201).json(staff);
  } catch (error) {
    console.error('Staff creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update staff member (protected route)
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    let updates = { ...req.body };
    
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'staff',
        resource_type: 'auto'
      });
      updates.image = result.secure_url;
    }

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    res.json(staff);
  } catch (error) {
    console.error('Staff update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete staff member (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Staff deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;