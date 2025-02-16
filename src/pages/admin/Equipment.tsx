import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { EquipmentCategory, EquipmentItem } from '@/types';
import { getAllCategories, addCategory, updateCategory, addItem, deleteItem, updateItemImage, deleteCategory } from '@/lib/equipment';

export function Equipment() {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const loadedCategories = await getAllCategories();
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Laden der Kategorien'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const newCategory = await addCategory({
        name: 'Neue Kategorie',
        slug: `neue-kategorie-${Date.now()}`,
        description: 'Beschreibung der Kategorie',
        isActive: true
      });

      await loadCategories();
      
      // Dispatch event to update navigation
      window.dispatchEvent(new Event('equipmentCategoriesUpdated'));

      setSaveMessage({
        type: 'success',
        text: 'Kategorie erfolgreich hinzugefügt'
      });
    } catch (error) {
      console.error('Error adding category:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Hinzufügen der Kategorie'
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Möchten Sie diese Kategorie wirklich löschen?')) {
      try {
        await deleteCategory(categoryId);
        await loadCategories();
        
        // Dispatch event to update navigation
        window.dispatchEvent(new Event('equipmentCategoriesUpdated'));

        setSaveMessage({
          type: 'success',
          text: 'Kategorie erfolgreich gelöscht'
        });
      } catch (error) {
        console.error('Error deleting category:', error);
        setSaveMessage({
          type: 'error',
          text: 'Fehler beim Löschen der Kategorie'
        });
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      // Save each category
      for (const category of categories) {
        await updateCategory(category.id, category);
      }
      
      // Dispatch event to update navigation
      window.dispatchEvent(new Event('equipmentCategoriesUpdated'));
      
      setSaveMessage({
        type: 'success',
        text: 'Änderungen erfolgreich gespeichert'
      });
    } catch (error) {
      console.error('Error saving categories:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Speichern der Änderungen'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async (categoryId: string) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return;

      const newItem: Omit<EquipmentItem, 'id' | 'order'> = {
        title: 'Neues Item',
        description: 'Beschreibung des Items',
        image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800',
        isActive: true
      };

      await addItem(categoryId, newItem);
      await loadCategories();
      
      setSaveMessage({
        type: 'success',
        text: 'Item erfolgreich hinzugefügt'
      });
    } catch (error) {
      console.error('Error adding item:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Hinzufügen des Items'
      });
    }
  };

  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    if (window.confirm('Möchten Sie diesen Artikel wirklich löschen?')) {
      try {
        await deleteItem(categoryId, itemId);
        await loadCategories();
        setSaveMessage({
          type: 'success',
          text: 'Artikel erfolgreich gelöscht'
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        setSaveMessage({
          type: 'error',
          text: 'Fehler beim Löschen des Artikels'
        });
      }
    }
  };

  const handleImageUpload = async (categoryId: string, itemId: string, file: File) => {
    try {
      await updateItemImage(categoryId, itemId, file);
      await loadCategories();
      setSaveMessage({
        type: 'success',
        text: 'Bild erfolgreich aktualisiert'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Hochladen des Bildes'
      });
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center">Laden...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Equipment verwalten</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark"
            >
              <Plus className="h-4 w-4" />
              Kategorie hinzufügen
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
            </button>
          </div>
        </div>

        {saveMessage && (
          <div
            className={`mt-4 rounded-lg p-4 ${
              saveMessage.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <div className="mt-8 space-y-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg bg-white p-6 shadow-lg"
            >
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Kategorie Name
                    </label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => {
                        const updatedCategories = categories.map(c =>
                          c.id === category.id ? { ...c, name: e.target.value } : c
                        );
                        setCategories(updatedCategories);
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="ml-4 rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={category.slug}
                    onChange={(e) => {
                      const updatedCategories = categories.map(c =>
                        c.id === category.id ? { ...c, slug: e.target.value } : c
                      );
                      setCategories(updatedCategories);
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Beschreibung
                  </label>
                  <textarea
                    value={category.description}
                    onChange={(e) => {
                      const updatedCategories = categories.map(c =>
                        c.id === category.id ? { ...c, description: e.target.value } : c
                      );
                      setCategories(updatedCategories);
                    }}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={category.isActive}
                      onChange={(e) => {
                        const updatedCategories = categories.map(c =>
                          c.id === category.id ? { ...c, isActive: e.target.checked } : c
                        );
                        setCategories(updatedCategories);
                      }}
                      className="rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Aktiv
                    </span>
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">Items</h3>
                  <button
                    onClick={() => handleAddItem(category.id)}
                    className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent-dark"
                  >
                    <Plus className="h-4 w-4" />
                    Item hinzufügen
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.items
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="relative rounded-lg border border-gray-200 p-4"
                      >
                        <div className="aspect-[4/3] overflow-hidden rounded-lg">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-4 right-4 flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteItem(category.id, item.id)}
                              className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-red-600"
                            >
                              Entfernen
                            </button>
                            <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg hover:bg-gray-50">
                              <Upload className="h-4 w-4" />
                              <span>Bild ändern</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(category.id, item.id, file);
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="mt-4 space-y-4">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updatedCategories = categories.map(c => {
                                if (c.id === category.id) {
                                  const updatedItems = c.items.map(i =>
                                    i.id === item.id ? { ...i, title: e.target.value } : i
                                  );
                                  return { ...c, items: updatedItems };
                                }
                                return c;
                              });
                              setCategories(updatedCategories);
                            }}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                            placeholder="Titel"
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const updatedCategories = categories.map(c => {
                                if (c.id === category.id) {
                                  const updatedItems = c.items.map(i =>
                                    i.id === item.id ? { ...i, description: e.target.value } : i
                                  );
                                  return { ...c, items: updatedItems };
                                }
                                return c;
                              });
                              setCategories(updatedCategories);
                            }}
                            rows={3}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                            placeholder="Beschreibung"
                          />
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.isActive}
                              onChange={(e) => {
                                const updatedCategories = categories.map(c => {
                                  if (c.id === category.id) {
                                    const updatedItems = c.items.map(i =>
                                      i.id === item.id ? { ...i, isActive: e.target.checked } : i
                                    );
                                    return { ...c, items: updatedItems };
                                  }
                                  return c;
                                });
                                setCategories(updatedCategories);
                              }}
                              className="rounded border-gray-300 text-accent focus:ring-accent"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Aktiv
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}