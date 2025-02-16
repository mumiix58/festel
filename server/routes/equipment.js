import express from 'express';
import Equipment from '../models/Equipment.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    console.log('Fetching equipment categories...');
    const categories = await Equipment.find()
      .sort('order')
      .select('-__v');
    console.log(`Found ${categories.length} categories`);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching equipment categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category (protected route)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Creating new category:', req.body);
    
    // Generate unique ID and slug
    const categoryId = `category-${uuidv4()}`;
    const timestamp = Date.now();
    const slug = req.body.slug || `kategorie-${timestamp}`;

    const category = await Equipment.create({
      ...req.body,
      id: categoryId,
      slug,
      items: [],
      order: 0,
      isActive: true
    });

    console.log('Category created:', category);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ 
      message: 'Failed to create category',
      error: error.message 
    });
  }
});

// Update category (protected route)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Updating category:', req.params.id);
    const category = await Equipment.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log('Category updated:', category);
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Deleting category:', req.params.id);
    const category = await Equipment.findOneAndDelete({ id: req.params.id });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log('Category deleted');
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to category (protected route)
router.post('/:categoryId/items', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Adding item to category:', req.params.categoryId);
    const category = await Equipment.findOne({ id: req.params.categoryId });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const newItem = {
      ...req.body,
      id: `item-${uuidv4()}`,
      order: category.items.length,
      isActive: true
    };

    category.items.push(newItem);
    await category.save();

    console.log('Item added:', newItem);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item (protected route)
router.put('/:categoryId/items/:itemId', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Updating item:', req.params.itemId);
    const category = await Equipment.findOne({ id: req.params.categoryId });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const itemIndex = category.items.findIndex(item => item.id === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    category.items[itemIndex] = {
      ...category.items[itemIndex],
      ...req.body
    };

    await category.save();
    console.log('Item updated');
    res.json(category);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item (protected route)
router.delete('/:categoryId/items/:itemId', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Deleting item:', req.params.itemId);
    const category = await Equipment.findOne({ id: req.params.categoryId });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.items = category.items.filter(item => item.id !== req.params.itemId);
    await category.save();
    
    console.log('Item deleted');
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;