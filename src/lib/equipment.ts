import { v4 as uuidv4 } from 'uuid';
import { EquipmentCategory, EquipmentItem } from '@/types';

// Store key for categories
const CATEGORIES_STORAGE_KEY = 'equipmentCategories';

// Default categories with items
const defaultCategories: EquipmentCategory[] = [
  {
    id: uuidv4(),
    name: 'Equipment',
    slug: 'equipment',
    description: 'Professionelle Ausstattung für Ihre Veranstaltung',
    items: [
      {
        id: uuidv4(),
        title: 'Geschirr & Besteck',
        description: 'Hochwertiges Porzellan und edles Besteck für jeden Anlass',
        image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800',
        order: 0,
        isActive: true
      },
      {
        id: uuidv4(),
        title: 'Gläser',
        description: 'Verschiedene Gläserserien für Wein, Champagner und Cocktails',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
        order: 1,
        isActive: true
      }
    ],
    order: 0,
    isActive: true
  },
  {
    id: uuidv4(),
    name: 'Tischwäsche',
    slug: 'tischwasche',
    description: 'Hochwertige Tischwäsche für Ihre Veranstaltung',
    items: [
      {
        id: uuidv4(),
        title: 'Tischdecken',
        description: 'Hochwertige Tischdecken in verschiedenen Größen und Farben',
        image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800',
        order: 0,
        isActive: true
      },
      {
        id: uuidv4(),
        title: 'Servietten',
        description: 'Stoffservietten passend zu Ihrer Veranstaltung',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
        order: 1,
        isActive: true
      }
    ],
    order: 1,
    isActive: true
  }
];

// Initialize categories in localStorage
export function initializeEquipmentCategories() {
  try {
    const existingCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!existingCategories) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
      // Trigger storage event for navigation update
      window.dispatchEvent(new Event('equipmentCategoriesUpdated'));
    }
  } catch (error) {
    console.error('Error initializing equipment categories:', error);
  }
}

// Get all categories
export async function getAllCategories(): Promise<EquipmentCategory[]> {
  try {
    const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!categoriesJson) {
      // Initialize with default categories if none exist
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    return JSON.parse(categoriesJson);
  } catch (error) {
    console.error('Error loading categories:', error);
    return defaultCategories;
  }
}

// Get categories for navigation
export function getNavigationCategories(): EquipmentCategory[] {
  try {
    const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const categories = categoriesJson ? JSON.parse(categoriesJson) : defaultCategories;
    return categories.filter(cat => cat.isActive);
  } catch (error) {
    console.error('Error loading navigation categories:', error);
    return [];
  }
}

// Add new category
export async function addCategory(category: Omit<EquipmentCategory, 'id' | 'items' | 'order'>): Promise<EquipmentCategory> {
  try {
    const categories = await getAllCategories();
    const newCategory: EquipmentCategory = {
      ...category,
      id: uuidv4(),
      items: [],
      order: categories.length
    };
    
    categories.push(newCategory);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    
    // Trigger storage event for navigation update
    window.dispatchEvent(new Event('equipmentCategoriesUpdated'));
    
    return newCategory;
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error('Failed to add category');
  }
}

// Update category
export async function updateCategory(categoryId: string, updates: Partial<EquipmentCategory>): Promise<void> {
  try {
    const categories = await getAllCategories();
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    );
    
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
    
    // Trigger storage event for navigation update
    window.dispatchEvent(new Event('equipmentCategoriesUpdated'));
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
}

// Delete category
export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const categories = await getAllCategories();
    const updatedCategories = categories
      .filter(cat => cat.id !== categoryId)
      .map((cat, index) => ({ ...cat, order: index }));
    
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
    
    // Trigger storage event for navigation update
    window.dispatchEvent(new Event('equipmentCategoriesUpdated'));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
}

// Add item to category
export async function addItem(categoryId: string, item: Omit<EquipmentItem, 'id' | 'order'>): Promise<void> {
  try {
    const categories = await getAllCategories();
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const newItem: EquipmentItem = {
          ...item,
          id: uuidv4(),
          order: cat.items.length
        };
        return {
          ...cat,
          items: [...cat.items, newItem]
        };
      }
      return cat;
    });
    
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
    
    // Trigger storage event for navigation update
    window.dispatchEvent(new Event('equipmentCategoriesUpdated'));
  } catch (error) {
    console.error('Error adding item:', error);
    throw new Error('Failed to add item');
  }
}

// Update item
export async function updateItem(categoryId: string, itemId: string, updates: Partial<EquipmentItem>): Promise<void> {
  try {
    const categories = await getAllCategories();
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const updatedItems = cat.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        );
        return { ...cat, items: updatedItems };
      }
      return cat;
    });
    
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
  } catch (error) {
    console.error('Error updating item:', error);
    throw new Error('Failed to update item');
  }
}

// Delete item
export async function deleteItem(categoryId: string, itemId: string): Promise<void> {
  try {
    const categories = await getAllCategories();
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const updatedItems = cat.items
          .filter(item => item.id !== itemId)
          .map((item, index) => ({ ...item, order: index }));
        return { ...cat, items: updatedItems };
      }
      return cat;
    });
    
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
  } catch (error) {
    console.error('Error deleting item:', error);
    throw new Error('Failed to delete item');
  }
}

// Update item image
export async function updateItemImage(categoryId: string, itemId: string, file: File): Promise<void> {
  try {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = reader.result as string;
      await updateItem(categoryId, itemId, { image: imageUrl });
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error updating item image:', error);
    throw new Error('Failed to update item image');
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