import { EquipmentCategory, EquipmentItem } from '@/types';
import api from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

// Get all categories with fallback
export async function getAllCategories(): Promise<EquipmentCategory[]> {
  try {
    // Get from content API
    const response = await api.get('/content/equipment');
    if (response?.content?.categories) {
      return response.content.categories;
    }
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
    const categories = await getAllCategories();
    return categories.find(cat => cat.slug === slug) || null;
  } catch (error) {
    console.error('Error getting category by slug:', error);
    return null;
  }
}

// Add new category
export async function addCategory(category: Omit<EquipmentCategory, 'id' | 'items' | 'order'>): Promise<EquipmentCategory> {
  try {
    const categories = await getAllCategories();
    
    const newCategory: EquipmentCategory = {
      ...category,
      id: `category-${uuidv4()}`,
      items: [],
      order: categories.length
    };

    const updatedCategories = [...categories, newCategory];
    
    const response = await api.put('/content/equipment', {
      categories: updatedCategories
    });

    if (!response) {
      throw new Error('Failed to add category');
    }

    return newCategory;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}

// Update category
export async function updateCategory(categoryId: string, updates: Partial<EquipmentCategory>): Promise<void> {
  try {
    const categories = await getAllCategories();
    const updatedCategories = categories.map(category =>
      category.id === categoryId ? { ...category, ...updates } : category
    );

    const response = await api.put('/content/equipment', {
      categories: updatedCategories
    });

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
    const categories = await getAllCategories();
    const updatedCategories = categories
      .filter(category => category.id !== categoryId)
      .map((category, index) => ({ ...category, order: index }));

    const response = await api.put('/content/equipment', {
      categories: updatedCategories
    });

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
    const categories = await getAllCategories();
    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const newItem: EquipmentItem = {
      ...item,
      id: `item-${uuidv4()}`,
      order: category.items.length
    };

    const updatedCategories = categories.map(c =>
      c.id === categoryId
        ? { ...c, items: [...c.items, newItem] }
        : c
    );

    const response = await api.put('/content/equipment', {
      categories: updatedCategories
    });

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
    const categories = await getAllCategories();
    const updatedCategories = categories.map(category =>
      category.id === categoryId
        ? {
            ...category,
            items: category.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : category
    );

    const response = await api.put('/content/equipment', {
      categories: updatedCategories
    });

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
    const categories = await getAllCategories();
    const updatedCategories = categories.map(category =>
      category.id === categoryId
        ? {
            ...category,
            items: category.items
              .filter(item => item.id !== itemId)
              .map((item, index) => ({ ...item, order: index }))
          }
        : category
    );

    const response = await api.put('/content/equipment', {
      categories: updatedCategories
    });

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