import express from 'express';
import Service from '../models/Service.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort('order');
    res.json(services);
  } catch (error) {
    console.error('Services fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service (protected route)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    console.error('Service creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service (protected route)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(service);
  } catch (error) {
    console.error('Service update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Service deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;