import express from 'express';
import Menu from '../models/Menu.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all active menus
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find({ active: true });
    res.json(menus);
  } catch (error) {
    console.error('Menus fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create menu (protected route)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json(menu);
  } catch (error) {
    console.error('Menu creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update menu (protected route)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModified: new Date() },
      { new: true }
    );
    res.json(menu);
  } catch (error) {
    console.error('Menu update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete menu (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Menu.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Menu deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;