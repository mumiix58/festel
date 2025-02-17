import express from 'express';
import Equipment from '../models/Equipment.js';
import Activity from '../models/Activity.js';
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
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching equipment categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    console.log('Fetching category by slug:', req.params.slug);
    const category = await Equipment.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    }).select('-__v');
    
    if (!category) {
      console.log('Category not found:', req.params.slug);
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log('Category found:', category.name);
    res.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
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

    // Log activity
    await Activity.create({
      type: 'equipment_update',
      description: `New category created: ${category.name}`,
      userId: req.user._id,
      metadata: { categoryId: category.id }
    });

    console.log('Category created:', category);
    res.status(201).json({ 
      success: true,
      category 
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ 
      success: false,
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
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    // Log activity
    await Activity.create({
      type: 'equipment_update',
      description: `Category updated: ${category.name}`,
      userId: req.user._id,
      metadata: { categoryId: category.id }
    });

    console.log('Category updated:', category);
    res.json({ 
      success: true,
      category 
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Delete category (protected route)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Deleting category:', req.params.id);
    const category = await Equipment.findOneAndDelete({ id: req.params.id });
    
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    // Log activity
    await Activity.create({
      type: 'equipment_update',
      description: `Category deleted: ${category.name}`,
      userId: req.user._id,
      metadata: { categoryId: category.id }
    });

    console.log('Category deleted');
    res.json({ 
      success: true,
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Add item to category (protected route)
router.post('/:categoryId/items', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Adding item to category:', req.params.categoryId);
    const category = await Equipment.findOne({ id: req.params.categoryId });
    
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    const newItem = {
      ...req.body,
      id: `item-${uuidv4()}`,
      order: category.items.length,
      isActive: true
    };

    category.items.push(newItem);
    await category.save();

    // Log activity
    await Activity.create({
      type: 'equipment_update',
      description: `New item added to ${category.name}: ${newItem.title}`,
      userId: req.user._id,
      metadata: { categoryId: category.id, itemId: newItem.id }
    });

    console.log('Item added:', newItem);
    res.status(201).json({ 
      success: true,
      category 
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Update item (protected route)
router.put('/:categoryId/items/:itemId', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Updating item:', req.params.itemId);
    const category = await Equipment.findOne({ id: req.params.categoryId });
    
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    const itemIndex = category.items.findIndex(item => item.id === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found' 
      });
    }

    const oldTitle = category.items[itemIndex].title;
    category.items[itemIndex] = {
      ...category.items[itemIndex],
      ...req.body
    };

    await category.save();

    // Log activity
    await Activity.create({
      type: 'equipment_update',
      description: `Item updated in ${category.name}: ${oldTitle} → ${category.items[itemIndex].title}`,
      userId: req.user._id,
      metadata: { categoryId: category.id, itemId: req.params.itemId }
    });

    console.log('Item updated');
    res.json({ 
      success: true,
      category 
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Delete item (protected route)
router.delete('/:categoryId/items/:itemId', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Deleting item:', req.params.itemId);
    const category = await Equipment.findOne({ id: req.params.categoryId });
    
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    const itemToDelete = category.items.find(item => item.id === req.params.itemId);
    if (!itemToDelete) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found' 
      });
    }

    category.items = category.items.filter(item => item.id !== req.params.itemId);
    await category.save();
    
    // Log activity
    await Activity.create({
      type: 'equipment_update',
      description: `Item deleted from ${category.name}: ${itemToDelete.title}`,
      userId: req.user._id,
      metadata: { categoryId: category.id, itemId: req.params.itemId }
    });

    console.log('Item deleted');
    res.json({ 
      success: true,
      message: 'Item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

export default router;