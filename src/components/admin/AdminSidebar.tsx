import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Settings,
  LogOut,
  Star,
  FileText,
  SlidersHorizontal,
  Layout,
  FileQuestion,
  BookOpen,
  ScrollText,
  Shield,
  Scale,
  Package,
  Utensils,
  TableProperties,
  Home
} from 'lucide-react';
import storage from '@/lib/storage';
import { useEffect, useState } from 'react';
import { getNavigationCategories } from '@/lib/equipment';
import { EquipmentCategory } from '@/types';

export function AdminSidebar() {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Load categories for navigation
    const loadCategories = async () => {
      const navCategories = await getNavigationCategories();
      setCategories(navCategories);
    };

    loadCategories();

    // Listen for category updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'equipmentCategories') {
        loadCategories();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('equipmentCategoriesUpdated', loadCategories);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('equipmentCategoriesUpdated', loadCategories);
    };
  }, []);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'home', name: 'Startseite', href: '/admin/home', icon: Home },
    { id: 'slider', name: 'Slider', href: '/admin/slider', icon: SlidersHorizontal },
    { id: 'gallery', name: 'Galerie', href: '/admin/gallery', icon: Image },
    { id: 'about', name: 'Über Uns', href: '/admin/about', icon: FileText },
    { id: 'services', name: 'Dienstleistungen', href: '/admin/services', icon: FileText },
    { 
      id: 'catering-and-more',
      name: 'Catering AND MORE',
      href: '/admin/catering-and-more',
      icon: Package,
      subItems: [
        {
          id: 'equipment',
          name: 'Equipment',
          href: '/admin/equipment',
          icon: Utensils
        },
        {
          id: 'tischwasche',
          name: 'Tischwäsche',
          href: '/admin/tischwasche',
          icon: TableProperties
        }
      ]
    },
    { id: 'faq', name: 'SSS', href: '/admin/faq', icon: FileQuestion },
    { id: 'references', name: 'Referenzen', href: '/admin/references', icon: Star },
    { id: 'footer', name: 'Footer', href: '/admin/footer', icon: Layout },
    { 
      id: 'legal',
      name: 'Rechtliche Seiten',
      href: '/admin/legal',
      icon: BookOpen,
      subItems: [
        { id: 'impressum', name: 'Impressum', href: '/admin/legal/impressum', icon: ScrollText },
        { id: 'datenschutz', name: 'Datenschutz', href: '/admin/legal/datenschutz', icon: Shield },
        { id: 'agb', name: 'AGB', href: '/admin/legal/agb', icon: Scale }
      ]
    },
    { id: 'settings', name: 'Einstellungen', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    storage.logoutUser();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-white shadow-lg">
      <div className="flex h-16 items-center justify-center border-b">
        <Link to="/admin" className="font-display text-xl font-bold">
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
            (item.subItems && item.subItems.some(subItem => location.pathname === subItem.href));

          return (
            <div key={item.id}>
              <Link
                to={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-gray-600 hover:bg-accent/10'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
              
              {item.subItems && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    return (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        className={`flex items-center rounded-md px-2 py-1.5 text-sm ${
                          location.pathname === subItem.href
                            ? 'bg-accent/20 text-accent'
                            : 'text-gray-500 hover:bg-accent/10'
                        }`}
                      >
                        <SubIcon className="mr-2 h-4 w-4" />
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-accent/10"
        >
          <LogOut className="mr-3 h-5 w-4" />
          Abmelden
        </button>
      </div>
    </div>
  );
}