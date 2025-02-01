import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface Menu {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

export function Menu() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [editingMenu, setEditingMenu] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const handleAddMenu = () => {
    const newMenu: Menu = {
      id: Date.now().toString(),
      name: 'Neues Menü',
      description: '',
      items: [],
    };
    setMenus([...menus, newMenu]);
    setEditingMenu(newMenu.id);
  };

  const handleAddMenuItem = (menuId: string) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: 'Neues Gericht',
      description: '',
      price: 0,
      category: '',
    };
    setMenus(
      menus.map((menu) =>
        menu.id === menuId
          ? { ...menu, items: [...menu.items, newItem] }
          : menu
      )
    );
    setEditingItem(newItem.id);
  };

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Menüs verwalten</h1>
          <button
            onClick={handleAddMenu}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white hover:bg-accent-dark"
          >
            <Plus className="h-4 w-4" />
            Menü hinzufügen
          </button>
        </div>

        <div className="mt-8 space-y-8">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="rounded-lg bg-white p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                {editingMenu === menu.id ? (
                  <div className="flex-1 space-y-4">
                    <input
                      type="text"
                      value={menu.name}
                      onChange={(e) =>
                        setMenus(
                          menus.map((m) =>
                            m.id === menu.id
                              ? { ...m, name: e.target.value }
                              : m
                          )
                        )
                      }
                      className="block w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Menüname"
                    />
                    <textarea
                      value={menu.description}
                      onChange={(e) =>
                        setMenus(
                          menus.map((m) =>
                            m.id === menu.id
                              ? { ...m, description: e.target.value }
                              : m
                          )
                        )
                      }
                      className="block w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Beschreibung"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingMenu(null)}
                        className="rounded-md bg-accent p-2 text-white hover:bg-accent-dark"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingMenu(null)}
                        className="rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="font-display text-xl font-semibold">
                        {menu.name}
                      </h2>
                      <p className="mt-1 text-gray-600">{menu.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingMenu(menu.id)}
                        className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          setMenus(menus.filter((m) => m.id !== menu.id))
                        }
                        className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">
                    Gerichte
                  </h3>
                  <button
                    onClick={() => handleAddMenuItem(menu.id)}
                    className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    <Plus className="h-4 w-4" />
                    Gericht hinzufügen
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {menu.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg bg-gray-50 p-4"
                    >
                      {editingItem === item.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              setMenus(
                                menus.map((m) =>
                                  m.id === menu.id
                                    ? {
                                        ...m,
                                        items: m.items.map((i) =>
                                          i.id === item.id
                                            ? { ...i, name: e.target.value }
                                            : i
                                        ),
                                      }
                                    : m
                                )
                              )
                            }
                            className="block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="Gerichtname"
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              setMenus(
                                menus.map((m) =>
                                  m.id === menu.id
                                    ? {
                                        ...m,
                                        items: m.items.map((i) =>
                                          i.id === item.id
                                            ? {
                                                ...i,
                                                description: e.target.value,
                                              }
                                            : i
                                        ),
                                      }
                                    : m
                                )
                              )
                            }
                            className="block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="Beschreibung"
                          />
                          <div className="flex gap-4">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                setMenus(
                                  menus.map((m) =>
                                    m.id === menu.id
                                      ? {
                                          ...m,
                                          items: m.items.map((i) =>
                                            i.id === item.id
                                              ? {
                                                  ...i,
                                                  price: parseFloat(e.target.value),
                                                }
                                              : i
                                          ),
                                        }
                                      : m
                                  )
                                )
                              }
                              className="block w-full rounded-md border border-gray-300 px-3 py-2"
                              placeholder="Preis"
                            />
                            <input
                              type="text"
                              value={item.category}
                              onChange={(e) =>
                                setMenus(
                                  menus.map((m) =>
                                    m.id === menu.id
                                      ? {
                                          ...m,
                                          items: m.items.map((i) =>
                                            i.id === item.id
                                              ? {
                                                  ...i,
                                                  category: e.target.value,
                                                }
                                              : i
                                          ),
                                        }
                                      : m
                                  )
                                )
                              }
                              className="block w-full rounded-md border border-gray-300 px-3 py-2"
                              placeholder="Kategorie"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingItem(null)}
                              className="rounded-md bg-accent p-2 text-white hover:bg-accent-dark"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="mt-1 text-sm text-gray-600">
                              {item.description}
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-sm">
                              <span className="font-medium text-accent">
                                €{item.price.toFixed(2)}
                              </span>
                              <span className="text-gray-500">
                                {item.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingItem(item.id)}
                              className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setMenus(
                                  menus.map((m) =>
                                    m.id === menu.id
                                      ? {
                                          ...m,
                                          items: m.items.filter(
                                            (i) => i.id !== item.id
                                          ),
                                        }
                                      : m
                                  )
                                )
                              }
                              className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
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