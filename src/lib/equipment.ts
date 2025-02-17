import { EquipmentCategory, EquipmentItem } from '@/types';
import api from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

// Default categories with items
const defaultCategories: EquipmentCategory[] = [
  {
    id: 'equipment',
    name: 'Equipment',
    slug: 'equipment',
    description: 'Professionelle Ausstattung für Ihre Veranstaltung',
    items: [
      {
        id: 'geschirr',
        title: 'Geschirr & Besteck',
        description: 'Hochwertiges Porzellan und edles Besteck für jeden Anlass',
        image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800',
        order: 0,
        isActive: true
      },
      {
        id: 'glaeser',
        title: 'Gläser',
        description: 'Verschiedene Gläserserien für Wein, Champagner und Cocktails',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
        order: 1,
        isActive: true
      }
    ],
    order: 0,
    isActive: true
  }
];

// Get all categories with fallback
export async function getAllCategories(): Promise<EquipmentCategory[]> {
  try {
    console.log('Fetching all equipment categories...');
    const response = await api.get('/content/equipment');
    
    if (response?.categories && Array.isArray(response.categories)) {
      console.log(`Found ${response.categories.length} categories`);
      return response.categories;
    }
    
    console.log('No categories found, returning defaults');
    return defaultCategories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return defaultCategories;
  }
}

// Get categories for navigation
export async function getNavigationCategories(): Promise<EquipmentCategory[]> {
  try {
    const categories = await getAllCategories();
    return categories.filter(cat => cat.isActive);
  } catch (error) {
    console.error('Error loading navigation categories:', error);
    return defaultCategories.filter(cat => cat.isActive);
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<EquipmentCategory | null> {
  try {
    console.log('Fetching category by slug:', slug);
    const response = await api.get(`/content/equipment/${slug}`);
    
    if (response?.category) {
      console.log('Category found:', response.category.name);
      return response.category;
    }
    
    // Try to find in default categories
    const defaultCategory = defaultCategories.find(cat => cat.slug === slug);
    if (defaultCategory) {
      console.log('Found category in defaults:', defaultCategory.name);
      return defaultCategory;
    }
    
    console.log('Category not found');
    return null;
  } catch (error) {
    console.error('Error getting category by slug:', error);
    // Try to find in default categories as fallback
    const defaultCategory = defaultCategories.find(cat => cat.slug === slug);
    return defaultCategory || null;
  }
}

// Add new category
export async function addCategory(category: Omit<EquipmentCategory, 'id' | 'items' | 'order'>): Promise<EquipmentCategory> {
  try {
    const newCategory = {
      ...category,
      id: `category-${uuidv4()}`,
      items: [],
      order: 0,
      isActive: true
    };

    console.log('Adding new category:', newCategory);
    const response = await api.post('/content/equipment', newCategory);
    
    if (!response?.category) {
      throw new Error('Failed to add category');
    }

    return response.category;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}

// Update category
export async function updateCategory(categoryId: string, updates: Partial<EquipmentCategory>): Promise<void> {
  try {
    console.log('Updating category:', categoryId, updates);
    const response = await api.put(`/content/equipment/${categoryId}`, updates);
    
    if (!response?.success) {
      throw new Error('Failed to update category');
    }
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

// Delete category
export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    console.log('Deleting category:', categoryId);
    const response = await api.delete(`/content/equipment/${categoryId}`);
    
    if (!response?.success) {
      throw new Error('Failed to delete category');
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Add item to category
export async function addItem(categoryId: string, item: Omit<EquipmentItem, 'id' | 'order'>): Promise<void> {
  try {
    const newItem = {
      ...item,
      id: `item-${uuidv4()}`
    };

    console.log('Adding item to category:', categoryId, newItem);
    const response = await api.post(`/content/equipment/${categoryId}/items`, newItem);
    
    if (!response?.success) {
      throw new Error('Failed to add item');
    }
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
}

// Update item
export async function updateItem(categoryId: string, itemId: string, updates: Partial<EquipmentItem>): Promise<void> {
  try {
    console.log('Updating item:', categoryId, itemId, updates);
    const response = await api.put(`/content/equipment/${categoryId}/items/${itemId}`, updates);
    
    if (!response?.success) {
      throw new Error('Failed to update item');
    }
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

// Delete item
export async function deleteItem(categoryId: string, itemId: string): Promise<void> {
  try {
    console.log('Deleting item:', categoryId, itemId);
    const response = await api.delete(`/content/equipment/${categoryId}/items/${itemId}`);
    
    if (!response?.success) {
      throw new Error('Failed to delete item');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

// Update item image
export async function updateItemImage(categoryId: string, itemId: string, file: File): Promise<void> {
  try {
    const reader = new FileReader();
    const imageUrl = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    await updateItem(categoryId, itemId, { image: imageUrl });
  } catch (error) {
    console.error('Error updating item image:', error);
    throw error;
  }
}