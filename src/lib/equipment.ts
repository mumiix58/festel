import { EquipmentCategory, EquipmentItem } from '@/types';
import api from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

// Get all categories with fallback
export async function getAllCategories(): Promise<EquipmentCategory[]> {
  try {
    console.log('Fetching all equipment categories...');
    const response = await api.get('/equipment');
    console.log('Categories response:', response);
    
    if (response && Array.isArray(response)) {
      return response;
    }
    console.log('No categories found, returning empty array');
    return [];
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

// Get categories for navigation
export async function getNavigationCategories(): Promise<EquipmentCategory[]> {
  try {
    const categories = await getAllCategories();
    return categories.filter(cat => cat.isActive);
  } catch (error) {
    console.error('Error loading navigation categories:', error);
    return [];
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<EquipmentCategory | null> {
  try {
    const response = await api.get(`/equipment/slug/${slug}`);
    return response || null;
  } catch (error) {
    console.error('Error getting category by slug:', error);
    return null;
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
    const response = await api.post('/equipment', newCategory);
    
    if (!response) {
      throw new Error('Failed to add category');
    }

    return response;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}

// Update category
export async function updateCategory(categoryId: string, updates: Partial<EquipmentCategory>): Promise<void> {
  try {
    console.log('Updating category:', categoryId, updates);
    const response = await api.put(`/equipment/${categoryId}`, updates);
    
    if (!response) {
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
    const response = await api.delete(`/equipment/${categoryId}`);
    
    if (!response) {
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
    const response = await api.post(`/equipment/${categoryId}/items`, newItem);
    
    if (!response) {
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
    const response = await api.put(`/equipment/${categoryId}/items/${itemId}`, updates);
    
    if (!response) {
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
    const response = await api.delete(`/equipment/${categoryId}/items/${itemId}`);
    
    if (!response) {
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