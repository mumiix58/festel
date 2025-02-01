import express from 'express';
import Equipment from '../models/Equipment.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Equipment.find().sort('order');
    res.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category (protected route)
router.post('/categories', authenticateToken, isAdmin, async (req, res) => {
  try {
    const category = await Equipment.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error('Category creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category (protected route)
router.put('/categories/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const category = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(category);
  } catch (error) {
    console.error('Category update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (protected route)
router.delete('/categories/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Category deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;