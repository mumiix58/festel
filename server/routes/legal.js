import express from 'express';
import Legal from '../models/Legal.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get legal content by type
router.get('/:type', async (req, res) => {
  try {
    const legal = await Legal.findOne({ type: req.params.type });
    res.json(legal);
  } catch (error) {
    console.error('Legal content fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update legal content (protected route)
router.put('/:type', authenticateToken, isAdmin, async (req, res) => {
  try {
    const legal = await Legal.findOneAndUpdate(
      { type: req.params.type },
      { 
        content: req.body.content,
        lastModified: new Date()
      },
      { new: true, upsert: true }
    );
    res.json(legal);
  } catch (error) {
    console.error('Legal content update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;