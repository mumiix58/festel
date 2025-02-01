import express from 'express';
import Booking from '../models/Booking.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all bookings (protected route)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (protected route)
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    console.error('Booking status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete booking (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Booking deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;